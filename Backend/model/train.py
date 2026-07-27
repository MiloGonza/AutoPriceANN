import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader
import pandas
import numpy
import math
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import os
import json
import time


# Columnas que debe tener el CSV para poder entrenar de lo contrario error
REQUIRED_COLUMNS = {"Año", "Kilometraje", "Marca",
                    "Modelo", "Ha_tenido_accidentes", "Precio_venta"}

# Seracion de las columnas para procesar los datos no numericos a numericos
NUMERIC_FEATURES = ["Año", "Kilometraje", "Ha_tenido_accidentes"]
CATEGORICAL_FEATURES = ["Marca", "Modelo"]

# Variable objetivo o lo que la red va a predecir
TARGET = "Precio_venta"


def loadAndPreprocess(csvPath: str, testSize: float = 0.2, randomState: int = 42):
    """
    Lee el CSV y prepara los datos para la red.

    Returns:
        dict con:
            - trainDataset: datos de entrenamiento como tensores
            - testDataset: datos de prueba como tensores
            - featureNames: nombres de las columnas después de procesar
            - preprocessor: el procesador ajustado (para usar después)
            - nFeatures: cuántas columnas de entrada tiene
            - stats: resumen del dataset
    """
    if not os.path.exists(csvPath):
        raise FileNotFoundError(f"CSV no encontrado: {csvPath}")

    myCsv = pandas.read_csv(csvPath)

    # Verificar que tenga las columnas necesarias
    missing = REQUIRED_COLUMNS - set(myCsv.columns)
    if missing:
        raise ValueError(f"Faltan columnas requeridas: {missing}")

    # Quitar filas con columnas vacias para evitar problemas al entrenar
    # myCsv = myCsv.dropna(subset=[TARGET])
    myCsv = myCsv.dropna(subset=REQUIRED_COLUMNS)

    # Separar entradas y salida
    xNum = myCsv[NUMERIC_FEATURES].values.astype(numpy.float32)
    xCat = myCsv[CATEGORICAL_FEATURES].values.astype(str)
    y = myCsv[TARGET].values.astype(numpy.float32)

    # Procesar entradas: números se escalan para que no haya sesgo exagerado, categorías se convierten en columnas de 0 y 1 para poder procesarlas pues son texto
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), list(range(len(NUMERIC_FEATURES)))),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False, max_categories=20),
             list(range(len(NUMERIC_FEATURES), len(NUMERIC_FEATURES) + len(CATEGORICAL_FEATURES)))),
        ]
    )

    targetScaler = StandardScaler()


# Terminar de definir entradas y salidas (se escala la salida para evitar problemas por precios del tipo 195.356.895 my grandes)
    x = numpy.hstack([xNum, xCat])
    xProcessed = preprocessor.fit_transform(x)
    y = targetScaler.fit_transform(
        myCsv[[TARGET]]
    ).astype(numpy.float32)

    # pedir explicar
    # Armar los nombres de cada columna resultante
    featureNames = NUMERIC_FEATURES.copy()
    ohe = preprocessor.named_transformers_["cat"]
    catNames = ohe.get_feature_names_out(CATEGORICAL_FEATURES)
    featureNames.extend(catNames)

    # Dividir en entrenamiento y prueba
    xTrain, xTest, yTrain, yTest = train_test_split(
        xProcessed, y, test_size=testSize, random_state=randomState
    )

    # Convertir a tensores con PyTorch
    xTrainT = torch.tensor(xTrain, dtype=torch.float32)
    xTestT = torch.tensor(xTest, dtype=torch.float32)
    yTrainT = torch.tensor(yTrain, dtype=torch.float32)
    yTestT = torch.tensor(yTest, dtype=torch.float32)

    trainDataset = TensorDataset(xTrainT, yTrainT)
    testDataset = TensorDataset(xTestT, yTestT)

    nFeatures = xProcessed.shape[1]

    #Una mousi-herramienta que ayudara mas tarde
    prediccionReal = targetScaler.inverse_transform(y)

    stats = {
        "totalRecords": len(myCsv),
        "trainRecords": len(xTrain),
        "testRecords": len(xTest),
        "nFeatures": nFeatures,
        "featureNames": featureNames,
        "targetMean": float(numpy.mean(y)),
        "targetStandarDeviaton": float(numpy.std(y)),
        "targetMin": float(numpy.min(y)),
        "targetMax": float(numpy.max(y)),
        "featureRanges": {
            "Año": {"min": int(myCsv["Año"].min()), "max": int(myCsv["Año"].max())},
            "Kilometraje": {"min": int(myCsv["Kilometraje"].min()), "max": int(myCsv["Kilometraje"].max())},
        },
    }

    return {
        "trainDataset": trainDataset,
        "testDataset": testDataset,
        "featureNames": featureNames,
        "preprocessor": preprocessor,
        "targetScaler": targetScaler,
        "nFeatures": nFeatures,
        "stats": stats,
    }


def createDataLoaders(processed, batchSize: int = 32):
    """Crea los DataLoaders para pasar datos a la red por lotes."""
    trainLoader = DataLoader(
        processed["trainDataset"], batch_size=batchSize, shuffle=True)
    testLoader = DataLoader(
        processed["testDataset"], batch_size=batchSize, shuffle=False)
    return trainLoader, testLoader


class ModeloPrecio(nn.Module):
    def __init__(self, nFeatures):
        super(ModeloPrecio, self).__init__()
        self.net = nn.Sequential(
            nn.Linear(nFeatures, 64),
            nn.BatchNorm1d(64),
            nn.LeakyReLU(0.1),
            nn.Dropout(0.2),
            nn.Linear(64, 32),
            nn.BatchNorm1d(32),
            nn.LeakyReLU(0.1),
            nn.Dropout(0.2),
            nn.Linear(32, 1),
        )
        self._initWeights()

    def _initWeights(self):
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.kaiming_normal_(m.weight, nonlinearity="leaky_relu", a=0.1)
                nn.init.zeros_(m.bias)

    def forward(self, x):
        return self.net(x)


def trainModelStream(csvPath, epochs, lr, testSize, randomState):
    """
    Generador que entrena el modelo y yields cada época como dict JSON-compatible.
    Protocolo:
      1. {"type": "start", "totalEpochs": N}
      2. {"type": "epoch", "epoch": N, "trainLoss": X, "testLoss": X, "trainAccuracy": X, "testAccuracy": X}
      3. {"type": "done", "stats": {...}, "modelPath": "..."}
    """
    import torch.optim as optim

    processed = loadAndPreprocess(csvPath, testSize=testSize, randomState=randomState)
    trainLoader, testLoader = createDataLoaders(processed, batchSize=32)

    nFeatures = processed["nFeatures"]
    targetScale = processed["targetScaler"].scale_[0]
    model = ModeloPrecio(nFeatures)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=lr, weight_decay=1e-4)

    yield {"type": "start", "totalEpochs": epochs}

    for epoch in range(1, epochs + 1):
        # --- Entrenar ---
        model.train()
        trainLossSum = 0.0
        trainMAESum = 0.0
        trainCount = 0

        for batchX, batchY in trainLoader:
            optimizer.zero_grad()
            predictions = model(batchX)
            loss = criterion(predictions, batchY)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()

            trainLossSum += loss.item() * batchX.size(0)
            trainMAESum += nn.functional.l1_loss(predictions, batchY, reduction="sum").item()
            trainCount += batchX.size(0)

        trainLoss = trainLossSum / trainCount
        trainMAE = trainMAESum / trainCount
        trainRMSE = math.sqrt(trainLoss) * targetScale

        # --- Evaluar con datos de prueba ---
        model.eval()
        testLossSum = 0.0
        testMAESum = 0.0
        testCount = 0

        with torch.no_grad():
            for batchX, batchY in testLoader:
                predictions = model(batchX)
                loss = criterion(predictions, batchY)

                testLossSum += loss.item() * batchX.size(0)
                testMAESum += nn.functional.l1_loss(predictions, batchY, reduction="sum").item()
                testCount += batchX.size(0)

        testLoss = testLossSum / testCount
        testMAE = testMAESum / testCount
        testRMSE = math.sqrt(testLoss) * targetScale

        # --- R² y Exactitud en test set ---
        model.eval()
        allTestX = processed["testDataset"].tensors[0]
        allTestY = processed["testDataset"].tensors[1]
        with torch.no_grad():
            allPreds = model(allTestX)
        testReal = allTestY.numpy().flatten()
        testPred = allPreds.numpy().flatten()
        ssRes = numpy.sum((testReal - testPred) ** 2)
        ssTot = numpy.sum((testReal - numpy.mean(testReal)) ** 2)
        r2 = round(float(1 - ssRes / ssTot), 4) if ssTot > 0 else 0.0
        mape = numpy.mean(numpy.abs((testReal - testPred) / numpy.where(testReal == 0, 1e-8, testReal)))
        exactitud = round(float((1 - mape) * 100), 2)

        yield {
            "type": "epoch",
            "epoch": epoch,
            "trainLoss": round(trainLoss, 4),
            "testLoss": round(testLoss, 4),
            "trainAccuracy": round(trainMAE * targetScale, 2),
            "testAccuracy": round(testMAE * targetScale, 2),
            "trainRMSE": round(trainRMSE, 2),
            "testRMSE": round(testRMSE, 2),
            "r2": r2,
            "exactitud": exactitud,
        }

    # Guardar modelo y preprocessor para predicciones futuras
    modelDir = os.path.dirname(os.path.abspath(__file__))
    modelPath = os.path.join(modelDir, "autoPriceAnnModel.pth")
    torch.save({
        "modelStateDict": model.state_dict(),
        "nFeatures": nFeatures,
        "preprocessor": processed["preprocessor"],
        "targetScaler": processed["targetScaler"],
        "featureNames": processed["featureNames"],
    }, modelPath)

    # Calcular scatter data (predicciones vs reales en test set)
    model.eval()
    scatterData = []
    allTestX = processed["testDataset"].tensors[0]
    allTestY = processed["testDataset"].tensors[1]
    with torch.no_grad():
        allPreds = model(allTestX)
    realVals = processed["targetScaler"].inverse_transform(allTestY.numpy()).flatten()
    predVals = processed["targetScaler"].inverse_transform(allPreds.numpy()).flatten()
    for real, pred in zip(realVals, predVals):
        scatterData.append({"real": round(float(real), 2), "predicted": round(float(pred), 2)})

    yield {
        "type": "done",
        "stats": processed["stats"],
        "modelPath": modelPath,
        "scatterData": scatterData,
    }

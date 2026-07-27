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
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False),
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
    for i, col in enumerate(CATEGORICAL_FEATURES):
        categories = ohe.categories_[i]
        featureNames.extend([f"{col}_{c}" for c in categories])

    # Dividir en entrenamiento y prueba
    xTrain, xTest, yTrain, yTest = train_test_split(
        xProcessed, y, test_size=testSize, random_state=randomState
    )

    # Convertir a tensores con PyTorch
    xTrainT = torch.tensor(xTrain, dtype=torch.float32)
    xTestT = torch.tensor(xTest, dtype=torch.float32)
    yTrainT = torch.tensor(yTrain, dtype=torch.float32).unsqueeze(1)
    yTestT = torch.tensor(yTest, dtype=torch.float32).unsqueeze(1)

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
        # Como puede haber x cantidad de marcas entonces no se pone un valor fijo en los features
        self.fc1 = nn.Linear(nFeatures, 32)
        self.fc2 = nn.Linear(32, 16)
        self.fc3 = nn.Linear(16, 1)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        x = self.relu(x)
        x = self.fc3(x)
        return x


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
    optimizer = optim.Adam(model.parameters(), lr=lr)

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

        yield {
            "type": "epoch",
            "epoch": epoch,
            "trainLoss": round(trainLoss, 4),
            "testLoss": round(testLoss, 4),
            "trainAccuracy": round(trainMAE * targetScale, 2),
            "testAccuracy": round(testMAE * targetScale, 2),
            "trainRMSE": round(trainRMSE, 2),
            "testRMSE": round(testRMSE, 2),
        }

    # Guardar modelo y preprocessor para predicciones futuras
    modelDir = os.path.dirname(os.path.abspath(__file__))
    modelPath = os.path.join(modelDir, "autoPriceAnnModel.pth")
    torch.save({
        "modelStateDict": model.state_dict(),
        "nFeatures": nFeatures,
        "preprocessor": processed["preprocessor"],
        "featureNames": processed["featureNames"],
    }, modelPath)

    yield {
        "type": "done",
        "stats": processed["stats"],
        "modelPath": modelPath,
    }

import torch
from torch.utils.data import TensorDataset, DataLoader
import pandas
import numpy
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import os


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

    # Una mousi-herramienta que ayudara mas tarde
    # prediccionReal = targetScaler.inverse_transform(y)

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

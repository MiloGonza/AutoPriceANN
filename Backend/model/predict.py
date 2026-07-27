import torch
import numpy
import os
import pandas
from train import ModeloPrecio


def loadModel():
    """
    Carga el modelo entrenado y sus componentes desde el .pth.

    Returns:
        dict con model, preprocessor, targetScaler, nFeatures, featureNames
    """
    modelDir = os.path.dirname(os.path.abspath(__file__))
    modelPath = os.path.join(modelDir, "autoPriceAnnModel.pth")

    if not os.path.exists(modelPath):
        raise FileNotFoundError("No se encontró el modelo entrenado. Primero debes entrenar.")

    checkpoint = torch.load(modelPath, weights_only=False)

    model = ModeloPrecio(checkpoint["nFeatures"])
    model.load_state_dict(checkpoint["modelStateDict"])
    model.eval()

    return {
        "model": model,
        "preprocessor": checkpoint["preprocessor"],
        "targetScaler": checkpoint["targetScaler"],
        "nFeatures": checkpoint["nFeatures"],
        "featureNames": checkpoint["featureNames"],
    }


def predictPrice(year, km, accidents, brand, model_name):
    """
    Predice el precio de un carro con las características dadas.

    Args:
        year: año del carro (int)
        km: kilometraje (int)
        accidents: 0 o 1 (ha tenido accidentes)
        brand: marca del carro (str)
        model_name: modelo del carro (str)

    Returns:
        dict con predictedPrice, rangeLow, rangeHigh
    """
    loaded = loadModel()

    xNum = numpy.array([[year, km, accidents]], dtype=numpy.float32)
    xCat = numpy.array([[brand, model_name]], dtype=str)
    x = numpy.hstack([xNum, xCat])

    xProcessed = loaded["preprocessor"].transform(x)
    xTensor = torch.tensor(xProcessed, dtype=torch.float32)

    with torch.no_grad():
        prediction = loaded["model"](xTensor)

    predictedScaled = prediction.numpy()
    predictedReal = loaded["targetScaler"].inverse_transform(predictedScaled).flatten()[0]

    # Rango estimado usando el MAE del último epoch como margen de error
    # Se busca en los stats del modelo si están disponibles
    maeMargin = abs(predictedReal) * 0.15  # 15% de margen como estimación conservadora

    return {
        "predictedPrice": round(float(predictedReal), 2),
        "rangeLow": round(float(predictedReal - maeMargin), 2),
        "rangeHigh": round(float(predictedReal + maeMargin), 2),
    }

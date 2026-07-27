import os
import sys
import math
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import database

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "model"))
from train import loadAndPreprocess, trainModelStream

# Inicialización de FastAPI
app = FastAPI(title="Servidor de Python para AutoProceANN", version="1.0")

# -------------------------------------------------------------
# Configuración de CORS (Permite peticiones desde React/Vite)
# -------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En desarrollo permite peticiones desde Vite (localhost)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar DB al arrancar
database.initDb()

# Esquema para recibir datos desde React
class CSVPathRequest(BaseModel):
    filePath: str

class TrainRequest(BaseModel):
    filePath: str
    epochs: int
    lr: float
    testSize: float
    randomState: int

# Clase para la respuesta de verificación de salud
class HealthCheck(BaseModel):
    status: str
    message: str

# Endpoint raíz de bienvenida (GET)
@app.get("/")
def readRoot():
    return {"message": "Servidor de Python para la Red Neuronal listo"}

# Endpoint de verificación
@app.get("/health", response_model=HealthCheck)
def healthCheck():
    return HealthCheck(status="ok", message="Backend activo y escuchando")

# -------------------------------------------------------------
# Endpoints para la gestión de Datasets (CSVs)
# -------------------------------------------------------------

REQUIRED_COLUMNS = {"Año", "Kilometraje", "Marca", "Modelo", "Ha_tenido_accidentes", "Precio_venta"}

def analyze_csv(filePath: str) -> dict:
    """Lee un CSV y extrae estadísticas para la card del front."""
    if not os.path.exists(filePath):
        return None

    try:
        df = pd.read_csv(filePath)
        total = len(df)
        columns = set(df.columns)
        ready = REQUIRED_COLUMNS.issubset(columns)

        if not ready or total == 0:
            return {
                "totalRecords": total,
                "readyForTraining": False,
                "accidentPercentage": 0.0,
                "noAccidentPercentage": 0.0,
                "accidentsByYear": [],
            }

        accident_count = int(df["Ha_tenido_accidentes"].sum())
        no_accident_count = total - accident_count
        accident_pct = round((accident_count / total) * 100, 2)
        no_accident_pct = round((no_accident_count / total) * 100, 2)

        grouped = df.groupby("Año")["Ha_tenido_accidentes"].agg(
            accidents="sum",
            total="count",
        )
        grouped["noAccidents"] = grouped["total"] - grouped["accidents"]
        accidents_by_year = [
            {
                "year": int(year),
                "accidents": int(row["accidents"]),
                "noAccidents": int(row["noAccidents"]),
            }
            for year, row in grouped.iterrows()
        ]

        return {
            "totalRecords": total,
            "readyForTraining": True,
            "accidentPercentage": accident_pct,
            "noAccidentPercentage": no_accident_pct,
            "accidentsByYear": accidents_by_year,
        }
    except Exception:
        return {
            "totalRecords": 0,
            "readyForTraining": False,
            "accidentPercentage": 0.0,
            "noAccidentPercentage": 0.0,
            "accidentsByYear": [],
        }

# Inspecciona las columnas y vista previa de un CSV
@app.get("/datasets/inspectCSV")
def inspectDataset(filePath: str):
    """
    Lee un CSV desde el disco local y devuelve sus columnas 
    y una vista previa de las primeras filas.
    """
    if not os.path.exists(filePath):
        raise HTTPException(
            status_code=404, 
            detail="El archivo CSV no existe en la ruta especificada."
        )
    
    try:
        df = pd.read_csv(filePath, nrows=5)
        
        return {
            "status": "success",
            "columns": list(df.columns),
            "preview": df.fillna("").to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al leer el archivo CSV: {str(e)}"
        )

# Devuelve solo los 5 CSVs más recientemente seleccionados enriquecidos
@app.get("/datasets/recentCSVs")
def listRecentDatasets():
    recent = database.getRecentSelections(limit=5)
    enriched = []
    for ds in recent:
        analysis = analyze_csv(ds["filePath"])
        enriched.append({**ds, "analysis": analysis})
    return {"recentDatasets": enriched}

# Registra un CSV como recientemente seleccionado
@app.post("/datasets/recentSelections")
def addRecentSelection(payload: CSVPathRequest):
    try:
        database.saveCsvPath(payload.filePath)
        database.addRecentSelection(payload.filePath)
        return {"status": "success", "message": "Selección registrada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# Devuelve los valores únicos de Marca y Modelo de un CSV específico
@app.get("/datasets/column-options")
def getColumnOptions(filePath: str):
    if not os.path.exists(filePath):
        raise HTTPException(status_code=404, detail="El archivo CSV no existe.")
    try:
        df = pd.read_csv(filePath)
        brands = sorted(df["Marca"].dropna().unique().tolist()) if "Marca" in df.columns else []
        models = sorted(df["Modelo"].dropna().unique().tolist()) if "Modelo" in df.columns else []
        return {"brands": brands, "models": models}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al leer el CSV: {str(e)}")

# Devuelve todos los CSVs registrados con paginación y análisis
@app.get("/datasets")
def listAllDatasets(page: int = Query(1, ge=1), pageSize: int = Query(10, ge=1, le=100)):
    total = database.countAllCsvs()
    total_pages = math.ceil(total / pageSize) if total > 0 else 1
    datasets = database.getAllCsvs(page=page, page_size=pageSize)

    enriched = []
    for ds in datasets:
        analysis = analyze_csv(ds["filePath"])
        enriched.append({**ds, "analysis": analysis})

    return {
        "datasets": enriched,
        "total": total,
        "page": page,
        "pageSize": pageSize,
        "totalPages": total_pages,
    }

# Registra o actualiza la fecha de uso de un CSV seleccionado
@app.post("/datasets")
def registerDataset(payload: CSVPathRequest):
    try:
        database.saveCsvPath(payload.filePath)
        return {
            "status": "success",
            "message": "CSV guardado correctamente",
            "recentDatasets": database.getRecentCsvs(limit=5)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error en el servidor: {str(e)}"
        )

# Procesa un CSV para entrenamiento y devuelve un resumen
@app.post("/datasets/process")
def processDataset(payload: CSVPathRequest):
    try:
        result = loadAndPreprocess(payload.filePath)
        return {
            "status": "success",
            "stats": result["stats"],
        }
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar: {str(e)}")

import json

# Entrena el modelo con los datos del CSV y la configuración del usuario (streaming)
@app.post("/datasets/train")
def trainDataset(payload: TrainRequest):
    try:
        lrDecimal = payload.lr / 100.0
        testSizeDecimal = payload.testSize / 100.0

        def generate():
            for chunk in trainModelStream(
                csvPath=payload.filePath,
                epochs=payload.epochs,
                lr=lrDecimal,
                testSize=testSizeDecimal,
                randomState=payload.randomState,
            ):
                yield json.dumps(chunk) + "\n"

        return StreamingResponse(generate(), media_type="application/x-ndjson")
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al entrenar: {str(e)}")
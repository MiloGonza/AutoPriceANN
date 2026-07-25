import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import database

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

# Devuelve solo los 5 CSVs más recientes
@app.get("/datasets/recentCSVs")
def listRecentDatasets():
    return {"recentDatasets": database.getRecentCsvs(limit=5)}

# Devuelve todos los CSVs registrados
@app.get("/datasets")
def listAllDatasets():
    return {"datasets": database.getAllCsvs()}

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
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error en el servidor: {str(e)}"
        )
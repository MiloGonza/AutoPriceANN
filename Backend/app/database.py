import sqlite3
import os

DB_NAME = "app.db"

# Inicializa la base de datos y crea las tablas si no existen.
def initDb():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS csvDatasets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fileName TEXT NOT NULL,
            filePath TEXT NOT NULL UNIQUE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            lastUsedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS recentSelections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filePath TEXT NOT NULL UNIQUE,
            selectedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

# Guarda un nuevo CSV o actualiza la fecha si ya existía.
def saveCsvPath(filePath: str):
    """Guarda un nuevo CSV o actualiza la fecha si ya existía."""
    fileName = os.path.basename(filePath)
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Si la ruta ya existe, actualiza lastUsedAt a la hora actual
    cursor.execute("""
        INSERT INTO csvDatasets (fileName, filePath, lastUsedAt)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(filePath) DO UPDATE SET
            lastUsedAt = CURRENT_TIMESTAMP
    """, (fileName, filePath))
    
    conn.commit()
    conn.close()

# Cuenta el total de CSVs registrados.
def countAllCsvs():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM csvDatasets")
    total = cursor.fetchone()[0]
    conn.close()
    return total

# Devuelve CSVs registrados con paginación.
def getAllCsvs(page: int = 1, page_size: int = 10):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    offset = (page - 1) * page_size
    cursor.execute("""
        SELECT id, fileName, filePath, createdAt, lastUsedAt 
        FROM csvDatasets 
        ORDER BY id DESC
        LIMIT ? OFFSET ?
    """, (page_size, offset))
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": row[0],
            "fileName": row[1],
            "filePath": row[2],
            "createdAt": row[3],
            "lastUsedAt": row[4]
        }
        for row in rows
    ]

# Devuelve solo los 'limit' (5) CSVs usados más recientemente (para la Ventana Principal).
def getRecentCsvs(limit: int = 5):
    """Devuelve solo los 'limit' (5) CSVs usados más recientemente (para la Ventana Principal)."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # pedir solo los 5 más recientes
    cursor.execute("""
        SELECT id, fileName, filePath, createdAt, lastUsedAt 
        FROM csvDatasets 
        ORDER BY lastUsedAt DESC 
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": row[0],
            "fileName": row[1],
            "filePath": row[2],
            "createdAt": row[3],
            "lastUsedAt": row[4]
        }
        for row in rows
    ]

# Registra un CSV como recién seleccionado (max 5).
def addRecentSelection(filePath: str, limit: int = 5):
    """Inserta un CSV en la tabla de selecciones recientes, manteniendo solo los más recientes."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("DELETE FROM recentSelections WHERE filePath = ?", (filePath,))
    cursor.execute("""
        INSERT INTO recentSelections (filePath, selectedAt)
        VALUES (?, CURRENT_TIMESTAMP)
    """, (filePath,))

    cursor.execute("""
        DELETE FROM recentSelections
        WHERE id NOT IN (
            SELECT id FROM recentSelections ORDER BY selectedAt DESC LIMIT ?
        )
    """, (limit,))

    conn.commit()
    conn.close()

# Devuelve los CSVs más recientemente seleccionados enriquecidos con datos de csvDatasets.
def getRecentSelections(limit: int = 5):
    """Devuelve los CSVs más recientemente seleccionados, con datos de la tabla csvDatasets."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.id, c.fileName, c.filePath, c.createdAt, c.lastUsedAt
        FROM recentSelections r
        JOIN csvDatasets c ON r.filePath = c.filePath
        ORDER BY r.selectedAt DESC
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row[0],
            "fileName": row[1],
            "filePath": row[2],
            "createdAt": row[3],
            "lastUsedAt": row[4]
        }
        for row in rows
    ]
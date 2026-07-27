# AutoPriceANN

Aplicación de escritorio para predecir precios de vehículos usando una red neuronal artificial. Entrena un modelo con datos de un CSV, visualiza el progreso en tiempo real y predice precios con un formulario interactivo.

## Arquitectura del modelo

```
Input (nFeatures) → Linear(nFeatures, 64) → BatchNorm1d(64) → LeakyReLU(0.1) → Dropout(0.2)
                  → Linear(64, 32)         → BatchNorm1d(32) → LeakyReLU(0.1) → Dropout(0.2)
                  → Linear(32, 1)
```

- **Pesos**: Inicializados con `kaiming_normal_` (adaptado para LeakyReLU)
- **Loss**: MSE (Mean Squared Error)
- **Optimizador**: Adam con weight decay (L2 regularization)
- **Clipping**: Gradient clipping con `max_norm=1.0`
- **Normalización de salida**: `StandardScaler` para el precio objetivo

### Preprocesamiento de datos

| Tipo de feature | Transformación |
|---|---|
| Numéricas (Año, Kilometraje, Ha_tenido_accidentes) | `StandardScaler` |
| Categóricas (Marca, Modelo) | `OneHotEncoder` (max 20 categorías por feature) |

### Métricas calculadas por época

- **MAE** (Mean Absolute Error) en pesos reales
- **RMSE** (Root Mean Squared Error) en pesos reales
- **R² Score** (coeficiente de determinación)
- **Exactitud** (1 - MAPE) * 100%

## Requisitos

- **Node.js** >= 22
- **pnpm** (gestor de paquetes)
- **Python** >= 3.10
- **pip** (gestor de paquetes de Python)

## Instalación y ejecución

### Backend (FastAPI + PyTorch)

```bash
cd Backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependencias
pip install -r requiriments.txt

# Ejecutar el servidor (http://localhost:8000)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Electron + React)

```bash
cd FrontEnd

# Instalar dependencias
pnpm install

# Desarrollo (hot reload)
pnpm dev

# Compilar para producción
pnpm build

# Empaquetar instalador
pnpm build:win    # Windows
pnpm build:mac    # macOS
pnpm build:linux  # Linux
```

> El frontend se comunica con el backend en `http://localhost:8000`. Asegurate de que el backend esté corriendo antes de usar la app.

## Uso

1. **Seleccionar un CSV**: En la página de Datasets, selecciona un archivo CSV con los datos de vehículos. El CSV debe tener estas columnas:

   | Columna | Tipo | Ejemplo |
   |---|---|---|
   | `Año` | numérico | 2017 |
   | `Kilometraje` | numérico | 45000 |
   | `Marca` | texto | Suzuki |
   | `Modelo` | texto | Swift |
   | `Ha_tenido_accidentes` | 0 o 1 | 0 |
   | `Precio_venta` | numérico | 15.5 |

2. **Entrenar el modelo**: En la página de Entrenamiento, configura los hiperparámetros:
   - **Épocas**: número de iteraciones sobre los datos
   - **Tasa de aprendizaje**: en porcentaje (ej: 0.5 = 0.005)
   - **Conjunto de prueba**: porcentaje de datos para evaluación (ej: 20 = 20%)
   - **Aleatoriedad**: semilla para la división train/test

   El entrenamiento muestra progreso en tiempo real con gráficas de pérdida, MAE, R² y scatter plot de predicciones vs valores reales.

3. **Predecir precios**: En la página principal (Home), ingresa las características del vehículo:
   - Año
   - Kilometraje
   - Marca y modelo (se autocompletan según el CSV)
   - Si ha tenido accidentes

   Los inputs se validan contra el rango del CSV seleccionado.

## Estructura del proyecto

```
AutoPriceANN/
├── Backend/
│   ├── app/
│   │   ├── main.py           # Endpoints FastAPI
│   │   └── database.py       # SQLite para historial de CSVs
│   ├── model/
│   │   ├── train.py          # Modelo, preprocesamiento y entrenamiento
│   │   ├── predict.py        # Predicción con el modelo guardado
│   │   └── autoPriceAnnModel.pth  # Modelo entrenado (se genera al entrenar)
│   ├── requiriments.txt      # Dependencias de Python
│   └── venv/                 # Entorno virtual
├── FrontEnd/
│   ├── src/
│   │   ├── renderer/src/
│   │   │   ├── pages/        # Home, Train, DataSets
│   │   │   ├── components/   # Componentes React (14 componentes)
│   │   │   ├── stores/       # Estado global con Zustand
│   │   │   └── App.jsx       # Router principal
│   │   ├── api/              # Conexión con el backend (axios + fetch)
│   │   ├── main/             # Proceso principal de Electron
│   │   └── preload/          # Preload de Electron
│   ├── package.json
│   └── electron-builder.yml
├── autos_filtrado_con_precio.csv  # Dataset de ejemplo
└── README.md
```

## Dependencias del backend

| Paquete | Propósito |
|---|---|
| `fastapi[standard]` | Framework web + servidor ASGI |
| `uvicorn` | Servidor ASGI para FastAPI |
| `torch` | Red neuronal y entrenamiento |
| `scikit-learn` | Preprocesamiento (StandardScaler, OneHotEncoder, train_test_split) |
| `numpy` | Operaciones numéricas |
| `pandas` | Lectura y manipulación de CSVs |

## Dependencias del frontend

| Paquete | Propósito |
|---|---|
| `react` / `react-dom` | UI |
| `electron` | App de escritorio |
| `zustand` | Estado global |
| `recharts` | Gráficas (línea, scatter) |
| `motion` | Animaciones |
| `react-router-dom` | Navegación entre páginas |
| `axios` | Peticiones HTTP |
| `tailwindcss` | Estilos |
| `electron-vite` | Build tool |

## API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Verificación de salud del backend |
| `POST` | `/datasets/process` | Procesa un CSV y devuelve stats |
| `POST` | `/datasets/train` | Entrena el modelo (streaming NDJSON) |
| `POST` | `/predict` | Predice el precio de un vehículo |
| `GET` | `/datasets` | Lista todos los CSVs registrados |
| `GET` | `/datasets/recentCSVs` | CSVs recientes |
| `GET` | `/datasets/column-options` | Marcas y modelos disponibles en un CSV |

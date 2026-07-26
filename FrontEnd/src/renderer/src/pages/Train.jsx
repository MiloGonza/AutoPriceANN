function Train(params) {
    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] p-10 gap-4 bg-dark-bg rounded-2xl m-4">
            <div className="Title flex content-between justify-between items-center">
                <div>
                    <h2 className="text-2xl">Entrenamiento</h2>
                    <p className="text-muted-text">Pestaña para entrenar el modelo con el CSV selceccionado</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 border-dark-card border-2 py-2 px-4 rounded-2xl">
                        <div className="rounded-full h-2 w-2 bg-red-500"></div>
                        <span>Modelo {"modelStatus"}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Train;
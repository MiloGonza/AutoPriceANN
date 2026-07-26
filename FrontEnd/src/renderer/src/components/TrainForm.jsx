function TrainForm(params) {
    return (
        <form className='flex flex-col gap-4'>
            <div className='Title flex flex-col items-start gap-1 mb-4'>
                <h3 className='text-2xl'>Configuracion</h3>
                <span className='text-muted-text'>Fije las caracteristicas de entrenamiento para le red</span>
            </div>
            <div className='grid grid-cols-2 max-w-full items-center'>
                <label htmlFor="epocas">Numero de epocas</label>
                <input
                    id="epocas"
                    type="number"
                    value={''}
                    // onChange={(e) => props.setYear(e.target.value)}
                    placeholder="Ej. 398"
                    min={1886}
                    // max={props.currentYear}
                    // disabled={!props.selectedCSV}
                    className="border rounded-xl flex-1 border-dark-border focus:border-lime-accent outline-none focus:outline-none bg-transparent px-3 py-2 text-white placeholder-gray-500 no-spin disabled:opacity-40"
                />
            </div>
            <div className='grid grid-cols-2 max-w-full items-center'>
                <label htmlFor="lr">Tasa de Aprendizaje</label>
                <div className='max-w-full flex items-center gap-2'>
                    <input
                        id="lr"
                        type="number"
                        value={''}
                        // onChange={(e) => props.setYear(e.target.value)}
                        placeholder="Ej. 5"
                        min={1886}
                        // max={props.currentYear}
                        // disabled={!props.selectedCSV}
                        className="border rounded-xl flex-1 border-dark-border focus:border-lime-accent outline-none focus:outline-none bg-transparent px-3 py-2 text-white placeholder-gray-500 no-spin disabled:opacity-40"
                    />
                    %
                </div>
            </div>
            <div className='grid grid-cols-2 max-w-full items-center'>
                <label htmlFor="testSize">Tamaño del Conjunto de Prueba</label>
                <div className='max-w-full flex items-center gap-2'>
                    <input
                        id="testSize"
                        type="number"
                        value={''}
                        // onChange={(e) => props.setYear(e.target.value)}
                        placeholder="Ej. 20"
                        min={1886}
                        // max={props.currentYear}
                        // disabled={!props.selectedCSV}
                        className="border rounded-xl flex-1 border-dark-border focus:border-lime-accent outline-none focus:outline-none bg-transparent px-3 py-2 text-white placeholder-gray-500 no-spin disabled:opacity-40"
                    />
                    %
                </div>
            </div>
            <div className='grid grid-cols-2 max-w-full items-center'>
                <label htmlFor="Aleatoriedad">Aleatoriedad (random state)</label>
                <input
                    id="Aleatoriedad"
                    type="number"
                    value={''}
                    // onChange={(e) => props.setYear(e.target.value)}
                    placeholder="Ej. 398"
                    min={1886}
                    // max={props.currentYear}
                    // disabled={!props.selectedCSV}
                    className="border rounded-xl flex-1 border-dark-border focus:border-lime-accent outline-none focus:outline-none bg-transparent px-3 py-2 text-white placeholder-gray-500 no-spin disabled:opacity-40"
                />
            </div>
            {/* Tal vez para el futuro */}
            {/* <div className='grid grid-cols-2 max-w-full items-center'>
                            <label htmlFor="">arquitectura de la red</label>

                        </div> */}
            <div>
                <button className='PredecirPrecio btn-gradient-pp btnAnimate p-2 w-full'>
                    Entrenar
                </button>
            </div>
        </form>
    )
}

export default TrainForm 
/* eslint-disable react/prop-types */
import SearchSelect from '../components/SearchSelect'

function HomeFormPredict({...props}) {
    return (
        <div className="section2 dashboard-card relative">
            <form className='gap-3 flex flex-col' action="">
                <div className='Title flex flex-col items-start gap-1 mb-4'>
                    <h3 className='text-2xl'>Predecir precio</h3>
                    <span className='text-muted-text'>Ingrese los datos del vehiculo</span>
                </div>
                <div className='Form gap-4 flex flex-col relative'>
                    {!props.selectedCSV && (
                        // <span className="text-xs text-red-500 absolute bg-dark-card p-3 rounded-xl -top-8 -left-68">
                        //     Seleccione un dataset en el slider abajo
                        // </span>
                        ""
                    )}
                    <div className='grid grid-cols-2 items-center '>
                        <label htmlFor="year-input">Año</label>
                        <input
                            id="year-input"
                            type="number"
                            value={props.year}
                            onChange={(e) => props.setYear(e.target.value)}
                            placeholder="Ej. 1998"
                            min={1886}
                            max={props.currentYear}
                            disabled={!props.selectedCSV}
                            className="border rounded-xl flex-1 border-dark-border focus:border-lime-accent outline-none focus:outline-none bg-transparent px-3 py-2 text-white placeholder-gray-500 no-spin disabled:opacity-40"
                        />
                        {props.yearError && (
                            <span className="text-red-500 text-xs mt-1">
                                {props.yearError}
                            </span>
                        )}
                    </div>
                    <div className='grid grid-cols-2 items-center justify-between'>
                        <label htmlFor="mileage-input">Kilometraje</label>
                        <input
                            id="mileage-input"
                            type="number"
                            placeholder="Ej. 50000"
                            min="0"
                            disabled={!props.selectedCSV}
                            className="border rounded-xl flex-1 border-dark-border focus:border-lime-accent outline-none focus:outline-none bg-transparent px-3 py-2 text-white placeholder-gray-500 no-spin disabled:opacity-40"
                        />
                    </div>
                    <div className='grid grid-cols-2 items-center justify-between gap-4'>
                        <label>Marca</label>
                        <SearchSelect
                            options={props.brands}
                            value={props.brand}
                            onChange={props.setBrand}
                            placeholder="Seleccionar marca..."
                            disabled={!props.selectedCSV}
                        />
                    </div>
                    <div className='grid grid-cols-2 items-center justify-between gap-4'>
                        <label>Modelo</label>
                        <SearchSelect
                            options={props.filteredModels}
                            value={props.model}
                            onChange={props.setModel}
                            placeholder="Seleccionar modelo..."
                            disabled={!props.selectedCSV}
                        />
                    </div>
                    <div className='grid grid-cols-2 items-center justify-between gap-4'>
                        <label>Ha tenido accidentes?</label>
                        <SearchSelect
                            options={props.ACCIDENT_OPTIONS}
                            value={props.accident}
                            onChange={props.setAccident}
                            placeholder="Seleccionar..."
                            disabled={!props.selectedCSV}
                        />
                    </div>
                </div>
                <div>
                    <button className='PredecirPrecio btn-gradient-pp btnAnimate p-2 w-full'>
                        Predecir precio
                    </button>
                </div>
                <div className='bg-dark-hover border-dark-border border  flex flex-1 flex-col gap-4 p-4 rounded-xl'>
                    <div>
                        <h5>Precio estimado</h5>
                        <span className='text-2xl text-lime-accent'>
                            $ {/* Aquí se mostraría el precio estimado después de la predicción */}456789 cop
                        </span>
                    </div>
                    <div>
                        <h5>Rango estimado</h5>
                        <span className='text-pink-accent'>
                            $ {/* Aquí se mostraría el rango estimado después de la predicción */}400000 - $ {/* Aquí se mostraría el rango estimado después de la predicción */}500000
                        </span>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default HomeFormPredict
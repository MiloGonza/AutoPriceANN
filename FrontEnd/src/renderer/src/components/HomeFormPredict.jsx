/* eslint-disable react/prop-types */
import SearchSelect from '../components/SearchSelect'

function formatPrice(v) {
	if (v === 0) return '$0'
	if (v >= 10_000) return `$${Math.round(v).toLocaleString('es-CO')}`
	if (v >= 1) return `$${v.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
	return `$${v.toFixed(2)}`
}

function priceFontSize(v) {
	if (v >= 1_000_000) return 'text-lg'
	if (v >= 100_000) return 'text-xl'
	return 'text-2xl'
}

function HomeFormPredict({...props}) {
    const kmRange = props.csvFeatureRanges?.Kilometraje
    const yearRange = props.csvFeatureRanges?.Año

    const kmNum = Number(props.km)
    const kmError = props.km && kmRange && (kmNum < kmRange.min || kmNum > kmRange.max)
        ? `El kilometraje debe estar entre ${kmRange.min.toLocaleString('es-CO')} y ${kmRange.max.toLocaleString('es-CO')}`
        : ''

    const canPredict = props.selectedCSV && props.year && props.km && props.brand && props.model && props.accident && !props.predicting && !props.yearError && !kmError

    return (
        <div className="section2 dashboard-card relative overflow-y-auto">
            <form className='gap-3 flex flex-col' onSubmit={(e) => { e.preventDefault(); if (canPredict) props.runPrediction() }}>
                <div className='Title flex flex-col items-start gap-1 mb-4'>
                    <h3 className='text-2xl'>Predecir precio</h3>
                    <span className='text-muted-text'>Ingrese los datos del vehiculo</span>
                </div>
                <div className='Form gap-4 flex flex-col relative'>
                    <div className='grid grid-cols-2 items-center '>
                        <label htmlFor="year-input">Año</label>
                        <div className='flex flex-col'>
                            <input
                                id="year-input"
                                type="number"
                                value={props.year}
                                onChange={(e) => props.setYear(e.target.value)}
                                placeholder={yearRange ? `${yearRange.min} - ${yearRange.max}` : "Ej. 1998"}
                                min={yearRange?.min || 1886}
                                max={yearRange?.max || props.currentYear}
                                disabled={!props.selectedCSV}
                                className="border rounded-xl flex-1 border-dark-border focus:border-lime-accent outline-none focus:outline-none bg-transparent px-3 py-2 text-white placeholder-gray-500 no-spin disabled:opacity-40"
                            />
                            {props.yearError && (
                                <span className="text-red-500 text-xs mt-1">
                                    {props.yearError}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className='grid grid-cols-2 items-center justify-between'>
                        <label htmlFor="mileage-input">Kilometraje</label>
                        <div className='flex flex-col'>
                            <input
                                id="mileage-input"
                                type="number"
                                value={props.km}
                                onChange={(e) => props.setKm(e.target.value)}
                                placeholder={kmRange ? `${kmRange.min.toLocaleString('es-CO')} - ${kmRange.max.toLocaleString('es-CO')}` : "Ej. 50000"}
                                min={kmRange?.min || 0}
                                max={kmRange?.max}
                                disabled={!props.selectedCSV}
                                className="border rounded-xl flex-1 border-dark-border focus:border-lime-accent outline-none focus:outline-none bg-transparent px-3 py-2 text-white placeholder-gray-500 no-spin disabled:opacity-40"
                            />
                            {kmError && (
                                <span className="text-red-500 text-xs mt-1">
                                    {kmError}
                                </span>
                            )}
                        </div>
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
                    <button
                        type="submit"
                        disabled={!canPredict}
                        className='PredecirPrecio btn-gradient-pp btnAnimate p-2 w-full disabled:opacity-40 disabled:cursor-not-allowed'
                    >
                        {props.predicting ? 'Prediciendo...' : 'Predecir precio'}
                    </button>
                </div>
                <div className='bg-dark-hover border-dark-border border  flex flex-1 flex-col gap-4 p-4 rounded-xl'>
                    <div>
                        <h5>Precio estimado</h5>
                        <span className={`${props.prediction ? priceFontSize(props.prediction.predictedPrice) : 'text-2xl'} text-lime-accent`}>
                            {props.prediction ? formatPrice(props.prediction.predictedPrice) : '$0'}
                        </span>
                    </div>
                    <div>
                        <h5>Rango estimado</h5>
                        <span className='text-pink-accent text-sm'>
                            {props.prediction
                                ? `${formatPrice(props.prediction.rangeLow)} - ${formatPrice(props.prediction.rangeHigh)}`
                                : '$0 - $0'
                            }
                        </span>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default HomeFormPredict
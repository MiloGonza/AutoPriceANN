import { useState } from 'react'
import { useGeneralStore } from '../stores/useGeneralStore'

function TrainForm() {
    const [epocas, setEpocas] = useState('')
    const [lr, setLr] = useState('')
    const [testSize, setTestSize] = useState('')
    const [randomState, setRandomState] = useState('')

    const training = useGeneralStore((s) => s.training)
    const selectedCSV = useGeneralStore((s) => s.selectedCSV)
    const runTraining = useGeneralStore((s) => s.runTraining)

    const canTrain = selectedCSV && epocas && lr && testSize && randomState && !training

    const handleTrain = async (e) => {
        e.preventDefault()
        if (!canTrain) return
        await runTraining({
            epochs: Number(epocas),
            lr: Number(lr),
            testSize: Number(testSize),
            randomState: Number(randomState),
        })
    }

    return (
        <form className='flex flex-col gap-4' onSubmit={handleTrain}>
            <div className='Title flex flex-col items-start gap-1 mb-4'>
                <h3 className='text-2xl'>Configuracion</h3>
                <span className='text-muted-text'>Fije las caracteristicas de entrenamiento para le red</span>
            </div>
            <div className='grid grid-cols-2 max-w-full items-center'>
                <label htmlFor="epocas">Numero de epocas</label>
                <input
                    id="epocas"
                    type="number"
                    value={epocas}
                    onChange={(e) => setEpocas(e.target.value)}
                    placeholder="Ej. 100"
                    min={1}
                    className="border rounded-xl flex-1 border-dark-border focus:border-lime-accent outline-none focus:outline-none bg-transparent px-3 py-2 text-white placeholder-gray-500 no-spin disabled:opacity-40"
                />
            </div>
            <div className='grid grid-cols-2 max-w-full items-center'>
                <label htmlFor="lr">Tasa de Aprendizaje</label>
                <div className='max-w-full flex items-center gap-2'>
                    <input
                        id="lr"
                        type="number"
                        value={lr}
                        onChange={(e) => setLr(e.target.value)}
                        placeholder="Ej. 5"
                        min={0}
                        step="any"
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
                        value={testSize}
                        onChange={(e) => setTestSize(e.target.value)}
                        placeholder="Ej. 20"
                        min={0}
                        max={100}
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
                    value={randomState}
                    onChange={(e) => setRandomState(e.target.value)}
                    placeholder="Ej. 42"
                    min={0}
                    className="border rounded-xl flex-1 border-dark-border focus:border-lime-accent outline-none focus:outline-none bg-transparent px-3 py-2 text-white placeholder-gray-500 no-spin disabled:opacity-40"
                />
            </div>
            <div>
                <button
                    type="submit"
                    disabled={!canTrain}
                    className='PredecirPrecio btn-gradient-pp btnAnimate p-2 w-full disabled:opacity-40 disabled:cursor-not-allowed'
                >
                    {training ? 'Entrenando...' : 'Entrenar'}
                </button>
            </div>
        </form>
    )
}

export default TrainForm

import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useGeneralStore } from '../stores/useGeneralStore'
import { AnimatePresence, motion } from 'motion/react';
import TrainResultsTable from '../components/TrainResultsTable'
import TrainForm from '../components/TrainForm';
import TrainingChart from '../components/TrainingChart';

function generateMockChartData(count = 80) {
    const rows = []
    let trainLoss = 2.5
    let testLoss = 2.8
    let trainAcc = 10
    let testAcc = 8
    for (let i = 1; i <= count; i++) {
        trainLoss = Math.max(0.01, trainLoss - (Math.random() * 0.08 + 0.01))
        testLoss = Math.max(0.02, testLoss - (Math.random() * 0.07 + 0.01))
        trainAcc = Math.min(99.5, trainAcc + (Math.random() * 3 + 0.5))
        testAcc = Math.min(98.5, testAcc + (Math.random() * 2.8 + 0.4))
        rows.push({
            epoch: i,
            trainLoss: Number(trainLoss.toFixed(4)),
            testLoss: Number(testLoss.toFixed(4)),
            trainAccuracy: Number(trainAcc.toFixed(2)),
            testAccuracy: Number(testAcc.toFixed(2)),
        })
    }
    return rows
}

function Train() {

    const selectedCSV = useGeneralStore((s) => s.selectedCSV)

    const chartData = useMemo(() => generateMockChartData(80), [])

    return (
        <div className="flex relative flex-col h-[calc(100vh-2rem)] p-10 gap-4 bg-dark-bg rounded-2xl m-4">
            <div className="Title flex content-between justify-between items-center">
                <div>
                    <h2 className="text-2xl">Entrenamiento</h2>
                    <p className="text-muted-text">Pestaña para entrenar el modelo con el CSV selceccionado</p>
                </div>
                <AnimatePresence mode='wait'>
                    {
                        selectedCSV ?
                            <motion.div
                                layout>
                                <div className='flex gap-2'>
                                    <div className="flex items-center gap-2 border-dark-card border-2 py-2 px-4 rounded-2xl">
                                        <div className="rounded-full h-2 w-2 bg-red-500"></div>
                                        <span>CSV seleccionado: <b className='text-pink-accent'>{selectedCSV.fileName}</b></span>
                                    </div>
                                    <Link to={'/datasets'} className='btn btnAnimate'>
                                        Seleccionar otro
                                    </Link>
                                </div>
                            </motion.div>
                            :
                            <motion.div layout>
                                <Link to={'/datasets'} className='btn btnAnimate'>
                                    Seleccionar un csv para entrenar
                                </Link>
                            </motion.div>
                    }
                </AnimatePresence>
            </div>
            <div className='flex max-h-full h-full overflow-hidden gap-4'>
                <TrainResultsTable progress={100} />
                <div className='dashboard-card'>
                    <TrainForm />
                    <hr className='text-white my-4' />
                    <div className='grid grid-cols-1 gap-6'>
                        <div className='bg-dark-hover border-dark-border border rounded-2xl p-2 h-52'>
                            <TrainingChart title="Perdida por Epoca" data={chartData} dataKeyTrain="trainLoss" dataKeyTest="testLoss" yLabel="Perdida" xLabel="Epoca" colorTrain="#c2f02d" colorTest="#f06292" />
                        </div>
                        <div className='bg-dark-hover border-dark-border border rounded-2xl p-2 h-52'>
                            <TrainingChart title="MAE por Epoca" data={chartData} dataKeyTrain="trainAccuracy" dataKeyTest="testAccuracy" yLabel="MAE" xLabel="Epoca" colorTrain="#38bdf8" colorTest="#a855f7" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Train;

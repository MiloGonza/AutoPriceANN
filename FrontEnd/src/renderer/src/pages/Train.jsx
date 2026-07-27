import { Link } from 'react-router-dom';
import { useGeneralStore } from '../stores/useGeneralStore'
import { AnimatePresence, motion } from 'motion/react';
import TrainResultsTable from '../components/TrainResultsTable'
import TrainForm from '../components/TrainForm';
import TrainingChart from '../components/TrainingChart';

function Train() {

    const selectedCSV = useGeneralStore((s) => s.selectedCSV)
    const trained = useGeneralStore((s) => s.trained)
    const training = useGeneralStore((s) => s.training)
    const trainingHistory = useGeneralStore((s) => s.trainingHistory)
    const totalEpochs = useGeneralStore((s) => s.totalEpochs)
    const currentEpoch = useGeneralStore((s) => s.currentEpoch)
    const trainingSession = useGeneralStore((s) => s.trainingSession)

    const progress = training && totalEpochs > 0
        ? (currentEpoch / totalEpochs) * 100
        : trained ? 100 : 0

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
                                        <div className={`rounded-full h-2 w-2 ${selectedCSV.analysis?.readyForTraining ? 'bg-lime-accent' : 'bg-red-500'}`}></div>
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
                <TrainResultsTable progress={progress} data={trainingHistory} progressKey={trainingSession} />
                <div className='dashboard-card'>
                    <TrainForm />
                    <hr className='text-white my-4' />
                    {
                        trained ?
                            <motion.div
                            initial={{opacity:0}}
                            animate={{opacity:1}}
                            exit={{opacity:0}}
                            className='grid grid-cols-1 gap-6'>
                                <div className='bg-dark-hover border-dark-border border rounded-2xl p-2 h-52'>
                                    <TrainingChart title="Perdida por Epoca" data={trainingHistory} dataKeyTrain="trainLoss" dataKeyTest="testLoss" yLabel="Perdida" xLabel="Epoca" colorTrain="#c2f02d" colorTest="#f06292" />
                                </div>
                                <div className='bg-dark-hover border-dark-border border rounded-2xl p-2 h-52'>
                                    <TrainingChart title="MAE por Epoca" data={trainingHistory} dataKeyTrain="trainAccuracy" dataKeyTest="testAccuracy" yLabel="MAE (pesos)" xLabel="Epoca" colorTrain="#38bdf8" colorTest="#a855f7" />
                                </div>
                            </motion.div>
                            :
                            <motion.div
                            initial={{opacity:0}}
                            animate={{opacity:1}}
                            exit={{opacity:0}}
                            className='flex bg-dark-hover rounded-2xl h-108 items-center justify-center'>
                                <span className='text-red-500'>Aun no se ha entrenado nada</span>
                            </motion.div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Train;

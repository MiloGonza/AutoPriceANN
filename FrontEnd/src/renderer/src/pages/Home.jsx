import { useState, useEffect, useCallback } from 'react'
import { GetColumnOptions, TakeDataSelectedCsv } from '../../../api/Api'
import CardSlider3D from '../components/CardSlider3D'

import { Link } from 'react-router-dom'
import { useGeneralStore } from '../stores/useGeneralStore'
import HomeFormPredict from '../components/HomeFormPredict'
import HomeData from '../components/HomeData'
import TrainingChart from '../components/TrainingChart'
import ScatterPlotChart from '../components/ScatterPlotChart'
import { AnimatePresence, motion } from 'motion/react'


const ACCIDENT_OPTIONS = ["No", "Si"]

export function Home() {
	const {
		year, yearError, setYear,
		km, setKm,
		brand, setBrand,
		model, setModel,
		accident, setAccident,
		selectedCSV, setSelectedCSV,
		recentCSVs, fetchRecentCSVs,
		trained, trainingHistory,
		scatterData,
		csvFeatureRanges,
		prediction, predicting, runPrediction
	} = useGeneralStore()
	const currentYear = new Date().getFullYear()
	const [brands, setBrands] = useState([])
	const [models, setModels] = useState([])

	useEffect(() => {
		fetchRecentCSVs()
	}, [fetchRecentCSVs])

	useEffect(() => {
		if (!selectedCSV?.filePath) {
			setBrands([])
			setModels([])
			return
		}
		GetColumnOptions(selectedCSV.filePath)
			.then((data) => {
				setBrands(data.brands)
				setModels(data.models)
			})
			.catch(() => {
				setBrands([])
				setModels([])
			})
	}, [selectedCSV])

	const handleCardSelect = useCallback((item) => {
		setSelectedCSV(item)
		TakeDataSelectedCsv(item.filePath)
			.then((data) => {
				if (data?.stats?.featureRanges) {
					useGeneralStore.setState({ csvFeatureRanges: data.stats.featureRanges })
				}
			})
			.catch(() => {})
	}, [setSelectedCSV])

	const filteredModels = brand
		? models.filter(() => true)
		: models


	return (
		<div className="flex flex-col h-[calc(100vh-2rem)] p-10 gap-4 bg-dark-bg rounded-2xl m-4">
			<div className="sectionContent grid-cols-3 grid gap-4 h-[65%]">
				<div className="section1 col-span-2 gap-4 flex flex-col">
					<div className="Title flex content-between justify-between items-center">
						<div>
							<h2 className="text-2xl">Resumen del modelo</h2>
							<p className="text-muted-text">Estado actual y rendimiento del modelo</p>
						</div>
						<div>
							<div className="flex items-center gap-2 border-dark-card border-2 py-2 px-4 rounded-2xl">
								<div className={`rounded-full h-2 w-2 ${trained ? 'bg-lime-accent' : 'bg-red-500'}`}></div>
								<span>{trained ? 'Listo para predecir' : 'Sin entrenamiento'}</span>
							</div>
						</div>
					</div>
					<HomeData trained={trained} trainingHistory={trainingHistory} />
					<div className='flex-1 min-h-0'>
						<AnimatePresence>
						{
							trained ?
							<motion.div className='grid grid-cols-2 gap-4 h-full'>
								<div className='dashboard-card min-h-0 flex flex-col'>
									<TrainingChart title="Perdida por Epoca" data={trainingHistory} dataKeyTrain="trainLoss" dataKeyTest="testLoss" yLabel="Perdida" xLabel="Epoca" colorTrain="#c2f02d" colorTest="#f06292" />
								</div>
								<div className='dashboard-card min-h-0 flex flex-col'>
									<ScatterPlotChart data={scatterData} title="Predicho vs Real" />
								</div>
							</motion.div>
								:
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className='flex dashboard-card h-full items-center justify-center'>
									<span className='text-red-500'>Aun no se ha entrenado nada</span>
								</motion.div>
						}
						</AnimatePresence>
					</div>
				</div>
				<HomeFormPredict
					ACCIDENT_OPTIONS={ACCIDENT_OPTIONS}
					year={year}
					setYear={setYear}
					yearError={yearError}
					currentYear={currentYear}
					km={km}
					setKm={setKm}
					brand={brand}
					setBrand={setBrand}
					model={model}
					setModel={setModel}
					accident={accident}
					setAccident={setAccident}
					selectedCSV={selectedCSV}
					csvFeatureRanges={csvFeatureRanges}
					brands={brands}
					filteredModels={filteredModels}
					prediction={prediction}
					predicting={predicting}
					runPrediction={runPrediction}
				/>
			</div>
			<div className='selectCSV flex flex-col flex-1 relative'>
				<div className='Title flex flex-col items-start gap-1 mb-4'>
					<h4 className='text-2xl'>Datasets recientes</h4>
					<span className='text-muted-text'>Archivos CSV para entrenar los modelos</span>
				</div>
				<CardSlider3D items={recentCSVs} onCardSelect={handleCardSelect} />
				<Link to={'./datasets'} className=' btn btnAnimate absolute z-99 right-5 top-5'>
					<span>
						Ver todos los datasets
					</span>
				</Link>
			</div>
		</div >
	)
}
import { useState, useEffect, useCallback } from 'react'
import { useModelStore } from '../stores/useModelStore'
import { GetColumnOptions } from '../../../api/Api'
import CardSlider3D from '../components/CardSlider3D'

import { Link } from 'react-router-dom'
import { useGeneralStore } from '../stores/useGeneralStore'
import HomeFormPredict from '../components/HomeFormPredict'
import HomeData from '../components/HomeData'


const ACCIDENT_OPTIONS = ["No", "Si"]

export function Home() {
	const modelStatus = useModelStore((s) => s.status)
	const {
		year, yearError, setYear,
		brand, setBrand,
		model, setModel,
		accident, setAccident,
		selectedCSV, setSelectedCSV,
		recentCSVs, fetchRecentCSVs,
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
	}, [setSelectedCSV])

	const filteredModels = brand
		? models.filter(() => true)
		: models

	return (
		<div className="flex flex-col h-[calc(100vh-2rem)] p-10 gap-4 bg-dark-bg rounded-2xl m-4">
			<div className="sectionContent grid-cols-3 grid gap-10 h-[65%]">
				<div className="section1 col-span-2 gap-2 flex flex-col">
					<div className="Title flex content-between justify-between items-center">
						<div>
							<h2 className="text-2xl">Resumen del modelo</h2>
							<p className="text-muted-text">Estado actual y rendimiento del modelo</p>
						</div>
						<div>
							<div className="flex items-center gap-2 border-dark-card border-2 py-2 px-4 rounded-2xl">
								<div className="rounded-full h-2 w-2 bg-red-500"></div>
								<span>Modelo {modelStatus}</span>
							</div>
						</div>
					</div>
					<HomeData />
				</div>
				<HomeFormPredict
					ACCIDENT_OPTIONS={ACCIDENT_OPTIONS}
					year={year}
					setYear={setYear}
					yearError={yearError}
					currentYear={currentYear}
					brand={brand}
					setBrand={setBrand}
					model={model}
					setModel={setModel}
					accident={accident}
					setAccident={setAccident}
					selectedCSV={selectedCSV}
					brands={brands}
					filteredModels={filteredModels}
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
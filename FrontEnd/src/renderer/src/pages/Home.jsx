import { useState, useEffect } from 'react'
import { useModelStore } from '../stores/useModelStore'
import { GetRecentDatasets } from '../../../api/Api'
import CardSlider3D from '../components/CardSlider3D'
import { Link } from 'react-router-dom'

export function Home() {
	const modelStatus = useModelStore((s) => s.status)
	const [recentCSVs, setRecentCSVs] = useState([])

	useEffect(() => {
		GetRecentDatasets()
			.then((data) => setRecentCSVs(data.recentDatasets))
			.catch(() => {})
	}, [])

	return (
		<div className="flex flex-col h-[calc(100vh-2rem)] p-10 gap-4 bg-dark-bg rounded-2xl m-4">
			<div className="sectionContent grid-cols-3 grid gap-10 h-[65%]">
				<div className="section1 col-span-2">
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
				</div>
				<div className="section2 dashboard-card">

				</div>
			</div>
			<div className='selectCSV flex flex-col flex-1 relative'>
				<div className='Title flex flex-col items-start gap-1 mb-4'>
					<h3 className='text-2xl'>Datasets recientes</h3>
					<span className='text-muted-text'>Archivos CSV para entrenar los modelos</span>
				</div>
				<CardSlider3D items={recentCSVs} />
				<Link to={'./datasets'} className=' btn btnAnimate absolute z-99 right-5 top-5'>
					<span>
						Ver todos los datasets
					</span>
				</Link>
			</div>
		</div >
	)
}

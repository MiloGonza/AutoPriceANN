import { useModelStore } from '../stores/useModelStore'
import CardSlider3D from '../components/CardSlider3D'

const sampleCSVs = [
	{
		name: "cars_2024.csv",
		status: "ready",
		total: 10,
		cars: [
			{ year: 2020, mileage: 35000, brand: "Toyota", model: "Corolla", accident: false },
			{ year: 2021, mileage: 22000, brand: "Honda", model: "Civic", accident: false },
			{ year: 2019, mileage: 48000, brand: "Ford", model: "Focus", accident: true },
			{ year: 2022, mileage: 15000, brand: "Toyota", model: "Camry", accident: false },
			{ year: 2018, mileage: 72000, brand: "Chevrolet", model: "Malibu", accident: true },
			{ year: 2023, mileage: 8000, brand: "Hyundai", model: "Elantra", accident: false },
			{ year: 2020, mileage: 41000, brand: "Nissan", model: "Sentra", accident: true },
			{ year: 2021, mileage: 29000, brand: "Mazda", model: "3", accident: false },
			{ year: 2017, mileage: 85000, brand: "Ford", model: "Escape", accident: true },
			{ year: 2022, mileage: 18000, brand: "Kia", model: "Forte", accident: false },
		],
	},
	{
		name: "vehicles_train.csv",
		status: "ready",
		total: 10,
		cars: [
			{ year: 2015, mileage: 95000, brand: "Toyota", model: "RAV4", accident: true },
			{ year: 2018, mileage: 52000, brand: "Honda", model: "CR-V", accident: false },
			{ year: 2016, mileage: 78000, brand: "Ford", model: "Explorer", accident: true },
			{ year: 2020, mileage: 31000, brand: "Chevrolet", model: "Equinox", accident: false },
			{ year: 2019, mileage: 44000, brand: "Hyundai", model: "Tucson", accident: false },
			{ year: 2017, mileage: 67000, brand: "Nissan", model: "Rogue", accident: true },
			{ year: 2021, mileage: 20000, brand: "Mazda", model: "CX-5", accident: false },
			{ year: 2014, mileage: 110000, brand: "Kia", model: "Sportage", accident: true },
			{ year: 2022, mileage: 12000, brand: "Toyota", model: "Highlander", accident: false },
			{ year: 2016, mileage: 82000, brand: "Subaru", model: "Forester", accident: false },
		],
	},
	{
		name: "prices_full.csv",
		status: null,
		total: 10,
		cars: [
			{ year: 2023, mileage: 5000, brand: "BMW", model: "3 Series", accident: false },
			{ year: 2022, mileage: 14000, brand: "Mercedes", model: "C-Class", accident: false },
			{ year: 2021, mileage: 25000, brand: "Audi", model: "A4", accident: true },
			{ year: 2020, mileage: 38000, brand: "Lexus", model: "IS", accident: false },
			{ year: 2019, mileage: 50000, brand: "Toyota", model: "Avalon", accident: true },
			{ year: 2023, mileage: 3000, brand: "Honda", model: "Accord", accident: false },
			{ year: 2018, mileage: 62000, brand: "Ford", model: "Fusion", accident: true },
			{ year: 2022, mileage: 11000, brand: "Hyundai", model: "Sonata", accident: false },
			{ year: 2021, mileage: 28000, brand: "Kia", model: "K5", accident: false },
			{ year: 2020, mileage: 42000, brand: "Nissan", model: "Altima", accident: true },
		],
	},
	{
		name: "autos_usados.csv",
		status: null,
		total: 10,
		cars: [
			{ year: 2010, mileage: 120000, brand: "Toyota", model: "Corolla", accident: true },
			{ year: 2012, mileage: 98000, brand: "Honda", model: "Civic", accident: false },
			{ year: 2011, mileage: 105000, brand: "Ford", model: "Fiesta", accident: true },
			{ year: 2013, mileage: 88000, brand: "Chevrolet", model: "Spark", accident: false },
			{ year: 2009, mileage: 140000, brand: "Nissan", model: "March", accident: true },
			{ year: 2014, mileage: 75000, brand: "Hyundai", model: "Accent", accident: false },
			{ year: 2010, mileage: 130000, brand: "Kia", model: "Rio", accident: true },
			{ year: 2012, mileage: 95000, brand: "Mazda", model: "2", accident: false },
			{ year: 2011, mileage: 115000, brand: "Suzuki", model: "Swift", accident: true },
			{ year: 2013, mileage: 82000, brand: "Volkswagen", model: "Gol", accident: false },
		],
	},
	{
		name: "preprocessed.csv",
		status: "ready",
		total: 10,
		cars: [
			{ year: 2020, mileage: 30000, brand: "Toyota", model: "Corolla", accident: false },
			{ year: 2021, mileage: 18000, brand: "Honda", model: "Civic", accident: false },
			{ year: 2019, mileage: 55000, brand: "Ford", model: "Focus", accident: true },
			{ year: 2022, mileage: 10000, brand: "Hyundai", model: "Elantra", accident: false },
			{ year: 2018, mileage: 68000, brand: "Chevrolet", model: "Malibu", accident: true },
			{ year: 2023, mileage: 5000, brand: "Kia", model: "Forte", accident: false },
			{ year: 2020, mileage: 37000, brand: "Nissan", model: "Sentra", accident: false },
			{ year: 2021, mileage: 24000, brand: "Mazda", model: "3", accident: true },
			{ year: 2017, mileage: 90000, brand: "Ford", model: "Escape", accident: true },
			{ year: 2022, mileage: 15000, brand: "Toyota", model: "Camry", accident: false },
		],
	},
]

export function Home() {
	const modelStatus = useModelStore((s) => s.status)

	return (
		<div className="flex flex-col h-screen w-full p-10 gap-4">
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
				<CardSlider3D items={sampleCSVs} />
				<button className=' btn btnAnimate absolute z-99 right-5 top-5'>
					<span>
						Ver todos los datasets
					</span>
				</button>
			</div>
		</div >
	);
}

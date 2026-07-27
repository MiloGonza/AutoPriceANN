import CrossHairIcon from '../assets/icons/CrossHairIcon'
import CrucedGraphIcon from '../assets/icons/CrucedGraphIcon'
import GraphIcon from '../assets/icons/GraphIcon'
import ScatterPlottIcon from '../assets/icons/ScatterPlottIcon'

function formatValue(v) {
	if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
	if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}k`
	return `$${v.toFixed(2)}`
}

function HomeData({ trained, trainingHistory }) {
	const last = trained && trainingHistory.length > 0
		? trainingHistory[trainingHistory.length - 1]
		: null

	const mae = last ? formatValue(last.testAccuracy) : '$0'
	const rmse = last ? formatValue(last.testRMSE) : '$0'

	return (
		<div className='gap-4 grid-cols-4 grid'>
			<div className='flex gap-4 dashboard-card items-center'>
				<div className='bg-dark-hover p-4 rounded-2xl border-dark-border border'>
					<CrucedGraphIcon fill={'#f06292'} stroke={''} size={'2'} />
				</div>
				<div className='flex flex-col gap2'>
					<span className='text-muted-text'>MAE</span>
					<span className='text-2xl'>{mae}</span>
				</div>
			</div>
			<div className='flex gap-4 dashboard-card items-center'>
				<div className='bg-dark-hover p-4 rounded-2xl border-dark-border border'>
					<GraphIcon fill={'transparent'} stroke={'#a855f7'} size={'2.5'} />
				</div>
				<div className='flex flex-col gap2'>
					<span className='text-muted-text'>RMSE</span>
					<span className='text-2xl'>{rmse}</span>
				</div>
			</div>
			<div className='flex gap-4 dashboard-card items-center'>
				<div className='bg-dark-hover p-4 rounded-2xl border-dark-border border'>
					<ScatterPlottIcon fill={'transparent'} stroke={'#'} size={'2.5'} />
				</div>
				<div className='flex flex-col gap2'>
					<span className='text-muted-text'>R² Score</span>
					<span className='text-2xl'>-</span>
				</div>
			</div>
			<div className='flex gap-4 dashboard-card items-center'>
				<div className='bg-dark-hover p-4 rounded-2xl border-dark-border border'>
					<CrossHairIcon fill={'transparent'} stroke={'#c2f02d'} size={'2.5'} />
				</div>
				<div className='flex flex-col gap2'>
					<span className='text-muted-text'>Exactitud</span>
					<span className='text-2xl'>-</span>
				</div>
			</div>
		</div>
	)
}

export default HomeData

import CrossHairIcon from '../assets/icons/CrossHairIcon'
import CrucedGraphIcon from '../assets/icons/CrucedGraphIcon'
import GraphIcon from '../assets/icons/GraphIcon'
import ScatterPlottIcon from '../assets/icons/ScatterPlottIcon'

function HomeData(params) {
    return (
        <div className='gap-4 grid-cols-4 grid'>
            <div className='flex gap-4 dashboard-card items-center'>
                <div className='bg-dark-hover p-4 rounded-2xl border-dark-border border'>
                    <CrucedGraphIcon fill={'#f06292'} stroke={''} size={'2'} />
                </div>
                <div className='flex flex-col gap2'>
                    <span className='text-muted-text'>MAE</span>
                    <span className='text-2xl'>1.89M</span>
                    <span className='text-lime-accent'>9.7%</span>
                </div>
            </div>
            <div className='flex gap-4 dashboard-card items-center'>
                <div className='bg-dark-hover p-4 rounded-2xl border-dark-border border'>
                    <GraphIcon fill={'transparent'} stroke={'#a855f7'} size={'2.5'} />
                </div>
                <div className='flex flex-col gap2'>
                    <span className='text-muted-text'>RMSE</span>
                    <span className='text-2xl'>2.48M</span>
                    <span className='text-lime-accent'>12.4%</span>
                </div>
            </div>
            <div className='flex gap-4 dashboard-card items-center'>
                <div className='bg-dark-hover p-4 rounded-2xl border-dark-border border'>
                    <ScatterPlottIcon fill={'transparent'} stroke={'#'} size={'2.5'} />
                </div>
                <div className='flex flex-col gap2'>
                    <span className='text-muted-text'>R² Score</span>
                    <span className='text-2xl'>0.92</span>
                    <span className='text-lime-accent'>3.1%</span>

                </div>
            </div>
            <div className='flex gap-4 dashboard-card items-center'>
                <div className='bg-dark-hover p-4 rounded-2xl border-dark-border border'>
                    <CrossHairIcon fill={'transparent'} stroke={'#c2f02d'} size={'2.5'} />
                </div>
                <div className='flex flex-col gap2'>
                    <span className='text-muted-text'>Exactitud</span>
                    <span className='text-2xl'>92.3%</span>
                    <span className='text-lime-accent'>2.8%</span>

                </div>
            </div>
        </div>
    )
}

export default HomeData
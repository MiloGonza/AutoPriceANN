import AsideItem from './AsideItem';
import HomeIcon from '../assets/icons/HomeIcon';
import DatabaseIcon from '../assets/icons/DatabaseIcon';
import { useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.png';


export function NavAsideBar() {

	const location = useLocation();
    const pathname = location.pathname;

	return (
		<nav className="w-70 h-screen bg-dark-card flex flex-col gap-5">
			<div className="mt-10 flex flex-col gap-5 h-full">
				<div className='Title flex flex-col items-center gap-2'>
					<img src={Logo} alt="Logo" className='h-16' />
					<h1 className='text-2xl'>AutoPriceANN</h1>
					<span className='text-sm text-muted-text w-1/2 text-center'>Estimador de precios de carros usados</span>
				</div>
				<div>
					<AsideItem
						to="/"
						path={pathname}
						label="Inicio"
						icon={
							<HomeIcon
								size={2}
								fill={pathname === "/" ? "transparent" : "currentColor"}
								stroke={pathname === "/" ? "#c2f02d" : "currentColor"}
							/>
						}
					/>
					<AsideItem
                        to="/datasets"
                        path={pathname}
                        label="Datasets guardados"
                        icon={
                            <DatabaseIcon
                                size={2}
                                fill={pathname === "/datasets" ? "transparent" : "currentColor"}
                                stroke={pathname === "/datasets" ? "#c2f02d" : "currentColor"}
                            />
                        }
                    />
				</div>
			</div>
		</nav>
	);
}
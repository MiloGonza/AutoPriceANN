import { useEffect, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCSVStore } from "../stores/useCSVStore"
import { useGeneralStore } from "../stores/useGeneralStore"
import { ImportCSVs } from "../../../api/Api"
import DatasetCard from "../components/DatasetCard"

function DataSets() {
	const { datasets, page, totalPages, loading, error, fetchDatasets, setPage } = useCSVStore()
	const selectCSVFromDatasets = useGeneralStore((s) => s.selectCSVFromDatasets)
	const navigate = useNavigate()
	const [selectedId, setSelectedId] = useState(null)

	useEffect(() => {
		fetchDatasets(page)
	}, [page, fetchDatasets])

	const handleImport = useCallback(async () => {
		const filePaths = await window.api.openFileDialog()
		if (!filePaths) return

		for (const path of filePaths) {
			await ImportCSVs({ filePath: path })
		}
		fetchDatasets(page)
	}, [fetchDatasets, page])

	const handleSelect = useCallback(async (dataset) => {
		if (selectedId === dataset.id) {
			await selectCSVFromDatasets(dataset)
			await 
			navigate('/')
		} else {
			setSelectedId(dataset.id)
		}
	}, [selectedId, selectCSVFromDatasets, navigate])

	const pageNumbers = []
	for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)

	if (loading) {
		return (
			<div className="flex flex-col h-[calc(100vh-1rem)] p-10 gap-4 bg-dark-bg rounded-2xl m-2 items-center justify-center">
				<span className="text-muted-text">Cargando datasets...</span>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex flex-col h-[calc(100vh-1rem)] p-10 gap-4 bg-dark-bg rounded-2xl m-2 items-center justify-center">
				<span className="text-red-500">{error}</span>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-[calc(100vh-1rem)] p-10 gap-4 bg-dark-bg rounded-2xl m-2">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl">Todos los Datasets</h2>
					<p className="text-muted-text">Archivos CSV registrados en el sistema</p>
				</div>
				<button onClick={handleImport} className="btn btnAnimate px-4 py-2 rounded-xl text-sm">
					Importar CSV
				</button>
			</div>

			<div className="flex-1 min-h-0 overflow-y-auto">
				{datasets.length > 0 ? (
					<div className="grid grid-cols-3 gap-4 overflow-hidden py-4 px-6">
						{datasets.map((ds, i) => (
							<DatasetCard key={ds.id} dataset={ds} index={i} selected={ds.id === selectedId} onSelect={handleSelect} />
						))}
					</div>
				) : (
					<div className="flex items-center justify-center h-full">
						<span className="text-muted-text">No hay datasets registrados</span>
					</div>
				)}
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 pt-2">
					<button
						onClick={() => setPage(page - 1)}
						disabled={page <= 1}
						className="px-3 py-1.5 rounded-lg border border-dark-border text-muted-text text-sm hover:text-white hover:border-lime-accent/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
					>
						Anterior
					</button>

					{pageNumbers.map((n) => (
						<button
							key={n}
							onClick={() => setPage(n)}
							className={`w-8 h-8 rounded-lg text-sm transition-all ${
								n === page
									? "bg-lime-accent text-black font-bold"
									: "border border-dark-border text-muted-text hover:text-white hover:border-lime-accent/40"
							}`}
						>
							{n}
						</button>
					))}

					<button
						onClick={() => setPage(page + 1)}
						disabled={page >= totalPages}
						className="px-3 py-1.5 rounded-lg border border-dark-border text-muted-text text-sm hover:text-white hover:border-lime-accent/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
					>
						Siguiente
					</button>
				</div>
			)}
		</div>
	)
}

export default DataSets
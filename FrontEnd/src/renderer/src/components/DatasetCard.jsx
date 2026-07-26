/* eslint-disable react/prop-types */
import { useMemo } from "react"

function MiniBarChart({ accidentsByYear = [], color = "#c2f02d" }) {
	const maxCount = useMemo(
		() => Math.max(...accidentsByYear.map((d) => d.accidents + d.noAccidents), 1),
		[accidentsByYear]
	)

	return (
		<div className="flex items-end gap-1 h-full w-full">
			{accidentsByYear.map((d) => {
				const total = d.accidents + d.noAccidents
				const accidentRatio = total > 0 ? d.accidents / total : 0
				return (
					<div key={d.year} className="flex flex-col items-center flex-1 h-full justify-end gap-1">
						<div
							className="w-full rounded-t"
							style={{
								height: `${(total / maxCount) * 100}%`,
								background: `linear-gradient(to top, #ef4444 0%, #ef4444 ${accidentRatio * 100}%, ${color} ${accidentRatio * 100}%, ${color} 100%)`,
								opacity: 0.85,
							}}
						/>
						<span className="text-[8px] text-muted-text truncate w-full text-center">{d.year}</span>
					</div>
				)
			})}
		</div>
	)
}

const chartColors = ["#c2f02d", "#38bdf8", "#a855f7", "#f06292", "#fb923c"]

export default function DatasetCard({ dataset, index = 0, selected, onSelect }) {
	const { analysis, fileName } = dataset

	const ready = analysis?.readyForTraining ?? false
	const records = analysis?.totalRecords ?? 0
	const accidentPct = analysis?.accidentPercentage ?? 0
	const noAccidentPct = analysis?.noAccidentPercentage ?? 0
	const accidentsByYear = analysis?.accidentsByYear ?? []

	return (
		<div
			onClick={() => onSelect?.(dataset)}
			className={`hover:z-99 rounded-2xl border bg-dark-card overflow-hidden flex flex-col cursor-pointer transition-all duration-200 hover:scale-110 ${
				selected
					? "border-lime-accent shadow-[0_0_15px_rgba(194,240,45,0.15)]"
					: "border-dark-border"
			}`}
		>
			<div className="p-4 flex flex-col gap-3 flex-1">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3 min-w-0">
						<div className="w-9 h-9 rounded-full bg-lime-accent/20 flex items-center justify-center shrink-0">
							<span className="text-lime-accent text-sm font-bold">
								{fileName?.charAt(0) || "?"}
							</span>
						</div>
						<div className="min-w-0">
							<span className="text-white text-sm font-medium block truncate">
								{fileName}
							</span>
							<span className={`text-xs ${ready ? "text-lime-accent" : "text-red-500"}`}>
								{ready ? "Listo para entrenar" : "Faltan columnas"}
							</span>
						</div>
					</div>
					<div className="text-right shrink-0">
						<span className="text-xl font-bold text-white block">{records}</span>
						<span className="text-[10px] text-muted-text">registros</span>
					</div>
				</div>

				<div className="flex gap-3 text-xs">
					<div className="flex items-center gap-1.5">
						<div className="w-2 h-2 rounded-full bg-red-500" />
						<span className="text-muted-text">{accidentPct}% accidentes</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
						<span className="text-muted-text">{noAccidentPct}% sin accidentes</span>
					</div>
				</div>
			</div>

			{accidentsByYear.length > 0 && (
				<div className="h-24 px-3 pb-2">
					<MiniBarChart
						accidentsByYear={accidentsByYear}
						color={chartColors[index % chartColors.length]}
					/>
				</div>
			)}
		</div>
	)
}

/* eslint-disable react/prop-types */
import { useState, useRef, useCallback, useMemo, useEffect } from "react"

const ROW_HEIGHT = 36
const BUFFER = 8

function generateMockData(count = 80) {
	const rows = []
	let trainLoss = 2.5
	let testLoss = 2.8
	let trainAcc = 10
	let testAcc = 8
	for (let i = 1; i <= count; i++) {
		trainLoss = Math.max(0.01, trainLoss - (Math.random() * 0.08 + 0.01))
		testLoss = Math.max(0.02, testLoss - (Math.random() * 0.07 + 0.01))
		trainAcc = Math.min(99.5, trainAcc + (Math.random() * 3 + 0.5))
		testAcc = Math.min(98.5, testAcc + (Math.random() * 2.8 + 0.4))
		rows.push({
			epoch: i,
			trainLoss: Number(trainLoss.toFixed(4)),
			testLoss: Number(testLoss.toFixed(4)),
			trainAccuracy: Number(trainAcc.toFixed(2)),
			testAccuracy: Number(testAcc.toFixed(2)),
		})
	}
	return rows
}

export default function TrainResultsTable({ progress = 0 }) {
	const [scrollY, setScrollY] = useState(0)
	const containerRef = useRef(null)
	const data = useMemo(() => generateMockData(80), [])
	const totalRows = data.length
	const totalHeight = totalRows * ROW_HEIGHT

	const startIndex = Math.max(0, Math.floor(scrollY / ROW_HEIGHT) - BUFFER)
	const endIndex = Math.min(
		totalRows,
		Math.ceil((scrollY + (containerRef.current?.clientHeight || 500)) / ROW_HEIGHT) + BUFFER
	)
	const visibleRows = data.slice(startIndex, endIndex)

	const handleScroll = useCallback(() => {
		if (containerRef.current) {
			setScrollY(containerRef.current.scrollTop)
		}
	}, [])

	useEffect(() => {
		const el = containerRef.current
		if (!el) return
		setScrollY(el.scrollTop)
	}, [])

	const columns = [
		{ key: "epoch", label: "Epoca", align: "center" },
		{ key: "trainLoss", label: "Train Loss", align: "right" },
		{ key: "testLoss", label: "Test Loss", align: "right" },
		{ key: "trainAccuracy", label: "Train MAE", align: "right" },
		{ key: "testAccuracy", label: "Test MAE", align: "right" },
	]

	return (
		<div className="flex flex-col gap-3 flex-1 min-h-0">
			<div className="flex items-center gap-4">
				<span className="text-sm text-muted-text whitespace-nowrap">Progreso</span>
				<div className="flex-1 h-3 rounded-full bg-dark-border overflow-hidden">
					<div
						className="h-full rounded-full transition-all duration-500"
						style={{
							width: `${progress}%`,
							background: "linear-gradient(to right, var(--color-lime-accent), var(--color-pink-accent), var(--color-purple-accent))",
						}}
					/>
				</div>
				<span className="text-sm text-white font-medium w-12 text-right">{Math.round(progress)}%</span>
			</div>

			<div className="flex flex-col flex-1 min-h-0 rounded-2xl border border-dark-border bg-dark-card overflow-hidden">
				<div className="grid grid-cols-5 gap-2 px-4 py-2.5 border-b border-dark-border bg-dark-card text-xs font-semibold text-muted-text uppercase tracking-wider shrink-0">
					{columns.map((col) => (
						<span key={col.key} className={`text-${col.align}`}>
							{col.label}
						</span>
					))}
				</div>

				<div
					ref={containerRef}
					onScroll={handleScroll}
					className="flex-1 min-h-0 overflow-y-auto"
				>
					<div style={{ height: totalHeight, position: "relative" }}>
						{visibleRows.map((row, vi) => {
							const realIndex = startIndex + vi
							const top = realIndex * ROW_HEIGHT
							const isEven = realIndex % 2 === 0
							return (
								<div
									key={row.epoch}
									className={`absolute left-0 right-0 grid grid-cols-5 gap-2 px-4 text-sm ${isEven ? "bg-dark-card" : "bg-dark-bg/50"}`}
									style={{ top, height: ROW_HEIGHT, alignItems: "center" }}
								>
									<span className="text-center text-lime-accent font-medium">{row.epoch}</span>
									<span className="text-right text-pink-accent">{row.trainLoss}</span>
									<span className="text-right text-pink-accent/70">{row.testLoss}</span>
									<span className="text-right text-lime-accent">{row.trainAccuracy}</span>
									<span className="text-right text-lime-accent/70">{row.testAccuracy}</span>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

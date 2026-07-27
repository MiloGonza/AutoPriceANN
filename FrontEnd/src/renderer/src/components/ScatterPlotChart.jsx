/* eslint-disable react/prop-types */
import {
	ScatterChart as ReScatterChart,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine,
} from "recharts"

function formatValue(v) {
	if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
	if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`
	return v.toFixed(1)
}

const CustomTooltip = ({ active, payload }) => {
	if (!active || !payload?.length) return null
	const d = payload[0].payload
	return (
		<div className="bg-dark-card border border-dark-border rounded-xl px-4 py-3 shadow-lg">
			<p className="text-muted-text text-xs mb-1">Punto de prueba</p>
			<p className="text-sm" style={{ color: "#38bdf8" }}>
				Real: ${formatValue(d.real)}
			</p>
			<p className="text-sm" style={{ color: "#c2f02d" }}>
				Predicho: ${formatValue(d.predicted)}
			</p>
		</div>
	)
}

export default function ScatterPlotChart({ data, title = "Predicho vs Real" }) {
	if (!data || data.length === 0) return null

	const allVals = data.flatMap((d) => [d.real, d.predicted])
	const minVal = Math.min(...allVals) * 0.9
	const maxVal = Math.max(...allVals) * 1.1

	return (
		<div className="flex flex-col h-full gap-1">
			<div className="flex items-center justify-between shrink-0">
				<h3 className="text-sm font-semibold text-white">{title}</h3>
				<div className="flex items-center gap-4 text-xs">
					<div className="flex items-center gap-1.5">
						<div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#c2f02d" }} />
						<span className="text-muted-text">Puntos de prueba</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="w-4 h-0.5 border-t-2 border-dashed" style={{ borderColor: "#525866" }} />
						<span className="text-muted-text">Predicción perfecta</span>
					</div>
				</div>
			</div>
			<div className="flex-1 min-h-0">
				<ResponsiveContainer width="100%" height="100%">
					<ReScatterChart margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="#2a2d36" />
						<XAxis
							type="number"
							dataKey="real"
							name="Real"
							stroke="#525866"
							tick={{ fill: "#525866", fontSize: 11 }}
							axisLine={{ stroke: "#2a2d36" }}
							tickLine={false}
							tickFormatter={formatValue}
							domain={[minVal, maxVal]}
						/>
						<YAxis
							type="number"
							dataKey="predicted"
							name="Predicho"
							width={40}
							stroke="#525866"
							tick={{ fill: "#525866", fontSize: 11 }}
							axisLine={false}
							tickLine={false}
							tickFormatter={formatValue}
							domain={[minVal, maxVal]}
						/>
						<Tooltip content={<CustomTooltip />} />
						<ReferenceLine
							segment={[{ x: minVal, y: minVal }, { x: maxVal, y: maxVal }]}
							stroke="#525866"
							strokeDasharray="6 3"
							strokeWidth={1}
						/>
						<Scatter
							data={data}
							fill="#c2f02d"
							fillOpacity={0.7}
							r={4}
						/>
					</ReScatterChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}

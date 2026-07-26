/* eslint-disable react/prop-types */
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts"

const CustomTooltip = ({ active, payload, label }) => {
	if (!active || !payload?.length) return null
	return (
		<div className="bg-dark-card border border-dark-border rounded-xl px-4 py-3 shadow-lg">
			<p className="text-muted-text text-xs mb-2">Época {label}</p>
			{payload.map((entry) => (
				<p key={entry.name} className="text-sm" style={{ color: entry.color }}>
					{entry.name === "train" ? "Entrenamiento" : "Prueba"}: {entry.value}
				</p>
			))}
		</div>
	)
}

export default function TrainingChart({
	title,
	data,
	dataKeyTrain = "train",
	dataKeyTest = "test",
	yLabel = "",
	xLabel = "",
	colorTrain = "#c2f02d",
	colorTest = "#f06292",
}) {
	return (
		<div className="flex flex-col h-full gap-1">
			<div className="flex items-center justify-between shrink-0">
				<h3 className="text-sm font-semibold text-white">{title}</h3>
				<div className="flex items-center gap-4 text-xs">
					<div className="flex items-center gap-1.5">
						<div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: colorTrain }} />
						<span className="text-muted-text">Entrenamiento</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="w-4 h-0.5 rounded-full border-t-2 border-dashed" style={{ borderColor: colorTest }} />
						<span className="text-muted-text">Prueba</span>
					</div>
				</div>
			</div>
			<div className="flex-1 min-h-0">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="#2a2d36" vertical={false} />
						<XAxis
							dataKey="epoch"
							stroke="#525866"
							tick={{ fill: "#525866", fontSize: 11 }}
							axisLine={{ stroke: "#2a2d36" }}
							tickLine={false}
							label={xLabel ? { value: xLabel, position: "insideBottom", offset: -2, fill: "#525866", fontSize: 11 } : undefined}
						/>
						<YAxis
							stroke="#525866"
							tick={{ fill: "#525866", fontSize: 11 }}
							axisLine={false}
							tickLine={false}
							label={yLabel ? { value: yLabel, angle: -90, position: "insideCenter", offset: -5, fill: "#525866", fontSize: 11 } : undefined}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Line
							type="monotone"
							dataKey={dataKeyTrain}
							name="train"
							stroke={colorTrain}
							strokeWidth={2}
							dot={false}
							activeDot={{ r: 5, stroke: colorTrain, strokeWidth: 2, fill: "#181a20" }}
						/>
						<Line
							type="monotone"
							dataKey={dataKeyTest}
							name="test"
							stroke={colorTest}
							strokeWidth={2}
							strokeDasharray="6 3"
							dot={false}
							activeDot={{ r: 5, stroke: colorTest, strokeWidth: 2, fill: "#181a20" }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}

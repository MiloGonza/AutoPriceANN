/* eslint-disable react/prop-types */
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const sampleData = [
    { epoch: 1, real: 42000, predicted: 38500 },
    { epoch: 2, real: 43500, predicted: 41200 },
    { epoch: 3, real: 41000, predicted: 42800 },
    { epoch: 4, real: 45000, predicted: 44100 },
    { epoch: 5, real: 44200, predicted: 45300 },
    { epoch: 6, real: 46800, predicted: 45900 },
    { epoch: 7, real: 47500, predicted: 47200 },
    { epoch: 8, real: 46000, predicted: 47800 },
    { epoch: 9, real: 48900, predicted: 48100 },
    { epoch: 10, real: 49500, predicted: 49200 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-dark-card border border-dark-border rounded-xl px-4 py-3 shadow-lg">
            <p className="text-muted-text text-xs mb-2">Epoch {label}</p>
            {payload.map((entry) => (
                <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
                    {entry.name === "real" ? "Real" : "Predicho"}: ${entry.value.toLocaleString()}
                </p>
            ))}
        </div>
    );
};

export default function PredictionLineChart({ data = sampleData }) {
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#2a2d36"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="epoch"
                        stroke="#525866"
                        tick={{ fill: "#525866", fontSize: 12 }}
                        axisLine={{ stroke: "#2a2d36" }}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#525866"
                        tick={{ fill: "#525866", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        formatter={(value) => (value === "real" ? "Real" : "Predicho")}
                        wrapperStyle={{ paddingTop: 10 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="real"
                        stroke="#c2f02d"
                        strokeWidth={2.5}
                        dot={{ fill: "#c2f02d", r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, stroke: "#c2f02d", strokeWidth: 2, fill: "#181a20" }}
                    />
                    <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#a855f7"
                        strokeWidth={2.5}
                        strokeDasharray="6 3"
                        dot={{ fill: "#a855f7", r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, stroke: "#a855f7", strokeWidth: 2, fill: "#181a20" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

/* eslint-disable react/prop-types */
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

const sampleData = [
    { real: 35000, predicted: 33200 },
    { real: 42000, predicted: 44100 },
    { real: 28000, predicted: 27500 },
    { real: 51000, predicted: 49800 },
    { real: 38000, predicted: 39200 },
    { real: 45000, predicted: 43800 },
    { real: 32000, predicted: 34500 },
    { real: 48000, predicted: 47100 },
    { real: 55000, predicted: 52300 },
    { real: 29000, predicted: 31200 },
    { real: 41000, predicted: 40500 },
    { real: 46000, predicted: 48200 },
    { real: 37000, predicted: 35800 },
    { real: 53000, predicted: 54100 },
    { real: 44000, predicted: 42600 },
    { real: 39000, predicted: 41300 },
    { real: 50000, predicted: 48900 },
    { real: 33000, predicted: 35400 },
    { real: 47000, predicted: 46200 },
    { real: 43000, predicted: 45700 },
];

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="bg-dark-card border border-dark-border rounded-xl px-4 py-3 shadow-lg">
            <p className="text-sm text-[#c2f02d]">Real: ${d.real.toLocaleString()}</p>
            <p className="text-sm text-[#f06292]">Predicho: ${d.predicted.toLocaleString()}</p>
            <p className="text-xs text-muted-text mt-1">
                Diff: {d.predicted > d.real ? "+" : ""}${(d.predicted - d.real).toLocaleString()}
            </p>
        </div>
    );
};

export default function PredictionScatterChart({ data = sampleData }) {
    const allValues = data.flatMap((d) => [d.real, d.predicted]);
    const min = Math.floor(Math.min(...allValues) / 5000) * 5000;
    const max = Math.ceil(Math.max(...allValues) / 5000) * 5000;

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#2a2d36"
                    />
                    <XAxis
                        type="number"
                        dataKey="real"
                        name="Real"
                        stroke="#525866"
                        tick={{ fill: "#525866", fontSize: 12 }}
                        axisLine={{ stroke: "#2a2d36" }}
                        tickLine={false}
                        domain={[min, max]}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        label={{
                            value: "Precio Real",
                            position: "insideBottom",
                            offset: -5,
                            fill: "#525866",
                            fontSize: 12,
                        }}
                    />
                    <YAxis
                        type="number"
                        dataKey="predicted"
                        name="Predicho"
                        stroke="#525866"
                        tick={{ fill: "#525866", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[min, max]}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        label={{
                            value: "Precio Predicho",
                            angle: -90,
                            position: "insideLeft",
                            offset: 10,
                            fill: "#525866",
                            fontSize: 12,
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2a2d36", strokeDasharray: "3 3" }} />
                    <ReferenceLine
                        segment={[{ x: min, y: min }, { x: max, y: max }]}
                        stroke="#c2f02d"
                        strokeDasharray="6 3"
                        strokeWidth={1.5}
                        opacity={0.5}
                    />
                    <Scatter
                        data={data}
                        fill="#f06292"
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}

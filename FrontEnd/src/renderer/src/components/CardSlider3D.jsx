/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { motion } from "motion/react";

const chartColors = ["#c2f02d", "#f06292", "#a855f7", "#38bdf8", "#fb923c"];

function MiniBarChart({ accidentsByYear = [], color = "#c2f02d" }) {
    const maxCount = Math.max(
        ...accidentsByYear.map((d) => d.accidents + d.noAccidents),
        1
    );

    return (
        <div className="flex items-end gap-1.5 h-full w-full px-2 pb-4">
            {accidentsByYear.map((d) => {
                const total = d.accidents + d.noAccidents;
                const accidentRatio = total > 0 ? d.accidents / total : 0;
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
                        <span className="text-[9px] text-muted-text">{d.year}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default function CardSlider3D({ items = [] }) {
    const [selected, setSelected] = useState(0);

    const maxVisible = 5;
    const visibleItems = items.slice(0, maxVisible);
    const total = visibleItems.length;

    const goLeft = () => setSelected((s) => Math.max(0, s - 1));
    const goRight = () => setSelected((s) => Math.min(total - 1, s + 1));

    return (
        <div className="relative flex items-center gap-4 w-full h-full">
            <button
                onClick={goLeft}
                disabled={selected === 0}
                className="z-30 flex items-center justify-center w-10 h-10 rounded-full border border-dark-border bg-dark-card text-muted-text hover:text-white hover:border-lime-accent/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>

            <div
                className="relative flex items-center justify-center h-full flex-1"
                style={{ perspective: "1200px" }}
            >
                {visibleItems.map((item, i) => {
                    const offset = i - selected;
                    const absOffset = Math.abs(offset);
                    const isHidden = absOffset > 2;

                    const rotateY = offset * 20;
                    const translateX = offset * 300;
                    const translateZ = -absOffset * 120;
                    const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.2;
                    const scale = 1 - absOffset * 0.05;
                    const zIndex = total - absOffset;

                    if (isHidden) return null;

                    const ready = item.analysis?.readyForTraining ?? false;
                    const records = item.analysis?.totalRecords ?? 0;
                    const accidentPct = item.analysis?.accidentPercentage ?? 0;
                    const noAccidentPct = item.analysis?.noAccidentPercentage ?? 0;
                    const accidentsByYear = item.analysis?.accidentsByYear ?? [];

                    return (
                        <motion.div
                            key={i}
                            onClick={() => setSelected(i)}
                            animate={{
                                rotateY,
                                x: translateX,
                                z: translateZ,
                                opacity,
                                scale,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                            style={{
                                position: "absolute",
                                zIndex,
                                cursor: "pointer",
                                transformStyle: "preserve-3d",
                            }}
                            className={`w-full max-w-2xl h-64 rounded-2xl border flex flex-col select-none shrink-0 overflow-hidden ${
                                i === selected
                                    ? "border-lime-accent shadow-[0_0_15px_rgba(194,240,45,0.15)]"
                                    : "border-dark-border"
                            }`}
                        >
                            <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-dark-card to-dark-bg" />
                            <div className="relative z-10 flex flex-col h-full p-5 gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-lime-accent/20 flex items-center justify-center shrink-0">
                                            <span className="text-lime-accent text-lg font-bold">
                                                {item.fileName?.charAt(0) || "?"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-white text-base font-medium block">
                                                {item.fileName || `Item ${i + 1}`}
                                            </span>
                                            <span className={`text-xs ${ready ? "text-lime-accent" : "text-muted-text"}`}>
                                                {ready ? "Listo para entrenar" : "Faltan columnas"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-white block">{records}</span>
                                        <span className="text-xs text-muted-text">registros</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        <span className="text-muted-text">{accidentPct}% accidentes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-lime-accent" />
                                        <span className="text-muted-text">{noAccidentPct}% sin accidentes</span>
                                    </div>
                                </div>

                                <div className="flex-1 min-h-0">
                                    <MiniBarChart accidentsByYear={accidentsByYear} color={chartColors[i % chartColors.length]} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <button
                onClick={goRight}
                disabled={selected === total - 1}
                className="z-30 flex items-center justify-center w-10 h-10 rounded-full border border-dark-border bg-dark-card text-muted-text hover:text-white hover:border-lime-accent/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 z-30">
                {visibleItems.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            i === selected
                                ? "bg-lime-accent w-6"
                                : "bg-dark-border hover:bg-muted-text w-2"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

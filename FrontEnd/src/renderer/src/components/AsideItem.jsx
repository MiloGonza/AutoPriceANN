/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { motion } from "motion/react";

function AsideItem({ to, label, icon, path }) {
    const active = path === to;

    return (
        <Link to={to} className="block w-full">
            <div className="relative w-full overflow-visible px-4 py-1">
                {active && (
                    <motion.span
                        layoutId="sidebar-indicator"
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                        }}
                        className="
                      absolute left-0 top-1/2 z-20 h-11 w-1.25
                      -translate-y-1/2 rounded-r-full
                      bg-lime-accent
                      blur-[0.2px]
                      shadow-[0_0_12px_rgba(194,240,45,1),0_0_26px_rgba(194,240,45,0.95),0_0_52px_rgba(194,240,45,0.6),0_0_80px_rgba(194,240,45,0.35)]
                    "/>
                )}

                <div
                    className={[
                        "ml-3 flex items-center gap-3 rounded-xl px-4 py-4 transition-all duration-300",
                        active
                            ? "bg-[#26262D] shadow-[0_0_0_1px_rgba(194,240,45,0.15)]"
                            : "hover:bg-lime-accent/10",
                    ].join(" ")}
                >
                    {icon}

                    <span
                        className={
                            active
                                ? "text-lime-accent font-medium"
                                : "text-white font-medium"
                        }
                    >
                        {label}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default AsideItem;
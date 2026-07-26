/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "motion/react";

const routeOrder = {
    "/": 0,
    "/datasets": 1,
};

export default function AnimatedRoutes({ location, previousPath, children }) {
    const currentIndex = routeOrder[location.pathname] ?? 0;
    const previousIndex = routeOrder[previousPath.current] ?? 0;

    const direction =
        currentIndex >= previousIndex ? "backward" : "forward";

    const variants = {
        enter: (dir) => ({
            y: dir === "forward" ? "-100%" : "100%",
            opacity: 0,
        }),
        center: {
            y: 0,
            opacity: 1,
        },
        exit: (dir) => ({
            y: dir === "forward" ? "100%" : "-100%",
            opacity: 0,
        }),
    };

    return (
        <div className="relative h-full min-h-0 overflow-hidden">
            <AnimatePresence
                mode="sync"
                initial={false}
                custom={direction}
            >
                <motion.div
                    key={location.pathname}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-0 h-full w-full overflow-hidden"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

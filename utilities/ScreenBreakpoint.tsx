"use client";

import { useEffect, useState } from "react";

export default function ScreenBreakpoint() {
    const [breakpoint, setBreakpoint] = useState("");

    const getBreakpoint = (width: number) => {
        if (width < 640) return "sm";
        if (width < 768) return "md";
        if (width < 1024) return "lg";
        if (width < 1280) return "xl";
        if (width < 1536) return "2xl";
        return "≥2xl";
    };

    useEffect(() => {
        const updateBreakpoint = () => {
            const width = window.innerWidth;
            setBreakpoint(getBreakpoint(width));
        };

        updateBreakpoint();
        window.addEventListener("resize", updateBreakpoint);
        return () => window.removeEventListener("resize", updateBreakpoint);
    }, []);
    if (process.env.NODE_ENV !== "development") return null;
    return (
        <div className="fixed bottom-12 right-4 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-4xl shadow-lg text-sm font-mono z-50">
            {/* <span>Breakpoint: </span> */}
            <span className="font-bold">{breakpoint}</span>
        </div>
    );
}

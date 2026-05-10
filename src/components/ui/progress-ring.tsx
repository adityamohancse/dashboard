"use client";

import { motion } from "framer-motion";
import { type ReactNode, useId } from "react";

export function ProgressRing({
  value,
  label,
  size = 84,
  gradientFrom = "#22d3ee",
  gradientTo = "#8b5cf6",
  center,
}: {
  value: number;
  label: string;
  size?: number;
  gradientFrom?: string;
  gradientTo?: string;
  center?: ReactNode;
}) {
  const gradientId = useId();
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute rounded-full blur-xl"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          background: `radial-gradient(circle, ${gradientFrom}55, transparent 70%)`,
        }}
      />
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-200 dark:text-slate-700"
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1 }}
          style={{ strokeDasharray: circumference }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        {center ? <div className="mb-1 flex justify-center text-slate-300">{center}</div> : null}
        <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{clamped}%</p>
        <p className="text-[10px] text-slate-500">{label}</p>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PomodoroTimerProps {
  compact?: boolean;
}

export function PomodoroTimer({ compact = false }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [workMode, setWorkMode] = useState(true);

  const WORK_DURATION = 25 * 60;
  const BREAK_DURATION = 5 * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      if (workMode) {
        setSessionsCompleted((prev) => prev + 1);
      }
      setWorkMode(!workMode);
      setTimeLeft(workMode ? BREAK_DURATION : WORK_DURATION);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, workMode]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = workMode
    ? ((WORK_DURATION - timeLeft) / WORK_DURATION) * 100
    : ((BREAK_DURATION - timeLeft) / BREAK_DURATION) * 100;

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(WORK_DURATION);
    setWorkMode(true);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm font-semibold">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/[0.07] border border-white/10 rounded-2xl p-6 backdrop-blur-2xl"
    >
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-sm font-semibold text-white/70">
          {workMode ? "Focus Time" : "Break Time"}
        </h3>

        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <motion.circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke={workMode ? "#00d4ff" : "#10b981"}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - progress / 100)}`}
              strokeLinecap="round"
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
          <div className="absolute text-center">
            <div className="text-4xl font-bold text-white">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" /> Start
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="border-white/20"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-white/50">
          Sessions completed: <span className="font-semibold text-white/70">{sessionsCompleted}</span>
        </div>
      </div>
    </motion.div>
  );
}

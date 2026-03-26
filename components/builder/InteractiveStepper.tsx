"use client";

import { motion } from "framer-motion";

interface Step {
  id: number;
  label: string;
}

interface InteractiveStepperProps {
  currentStep: number;
  steps: Step[];
}

export default function InteractiveStepper({ currentStep, steps }: InteractiveStepperProps) {
  return (
    <div className="w-full mb-8">
      {/* Progress Bar Background */}
      <div className="relative h-1 bg-white/5 rounded-full overflow-hidden mb-6">
        {/* Emerald Glow Progress Line */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.8) 50%, rgba(16, 185, 129, 0.3) 100%)",
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.3)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isPending = step.id > currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              {/* Step Circle */}
              <motion.div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isActive
                    ? "bg-emerald-500/20 border-2 border-emerald-500"
                    : isCompleted
                    ? "bg-emerald-500 border-2 border-emerald-500"
                    : "bg-white/[0.03] border-2 border-white/10"
                }`}
                animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={isActive ? { duration: 2, repeat: Infinity } : {}}
              >
                {/* Inner glow for active step */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      background: "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)",
                    }}
                  />
                )}

                <span
                  className={`relative z-10 text-sm font-semibold ${
                    isActive
                      ? "text-emerald-400"
                      : isCompleted
                      ? "text-white"
                      : "text-zinc-500"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.id
                  )}
                </span>
              </motion.div>

              {/* Step Label */}
              <span
                className={`text-xs font-mono uppercase tracking-wider transition-colors duration-300 ${
                  isActive
                    ? "text-emerald-400"
                    : isCompleted
                    ? "text-zinc-300"
                    : "text-zinc-600"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

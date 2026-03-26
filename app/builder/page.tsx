"use client";

export const dynamic = 'force-static';
export const revalidate = 3600;

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Loader2 } from "lucide-react";
import {
  updateBuilderState,
  decodeBuilderUrl,
  type BuilderState,
  type BuilderAction,
} from "@/lib/builder-actions";
import StepPlan from "@/components/builder/StepPlan";
import StepCategory from "@/components/builder/StepCategory";
import StepOS from "@/components/builder/StepOS";
import StepBuild from "@/components/builder/StepBuild";
import InteractiveStepper from "@/components/builder/InteractiveStepper";
import Navbar from "@/components/Navbar";

// ============================================
// Animation Variants
// ============================================

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

// ============================================
// Initial State
// ============================================

const initialState: BuilderState = {
  step: 1,
  plan: null,
  category: null,
  os: null,
  recommendedGPU: null,
  totalPrice: 0,
  shareableUrl: "",
};

const steps = [
  { id: 1, label: "Plan" },
  { id: 2, label: "Task" },
  { id: 3, label: "OS" },
  { id: 4, label: "Build" },
];

// ============================================
// Loading Component
// ============================================

function BuilderLoading() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
        <p className="text-zinc-400">Loading AI Forge Builder...</p>
      </div>
    </div>
  );
}

// ============================================
// Main Builder Wizard
// ============================================

function BuilderWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<BuilderState>(initialState);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Load from URL on mount
  useEffect(() => {
    const loadFromUrl = async () => {
      const params = Object.fromEntries(searchParams.entries());
      const decoded = await decodeBuilderUrl(params);
      
      if (decoded) {
        setState((prev) => ({
          ...prev,
          ...decoded,
        }));
      }
      
      setIsLoading(false);
    };

    loadFromUrl();
  }, [searchParams]);

  // Update URL when state changes (only for completed builds)
  useEffect(() => {
    if (state.step === 4 && state.shareableUrl) {
      router.replace(`/builder${state.shareableUrl}`, { scroll: false });
    }
  }, [state.step, state.shareableUrl, router]);

  // Handle state updates via Server Actions
  const dispatch = async (action: BuilderAction) => {
    setDirection(action.type === "RESET" || action.type === "SET_PLAN" ? -1 : 1);
    
    if (action.type === "RESET") {
      setState(initialState);
      router.replace("/builder", { scroll: false });
      return;
    }

    const newState = await updateBuilderState(state, action);
    setState(newState);
  };

  // Step handlers
  const handlePlanSelect = (planId: string) => {
    dispatch({ type: "SET_PLAN", payload: planId });
  };

  const handleCategorySelect = (categoryId: string) => {
    dispatch({ type: "SET_CATEGORY", payload: categoryId });
  };

  const handleOSSelect = (osId: string) => {
    dispatch({ type: "SET_OS", payload: osId });
  };

  const handleBack = () => {
    if (state.step > 1) {
      setDirection(-1);
      setState((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  if (isLoading) {
    return <BuilderLoading />;
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      {/* Header Section */}
      <div className="relative border-b border-white/5">
        {/* Background Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-geometric">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="label-mono">Interactive Wizard</span>
            </div>
            <h1 className="headline-hero text-4xl md:text-5xl lg:text-6xl mb-4">
              AI Forge Builder
            </h1>
            <p className="body-premium text-lg max-w-2xl">
              Configure your optimal AI workstation through our guided wizard. 
              Select your tier, task, and OS to receive tailored hardware recommendations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Builder Container */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Wizard */}
          <div className="lg:col-span-2">
            {/* Glassmorphism Container */}
            <div
              className="relative rounded-2xl p-8 md:p-10"
              style={{
                background: "rgba(255, 255, 255, 0.01)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {/* Stepper */}
              <InteractiveStepper currentStep={state.step} steps={steps} />

              {/* Step Content with Sliding Animation */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={state.step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                >
                  {state.step === 1 && (
                    <StepPlan
                      selectedPlan={state.plan}
                      onSelect={handlePlanSelect}
                    />
                  )}

                  {state.step === 2 && (
                    <StepCategory
                      selectedCategory={state.category}
                      selectedPlan={state.plan}
                      onSelect={handleCategorySelect}
                      onBack={handleBack}
                    />
                  )}

                  {state.step === 3 && (
                    <StepOS
                      selectedOS={state.os}
                      onSelect={handleOSSelect}
                      onBack={handleBack}
                    />
                  )}

                  {state.step === 4 && (
                    <StepBuild
                      plan={state.plan}
                      category={state.category}
                      os={state.os}
                      recommendedGPU={state.recommendedGPU}
                      totalPrice={state.totalPrice}
                      shareableUrl={state.shareableUrl}
                      onReset={handleReset}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column - Info Panel */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="sticky top-8 space-y-6"
            >
              {/* Current Selection Card */}
              <div className="glass-premium p-6">
                <h3 className="label-mono mb-4">Current Configuration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-zinc-500">Tier</span>
                    <span className={`text-sm font-medium ${state.plan ? "text-emerald-400" : "text-zinc-600"}`}>
                      {state.plan || "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-zinc-500">Task</span>
                    <span className={`text-sm font-medium ${state.category ? "text-emerald-400" : "text-zinc-600"}`}>
                      {state.category || "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-zinc-500">OS</span>
                    <span className={`text-sm font-medium ${state.os ? "text-emerald-400" : "text-zinc-600"}`}>
                      {state.os || "Not selected"}
                    </span>
                  </div>
                  {state.recommendedGPU && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-zinc-500">GPU</span>
                      <span className="text-sm font-medium text-emerald-400 truncate max-w-[150px]">
                        {state.recommendedGPU.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Card */}
              <div className="glass-premium p-6">
                <h3 className="label-mono mb-4">Builder Tips</h3>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    Higher VRAM enables larger models
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    NVIDIA GPUs offer best CUDA support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    Linux provides optimal AI performance
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Page Export with Suspense
// ============================================

export default function BuilderPage() {
  return (
    <Suspense fallback={<BuilderLoading />}>
      <BuilderWizard />
    </Suspense>
  );
}

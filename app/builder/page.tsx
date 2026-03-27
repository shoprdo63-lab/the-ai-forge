"use client";

export const dynamic = 'force-static';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Cpu, Loader2, Zap, ChevronLeft, ChevronRight, RotateCcw, Check } from "lucide-react";
import {
  updateBuilderState,
  decodeBuilderUrl,
  type BuilderState,
  type BuilderAction,
} from "@/lib/builder-actions";
import { Checkbox } from "@/components/ui/checkbox";

// ============================================
// MERCHANT CONFIG
// ============================================
const MERCHANTS = [
  { id: "amazon", name: "Amazon", color: "#ff9900", logo: "🛒" },
  { id: "newegg", name: "Newegg", color: "#f2711c", logo: "🥚" },
  { id: "bh", name: "B&H", color: "#c41230", logo: "📷" },
];

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

const plans = [
  { id: "budget", name: "Budget", price: 1500, description: "Entry-level AI workstation" },
  { id: "mid", name: "Mid-Range", price: 3000, description: "Balanced performance and price" },
  { id: "high", name: "High-End", price: 6000, description: "Professional AI workstation" },
  { id: "extreme", name: "Extreme", price: 10000, description: "Maximum performance" },
];

const categories = [
  { id: "llm", name: "LLM Inference", description: "Run large language models locally" },
  { id: "training", name: "Model Training", description: "Train neural networks from scratch" },
  { id: "rendering", name: "3D Rendering", description: "AI-assisted 3D rendering workflows" },
  { id: "multimodal", name: "Multimodal", description: "Vision, audio, and text processing" },
];

const osOptions = [
  { id: "linux", name: "Linux (Ubuntu)", description: "Best for AI/ML development" },
  { id: "windows", name: "Windows 11", description: "Gaming + AI compatibility" },
  { id: "wsl", name: "Windows + WSL2", description: "Best of both worlds" },
];

// ============================================
// Loading Component
// ============================================
function BuilderLoading() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-[#4f46e5] animate-spin mx-auto mb-4" />
        <p className="text-[#6b7280]">Loading AI Forge Builder...</p>
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

  // Update URL when state changes
  useEffect(() => {
    if (state.step === 4 && state.shareableUrl) {
      router.replace(`/builder${state.shareableUrl}`, { scroll: false });
    }
  }, [state.step, state.shareableUrl, router]);

  // Handle state updates
  const dispatch = async (action: BuilderAction) => {
    if (action.type === "RESET") {
      setState(initialState);
      router.replace("/builder", { scroll: false });
      return;
    }

    const newState = await updateBuilderState(state, action);
    setState(newState);
  };

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
      setState((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const handleNext = () => {
    if (state.step < 4) {
      setState((prev) => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  if (isLoading) {
    return <BuilderLoading />;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Blue Header - PCPartPicker Style */}
      <header className="bg-[#4f46e5] text-white">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">PC Builder</h1>
                <p className="text-sm text-white/70">
                  Configure your optimal AI workstation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Products
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Wizard */}
          <div className="lg:col-span-2">
            {/* Stepper */}
            <div className="bg-white border border-[#d1d5db] rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex items-center justify-between">
                {steps.map((step, idx) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      state.step >= step.id
                        ? "bg-[#4f46e5] text-white"
                        : "bg-[#e5e7eb] text-[#6b7280]"
                    }`}>
                      {state.step > step.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className={`ml-2 text-sm ${
                      state.step >= step.id ? "text-[#374151]" : "text-[#9ca3af]"
                    }`}>
                      {step.label}
                    </span>
                    {idx < steps.length - 1 && (
                      <div className="w-8 h-px bg-[#d1d5db] mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white border border-[#d1d5db] rounded-lg p-6 shadow-sm">
              {/* Step 1: Plan Selection */}
              {state.step === 1 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#374151] mb-2">Select Your Budget</h2>
                  <p className="text-sm text-[#6b7280] mb-6">Choose a budget tier that fits your needs</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => handlePlanSelect(plan.id)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          state.plan === plan.id
                            ? "border-[#4f46e5] bg-[#f5f3ff]"
                            : "border-[#d1d5db] hover:border-[#9ca3af]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#374151]">{plan.name}</span>
                          <span className="text-[#0d9488] font-semibold">${plan.price.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-[#6b7280]">{plan.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Category Selection */}
              {state.step === 2 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#374151] mb-2">Select Your Task</h2>
                  <p className="text-sm text-[#6b7280] mb-6">What will you primarily use this workstation for?</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          state.category === category.id
                            ? "border-[#4f46e5] bg-[#f5f3ff]"
                            : "border-[#d1d5db] hover:border-[#9ca3af]"
                        }`}
                      >
                        <div className="font-medium text-[#374151] mb-1">{category.name}</div>
                        <p className="text-xs text-[#6b7280]">{category.description}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-4 py-2 border border-[#d1d5db] rounded-lg text-[#374151] hover:bg-[#f9fafb]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: OS Selection */}
              {state.step === 3 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#374151] mb-2">Select Operating System</h2>
                  <p className="text-sm text-[#6b7280] mb-6">Choose your preferred OS environment</p>
                  <div className="space-y-3">
                    {osOptions.map((os) => (
                      <button
                        key={os.id}
                        onClick={() => handleOSSelect(os.id)}
                        className={`w-full p-4 border rounded-lg text-left transition-colors ${
                          state.os === os.id
                            ? "border-[#4f46e5] bg-[#f5f3ff]"
                            : "border-[#d1d5db] hover:border-[#9ca3af]"
                        }`}
                      >
                        <div className="font-medium text-[#374151] mb-1">{os.name}</div>
                        <p className="text-xs text-[#6b7280]">{os.description}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-4 py-2 border border-[#d1d5db] rounded-lg text-[#374151] hover:bg-[#f9fafb]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Build Summary */}
              {state.step === 4 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#374151] mb-2">Your Build</h2>
                  <p className="text-sm text-[#6b7280] mb-6">Review your configuration</p>
                  
                  <div className="bg-[#f9fafb] rounded-lg p-4 mb-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-[#e5e7eb]">
                        <span className="text-[#6b7280]">Budget Tier</span>
                        <span className="font-medium text-[#374151]">{plans.find(p => p.id === state.plan)?.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#e5e7eb]">
                        <span className="text-[#6b7280]">Primary Task</span>
                        <span className="font-medium text-[#374151]">{categories.find(c => c.id === state.category)?.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#e5e7eb]">
                        <span className="text-[#6b7280]">Operating System</span>
                        <span className="font-medium text-[#374151]">{osOptions.find(o => o.id === state.os)?.name}</span>
                      </div>
                      {state.recommendedGPU && (
                        <div className="flex justify-between py-2">
                          <span className="text-[#6b7280]">Recommended GPU</span>
                          <span className="font-medium text-[#0d9488]">{state.recommendedGPU.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 px-4 py-2 border border-[#d1d5db] rounded-lg text-[#374151] hover:bg-[#f9fafb]"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Start Over
                    </button>
                    <Link
                      href="/products"
                      className="flex items-center gap-2 px-4 py-2 bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca]"
                    >
                      <Zap className="w-4 h-4" />
                      Browse Products
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {state.step < 4 && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNext}
                    disabled={
                      (state.step === 1 && !state.plan) ||
                      (state.step === 2 && !state.category) ||
                      (state.step === 3 && !state.os)
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info Panel */}
          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              {/* Part List Box */}
              <div className="bg-white border border-[#d1d5db] rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-[#4f46e5] rounded flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-[#374151]">Current Configuration</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-[#f3f4f6]">
                    <span className="text-[#6b7280]">Tier</span>
                    <span className={`font-medium ${state.plan ? "text-[#0d9488]" : "text-[#9ca3af]"}`}>
                      {state.plan || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#f3f4f6]">
                    <span className="text-[#6b7280]">Task</span>
                    <span className={`font-medium ${state.category ? "text-[#0d9488]" : "text-[#9ca3af]"}`}>
                      {state.category || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#f3f4f6]">
                    <span className="text-[#6b7280]">OS</span>
                    <span className={`font-medium ${state.os ? "text-[#0d9488]" : "text-[#9ca3af]"}`}>
                      {state.os || "Not selected"}
                    </span>
                  </div>
                  {state.recommendedGPU && (
                    <div className="flex justify-between py-1">
                      <span className="text-[#6b7280]">GPU</span>
                      <span className="text-sm font-medium text-[#0d9488] truncate max-w-[150px]">
                        {state.recommendedGPU.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Merchants */}
              <div className="bg-white border border-[#d1d5db] rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-[#374151] mb-3">Merchants</h3>
                <div className="space-y-2">
                  {MERCHANTS.map((merchant) => (
                    <label key={merchant.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox defaultChecked />
                      <span className="text-sm text-[#4b5563] flex items-center gap-1">
                        <span style={{ color: merchant.color }}>{merchant.logo}</span>
                        {merchant.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-white border border-[#d1d5db] rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-[#374151] mb-3">Builder Tips</h3>
                <ul className="space-y-2 text-sm text-[#6b7280]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4f46e5]">•</span>
                    Higher VRAM enables larger models
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4f46e5]">•</span>
                    NVIDIA GPUs offer best CUDA support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4f46e5]">•</span>
                    Linux provides optimal AI performance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
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

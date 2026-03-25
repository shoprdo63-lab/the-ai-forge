"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Brain,
  Palette,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Cpu,
  HardDrive,
  Zap,
  ShoppingCart,
  Share2,
  ExternalLink,
  Check,
  Loader2,
  Monitor,
  Wind,
  CircuitBoard,
  MemoryStick,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  recommendBuild,
  useCases,
  type UseCase,
  type RecommendedBuild,
  encodeBuildToURL,
  decodeURLToBuild,
  generateAffiliateLinksForBuild,
  type AffiliateLinkGroup,
} from "@/lib/build-logic";
import { type HardwareComponent } from "@/data/components";

// ============================================
// Step Definitions
// ============================================

type Step = 1 | 2 | 3 | 4;

interface WizardState {
  step: Step;
  budget: number;
  useCase: UseCase | null;
  brandPreference: "nvidia-only" | "no-preference";
}

// ============================================
// Animation Variants
// ============================================

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

// ============================================
// Component Icons
// ============================================

const componentIcons: Record<string, React.ElementType> = {
  GPU: Monitor,
  CPU: Cpu,
  Motherboard: CircuitBoard,
  RAM: MemoryStick,
  Storage: HardDrive,
  PSU: Zap,
  Cooling: Wind,
};

// ============================================
// Use Case Card Component
// ============================================

function UseCaseCard({
  useCase,
  isSelected,
  onClick,
}: {
  useCase: (typeof useCases)[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon =
    useCase.icon === "MessageSquare"
      ? MessageSquare
      : useCase.icon === "Brain"
      ? Brain
      : Palette;

  return (
    <button
      onClick={onClick}
      className={`relative group w-full text-left p-6 rounded-xl border transition-all duration-300 ${
        isSelected
          ? "bg-emerald-500/10 border-emerald-500/50"
          : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Glow effect */}
      <div
        className={`absolute -inset-0.5 rounded-xl blur transition-all duration-300 ${
          isSelected ? "bg-emerald-500/20 opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${
            isSelected
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">
          {useCase.name}
        </h3>
        <p className="text-sm text-slate-400 mb-4">{useCase.description}</p>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
            Min {useCase.minVram}GB VRAM
          </span>
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
            ${useCase.minBudget.toLocaleString()}+
          </span>
        </div>
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </button>
  );
}

// ============================================
// Budget Slider Component
// ============================================

function BudgetSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const presets = [800, 1200, 2000, 3500, 5000, 8000];

  return (
    <div className="space-y-6">
      {/* Budget Display */}
      <div className="text-center">
        <div className="text-4xl font-bold text-emerald-400 mb-1">
          ${value.toLocaleString()}
        </div>
        <div className="text-sm text-slate-400">Total Build Budget</div>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="800"
          max="10000"
          step="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>$800</span>
          <span>$10,000+</span>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 justify-center">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`px-4 py-2 text-sm rounded-lg border transition-all ${
              value === preset
                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            ${preset.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Brand Preference Component
// ============================================

function BrandPreferenceCard({
  preference,
  isSelected,
  onClick,
}: {
  preference: {
    id: "nvidia-only" | "no-preference";
    name: string;
    description: string;
  };
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative group w-full text-left p-6 rounded-xl border transition-all duration-300 ${
        isSelected
          ? "bg-emerald-500/10 border-emerald-500/50"
          : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
      }`}
    >
      <div
        className={`absolute -inset-0.5 rounded-xl blur transition-all duration-300 ${
          isSelected ? "bg-emerald-500/20 opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative">
        <h3 className="text-lg font-semibold text-white mb-2">
          {preference.name}
        </h3>
        <p className="text-sm text-slate-400">{preference.description}</p>
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </button>
  );
}

// ============================================
// Component Card in Build Preview
// ============================================

function BuildComponentCard({
  component,
  index,
}: {
  component: HardwareComponent;
  index: number;
}) {
  const Icon = componentIcons[component.category] || Monitor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-slate-900/60 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-emerald-500/30 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-slate-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-500 uppercase">
              {component.category}
            </span>
            <span className="text-xs text-emerald-400">
              AI Score: {component.aiScore}
            </span>
          </div>

          <h4 className="text-sm font-semibold text-white truncate mb-1">
            {component.name}
          </h4>

          <p className="text-xs text-slate-400 line-clamp-1 mb-2">
            {component.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-400">
              ${component.price.toLocaleString()}
            </span>

            <Link
              href={component.affiliateLinks.amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              Buy
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Build Score Card
// ============================================

function BuildScoreCard({
  build,
  isCalculating,
}: {
  build: RecommendedBuild | null;
  isCalculating: boolean;
}) {
  if (isCalculating) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Calculating optimal build...</p>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-8">
        <div className="text-center">
          <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Ready to Build
          </h3>
          <p className="text-sm text-slate-400">
            Complete the wizard steps to generate your custom AI workstation recommendation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Your AI Build</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">AI Score</span>
            <span className="text-2xl font-bold text-emerald-400">
              {build.aiScore}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <div className="text-lg font-bold text-white">
              {build.totalVram}GB
            </div>
            <div className="text-xs text-slate-400">Total VRAM</div>
          </div>
          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <div className="text-lg font-bold text-white">
              {build.estimatedWattage}W
            </div>
            <div className="text-xs text-slate-400">Est. Power</div>
          </div>
          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <div className="text-lg font-bold text-emerald-400">
              ${build.totalPrice.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">Total Price</div>
          </div>
        </div>
      </div>

      {/* Components List */}
      <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto">
        <BuildComponentCard component={build.gpu} index={0} />
        <BuildComponentCard component={build.cpu} index={1} />
        <BuildComponentCard component={build.motherboard} index={2} />
        <BuildComponentCard component={build.ram} index={3} />
        <BuildComponentCard component={build.storage} index={4} />
        <BuildComponentCard component={build.psu} index={5} />
        <BuildComponentCard component={build.cooling} index={6} />
      </div>

      {/* Reasoning */}
      <div className="px-6 pb-6">
        <div className="p-4 bg-slate-800/50 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-2">
            Why this build?
          </h4>
          <ul className="space-y-1">
            {build.reasoning.map((reason, i) => (
              <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Affiliate Modal
// ============================================

function AffiliateModal({
  build,
  isOpen,
  onClose,
}: {
  build: RecommendedBuild | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedStore, setSelectedStore] = useState<"Amazon" | "eBay" | "AliExpress">("Amazon");

  if (!isOpen || !build) return null;

  const affiliateGroups = generateAffiliateLinksForBuild(build);
  const selectedGroup = affiliateGroups.find((g) => g.store === selectedStore);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-slate-900 border border-white/10 rounded-xl z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Add All to Cart</h3>
              <p className="text-sm text-slate-400 mt-1">
                Select a store to add all components
              </p>
            </div>

            {/* Store Tabs */}
            <div className="flex border-b border-white/10">
              {(["Amazon", "eBay", "AliExpress"] as const).map((store) => (
                <button
                  key={store}
                  onClick={() => setSelectedStore(store)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    selectedStore === store
                      ? "text-emerald-400 border-b-2 border-emerald-400"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {store}
                </button>
              ))}
            </div>

            {/* Links List */}
            <div className="p-4 max-h-[300px] overflow-y-auto space-y-2">
              {selectedGroup?.links.map((link, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <span className="text-sm text-slate-300 truncate flex-1 mr-4">
                    {link.name}
                  </span>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    ${link.price.toLocaleString()}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="p-4 border-t border-white/10 bg-slate-800/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400">Total at {selectedStore}</span>
                <span className="text-xl font-bold text-emerald-400">
                  ${selectedGroup?.totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// Main Builder Page
// ============================================

export default function BuilderPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading configurator...</p>
        </div>
      </div>
    }>
      <BuilderWizard />
    </Suspense>
  );
}

function BuilderWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<WizardState>({
    step: 1,
    budget: 2000,
    useCase: null,
    brandPreference: "no-preference",
  });

  const [direction, setDirection] = useState(1);
  const [build, setBuild] = useState<RecommendedBuild | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Load from URL on mount
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const decoded = decodeURLToBuild(params);
    if (decoded) {
      setState({
        step: 4,
        budget: decoded.budget,
        useCase: decoded.useCase,
        brandPreference: decoded.brandPreference,
      });
    }
  }, [searchParams]);

  // Calculate build when reaching step 4
  useEffect(() => {
    if (state.step === 4 && state.useCase) {
      setIsCalculating(true);
      const useCase = state.useCase;
      // Simulate calculation delay for UX
      setTimeout(() => {
        const recommended = recommendBuild({
          budget: state.budget,
          useCase: useCase,
          brandPreference: state.brandPreference,
        });
        setBuild(recommended);
        setIsCalculating(false);
      }, 800);
    }
  }, [state.step, state.budget, state.useCase, state.brandPreference]);

  const nextStep = () => {
    if (state.step < 4) {
      setDirection(1);
      setState((s) => ({ ...s, step: (s.step + 1) as Step }));
    }
  };

  const prevStep = () => {
    if (state.step > 1) {
      setDirection(-1);
      setState((s) => ({ ...s, step: (s.step - 1) as Step }));
    }
  };

  const handleShare = useCallback(() => {
    if (!state.useCase) return;

    const params = encodeBuildToURL({
      budget: state.budget,
      useCase: state.useCase,
      brandPreference: state.brandPreference,
    });

    const url = `${window.location.origin}/builder${params}`;
    navigator.clipboard.writeText(url);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  }, [state]);

  const brandPreferences = [
    {
      id: "nvidia-only" as const,
      name: "NVIDIA Only",
      description: "Best for training and maximum compatibility with CUDA",
    },
    {
      id: "no-preference" as const,
      name: "No Preference",
      description: "Consider all options including AMD for better value",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] transition-colors duration-500">
      {/* Header */}
      <div className="border-b border-[var(--card-border)]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-emerald-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              AI Workstation Configurator
            </h1>
          </div>
          <p className="text-[var(--text-secondary)] max-w-2xl">
            Answer a few questions and we&apos;ll recommend the optimal hardware configuration for your AI workloads.
          </p>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Wizard */}
          <div>
            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3, 4].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      state.step >= step
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {state.step > step ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step
                    )}
                  </div>
                  {i < 3 && (
                    <div
                      className={`w-12 h-0.5 transition-colors ${
                        state.step > step ? "bg-emerald-500" : "bg-slate-800"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={state.step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Step 1: Budget */}
                {state.step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">
                        What&apos;s your budget?
                      </h2>
                      <p className="text-slate-400">
                        Set your total build budget. We&apos;ll optimize the component
                        selection to maximize AI performance within your limit.
                      </p>
                    </div>

                    <BudgetSlider
                      value={state.budget}
                      onChange={(budget) => setState((s) => ({ ...s, budget }))}
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={nextStep}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Use Case */}
                {state.step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">
                        What will you use it for?
                      </h2>
                      <p className="text-slate-400">
                        Select your primary use case. This determines the optimal
                        balance between VRAM, compute power, and price.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {useCases.map((useCase) => (
                        <UseCaseCard
                          key={useCase.id}
                          useCase={useCase}
                          isSelected={state.useCase === useCase.id}
                          onClick={() =>
                            setState((s) => ({ ...s, useCase: useCase.id }))
                          }
                        />
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextStep}
                        disabled={!state.useCase}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Brand Preference */}
                {state.step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">
                        Brand preference?
                      </h2>
                      <p className="text-slate-400">
                        Choose your GPU brand preference. NVIDIA offers the best
                        software support, while AMD can provide better value.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {brandPreferences.map((pref) => (
                        <BrandPreferenceCard
                          key={pref.id}
                          preference={pref}
                          isSelected={state.brandPreference === pref.id}
                          onClick={() =>
                            setState((s) => ({
                              ...s,
                              brandPreference: pref.id,
                            }))
                          }
                        />
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextStep}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                      >
                        Generate Build
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Results */}
                {state.step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">
                        Your Recommended Build
                      </h2>
                      <p className="text-slate-400">
                        Based on your preferences, here&apos;s the optimal configuration
                        for maximum AI performance.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setShowAffiliateModal(true)}
                        disabled={isCalculating}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-lg font-medium transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add All to Cart
                      </button>
                      <button
                        onClick={handleShare}
                        disabled={isCalculating}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Build
                      </button>
                      <button
                        onClick={() => {
                          setState({
                            step: 1,
                            budget: 2000,
                            useCase: null,
                            brandPreference: "no-preference",
                          });
                          setBuild(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-lg font-medium transition-colors"
                      >
                        Start Over
                      </button>
                    </div>

                    {/* Share Toast */}
                    <AnimatePresence>
                      {showShareToast && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
                        >
                          <p className="text-sm text-emerald-400">
                            Build URL copied to clipboard!
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <BuildScoreCard build={build} isCalculating={isCalculating} />
          </div>
        </div>
      </div>

      {/* Affiliate Modal */}
      <AffiliateModal
        build={build}
        isOpen={showAffiliateModal}
        onClose={() => setShowAffiliateModal(false)}
      />
    </main>
  );
}

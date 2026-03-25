"use client";

import { useState, useMemo } from "react";
import { aiModels, AIModel, UseCase, useCaseRequirements } from "@/lib/ai-logic";
import { products, Product } from "@/lib/products";
import { useBuildStore } from "@/lib/store";
import { BrainCircuit, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DecisionEngineProps {
  onBuildGenerated: (build: Product[]) => void;
}

export default function DecisionEngine({ onBuildGenerated }: DecisionEngineProps) {
  const [selectedModel, setSelectedModel] = useState<AIModel>(aiModels[0]);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase>("Inference");
  const { setBuild } = useBuildStore();

  // --- Logic for mapping AI requirements to Hardware ---
  const requirements = useMemo(() => {
    const ucReq = useCaseRequirements[selectedUseCase];
    return {
      vram: Math.ceil(selectedModel.vramRequired * ucReq.vramMultiplier),
      ram: Math.ceil(selectedModel.ramRequired * ucReq.ramMultiplier),
    };
  }, [selectedModel, selectedUseCase]);

  const recommendedGPU = useMemo(() => {
    // Filter GPUs that meet VRAM requirement
    const gpus = products.filter(p => p.category === "GPU");
    const compatible = gpus.filter(p => {
      const vramStr = p.specs.vram?.match(/\d+/)?.[0];
      return vramStr ? parseInt(vramStr) >= requirements.vram : false;
    });

    // Sort by AI Score or Price
    return compatible.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))[0];
  }, [requirements]);

  const handleGenerateBuild = () => {
    if (!recommendedGPU) return;

    // Basic auto-build logic
    const build: Product[] = [recommendedGPU];

    // Find compatible CPU (Simplified: pick highest rated for now)
    const cpu = products.filter(p => p.category === "CPU").sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))[0];
    if (cpu) build.push(cpu);

    // Find compatible Motherboard
    const mobo = products.filter(p => p.category === "Motherboard")[0];
    if (mobo) build.push(mobo);

    // Find RAM (Simplified: first one for now)
    const ram = products.filter(p => p.category === "RAM")[0];
    if (ram) build.push(ram);

    // Find PSU
    const psu = products.filter(p => p.category === "PSU")[0];
    if (psu) build.push(psu);

    // Find Storage
    const storage = products.filter(p => p.category === "Storage")[0];
    if (storage) build.push(storage);

    setBuild(build);
    onBuildGenerated(build);
  };

  return (
    <div className="w-full space-y-6 border border-[#262626] p-6">
      <div>
        <div className="mb-4 flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-[#d4d4d4]" strokeWidth={1.5} />
          <h3 className="text-[14px] font-semibold leading-[1.6] text-white">AI Model Preset</h3>
        </div>
        <div className="grid gap-2">
          {aiModels.map((model) => (
            <Button
              key={model.id}
              type="button"
              variant="outline"
              onClick={() => setSelectedModel(model)}
              className={cn(
                "h-auto justify-start border px-4 py-3 text-left",
                selectedModel.id === model.id
                  ? "border-[#d4d4d4] text-white"
                  : "border-[#262626] text-[#a3a3a3]",
              )}
            >
              <div className="text-[14px] font-semibold leading-[1.6]">{model.name}</div>
              <div className="text-[12px] font-normal leading-[1.6] text-[#a3a3a3]">{model.vramRequired}GB VRAM target</div>
            </Button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#262626] pt-6">
        <h3 className="mb-4 text-[14px] font-semibold leading-[1.6] text-white">Runtime Protocol</h3>
        <div className="grid gap-2">
          {(["Inference", "Fine-tuning", "Training"] as UseCase[]).map((useCase) => (
            <Button
              key={useCase}
              type="button"
              variant="outline"
              onClick={() => setSelectedUseCase(useCase)}
              className={cn(
                "h-auto justify-start border px-4 py-3 text-left text-[12px]",
                selectedUseCase === useCase
                  ? "border-[#d4d4d4] text-white"
                  : "border-[#262626] text-[#a3a3a3]",
              )}
            >
              {useCase}
            </Button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#262626] pt-6">
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="border border-[#262626] p-4">
            <span className="text-[12px] text-[#a3a3a3]">VRAM</span>
            <div className="text-[14px] font-semibold leading-[1.6] text-white">{requirements.vram}GB</div>
          </div>
          <div className="border border-[#262626] p-4">
            <span className="text-[12px] text-[#a3a3a3]">RAM</span>
            <div className="text-[14px] font-semibold leading-[1.6] text-white">{requirements.ram}GB</div>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-8 border-[#262626] px-3 text-xs text-[#d4d4d4]"
          disabled={!recommendedGPU}
          onClick={handleGenerateBuild}
        >
          Generate Build
          <ArrowRight className="ml-2 h-3 w-3" strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
}


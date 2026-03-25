import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HardwareComponent } from '@/data/components';

interface CompatibilityState {
  selectedCPU: HardwareComponent | null;
  compatibleMotherboards: HardwareComponent[];
  filterBySocket: boolean;
  setSelectedCPU: (cpu: HardwareComponent | null) => void;
  setCompatibleMotherboards: (motherboards: HardwareComponent[]) => void;
  setFilterBySocket: (filter: boolean) => void;
  getSocketFilter: () => string | null;
}

export const useCompatibilityStore = create<CompatibilityState>()(
  persist(
    (set, get) => ({
      selectedCPU: null,
      compatibleMotherboards: [],
      filterBySocket: true,
      setSelectedCPU: (cpu) => set({ selectedCPU: cpu }),
      setCompatibleMotherboards: (motherboards) => set({ compatibleMotherboards: motherboards }),
      setFilterBySocket: (filter) => set({ filterBySocket: filter }),
      getSocketFilter: () => {
        const { selectedCPU, filterBySocket } = get();
        if (!filterBySocket || !selectedCPU) return null;
        return selectedCPU.specs.socket || null;
      },
    }),
    {
      name: 'ai-compatibility-engine',
    }
  )
);

// Smart Compatibility Engine
export function filterBySocketCompatibility(
  components: HardwareComponent[],
  selectedCPU: HardwareComponent | null,
  enabled: boolean
): HardwareComponent[] {
  if (!enabled || !selectedCPU) return components;
  
  const targetSocket = selectedCPU.specs.socket;
  if (!targetSocket) return components;

  return components.filter(component => {
    // If it's a motherboard, check if socket matches
    if (component.category === 'Motherboard') {
      return component.specs.socket === targetSocket;
    }
    // For other categories, return as-is
    return true;
  });
}

// Check if a motherboard is compatible with selected CPU
export function isMotherboardCompatible(motherboard: HardwareComponent, cpu: HardwareComponent | null): boolean {
  if (!cpu) return true;
  const cpuSocket = cpu.specs.socket;
  const moboSocket = motherboard.specs.socket;
  if (!cpuSocket || !moboSocket) return true;
  return moboSocket === cpuSocket;
}

// Get compatibility warning message
export function getCompatibilityWarning(motherboard: HardwareComponent, cpu: HardwareComponent | null): string | null {
  if (!cpu) return null;
  if (isMotherboardCompatible(motherboard, cpu)) return null;
  return `Socket mismatch: ${cpu.name} (${cpu.specs.socket}) → ${motherboard.name} (${motherboard.specs.socket})`;
}

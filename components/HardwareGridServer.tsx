import { hardwareComponents, type HardwareComponent } from "@/lib/constants";
import HardwareCard from "@/components/HardwareCard";

interface HardwareGridProps {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Server Component - no 'use client'
export default function HardwareGrid({
  category,
  brand,
  minPrice = 0,
  maxPrice = 30000,
}: HardwareGridProps) {
  // Server-side filtering
  const filteredComponents = hardwareComponents.filter((component) => {
    if (category && component.category !== category) return false;
    if (brand && component.brand !== brand) return false;
    if (component.price < minPrice || component.price > maxPrice) return false;
    return true;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredComponents.map((component, index) => (
        <HardwareCard
          key={component.id}
          component={component}
          index={index}
        />
      ))}
    </div>
  );
}

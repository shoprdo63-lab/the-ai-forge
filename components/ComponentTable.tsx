"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { HardwareComponent, Category, BudgetTier } from "@/data/ai-components";
import { getAffiliateUrl } from "@/data/ai-components";
import { ExternalLink, ShoppingCart, Check, Cpu, HardDrive, Zap, Wind, Microchip, CircuitBoard } from "lucide-react";

// Category icon mapping
const categoryIcons: Record<Category, React.ReactNode> = {
  GPU: <Microchip className="h-4 w-4" />,
  CPU: <Cpu className="h-4 w-4" />,
  Motherboard: <CircuitBoard className="h-4 w-4" />,
  RAM: <HardDrive className="h-4 w-4" />,
  Storage: <HardDrive className="h-4 w-4" />,
  PSU: <Zap className="h-4 w-4" />,
  Cooling: <Wind className="h-4 w-4" />,
};

// Budget tier colors
const tierColors: Record<BudgetTier, string> = {
  Entry: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Enthusiast: "bg-blue-100 text-blue-800 border-blue-200",
  Workstation: "bg-purple-100 text-purple-800 border-purple-200",
  Datacenter: "bg-amber-100 text-amber-800 border-amber-200",
};

// Budget tier badges
const tierBadges: Record<BudgetTier, string> = {
  Entry: "Entry Level",
  Enthusiast: "Enthusiast",
  Workstation: "Workstation",
  Datacenter: "Datacenter",
};

interface ComponentTableProps {
  components: HardwareComponent[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  showCategory?: boolean;
}

export function ComponentTable({ 
  components, 
  selectedIds, 
  onSelect,
  showCategory = true 
}: ComponentTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getKeySpecs = (component: HardwareComponent): string => {
    const { specs, category } = component;
    switch (category) {
      case "GPU":
        return `${specs.vram || ""} | ${specs.cuda || ""} CUDA | ${specs.tdp || ""}`;
      case "CPU":
        return `${specs.cores || ""}C/${specs.threads || ""}T | ${specs.clock || ""} | ${specs.socket || ""}`;
      case "Motherboard":
        return `${specs.socket || ""} | ${specs.chipset || ""} | ${specs.memorySupport || ""}`;
      case "RAM":
        return `${specs.capacity || ""} | ${specs.speed || ""} | ${specs.latency || ""}`;
      case "Storage":
        return `${specs.capacity || ""} | ${specs.type || ""} | ${specs.readSpeed || ""}`;
      case "PSU":
        return `${specs.wattage || ""} | ${specs.efficiency || ""} | ${specs.type || ""}`;
      case "Cooling":
        return `${specs.radiator || ""} | ${specs.type || ""} | ${specs.tdp || ""}`;
      default:
        return "";
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#e2e8f0] hover:bg-transparent">
            <TableHead className="w-12 p-4">
              <span className="sr-only">Select</span>
            </TableHead>
            {showCategory && (
              <TableHead className="w-24 p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Category
              </TableHead>
            )}
            <TableHead className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Component
            </TableHead>
            <TableHead className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Specs
            </TableHead>
            <TableHead className="w-28 p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide text-right">
              Price
            </TableHead>
            <TableHead className="w-36 p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center">
              Shop
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map((component) => {
            const isSelected = selectedIds.includes(component.id);
            const isHovered = hoveredRow === component.id;

            return (
              <TableRow
                key={component.id}
                className={`border-b border-[#e2e8f0] transition-colors ${
                  isSelected 
                    ? "bg-blue-50/50" 
                    : isHovered 
                      ? "bg-slate-50" 
                      : "bg-white"
                }`}
                onMouseEnter={() => setHoveredRow(component.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="p-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onSelect(component.id)}
                    className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </TableCell>
                
                {showCategory && (
                  <TableCell className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{categoryIcons[component.category]}</span>
                      <span className="text-sm font-medium text-slate-700">{component.category}</span>
                    </div>
                  </TableCell>
                )}

                <TableCell className="p-4">
                  <div className="flex items-start gap-3">
                    {component.imageUrl && (
                      <img
                        src={component.imageUrl}
                        alt={component.name}
                        className="w-12 h-12 rounded border border-slate-200 object-cover bg-slate-100"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 text-sm leading-tight">
                          {component.name}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-0.5 ${tierColors[component.budgetTier]}`}
                        >
                          {tierBadges[component.budgetTier]}
                        </Badge>
                        {!component.inStock && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 border-slate-200">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {component.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5">
                        {component.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag} 
                            className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="p-4">
                  <div className="text-sm text-slate-700 font-mono">
                    {getKeySpecs(component)}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    AI Score: <span className="font-semibold text-slate-700">{component.aiScore}/100</span>
                  </div>
                </TableCell>

                <TableCell className="p-4 text-right">
                  <div className="text-base font-bold text-slate-900">
                    {formatPrice(component.price)}
                  </div>
                  {component.price < component.msrp && (
                    <div className="text-xs text-slate-400 line-through">
                      {formatPrice(component.msrp)}
                    </div>
                  )}
                </TableCell>

                <TableCell className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-medium border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => window.open(getAffiliateUrl(component, "amazon"), "_blank")}
                            disabled={!component.inStock}
                          >
                            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                            Amazon
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">View on Amazon with affiliate link</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-medium border-slate-200 hover:bg-slate-50"
                            onClick={() => window.open(getAffiliateUrl(component, "ebay"), "_blank")}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">View on eBay with affiliate link</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default ComponentTable;

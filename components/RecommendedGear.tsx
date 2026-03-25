"use client";

import { RecommendedGearItem } from "@/lib/blog-data";
import { Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateAmazonSearchLink, generateEbaySearchLink } from "@/lib/affiliate";

interface RecommendedGearProps {
  items: RecommendedGearItem[];
}

export default function RecommendedGear({ items }: RecommendedGearProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.name} className="border border-[#262626] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[#d4d4d4]" strokeWidth={1.5} />
            <h3 className="text-[14px] font-semibold leading-[1.6] text-white">{item.name}</h3>
          </div>

          <p className="mb-4 text-[12px] font-normal leading-[1.6] text-[#a3a3a3]">{item.reason}</p>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-8 border-[#262626] px-3 text-xs text-[#d4d4d4]">
              <a href={generateAmazonSearchLink(item.name)} target="_blank" rel="noopener noreferrer">
                Amazon
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-8 border-[#262626] px-3 text-xs text-[#d4d4d4]">
              <a href={generateEbaySearchLink(item.name)} target="_blank" rel="noopener noreferrer">
                eBay
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

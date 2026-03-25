"use client";

import { useState } from "react";
import { Cpu, HardDrive, Zap, Monitor, Package, Fan, Battery } from "lucide-react";
import type { Product } from "@/lib/products";

interface ProductFrameProps {
  product: Product;
  isHovered?: boolean;
}

const categoryIcons: Record<Product["category"], any> = {
  GPU: Monitor,
  CPU: Cpu,
  Motherboard: HardDrive,
  RAM: Zap,
  Storage: HardDrive,
  PSU: Battery,
  Cooling: Fan,
  Workstation: Package,
  MiniPC: Monitor,
};

export function ProductFrame({ product, isHovered = false }: ProductFrameProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasImage = product.imageUrl && product.imageUrl.length > 0 && !imageError;
  const Icon = categoryIcons[product.category] || Package;

  return (
    <div className="relative w-[80px] h-[80px] flex items-center justify-center">
      <div className="relative h-[64px] w-[64px] overflow-hidden border border-[#262626]">

        {/* Content */}
        <div className="absolute inset-[1px] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
          {hasImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`h-full w-full object-contain p-1 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <Icon
              className="w-6 h-6 text-slate-600"
              strokeWidth={1.5}
            />
          )}

          {/* Loading state */}
          {!imageLoaded && hasImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#525252]" strokeWidth={1.5} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple non-animated version for static use
export function ProductFrameStatic({ product }: { product: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasImage = product.imageUrl && product.imageUrl.length > 0 && !imageError;
  const Icon = categoryIcons[product.category] || Package;

  return (
    <div className="h-[64px] w-[64px] border border-[#262626] bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      {hasImage ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`h-full w-full object-contain p-1 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      ) : (
        <Icon className="w-6 h-6 text-[#525252]" strokeWidth={1.5} />
      )}

      {!imageLoaded && hasImage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#525252]" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

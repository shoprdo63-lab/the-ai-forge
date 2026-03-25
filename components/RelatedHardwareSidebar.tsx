"use client";

import { Product } from '@/lib/products'
import Link from 'next/link'
import { ExternalLink, Plus, Minus } from 'lucide-react'
import { useBuildStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

interface RelatedHardwareSidebarProps {
  hardware: Product[]
}

export default function RelatedHardwareSidebar({ hardware }: RelatedHardwareSidebarProps) {
  const { selectedParts, addPart, removePart } = useBuildStore()

  if (hardware.length === 0) {
    return (
      <div className="sticky top-24">
        <div className="border border-[#262626] p-6">
          <h3 className="mb-4 text-[14px] font-semibold leading-[1.6] text-white">Related Hardware</h3>
          <p className="text-[12px] font-normal leading-[1.6] text-[#a3a3a3]">
            No specific hardware mentioned in this article.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-xs text-[#d4d4d4]"
          >
            Browse All Components →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-24">
      <div className="border border-[#262626] p-6">
        <h3 className="mb-4 text-[14px] font-semibold leading-[1.6] text-white">Related Hardware</h3>
        <p className="mb-6 text-[12px] font-normal leading-[1.6] text-[#a3a3a3]">
          Components mentioned in this analysis
        </p>

        <div className="space-y-4">
          {hardware.map((product) => {
            const isSelected = selectedParts.some((p) => p.id === product.id)
            
            return (
              <div
                key={product.id}
                className="border border-[#262626] p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="mb-1 text-[14px] font-semibold leading-[1.6] text-white">
                      {product.name}
                    </h4>
                    <p className="mb-2 text-[12px] font-normal leading-[1.6] text-[#a3a3a3]">
                      {product.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold leading-[1.6] text-white">
                        ${product.price.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1">
                        {isSelected ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs text-[#d4d4d4]"
                            onClick={() => removePart(product.id)}
                          >
                            <Minus className="w-3 h-3" strokeWidth={1.5} />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs text-[#d4d4d4]"
                            onClick={() => addPart(product)}
                          >
                            <Plus className="w-3 h-3" strokeWidth={1.5} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Specs */}
                <div className="space-y-1 text-[12px] font-normal leading-[1.6] text-[#a3a3a3]">
                  {product.category === 'GPU' && (
                    <>
                      <div>VRAM: {product.specs.vram}</div>
                      <div>CUDA: {product.specs.cuda}</div>
                      <div>TDP: {product.specs.tdp}</div>
                    </>
                  )}
                  {product.category === 'CPU' && (
                    <>
                      <div>Cores: {product.specs.cores}C/{product.specs.threads}T</div>
                      <div>Clock: {product.specs.clock}</div>
                      <div>TDP: {product.specs.tdp}</div>
                    </>
                  )}
                  {product.category === 'RAM' && (
                    <>
                      <div>Memory: {product.specs.memory}</div>
                      <div>Clock: {product.specs.clock}</div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Build Summary */}
        {selectedParts.length > 0 && (
          <div className="mt-6 border-t border-[#262626] pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[#a3a3a3]">Build Total</span>
              <span className="text-[14px] font-semibold leading-[1.6] text-white">
                ${selectedParts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
              </span>
            </div>
            <Button asChild variant="outline" className="h-8 w-full border-[#262626] px-3 text-xs text-[#d4d4d4]">
              <Link href="/">
                <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                View Complete Build
              </Link>
            </Button>
          </div>
        )}

        {/* Browse All */}
        <div className="mt-6 border-t border-[#262626] pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[#d4d4d4]"
          >
            Browse All Components →
          </Link>
        </div>
      </div>
    </div>
  )
}

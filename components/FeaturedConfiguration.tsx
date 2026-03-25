"use client";

import { Product } from '@/lib/products'
import { ExternalLink, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateAmazonSearchLink, generateEbaySearchLink } from '@/lib/affiliate'

interface FeaturedConfigurationProps {
  hardware: Product[]
}

export default function FeaturedConfiguration({ hardware }: FeaturedConfigurationProps) {
  if (hardware.length === 0) {
    return null
  }

  const totalPrice = hardware.reduce((sum, product) => sum + product.price, 0)

  return (
    <section className="mt-16 border-t border-[#262626] pt-6">
      <div className="border border-[#262626] p-6">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="h-4 w-4 text-[#d4d4d4]" strokeWidth={1.5} />
          <h2 className="text-[14px] font-semibold leading-[1.6] text-white">
            Featured Configuration
          </h2>
        </div>

        <p className="mb-6 text-[12px] font-normal leading-[1.6] text-[#a3a3a3]">
          This exact build configuration is available through our trusted partners. 
          All links include affiliate tracking to support our research.
        </p>

        {/* Component List */}
        <div className="mb-6 space-y-2">
          {hardware.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border border-[#262626] px-4 py-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="w-16 border border-[#262626] px-2 py-1 text-center text-xs text-[#a3a3a3]">
                    {product.category}
                  </span>
                  <span className="text-[14px] font-semibold leading-[1.6] text-white">
                    {product.name}
                  </span>
                </div>
                <div className="mt-1 text-[12px] font-normal leading-[1.6] text-[#a3a3a3]">
                  {product.category === 'GPU' && `${product.specs.vram} • ${product.specs.cuda} CUDA`}
                  {product.category === 'CPU' && `${product.specs.cores}C/${product.specs.threads}T • ${product.specs.clock}`}
                  {product.category === 'RAM' && `${product.specs.memory} • ${product.specs.clock}`}
                  {product.category === 'Storage' && `${product.specs.memory} • ${product.specs.bandwidth}`}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold leading-[1.6] text-white">
                  ${product.price.toLocaleString()}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-[#262626] px-3 text-xs text-[#d4d4d4]"
                  onClick={() => window.open(generateAmazonSearchLink(product.name), '_blank', 'noopener,noreferrer')}
                >
                  AMZ
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-[#262626] px-3 text-xs text-[#d4d4d4]"
                  onClick={() => window.open(generateEbaySearchLink(product.name), '_blank', 'noopener,noreferrer')}
                >
                  EBY
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Total and Actions */}
        <div className="flex items-center justify-between border-t border-[#262626] pt-6">
          <div>
            <div className="mb-1 text-xs text-[#a3a3a3]">Total Build Cost</div>
            <div className="text-[14px] font-semibold leading-[1.6] text-white">
              ${totalPrice.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-[#a3a3a3]">
              {hardware.length} components
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-8 border-[#262626] px-3 text-xs text-[#d4d4d4]"
              onClick={() => window.open('#', '_blank', 'noopener,noreferrer')}
            >
              Save Configuration
            </Button>
            <Button
              variant="outline"
              className="h-8 border-[#262626] px-3 text-xs text-[#d4d4d4]"
              onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="w-3 h-3 mr-2" strokeWidth={1.5} />
              Configure Build
            </Button>
          </div>
        </div>

        {/* Merchant Info */}
        <div className="mt-6 border-t border-[#262626] pt-6">
          <div className="text-xs text-[#a3a3a3]">
            <p className="mb-2">
              <strong>Available through:</strong> Amazon, eBay, AliExpress
            </p>
            <p>
              Prices and availability may vary. Affiliate links help support our independent hardware research.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

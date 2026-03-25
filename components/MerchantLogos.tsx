"use client";

// Professional merchant logos - SVG components with official brand styling

export function AmazonLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 30" className={className}>
      <text x="0" y="22" fontSize="16" fontWeight="700" fill="#ff9900" fontFamily="Arial, sans-serif">amazon</text>
    </svg>
  );
}

export function EbayLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 20" className={className}>
      <text x="0" y="16" fontSize="16" fontWeight="800" fontFamily="Arial, sans-serif">
        <tspan fill="#e53238">e</tspan>
        <tspan fill="#0064d2" dx="-2">b</tspan>
        <tspan fill="#f5af02" dx="-2">a</tspan>
        <tspan fill="#86b817" dx="-2">y</tspan>
      </text>
    </svg>
  );
}

export function AliExpressLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 20" className={className}>
      <text x="0" y="15" fontSize="11" fontWeight="600" fill="white" fontFamily="Arial, sans-serif">AliExpress</text>
    </svg>
  );
}

// Compact merchant row with brand colors
export function MerchantRow({ links }: { 
  links: { amazon: string; ebay: string; aliexpress: string } 
}) {
  return (
    <div className="flex items-center gap-1">
      <a
        href={links.amazon}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 bg-[#ff9900] text-[#131921] text-[10px] font-bold hover:brightness-110 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <AmazonLogo className="h-3 w-auto" />
        <span>Amazon</span>
      </a>
      <a
        href={links.ebay}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 bg-white text-[#0064d2] text-[10px] font-bold hover:bg-gray-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <EbayLogo className="h-3 w-auto" />
        <span>eBay</span>
      </a>
      <a
        href={links.aliexpress}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 bg-[#e43225] text-white text-[10px] font-bold hover:brightness-110 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <AliExpressLogo className="h-3 w-auto" />
        <span>Ali</span>
      </a>
    </div>
  );
}

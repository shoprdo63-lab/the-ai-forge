"use client";

import { Cpu } from "lucide-react";
import { wrapAffiliateLink, AffiliateProvider } from "@/lib/affiliate";

export type MerchantName = "Amazon" | "eBay" | "AliExpress";

interface MerchantLinkProps {
  name: MerchantName;
  url: string;
  productName?: string;
}

// Monochrome merchant logos with brand color on hover
export function MerchantLink({ name, url, productName }: MerchantLinkProps) {
  const baseClasses = "h-[18px] w-auto opacity-80";
  
  const getAffiliateUrl = (merchantName: MerchantName, link: string): string => {
    const providerMap: Record<MerchantName, AffiliateProvider> = {
      Amazon: "amazon",
      eBay: "ebay",
      AliExpress: "aliexpress",
    };
    return wrapAffiliateLink(link, providerMap[merchantName]);
  };

  const Logo = () => {
    if (name === "Amazon") {
      return (
        <svg 
          viewBox="0 0 100 24" 
          className={`${baseClasses} hover:text-[#ff9900] text-[#94a3b8]`}
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M62.5 18c-6.5 4-16 6-24 6-11 0-21-3.5-29-10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <text x="0" y="16" fontSize="13" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">amazon</text>
        </svg>
      );
    }

    if (name === "eBay") {
      return (
        <svg 
          viewBox="0 0 60 24" 
          className={`${baseClasses} hover:text-[#e53238] text-[#94a3b8]`}
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <text x="0" y="18" fontSize="16" fontWeight="800" fontFamily="Inter, system-ui, sans-serif">eBay</text>
        </svg>
      );
    }

    return (
      <svg 
        viewBox="0 0 100 24" 
        className={`${baseClasses} hover:text-[#ff4747] text-[#94a3b8]`}
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <text x="0" y="16" fontSize="11" fontWeight="600" fontFamily="Inter, system-ui, sans-serif">AliExpress</text>
      </svg>
    );
  };

  return (
    <a
      href={getAffiliateUrl(name, url)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center"
      title={`View ${productName || "product"} on ${name}`}
    >
      <Logo />
    </a>
  );
}

// Product image component with 64x64 frame
export function ProductImage({ 
  src, 
  alt 
}: { 
  src?: string; 
  alt: string;
}) {
  const hasImage = src && src.length > 0;
  
  return (
    <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded border border-[#1e293b] flex items-center justify-center">
      {hasImage ? (
        <img 
          src={src} 
          alt={alt}
          className="h-full w-full object-contain p-1"
          loading="lazy"
        />
      ) : (
        <Cpu className="h-5 w-5 text-[#334155]" strokeWidth={1.5} />
      )}
    </div>
  );
}

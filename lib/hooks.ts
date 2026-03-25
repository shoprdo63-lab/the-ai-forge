"use client";

import { useEffect, useState } from "react";

/**
 * Hook to track if component has mounted on client
 * Use this to prevent hydration mismatches for client-only content
 */
export function useHasMounted(): boolean {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

/**
 * Hook for client-safe affiliate link generation
 * Returns empty string during SSR to prevent hydration mismatch,
 * then generates the actual link on client mount
 */
export function useAffiliateLink(url: string, merchant: "Amazon" | "eBay" | "AliExpress"): string {
  const hasMounted = useHasMounted();
  
  if (!hasMounted) {
    // Return base URL during SSR to prevent hydration mismatch
    return url;
  }
  
  // Import and use the affiliate logic only on client
  const { getTrackedMerchantUrl } = require("@/lib/affiliate");
  return getTrackedMerchantUrl(url, merchant);
}

// Affiliate Link Management System
// Wraps store URLs with affiliate IDs for revenue generation

export type AffiliateProvider = "amazon" | "aliexpress" | "ebay";

interface AffiliateConfig {
  id: string;
  enabled: boolean;
  trackingParam: string;
}

// Affiliate ID storage - The AI Forge credentials
const affiliateIds: Record<AffiliateProvider, AffiliateConfig> = {
  amazon: {
    id: "aiforge-20", // Amazon Associate ID
    enabled: true,
    trackingParam: "tag",
  },
  aliexpress: {
    id: "528438", // AliExpress AppKey
    enabled: true,
    trackingParam: "aff_id",
  },
  ebay: {
    id: "5339146149", // eBay Campaign ID
    enabled: true,
    trackingParam: "campid",
  },
};

// AliExpress AppSecret for API signature generation
const ALIEXPRESS_APP_SECRET = "YPhzjbGESFs75SniEK0t1wwfKhvrKIhq";

/**
 * Wraps a store URL with affiliate tracking parameters
 * @param url - The original product URL
 * @param provider - The store provider (amazon, aliexpress, ebay)
 * @returns URL with affiliate parameters appended
 */
export function wrapAffiliateLink(url: string, provider: AffiliateProvider): string {
  const config = affiliateIds[provider];
  
  if (!config.enabled || config.id.includes("YOUR_")) {
    // Return original URL if affiliate not configured
    return url;
  }

  try {
    const urlObj = new URL(url);
    
    switch (provider) {
      case "amazon":
        // Amazon uses tag parameter
        urlObj.searchParams.set(config.trackingParam, config.id);
        // Add tracking ID for links without product
        if (!urlObj.searchParams.has("linkId")) {
          urlObj.searchParams.set("linkId", generateLinkId(url));
        }
        break;
        
      case "aliexpress":
        // AliExpress affiliate format
        urlObj.searchParams.set(config.trackingParam, config.id);
        urlObj.searchParams.set("scm", "affiliate");
        break;
        
      case "ebay":
        // eBay Campaign tracking
        urlObj.searchParams.set(config.trackingParam, config.id);
        urlObj.searchParams.set("toolid", "20001");
        break;
    }
    
    return urlObj.toString();
  } catch (error) {
    console.error(`Failed to wrap affiliate link for ${provider}:`, error);
    return url;
  }
}

/**
 * Batch wrap multiple store links with affiliate parameters
 * @param urls - Object containing URLs for each store
 * @returns Object with wrapped URLs
 */
export function wrapAllAffiliateLinks(urls: {
  amazon: string;
  aliexpress: string;
  ebay: string;
}): {
  amazon: string;
  aliexpress: string;
  ebay: string;
} {
  return {
    amazon: wrapAffiliateLink(urls.amazon, "amazon"),
    aliexpress: wrapAffiliateLink(urls.aliexpress, "aliexpress"),
    ebay: wrapAffiliateLink(urls.ebay, "ebay"),
  };
}

/**
 * Updates affiliate ID for a specific provider
 * @param provider - The store provider
 * @param affiliateId - The new affiliate ID
 */
export function setAffiliateId(provider: AffiliateProvider, affiliateId: string): void {
  affiliateIds[provider].id = affiliateId;
  affiliateIds[provider].enabled = !affiliateId.includes("YOUR_");
}

/**
 * Updates all affiliate IDs at once
 * @param ids - Object containing affiliate IDs for all providers
 */
export function setAllAffiliateIds(ids: {
  amazon?: string;
  aliexpress?: string;
  ebay?: string;
}): void {
  if (ids.amazon) setAffiliateId("amazon", ids.amazon);
  if (ids.aliexpress) setAffiliateId("aliexpress", ids.aliexpress);
  if (ids.ebay) setAffiliateId("ebay", ids.ebay);
}

/**
 * Gets current affiliate configuration status
 * @returns Status object showing which providers are configured
 */
export function getAffiliateStatus(): Record<AffiliateProvider, boolean> {
  return {
    amazon: affiliateIds.amazon.enabled && !affiliateIds.amazon.id.includes("YOUR_"),
    aliexpress: affiliateIds.aliexpress.enabled && !affiliateIds.aliexpress.id.includes("YOUR_"),
    ebay: affiliateIds.ebay.enabled && !affiliateIds.ebay.id.includes("YOUR_"),
  };
}

/**
 * Disables affiliate tracking for a specific provider
 * @param provider - The store provider to disable
 */
export function disableAffiliate(provider: AffiliateProvider): void {
  affiliateIds[provider].enabled = false;
}

/**
 * Enables affiliate tracking for a specific provider
 * @param provider - The store provider to enable
 */
export function enableAffiliate(provider: AffiliateProvider): void {
  if (!affiliateIds[provider].id.includes("YOUR_")) {
    affiliateIds[provider].enabled = true;
  }
}

// Helper to generate unique link IDs
function generateLinkId(url?: string): string {
  // Stable hash for hydration safety
  const base = url || "default";
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    const char = base.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `aff_${Math.abs(hash).toString(36)}`;
}

/**
 * Simple helper to get an affiliate link for a product
 * Automatically appends your affiliate ID to any product URL
 * @param baseUrl - The product URL (e.g., "https://amazon.com/dp/B08G5...")
 * @param platform - The store platform ("amazon", "aliexpress", or "ebay")
 * @returns URL with affiliate ID appended, ready to use in links
 * 
 * @example
 * // In your component:
 * const link = getAffiliateLink("https://amazon.com/dp/B08G5...", "amazon");
 * // Returns: "https://amazon.com/dp/B08G5...?tag=yourtag-20&linkId=aff_..."
 */
export function getAffiliateLink(baseUrl: string, platform: AffiliateProvider): string {
  return wrapAffiliateLink(baseUrl, platform);
}

export type MerchantName = "Amazon" | "eBay" | "AliExpress";

const merchantToProvider: Record<MerchantName, AffiliateProvider> = {
  Amazon: "amazon",
  eBay: "ebay",
  AliExpress: "aliexpress",
};

export function getTrackedMerchantUrl(baseUrl: string, merchant: MerchantName): string {
  return wrapAffiliateLink(baseUrl, merchantToProvider[merchant]);
}

/**
 * Generates an eBay affiliate search link for a hardware component
 * Creates a search URL that finds products on eBay with your affiliate ID
 * @param componentName - The hardware component name (e.g., "RTX 4070 Ti Super")
 * @returns eBay affiliate search URL
 * 
 * @example
 * const link = generateEbaySearchLink("RTX 4070 Ti Super");
 * // Returns: "https://www.ebay.com/sch/i.html?_nkw=RTX+4070+Ti+Super&campid=5339146149&toolid=20001"
 */
export function generateEbaySearchLink(componentName: string): string {
  const campaignId = affiliateIds.ebay.id;
  const encodedQuery = encodeURIComponent(componentName).replace(/%20/g, "+");
  
  return `https://www.ebay.com/sch/i.html?_nkw=${encodedQuery}&campid=${campaignId}&toolid=20001`;
}

/**
 * Generates an Amazon affiliate search link for a hardware component
 * Uses the Amazon Associate ID for affiliate tracking
 * @param componentName - The hardware component name (e.g., "RTX 4070 Ti Super")
 * @returns Amazon affiliate search URL
 * 
 * @example
 * const link = generateAmazonSearchLink("RTX 4070 Ti Super");
 * // Returns: "https://www.amazon.com/s?k=RTX+4070+Ti+Super&tag=aiforge-20"
 */
export function generateAmazonSearchLink(componentName: string): string {
  const associateId = affiliateIds.amazon.id;
  const encodedQuery = encodeURIComponent(componentName).replace(/%20/g, "+");
  
  return `https://www.amazon.com/s?k=${encodedQuery}&tag=${associateId}`;
}

/**
 * Batch generate Amazon search links for multiple hardware components
 * @param componentNames - Array of hardware component names
 * @returns Array of Amazon affiliate search URLs
 */
export function generateAmazonSearchLinks(componentNames: string[]): string[] {
  return componentNames.map(name => generateAmazonSearchLink(name));
}

/**
 * Batch generate eBay search links for multiple hardware components
 * @param componentNames - Array of hardware component names
 * @returns Array of eBay affiliate search URLs
 */
export function generateEbaySearchLinks(componentNames: string[]): string[] {
  return componentNames.map(name => generateEbaySearchLink(name));
}

/**
 * Generates an AliExpress affiliate search link for a hardware component
 * Uses the AppKey for affiliate tracking
 * @param componentName - The hardware component name (e.g., "RTX 4070 Ti Super")
 * @returns AliExpress affiliate search URL
 * 
 * @example
 * const link = generateAliExpressSearchLink("RTX 4070 Ti Super");
 * // Returns: "https://www.aliexpress.com/wholesale?SearchText=RTX+4070+Ti+Super&aff_id=528438"
 */
export function generateAliExpressSearchLink(componentName: string): string {
  const appKey = affiliateIds.aliexpress.id;
  const encodedQuery = encodeURIComponent(componentName).replace(/%20/g, "+");
  
  return `https://www.aliexpress.com/wholesale?SearchText=${encodedQuery}&aff_id=${appKey}&scm=affiliate`;
}

/**
 * Batch generate AliExpress search links for multiple hardware components
 * @param componentNames - Array of hardware component names
 * @returns Array of AliExpress affiliate search URLs
 */
export function generateAliExpressSearchLinks(componentNames: string[]): string[] {
  return componentNames.map(name => generateAliExpressSearchLink(name));
}

// Example usage:
// setAllAffiliateIds({
//   amazon: "yourtag-20",
//   aliexpress: "12345678",
//   ebay: "1234567890"
// });
// 
// // In your component:
// <a href={getAffiliateLink("https://amazon.com/dp/B08G5...", "amazon")}>Buy on Amazon</a>
// <a href={getAffiliateLink("https://aliexpress.com/item/...", "aliexpress")}>Buy on AliExpress</a>
// <a href={getAffiliateLink("https://ebay.com/itm/...", "ebay")}>Check eBay</a>

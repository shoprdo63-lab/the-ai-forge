export const AFFILIATE_IDS = {
  Amazon: "aiforge-20",
  eBay: "5339146149",
  AliExpress: "528438",
};

export const MerchantService = {
  /**
   * Appends affiliate ID to the product link based on the merchant.
   */
  getAffiliateUrl: (url: string, merchant: "Amazon" | "eBay" | "AliExpress") => {
    const affiliateId = AFFILIATE_IDS[merchant];
    if (!affiliateId) return url;

    try {
      const urlObj = new URL(url);
      if (merchant === "Amazon") {
        urlObj.searchParams.set("tag", affiliateId);
      } else if (merchant === "eBay") {
        urlObj.searchParams.set("mkevt", "1");
        urlObj.searchParams.set("mkcid", "1");
        urlObj.searchParams.set("mkrid", "711-53200-19255-0");
        urlObj.searchParams.set("campid", affiliateId);
      } else if (merchant === "AliExpress") {
        urlObj.searchParams.set("aff_platform", "api-new");
        urlObj.searchParams.set("sk", affiliateId);
      }
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  },

  /**
   * Compares prices across available merchants and returns the best deal.
   */
  getBestDeal: (merchants: { name: string; price: number; link: string }[]) => {
    if (!merchants || merchants.length === 0) return null;
    return merchants.reduce((prev, curr) => (prev.price < curr.price ? prev : curr));
  },

  /**
   * Returns a monochromatic store logo that turns to color on hover.
   */
  getMerchantLogo: (name: string) => {
    return `/logos/${name.toLowerCase()}.svg`;
  },
};

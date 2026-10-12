/**
 * Premium entitlement boundary.
 *
 * No in-app purchase provider is configured in this build, so nobody is
 * premium and every feature in the app is free. Never derive entitlement from
 * a local flag: when purchases are added (StoreKit / Google Play Billing via a
 * provider such as RevenueCat or expo-iap), this function must return the
 * store-verified entitlement, ideally validated server-side.
 */
export interface Entitlements {
  isPremium: boolean;
  source: 'none' | 'store';
  purchasesAvailable: boolean;
}

export function getEntitlements(): Entitlements {
  return { isPremium: false, source: 'none', purchasesAvailable: false };
}

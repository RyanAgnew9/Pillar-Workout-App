export type PremiumFeature = 'advancedInsights' | 'mediaTimelineCompare' | 'exportHistory';

export interface BillingService {
  isPremiumUser(): boolean;
  hasFeature(feature: PremiumFeature): boolean;
}

// Local no-op implementation for MVP; swap with RevenueCat later.
export class LocalBillingService implements BillingService {
  isPremiumUser() {
    return false;
  }
  hasFeature() {
    return false;
  }
}

import Stripe from 'stripe';

// Types for our subscription plans
export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  zipCodeLimit: number;
};

// Define our subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    interval: 'month',
    features: [
      'Up to 5 ZIP codes',
      'Basic lead management',
      'Email support',
      'Basic analytics',
      'Mobile access'
    ],
    zipCodeLimit: 5
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    interval: 'month',
    features: [
      'Up to 10 ZIP codes',
      'Advanced lead management',
      'Priority support',
      'Custom reports',
      'API access',
      'Team collaboration',
      'Advanced analytics',
      'Bulk lead export'
    ],
    zipCodeLimit: 10
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    features: [
      'Unlimited ZIP codes',
      'Custom integrations',
      'Dedicated account manager',
      'White-label options',
      'Advanced API access',
      'Custom reporting',
      'Training sessions',
      'SLA guarantees'
    ],
    zipCodeLimit: -1 // -1 indicates unlimited
  }
];

// Utility function to get plan by ID
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

// Utility function to calculate price based on zip codes
export function calculateZipCodePrice(
  basePrice: number,
  zipCodeCount: number,
  planId: string
): number {
  const plan = getPlanById(planId);
  if (!plan) return basePrice;

  // If unlimited plan, return base price
  if (plan.zipCodeLimit === -1) return basePrice;

  // Calculate additional cost for extra zip codes
  const extraZipCodes = Math.max(0, zipCodeCount - plan.zipCodeLimit);
  const costPerExtraZip = 10; // $10 per additional zip code

  return basePrice + (extraZipCodes * costPerExtraZip);
}

// Mock Stripe client for development
export class MockStripeClient {
  // Test card numbers for development
  private readonly TEST_CARDS = {
    success: '4242424242424242',
    decline: '4000000000000002',
    requireAuth: '4000002500003155',
  };

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    return {
      clientSecret: 'mock_client_secret',
      amount,
      currency,
      status: 'succeeded',
      // Include test card info in development
      testCards: this.TEST_CARDS
    };
  }

  async createSubscription(customerId: string, priceId: string) {
    return {
      id: 'mock_subscription_id',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      customer: customerId,
      items: {
        data: [{ price: { id: priceId } }]
      }
    };
  }

  async cancelSubscription(subscriptionId: string) {
    return {
      id: subscriptionId,
      status: 'canceled',
      canceledAt: new Date()
    };
  }
}

// Export a function to get the appropriate Stripe client
export function getStripeClient() {
  // In production, this would return a real Stripe client
  // For now, return our mock client
  return new MockStripeClient();
} 
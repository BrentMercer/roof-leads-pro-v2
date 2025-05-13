'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, CreditCardIcon } from 'lucide-react';
import { PaymentForm } from '@/components/payment-form';
import { StripeProvider } from '@/components/providers/stripe-provider';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { useSearchParams } from 'next/navigation';

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [zipCodeCount, setZipCodeCount] = useState(5);
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const selectedPlanDetails = selectedPlan 
    ? SUBSCRIPTION_PLANS.find(plan => plan.id === selectedPlan)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and zip codes.
        </p>
      </div>

      {status === 'success' ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Subscription Successful!</h2>
              <p className="text-muted-foreground">
                Thank you for subscribing. Your account has been activated.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedPlan === plan.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${plan.price}/month
                      </p>
                    </div>
                    <Button
                      variant={selectedPlan === plan.id ? 'default' : 'outline'}
                      size="sm"
                    >
                      {selectedPlan === plan.id ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <StripeProvider>
                  <PaymentForm
                    planId={selectedPlan}
                    zipCodeCount={zipCodeCount}
                    amount={selectedPlanDetails?.price || 0}
                  />
                </StripeProvider>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No subscription history available
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
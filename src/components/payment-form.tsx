'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, InfoIcon } from 'lucide-react';

interface PaymentFormProps {
  planId: string;
  zipCodeCount: number;
  amount: number;
}

export function PaymentForm({ planId, zipCodeCount, amount }: PaymentFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [testCards, setTestCards] = useState<Record<string, string> | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          zipCodeCount,
        }),
      });

      const data = await response.json();
      
      // Store test cards if available
      if (data.testCards) {
        setTestCards(data.testCards);
      }

      const { clientSecret } = data;

      // Confirm payment
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (paymentError) {
        setError(paymentError.message || 'An error occurred');
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Create subscription
        const subscriptionResponse = await fetch('/api/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId,
            paymentIntentId: paymentIntent.id,
          }),
        });

        if (!subscriptionResponse.ok) {
          throw new Error('Failed to create subscription');
        }

        // Redirect to success page
        router.push('/dashboard/subscription?status=success');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {testCards && (
          <div className="rounded-md bg-muted p-4 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <InfoIcon className="h-4 w-4" />
              <span className="font-medium">Test Cards</span>
            </div>
            <div className="space-y-1">
              <p>Success: {testCards.success}</p>
              <p>Decline: {testCards.decline}</p>
              <p>Requires Auth: {testCards.requireAuth}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Use any future date for expiry and any 3 digits for CVC
              </p>
            </div>
          </div>
        )}

        <div className="rounded-md border p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between text-sm">
          <span>Total Amount:</span>
          <span className="font-semibold">${amount.toFixed(2)}</span>
        </div>

        <Button
          type="submit"
          disabled={!stripe || processing}
          className="w-full"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Subscribe Now'
          )}
        </Button>
      </div>
    </form>
  );
} 
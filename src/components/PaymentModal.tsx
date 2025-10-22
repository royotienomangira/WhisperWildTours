import { useState, useEffect } from 'react';
import { CreditCard, Lock, X } from 'lucide-react';
import { initializePaystack, generateReference } from '../lib/paystack';
import { supabase } from '../lib/supabase';

interface PaymentModalProps {
  bookingId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PaymentModal({
  bookingId,
  amount,
  customerEmail,
  customerName,
  onSuccess,
  onClose
}: PaymentModalProps) {
  const [paymentReference] = useState(generateReference());
  const [processing, setProcessing] = useState(false);
  const [paystackKey, setPaystackKey] = useState<string>('');

  useEffect(() => {
    setPaystackKey('pk_test_your_paystack_public_key');
  }, []);

  const handlePayment = async () => {
    if (!paystackKey) {
      alert('Payment system is not configured. Please contact support.');
      return;
    }

    setProcessing(true);

    try {
      initializePaystack({
        publicKey: paystackKey,
        email: customerEmail,
        amount: amount,
        reference: paymentReference,
        onSuccess: async (reference) => {
          await updateBookingPayment(reference);
          onSuccess();
        },
        onClose: () => {
          setProcessing(false);
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initialize payment. Please try again.');
      setProcessing(false);
    }
  };

  const updateBookingPayment = async (reference: string) => {
    try {
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'completed',
          payment_reference: reference,
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (bookingError) throw bookingError;

      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: bookingId,
          amount: amount,
          currency: 'USD',
          reference: reference,
          status: 'success',
          payment_method: 'paystack',
          metadata: { customer_name: customerName }
        });

      if (paymentError) throw paymentError;
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Amount to Pay:</span>
              <span className="text-2xl font-bold text-emerald-600">
                ${amount.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p>Customer: {customerName}</p>
              <p>Email: {customerEmail}</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-blue-900 mb-1">Secure Payment with Paystack</p>
                <p>Your payment is processed securely through Paystack. We never store your card details.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={processing || !paystackKey}
              className="w-full bg-emerald-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>{processing ? 'Processing...' : 'Pay with Paystack'}</span>
            </button>

            {!paystackKey && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Payment integration requires a Paystack public key.
                  Please contact the administrator to complete the setup.
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Reference: {paymentReference}
          </div>
        </div>
      </div>
    </div>
  );
}

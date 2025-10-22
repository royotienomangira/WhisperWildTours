import { CheckCircle, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import type { Booking, Service } from '../lib/supabase';

interface BookingConfirmationProps {
  booking: Booking;
  service: Service;
  onClose: () => void;
}

export default function BookingConfirmation({ booking, service, onClose }: BookingConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
            <CheckCircle className="h-12 w-12 text-emerald-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Your payment has been processed successfully
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Service</p>
                      <p className="font-medium text-gray-900">{service.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(booking.booking_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium text-emerald-600 capitalize">{booking.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{booking.customer_email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{booking.customer_phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {booking.booking_details && Object.keys(booking.booking_details).length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Additional Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(booking.booking_details).map(([key, value]) => {
                    if (key === 'serviceType') return null;
                    return (
                      <div key={key}>
                        <p className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="font-medium text-gray-900">{String(value)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-semibold">Total Paid:</span>
              <span className="text-2xl font-bold text-emerald-600">
                ${booking.total_price.toLocaleString()}
              </span>
            </div>
            {booking.payment_reference && (
              <p className="text-xs text-gray-600 mt-2">
                Reference: {booking.payment_reference}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-900">
              <strong>Next Steps:</strong> A confirmation email has been sent to {booking.customer_email}.
              Our team will contact you shortly to finalize the arrangements. You can reach us at
              whisperwild@gmail.com or +254 741 060 289 for any questions.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

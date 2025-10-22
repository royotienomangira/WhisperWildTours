import { useState } from 'react';
import { X, Calendar, Users, MapPin, Clock } from 'lucide-react';
import type { Service } from '../lib/supabase';

interface BookingModalProps {
  service: Service | null;
  onClose: () => void;
  onConfirm: (bookingData: BookingFormData) => void;
}

export interface BookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  bookingDetails: Record<string, any>;
}

export default function BookingModal({ service, onClose, onConfirm }: BookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
    bookingDetails: {},
  });

  const [detailsData, setDetailsData] = useState({
    guests: '1',
    location: '',
    time: '',
    duration: '1',
    specialRequests: '',
  });

  if (!service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingDetails: Record<string, any> = {
      serviceType: service.type,
    };

    if (service.type === 'hotel') {
      bookingDetails.guests = parseInt(detailsData.guests);
      bookingDetails.duration = parseInt(detailsData.duration);
    } else if (service.type === 'transfer') {
      bookingDetails.pickupLocation = detailsData.location;
      bookingDetails.pickupTime = detailsData.time;
      bookingDetails.passengers = parseInt(detailsData.guests);
    } else if (service.type === 'guide') {
      bookingDetails.groupSize = parseInt(detailsData.guests);
      bookingDetails.startTime = detailsData.time;
      bookingDetails.duration = parseInt(detailsData.duration);
    } else if (service.type === 'photography') {
      bookingDetails.location = detailsData.location;
      bookingDetails.sessionTime = detailsData.time;
      bookingDetails.duration = parseInt(detailsData.duration);
    }

    if (detailsData.specialRequests) {
      bookingDetails.specialRequests = detailsData.specialRequests;
    }

    onConfirm({
      ...formData,
      bookingDetails,
    });
  };

  const getTotalPrice = () => {
    let multiplier = 1;
    if (service.type === 'hotel' && detailsData.duration) {
      multiplier = parseInt(detailsData.duration);
    } else if (service.type === 'guide' && detailsData.duration) {
      multiplier = parseInt(detailsData.duration);
    }
    return service.price * multiplier;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Book {service.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="+254 741 060 289"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Booking Date *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(service.type === 'hotel' || service.type === 'transfer' || service.type === 'guide') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    {service.type === 'hotel' ? 'Number of Guests' : service.type === 'transfer' ? 'Passengers' : 'Group Size'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={detailsData.guests}
                    onChange={(e) => setDetailsData({ ...detailsData, guests: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              )}

              {service.type === 'transfer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Pickup Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={detailsData.location}
                      onChange={(e) => setDetailsData({ ...detailsData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter pickup address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Pickup Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={detailsData.time}
                      onChange={(e) => setDetailsData({ ...detailsData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {service.type === 'photography' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={detailsData.location}
                      onChange={(e) => setDetailsData({ ...detailsData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Shoot location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Session Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={detailsData.time}
                      onChange={(e) => setDetailsData({ ...detailsData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {(service.type === 'guide' || service.type === 'photography') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    {service.type === 'guide' ? 'Start Time' : 'Duration (Hours)'} *
                  </label>
                  {service.type === 'guide' ? (
                    <input
                      type="time"
                      required
                      value={detailsData.time}
                      onChange={(e) => setDetailsData({ ...detailsData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  ) : (
                    <input
                      type="number"
                      required
                      min="1"
                      value={detailsData.duration}
                      onChange={(e) => setDetailsData({ ...detailsData, duration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  )}
                </div>
              )}

              {(service.type === 'hotel' || service.type === 'guide') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration ({service.type === 'hotel' ? 'Nights' : 'Hours'}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={detailsData.duration}
                    onChange={(e) => setDetailsData({ ...detailsData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                value={detailsData.specialRequests}
                onChange={(e) => setDetailsData({ ...detailsData, specialRequests: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Any special requirements or preferences..."
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between text-2xl font-bold text-gray-900 mb-6">
              <span>Total Price:</span>
              <span className="text-emerald-600">${getTotalPrice().toLocaleString()}</span>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import BookingModal, { type BookingFormData } from './components/BookingModal';
import PaymentModal from './components/PaymentModal';
import BookingConfirmation from './components/BookingConfirmation';
import { supabase, type Service, type Booking } from './lib/supabase';

type AppState = 'browsing' | 'booking' | 'payment' | 'confirmation';

function App() {
  const [appState, setAppState] = useState<AppState>('browsing');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setAppState('booking');
  };

  const handleConfirmBooking = async (bookingData: BookingFormData) => {
    if (!selectedService) return;

    try {
      const totalPrice = calculateTotalPrice(selectedService, bookingData.bookingDetails);

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          service_id: selectedService.id,
          customer_name: bookingData.customerName,
          customer_email: bookingData.customerEmail,
          customer_phone: bookingData.customerPhone,
          booking_date: bookingData.bookingDate,
          booking_details: bookingData.bookingDetails,
          total_price: totalPrice,
          payment_status: 'pending',
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentBooking(data);
      setAppState('payment');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const calculateTotalPrice = (service: Service, details: Record<string, any>): number => {
    let multiplier = 1;

    if (service.type === 'hotel' && details.duration) {
      multiplier = parseInt(details.duration);
    } else if (service.type === 'guide' && details.duration) {
      multiplier = parseInt(details.duration);
    } else if (service.type === 'photography' && details.duration) {
      multiplier = parseInt(details.duration);
    }

    return service.price * multiplier;
  };

  const handlePaymentSuccess = () => {
    setAppState('confirmation');
  };

  const handleCloseBooking = () => {
    setAppState('browsing');
    setSelectedService(null);
  };

  const handleClosePayment = () => {
    setAppState('booking');
  };

  const handleCloseConfirmation = () => {
    setAppState('browsing');
    setSelectedService(null);
    setCurrentBooking(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services onBookService={handleBookService} />
      <Footer />
      <WhatsAppButton />

      {appState === 'booking' && (
        <BookingModal
          service={selectedService}
          onClose={handleCloseBooking}
          onConfirm={handleConfirmBooking}
        />
      )}

      {appState === 'payment' && currentBooking && (
        <PaymentModal
          bookingId={currentBooking.id}
          amount={currentBooking.total_price}
          customerEmail={currentBooking.customer_email}
          customerName={currentBooking.customer_name}
          onSuccess={handlePaymentSuccess}
          onClose={handleClosePayment}
        />
      )}

      {appState === 'confirmation' && currentBooking && selectedService && (
        <BookingConfirmation
          booking={currentBooking}
          service={selectedService}
          onClose={handleCloseConfirmation}
        />
      )}
    </div>
  );
}

export default App;

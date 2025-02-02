import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../ui/dialog_2';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Alert, AlertTitle, AlertDescription } from '../../../ui/alert';
import FindMentorServices from '../../../services/biginner/find_mentor';

const BookingModal = ({ isOpen, onClose, mentor, onBookingComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('initial'); // initial, processing, success, error

  const validatePhoneNumber = (number) => {
    return /^\d{9}$/.test(number);
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhoneNumber(value);
  };

  const handleBooking = async () => {
    try {
      if (!validatePhoneNumber(phoneNumber)) {
        setError('Please enter a valid 9-digit phone number');
        return;
      }

      setIsProcessing(true);
      setPaymentStatus('processing');

      // Simulate payment
      const paymentResult = await FindMentorServices.simulatePayment({
        amount: mentor.hourlyRate,
        phoneNumber,
        mentorId: mentor.id
      });

      if (paymentResult.success) {
        // Submit booking
        await FindMentorServices.submitBooking({
          mentorId: mentor.id,
          phoneNumber,
          amount: mentor.hourlyRate,
          transactionId: paymentResult.transactionId
        });

        setPaymentStatus('success');
        setTimeout(() => {
          onBookingComplete();
          onClose();
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Session with {mentor?.name}</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-1">Session Details</h4>
            <p className="text-sm text-gray-600">
              Rate: {mentor?.hourlyRate?.toLocaleString()} FCFA / hour
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Mobile Number for Payment
            </label>
            <Input
              type="tel"
              placeholder="Enter 9-digit phone number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength={9}
              className="w-full"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <AlertTitle>Payment Successful</AlertTitle>
              <AlertDescription>
                Your booking has been confirmed. You will receive a confirmation shortly.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleBooking}
            disabled={isProcessing || paymentStatus === 'success'}
            className="w-full"
          >
            {isProcessing ? 'Processing Payment...' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
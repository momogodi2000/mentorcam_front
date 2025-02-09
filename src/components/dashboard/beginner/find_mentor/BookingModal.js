import React, { useState } from 'react';
import { X, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../ui/dialog_2';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Alert, AlertTitle, AlertDescription } from '../../../ui/alert';
import { Badge } from '../../../ui/badge';
import FindMentorServices from '../../../services/biginner/find_mentor';

const BookingModal = ({ 
  isOpen, 
  onClose, 
  mentor, 
  onBookingComplete,
  userName // New prop for user's name
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState(userName || ''); // Initialize with userName if provided
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('initial'); // initial, processing, success, error
  const [remainingSlots, setRemainingSlots] = useState(mentor?.max_students || 0);

  const validatePhoneNumber = (number) => {
    return /^\d{9}$/.test(number);
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
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

      if (!validateName(name)) {
        setError('Please enter your full name');
        return;
      }

      if (remainingSlots <= 0) {
        setError('No more slots available with this mentor');
        return;
      }

      setIsProcessing(true);
      setPaymentStatus('processing');

      // Simulate payment
      const paymentResult = await FindMentorServices.simulatePayment({
        amount: mentor.plan_price || mentor.hourly_rate,
        phoneNumber,
        mentorId: mentor.id,
        userName: name, // Include user name in payment
        mentorName: mentor.full_name // Include mentor name in payment
      });

      if (paymentResult.success) {
        // Submit booking with additional user and mentor details
        await FindMentorServices.submitBooking({
          mentorId: mentor.id,
          mentorName: mentor.full_name,
          studentName: name,
          phoneNumber,
          amount: mentor.plan_price || mentor.hourly_rate,
          transactionId: paymentResult.transactionId,
          planType: mentor.plan_type,
          domain: mentor.domain_name,
          subdomains: mentor.subdomains
        });

        // Update remaining slots
        await FindMentorServices.updateMentorSlots(mentor.id, remainingSlots - 1);
        setRemainingSlots(prev => prev - 1);

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
          <DialogTitle>Book Session with {mentor?.full_name}</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mentor Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-3">Mentor Details</h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-gray-600">Name:</span>
                <span>{mentor?.full_name}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-gray-600">Location:</span>
                <span>{mentor?.location || 'Not specified'}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-gray-600">Domain:</span>
                <span>{mentor?.domain_name}</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {mentor?.subdomains?.map((subdomain, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {subdomain}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Plan Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-3">Session Details</h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-gray-600">Plan Type:</span>
                <span>{mentor?.plan_type}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-gray-600">Rate:</span>
                <span>{(mentor?.plan_price || mentor?.hourly_rate)?.toLocaleString()} FCFA</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-gray-600">Available Slots:</span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {remainingSlots} / {mentor?.max_students}
                </span>
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Your Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                disabled={!!userName} // Disable if userName is provided
              />
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
            disabled={isProcessing || paymentStatus === 'success' || remainingSlots <= 0}
            className="w-full"
          >
            {isProcessing ? 'Processing Payment...' : remainingSlots <= 0 ? 'No Available Slots' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
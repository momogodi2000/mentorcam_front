import React, { useState, useEffect } from 'react';
import { X, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../ui/dialog_2';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Alert, AlertTitle, AlertDescription } from '../../../ui/alert';
import { Badge } from '../../../ui/badge';
import BookingService from '../../../services/biginner/booking_services';
import { getUser } from '../../../services/get_user';

const BookingModal = ({ 
  isOpen, 
  onClose, 
  mentor, 
  onBookingComplete 
}) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    name: '',
    email: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('initial');
  const [remainingSlots, setRemainingSlots] = useState(0);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);

  useEffect(() => {
    // Reset states when modal opens/closes or mentor changes
    if (!isOpen) {
      setError('');
      setPaymentStatus('initial');
      setIsProcessing(false);
      setReceiptUrl(null);
      setHasActiveBooking(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Update remaining slots when mentor changes
    if (mentor?.max_students) {
      setRemainingSlots(mentor.max_students);
    }
  }, [mentor?.max_students]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isOpen || !mentor?.id) {
        return;
      }

      try {
        setIsLoadingUser(true);
        setError('');

        const userData = await getUser();
        setFormData(prev => ({
          ...prev,
          name: userData.full_name || '',
          email: userData.email || ''
        }));

        // Only check for active booking if we have a valid mentor ID
        const response = await BookingService.checkActiveBooking(mentor.id);
        setHasActiveBooking(response.hasActiveBooking);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please refresh or enter manually.');
        setHasActiveBooking(false);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [isOpen, mentor?.id]);

  const validateForm = () => {
    if (!mentor?.id) {
      throw new Error('Invalid mentor information. Please try again.');
    }
    if (!/^\d{9}$/.test(formData.phoneNumber)) {
      throw new Error('Please enter a valid 9-digit phone number');
    }
    if (formData.name.trim().length < 2) {
      throw new Error('Please enter your full name');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      throw new Error('Please enter a valid email address');
    }
    if (remainingSlots <= 0) {
      throw new Error('No more slots available with this mentor');
    }
    if (hasActiveBooking) {
      throw new Error('You already have an ongoing session with this mentor');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      const sanitizedValue = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBooking = async () => {
    if (!mentor?.id) {
      setError('Invalid mentor information. Please try again.');
      return;
    }

    try {
      setError('');
      validateForm();

      if (hasActiveBooking) {
        setError('You already have an ongoing session with this mentor');
        return;
      }

      setIsProcessing(true);
      setPaymentStatus('processing');

      const bookingData = {
        mentorId: mentor.id,
        mentorName: mentor.full_name || '',
        studentName: formData.name,
        studentEmail: formData.email,
        phoneNumber: formData.phoneNumber,
        amount: mentor.plan_price || mentor.hourly_rate || 0,
        planType: mentor.plan_type || '',
        domain: mentor.domain_name || '',
        subdomains: mentor.subdomains || []
      };

      const bookingResponse = await BookingService.submitBooking(bookingData);

      if (bookingResponse.status === 'success') {
        setRemainingSlots(prev => prev - 1);
        
        if (bookingResponse.receipt_url) {
          setReceiptUrl(bookingResponse.receipt_url);
        }

        setPaymentStatus('success');
        setTimeout(() => {
          onBookingComplete?.(bookingResponse.booking);
          onClose?.();
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (receiptUrl) {
      window.open(receiptUrl, '_blank');
    }
  };

  // Early return if no mentor data
  if (!mentor) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Session with {mentor.full_name || 'Mentor'}</DialogTitle>
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
                <span>{mentor.full_name || 'Not specified'}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-gray-600">Location:</span>
                <span>{mentor.location || 'Not specified'}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-gray-600">Domain:</span>
                <span>{mentor.domain_name || 'Not specified'}</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {mentor.subdomains?.map((subdomain, index) => (
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
                <span>{mentor.plan_type || 'Not specified'}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-gray-600">Rate:</span>
                <span>{(mentor.plan_price || mentor.hourly_rate || 0).toLocaleString()} FCFA</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-gray-600">Available Slots:</span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {remainingSlots} / {mentor.max_students || 0}
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
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full"
                disabled={isLoadingUser}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Your Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full"
                disabled={isLoadingUser}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Mobile Number for Payment
              </label>
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="Enter 9-digit phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
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
                {receiptUrl && (
                  <Button
                    variant="link"
                    className="mt-2 p-0 text-green-600"
                    onClick={handleDownloadReceipt}
                  >
                    Download Receipt
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleBooking}
            disabled={
              isProcessing || 
              paymentStatus === 'success' || 
              remainingSlots <= 0 || 
              isLoadingUser ||
              hasActiveBooking
            }
            className="w-full"
          >
            {isProcessing ? 'Processing Payment...' : 
             isLoadingUser ? 'Loading User Data...' :
             hasActiveBooking ? 'Already Booked' :
             remainingSlots <= 0 ? 'No Available Slots' : 
             'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
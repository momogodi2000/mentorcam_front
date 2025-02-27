import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../ui/card';
import { ChevronLeft, User, Phone, Mail, CreditCard, Clock, Calendar, MapPin, Shield, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { UserService } from '../../../services/admin/crud';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns'; // Assume date-fns is already installed

const ProfessionalDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [professionalData, setProfessionalData] = useState({
    user: null,
    profile: null,
    payment: null
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessionalDetails = async () => {
      try {
        setLoading(true);
        const data = await UserService.getProfessionalDetails(id);
        setProfessionalData(data);
      } catch (error) {
        console.error('Error fetching professional details:', error);
        setError('Failed to load professional user details. Please try again.');
        toast.error('Failed to load professional details');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionalDetails();
  }, [id]);

  const handleToggleAccountStatus = async () => {
    try {
      const updatedUser = await UserService.toggleAccountStatus(id);
      setProfessionalData({
        ...professionalData,
        user: updatedUser
      });
      toast.success(`User account ${updatedUser.account_status} successfully`);
    } catch (error) {
      toast.error('Failed to update account status');
      console.error('Error updating account status:', error);
    }
  };

  const handleVerifyPayments = async () => {
    try {
      await UserService.verifyProfessionalPayments();
      // Refresh the professional details
      const data = await UserService.getProfessionalDetails(id);
      setProfessionalData(data);
      toast.success('Payment verification completed');
    } catch (error) {
      toast.error('Failed to verify payments');
      console.error('Error verifying payments:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center animate-pulse">
          <p className="text-lg font-medium">Loading professional details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center text-red-600">
          <XCircle className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-medium">{error}</p>
        </div>
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Users
        </button>
      </div>
    );
  }

  const { user, profile, payment } = professionalData;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-all"
        >
          <ChevronLeft className="mr-2" /> Back to Users
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleVerifyPayments}
            className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Verify Payment
          </button>
          <button
            onClick={handleToggleAccountStatus}
            className={`flex items-center ${
              user?.account_status === 'activated' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white px-4 py-2 rounded-lg transition-all`}
          >
            <Shield className="mr-2 h-4 w-4" />
            {user?.account_status === 'activated' ? 'Block Account' : 'Activate Account'}
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold">Professional User Details</h1>

      {/* User Information Card */}
      <Card className="p-6 shadow-lg animate-slide-up">
        <div className="flex items-start">
          {user?.profile_picture ? (
            <img 
              src={user.profile_picture} 
              alt={user?.full_name} 
              className="w-24 h-24 rounded-full object-cover mr-6"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mr-6">
              <User className="h-12 w-12 text-gray-500" />
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{user?.full_name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                {user?.email}
              </div>
              <div className="flex items-center text-gray-700">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                {user?.phone_number}
              </div>
              {user?.location && (
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  {user.location}
                </div>
              )}
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${
                  user?.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user?.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user?.account_status === 'activated' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user?.account_status.charAt(0).toUpperCase() + user?.account_status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Professional Profile Details Card */}
      <Card className="p-6 shadow-lg animate-slide-up">
        <h3 className="text-lg font-semibold mb-4">Professional Profile</h3>
        
        {profile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Professional Title</h4>
                <p className="text-gray-800">{profile.professional_title || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Experience (Years)</h4>
                <p className="text-gray-800">{profile.years_of_experience || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Education</h4>
                <p className="text-gray-800">{profile.education || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Certification</h4>
                <p className="text-gray-800">{profile.certification || 'Not provided'}</p>
              </div>
            </div>
            {/* Right column */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Specialization</h4>
                <p className="text-gray-800">{profile.specialization || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Services Offered</h4>
                <p className="text-gray-800">{profile.services_offered || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Bio</h4>
                <p className="text-gray-800">{profile.bio || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Profile Created</h4>
                <p className="text-gray-800">{formatDate(profile.created_at)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>No professional profile information available.</p>
          </div>
        )}
      </Card>

      {/* Payment Information Card */}
      <Card className="p-6 shadow-lg animate-slide-up">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        
        {payment && !payment.error ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium">Payment Status</h4>
                  <div className="flex items-center mt-1">
                    {payment.payment_status === 'paid' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-green-600 font-medium">Paid</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600 mr-1" />
                        <span className="text-red-600 font-medium">
                          {payment.payment_status ? payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1) : 'Not Paid'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">Amount</div>
                <div className="font-bold text-lg">${payment.amount || '0.00'}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h4>
                <p className="text-gray-800">{payment.payment_method || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Transaction ID</h4>
                <p className="text-gray-800">{payment.transaction_id || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Date</h4>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{formatDate(payment.payment_date)}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Next Billing Date</h4>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{payment.next_billing_date ? formatDate(payment.next_billing_date) : 'Not available'}</span>
                </div>
              </div>
            </div>
            
            {payment.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Notes</h4>
                <p className="text-gray-800 p-3 bg-gray-50 rounded-lg">{payment.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>{payment?.error || 'No payment information available for this user.'}</p>
            <p className="mt-2 text-sm">
              {user?.account_status === 'blocked' ? 
                'The user account is currently blocked, which might be due to payment issues.' : 
                'Consider verifying payment status to ensure account remains in good standing.'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfessionalDetailsPage;
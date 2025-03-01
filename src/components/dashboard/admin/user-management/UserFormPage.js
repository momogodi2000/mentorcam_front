import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../ui/card';
import { ChevronLeft, Upload, Eye, EyeOff } from 'lucide-react';
import { UserService } from '../../../services/admin/crud';
import { toast } from 'react-hot-toast';

const UserFormPage = ({ onSubmit, onCancel }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id && id !== 'new';
  const isStandalone = !onSubmit; // If no onSubmit prop, it's not being used in a modal
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const USER_TYPES = [
    { value: 'amateur', label: 'Amateur' },
    { value: 'professional', label: 'Professional' },
    { value: 'institution', label: 'Institution' },
    { value: 'admin', label: 'Admin' }
  ];

  const ACCOUNT_STATUSES = [
    { value: 'activated', label: 'Activated' },
    { value: 'blocked', label: 'Blocked' }
  ];

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    phone_number: '',
    user_type: 'amateur',
    account_status: 'activated',
    location: '',
    profile_picture: null,
    is_active: true,
    password: '',
    confirm_password: ''
  });

  // For file upload preview
  const [previewUrl, setPreviewUrl] = useState('');
  // For password validation
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (isEditMode) {
        setLoading(true);
        try {
          const userData = await UserService.getUser(id);
          setFormData({
            ...userData,
            password: '',
            confirm_password: ''
          });
          if (userData.profile_picture) {
            setPreviewUrl(userData.profile_picture);
          }
        } catch (error) {
          toast.error('Failed to fetch user details');
          console.error('Error fetching user:', error);
          if (isStandalone) navigate('/admin/users');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [id, isEditMode, navigate, isStandalone]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear password error when either password field changes
    if (name === 'password' || name === 'confirm_password') {
      setPasswordError('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile_picture: file
      });
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    // Check if passwords match when creating a new user or when password is provided for existing user
    if (!isEditMode || (isEditMode && formData.password)) {
      if (formData.password !== formData.confirm_password) {
        setPasswordError("Passwords don't match");
        return false;
      }
      
      if (!isEditMode && formData.password.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Create FormData if we have a file
    let dataToSend = { ...formData };
    
    // Remove confirm_password from data to send to API
    delete dataToSend.confirm_password;
    
    // Remove password if it's empty in edit mode
    if (isEditMode && !dataToSend.password) {
      delete dataToSend.password;
    }
    
    if (formData.profile_picture instanceof File) {
      const formDataObj = new FormData();
      Object.keys(dataToSend).forEach(key => {
        if (key === 'profile_picture') {
          formDataObj.append(key, dataToSend[key]);
        } else {
          formDataObj.append(key, dataToSend[key]);
        }
      });
      dataToSend = formDataObj;
    }
    
    try {
      if (isEditMode) {
        await UserService.updateUser(id, dataToSend);
        toast.success('User updated successfully');
      } else {
        // For modal form submission
        if (onSubmit) {
          await onSubmit(dataToSend);
        } else {
          // For standalone form
          await UserService.createUser(dataToSend);
          toast.success('User created successfully');
        }
      }
      
      if (isStandalone) navigate('/admin/users');
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update user' : 'Failed to create user');
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="p-4 text-center animate-pulse">Loading...</div>;
  }

  return (
    <div className={`space-y-6 ${isStandalone ? 'animate-fade-in' : ''}`}>
      {isStandalone && (
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-all"
        >
          <ChevronLeft className="mr-2" /> Back to Users
        </button>
      )}

      <Card className={`p-6 shadow-lg ${isStandalone ? 'animate-slide-up' : ''}`}>
        <h2 className="text-xl font-bold mb-6">{isEditMode ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Leave blank to use email as username"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password {isEditMode && <span className="text-gray-500 text-xs">(Leave blank to keep current)</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...(!isEditMode && { required: true, minLength: 8 })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            {/* Confirm Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordError ? 'border-red-500' : ''
                  }`}
                  {...(!isEditMode && { required: true })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">User Type</label>
              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {USER_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Status</label>
              <select
                name="account_status"
                value={formData.account_status}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ACCOUNT_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="flex items-center mt-4">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">User Active</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-start space-x-4">
              {previewUrl && (
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={previewUrl} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <label className="flex flex-col items-center px-4 py-2 bg-white text-blue-600 rounded-lg border border-blue-600 cursor-pointer hover:bg-blue-50 transition-colors">
                  <Upload className="h-5 w-5 mb-1" />
                  <span className="text-sm">Upload Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition-all'
              }`}
            >
              {loading ? 'Processing...' : isEditMode ? 'Update User' : 'Create User'}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={isStandalone ? () => navigate('/admin/users') : onCancel}
              className="flex-1 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserFormPage;
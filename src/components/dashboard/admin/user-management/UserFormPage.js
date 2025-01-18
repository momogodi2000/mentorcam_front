import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../ui/card';
import { ChevronLeft } from 'lucide-react';
import { UserService } from '../../../services/admin/crud';
import { toast } from 'react-hot-toast';

const UserFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id !== 'new';
  const [loading, setLoading] = useState(false);

  const USER_TYPES = [
    { value: 'amateur', label: 'Amateur' },
    { value: 'professional', label: 'Professional' },
    { value: 'institution', label: 'Institution' },
    { value: 'admin', label: 'Admin' }
  ];

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    phone_number: '',
    user_type: 'amateur'
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (isEditMode) {
        setLoading(true);
        try {
          const userData = await UserService.getUser(id);
          setFormData(userData);
        } catch (error) {
          toast.error('Failed to fetch user details');
          console.error('Error fetching user:', error);
          navigate('/admin/users');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [id, isEditMode, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await UserService.updateUser(id, formData);
        toast.success('User updated successfully');
      } else {
        await UserService.createUser(formData);
        toast.success('User created successfully');
      }
      navigate('/admin/users');
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update user' : 'Failed to create user');
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  // Rest of your JSX remains the same, but add loading state handling
  // to the submit button
  return (
    <div className="space-y-6">
      {/* Previous JSX remains the same until the form buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : isEditMode ? 'Update User' : 'Create User'}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => navigate('/admin/users')}
          className="flex-1 px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserFormPage;
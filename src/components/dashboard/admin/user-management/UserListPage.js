import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Filter, CreditCard, UserCheck } from 'lucide-react';
import { Card } from '../../../ui/card';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../../services/admin/crud';
import { toast } from 'react-hot-toast';
import Modal from '../../../ui/modal'; // Assuming you have a Modal component
import UserForm from '../user-management/UserFormPage'; // Reusable form for adding/editing users

const UserListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    userType: '',
    accountStatus: ''
  });
  const [isPaymentVerificationLoading, setIsPaymentVerificationLoading] = useState(false);

  // Define user types and account statuses
  const USER_TYPES = [
    { value: '', label: 'All Types' },
    { value: 'amateur', label: 'Amateur' },
    { value: 'professional', label: 'Professional' },
    { value: 'institution', label: 'Institution' },
    { value: 'admin', label: 'Admin' }
  ];

  const ACCOUNT_STATUSES = [
    { value: '', label: 'All Statuses' },
    { value: 'activated', label: 'Activated' },
    { value: 'blocked', label: 'Blocked' }
  ];

  // Fetch users on component mount and when search term or filters change
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await UserService.getUsers(
          searchTerm, 
          filters.userType, 
          filters.accountStatus
        );
        setUsers(data);
      } catch (error) {
        toast.error('Failed to fetch users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters.userType, filters.accountStatus]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await UserService.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const updatedUser = await UserService.toggleUserActive(id);
      setUsers(users.map(user => 
        user.id === id ? updatedUser : user
      ));
      toast.success(`User active status ${updatedUser.is_active ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update user active status');
      console.error('Error updating user active status:', error);
    }
  };
  
  const handleToggleAccountStatus = async (id) => {
    try {
      const updatedUser = await UserService.toggleAccountStatus(id);
      setUsers(users.map(user => 
        user.id === id ? updatedUser : user
      ));
      toast.success(`User account ${updatedUser.account_status} successfully`);
    } catch (error) {
      toast.error('Failed to update account status');
      console.error('Error updating account status:', error);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const newUser = await UserService.createUser(userData);
      setUsers([...users, newUser]);
      toast.success('User added successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to add user');
      console.error('Error adding user:', error);
    }
  };
  
  const handleVerifyProfessionalPayments = async () => {
    setIsPaymentVerificationLoading(true);
    try {
      const results = await UserService.verifyProfessionalPayments();
      toast.success(`Verified ${results.length} professional users' payments`);
      
      // Refresh the user list
      const data = await UserService.getUsers(
        searchTerm, 
        filters.userType, 
        filters.accountStatus
      );
      setUsers(data);
    } catch (error) {
      toast.error('Failed to verify professional payments');
      console.error('Error verifying payments:', error);
    } finally {
      setIsPaymentVerificationLoading(false);
    }
  };
  
  const handleViewProfessionalDetails = (id) => {
    navigate(`/admin/users/${id}/professional-details`);
  };
  
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
  };

  // Function to get account status badge color
  const getStatusBadgeColor = (status) => {
    return status === 'activated' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
          >
            <Filter className="mr-2 h-4 w-4" /> Filters
          </button>
          {(filters.userType || filters.accountStatus) && (
            <div className="flex items-center text-sm text-gray-600">
              <span>Filters active</span>
            </div>
          )}
          <button
            onClick={handleVerifyProfessionalPayments}
            disabled={isPaymentVerificationLoading}
            className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            <CreditCard className="mr-2 h-4 w-4" /> 
            {isPaymentVerificationLoading ? 'Verifying...' : 'Verify Pro Payments'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            <Plus className="mr-2 h-4 w-4" /> Add User
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="text-gray-500" />
      </div>

      <Card className="overflow-hidden shadow-lg animate-slide-up">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Full Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Phone Number</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">User Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{user.user_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(user.account_status)}`}>
                          {user.account_status.charAt(0).toUpperCase() + user.account_status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                          className="text-blue-600 hover:text-blue-900 transition-all"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        {user.user_type === 'professional' && (
                          <button
                            onClick={() => handleViewProfessionalDetails(user.id)}
                            className="text-purple-600 hover:text-purple-900 transition-all"
                          >
                            <UserCheck className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(user.id)}
                          className={`${user.is_active ? 'text-gray-600' : 'text-green-600'} transition-all text-xs px-2 py-1 border rounded`}
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleToggleAccountStatus(user.id)}
                          className={`${user.account_status === 'activated' ? 'text-red-600' : 'text-green-600'} transition-all text-xs px-2 py-1 border rounded`}
                        >
                          {user.account_status === 'activated' ? 'Block' : 'Unblock'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Add User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserForm onSubmit={handleAddUser} onCancel={() => setIsModalOpen(false)} />
      </Modal>
      
      {/* Filter Modal */}
      <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Filter Users</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
              <select
                value={filters.userType}
                onChange={(e) => setFilters({...filters, userType: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {USER_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <select
                value={filters.accountStatus}
                onChange={(e) => setFilters({...filters, accountStatus: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ACCOUNT_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => handleApplyFilters(filters)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  setFilters({ userType: '', accountStatus: '' });
                  setIsFilterModalOpen(false);
                }}
                className="flex-1 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserListPage;
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
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

  // Fetch users on component mount and when search term changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await UserService.getUsers(searchTerm);
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
  }, [searchTerm]);

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
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user status:', error);
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          <Plus className="mr-2" /> Add User
        </button>
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
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.user_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                          className="text-blue-600 hover:text-blue-900 transition-all"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(user.id)}
                          className={`${user.is_active ? 'text-green-600' : 'text-gray-600'} transition-all`}
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
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
    </div>
  );
};

export default UserListPage;
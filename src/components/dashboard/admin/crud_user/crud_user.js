import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Save, ChevronLeft, ChevronRight, Sun, Moon, Globe, Users, 
  BookOpen, Calendar, CreditCard, Bell, BarChart2, Settings, Menu, BookOpenCheck, TrendingUp, 
  Wallet, PhoneCall, LogOut } from 'lucide-react';
import { Card } from '../../../ui/card';
import { useNavigate } from 'react-router-dom';

const AdminCRUD = () => {
  // Theme and UI state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // User management state
  const [users, setUsers] = useState([
    { 
      id: 1, 
      email: 'admin@mentorcam.com',
      username: 'admin',
      full_name: 'Admin User',
      phone_number: '+237600000000',
      user_type: 'admin',
      is_active: true 
    },
    { 
      id: 2, 
      email: 'pro@mentorcam.com',
      username: 'professional1',
      full_name: 'Professional User',
      phone_number: '+237600000001',
      user_type: 'professional',
      is_active: true 
    },
    { 
      id: 3, 
      email: 'amateur@mentorcam.com',
      username: 'amateur1',
      full_name: 'Amateur User',
      phone_number: '+237600000002',
      user_type: 'amateur',
      is_active: true 
    }
  ]);

  // Form and modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    phone_number: '',
    user_type: 'amateur'
  });

  // Constants
  const USER_TYPES = [
    { value: 'amateur', label: isEnglish ? 'Amateur' : 'Amateur' },
    { value: 'professional', label: isEnglish ? 'Professional' : 'Professionnel' },
    { value: 'institution', label: isEnglish ? 'Institution' : 'Institution' },
    { value: 'admin', label: isEnglish ? 'Admin' : 'Admin' }
  ];

  const menuItems = [
    { icon: BarChart2, label: isEnglish ? 'Dashboard' : 'Tableau de Bord', path: '/dashboard' },
    { icon: Users, label: isEnglish ? 'Users' : 'Utilisateurs', path: '/users' },
    { icon: BookOpen, label: isEnglish ? 'Courses' : 'Formations', path: '/courses' },
    { icon: Calendar, label: isEnglish ? 'Events' : 'Événements', path: '/events' },
    { icon: Wallet, label: isEnglish ? 'Payments' : 'Paiements', path: '/payments' },
    { icon: Settings, label: isEnglish ? 'Settings' : 'Paramètres', path: '/settings' }
  ];

  // Event handlers
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdd = () => {
    setCurrentUser(null);
    setFormData({
      email: '',
      username: '',
      full_name: '',
      phone_number: '',
      user_type: 'amateur'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      phone_number: user.phone_number,
      user_type: user.user_type
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === currentUser.id 
            ? { ...user, ...formData }
            : user
        ));
      } else {
        // Add new user
        const newUser = {
          id: users.length + 1,
          ...formData,
          is_active: true
        };
        setUsers([...users, newUser]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <BookOpenCheck className="w-8 h-8 text-blue-600" />
            <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              MentorCam
            </span>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                item.path === '/users'
                  ? 'bg-blue-600 text-white'
                  : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <PhoneCall className="w-5 h-5 text-gray-500" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Support: +237 6XX XXX XXX
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
          >
            <LogOut className="w-5 h-5 mr-3" />
            {isEnglish ? 'Logout' : 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`p-4 sm:ml-64 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Top Navigation */}
        <Card className={`mb-6 p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-500 dark:text-gray-400"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-6">
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button 
                onClick={() => setIsEnglish(!isEnglish)} 
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Globe className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <span className="ml-2">{isEnglish ? 'EN' : 'FR'}</span>
              </button>
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </Card>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {isEnglish ? 'User Management' : 'Gestion des Utilisateurs'}
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isEnglish ? 'Manage platform users and their permissions' : 'Gérer les utilisateurs et leurs permissions'}
          </p>
        </div>

        {/* Search and Add User */}
        <Card className={`mb-6 p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={isEnglish ? "Search users..." : "Rechercher des utilisateurs..."}
                className={`pl-10 pr-4 py-2 border rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
            >
              <Plus className="h-5 w-5" />
              {isEnglish ? 'Add User' : 'Ajouter un Utilisateur'}
            </button>
          </div>
        </Card>

        {/* Users Table */}
        <Card className={`overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Email
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    {isEnglish ? 'Username' : 'Nom d\'utilisateur'}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    {isEnglish ? 'Full Name' : 'Nom Complet'}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    {isEnglish ? 'Phone' : 'Téléphone'}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    {isEnglish ? 'Type' : 'Type'}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    {isEnglish ? 'Status' : 'Statut'}
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    {isEnglish ? 'Actions' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredUsers.map(user => (
                  <tr key={user.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {user.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {user.phone_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${user.user_type === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : user.user_type === 'professional'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : user.user_type === 'institution'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                        {user.user_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${user.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {user.is_active ? (isEnglish ? 'Active' : 'Actif') : (isEnglish ? 'Inactive' : 'Inactif')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={`px-6 py-4 flex items-center justify-between border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {isEnglish ? 'Showing' : 'Affichage de'} {filteredUsers.length} {isEnglish ? 'results' : 'résultats'}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 disabled:text-gray-600' 
                    : 'hover:bg-gray-100 disabled:text-gray-300'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={filteredUsers.length < 10}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 disabled:text-gray-600' 
                    : 'hover:bg-gray-100 disabled:text-gray-300'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Card>

        {/* User Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black opacity-30"></div>
              <Card className={`relative w-full max-w-md p-6 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
                <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentUser ? (isEnglish ? 'Edit User' : 'Modifier l\'utilisateur') 
                    : (isEnglish ? 'Add New User' : 'Ajouter un utilisateur')}
                </h3>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {isEnglish ? 'Username' : 'Nom d\'utilisateur'}
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {isEnglish ? 'Full Name' : 'Nom Complet'}
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {isEnglish ? 'Phone Number' : 'Numéro de téléphone'}
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {isEnglish ? 'User Type' : 'Type d\'utilisateur'}
                    </label>
                    <select
                      name="user_type"
                      value={formData.user_type}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    >
                      {USER_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {isEnglish ? 'Save' : 'Enregistrer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {isEnglish ? 'Cancel' : 'Annuler'}
                    </button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCRUD;
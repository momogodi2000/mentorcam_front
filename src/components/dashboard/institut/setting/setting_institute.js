import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Mail, Phone, MapPin, Camera, Globe, Settings,
    Moon, Sun, Languages, Save, X, ChevronRight, Bell,
    Shield, Upload, Download
} from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Switch } from '../../../ui/Switch';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { getUser } from '../../../services/get_user'; // Import services
import { updateUser } from '../../../services/update_profile'; // Import services
import InstitutionLayout from '../institut_layout'; // Import ProfessionalLayout

const InstitutePage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isEnglish, setIsEnglish] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        profile_picture: null,
        user_type: '',
        location: '',
        last_logout: '',
    });
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        profile_picture: null,
        location: '',
    });

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUser();
                setUserInfo(userData);
                setFormData({
                    full_name: userData.full_name,
                    phone_number: userData.phone_number,
                    profile_picture: userData.profile_picture,
                    location: userData.location,
                });
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle profile picture upload
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    profile_picture: file,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('full_name', formData.full_name);
            formDataToSend.append('phone_number', formData.phone_number);
            formDataToSend.append('location', formData.location);
            if (formData.profile_picture instanceof File) {
                formDataToSend.append('profile_picture', formData.profile_picture);
            }

            const updatedUser = await updateUser(formDataToSend);
            setUserInfo(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update user data:', error);
        }
    };

    const tabs = [
        { id: 'profile', label: isEnglish ? 'Profile' : 'Profil', icon: User },
        { id: 'notifications', label: isEnglish ? 'Notifications' : 'Notifications', icon: Bell },
        { id: 'security', label: isEnglish ? 'Security' : 'Sécurité', icon: Shield },
        { id: 'data', label: isEnglish ? 'Data' : 'Données', icon: Download },
    ];

    return (
        <InstitutionLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
            <div className="max-w-7xl mx-auto p-4 space-y-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="relative"
                                >
                                    <Avatar className="w-32 h-32 border-4 border-white">
                                        <AvatarImage src={userInfo.profile_picture} />
                                        <AvatarFallback className="text-4xl bg-white text-blue-600">
                                            {userInfo.full_name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <motion.label
                                        whileHover={{ scale: 1.1 }}
                                        className="absolute bottom-0 right-0 p-2 rounded-full bg-white text-blue-600 cursor-pointer shadow-lg"
                                    >
                                        <Camera className="w-5 h-5" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleProfilePictureChange} />
                                    </motion.label>
                                </motion.div>
                                
                                <div className="flex-grow text-center md:text-left">
                                    <h1 className="text-3xl font-bold mb-2">{userInfo.full_name}</h1>
                                    <p className="text-xl opacity-90 mb-4">{userInfo.user_type}</p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        <div className="flex items-center">
                                            <MapPin className="w-5 h-5 mr-2 opacity-75" />
                                            <span>{userInfo.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Mail className="w-5 h-5 mr-2 opacity-75" />
                                            <span>{userInfo.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Settings Tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Card className="lg:col-span-1">
                        <CardContent className="p-4">
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        whileHover={{ x: 5 }}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-600 text-white'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5 mr-3" />
                                        <span className="flex-grow text-left">{tab.label}</span>
                                        <ChevronRight className="w-5 h-5 opacity-50" />
                                    </motion.button>
                                ))}
                            </nav>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-3 space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        {/* Profile Settings */}
                                        {activeTab === 'profile' && (
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <h2 className="text-2xl font-semibold">
                                                        {isEnglish ? 'Profile Settings' : 'Paramètres du Profil'}
                                                    </h2>
                                                    <Button
                                                        variant={isEditing ? "destructive" : "default"}
                                                        onClick={() => setIsEditing(!isEditing)}
                                                    >
                                                        {isEditing ? <X className="w-4 h-4 mr-2" /> : <Settings className="w-4 h-4 mr-2" />}
                                                        {isEditing ? (isEnglish ? 'Cancel' : 'Annuler') : (isEnglish ? 'Edit' : 'Modifier')}
                                                    </Button>
                                                </div>

                                                {isEditing ? (
                                                    <form onSubmit={handleSubmit} className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">
                                                                {isEnglish ? 'Full Name' : 'Nom Complet'}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="full_name"
                                                                value={formData.full_name}
                                                                onChange={handleInputChange}
                                                                className="w-full px-3 py-2 rounded-lg border border-gray-300"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">
                                                                {isEnglish ? 'Phone Number' : 'Numéro de Téléphone'}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="phone_number"
                                                                value={formData.phone_number}
                                                                onChange={handleInputChange}
                                                                className="w-full px-3 py-2 rounded-lg border border-gray-300"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">
                                                                {isEnglish ? 'Location' : 'Localisation'}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="location"
                                                                value={formData.location}
                                                                onChange={handleInputChange}
                                                                className="w-full px-3 py-2 rounded-lg border border-gray-300"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">
                                                                {isEnglish ? 'Profile Picture' : 'Photo de Profil'}
                                                            </label>
                                                            <input
                                                                type="file"
                                                                name="profile_picture"
                                                                onChange={handleProfilePictureChange}
                                                                className="w-full px-3 py-2 rounded-lg border border-gray-300"
                                                            />
                                                        </div>
                                                        <Button type="submit" className="w-full">
                                                            {isEnglish ? 'Save Changes' : 'Enregistrer les Modifications'}
                                                        </Button>
                                                    </form>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* Display user information */}
                                                        <div className="space-y-4">
                                                            <h3 className="font-medium">
                                                                {isEnglish ? 'Account Settings' : 'Paramètres du Compte'}
                                                            </h3>
                                                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                                                                <div className="flex items-center">
                                                                    <Moon className="w-5 h-5 mr-3 text-gray-500" />
                                                                    <span>{isEnglish ? 'Dark Mode' : 'Mode Sombre'}</span>
                                                                </div>
                                                                <Switch
                                                                    checked={isDarkMode}
                                                                    onCheckedChange={setIsDarkMode}
                                                                />
                                                            </div>
                                                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                                                                <div className="flex items-center">
                                                                    <Globe className="w-5 h-5 mr-3 text-gray-500" />
                                                                    <span>{isEnglish ? 'Language' : 'Langue'}</span>
                                                                </div>
                                                                <Switch
                                                                    checked={isEnglish}
                                                                    onCheckedChange={setIsEnglish}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Notifications Settings */}
                                        {activeTab === 'notifications' && (
                                            <div className="space-y-6">
                                                <h2 className="text-2xl font-semibold">
                                                    {isEnglish ? 'Notification Preferences' : 'Préférences de Notification'}
                                                </h2>
                                                {/* Add notification settings here */}
                                            </div>
                                        )}

                                        {/* Security Settings */}
                                        {activeTab === 'security' && (
                                            <div className="space-y-6">
                                                <h2 className="text-2xl font-semibold">
                                                    {isEnglish ? 'Security Settings' : 'Paramètres de Sécurité'}
                                                </h2>
                                                {/* Add security settings here */}
                                            </div>
                                        )}

                                        {/* Data Management */}
                                        {activeTab === 'data' && (
                                            <div className="space-y-6">
                                                <h2 className="text-2xl font-semibold">
                                                    {isEnglish ? 'Data Management' : 'Gestion des Données'}
                                                </h2>
                                                {/* Add data management settings here */}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </InstitutionLayout>
    );
};

export default InstitutePage;
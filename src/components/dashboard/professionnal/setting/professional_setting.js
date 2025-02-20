import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Camera, Globe, Settings,
  Moon, Sun, Languages, Save, X, ChevronRight, Bell,
  Shield, Upload, Download, Calendar, Building
} from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Switch } from '../../../ui/Switch';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tab';
import { Label } from '../../../ui/label_2';
import { Input } from '../../../ui/input';
import { Alert, AlertDescription } from '../../../ui/alert';
import { getUser } from '../../../services/get_user';
import { updateUser } from '../../../services/update_profile';
import ProfessionalLayout from '../professionnal_layout';

const SettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    profile_picture: null,
    user_type: '',
    location: '',
    last_logout: '',
    username: ''
  });

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    profile_picture: null,
    location: '',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_picture: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const updatedUser = await updateUser(formDataToSend);
      setUserInfo(prev => ({ ...prev, ...updatedUser }));
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case 'professional': return Building;
      case 'institution': return Building;
      case 'admin': return Shield;
      default: return User;
    }
  };

  const UserTypeIcon = getUserTypeIcon(userInfo.user_type);

  return (
    <ProfessionalLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Avatar className="w-32 h-32 border-4 border-white/20 rounded-full overflow-hidden">
                    <AvatarImage 
                      src={userInfo.profile_picture} 
                      className="object-cover"
                    />
                    <AvatarFallback className="text-4xl bg-white/10 text-white">
                      {userInfo.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <motion.label
                      whileHover={{ scale: 1.1 }}
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-white text-indigo-600 cursor-pointer shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleProfilePictureChange}
                      />
                    </motion.label>
                  )}
                </motion.div>
                
                <div className="flex-grow text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{userInfo.full_name}</h1>
                    <UserTypeIcon className="w-6 h-6 opacity-75" />
                  </div>
                  <p className="text-xl opacity-90 mb-4 capitalize">{userInfo.user_type}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 opacity-75" />
                      <span>{userInfo.location || 'Location not set'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 opacity-75" />
                      <span>{userInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 opacity-75" />
                      <span>{userInfo.phone_number || 'Phone not set'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 opacity-75" />
                      <span>Last logout: {formatDate(userInfo.last_logout)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {updateSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert className="bg-green-100 border-green-500">
                <AlertDescription className="text-green-800">
                  Profile updated successfully!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    Profile Settings
                  </h2>
                  <Button
                    variant={isEditing ? "destructive" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                          id="phone_number"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center">
                          <Moon className="w-5 h-5 mr-3 text-gray-500" />
                          <span>Dark Mode</span>
                        </div>
                        <Switch
                          checked={isDarkMode}
                          onCheckedChange={setIsDarkMode}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center">
                          <Globe className="w-5 h-5 mr-3 text-gray-500" />
                          <span>Language</span>
                        </div>
                        <Switch
                          checked={isEnglish}
                          onCheckedChange={setIsEnglish}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Notification Preferences</h2>
                {/* Add notification settings here */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Security Settings</h2>
                {/* Add security settings here */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">User Preferences</h2>
                {/* Add preferences settings here */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProfessionalLayout>
  );
};

export default SettingsPage;
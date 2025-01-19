import React, { useState } from 'react';
import { 
    User, Mail, Phone, MapPin, Briefcase, BookOpen, Calendar, 
    Edit2, Camera, Shield, Bell, Globe, Download, Settings,
    Facebook, Linkedin, Twitter, Heart, Star, Award, Clock,
    Book, Target, Rocket, Users, Coffee, CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import BeginnerLayout from '../biginner_layout';

const ProfilePage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isEnglish, setIsEnglish] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const userInfo = {
        name: "Jean Dubois",
        role: isEnglish ? "Junior Developer" : "Développeur Junior",
        location: "Douala, Cameroun",
        email: "jean.dubois@email.com",
        phone: "+237 6XX XXX XXX",
        joinDate: "Janvier 2024",
        bio: isEnglish 
            ? "Passionate about web development and artificial intelligence. Currently focusing on React and Python development."
            : "Passionné par le développement web et l'intelligence artificielle. Actuellement concentré sur le développement React et Python.",
        skills: [
            { name: "React.js", level: 75 },
            { name: "Python", level: 65 },
            { name: "JavaScript", level: 80 },
            { name: "HTML/CSS", level: 85 }
        ],
        languages: [
            { name: isEnglish ? "French" : "Français", level: "Native" },
            { name: isEnglish ? "English" : "Anglais", level: "Intermediate" }
        ],
        stats: [
            { 
                icon: Clock,
                label: isEnglish ? "Learning Hours" : "Heures d'apprentissage",
                value: "120h"
            },
            {
                icon: Award,
                label: isEnglish ? "Certificates" : "Certificats",
                value: "4"
            },
            {
                icon: Star,
                label: isEnglish ? "Completed Projects" : "Projets Complétés",
                value: "8"
            },
            {
                icon: Heart,
                label: isEnglish ? "Mentors" : "Mentors",
                value: "5"
            }
        ],
        interests: [
            isEnglish ? "Web Development" : "Développement Web",
            isEnglish ? "Artificial Intelligence" : "Intelligence Artificielle",
            isEnglish ? "Mobile Apps" : "Applications Mobiles",
            isEnglish ? "UI/UX Design" : "Design UI/UX"
        ],
        // Added missing data structures
        currentLearning: [
            {
                title: isEnglish ? "Advanced React Patterns" : "Motifs React Avancés",
                progress: 65,
                mentor: "Sarah Johnson",
                nextSession: "2024-02-01"
            },
            {
                title: isEnglish ? "Python Data Science" : "Science des Données Python",
                progress: 45,
                mentor: "David Chen",
                nextSession: "2024-02-03"
            }
        ],
        achievements: [
            {
                title: isEnglish ? "React Certification" : "Certification React",
                date: "Jan 2024",
                icon: Award
            },
            {
                title: isEnglish ? "First Project Deployed" : "Premier Projet Déployé",
                date: "Dec 2023",
                icon: Rocket
            }
        ],
        upcomingEvents: [
            {
                title: isEnglish ? "Tech Meetup" : "Rencontre Tech",
                type: isEnglish ? "Networking" : "Réseautage",
                location: "Douala Tech Hub",
                date: "2024-02-15"
            },
            {
                title: isEnglish ? "Code Workshop" : "Atelier de Code",
                type: isEnglish ? "Workshop" : "Atelier",
                location: "Online",
                date: "2024-02-20"
            }
        ]
    };

    return (
        <BeginnerLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
            <div className="max-w-7xl mx-auto p-4">
                {/* Profile Header */}
                <div className="relative mb-8">
                    {/* Cover Image */}
                    <div className="h-48 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600" />
                    
                    {/* Profile Info Card */}
                    <Card className={`relative -mt-24 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                {/* Profile Picture */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white dark:border-gray-800">
                                        <span className="text-4xl font-bold text-blue-600">
                                            {userInfo.name.charAt(0)}
                                        </span>
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Basic Info */}
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-2">
                                        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {userInfo.name}
                                        </h1>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            {isEnglish ? 'Edit Profile' : 'Modifier le Profil'}
                                        </button>
                                    </div>
                                    <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {userInfo.role}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                                {userInfo.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                                {isEnglish ? 'Joined ' : 'Inscrit en '}{userInfo.joinDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Contact Information */}
                        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                            <CardContent className="p-6">
                                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {isEnglish ? 'Contact Information' : 'Informations de Contact'}
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Mail className="w-5 h-5 mr-3 text-gray-400" />
                                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                            {userInfo.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="w-5 h-5 mr-3 text-gray-400" />
                                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                            {userInfo.phone}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-4">
                                    <button className="p-2 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700">
                                        <Linkedin className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700">
                                        <Twitter className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700">
                                        <Facebook className="w-5 h-5" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                            <CardContent className="p-6">
                                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {isEnglish ? 'Skills' : 'Compétences'}
                                </h2>
                                <div className="space-y-4">
                                    {userInfo.skills.map((skill, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between mb-1">
                                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {skill.name}
                                                </span>
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {skill.level}%
                                                </span>
                                            </div>
                                            <Progress value={skill.level} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Languages */}
                        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                            <CardContent className="p-6">
                                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {isEnglish ? 'Languages' : 'Langues'}
                                </h2>
                                <div className="space-y-3">
                                    {userInfo.languages.map((language, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                                                {language.name}
                                            </span>
                                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {language.level}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Center and Right Columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {userInfo.stats.map((stat, index) => (
                                <Card key={index} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                                    <CardContent className="p-4">
                                        <stat.icon className={`w-6 h-6 mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                        <h3 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {stat.label}
                                        </h3>
                                        <p className={`text-2xl font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {stat.value}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Current Learning Progress */}
                        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                            <CardContent className="p-6">
                                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {isEnglish ? 'Current Learning Progress' : 'Progression d\'Apprentissage'}
                                </h2>
                                <div className="space-y-6">
                                    {userInfo.currentLearning.map((course, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {course.title}
                                                </h3>
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {course.progress}%
                                                </span>
                                            </div>
                                            <Progress value={course.progress} className="h-2" />
                                            <div className="flex justify-between text-sm mt-1">
                                                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                                    {isEnglish ? 'Mentor: ' : 'Mentor: '}{course.mentor}
                                                </span>
                                                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                                    {isEnglish ? 'Next Session: ' : 'Prochaine Session: '}
                                                    {new Date(course.nextSession).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Achievements */}
                        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                            <CardContent className="p-6">
                                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {isEnglish ? 'Recent Achievements' : 'Réalisations Récentes'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {userInfo.achievements.map((achievement, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                            <achievement.icon className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                            <div>
                                                <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {achievement.title}
                                                </h3>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {achievement.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upcoming Events */}
                        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                            <CardContent className="p-6">
                                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {isEnglish ? 'Upcoming Events' : 'Événements à Venir'}
                                </h2>
                                <div className="space-y-4">
                                    {userInfo.upcomingEvents.map((event, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                                            <div>
                                                <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {event.title}
                                                </h3>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {event.type} • {event.location}
                                                </p>
                                            </div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {new Date(event.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* About */}
                        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                            <CardContent className="p-6">
                                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {isEnglish ? 'About' : 'À Propos'}
                                </h2>
                                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {userInfo.bio}
                                </p>
                                <div className="mt-4">
                                    <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {isEnglish ? 'Interests' : 'Centres d\'intérêt'}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {userInfo.interests.map((interest, index) => (
                                            <span
                                                key={index}
                                                className={`px-3 py-1 rounded-full text-sm ${
                                                    isDarkMode 
                                                        ? 'bg-gray-700 text-gray-300' 
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Settings Card */}
                        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                            <CardContent className="p-6">
                                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {isEnglish ? 'Settings' : 'Paramètres'}
                                </h2>
                                <div className="space-y-4">
                                    {/* Language Toggle */}
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <Globe className="w-5 h-5 text-gray-400" />
                                            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                                                {isEnglish ? 'Language' : 'Langue'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setIsEnglish(!isEnglish)}
                                            className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 dark:bg-gray-600 dark:text-blue-400"
                                        >
                                            {isEnglish ? 'EN' : 'FR'}
                                        </button>
                                    </div>
                                    
                                    {/* Dark Mode Toggle */}
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <Settings className="w-5 h-5 text-gray-400" />
                                            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                                                {isEnglish ? 'Dark Mode' : 'Mode Sombre'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setIsDarkMode(!isDarkMode)}
                                            className={`px-3 py-1 rounded-md ${
                                                isDarkMode 
                                                    ? 'bg-gray-600 text-blue-400' 
                                                    : 'bg-blue-100 text-blue-600'
                                            }`}
                                        >
                                            {isDarkMode ? (
                                                isEnglish ? 'ON' : 'ACTIVÉ'
                                            ) : (
                                                isEnglish ? 'OFF' : 'DÉSACTIVÉ'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </BeginnerLayout>
    );
};

export default ProfilePage;
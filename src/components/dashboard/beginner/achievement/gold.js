import React, { useState } from 'react';
import { Trophy, Star, Target, BookOpen, Heart, Zap, Award, Clock, Users, Check } from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import BeginnerLayout from '../biginner_layout';

const AchievementsPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isEnglish, setIsEnglish] = useState(false);

    const achievementCategories = [
        {
            title: isEnglish ? 'Learning Milestones' : 'Étapes d\'apprentissage',
            icon: Trophy,
            achievements: [
                {
                    name: isEnglish ? 'Fast Learner' : 'Apprenant Rapide',
                    description: isEnglish ? 'Complete 5 courses in one month' : 'Compléter 5 cours en un mois',
                    progress: 80,
                    icon: Zap,
                    completed: true,
                    date: '2024-01-15',
                    points: 100
                },
                {
                    name: isEnglish ? 'Knowledge Seeker' : 'Chercheur de Connaissances',
                    description: isEnglish ? 'Attend 10 different workshops' : 'Participer à 10 ateliers différents',
                    progress: 60,
                    icon: BookOpen,
                    completed: false,
                    points: 150
                }
            ]
        },
        {
            title: isEnglish ? 'Community Engagement' : 'Engagement Communautaire',
            icon: Users,
            achievements: [
                {
                    name: isEnglish ? 'Networking Pro' : 'Pro du Réseautage',
                    description: isEnglish ? 'Connect with 20 mentors' : 'Se connecter avec 20 mentors',
                    progress: 75,
                    icon: Heart,
                    completed: false,
                    points: 200
                },
                {
                    name: isEnglish ? 'Active Participant' : 'Participant Actif',
                    description: isEnglish ? 'Participate in 15 group sessions' : 'Participer à 15 sessions de groupe',
                    progress: 100,
                    icon: Star,
                    completed: true,
                    date: '2024-01-10',
                    points: 175
                }
            ]
        },
        {
            title: isEnglish ? 'Skill Development' : 'Développement des Compétences',
            icon: Target,
            achievements: [
                {
                    name: isEnglish ? 'Tech Master' : 'Maître Technique',
                    description: isEnglish ? 'Complete advanced technical track' : 'Compléter le parcours technique avancé',
                    progress: 90,
                    icon: Award,
                    completed: true,
                    date: '2024-01-18',
                    points: 300
                },
                {
                    name: isEnglish ? 'Consistent Learner' : 'Apprenant Régulier',
                    description: isEnglish ? 'Study for 30 days in a row' : 'Étudier pendant 30 jours consécutifs',
                    progress: 40,
                    icon: Clock,
                    completed: false,
                    points: 250
                }
            ]
        }
    ];

    return (
        <BeginnerLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {isEnglish ? 'Achievements' : 'Réalisations'}
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {isEnglish 
                            ? 'Track your progress and unlock new achievements'
                            : 'Suivez votre progression et débloquez de nouvelles réalisations'}
                    </p>
                </div>

                {/* Progress Overview */}
                <Card className={`mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                    <CardContent className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {isEnglish ? 'Total Progress' : 'Progression Totale'}
                                </h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                        <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            1250 {isEnglish ? 'points' : 'points'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Award className="w-5 h-5 text-blue-400 mr-2" />
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            3/6 {isEnglish ? 'completed' : 'complétés'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-grow max-w-md">
                                <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700">
                                    <div 
                                        className="h-4 bg-blue-600 rounded-full transition-all duration-500" 
                                        style={{ width: '50%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Achievement Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievementCategories.map((category, index) => (
                        <Card 
                            key={index} 
                            className={`transform transition-all duration-300 hover:scale-102 ${
                                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
                            }`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center mb-4">
                                    <category.icon className={`w-6 h-6 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                    <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {category.title}
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {category.achievements.map((achievement, achievementIndex) => (
                                        <div 
                                            key={achievementIndex}
                                            className={`p-4 rounded-lg border ${
                                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <achievement.icon 
                                                        className={`w-5 h-5 mr-2 ${
                                                            achievement.completed 
                                                                ? 'text-green-400' 
                                                                : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}
                                                    />
                                                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {achievement.name}
                                                    </span>
                                                </div>
                                                <span className={`text-sm font-medium ${
                                                    achievement.completed 
                                                        ? 'text-green-400' 
                                                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    {achievement.points} pts
                                                </span>
                                            </div>
                                            <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {achievement.description}
                                            </p>
                                            <div className="relative pt-1">
                                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                                                    <div 
                                                        className={`h-2 rounded-full transition-all duration-500 ${
                                                            achievement.completed ? 'bg-green-400' : 'bg-blue-600'
                                                        }`}
                                                        style={{ width: `${achievement.progress}%` }}
                                                    />
                                                </div>
                                                <span className={`text-xs mt-1 block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {achievement.progress}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </BeginnerLayout>
    );
};

export default AchievementsPage;
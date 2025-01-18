import React, { useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { BookOpen, Video, Clock, Award, CheckCircle, Lock, ChevronRight, PlayCircle, Download, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import BeginnerLayout from '../biginner_layout';

const LearningPathPage = () => {
    const [activeModule, setActiveModule] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isEnglish, setIsEnglish] = useState(true);

    // Module and lesson data moved into the component
    const modules = [
        {
            title: isEnglish ? 'Web Development Fundamentals' : 'Fondamentaux du Développement Web',
            progress: 100,
            completed: true,
            lessons: 12,
            duration: '6h',
            mentors: 3
        },
        {
            title: isEnglish ? 'Frontend Technologies' : 'Technologies Frontend',
            progress: 65,
            completed: false,
            lessons: 15,
            duration: '8h',
            mentors: 4
        },
        {
            title: isEnglish ? 'Backend Development' : 'Développement Backend',
            progress: 30,
            completed: false,
            lessons: 18,
            duration: '10h',
            mentors: 5
        },
        {
            title: isEnglish ? 'Database Management' : 'Gestion de Base de Données',
            progress: 0,
            completed: false,
            lessons: 10,
            duration: '5h',
            mentors: 3
        }
    ];

    const currentLessons = [
        {
            title: isEnglish ? 'React Components & Props' : 'Composants React & Props',
            type: 'video',
            duration: '45 min',
            completed: true
        },
        {
            title: isEnglish ? 'State Management' : 'Gestion d\'État',
            type: 'practice',
            duration: '1h',
            completed: true
        },
        {
            title: isEnglish ? 'Hooks Implementation' : 'Implémentation des Hooks',
            type: 'video',
            duration: '30 min',
            completed: false
        },
        {
            title: isEnglish ? 'Project: Todo App' : 'Projet: Application Todo',
            type: 'project',
            duration: '2h',
            completed: false
        }
    ];

    const ContentComponent = () => (
        <div className="space-y-6">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2 dark:text-white">
                    {isEnglish ? 'Your Learning Path' : 'Votre Parcours d\'Apprentissage'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    {isEnglish 
                        ? 'Track your progress and continue your journey to becoming a fullstack developer'
                        : 'Suivez votre progression et continuez votre parcours pour devenir développeur fullstack'}
                </p>
            </motion.div>

            {/* Progress Overview */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Award className="w-8 h-8" />
                            <span className="text-2xl font-bold">65%</span>
                        </div>
                        <h3 className="text-lg font-semibold">
                            {isEnglish ? 'Overall Progress' : 'Progression Globale'}
                        </h3>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Clock className="w-8 h-8" />
                            <span className="text-2xl font-bold">24h</span>
                        </div>
                        <h3 className="text-lg font-semibold">
                            {isEnglish ? 'Learning Time' : 'Temps d\'Apprentissage'}
                        </h3>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="w-8 h-8" />
                            <span className="text-2xl font-bold">15</span>
                        </div>
                        <h3 className="text-lg font-semibold">
                            {isEnglish ? 'Active Mentors' : 'Mentors Actifs'}
                        </h3>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">
                        {isEnglish ? 'Learning Modules' : 'Modules d\'Apprentissage'}
                    </h2>
                    {modules.map((module, index) => (
                        <Card 
                            key={index}
                            className={`cursor-pointer transform transition-all duration-200 hover:scale-102 ${
                                activeModule === index ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setActiveModule(index)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {module.completed ? (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : (
                                            <Lock className="w-6 h-6 text-gray-400" />
                                        )}
                                        <div>
                                            <h3 className="font-medium dark:text-white">{module.title}</h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                <span>{module.lessons} {isEnglish ? 'lessons' : 'leçons'}</span>
                                                <span>{module.duration}</span>
                                                <span>{module.mentors} {isEnglish ? 'mentors' : 'mentors'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${module.progress}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">
                        {isEnglish ? 'Current Lessons' : 'Leçons en Cours'}
                    </h2>
                    <Card>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {currentLessons.map((lesson, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className={`p-4 rounded-lg border dark:border-gray-700 ${
                                            lesson.completed ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {lesson.type === 'video' ? (
                                                    <PlayCircle className="w-5 h-5 text-blue-500" />
                                                ) : lesson.type === 'practice' ? (
                                                    <BookOpen className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Download className="w-5 h-5 text-purple-500" />
                                                )}
                                                <div>
                                                    <h4 className="font-medium dark:text-white">{lesson.title}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {lesson.duration} • {lesson.type}
                                                    </p>
                                                </div>
                                            </div>
                                            {lesson.completed && (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );

    return (
        <BeginnerLayout
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isEnglish={isEnglish}
            setIsEnglish={setIsEnglish}
        >
            <ContentComponent />
        </BeginnerLayout>
    );
};

export default LearningPathPage;
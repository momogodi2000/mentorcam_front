import React from 'react';
import {
    Users, Clock, MapPin, User, Award
} from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InstitutionLayout from './institut_layout';

const InstitutionDashboard = ({ isEnglish }) => {
    // Données des statistiques institutionnelles
    const institutionData = [
        { month: 'Jan', recruitments: 5, mentorships: 8, events: 2 },
        { month: 'Feb', recruitments: 7, mentorships: 12, events: 3 },
        { month: 'Mar', recruitments: 10, mentorships: 15, events: 4 },
        { month: 'Apr', recruitments: 8, mentorships: 18, events: 3 },
    ];

    const stats = [
        {
            icon: Users,
            label: isEnglish ? 'Active Mentorships' : 'Mentorats Actifs',
            value: '18',
            change: isEnglish ? '+3 this month' : '+3 ce mois'
        },
        {
            icon: Users,
            label: isEnglish ? 'Job Openings' : 'Offres d\'Emploi',
            value: '12',
            change: isEnglish ? '5 new positions' : '5 nouveaux postes'
        },
        {
            icon: Users,
            label: isEnglish ? 'Upcoming Events' : 'Événements à Venir',
            value: '4',
            change: isEnglish ? 'Next week' : 'Semaine prochaine'
        },
        {
            icon: Users,
            label: isEnglish ? 'Talent Pool' : 'Vivier de Talents',
            value: '256',
            change: isEnglish ? '+28 this month' : '+28 ce mois'
        }
    ];

    const upcomingEvents = [
        {
            title: isEnglish ? 'Tech Career Fair' : 'Salon des Carrières Tech',
            type: isEnglish ? 'Recruitment' : 'Recrutement',
            date: '15 Jan, 09:00',
            location: 'Douala',
            participants: 45
        },
        {
            title: isEnglish ? 'Web Dev Workshop' : 'Atelier Développement Web',
            type: isEnglish ? 'Training' : 'Formation',
            date: '18 Jan, 14:00',
            location: 'Yaoundé',
            participants: 30
        }
    ];

    const talentPool = [
        {
            name: 'Marie Kouam',
            domain: isEnglish ? 'Software Development' : 'Développement Logiciel',
            experience: '3 ans',
            rating: 4.8,
            status: isEnglish ? 'Available' : 'Disponible'
        },
        {
            name: 'Paul Ndam',
            domain: isEnglish ? 'UI/UX Design' : 'Design UI/UX',
            experience: '5 ans',
            rating: 4.9,
            status: isEnglish ? 'In Process' : 'En Cours'
        },
        {
            name: 'Sarah Tamba',
            domain: isEnglish ? 'Data Science' : 'Science des Données',
            experience: '4 ans',
            rating: 4.7,
            status: isEnglish ? 'Available' : 'Disponible'
        }
    ];

    return (
        <InstitutionLayout isEnglish={isEnglish}>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <stat.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {stat.label}
                            </h3>
                            <div className="mt-2">
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {stat.change}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts and Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Activity Chart */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            {isEnglish ? 'Institution Activity' : 'Activité de l\'Institution'}
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={institutionData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="recruitments"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        name={isEnglish ? 'Recruitments' : 'Recrutements'}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="mentorships"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        name={isEnglish ? 'Mentorships' : 'Mentorats'}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="events"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        name={isEnglish ? 'Events' : 'Événements'}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            {isEnglish ? 'Upcoming Events' : 'Événements à Venir'}
                        </h2>
                        <div className="space-y-4">
                            {upcomingEvents.map((event, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {event.title}
                                            </h3>
                                            <div className="flex items-center space-x-3 mt-2">
                                                <span className={`text-sm px-2 py-1 rounded ${
                                                    event.type === (isEnglish ? 'Recruitment' : 'Recrutement')
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {event.type}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    <Clock className="w-4 h-4 inline mr-1" />
                                                    {event.date}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    <MapPin className="w-4 h-4 inline mr-1" />
                                                    {event.location}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 text-gray-400 mr-1" />
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                {event.participants}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full mt-4 py-2 text-center text-blue-600 hover:text-blue-700 font-medium">
                                {isEnglish ? 'View All Events' : 'Voir Tous les Événements'}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Talent Pool Section */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {isEnglish ? 'Talent Pool' : 'Vivier de Talents'}
                        </h2>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            {isEnglish ? 'View All' : 'Voir Tout'}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 dark:text-gray-400">
                                    <th className="pb-3 font-medium">{isEnglish ? 'Name' : 'Nom'}</th>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Domain' : 'Domaine'}</th>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Experience' : 'Expérience'}</th>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Rating' : 'Évaluation'}</th>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Status' : 'Statut'}</th>
                                    <th className="pb-3 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {talentPool.map((talent, index) => (
                                    <tr key={index} className="text-gray-700 dark:text-gray-300">
                                        <td className="py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                {talent.name}
                                            </div>
                                        </td>
                                        <td className="py-4">{talent.domain}</td>
                                        <td className="py-4">{talent.experience}</td>
                                        <td className="py-4">
                                            <div className="flex items-center">
                                                <Award className="w-4 h-4 text-yellow-400 mr-1" />
                                                <span>{talent.rating}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                talent.status === (isEnglish ? 'Available' : 'Disponible')
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {talent.status}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <button className="text-blue-600 hover:text-blue-700">
                                                {isEnglish ? 'View Profile' : 'Voir Profil'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </InstitutionLayout>
    );
};

export default InstitutionDashboard;
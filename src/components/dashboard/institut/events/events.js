import React, { useState } from 'react';
import { 
  Calendar, Search, Filter, Plus, MapPin, Clock, Users, ChevronRight, 
  Calendar as CalendarIcon, Video, Star, Share2, BookOpen, ArrowUpRight,
  Tag, CheckCircle, AlertCircle
} from 'lucide-react';
import InstitutionLayout from '../institut_layout';

const EventCard = ({ event, isEnglish }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ongoing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'ended':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src="/api/placeholder/800/400" 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
            {isEnglish ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 
              event.status === 'upcoming' ? 'À venir' :
              event.status === 'ongoing' ? 'En cours' : 'Terminé'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{event.description}</p>
          </div>
          {event.isFeatured && (
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.attendees} {isEnglish ? 'attendees' : 'participants'}</span>
          </div>
          {event.isVirtual && (
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <Video className="w-4 h-4 mr-2" />
              <span className="text-sm">{isEnglish ? 'Virtual Event' : 'Événement virtuel'}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-600"
              />
            ))}
          </div>
          <button className="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <span className="mr-1">{isEnglish ? 'View Details' : 'Voir les détails'}</span>
            <ArrowUpRight className={`w-4 h-4 transition-all duration-300 ${
              isHovered ? 'transform translate-x-1 -translate-y-1' : ''
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
      {trend && (
        <span className={`px-2 py-1 rounded-full text-sm ${
          trend > 0 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  </div>
);

const Events = () => {
  const [isEnglish] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [view, setView] = useState('grid');

  const events = [
    {
      id: 1,
      title: 'Tech Innovation Summit 2025',
      description: 'Join us for a day of innovation, learning, and networking with industry leaders in technology.',
      status: 'upcoming',
      location: 'Douala Convention Center',
      date: 'Mar 15, 2025 - 9:00 AM',
      attendees: 250,
      isVirtual: true,
      isFeatured: true,
      tags: ['Technology', 'Innovation', 'Networking']
    },
    {
      id: 2,
      title: 'Digital Marketing Masterclass',
      description: 'Learn advanced digital marketing strategies from industry experts.',
      status: 'ongoing',
      location: 'Yaoundé Business Hub',
      date: 'Mar 10-12, 2025',
      attendees: 120,
      isVirtual: false,
      isFeatured: false,
      tags: ['Marketing', 'Digital', 'Business']
    },
    {
      id: 3,
      title: 'Startup Pitch Competition',
      description: 'Present your innovative ideas to potential investors and win funding.',
      status: 'upcoming',
      location: 'Virtual Event',
      date: 'Mar 20, 2025 - 2:00 PM',
      attendees: 180,
      isVirtual: true,
      isFeatured: true,
      tags: ['Startup', 'Pitch', 'Investment']
    }
  ];

  const filters = [
    { id: 'all', label: isEnglish ? 'All Events' : 'Tous les événements' },
    { id: 'upcoming', label: isEnglish ? 'Upcoming' : 'À venir' },
    { id: 'ongoing', label: isEnglish ? 'Ongoing' : 'En cours' },
    { id: 'virtual', label: isEnglish ? 'Virtual' : 'Virtuel' },
    { id: 'featured', label: isEnglish ? 'Featured' : 'En vedette' }
  ];

  return (
    <InstitutionLayout isEnglish={isEnglish}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isEnglish ? 'Events Management' : 'Gestion des événements'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEnglish ? 'Create and manage your professional events' : 'Créez et gérez vos événements professionnels'}
            </p>
          </div>
          <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300">
            <Plus className="w-5 h-5 mr-2" />
            {isEnglish ? 'Create Event' : 'Créer un événement'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={CalendarIcon}
            label={isEnglish ? "Total Events" : "Total des événements"}
            value="24"
            trend={12}
          />
          <StatCard 
            icon={Users}
            label={isEnglish ? "Total Attendees" : "Total des participants"}
            value="1,234"
            trend={8}
          />
          <StatCard 
            icon={Video}
            label={isEnglish ? "Virtual Events" : "Événements virtuels"}
            value="8"
            trend={15}
          />
          <StatCard 
            icon={CheckCircle}
            label={isEnglish ? "Completed Events" : "Événements terminés"}
            value="16"
            trend={5}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={isEnglish ? "Search events..." : "Rechercher des événements..."}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} isEnglish={isEnglish} />
          ))}
        </div>
      </div>
    </InstitutionLayout>
  );
};

export default Events;
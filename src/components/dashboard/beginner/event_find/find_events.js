import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Tag, Search, Filter, X } from 'lucide-react';
import BeginnerLayout from '../biginner_layout';
import { getEvents, registerForEvent, getEventStats, searchEvents } from '../../../services/biginner/find_events';
import { format } from 'date-fns';

const FindEvents = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    is_virtual: '',
    is_featured: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Define state for dark mode and language
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents(filters);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getEventStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await searchEvents(searchTerm);
      setEvents(data);
    } catch (error) {
      console.error('Error searching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await registerForEvent(eventId);
      fetchEvents(); // Refresh events list
      // Show success toast
    } catch (error) {
      console.error('Error registering for event:', error);
      // Show error toast
    }
  };

  return (
    <BeginnerLayout
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      isEnglish={isEnglish}
      setIsEnglish={setIsEnglish}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats && Object.entries(stats).map(([key, value]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-300">
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h3>
              <p className="text-3xl font-bold text-blue-600">{value}</p>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isEnglish ? "Search events..." : "Rechercher des événements..."}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              {isEnglish ? "Filters" : "Filtres"}
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="ended">Ended</option>
                  </select>
                  <select
                    value={filters.is_virtual}
                    onChange={(e) => setFilters({ ...filters, is_virtual: e.target.value })}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Types</option>
                    <option value="true">Virtual</option>
                    <option value="false">In-Person</option>
                  </select>
                  <select
                    value={filters.is_featured}
                    onChange={(e) => setFilters({ ...filters, is_featured: e.target.value })}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Events</option>
                    <option value="true">Featured</option>
                    <option value="false">Regular</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                        event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{format(new Date(event.date), 'PPP')}</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event.attendees_count}/{event.max_attendees} attendees</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleRegister(event.id)}
                      disabled={!event.registration_available}
                      className={`mt-6 w-full py-2 px-4 rounded-lg ${
                        event.registration_available
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-300 cursor-not-allowed text-gray-600'
                      } transition-colors`}
                    >
                      {event.registration_available ? 'Register Now' : 'Registration Closed'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </BeginnerLayout>
  );
};

export default FindEvents;
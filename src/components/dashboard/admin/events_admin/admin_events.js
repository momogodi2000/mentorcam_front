import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Filter, Plus, Search, TrendingUp, Users, X, AlertTriangle  } from 'lucide-react';
import AdminLayout from '../admin_layout'; // Adjust this path based on your project structure
import EventService from '../../../services/admin/events_admin_services'; // Adjust this path

const AdminEventsPage = () => {
    const [eventsData, setEventsData] = useState({
      events: [],
      statistics: {
        total_events: 0,
        upcoming_events: 0,
        ongoing_events: 0,
        ended_events: 0,
        avg_attendees: 0,
        recent_events: 0,
        predicted_attendees_next_month: 0,
      },
      analysis: {
        popular_tags: [],
      }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiError, setApiError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
      title: '',
      description: '',
      date: '',
      location: '',
      status: 'upcoming',
      attendees_count: 0,
    });
  
    // Fetch events data on component mount
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          setLoading(true);
          let data;
          
          try {
            // Try to get the full analytics data
            data = await EventService.getAdminEvents();
            setApiError(false);
          } catch (error) {
            console.error('Analytics API failed, trying basic events endpoint:', error);
            setApiError(true);
            
            // If the analytics endpoint fails, fall back to basic events
            const events = await EventService.getEvents();
            
            // Calculate basic statistics manually
            const upcoming = events.filter(e => e.status === 'upcoming').length;
            const ongoing = events.filter(e => e.status === 'ongoing').length;
            const ended = events.filter(e => e.status === 'ended').length;
            
            // Create a data structure similar to what we expect from the analytics endpoint
            data = {
              events: events,
              statistics: {
                total_events: events.length,
                upcoming_events: upcoming,
                ongoing_events: ongoing,
                ended_events: ended,
                avg_attendees: events.reduce((acc, e) => acc + (e.attendees_count || 0), 0) / (events.length || 1),
                recent_events: 0,
                predicted_attendees_next_month: 0,
              },
              analysis: {
                popular_tags: [],
              }
            };
          }
          
          setEventsData(data);
          setError(null);
        } catch (err) {
          setError('Failed to load events data. Please try again later.');
          console.error('Error fetching events:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchEvents();
    }, []);
  
    // Filter events based on search term and status filter
    const filteredEvents = eventsData.events.filter(event => {
      const matchesSearch = (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (event.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewEvent(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    // Handle form submission for new event
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        await EventService.createEvent(newEvent);
        // Refresh events list
        const data = await EventService.getAdminEvents();
        setEventsData(data);
        // Reset form and close modal
        setNewEvent({
          title: '',
          description: '',
          date: '',
          location: '',
          status: 'upcoming',
          attendees_count: 0,
        });
        setShowCreateModal(false);
      } catch (err) {
        setError('Failed to create event. Please try again.');
        console.error('Error creating event:', err);
      } finally {
        setLoading(false);
      }
    };
  
    // Statistics Cards
    const StatCard = ({ title, value, icon: Icon, color }) => (
      <motion.div
        whileHover={{ y: -5 }}
        className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 ${color}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1 dark:text-white">{value}</h3>
          </div>
          <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-600', '-100')} ${color.replace('border-', 'text-')}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </motion.div>
    );
  
    return (
      <AdminLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold dark:text-white">Events Management</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Event
            </motion.button>
          </div>
  
          {/* API Error Message */}
          {apiError && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md flex items-start">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Analytics API Error</p>
                <p>The analytics service is currently unavailable. Basic event management is still available, but some statistics may not be accurate.</p>
              </div>
            </div>
          )}
  
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
              <p>{error}</p>
            </div>
          )}
  
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Events" 
              value={eventsData.statistics.total_events} 
              icon={Calendar} 
              color="border-blue-600" 
            />
            <StatCard 
              title="Upcoming Events" 
              value={eventsData.statistics.upcoming_events} 
              icon={Clock} 
              color="border-green-600" 
            />
            <StatCard 
              title="Average Attendees" 
              value={Math.round(eventsData.statistics.avg_attendees || 0)} 
              icon={Users} 
              color="border-purple-600" 
            />
            {!apiError && (
              <StatCard 
                title="Predicted Attendees" 
                value={Math.round(eventsData.statistics.predicted_attendees_next_month || 0)} 
                icon={TrendingUp} 
                color="border-orange-600" 
              />
            )}
          </div>
  
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>
  
          {/* Events Table */}
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading events data...</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Event Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Attendees
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {filteredEvents.map((event, index) => (
                    <tr key={event.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title || 'Untitled Event'}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{event.description || 'No description'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {event.date ? new Date(event.date).toLocaleDateString() : 'No date'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {event.location || 'No location'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 
                            event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {event.status ? (event.status.charAt(0).toUpperCase() + event.status.slice(1)) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {event.attendees_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">No events found matching your criteria.</p>
              </div>
            )}
          </div>
  
          {/* Popular Tags */}
          {eventsData.analysis.popular_tags && eventsData.analysis.popular_tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {eventsData.analysis.popular_tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
  
        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-80"></div>
              </div>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold dark:text-white">Create New Event</h3>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newEvent.title}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                      name="description"
                      value={newEvent.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={newEvent.date}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Attendees</label>
                      <input
                        type="number"
                        name="attendees_count"
                        value={newEvent.attendees_count}
                        onChange={handleInputChange}
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={newEvent.location}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select
                      name="status"
                      value={newEvent.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="ended">Ended</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Event'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AdminLayout>
    );
  };
  
  export default AdminEventsPage;
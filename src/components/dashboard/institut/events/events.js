import React, { useState, useEffect } from 'react';
import { 
  Calendar, Search, Filter, Plus, MapPin, Clock, Users, ChevronRight, 
  Calendar as CalendarIcon, Video, Star, Share2, BookOpen, ArrowUpRight,
  Tag, CheckCircle, AlertCircle, X
} from 'lucide-react';
import InstitutionLayout from '../institut_layout';
import EventsService from '../../../services/institute/events_services';

const EventCard = ({ event, isEnglish }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [tags, setTags] = useState(event.tags);

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

  const handleRegister = async () => {
    try {
      await EventsService.registerForEvent(event.id);
      setIsRegistered(true);
      // Optionally, you can refresh the event data to update the attendees count
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const handleAddTag = async (tagName) => {
    try {
      const newTag = await EventsService.addTagToEvent(event.id, tagName);
      setTags([...tags, newTag]);
    } catch (error) {
      console.error('Error adding tag:', error);
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
          src={event.image || "/api/placeholder/800/400"} 
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
          {event.is_featured && (
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
            <span className="text-sm">{new Date(event.date).toLocaleString()}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.attendees_count} {isEnglish ? 'attendees' : 'participants'}</span>
          </div>
          {event.is_virtual && (
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <Video className="w-4 h-4 mr-2" />
              <span className="text-sm">{isEnglish ? 'Virtual Event' : 'Événement virtuel'}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {tag.name}
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
          <div className="flex space-x-2">
            <button 
              onClick={handleRegister}
              disabled={isRegistered}
              className={`flex items-center text-blue-600 dark:text-blue-400 hover:underline ${
                isRegistered ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="mr-1">{isRegistered ? (isEnglish ? 'Registered' : 'Inscrit') : (isEnglish ? 'Register' : 'S\'inscrire')}</span>
              <ArrowUpRight className={`w-4 h-4 transition-all duration-300 ${
                isHovered ? 'transform translate-x-1 -translate-y-1' : ''
              }`} />
            </button>
            <button 
              onClick={() => {
                const tagName = prompt(isEnglish ? 'Enter a tag name:' : 'Entrez un nom d\'étiquette:');
                if (tagName) {
                  handleAddTag(tagName);
                }
              }}
              className="flex items-center text-green-600 dark:text-green-400 hover:underline"
            >
              <span className="mr-1">{isEnglish ? 'Add Tag' : 'Ajouter une étiquette'}</span>
              <Tag className="w-4 h-4" />
            </button>
          </div>
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

const CreateEventModal = ({ isOpen, onClose, isEnglish }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'upcoming',
    location: '',
    date: '',
    attendees_count: 0,
    max_attendees: 100,
    is_virtual: false,
    is_featured: false,
    image: null,
    tags: [], // Initialize as an empty array
    registration_deadline: ''
});

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        // Format the date strings properly
        const localDateTime = new Date(formData.date);
        const utcDateTime = localDateTime.toISOString();

        let registrationDeadline = null;
        if (formData.registration_deadline) {
            const localDeadline = new Date(formData.registration_deadline);
            registrationDeadline = localDeadline.toISOString();
        }

        // Prepare the event data
        const eventDataToSubmit = {
            title: formData.title,
            description: formData.description,
            status: formData.status,
            location: formData.location,
            date: utcDateTime,
            registration_deadline: registrationDeadline,
            attendees_count: parseInt(formData.attendees_count) || 0,
            max_attendees: parseInt(formData.max_attendees) || 0,
            is_virtual: Boolean(formData.is_virtual),
            is_featured: Boolean(formData.is_featured),
            image: formData.image,
            tags: formData.tags || []
        };

        // Log the data being sent
        console.log('Submitting event data:', eventDataToSubmit);

        const response = await EventsService.createEvent(eventDataToSubmit);
        console.log('Success response:', response);
        
        onClose();
        window.location.reload();
    } catch (error) {
        console.error('Submission error:', error);
        setError(error.response?.data?.message || error.message || 'Error creating event');
    } finally {
        setLoading(false);
    }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEnglish ? 'Create Event' : 'Créer un événement'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {isEnglish ? 'Title' : 'Titre'}
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {isEnglish ? 'Description' : 'Description'}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {isEnglish ? 'Status' : 'Statut'}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2"
                required
              >
                <option value="upcoming">{isEnglish ? 'Upcoming' : 'À venir'}</option>
                <option value="ongoing">{isEnglish ? 'Ongoing' : 'En cours'}</option>
                <option value="ended">{isEnglish ? 'Ended' : 'Terminé'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {isEnglish ? 'Location' : 'Lieu'}
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {isEnglish ? 'Date' : 'Date'}
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {isEnglish ? 'Attendees Count' : 'Nombre de participants'}
              </label>
              <input
                type="number"
                name="attendees_count"
                value={formData.attendees_count}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {isEnglish ? 'Maximum Attendees' : 'Nombre maximum de participants'}
              </label>
              <input
                type="number"
                name="max_attendees"
                value={formData.max_attendees}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {isEnglish ? 'Registration Deadline' : 'Date limite d\'inscription'}
              </label>
              <input
                type="datetime-local"
                name="registration_deadline"
                value={formData.registration_deadline}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_virtual"
                checked={formData.is_virtual}
                onChange={handleChange}
                className="rounded border-gray-200 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {isEnglish ? 'Virtual Event' : 'Événement virtuel'}
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="rounded border-gray-200 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {isEnglish ? 'Featured Event' : 'Événement en vedette'}
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {isEnglish ? 'Event Image' : 'Image de l\'événement'}
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2"
              />
              {previewImage && (
                <div className="mt-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
                <div>
                  {/*
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {isEnglish ? 'Tags' : 'Étiquettes'}
    </label>
    <input
        type="text"
        value={formData.tags.join(', ')}
        onChange={(e) => {
            const tagsText = e.target.value;
            const tagsArray = tagsText
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '');
            setFormData(prev => ({
                ...prev,
                tags: tagsArray
            }));
        }}
        className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2"
        placeholder={isEnglish ? "Enter tags separated by commas" : "Entrez les étiquettes séparées par des virgules"}
    />
*/}
              </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              disabled={loading}
            >
              {isEnglish ? 'Cancel' : 'Annuler'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (isEnglish ? 'Creating...' : 'Création...') : (isEnglish ? 'Create Event' : 'Créer un événement')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Events = () => {
  const [isEnglish] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [view, setView] = useState('grid');
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    total_events: 0,
    total_attendees: 0,
    virtual_events: 0,
    completed_events: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedFilter, searchQuery]);

  const fetchStats = async () => {
    try {
      const response = await EventsService.getEventStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let response;
      const filters = {};

      if (searchQuery) {
        filters.search = searchQuery;
      }

      switch (selectedFilter) {
        case 'upcoming':
          response = await EventsService.getUpcomingEvents();
          break;
        case 'ongoing':
          response = await EventsService.getOngoingEvents();
          break;
        case 'virtual':
          response = await EventsService.getVirtualEvents();
          break;
        case 'featured':
          response = await EventsService.getFeaturedEvents();
          break;
        default:
          response = await EventsService.getAllEvents(filters);
      }
      setEvents(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            {isEnglish ? 'Create Event' : 'Créer un événement'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={CalendarIcon}
            label={isEnglish ? "Total Events" : "Total des événements"}
            value={stats.total_events}
            trend={12}
          />
          <StatCard 
            icon={Users}
            label={isEnglish ? "Total Attendees" : "Total des participants"}
            value={stats.total_attendees}
            trend={8}
          />
          <StatCard 
            icon={Video}
            label={isEnglish ? "Virtual Events" : "Événements virtuels"}
            value={stats.virtual_events}
            trend={15}
          />
          <StatCard 
            icon={CheckCircle}
            label={isEnglish ? "Completed Events" : "Événements terminés"}
            value={stats.completed_events}
            trend={5}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
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
          {loading ? (
            <div className="col-span-full text-center py-8">Loading...</div>
          ) : events.length === 0 ? (
            <div className="col-span-full text-center py-8">No events found</div>
          ) : (
            events.map((event) => (
              <EventCard key={event.id} event={event} isEnglish={isEnglish} />
            ))
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        isEnglish={isEnglish}
      />
    </InstitutionLayout>
  );
};

export default Events;
import React, { useState, useEffect } from 'react';
import InstitutionLayout from '../institut_layout';
import { eventRegistrationService } from '../../../services/institute/recruitment_services';
import { 
  Search, Filter, Plus, MoreVertical, Briefcase, Users, 
  Building, Clock, Calendar, MapPin, ChevronDown, RefreshCw,
  CheckCircle2, XCircle, AlertCircle, DollarSign, Mail
} from 'lucide-react';

// EventCard Component
const EventCard = ({ event }) => {
  const statusColors = {
    upcoming: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    ongoing: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    ended: 'text-gray-600 bg-gray-50 dark:bg-gray-700/20 border-gray-200 dark:border-gray-700'
  };

  const getProgressBarWidth = () => {
    const percentage = (event.attendees_count / event.max_attendees) * 100;
    return `${Math.min(percentage, 100)}%`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{event.title}</h3>
          <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
            {event.location}
          </div>
        </div>
        <span className={`px-3 py-1 text-sm rounded-full font-medium border ${statusColors[event.status]}`}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`px-3 py-1 text-xs font-medium rounded-full 
          ${event.is_virtual 
            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
            : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800'}`}>
          {event.is_virtual ? 'Virtual' : 'In-Person'}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Users className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
            <span className="text-sm">{event.attendees_count} / {event.max_attendees} attendees</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              event.status === 'upcoming' ? 'bg-blue-500' : 
              event.status === 'ongoing' ? 'bg-emerald-500' : 'bg-gray-500'
            }`}
            style={{ width: getProgressBarWidth() }}
          ></div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
            <span>{formatDate(event.date)}</span>
          </div>
          {event.registration_deadline && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
              <span>Deadline: {formatDate(event.registration_deadline)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Recruitment = () => {
  const [isEnglish, setIsEnglish] = useState(false);
  const [selectedTab, setSelectedTab] = useState('active');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await eventRegistrationService.getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventAttendees = async (eventId) => {
    try {
      setIsLoading(true);
      const attendeesData = await eventRegistrationService.getEventAttendees(eventId);
      setAttendees(attendeesData);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventSelect = async (event) => {
    setSelectedEvent(event);
    await fetchEventAttendees(event.id);
  };

  const handleSendConfirmation = async () => {
    try {
      await eventRegistrationService.sendEventConfirmation(
        selectedEvent.id,
        selectedAttendee.user.id,
        confirmationMessage
      );
      setShowConfirmationModal(false);
      setConfirmationMessage('');
      // Refresh attendees list
      await fetchEventAttendees(selectedEvent.id);
    } catch (error) {
      console.error('Error sending confirmation:', error);
    }
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'attended':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    }
  };

  const filteredAttendees = attendees.filter(attendee => 
    attendee.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const AttendeesList = () => (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fadeIn">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-semibold dark:text-white">
            {isEnglish ? 'Registered Attendees' : 'Participants Inscrits'}
          </h3>
          <div className="mt-3 sm:mt-0 w-full sm:w-auto max-w-sm relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isEnglish ? "Search attendees..." : "Rechercher des participants..."}
              className="w-full pl-9 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all duration-200"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee) => (
                  <tr 
                    key={attendee.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{attendee.user?.full_name || attendee.user_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{attendee.user?.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{attendee.user?.phone_number || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{attendee.user?.location || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{attendee.user?.user_type || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAttendanceStatusColor(attendee.attendance_status)}`}>
                        {attendee.attendance_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedAttendee(attendee);
                          setShowConfirmationModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        aria-label="Send email"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm 
                      ? 'No attendees match your search'
                      : 'No attendees registered for this event yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          {isEnglish ? 'Send Confirmation' : 'Envoyer Confirmation'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {isEnglish 
            ? `Sending email to: ${selectedAttendee?.user?.email || selectedAttendee?.user_name}`
            : `Envoi d'un email à: ${selectedAttendee?.user?.email || selectedAttendee?.user_name}`
          }
        </p>
        <textarea
          value={confirmationMessage}
          onChange={(e) => setConfirmationMessage(e.target.value)}
          className="w-full p-3 border rounded-lg mb-5 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all duration-200 resize-none"
          rows="4"
          placeholder={isEnglish ? "Enter confirmation message..." : "Entrez le message de confirmation..."}
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowConfirmationModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            {isEnglish ? 'Cancel' : 'Annuler'}
          </button>
          <button
            onClick={handleSendConfirmation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!confirmationMessage.trim()}
          >
            {isEnglish ? 'Send' : 'Envoyer'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <InstitutionLayout isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              {isEnglish ? 'Event Registration Management' : 'Gestion des Inscriptions aux Événements'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isEnglish 
                ? 'Manage event registrations and attendees'
                : 'Gérez les inscriptions et les participants aux événements'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button 
              onClick={() => fetchEvents()}
              className="px-4 py-2 flex items-center text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {isEnglish ? 'Refresh' : 'Actualiser'}
            </button>
          </div>
        </div>

        {/* Count Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{isEnglish ? 'Total Events' : 'Total des Événements'}</h3>
            <p className="mt-2 text-3xl font-semibold dark:text-white">{events.length}</p>
            <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                <span>{isEnglish ? 'Across all platforms' : 'Sur toutes les plateformes'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{isEnglish ? 'Active Events' : 'Événements Actifs'}</h3>
            <p className="mt-2 text-3xl font-semibold dark:text-white">
              {events.filter(e => e.status === 'upcoming' || e.status === 'ongoing').length}
            </p>
            <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />
                <span>{isEnglish ? 'Currently active or upcoming' : 'Actuellement actifs ou à venir'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{isEnglish ? 'Total Attendees' : 'Participants Totaux'}</h3>
            <p className="mt-2 text-3xl font-semibold dark:text-white">
              {events.reduce((sum, event) => sum + event.attendees_count, 0)}
            </p>
            <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1 text-blue-500" />
                <span>{isEnglish ? 'Registered across all events' : 'Inscrits à tous les événements'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section Header */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold dark:text-white">
            {isEnglish ? 'All Events' : 'Tous les Événements'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isEnglish 
              ? 'Click on an event to view registered attendees'
              : 'Cliquez sur un événement pour voir les participants inscrits'}
          </p>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.length > 0 ? (
            events.map(event => (
              <div
                key={event.id}
                onClick={() => handleEventSelect(event)}
                className={`transition-all duration-300 ${
                  selectedEvent?.id === event.id 
                  ? 'ring-2 ring-blue-500 dark:ring-blue-400 scale-[1.02] transform' 
                  : 'hover:scale-[1.01] transform'
                }`}
              >
                <EventCard event={event} />
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center bg-white dark:bg-gray-800 p-12 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {isEnglish ? 'No events found' : 'Aucun événement trouvé'}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {isEnglish 
                    ? 'Try refreshing or check back later'
                    : 'Essayez d\'actualiser ou revenez plus tard'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Attendees List */}
        {selectedEvent && <AttendeesList />}

        {/* Confirmation Modal */}
        {showConfirmationModal && <ConfirmationModal />}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="animate-spin bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
              <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        )}
      </div>
    </InstitutionLayout>
  );
};

export default Recruitment;
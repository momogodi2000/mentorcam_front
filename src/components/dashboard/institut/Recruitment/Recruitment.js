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
    upcoming: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    ongoing: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    ended: 'text-red-500 bg-red-50 dark:bg-red-900/20'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold dark:text-white">{event.title}</h3>
          <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
        </div>
        <span className={`px-3 py-1 text-sm rounded-full ${statusColors[event.status]}`}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
          {event.is_virtual ? 'Virtual' : 'In-Person'}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Users className="w-4 h-4 mr-1" />
          <span className="text-sm">{event.attendees_count} / {event.max_attendees} attendees</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            Date: {new Date(event.date).toLocaleDateString()}
          </div>
          {event.registration_deadline && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              Deadline: {new Date(event.registration_deadline).toLocaleDateString()}
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

  const AttendeesList = () => (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {isEnglish ? 'Registered Attendees' : 'Participants Inscrits'}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee) => (
                <tr key={attendee.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-3">{attendee.user_name}</td>
                  <td className="px-4 py-3">{attendee.user.email}</td>
                  <td className="px-4 py-3">{attendee.user.phone_number}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      attendee.attendance_status === 'attended' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {attendee.attendance_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedAttendee(attendee);
                        setShowConfirmationModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">
          {isEnglish ? 'Send Confirmation' : 'Envoyer Confirmation'}
        </h3>
        <textarea
          value={confirmationMessage}
          onChange={(e) => setConfirmationMessage(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4 dark:bg-gray-700"
          rows="4"
          placeholder={isEnglish ? "Enter confirmation message..." : "Entrez le message de confirmation..."}
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowConfirmationModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            {isEnglish ? 'Cancel' : 'Annuler'}
          </button>
          <button
            onClick={handleSendConfirmation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map(event => (
            <div
              key={event.id}
              onClick={() => handleEventSelect(event)}
              className={`cursor-pointer ${
                selectedEvent?.id === event.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {/* Attendees List */}
        {selectedEvent && <AttendeesList />}

        {/* Confirmation Modal */}
        {showConfirmationModal && <ConfirmationModal />}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>
    </InstitutionLayout>
  );
};

export default Recruitment;
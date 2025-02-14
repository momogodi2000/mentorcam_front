import React from 'react';
import {
  Users,
  ChevronRight,
  Info,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Star,
  Eye,
  Download,
  Plus,
  FileText,
  MessageCircle,
  UserCheck,
  PieChart,
  User,
  Edit,
  Share2,
  Play,
} from 'lucide-react';

const ClassContent = ({ activeTab, classData, attendees, isDarkMode, isEnglish }) => {
  if (!classData) return null;

  switch (activeTab) {
    case 'overview':
      return (
        <div className="animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {isEnglish ? 'About This Class' : 'À Propos de ce Cours'}
                </h3>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {classData.description}
                </p>
                
                <h4 className={`text-lg font-medium mt-6 mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {isEnglish ? 'What You\'ll Learn' : 'Ce que Vous Apprendrez'}
                </h4>
                <ul className="space-y-2">
                  {classData.topics.map((topic, i) => (
                    <li key={i} className="flex items-start">
                      <ChevronRight className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{topic}</span>
                    </li>
                  ))}
                </ul>
                
                <h4 className={`text-lg font-medium mt-6 mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {isEnglish ? 'Requirements' : 'Prérequis'}
                </h4>
                <ul className="space-y-2">
                  {classData.requirements.map((req, i) => (
                    <li key={i} className="flex items-start">
                      <Info className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <div className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {isEnglish ? 'Class Details' : 'Détails du Cours'}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {isEnglish ? 'Date & Time' : 'Date et Heure'}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(classData.date).toLocaleDateString(
                          isEnglish ? 'en-US' : 'fr-FR',
                          {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {isEnglish ? 'Duration' : 'Durée'}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {classData.duration} {isEnglish ? 'minutes' : 'minutes'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {isEnglish ? 'Domain' : 'Domaine'}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {classData.domain}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Award className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {isEnglish ? 'Level' : 'Niveau'}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {classData.level}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {isEnglish ? 'Participants' : 'Participants'}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {classData.attendees} / {classData.maxAttendees} {isEnglish ? 'enrolled' : 'inscrits'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Star className={`w-5 h-5 text-yellow-500`} />
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {isEnglish ? 'Rating' : 'Évaluation'}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {classData.rating} / 5.0
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Eye className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {isEnglish ? 'Views' : 'Vues'}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {classData.viewCount}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <button className="w-full flex items-center justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
                    <Edit className="w-4 h-4 mr-2" />
                    {isEnglish ? 'Edit Class' : 'Modifier le Cours'}
                  </button>
                  
                  <button className="w-full flex items-center justify-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200">
                    <Play className="w-4 h-4 mr-2" />
                    {isEnglish ? 'Start Class' : 'Démarrer le Cours'}
                  </button>
                  
                  <button className="w-full flex items-center justify-center py-2 px-4 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 dark:text-blue-400 dark:border-blue-400 rounded-md transition-colors duration-200">
                    <Share2 className="w-4 h-4 mr-2" />
                    {isEnglish ? 'Share Class' : 'Partager le Cours'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`mt-6 rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              {isEnglish ? 'Class Materials' : 'Matériel de Cours'}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`py-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {isEnglish ? 'Name' : 'Nom'}
                    </th>
                    <th className={`py-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {isEnglish ? 'Type' : 'Type'}
                    </th>
                    <th className={`py-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {isEnglish ? 'Size' : 'Taille'}
                    </th>
                    <th className={`py-3 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {isEnglish ? 'Action' : 'Action'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classData.materials.map((material) => (
                    <tr 
                      key={material.id}
                      className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <td className={`py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-gray-400" />
                          {material.name}
                        </div>
                      </td>
                      <td className={`py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {material.type.toUpperCase()}
                      </td>
                      <td className={`py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {material.size}
                      </td>
                      <td className="py-3 text-right">
                        <button className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          <Download className="w-4 h-4 mr-1" />
                          {isEnglish ? 'Download' : 'Télécharger'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button 
              className="mt-4 flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              {isEnglish ? 'Add New Material' : 'Ajouter un Nouveau Matériel'}
            </button>
          </div>
        </div>
      );
    
    case 'attendees':
      return (
        <div className="animate-fadeIn">
          <div className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {isEnglish ? 'Attendees' : 'Participants'}
              </h3>
              <div className="flex space-x-2">
                <div className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  {classData.attendees} / {classData.maxAttendees}
                </div>
                <button className="flex items-center text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                  <Plus className="w-4 h-4 mr-1" />
                  {isEnglish ? 'Invite' : 'Inviter'}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attendees.map((attendee) => (
                <div 
                  key={attendee.id}
                  className={`p-4 rounded-lg border ${
                    isDarkMode 
                      ? 'border-gray-700 hover:bg-gray-750' 
                      : 'border-gray-200 hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    <img 
                      src={attendee.avatar} 
                      alt={attendee.name} 
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {attendee.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {attendee.role}
                      </p>
                    </div>
                    
                    <div className="ml-auto">
                      {attendee.status === 'confirmed' && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                        }`}>
                          {isEnglish ? 'Confirmed' : 'Confirmé'}
                        </span>
                      )}
                      {attendee.status === 'pending' && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {isEnglish ? 'Pending' : 'En attente'}
                        </span>
                      )}
                      {attendee.status === 'attended' && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {isEnglish ? 'Attended' : 'Participé'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex mt-3 space-x-2">
                    <button className="text-xs flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {isEnglish ? 'Message' : 'Message'}
                    </button>
                    <button className="text-xs flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      <UserCheck className="w-3 h-3 mr-1" />
                      {isEnglish ? 'Profile' : 'Profil'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    
    case 'analytics':
      return (
        <div className="animate-fadeIn">
          <div className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              {isEnglish ? 'Class Analytics' : 'Analyse du Cours'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {isEnglish ? 'Total Enrollment' :
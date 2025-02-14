import React from 'react';
import { Calendar, Users, Trash2 } from 'lucide-react';

const ClassHeader = ({ classData, currentUser, formatDate, isDarkMode, isEnglish }) => {
  if (!classData) return null;

  return (
    <>
      {/* Class Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {classData.title}
          </h2>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {isEnglish ? 'Status:' : 'Statut:'} <span className="font-medium text-blue-600">{classData.status}</span>
          </p>
        </div>
        
        {currentUser?.role === 'professional' && (
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button className="flex items-center py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200">
              <Trash2 className="w-4 h-4 mr-2" />
              {isEnglish ? 'Delete Class' : 'Supprimer le Cours'}
            </button>
          </div>
        )}
      </div>
      
      {/* Class Image */}
      <div className="relative rounded-xl overflow-hidden h-80 mb-6">
        <img 
          src={classData.thumbnail} 
          alt={classData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 w-full">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full bg-blue-500/80 text-white`}>
                {classData.domain}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full bg-purple-500/80 text-white`}>
                {classData.level}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-white mr-2" />
                <span className="text-sm text-white">
                  {formatDate(classData.date)}
                </span>
              </div>
              
              <div className="flex items-center">
                <Users className="w-5 h-5 text-white mr-2" />
                <span className="text-sm text-white">
                  {classData.attendees} / {classData.maxAttendees}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassHeader;
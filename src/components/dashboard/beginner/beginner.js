import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import BeginnerLayout from './biginner_layout'; // Import the BeginnerLayout component

const BeginnerDashboard = () => {
  // Data for the dashboard
  const learningProgress = [
    { month: 'Jan', hours: 8, skills: 2 },
    { month: 'Feb', hours: 12, skills: 4 },
    { month: 'Mar', hours: 15, skills: 6 },
    { month: 'Apr', hours: 20, skills: 8 },
  ];

  const stats = [
    {
      icon: 'Clock',
      label: 'Learning Hours',
      value: '55h',
      change: '+5h this week',
    },
    {
      icon: 'Award',
      label: 'Skills Acquired',
      value: '8',
      change: '+2 this month',
    },
    {
      icon: 'Users',
      label: 'Active Mentors',
      value: '3',
      change: 'Out of 5 sessions',
    },
    {
      icon: 'Star',
      label: 'Achievements',
      value: '12',
      change: 'Badges earned',
    },
  ];

  const upcomingSessions = [
    {
      mentor: 'Dr. Kamga Paul',
      topic: 'Advanced Web Development',
      date: '15 Jan, 14:00',
      status: 'Confirmed',
    },
    {
      mentor: 'Mme. Nguemo Sarah',
      topic: 'Digital Marketing',
      date: '18 Jan, 10:00',
      status: 'Pending',
    },
  ];

  const recommendedMentors = [
    {
      name: 'M. Fotso Jean',
      expertise: 'Mobile Development',
      rating: 4.8,
      location: 'Douala',
    },
    {
      name: 'Mme. Tchamba Marie',
      expertise: 'UI/UX Design',
      rating: 4.9,
      location: 'Yaoundé',
    },
    {
      name: 'M. Nkeng Peter',
      expertise: 'Data Science',
      rating: 4.7,
      location: 'Buea',
    },
  ];

  return (
    <BeginnerLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">{stat.icon}</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
              <div className="mt-2">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress and Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Learning Progress</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={learningProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Hours Spent"
                  />
                  <Line
                    type="monotone"
                    dataKey="skills"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Skills Gained"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{session.topic}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        session.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {session.mentor} • {session.date}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Mentors */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recommended Mentors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedMentors.map((mentor, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">{mentor.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{mentor.name}</h3>
                    <p className="text-sm text-gray-500">{mentor.expertise}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">{mentor.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">{mentor.location}</span>
                  </div>
                </div>
                <button className="mt-3 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </BeginnerLayout>
  );
};

export default BeginnerDashboard;
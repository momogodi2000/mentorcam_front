// QuickExamStats.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
import { BarChart, PieChart, Activity } from 'lucide-react';
import onlineCourseServices from '../../../services/professionnal/online_classe_services';

const QuickExamStats = ({ isEnglish }) => {
  const [stats, setStats] = useState({
    totalExams: 0,
    examsByType: {},
    averageScore: 0
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEnglish ? 'Quick Exam Statistics' : 'Statistiques des Examens Rapides'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isEnglish ? 'Total Exams' : 'Total des Examens'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalExams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isEnglish ? 'Average Score' : 'Score Moyen'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.averageScore}%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


export { QuickExamStats };
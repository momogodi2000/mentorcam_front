import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { FileText, Trash2, Edit } from 'lucide-react';
import onlineCourseServices from '../../../services/professionnal/online_classe_services';

const QuickExamList = ({ isEnglish }) => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const data = await onlineCourseServices.getQuickExams();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEnglish ? 'Quick Exam List' : 'Liste des Examens Rapides'}
      </h1>
      
      <div className="grid gap-4">
        {exams.map((exam) => (
          <Card key={exam.id}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{exam.title}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                {isEnglish ? 'Type: ' : 'Type : '}{exam.exam_type}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export { QuickExamList };
import React, { useState } from 'react';
import { ArrowLeft, Mail, Calendar, Check, X, Download, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog_2';
import { Alert, AlertDescription } from '../../../ui/alert';
import InstitutionLayout from '../institut_layout';

const JobApplicant = () => {
  const [isEnglish] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailType, setEmailType] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');

  // Sample applicant data - replace with your actual data fetching logic
  const applicants = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      appliedDate: '2024-02-10',
      experience: '5 years',
      status: 'pending',
      resumeUrl: '#',
      coverLetter: 'I am excited to apply for this position...',
      skills: ['React', 'Node.js', 'Python'],
      education: 'Masters in Computer Science',
      phone: '+237 6XX XXX XXX'
    },
    // Add more sample applicants as needed
  ];

  const generateEmail = (type, applicant) => {
    if (type === 'accept') {
      return {
        subject: 'Interview Invitation',
        body: `Dear ${applicant.name},\n\nWe are pleased to invite you for an interview on ${interviewDate}.\n\nBest regards,\nHR Team`
      };
    } else {
      return {
        subject: 'Application Status Update',
        body: `Dear ${applicant.name},\n\nThank you for your interest in our company. While your qualifications are impressive, we have decided to move forward with other candidates whose qualifications more closely match our needs.\n\nWe wish you success in your job search.\n\nBest regards,\nHR Team`
      };
    }
  };

  const handleEmailSend = (type) => {
    const emailContent = generateEmail(type, selectedApplicant);
    // Implement your email sending logic here
    console.log('Sending email:', emailContent);
    setIsEmailModalOpen(false);
    setSelectedApplicant(null);
  };

  return (
    <InstitutionLayout isEnglish={isEnglish}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isEnglish ? 'Back to Job Offers' : 'Retour aux offres'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEnglish ? 'Job Applicants' : 'Candidats'}
          </h1>
        </div>

        {/* Applicants List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          {applicants.map((applicant) => (
            <div
              key={applicant.id}
              className="border-b border-gray-200 dark:border-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {applicant.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {applicant.email} • {applicant.phone}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {isEnglish ? 'Applied on: ' : 'Postulé le: '} {applicant.appliedDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedApplicant(applicant);
                      setEmailType('accept');
                      setIsEmailModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedApplicant(applicant);
                      setEmailType('reject');
                      setIsEmailModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedApplicant(applicant)}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Applicant Details Modal */}
        <Dialog open={selectedApplicant !== null && !isEmailModalOpen} onOpenChange={() => setSelectedApplicant(null)}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedApplicant && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedApplicant.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-1">{isEnglish ? 'Education' : 'Formation'}</h3>
                      <p className="text-sm text-gray-600">{selectedApplicant.education}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{isEnglish ? 'Experience' : 'Expérience'}</h3>
                      <p className="text-sm text-gray-600">{selectedApplicant.experience}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">{isEnglish ? 'Skills' : 'Compétences'}</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">{isEnglish ? 'Cover Letter' : 'Lettre de motivation'}</h3>
                    <p className="text-sm text-gray-600">{selectedApplicant.coverLetter}</p>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => window.open(selectedApplicant.resumeUrl)}
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isEnglish ? 'Download Resume' : 'Télécharger CV'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Email Modal */}
        <Dialog open={isEmailModalOpen} onOpenChange={() => setIsEmailModalOpen(false)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {emailType === 'accept' 
                  ? (isEnglish ? 'Schedule Interview' : 'Planifier un entretien')
                  : (isEnglish ? 'Send Rejection' : 'Envoyer le refus')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {emailType === 'accept' && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {isEnglish ? 'Interview Date' : 'Date d\'entretien'}
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  {isEnglish ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  onClick={() => handleEmailSend(emailType)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isEnglish ? 'Send Email' : 'Envoyer l\'email'}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </InstitutionLayout>
  );
};

export default JobApplicant;
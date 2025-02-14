import React, { useState, useEffect } from 'react';
import InstitutionLayout from '../institut_layout';
import { JobApplicantsService } from '../../../services/institute/applicant_job';
import { Mail, Eye, Check, X, Send } from 'lucide-react';
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../ui/dialog_2";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";

const Candidats = ({ isEnglish, setIsEnglish }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [emailDialog, setEmailDialog] = useState(false);
    const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
    const [detailsDialog, setDetailsDialog] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await JobApplicantsService.getAllApplications();
            // Filter out any applications with missing required data
            const validApplications = data.filter(app => 
                app?.applicant?.full_name && 
                app?.applicant?.email && 
                app?.job?.title
            );
            setApplications(validApplications);
        } catch (error) {
            console.error('Error:', error);
            setError(isEnglish 
                ? 'Failed to load applications. Please try again.' 
                : 'Échec du chargement des candidatures. Veuillez réessayer.'
            );
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (fullName) => {
        if (!fullName) return '?';
        const names = fullName.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return fullName[0].toUpperCase();
    };

    const handleSendEmail = async () => {
        try {
            await JobApplicantsService.sendEmailToApplicant(
                selectedApplicant.applicant.email,
                emailForm.subject,
                emailForm.message
            );
            setEmailDialog(false);
            setEmailForm({ subject: '', message: '' });
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await JobApplicantsService.updateApplicationStatus(id, status);
            fetchApplications();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return (
            <InstitutionLayout isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </InstitutionLayout>
        );
    }

    if (error) {
        return (
            <InstitutionLayout isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchApplications}>
                        {isEnglish ? 'Try Again' : 'Réessayer'}
                    </Button>
                </div>
            </InstitutionLayout>
        );
    }

    return (
        <InstitutionLayout isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                    {isEnglish ? 'Job Applicants' : 'Candidats'}
                </h1>

                {applications.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                        <p className="text-gray-600 dark:text-gray-300">
                            {isEnglish 
                                ? 'No applications found.' 
                                : 'Aucune candidature trouvée.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {isEnglish ? 'Applicant' : 'Candidat'}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {isEnglish ? 'Job Position' : 'Poste'}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {isEnglish ? 'Status' : 'Statut'}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {isEnglish ? 'Applied Date' : 'Date de Candidature'}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {isEnglish ? 'Actions' : 'Actions'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                    {applications.map((application) => (
                                        <tr 
                                            key={application.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                                            <span className="text-white font-bold">
                                                                {getInitials(application.applicant.full_name)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {application.applicant.full_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-300">
                                                            {application.applicant.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-white">{application.job.title}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-300">{application.job.company}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    application.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : application.status === 'accepted'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {application.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                {new Date(application.applied_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedApplicant(application);
                                                            setDetailsDialog(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedApplicant(application);
                                                            setEmailDialog(true);
                                                        }}
                                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                    >
                                                        <Mail className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(application.id, 'accepted')}
                                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Email Dialog */}
                <Dialog open={emailDialog} onOpenChange={setEmailDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {isEnglish ? 'Send Email to Applicant' : 'Envoyer un Email au Candidat'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {isEnglish ? 'Subject' : 'Sujet'}
                                </label>
                                <Input
                                    value={emailForm.subject}
                                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {isEnglish ? 'Message' : 'Message'}
                                </label>
                                <Textarea
                                    value={emailForm.message}
                                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                                    className="mt-1"
                                    rows={5}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEmailDialog(false)}>
                                {isEnglish ? 'Cancel' : 'Annuler'}
                            </Button>
                            <Button onClick={handleSendEmail}>
                                <Send className="w-4 h-4 mr-2" />
                                {isEnglish ? 'Send Email' : 'Envoyer'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Details Dialog */}
                <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {isEnglish ? 'Application Details' : 'Détails de la Candidature'}
                            </DialogTitle>
                        </DialogHeader>
                        {selectedApplicant && (
                            <div className="space-y-4">
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                        {isEnglish ? 'Applicant Information' : 'Information du Candidat'}
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            <span className="font-medium">{isEnglish ? 'Name: ' : 'Nom: '}</span>
                                            {selectedApplicant.applicant.full_name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            <span className="font-medium">{isEnglish ? 'Email: ' : 'Email: '}</span>
                                            {selectedApplicant.applicant.email}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            <span className="font-medium">{isEnglish ? 'Location: ' : 'Localisation: '}</span>
                                            {selectedApplicant.applicant.location || 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                        {isEnglish ? 'Cover Letter' : 'Lettre de Motivation'}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {selectedApplicant.cover_letter || 'No cover letter provided'}
                                    </p>
                                </div>
                                {selectedApplicant.resume && (
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                            {isEnglish ? 'Resume' : 'CV'}
                                        </h3>
                                        <a 
                                            href={selectedApplicant.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            {isEnglish ? 'View Resume' : 'Voir le CV'}
                                        </a>
                                    </div>
                                )}
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                        {isEnglish ? 'Application Status' : 'Statut de la Candidature'}
                                    </h3>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant={selectedApplicant.status === 'accepted' ? 'default' : 'outline'}
                                            onClick={() => handleStatusUpdate(selectedApplicant.id, 'accepted')}
                                            className="flex-1"
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            {isEnglish ? 'Accept' : 'Accepter'}
                                        </Button>
                                        <Button
                                            variant={selectedApplicant.status === 'rejected' ? 'destructive' : 'outline'}
                                            onClick={() => handleStatusUpdate(selectedApplicant.id, 'rejected')}
                                            className="flex-1"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            {isEnglish ? 'Reject' : 'Rejeter'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDetailsDialog(false)}>
                                {isEnglish ? 'Close' : 'Fermer'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setDetailsDialog(false);
                                    setSelectedApplicant(selectedApplicant);
                                    setEmailDialog(true);
                                }}
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                {isEnglish ? 'Send Email' : 'Envoyer un Email'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </InstitutionLayout>
    );
};

export default Candidats;
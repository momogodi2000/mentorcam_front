import React, { useState, useEffect, useCallback } from 'react';
import InstitutionLayout from '../institut_layout';
import { JobApplicantsService } from '../../../services/institute/applicant_job';
import { Mail, Eye, Check, X, Send, Search, Filter, Download, Calendar, Briefcase, Map, Phone, RefreshCw, ChevronDown, User, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tab";
import { Badge } from "../../../ui/badge";
import { Avatar, AvatarFallback } from "../../../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { motion } from 'framer-motion';

const statusColors = {
  pending: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: <AlertCircle className="w-3 h-3 mr-1" />
  },
  accepted: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    icon: <Check className="w-3 h-3 mr-1" />
  },
  rejected: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
    icon: <X className="w-3 h-3 mr-1" />
  }
};

const ApplicantCard = ({ application, onViewDetails, onSendEmail, onStatusUpdate, isEnglish }) => {
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0].toUpperCase();
  };

  const status = application.status || 'pending';
  const statusStyle = statusColors[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600">
                <AvatarFallback>{getInitials(application.applicant.full_name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  {application.applicant.full_name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                  {application.applicant.email}
                </CardDescription>
              </div>
            </div>
            <Badge 
              className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border flex items-center`} 
              variant="outline"
            >
              {statusStyle.icon}
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Briefcase className="w-4 h-4 mr-2 opacity-70" />
              {application.job.title}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2 opacity-70" />
              {new Date(application.applied_date).toLocaleDateString()}
            </div>
            {application.applicant.location && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Map className="w-4 h-4 mr-2 opacity-70" />
                {application.applicant.location}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => onViewDetails(application)}
            className="flex items-center"
          >
            <Eye className="w-4 h-4 mr-1" />
            {isEnglish ? 'Details' : 'Détails'}
          </Button>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onSendEmail(application)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <Mail className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onStatusUpdate(application.id, 'accepted')}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onStatusUpdate(application.id, 'rejected')}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="relative">
      <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
      <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-r-4 border-transparent border-r-blue-300 animate-spin" style={{ animationDirection: 'reverse' }}></div>
    </div>
  </div>
);

const Candidats = ({ isEnglish, setIsEnglish }) => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [emailDialog, setEmailDialog] = useState(false);
    const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
    const [detailsDialog, setDetailsDialog] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchApplications = useCallback(async () => {
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
            setFilteredApplications(validApplications);
        } catch (error) {
            console.error('Error:', error);
            setError(isEnglish 
                ? 'Failed to load applications. Please try again.' 
                : 'Échec du chargement des candidatures. Veuillez réessayer.'
            );
        } finally {
            setLoading(false);
        }
    }, [isEnglish]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    useEffect(() => {
        let result = [...applications];
        
        // Apply search filter
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(app => 
                app.applicant.full_name.toLowerCase().includes(lowerSearchTerm) ||
                app.applicant.email.toLowerCase().includes(lowerSearchTerm) ||
                app.job.title.toLowerCase().includes(lowerSearchTerm)
            );
        }
        
        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(app => app.status === statusFilter);
        }
        
        setFilteredApplications(result);
    }, [searchTerm, statusFilter, applications]);

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
            if (detailsDialog && selectedApplicant && selectedApplicant.id === id) {
                setSelectedApplicant({...selectedApplicant, status});
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchApplications();
        setTimeout(() => setIsRefreshing(false), 600); // Ensures animation is visible
    };

    const handleViewDetails = (application) => {
        setSelectedApplicant(application);
        setDetailsDialog(true);
    };

    const handleSendEmailClick = (application) => {
        setSelectedApplicant(application);
        setEmailDialog(true);
    };

    if (loading) {
        return (
            <InstitutionLayout isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
                <LoadingSpinner />
            </InstitutionLayout>
        );
    }

    if (error) {
        return (
            <InstitutionLayout isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-lg mb-4 text-center">
                        <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                        <p>{error}</p>
                    </div>
                    <Button onClick={fetchApplications} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {isEnglish ? 'Try Again' : 'Réessayer'}
                    </Button>
                </div>
            </InstitutionLayout>
        );
    }

    const statusCounts = applications.reduce((acc, app) => {
        const status = app.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    return (
        <InstitutionLayout isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4 sm:mb-0"
                    >
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            {isEnglish ? 'Job Applicants' : 'Candidats'}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {isEnglish 
                                ? `${applications.length} applicant${applications.length !== 1 ? 's' : ''} found` 
                                : `${applications.length} candidat${applications.length !== 1 ? 's' : ''} trouvé${applications.length !== 1 ? 's' : ''}`
                            }
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto"
                    >
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                            <Input 
                                placeholder={isEnglish ? "Search applicants..." : "Rechercher des candidats..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder={isEnglish ? "Filter by status" : "Filtrer par statut"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{isEnglish ? "All statuses" : "Tous les statuts"}</SelectItem>
                                <SelectItem value="pending">{isEnglish ? "Pending" : "En attente"}</SelectItem>
                                <SelectItem value="accepted">{isEnglish ? "Accepted" : "Accepté"}</SelectItem>
                                <SelectItem value="rejected">{isEnglish ? "Rejected" : "Rejeté"}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button 
                            variant="outline" 
                            onClick={handleRefresh}
                            className={`${isRefreshing ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw size={18} />
                        </Button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Tabs defaultValue="grid" className="mb-6">
                        <TabsList className="mb-4">
                            <TabsTrigger value="grid">
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                                    <span>{isEnglish ? "Grid View" : "Vue Grille"}</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger value="list">
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                                    <span>{isEnglish ? "List View" : "Vue Liste"}</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
                                <Badge 
                                    variant="secondary" 
                                    className="cursor-pointer" 
                                    onClick={() => setStatusFilter('all')}
                                >
                                    {isEnglish ? "All" : "Tous"} ({applications.length})
                                </Badge>
                                <Badge 
                                    variant="outline" 
                                    className={`cursor-pointer ${statusFilter === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}`}
                                    onClick={() => setStatusFilter('pending')}
                                >
                                    {isEnglish ? "Pending" : "En attente"} ({statusCounts.pending || 0})
                                </Badge>
                                <Badge 
                                    variant="outline" 
                                    className={`cursor-pointer ${statusFilter === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}`}
                                    onClick={() => setStatusFilter('accepted')}
                                >
                                    {isEnglish ? "Accepted" : "Accepté"} ({statusCounts.accepted || 0})
                                </Badge>
                                <Badge 
                                    variant="outline" 
                                    className={`cursor-pointer ${statusFilter === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : ''}`}
                                    onClick={() => setStatusFilter('rejected')}
                                >
                                    {isEnglish ? "Rejected" : "Rejeté"} ({statusCounts.rejected || 0})
                                </Badge>
                            </div>

                            <TabsContent value="grid" className="p-4">
                                {filteredApplications.length === 0 ? (
                                    <div className="text-center py-12">
                                        <User className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" />
                                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                                            {isEnglish ? "No applicants found" : "Aucun candidat trouvé"}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {isEnglish 
                                                ? "Try changing your search or filter criteria." 
                                                : "Essayez de modifier vos critères de recherche ou de filtre."
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredApplications.map((application, index) => (
                                            <ApplicantCard
                                                key={application.id}
                                                application={application}
                                                onViewDetails={handleViewDetails}
                                                onSendEmail={handleSendEmailClick}
                                                onStatusUpdate={handleStatusUpdate}
                                                isEnglish={isEnglish}
                                            />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="list" className="p-0">
                                {filteredApplications.length === 0 ? (
                                    <div className="text-center py-12">
                                        <User className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" />
                                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                                            {isEnglish ? "No applicants found" : "Aucun candidat trouvé"}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {isEnglish 
                                                ? "Try changing your search or filter criteria." 
                                                : "Essayez de modifier vos critères de recherche ou de filtre."
                                            }
                                        </p>
                                    </div>
                                ) : (
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
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {filteredApplications.map((application, index) => (
                                                    <motion.tr 
                                                        key={application.id}
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.2, delay: index * 0.03 }}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600">
                                                                    <AvatarFallback>
                                                                        {application.applicant.full_name.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {application.applicant.full_name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {application.applicant.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                                                                <div>
                                                                    <div className="text-sm text-gray-900 dark:text-white">{application.job.title}</div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{application.job.company}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Badge 
                                                                variant="outline" 
                                                                className={`
                                                                    ${statusColors[application.status || 'pending'].bg} 
                                                                    ${statusColors[application.status || 'pending'].text} 
                                                                    ${statusColors[application.status || 'pending'].border}
                                                                    flex items-center
                                                                `}
                                                            >
                                                                {statusColors[application.status || 'pending'].icon}
                                                                {application.status || 'pending'}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                            <div className="flex items-center">
                                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                                {new Date(application.applied_date).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end space-x-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleViewDetails(application)}
                                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleSendEmailClick(application)}
                                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                                                >
                                                                    <Mail className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleStatusUpdate(application.id, 'accepted')}
                                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>
                </motion.div>

                {/* Email Dialog */}
                <Dialog open={emailDialog} onOpenChange={setEmailDialog}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                {isEnglish ? 'Send Email to Applicant' : 'Envoyer un Email au Candidat'}
                            </DialogTitle>
                            <DialogTitle className="text-xl">
                                {isEnglish ? 'Send Email to Applicant' : 'Envoyer un Email au Candidat'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {isEnglish ? 'Subject' : 'Sujet'}
                                </label>
                                <Input
                                    type="text"
                                    value={emailForm.subject}
                                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                    placeholder={isEnglish ? "Enter subject..." : "Entrez le sujet..."}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {isEnglish ? 'Message' : 'Message'}
                                </label>
                                <Textarea
                                    value={emailForm.message}
                                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                                    placeholder={isEnglish ? "Enter your message..." : "Entrez votre message..."}
                                    className="w-full min-h-[150px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                onClick={() => setEmailDialog(false)}
                            >
                                {isEnglish ? 'Cancel' : 'Annuler'}
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleSendEmail}
                                disabled={!emailForm.subject || !emailForm.message}
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {isEnglish ? 'Send Email' : 'Envoyer l\'Email'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Applicant Details Dialog */}
                <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                {isEnglish ? 'Applicant Details' : 'Détails du Candidat'}
                            </DialogTitle>
                        </DialogHeader>
                        {selectedApplicant && (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600">
                                        <AvatarFallback>
                                            {selectedApplicant.applicant.full_name.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {selectedApplicant.applicant.full_name}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {selectedApplicant.applicant.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {isEnglish ? 'Job Position' : 'Poste'}
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {selectedApplicant.job.title}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {isEnglish ? 'Applied Date' : 'Date de Candidature'}
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {new Date(selectedApplicant.applied_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {isEnglish ? 'Location' : 'Localisation'}
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {selectedApplicant.applicant.location || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {isEnglish ? 'Status' : 'Statut'}
                                        </label>
                                        <Badge 
                                            variant="outline" 
                                            className={`
                                                ${statusColors[selectedApplicant.status || 'pending'].bg} 
                                                ${statusColors[selectedApplicant.status || 'pending'].text} 
                                                ${statusColors[selectedApplicant.status || 'pending'].border}
                                                flex items-center
                                            `}
                                        >
                                            {statusColors[selectedApplicant.status || 'pending'].icon}
                                            {selectedApplicant.status || 'pending'}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {isEnglish ? 'Cover Letter' : 'Lettre de Motivation'}
                                    </label>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {selectedApplicant.cover_letter || 'No cover letter provided.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                onClick={() => setDetailsDialog(false)}
                            >
                                {isEnglish ? 'Close' : 'Fermer'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </InstitutionLayout>
    );
};

export default Candidats;
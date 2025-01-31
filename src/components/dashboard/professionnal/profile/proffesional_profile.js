import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Briefcase, GraduationCap, Award, Clock, Heart, MapPin, User, Star, Video, LogOut } from 'lucide-react';
import ProfessionalLayout from '../professionnal_layout';
import { getUser } from '../../../services/get_user'; // Assuming you have a service to fetch and update user data
import { updateProfessionalProfile } from '../../../services/professionnal/updateProfessionalProfile'; // Assuming you have a service to fetch and update user data

const CompleteProfile = ({ isDarkMode, setIsDarkMode, isEnglish, setIsEnglish }) => {
    const [formData, setFormData] = useState({
        title: '',
        biography: '',
        hourly_rate: '',
        linkedin: '',
        github: '',
        twitter: '',
        website: '',
        degree: '',
        institution: '',
        education_year: '',
        certification_name: '',
        certification_issuer: '',
        certification_year: '',
        plan_type: '',
        plan_price: '',
        plan_description: '',
        max_students: '',
        domain_name: '',
        subdomains: []
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUser();
                setCurrentUser(userData);
                if (userData.professional_complete_profile) {
                    setFormData(userData.professional_complete_profile);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                await updateProfessionalProfile(formData);
                navigate('/professional_dashboard');
            } catch (error) {
                console.error('Error updating profile:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const validateForm = (data) => {
        const errors = {};
        if (!data.title) errors.title = 'Title is required';
        if (!data.biography) errors.biography = 'Biography is required';
        if (!data.hourly_rate || isNaN(data.hourly_rate)) errors.hourly_rate = 'Hourly rate must be a number';
        if (!data.degree) errors.degree = 'Degree is required';
        if (!data.institution) errors.institution = 'Institution is required';
        if (!data.education_year || !/^\d{4}$/.test(data.education_year)) errors.education_year = 'Education year must be a valid year';
        if (!data.certification_name) errors.certification_name = 'Certification name is required';
        if (!data.certification_issuer) errors.certification_issuer = 'Certification issuer is required';
        if (!data.certification_year || !/^\d{4}$/.test(data.certification_year)) errors.certification_year = 'Certification year must be a valid year';
        if (!data.plan_type) errors.plan_type = 'Plan type is required';
        if (!data.plan_price || isNaN(data.plan_price)) errors.plan_price = 'Plan price must be a number';
        if (!data.max_students || isNaN(data.max_students)) errors.max_students = 'Max students must be a number';
        if (!data.domain_name) errors.domain_name = 'Domain name is required';
        return errors;
    };

    return (
        <ProfessionalLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
            <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {isEnglish ? 'Complete Your Profile' : 'Complétez Votre Profil'}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Title' : 'Titre'}
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                    errors.title ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>

                        {/* Biography */}
                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Biography' : 'Biographie'}
                            </label>
                            <textarea
                                name="biography"
                                value={formData.biography}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                    errors.biography ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                                rows="3"
                            />
                            {errors.biography && <p className="text-red-500 text-sm mt-1">{errors.biography}</p>}
                        </div>

                        {/* Hourly Rate */}
                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Hourly Rate' : 'Taux Horaire'}
                            </label>
                            <input
                                type="text"
                                name="hourly_rate"
                                value={formData.hourly_rate}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                    errors.hourly_rate ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                            {errors.hourly_rate && <p className="text-red-500 text-sm mt-1">{errors.hourly_rate}</p>}
                        </div>

                        {/* Social Links */}
                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                GitHub
                            </label>
                            <input
                                type="url"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Twitter
                            </label>
                            <input
                                type="url"
                                name="twitter"
                                value={formData.twitter}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                        </div>

                        {/* Education */}
                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Degree' : 'Diplôme'}
                            </label>
                            <input
                                type="text"
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                    errors.degree ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                            {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree}</p>}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Institution' : 'Établissement'}
                            </label>
                            <input
                                type="text"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                    errors.institution ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                            {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Education Year' : 'Année d\'Étude'}
                            </label>
                            <input
                                type="text"
                                name="education_year"
                                value={formData.education_year}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                    errors.education_year ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                            {errors.education_year && <p className="text-red-500 text-sm mt-1">{errors.education_year}</p>}
                        </div>

                        {/* Certification */}
                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Certification Name' : 'Nom de la Certification'}
                            </label>
                            <input
                                type="text"
                                name="certification_name"
                                value={formData.certification_name}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                    errors.certification_name ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                            {errors.certification_name && <p className="text-red-500 text-sm mt-1">{errors.certification_name}</p>}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Certification Issuer' : 'Émetteur de la Certification'}
                            </label>
                            <input
                                type="text"
                                name="certification_issuer"
                                value={formData.certification_issuer}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                    errors.certification_issuer ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                            {errors.certification_issuer && <p className="text-red-500 text-sm mt-1">{errors.certification_issuer}</p>}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Certification Year' : 'Année de Certification'}
                            </label>
                            <input
                                type="text"
                                name="certification_year"
                                value={formData.certification_year}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                    errors.certification_year ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                            {errors.certification_year && <p className="text-red-500 text-sm mt-1">{errors.certification_year}</p>}
                        </div>

                        {/* Mentorship Plan */}
                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Plan Type' : 'Type de Plan'}
                            </label>
                            <select
                                name="plan_type"
                                value={formData.plan_type}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                    errors.plan_type ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            >
                                <option value="">Select Plan Type</option>
                                <option value="monthly">Monthly</option>
                                <option value="trimester">Trimester</option>
                                <option value="yearly">Yearly</option>
                            </select>
                            {errors.plan_type && <p className="text-red-500 text-sm mt-1">{errors.plan_type}</p>}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Plan Price' : 'Prix du Plan'}
                            </label>
                            <input
                                type="text"
                                name="plan_price"
                                value={formData.plan_price}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                    errors.plan_price ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                            {errors.plan_price && <p className="text-red-500 text-sm mt-1">{errors.plan_price}</p>}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Plan Description' : 'Description du Plan'}
                            </label>
                            <textarea
                                name="plan_description"
                                value={formData.plan_description}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                                rows="3"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Max Students' : 'Nombre Max d\'Étudiants'}
                            </label>
                            <input
                                type="text"
                                name="max_students"
                                value={formData.max_students}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                    errors.max_students ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                            {errors.max_students && <p className="text-red-500 text-sm mt-1">{errors.max_students}</p>}
                        </div>

                        {/* Domain */}
                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Domain Name' : 'Nom du Domaine'}
                            </label>
                            <input
                                type="text"
                                name="domain_name"
                                value={formData.domain_name}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border ${
                                  errors.domain_name ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                            />
                            {errors.domain_name && <p className="text-red-500 text-sm mt-1">{errors.domain_name}</p>}
                        </div>

                        {/* Subdomains */}
                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isEnglish ? 'Subdomains' : 'Sous-domaines'}
                            </label>
                            <input
                                type="text"
                                name="subdomains"
                                value={formData.subdomains.join(', ')}
                                onChange={(e) => {
                                    const subdomains = e.target.value.split(',').map((s) => s.trim());
                                    setFormData({ ...formData, subdomains });
                                }}
                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                                placeholder="Enter subdomains separated by commas"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                                isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    {isEnglish ? 'Saving...' : 'Enregistrement...'}
                                </>
                            ) : (
                                isEnglish ? 'Save Profile' : 'Enregistrer le Profil'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </ProfessionalLayout>
    );
};

export default CompleteProfile;
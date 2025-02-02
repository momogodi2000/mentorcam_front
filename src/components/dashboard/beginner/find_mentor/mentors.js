import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, MapPin, Star, Clock, Heart, Tag, User, Award, BookOpen, ChevronDown, Languages, CreditCard, Calendar } from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Alert, AlertTitle, AlertDescription } from '../../../ui/alert';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Slider } from '../../../ui/slider';
import BeginnerLayout from '../biginner_layout';
import FindMentorServices from '../../../services/biginner/find_mentor';
import BookingModal from './BookingModal';

const FindMentors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    expertise: [],
    location: [],
    availability: [],
    rating: null,
    priceRange: [0, 50000],
    languages: []
  });
  const [activeTab, setActiveTab] = useState('all');
  const [favoritesList, setFavoritesList] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', label: { en: 'All Mentors', fr: 'Tous les Mentors' }, icon: User },
    { id: 'tech', label: { en: 'Technology', fr: 'Technologie' }, icon: BookOpen },
    { id: 'business', label: { en: 'Business', fr: 'Business' }, icon: CreditCard },
    { id: 'arts', label: { en: 'Arts & Crafts', fr: 'Arts & Artisanat' }, icon: Tag },
    { id: 'education', label: { en: 'Education', fr: 'Éducation' }, icon: Award }
  ];

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await FindMentorServices.searchMentors({
          domain: activeTab === 'all' ? '' : activeTab,
          searchQuery,
        });
        
        if (response.results) {
          const transformedMentors = response.results.map(mentor => ({
            id: mentor.id,
            name: mentor.full_name,
            title: mentor.title,
            expertise: mentor.subdomains || [],
            location: mentor.location,
            rating: mentor.average_rating || 4.5,
            reviews: mentor.total_reviews || 0,
            hourlyRate: mentor.plan_price || 15000,
            availability: { hours: 20, slots: ['Morning', 'Evening'] },
            imageUrl: mentor.profile_picture || '/api/placeholder/150/150',
            category: mentor.domain_name.toLowerCase(),
            badges: mentor.certification_name ? ['Certified'] : [],
            languages: ['French', 'English'],
            description: mentor.biography || '',
            successRate: 95
          }));
          setMentors(transformedMentors);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, [searchQuery, activeTab, selectedFilters]);

  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const matchesSearch = searchQuery === '' || 
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeTab === 'all' || mentor.category === activeTab;
      
      const matchesFilters = 
        (selectedFilters.expertise.length === 0 || 
          mentor.expertise.some(skill => selectedFilters.expertise.includes(skill))) &&
        (selectedFilters.location.length === 0 || 
          selectedFilters.location.includes(mentor.location)) &&
        (selectedFilters.languages.length === 0 || 
          mentor.languages.some(lang => selectedFilters.languages.includes(lang))) &&
        mentor.hourlyRate >= selectedFilters.priceRange[0] &&
        mentor.hourlyRate <= selectedFilters.priceRange[1];

      return matchesSearch && matchesCategory && matchesFilters;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.hourlyRate - b.hourlyRate;
        case 'availability':
          return b.availability.hours - a.availability.hours;
        default:
          return 0;
      }
    });
  }, [mentors, searchQuery, activeTab, selectedFilters, sortBy]);

  const handleBookSession = (mentor) => {
    setSelectedMentor(mentor);
    setIsBookingModalOpen(true);
  };

  const handleBookingComplete = async () => {
    setIsBookingModalOpen(false);
    setSelectedMentor(null);
  };

  const toggleFavorite = (mentorId) => {
    setFavoritesList(prev => 
      prev.includes(mentorId) 
        ? prev.filter(id => id !== mentorId)
        : [...prev, mentorId]
    );
  };

  const MentorCard = ({ mentor }) => {
    const nextAvailableDate = new Date(mentor.nextAvailable || new Date());
    const formattedDate = new Intl.DateTimeFormat(isEnglish ? 'en-US' : 'fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(nextAvailableDate);

    return (
      <Card className={`transform transition-all duration-300 hover:scale-102 hover:shadow-lg ${
        isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative">
              <img
                src={mentor.imageUrl}
                alt={mentor.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
              <button
                onClick={() => toggleFavorite(mentor.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favoritesList.includes(mentor.id)
                      ? 'text-red-500 fill-red-500'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {mentor.name}
                    </h3>
                    {mentor.badges.map((badge, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {typeof mentor.title === 'object' ? 
                      (isEnglish ? mentor.title.en : mentor.title.fr) : 
                      mentor.title}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {mentor.rating}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({mentor.reviews})
                  </span>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {typeof mentor.description === 'object' ? 
                  (isEnglish ? mentor.description.en : mentor.description.fr) : 
                  mentor.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {mentor.expertise.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {mentor.location}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {mentor.availability.hours}h/week
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Languages className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {mentor.languages.join(', ')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {formattedDate}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {mentor.hourlyRate.toLocaleString()} FCFA
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    / {isEnglish ? 'hour' : 'heure'}
                  </span>
                </div>
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleBookSession(mentor)}
                >
                  {isEnglish ? 'Book Session' : 'Réserver'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const FilterSection = () => (
    <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm`}>
      <h3 className="font-semibold mb-4">
        {isEnglish ? 'Filters' : 'Filtres'}
      </h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">
            {isEnglish ? 'Price Range (FCFA)' : 'Fourchette de Prix (FCFA)'}
          </h4>
          <Slider
            defaultValue={[0, 50000]}
            max={50000}
            step={1000}
            onValueChange={(value) => 
              setSelectedFilters(prev => ({ ...prev, priceRange: value }))
            }
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>{selectedFilters.priceRange[0]} FCFA</span>
            <span>{selectedFilters.priceRange[1]} FCFA</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <BeginnerLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isEnglish ? 'Find Your Perfect Mentor' : 'Trouvez Votre Mentor Idéal'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isEnglish 
              ? 'Connect with experienced mentors who can guide you through your learning journey'
              : 'Connectez-vous avec des mentors expérimentés qui peuvent vous guider dans votre parcours d\'apprentissage'
            }
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEnglish ? "Search mentors by name, skills, or location..." : "Rechercher des mentors par nom, compétences ou lieu..."}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-4">
            <select
            value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              <option value="rating">{isEnglish ? 'Highest Rated' : 'Mieux Notés'}</option>
              <option value="price">{isEnglish ? 'Price: Low to High' : 'Prix: Croissant'}</option>
              <option value="availability">{isEnglish ? 'Most Available' : 'Plus Disponible'}</option>
            </select>

            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-1 w-6 h-6">
                  <div className="bg-current rounded"></div>
                  <div className="bg-current rounded"></div>
                  <div className="bg-current rounded"></div>
                  <div className="bg-current rounded"></div>
                </div>
              ) : (
                <div className="flex flex-col gap-1 w-6 h-6">
                  <div className="bg-current rounded h-1"></div>
                  <div className="bg-current rounded h-1"></div>
                  <div className="bg-current rounded h-1"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto space-x-4 mb-6 pb-2 scrollbar-hide">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <CategoryIcon className="w-4 h-4 mr-2" />
                {isEnglish ? category.label.en : category.label.fr}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <FilterSection />
          </div>

          <div className="flex-1">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredMentors.length === 0 ? (
              <Alert>
                <AlertTitle>
                  {isEnglish ? 'No mentors found' : 'Aucun mentor trouvé'}
                </AlertTitle>
                <AlertDescription>
                  {isEnglish 
                    ? 'Try adjusting your filters or search terms'
                    : 'Essayez d\'ajuster vos filtres ou termes de recherche'
                  }
                </AlertDescription>
              </Alert>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 gap-6"
                : "flex flex-col gap-4"
              }>
                {filteredMentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                  />
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="w-8 h-8 p-0"
                  disabled={true}
                >
                  1
                </Button>
                <Button
                  variant="ghost"
                  className="w-8 h-8 p-0"
                >
                  2
                </Button>
                <Button
                  variant="ghost"
                  className="w-8 h-8 p-0"
                >
                  3
                </Button>
                <span className="px-2">...</span>
                <Button
                  variant="ghost"
                  className="w-8 h-8 p-0"
                >
                  10
                </Button>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isEnglish ? 'Active Mentors' : 'Mentors Actifs'}
                  </p>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredMentors.length}
                  </h4>
                </div>
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isEnglish ? 'Average Rating' : 'Note Moyenne'}
                  </p>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                    4.8
                  </h4>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isEnglish ? 'Success Rate' : 'Taux de Réussite'}
                  </p>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                    96%
                  </h4>
                </div>
                <Award className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        mentor={selectedMentor}
        onBookingComplete={handleBookingComplete}
      />
    </BeginnerLayout>
  );
};

export default FindMentors;
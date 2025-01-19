import React, { useState, useEffect } from 'react';
import { 
  Award, Users, Globe, ArrowRight, X, Building, 
  Target, ChartBar, GraduationCap, Briefcase, 
  HeartHandshake, MapPin, Languages, Phone
} from 'lucide-react';
import { Dialog } from '../ui/Dialog';

const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mission');
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75;
        setIsVisible(prev => ({ ...prev, [el.id]: isVisible }));
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { number: "10K+", text: "Mentorés accompagnés", bgColor: "bg-blue-50" },
    { number: "95%", text: "Taux de satisfaction", bgColor: "bg-gray-50" },
    { number: "24/7", text: "Support en français et anglais", bgColor: "bg-gray-50" },
    { number: "50+", text: "Partenaires au Cameroun", bgColor: "bg-blue-50" },
    { number: "10", text: "Régions couvertes", bgColor: "bg-blue-50" },
    { number: "500+", text: "Experts certifiés", bgColor: "bg-gray-50" }
  ];

  const values = [
    {
      icon: <Award className="w-6 h-6 text-blue-600" />,
      title: "Excellence Africaine",
      description: "Nos mentors sont des experts camerounais reconnus dans leurs domaines respectifs."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Communauté Solidaire",
      description: "Une communauté dynamique qui promeut le partage de connaissances et l'entraide."
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      title: "Impact Local",
      description: "Contribution active au développement socio-économique du Cameroun."
    },
    {
      icon: <Languages className="w-6 h-6 text-blue-600" />,
      title: "Accessibilité Linguistique",
      description: "Services disponibles en français, anglais et langues locales."
    }
  ];

  const features = [
    {
      icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
      title: "Formation Adaptée",
      description: "Programmes sur mesure pour les réalités camerounaises"
    },
    {
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      title: "Support Mobile",
      description: "Application optimisée pour une utilisation sur mobile avec MTN et Orange"
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-blue-600" />,
      title: "Partenariats Locaux",
      description: "Collaboration avec les institutions et entreprises camerounaises"
    }
  ];

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-green-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
              Premier Réseau de Mentorat au Cameroun
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Construisons Ensemble
              <span className="text-blue-600"> l'Avenir du Cameroun</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              MentorCam connecte la nouvelle génération de talents camerounais avec des mentors expérimentés à travers tout le pays.
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div id="values" className={`space-y-8 animate-on-scroll ${isVisible.values ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {values.map((value, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex-shrink-0">{value.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div id="stats" className={`grid grid-cols-2 gap-4 animate-on-scroll ${isVisible.stats ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {stats.map((stat, index) => (
                <div key={index} className={`${stat.bgColor} p-6 rounded-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}>
                  <h4 className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</h4>
                  <p className="text-gray-600 text-sm">{stat.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 group"
            >
              Découvrir Notre Histoire
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Notre Histoire</h2>
              <p className="text-gray-600 mt-2">
                Depuis 2023, MentorCam œuvre pour le développement professionnel au Cameroun
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Vision 2025</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    Être présent dans les 10 régions du Cameroun
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    Former 100,000 professionnels camerounais
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    Créer 1,000 emplois directs et indirects
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AboutUs;
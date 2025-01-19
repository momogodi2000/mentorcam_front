import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, BookOpen, Calendar, Star, ArrowRight, Menu, X, MapPin, Award, CheckCircle, PhoneCall, Mail, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('amateurs');
  const navigate = useNavigate();


  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-section');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.75;
        if (isInView) {
          el.classList.add('fade-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { number: "5000+", label: "Utilisateurs Actifs" },
    { number: "1000+", label: "Mentors Professionnels" },
    { number: "50+", label: "Formations Spécialisées" },
    { number: "10", label: "Régions Couvertes" }
  ];

  const testimonials = [
    {
      name: "Jean-Paul Kamdem",
      role: "Artisan en Menuiserie",
      content: "Grâce à MentorCam, j'ai pu développer mes compétences en menuiserie moderne et doubler ma clientèle.",
      image: "../../assets/images/avarta.webp"
    },
    {
      name: "Marie Nguemo",
      role: "Entrepreneuse Tech",
      content: "La plateforme m'a mise en relation avec des mentors qui m'ont guidée dans le lancement de ma startup.",
      image: "../assets/images/avarta.webp"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation - Enhanced with gradient and blur effect */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                MentorCam
              </h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-all hover:scale-105">Services</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-all hover:scale-105">À Propos</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-all hover:scale-105">Témoignages</a>
              <div className="flex space-x-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-all"
                >
                  Connexion
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-6 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105"
                >
                  S'inscrire
                </button>
              </div>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-600">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu with animation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
          <div className="px-4 pt-2 pb-3 space-y-2 bg-white/90 backdrop-blur-lg">
            <a href="#features" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 rounded-lg">Services</a>
            <a href="#about" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 rounded-lg">À Propos</a>
            <a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 rounded-lg">Témoignages</a>
            <div className="space-y-2 pt-2">
              <button
                                onClick={() => navigate('/login')}

              className="w-full px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                Connexion
              </button>
              <button 
                                onClick={() => navigate('/signup')}

              className="w-full px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animation */}
      <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-purple-100/40" />
          <div className="absolute right-0 top-0 w-1/3 h-1/3 bg-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-purple-200/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                La première plateforme de mentorat au Cameroun
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Développez vos compétences avec{' '}
                <span className="text-blue-600">des experts camerounais</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
                Connectez-vous avec des professionnels expérimentés, participez à des formations 
                pratiques et construisez votre avenir professionnel au Cameroun.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transform hover:scale-105 transition-all flex items-center justify-center">
                  Commencer gratuitement
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transform hover:scale-105 transition-all">
                  Découvrir les mentors
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>


{/* About Us Section */}
<div id="about" className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="fade-in-section">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
          <div className="relative">
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
              Notre Histoire
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Premier réseau de mentorat 
              <span className="text-blue-600"> professionnel au Cameroun</span>
            </h2>
            <p className="text-gray-600 mb-6">
              Fondée en 2023, MentorCam est née d'une vision simple : démocratiser l'accès à l'expertise professionnelle au Cameroun. Notre plateforme connecte les talents émergents avec des mentors expérimentés, créant ainsi un écosystème d'apprentissage unique.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Excellence</h3>
                  <p className="text-gray-600">Nos mentors sont rigoureusement sélectionnés pour leur expertise et leur engagement.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Communauté</h3>
                  <p className="text-gray-600">Une communauté dynamique de professionnels partageant leurs connaissances.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Impact Local</h3>
                  <p className="text-gray-600">Contribution active au développement professionnel au Cameroun.</p>
                </div>
              </div>
            </div>
            <button 
                              onClick={() => navigate('/about_us')}

            
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transform hover:scale-105 transition-all flex items-center">
              En savoir plus
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 fade-in-section">
        <div className="space-y-4">
          <div className="bg-blue-50 p-6 rounded-2xl">
            <h4 className="text-4xl font-bold text-blue-600 mb-2">10+</h4>
            <p className="text-gray-600">Années d'expertise cumulée</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="text-4xl font-bold text-gray-900 mb-2">95%</h4>
            <p className="text-gray-600">Taux de satisfaction</p>
          </div>
        </div>
        <div className="space-y-4 mt-8">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="text-4xl font-bold text-gray-900 mb-2">24/7</h4>
            <p className="text-gray-600">Support disponible</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl">
            <h4 className="text-4xl font-bold text-blue-600 mb-2">50+</h4>
            <p className="text-gray-600">Partenaires</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Features Section with Cards */}
      <div id="features" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète adaptée aux besoins des professionnels et amateurs camerounais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Mentorat Personnalisé",
                description: "Trouvez le mentor idéal parmi notre réseau d'experts camerounais qualifiés",
                features: ["Sessions individuelles", "Suivi personnalisé", "Feedback continu"]
              },
              {
                icon: <BookOpen className="w-8 h-8 text-blue-600" />,
                title: "Formations Pratiques",
                description: "Développez vos compétences avec des formations adaptées au contexte local",
                features: ["Ateliers pratiques", "Certifications", "Supports pédagogiques"]
              },
              {
                icon: <Calendar className="w-8 h-8 text-blue-600" />,
                title: "Événements Professionnels",
                description: "Participez à des événements enrichissants et développez votre réseau",
                features: ["Conférences", "Ateliers networking", "Salons professionnels"]
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Audience Tabs */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pour Qui ?</h2>
            <div className="flex justify-center space-x-4 mb-12">
              <button
                onClick={() => setActiveTab('amateurs')}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === 'amateurs'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Amateurs
              </button>
              <button
                onClick={() => setActiveTab('professionals')}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === 'professionals'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Professionnels
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-500 ${
              activeTab === 'amateurs' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              {activeTab === 'amateurs' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Pour les Amateurs</h3>
                  <ul className="space-y-4">
                    {[
                      "Accès à des mentors expérimentés",
                      "Formations pratiques adaptées",
                      "Accompagnement personnalisé",
                      "Networking professionnel",
                      "Certifications reconnues"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className={`transition-all duration-500 ${
              activeTab === 'professionals' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              {activeTab === 'professionals' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Pour les Professionnels</h3>
                  <ul className="space-y-4">
                    {[
                      "Monétisez votre expertise",
                      "Flexibilité des horaires",
                      "Plateforme de paiement sécurisée",
                      "Visibilité accrue",
                      "Gestion simplifiée des sessions"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Témoignages</h2>
            <p className="text-lg text-gray-600">Découvrez l'expérience de nos utilisateurs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
            <div className="relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Prêt à commencer votre voyage professionnel ?
                </h2>
                <p className="text-blue-100 mb-8 text-lg">
                  Rejoignez notre communauté et connectez-vous avec des mentors expérimentés dès aujourd'hui.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transform hover:scale-105 transition-all">
                    Commencer gratuitement
                  </button>
                  <button 
                                    onClick={() => navigate('/contact_us')}

                  className="px-8 py-4 border-2 border-white text-white rounded-full font-medium hover:bg-blue-700 transform hover:scale-105 transition-all">
                    Contacter l'équipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-2xl font-bold text-white">MentorCam</span>
              </div>
              <p className="text-gray-400">
                La première plateforme de mentorat professionnel au Cameroun.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400 transition-colors">
                  <Globe className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  <PhoneCall className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Services</h3>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Mentorat</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Formations</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Événements</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Certification</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Entreprise</h3>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-blue-400 transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Presse</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Yaoundé, Cameroun
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  contact@mentorcam.com
                </li>
                <li className="flex items-center">
                  <PhoneCall className="w-5 h-5 mr-2" />
                  +237 xxx xxx xxx
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 MentorCam. Tous droits réservés.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Conditions d'utilisation
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Politique de confidentialité
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Mentions légales
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
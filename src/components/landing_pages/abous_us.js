import React, { useState } from 'react';
import { Award, Users, Globe, ArrowRight, X, Building, Target, ChartBar } from 'lucide-react';
import { Dialog } from '../ui/Dialog';

const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { number: "10+", text: "Années d'expertise cumulée", bgColor: "bg-blue-50" },
    { number: "95%", text: "Taux de satisfaction", bgColor: "bg-gray-50" },
    { number: "24/7", text: "Support disponible", bgColor: "bg-gray-50" },
    { number: "50+", text: "Partenaires", bgColor: "bg-blue-50" }
  ];

  const values = [
    {
      icon: <Award className="w-6 h-6 text-blue-600" />,
      title: "Excellence",
      description: "Nos mentors sont rigoureusement sélectionnés pour leur expertise et leur engagement."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Communauté",
      description: "Une communauté dynamique de professionnels partageant leurs connaissances."
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      title: "Impact Local",
      description: "Contribution active au développement professionnel au Cameroun."
    }
  ];

  const modalContent = [
    {
      icon: <Building className="w-8 h-8 text-blue-600" />,
      title: "Notre Mission",
      description: "Démocratiser l'accès à l'expertise professionnelle au Cameroun en créant des ponts entre les talents émergents et les experts établis. Nous croyons en un écosystème d'apprentissage collaboratif qui stimule l'innovation et la croissance."
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Notre Vision",
      description: "Devenir la référence du mentorat professionnel en Afrique, en formant la prochaine génération de leaders et d'experts camerounais. Nous aspirons à créer un impact durable sur le développement économique et social de notre pays."
    },
    {
      icon: <ChartBar className="w-8 h-8 text-blue-600" />,
      title: "Notre Impact",
      description: "Depuis notre création, nous avons facilité plus de 1000 connexions mentor-mentoré, organisé plus de 50 événements professionnels, et contribué au lancement de nombreuses carrières prometteuses au Cameroun."
    }
  ];

  return (
    <div id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-in-section">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-100 rounded-full opacity-50 blur-3xl animate-pulse"></div>
              <div className="relative">
                <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-100 rounded-full transform hover:scale-105 transition-all">
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
                  {values.map((value, index) => (
                    <div key={index} className="flex items-start space-x-4 transform hover:scale-105 transition-all">
                      <div className="flex-shrink-0">
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{value.title}</h3>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transform hover:scale-105 transition-all flex items-center group"
                >
                  En savoir plus
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`${stat.bgColor} p-6 rounded-2xl transform hover:scale-105 transition-all hover:shadow-lg`}
              >
                <h4 className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</h4>
                <p className="text-gray-600">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate-in slide-in-from-bottom-4">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-8">À Propos de MentorCam</h2>
            
            <div className="space-y-8">
              {modalContent.map((content, index) => (
                <div key={index} className="flex gap-6 items-start p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    {content.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{content.description}</p>
                  </div>
                </div>
              ))}
              
              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Nos Objectifs pour 2025</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Étendre notre réseau à plus de 1000 mentors qualifiés
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Lancer des programmes de mentorat spécialisés par secteur
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Développer des partenariats avec les principales institutions éducatives
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
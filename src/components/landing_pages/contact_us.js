import React, { useState, useEffect } from 'react';
import { MapPin, Mail, PhoneCall, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitContactForm, subscribeNewsletter } from '../../authService';
import { Alert, AlertDescription } from '../ui/alert';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [error, setError] = useState('');
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialize Google Maps
    const initMap = () => {
      const yaoundeLocation = { lat: 3.848033, lng: 11.502075 }; // Kennedy, Yaoundé coordinates
      const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        center: yaoundeLocation,
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: yaoundeLocation,
        map: mapInstance,
        title: 'Notre bureau à Yaoundé'
      });

      setMap(mapInstance);
    };

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&libraries=places&callback=initMap
`;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', initMap);
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await submitContactForm(formData);
      setSubmitStatus('success');
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(''), 3000);
    } catch (error) {
      setError(error.message);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await subscribeNewsletter(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus(''), 3000);
    } catch (error) {
      setError(error.message);
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative py-16 bg-white">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-purple-100/40" />
            <div className="absolute right-0 top-0 w-1/3 h-1/3 bg-blue-200/20 rounded-full blur-3xl" />
            <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-purple-200/20 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou suggestion.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Notre Adresse</h3>
              <p className="text-gray-600">Quartier Kennedy<br />Yaoundé, Cameroun</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">contact@mentorcam.com<br />support@mentorcam.com</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <PhoneCall className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Téléphone</h3>
              <p className="text-gray-600">+237 xxx xxx xxx<br />Lun - Ven, 8h - 18h</p>
            </div>
          </div>
        </div>

        {/* Contact Form and Newsletter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form fields remain the same */}
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="subject">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transform hover:scale-105 transition-all flex items-center justify-center"
                >
                  Envoyer le message
                  <Send className="ml-2 w-5 h-5" />
                </button>

                {submitStatus === 'success' && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Message envoyé avec succès !
                  </div>
                )}
              </form>
            </div>

            {/* Newsletter Section */}
            <div className="space-y-8">
              <div className="bg-blue-600 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Newsletter</h2>
                <p className="mb-6">
                  Abonnez-vous à notre newsletter pour recevoir les dernières actualités et offres spéciales.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Votre adresse email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-white/60 text-white focus:ring-2 focus:ring-white focus:border-transparent"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transform hover:scale-105 transition-all"
                  >
                    S'abonner
                  </button>

                  {newsletterStatus === 'success' && (
                    <div className="flex items-center text-white">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Inscription réussie !
                    </div>
                  )}
                </form>
              </div>

              {/* FAQ Preview */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions Fréquentes</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Comment fonctionne le mentorat ?
                    </h3>
                    <p className="text-gray-600">
                      Notre plateforme vous met en relation avec des mentors expérimentés selon vos besoins...
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Quels sont les tarifs ?
                    </h3>
                    <p className="text-gray-600">
                      Les tarifs varient selon les mentors et les types de services...
                    </p>
                  </div>
                </div>
                <button className="mt-6 text-blue-600 font-medium hover:text-blue-700">
                  Voir toutes les FAQ →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full h-96 relative">
          <div id="map" className="w-full h-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
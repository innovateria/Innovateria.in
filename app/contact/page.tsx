import ContactForm from '@/components/ContactForm';
import { Phone, Mail, MapPin, Clock, MessageCircle, Globe, Github, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export const metadata = {
  title: 'Contact Innovateria | App, Web & SEO Experts',
  description: 'Contact Innovateria for Android app development, custom software, web development, logo design, SEO, and digital marketing services.',
  alternates: { canonical: 'https://innovateria.in/contact' },
  openGraph: {
    title: 'Contact Innovateria | App, Web & SEO Experts',
    description: 'Get in touch with Innovateria for custom digital solutions and business growth support.',
    url: 'https://innovateria.in/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Map Background Layer */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-20 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: 'url(/assets/img/backgrounds/map2.png)' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/60 via-transparent to-[#0B0F17] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
          Reach Out To Us
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact <span className="text-gradient-brand">Innovateria</span>
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          We would love to hear from you! Whether you have a new app project idea or need technical consultation, our engineering team is ready.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-3">Contact Details</h3>

            <div className="space-y-4 text-xs">
              <a href="tel:+917762974716" className="flex items-start space-x-4 text-gray-300 hover:text-brand-500 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <strong className="block text-white font-semibold mb-0.5">Phone Number</strong>
                  <span>+91 77629 74716</span>
                </div>
              </a>

              <a href="https://wa.me/917762974716" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4 text-gray-300 hover:text-brand-500 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <strong className="block text-white font-semibold mb-0.5">WhatsApp Direct</strong>
                  <span>+91 77629 74716</span>
                </div>
              </a>

              <a href="mailto:innovateria.in@gmail.com" className="flex items-start space-x-4 text-gray-300 hover:text-brand-500 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <strong className="block text-white font-semibold mb-0.5">Email Address</strong>
                  <span>innovateria.in@gmail.com</span>
                </div>
              </a>

              <div className="flex items-start space-x-4 text-gray-300">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <strong className="block text-white font-semibold mb-0.5">Support Hours</strong>
                  <span>24/7 Technical Consultation Available</span>
                </div>
              </div>

              <div className="flex items-start space-x-4 text-gray-300">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <strong className="block text-white font-semibold mb-0.5">Development Hub</strong>
                  <span>Bangalore / Mysore / Punjab, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Profiles - Icon Only */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Connect Online</h4>
            <div className="flex items-center space-x-3">
              <a
                href="https://github.com/VnjVibhash"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="w-11 h-11 rounded-2xl glass-card border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-brand-500/20 hover:border-brand-500/40 transition-all hover:scale-110 shadow-lg"
              >
                <Github size={20} />
              </a>

              <a
                href="https://facebook.com/Vivekajee"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="w-11 h-11 rounded-2xl glass-card border border-white/10 flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all hover:scale-110 shadow-lg"
              >
                <Facebook size={20} />
              </a>

              <a
                href="https://twitter.com/Vnjvibhash"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                title="Twitter"
                className="w-11 h-11 rounded-2xl glass-card border border-white/10 flex items-center justify-center text-gray-300 hover:text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/40 transition-all hover:scale-110 shadow-lg"
              >
                <Twitter size={20} />
              </a>

              <a
                href="https://linkedin.com/in/Vivekajee"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="w-11 h-11 rounded-2xl glass-card border border-white/10 flex items-center justify-center text-gray-300 hover:text-blue-500 hover:bg-blue-600/20 hover:border-blue-600/40 transition-all hover:scale-110 shadow-lg"
              >
                <Linkedin size={20} />
              </a>

              <a
                href="https://instagram.com/Vivekajee"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="w-11 h-11 rounded-2xl glass-card border border-white/10 flex items-center justify-center text-gray-300 hover:text-pink-400 hover:bg-pink-500/20 hover:border-pink-500/40 transition-all hover:scale-110 shadow-lg"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

      </div>

      </div>
    </div>
  );
}

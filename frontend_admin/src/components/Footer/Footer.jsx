import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp,
  Heart
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              YourBrand
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Building the future with innovative solutions and exceptional user experiences. Join us on our journey to transform the digital landscape.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200 transform hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">Dashboard</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">Register</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">Web Development</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">Mobile Apps</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">UI/UX Design</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">Consulting</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">Support</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail size={16} className="mr-3 text-blue-400" />
                <span className="hover:text-blue-400 transition-colors duration-200">hello@yourbrand.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone size={16} className="mr-3 text-blue-400" />
                <span className="hover:text-blue-400 transition-colors duration-200">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start text-gray-300">
                <MapPin size={16} className="mr-3 text-blue-400 mt-1" />
                <span className="hover:text-blue-400 transition-colors duration-200">
                  123 Innovation Street<br />
                  Tech City, TC 12345
                </span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-white">Stay Updated</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-l-lg border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors duration-200"
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-r-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                  <Mail size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-gray-400 text-sm mb-4 md:mb-0">
              <span>© 2025 YourBrand. Made with</span>
              <Heart size={14} className="mx-1 text-red-400 fill-current" />
              <span>All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200">Terms of Service</a>
              <button 
                onClick={scrollToTop}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-all duration-200 transform hover:scale-110 hover:-translate-y-1"
                aria-label="Scroll to top"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
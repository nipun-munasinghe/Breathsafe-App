import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">BreathSafe</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Empowering communities with innovative air quality monitoring
              solutions. Together, we breathe safer, live healthier.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="#"
                className="w-9 h-9 bg-gray-100 hover:bg-green-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 bg-gray-100 hover:bg-green-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 bg-gray-100 hover:bg-green-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 bg-gray-100 hover:bg-green-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/air-quality-monitoring"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  Air Quality Monitoring
                </Link>
              </li>
              <li>
                <Link
                  href="/data-analytics"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  Data Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/alerts"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  Smart Alerts
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  Health Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  API Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="text-green-600" />
                </div>
                <div>
                  <span className="text-gray-600 text-sm leading-relaxed">
                    79/3/a, Polhena Road
                    <br />
                    Nittambuwa, Sri Lanka
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-green-600" />
                </div>
                <Link
                  href="tel:+94776962625"
                  className="text-gray-600 hover:text-green-600 text-sm font-medium transition-colors"
                >
                  077 696 2625
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-green-600" />
                </div>
                <Link
                  href="mailto:breathsafe@gmail.com"
                  className="text-gray-600 hover:text-green-600 text-sm font-medium transition-colors"
                >
                  breathsafe@gmail.com
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-500 text-sm order-2 sm:order-1">
              © {currentYear} BreathSafe. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-6 text-sm order-1 sm:order-2">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-green-600 transition-colors font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-green-600 transition-colors font-medium"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-500 hover:text-green-600 transition-colors font-medium"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

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
    <footer className="bg-green-900 text-white">
      {/*footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-300">BreathSafe</h3>
            <p className="text-green-100 text-sm leading-relaxed">
              Empowering communities with innovative air quality monitoring
              solutions. Together, we breathe safer, live healthier.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-green-200 hover:text-green-300 transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-green-200 hover:text-green-300 transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="text-green-200 hover:text-green-300 transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="text-green-200 hover:text-green-300 transition-colors"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-300">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-green-100 hover:text-green-300 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-green-100 hover:text-green-300 transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-green-100 hover:text-green-300 transition-colors text-sm"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-green-100 hover:text-green-300 transition-colors text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-green-100 hover:text-green-300 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-300">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/air-quality-monitoring"
                  className="text-green-100 hover:text-green-300 transition-colors text-sm"
                >
                  Air Quality Monitoring
                </Link>
              </li>
              <li>
                <Link
                  href="/data-analytics"
                  className="text-green-100 hover:text-green-300 transition-colors text-sm"
                >
                  Data Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/alerts"
                  className="text-green-100 hover:text-green-300 transition-colors text-sm"
                >
                  Smart Alerts
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="text-green-100 hover:text-green-300 transition-colors text-sm"
                >
                  Health Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-green-100 hover:text-green-300 transition-colors text-sm"
                >
                  API Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-300">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-green-300 flex-shrink-0" />
                <span className="text-green-100 text-sm">
                  79/3/a , polhena road,nittambuwa, Sri Lanka
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-green-300 flex-shrink-0" />
                <span className="text-green-100 text-sm">077 6962625</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-green-300 flex-shrink-0" />
                <span className="text-green-100 text-sm">
                  breathsafe@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-green-200 text-sm">
              © {currentYear} BreathSafe. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-green-200 hover:text-green-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-green-200 hover:text-green-300 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-green-200 hover:text-green-300 transition-colors"
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

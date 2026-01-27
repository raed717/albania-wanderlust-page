import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Youtube,
  CreditCard,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-950 to-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                BookinAL
              </h3>
            </Link>
            <p className="text-slate-400 mb-5 leading-relaxed text-sm">
              Your trusted platform for discovering and booking the best
              accommodations and car rentals in Albania.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-red-600"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-800 flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-transparent"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-red-600"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-red-600"
                aria-label="Youtube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-6 text-white">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/searchResults"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Hotels & Apartments
                </Link>
              </li>
              <li>
                <Link
                  to="/searchCarResults"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Car Rentals
                </Link>
              </li>
              <li>
                <Link
                  to="/properties-map"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Map View
                </Link>
              </li>
              <li>
                <Link
                  to="/CultureDetails"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Culture & Cuisine
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Cancellation Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold mb-6 text-white">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-sm">
                  Tirana, Albania
                  <br />
                  Rruga e Kavajës
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-sm">+355 4 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-sm">support@bookinal.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} BookinAL. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Shield className="w-4 h-4" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-500" />
                <span className="text-slate-500 text-xs">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

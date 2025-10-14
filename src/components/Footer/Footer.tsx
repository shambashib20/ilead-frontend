import logo from "../../assets/logo-dark-sm.png";

import { Phone, MapPin, Heart, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About", href: "#" },
    { name: "Terms & Condition", href: "/terms-condition" },
    { name: "Refund", href: "/refund" },
    { name: "Public", href: "/publicDetails" },
    { name: "Contact", href: "#" },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main content - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="" className="w-10 h-10" />
              <div>
                <span className="text-lg font-bold text-white">
                  MR Group of Colleges
                </span>
                <p className="text-slate-400 text-sm">
                  Excellence in Education
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4 text-sm">
              Quick Links
            </h3>
            <div className="flex flex-col space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4 text-sm">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400 text-sm">
                  mail@mrgroupofcolleges.com
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-slate-400 text-sm">
                  90510 44044 / 90510 22022
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  Taki Road, Near Champadali More, Barasat, Kolkata - 700124
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 text-center">
          <div className="text-slate-500 text-sm flex items-center justify-center space-x-1">
            <span>© {currentYear} MR Group of Colleges. Crafted with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>for education.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

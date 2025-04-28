import React from 'react';
import {
  BookOpen,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* University Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-[#A3CFF0] transition-colors group-hover:text-[#A3CFF0]/80" />
              <span className="text-xl font-bold text-[#A3CFF0] group-hover:text-[#A3CFF0]/80 transition-colors">VFSTR</span>
            </div>
            <p className="text-lg font-medium text-gray-300">
              Vignan's Foundation for Science, Technology & Research
            </p>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-1 text-[#A3CFF0] transition-colors group-hover:text-[#A3CFF0]/80" />
                <p>
                  Vadlamudi, Guntur District
                  <br />
                  Andhra Pradesh - 522213
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-[#A3CFF0] transition-colors group-hover:text-[#A3CFF0]/80" />
                <a
                  href="https://www.vignan.ac.in"
                  className="hover:text-[#A3CFF0] hover:underline transition-all"
                >
                  www.vignan.ac.in
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#A3CFF0]">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-400">
              {['Academics', 'Research', 'Admissions', 'Campus Life'].map((item) => (
                <li key={item}>
                  <a
                    href={`https://www.vignan.ac.in/${item.toLowerCase()}`}
                    className="hover:text-[#A3CFF0] hover:pl-2 hover:underline transition-all"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#A3CFF0]">
              Contact Us
            </h3>
            <div className="space-y-4 text-gray-400">
              <a href="tel:+918632344700" className="flex items-center space-x-2 hover:text-[#A3CFF0] hover:pl-2 transition-all">
                <Phone className="h-5 w-5 group-hover:text-[#A3CFF0]/80" />
                <span>0863-2344700</span>
              </a>
              <a href="mailto:info@vignan.ac.in" className="flex items-center space-x-2 hover:text-[#A3CFF0] hover:pl-2 transition-all">
                <Mail className="h-5 w-5 group-hover:text-[#A3CFF0]/80" />
                <span>info@vignan.ac.in</span>
              </a>
              <div className="flex items-center space-x-2 hover:text-[#A3CFF0] hover:pl-2 transition-all">
                <Clock className="h-5 w-5 group-hover:text-[#A3CFF0]/80" />
                <span>Mon - Sat: 9:00 AM - 5:00 PM</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#A3CFF0]">
              Connect With Us
            </h3>
            <div className="flex flex-wrap gap-4 text-gray-400">
              {[{ icon: Facebook, url: 'facebook' }, { icon: Twitter, url: 'twitter' }, { icon: Linkedin, url: 'linkedin' }, { icon: Instagram, url: 'instagram' }].map(({ icon: Icon, url }) => (
                <a
                  key={url}
                  href={`https://www.${url}.com/vignanuniversity`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-[#A3CFF0] hover:scale-110 transition-all"
                >
                  <Icon className="h-5 w-5" />
                  <span className="capitalize">{url}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Vignan's Mahotsav. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="/privacy" className="hover:text-[#A3CFF0] hover:underline transition-all">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#A3CFF0] hover:underline transition-all">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
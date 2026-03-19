import Link from 'next/link'
import {
  Droplets, Mail, Phone, MapPin,
  Facebook, Twitter, Instagram, Linkedin,
} from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-mint-900 text-mint-50 pt-20 pb-10 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-mint-800 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-teal-800 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-mint-600">
                <Droplets className="w-6 h-6" />
              </div>
              <span className="font-heading font-bold text-2xl text-white tracking-tight">
                SparkClean
              </span>
            </Link>
            <p className="text-mint-200 text-sm leading-relaxed">
              Premium residential and commercial cleaning services. We bring the
              sparkle back to your space with eco-friendly products and meticulous
              attention to detail.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-mint-800 flex items-center justify-center hover:bg-mint-700 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { label: 'About Us',       href: '/about' },
                { label: 'Our Services',   href: '/services' },
                { label: 'Projects',       href: '/projects' },
                { label: 'Cleaning Tips',  href: '/blog' },
                { label: 'Company News',   href: '/news' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-mint-200 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-white mb-6">Services</h3>
            <ul className="space-y-4">
              {[
                'Residential Cleaning',
                'Commercial Office',
                'Deep Cleaning',
                'Move-In / Move-Out',
                'Eco-Friendly Options',
              ].map((service) => (
                <li key={service}>
                  <Link href="/services" className="text-mint-200 hover:text-white transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-mint-400 shrink-0 mt-0.5" />
                <span className="text-mint-200">
                  123 Sparkle Avenue, Suite 100<br />Clean City, ST 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-mint-400 shrink-0" />
                <span className="text-mint-200">(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-mint-400 shrink-0" />
                <span className="text-mint-200">hello@sparkclean.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-mint-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-mint-300 text-sm">
            &copy; {new Date().getFullYear()} Spark Clean Services. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-mint-300">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

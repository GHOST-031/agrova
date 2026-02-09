import React from "react";
import { motion } from "framer-motion";
import {
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Leaf,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Marketplace",
      links: [
        { name: "Browse Products", path: "/products" },
        { name: "Fresh Vegetables", path: "/products?category=vegetables" },
        { name: "Organic Fruits", path: "/products?category=fruits" },
        { name: "Dairy Products", path: "/products?category=dairy" },
        { name: "Grains & Cereals", path: "/products?category=grains" },
      ],
    },
    {
      title: "For Farmers",
      links: [
        { name: "Sell Your Products", path: "/farmer/register" },
        { name: "Farmer Guidelines", path: "/farmer/guidelines" },
        { name: "Pricing Guide", path: "/farmer/pricing" },
        { name: "Success Stories", path: "/farmer/stories" },
        { name: "Support Center", path: "/farmer/support" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Customer Help", path: "/support" },
        { name: "Shipping Info", path: "/shipping" },
        { name: "Return Policy", path: "/returns" },
        { name: "FAQ", path: "/faq" },
        { name: "Contact Us", path: "/contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Our Mission", path: "/mission" },
        { name: "Sustainability", path: "/sustainability" },
        { name: "Careers", path: "/careers" },
        { name: "Press Kit", path: "/press" },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      text: "hello@fresh2consumer.com",
      href: "mailto:hello@fresh2consumer.com",
    },
    {
      icon: Phone,
      text: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      text: "123 Farm Street, Agriculture City, AC 12345",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: Twitter,
      href: "https://twitter.com/fresh2consumer",
      label: "Twitter",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/fresh2consumer",
      label: "Instagram",
    },
  ];

  return (
    <footer className="bg-forest-800 dark:bg-forest-950 text-forest-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 mb-4"
            >
              <div className="w-10 h-10 bg-forest-gradient rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-forest-100">
                Agrova
              </span>
            </motion.div>

            <p className="text-forest-300 mb-6 leading-relaxed">
              Connecting farmers directly with consumers for the freshest,
              highest quality produce. Supporting local agriculture and
              sustainable farming practices.
            </p>

            {/* Contact Information */}
            <div className="space-y-3">
              {contactInfo.map((contact, index) => (
                <motion.a
                  key={index}
                  href={contact.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 text-forest-300 hover:text-forest-100 transition-colors group"
                >
                  <contact.icon className="w-4 h-4 group-hover:text-forest-400" />
                  <span className="text-sm">{contact.text}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-forest-100 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-forest-300 hover:text-forest-100 text-sm block py-1 hover:translate-x-1 transition-all duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-forest-900 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold text-forest-100 mb-2">
              Stay Updated with Fresh Deals
            </h3>
            <p className="text-forest-300 mb-6">
              Get notified about seasonal produce, special offers, and farming
              tips.
            </p>

            <form className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-forest-700 text-forest-100 placeholder-forest-400 border border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn-forest-primary whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-forest-950 dark:bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-forest-400 text-sm">
              <span>© {currentYear} Agrova.</span>
              <span>Made with</span>
              <Heart className="w-4 h-4 text-error-500 fill-current" />
              <span>for farmers and consumers.</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-forest-400 hover:text-forest-100 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-forest-400 hover:text-forest-100 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-forest-400 hover:text-forest-100 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 bg-forest-700 hover:bg-forest-600 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-forest-200" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { motion } from "framer-motion";
import Card from "../components/ui/Card";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: "📧",
      title: "Email Support",
      primary: "support@agrova.demo",
      secondary: "For general inquiries"
    },
    {
      icon: "📞",
      title: "Phone Support",
      primary: "+91 98765 43210",
      secondary: "Available 9 AM - 9 PM IST"
    },
    {
      icon: "📍",
      title: "Headquarters",
      primary: "Tech Park, Green City",
      secondary: "India"
    },
    {
      icon: "⏰",
      title: "Response Time",
      primary: "Within 2-4 hours",
      secondary: "For all inquiries"
    }
  ];

  const faqItems = [
    {
      question: "How do I place an order?",
      answer: "Download the Agrova app, sign up, browse products, add to cart, and checkout. Orders are processed within 2 hours."
    },
    {
      question: "What are your delivery areas?",
      answer: "We currently deliver in 50 cities across multiple regions. Check our service map to see if we deliver to your area."
    },
    {
      question: "How fresh are the products?",
      answer: "All products are picked fresh and delivered within 24 hours. We guarantee farm-to-table freshness."
    },
    {
      question: "What if I'm not satisfied with my order?",
      answer: "We offer a 100% satisfaction guarantee. Contact support within 24 hours of delivery for refunds or replacements."
    },
    {
      question: "Are your products organic?",
      answer: "Many of our farmers practice sustainable and organic farming. Each product listing clearly indicates if it's certified organic."
    },
    {
      question: "How can I become a farmer partner?",
      answer: "Visit our farmer portal or email farmers@agrova.demo with your details. Our team will verify and onboard you."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-4xl font-bold text-forest-800 dark:text-forest-100"
      >
        Contact Us
      </motion.h1>

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 bg-gradient-to-r from-green-50 to-forest-50 dark:from-green-900 dark:to-forest-900">
          <p className="text-lg text-forest-700 dark:text-forest-300">
            We'd love to hear from you! Whether you have questions, feedback, or want to become a farmer partner, our team is here to help.
          </p>
        </Card>
      </motion.div>

      {/* Contact Info Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-6">Get In Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactInfo.map((info, idx) => (
            <Card key={idx} className="p-6 space-y-2 hover:shadow-lg transition-shadow">
              <div className="text-3xl">{info.icon}</div>
              <h3 className="text-lg font-semibold text-forest-800 dark:text-forest-100">{info.title}</h3>
              <p className="text-green-600 dark:text-green-400 font-medium">{info.primary}</p>
              <p className="text-sm text-forest-600 dark:text-forest-400">{info.secondary}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-6">Send Us a Message</h2>
        <Card className="p-8">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-forest-800 dark:text-forest-100">Name</label>
                <input 
                  type="text" 
                  placeholder="Your full name" 
                  className="w-full px-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-forest-800 dark:text-forest-100">Email</label>
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full px-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-forest-800 dark:text-forest-100">Subject</label>
              <input 
                type="text" 
                placeholder="How can we help?" 
                className="w-full px-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-forest-800 dark:text-forest-100">Message</label>
              <textarea 
                rows="5"
                placeholder="Your message here..." 
                className="w-full px-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
              ></textarea>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Send Message
            </button>
          </form>
        </Card>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <Card key={idx} className="p-6 space-y-2">
              <h3 className="font-semibold text-forest-800 dark:text-forest-100">{item.question}</h3>
              <p className="text-forest-700 dark:text-forest-300">{item.answer}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Social Media */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100">Follow Us</h2>
          <p className="text-forest-700 dark:text-forest-300 mb-4">Connect with us on social media for updates and announcements</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="#" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Facebook</a>
            <a href="#" className="px-6 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition-colors">Twitter</a>
            <a href="#" className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors">Instagram</a>
            <a href="#" className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">YouTube</a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ContactPage;



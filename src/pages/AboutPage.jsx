import React from "react";
import { motion } from "framer-motion";
import Card from "../components/ui/Card";

const AboutPage = () => {
  const stats = [
    { number: "500+", label: "Verified Farmers" },
    { number: "10,000+", label: "Happy Customers" },
    { number: "50", label: "Cities Covered" },
    { number: "24hrs", label: "Average Delivery" }
  ];

  const values = [
    { title: "Transparency", description: "Complete visibility from farm to table with real-time tracking" },
    { title: "Quality", description: "Rigorous quality checks ensure only the best produce reaches you" },
    { title: "Fair Pricing", description: "Farmers get better margins while you save money" },
    { title: "Sustainability", description: "Supporting local agriculture and reducing carbon footprint" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-4xl font-bold text-forest-800 dark:text-forest-100"
      >
        About Agrova
      </motion.h1>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 space-y-4 bg-gradient-to-r from-forest-50 to-forest-100 dark:from-forest-900 dark:to-forest-800">
          <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100">Our Mission</h2>
          <p className="text-lg text-forest-700 dark:text-forest-300">
            Agrova connects consumers directly with local farmers for fresh, quality produce at fair prices. We aim to build a transparent, sustainable supply chain that benefits communities and supports local agriculture.
          </p>
        </Card>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-6">By The Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stat.number}</div>
              <div className="text-sm text-forest-600 dark:text-forest-400">{stat.label}</div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Values Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-6">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, idx) => (
            <Card key={idx} className="p-6 space-y-2">
              <h3 className="text-lg font-semibold text-forest-800 dark:text-forest-100">{value.title}</h3>
              <p className="text-forest-700 dark:text-forest-300">{value.description}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-6">Why Choose Agrova?</h2>
        <Card className="p-8">
          <ul className="space-y-4 text-forest-700 dark:text-forest-300">
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span><strong>Farm Fresh Guarantee:</strong> Produce picked and delivered within 24 hours</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span><strong>Direct from Farmers:</strong> No middlemen, better prices for you and farmers</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span><strong>Verified Quality:</strong> Every order quality-checked before dispatch</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span><strong>Eco-Friendly:</strong> Sustainable packaging and minimal carbon footprint</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span><strong>Community Driven:</strong> Supporting local farmers and rural economy</span>
            </li>
          </ul>
        </Card>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-6">Meet Our Team</h2>
        <Card className="p-8 space-y-4 text-center">
          <p className="text-forest-700 dark:text-forest-300">
            We're a team of passionate developers, farmers, and entrepreneurs committed to revolutionizing agriculture and making fresh produce accessible to everyone.
          </p>
          <p className="text-sm text-forest-600 dark:text-forest-400">
            Founded in 2023 • Based across multiple regions • Supported by a network of 500+ verified farmers
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default AboutPage;



import React from "react";
import { motion } from "framer-motion";
import { Target, Heart, Globe, Sprout } from "lucide-react";
import Card from "../components/ui/Card";

const MissionPage = () => {
  const missionPoints = [
    {
      icon: Target,
      title: "Core Mission",
      description: "Connect consumers directly with local farmers for fresh, quality produce at fair prices while building a transparent and sustainable supply chain."
    },
    {
      icon: Heart,
      title: "Empowering Farmers",
      description: "Eliminate middlemen and ensure farmers receive fair prices for their hard work, improving their livelihoods and supporting rural communities."
    },
    {
      icon: Globe,
      title: "Sustainable Practices",
      description: "Reduce carbon footprint through local sourcing, eco-friendly packaging, and supporting agricultural practices that preserve the environment."
    },
    {
      icon: Sprout,
      title: "Community Growth",
      description: "Build a transparent ecosystem that benefits consumers, farmers, and communities while fostering trust and loyalty."
    }
  ];

  const goals = [
    {
      year: "2024",
      milestone: "Expand to 100 cities with 1,000+ verified farmers"
    },
    {
      year: "2025",
      milestone: "Reach 500,000+ active consumers and implement blockchain tracking"
    },
    {
      year: "2026",
      milestone: "Pioneer fully transparent, farmer-to-consumer supply chain"
    },
    {
      year: "2027",
      milestone: "Become the leading sustainable agriculture marketplace in South Asia"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-forest-800 dark:text-forest-100 mb-4">
          Our Mission
        </h1>
        <p className="text-xl text-forest-700 dark:text-forest-300">
          Revolutionizing agriculture by connecting quality producers with conscious consumers
        </p>
      </motion.div>

      {/* Main Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 space-y-4 bg-gradient-to-r from-green-50 to-forest-50 dark:from-green-900/20 dark:to-forest-900/20">
          <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100">
            Making Fresh Food Accessible to Everyone
          </h2>
          <p className="text-lg text-forest-700 dark:text-forest-300 leading-relaxed">
            Agrova exists to bridge the gap between farm and table. We believe that everyone deserves access to fresh, high-quality produce at fair prices. By empowering farmers with direct market access and providing consumers with transparency and quality assurance, we're building a more sustainable and equitable food system.
          </p>
        </Card>
      </motion.div>

      {/* Mission Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-6">
          What Drives Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missionPoints.map((point, idx) => {
            const Icon = point.icon;
            return (
              <Card key={idx} className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <Icon className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-forest-800 dark:text-forest-100">
                      {point.title}
                    </h3>
                    <p className="text-forest-700 dark:text-forest-300 mt-2">
                      {point.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-6">
          Our Roadmap
        </h2>
        <div className="space-y-4">
          {goals.map((goal, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {goal.year}
                    </span>
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-forest-800 dark:text-forest-100">
                    {goal.milestone}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-8 bg-forest-700 dark:bg-forest-800 text-white text-center space-y-4">
          <h2 className="text-2xl font-bold">Be Part of the Change</h2>
          <p className="text-forest-100">
            Join thousands of consumers and farmers who are already part of the Agrova movement. Together, we're building a more sustainable, transparent, and equitable food system.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <a href="/signup" className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition">
              Get Started
            </a>
            <a href="/about" className="px-6 py-2 bg-transparent border-2 border-white hover:bg-white hover:text-forest-800 rounded-lg font-semibold transition">
              Learn More
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default MissionPage;

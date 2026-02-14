import React from "react";
import { motion } from "framer-motion";
import { Leaf, Truck, Recycle, Zap, Users, TrendingUp } from "lucide-react";
import Card from "../components/ui/Card";

const SustainabilityPage = () => {
  const initiatives = [
    {
      icon: Leaf,
      title: "Local Sourcing",
      description: "We source directly from local farmers within 50-100 km radius, significantly reducing carbon emissions from transportation while supporting rural communities."
    },
    {
      icon: Truck,
      title: "Efficient Logistics",
      description: "Optimized delivery routes and consolidated shipments minimize fuel consumption. Our average delivery uses 80% less carbon compared to traditional supply chains."
    },
    {
      icon: Recycle,
      title: "Eco-Friendly Packaging",
      description: "100% biodegradable and recyclable packaging materials. We've eliminated plastic packaging completely, replacing it with compostable alternatives."
    },
    {
      icon: Zap,
      title: "Renewable Energy",
      description: "Our warehouses and facilities operate on renewable energy. Solar panels power 70% of our operations, with plans to reach 100% by 2025."
    },
    {
      icon: Users,
      title: "Fair Trade Practices",
      description: "Farmers receive 40-50% more than market rates. We ensure fair pricing that allows farmers to invest in sustainable agricultural practices."
    },
    {
      icon: TrendingUp,
      title: "Impact Tracking",
      description: "Complete transparency through blockchain-based tracking of environmental impact. Every purchase shows exact carbon savings and farmers supported."
    }
  ];

  const impact = [
    { metric: "2,500 tons", label: "CO₂ Emissions Avoided (Annual)" },
    { metric: "50,000+", label: "Farmers Supported" },
    { metric: "100 Million+", label: "Plastic Bags Saved from Landfills" },
    { metric: "₹5 Crore+", label: "Additional Income for Farmers" }
  ];

  const practices = [
    {
      title: "Sustainable Farming Support",
      description: "We provide training and resources to farmers for adopting organic and sustainable farming practices. 70% of our partner farmers have transitioned to organic methods."
    },
    {
      title: "Water Conservation",
      description: "Promoting drip irrigation and water-efficient farming techniques. Our initiatives have saved 50 million liters of water annually."
    },
    {
      title: "Soil Health",
      description: "Encouraging crop rotation and cover cropping to maintain soil health. We supply organic fertilizers and conduct soil testing for partner farmers."
    },
    {
      title: "Biodiversity",
      description: "Supporting farmers in maintaining diverse crop varieties and native seeds. We help preserve agricultural biodiversity and ensure food security."
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
          Sustainability at Agrova
        </h1>
        <p className="text-xl text-forest-700 dark:text-forest-300">
          Building a more sustainable future, one farm and one delivery at a time
        </p>
      </motion.div>

      {/* Core Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 space-y-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100">
            Sustainability is Our Foundation
          </h2>
          <p className="text-lg text-forest-700 dark:text-forest-300 leading-relaxed">
            Every decision at Agrova is guided by our commitment to sustainability. From how we source produce to how we deliver it, we minimize environmental impact while maximizing positive social impact. Sustainability isn't just an initiative for us—it's core to who we are.
          </p>
        </Card>
      </motion.div>

      {/* Impact Numbers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-6">
          Our Impact So Far
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {impact.map((item, idx) => (
            <Card key={idx} className="p-6 text-center bg-green-50 dark:bg-green-900/20">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {item.metric}
              </div>
              <div className="text-sm text-forest-600 dark:text-forest-400">
                {item.label}
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Sustainability Initiatives */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-6">
          Our Key Initiatives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initiatives.map((init, idx) => {
            const Icon = init.icon;
            return (
              <Card key={idx} className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <Icon className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-forest-800 dark:text-forest-100">
                      {init.title}
                    </h3>
                    <p className="text-forest-700 dark:text-forest-300 mt-2">
                      {init.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Sustainable Farming Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-6">
          Supporting Sustainable Farming
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practices.map((practice, idx) => (
            <Card key={idx} className="p-6 space-y-3">
              <h3 className="text-lg font-semibold text-forest-800 dark:text-forest-100">
                {practice.title}
              </h3>
              <p className="text-forest-700 dark:text-forest-300">
                {practice.description}
              </p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Carbon Footprint Reduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-8 space-y-4">
          <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-4">
            How We Reduce Carbon Footprint
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-green-200 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-700 dark:text-green-300 text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-forest-800 dark:text-forest-100 mb-1">
                  Local Sourcing (50-100 km radius)
                </h3>
                <p className="text-forest-700 dark:text-forest-300">
                  Average transportation distance is 75 km compared to 1,500 km for traditional supply chains
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-green-200 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-700 dark:text-green-300 text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-forest-800 dark:text-forest-100 mb-1">
                  Optimized Delivery Routes
                </h3>
                <p className="text-forest-700 dark:text-forest-300">
                  AI-powered routing reduces fuel consumption by 30% compared to standard delivery services
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-green-200 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-700 dark:text-green-300 text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-forest-800 dark:text-forest-100 mb-1">
                  Renewable Energy Operations
                </h3>
                <p className="text-forest-700 dark:text-forest-300">
                  70% of operations powered by solar energy with plans for 100% renewable by 2025
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-green-200 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-700 dark:text-green-300 text-sm font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-forest-800 dark:text-forest-100 mb-1">
                  Zero-Waste Packaging
                </h3>
                <p className="text-forest-700 dark:text-forest-300">
                  100% biodegradable packaging eliminates plastic waste and reduces landfill impact
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-8 bg-emerald-700 dark:bg-emerald-800 text-white text-center space-y-4">
          <h2 className="text-2xl font-bold">Make a Sustainable Choice</h2>
          <p className="text-emerald-100">
            Every purchase supports sustainable farming practices and reduces environmental impact. Join us in building a greener future.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <a href="/products" className="px-6 py-2 bg-white text-emerald-700 hover:bg-emerald-50 rounded-lg font-semibold transition">
              Browse Products
            </a>
            <a href="/about" className="px-6 py-2 bg-transparent border-2 border-white hover:bg-white hover:text-emerald-800 rounded-lg font-semibold transition">
              Learn About Us
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SustainabilityPage;

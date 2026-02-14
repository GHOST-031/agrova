import React from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import Card from "../components/ui/Card";

const FAQPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="p-12 text-center space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <HelpCircle className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-forest-800 dark:text-forest-100">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-forest-700 dark:text-forest-300">
            Demo site - FAQ not available
          </p>
          <p className="text-forest-600 dark:text-forest-400 max-w-md mx-auto">
            This is a demonstration site. Full FAQ section will be available in the production version.
          </p>
          <div className="pt-6">
            <a 
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Return to Home
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default FAQPage;

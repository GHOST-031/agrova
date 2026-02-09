import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-forest-50 dark:bg-forest-950">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-forest-600 dark:text-forest-400 animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium text-forest-700 dark:text-forest-300">
          Loading your data...
        </p>
        <p className="text-sm text-forest-600 dark:text-forest-400 mt-2">
          Please wait a moment
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;

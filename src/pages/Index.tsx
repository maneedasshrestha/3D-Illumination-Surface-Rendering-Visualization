
import React, { useState, useEffect } from 'react';
import ShapeGrid from '@/components/ShapeGrid';
import LoadingTransition from '@/components/LoadingTransition';

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingTransition isLoading={isLoading}>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block animate-fade-in">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Interactive Demo</span>
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Surface Illumination
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Explore different rendering techniques and lighting models with interactive 3D shapes.
            </p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <ShapeGrid />
          </div>
        </div>
      </div>
    </LoadingTransition>
  );
};

export default Index;

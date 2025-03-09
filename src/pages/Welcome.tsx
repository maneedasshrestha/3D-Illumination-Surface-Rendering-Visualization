
import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingTransition from '@/components/LoadingTransition';

// Main welcome page component
const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  
  const handleGetStarted = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/explore');
    }, 800); // Delay navigation to allow for exit animation
  };

  return (
    <div className={`fixed inset-0 bg-gradient-to-b from-slate-900 to-black
                     ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Background with animated stars */}
        <div className="absolute inset-0">
          <div className="h-full w-full">
            <div className="stars-container">
              {[...Array(200)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.8 + 0.2,
                    animation: `twinkle ${Math.random() * 5 + 2}s infinite ${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Animated glow sphere */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-96 w-96 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl animate-pulse" 
               style={{ animationDuration: '10s' }}>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className={`space-y-6 max-w-3xl ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`} 
             style={{ animationDelay: '0.2s' }}>
          {/* Rotating 3D logo effect */}
          <div className="mx-auto w-28 h-28 mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-rotate-slow opacity-80"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-rotate-slow opacity-80" 
                 style={{ animationDirection: 'reverse', animationDuration: '12s' }}></div>
            <div className="absolute inset-8 rounded-full bg-black"></div>
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Surface Illumination Explorer
          </h1>
          
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the fascinating world of 3D rendering techniques and surface illumination models through interactive visualizations.
          </p>
          
          <div className="mt-10">
            <Button 
              onClick={handleGetStarted}
              className="px-8 py-6 text-lg bg-white hover:bg-gray-200 text-black shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <span>Get Started</span>
              <Sparkles className="ml-2 w-5 h-5 group-hover:animate-pulse" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Add animation for twinkling stars */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Welcome;

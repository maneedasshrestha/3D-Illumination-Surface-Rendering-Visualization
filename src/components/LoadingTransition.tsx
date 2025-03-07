
import React, { useEffect, useState } from 'react';

interface LoadingTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoadingTransition: React.FC<LoadingTransitionProps> = ({ isLoading, children }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading && showLoader) {
      const loaderTimer = setTimeout(() => {
        setShowLoader(false);
        setShowContent(true);
      }, 600);
      
      return () => clearTimeout(loaderTimer);
    }
  }, [isLoading, showLoader]);

  return (
    <>
      {showLoader && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full border-4 border-gray-200 border-t-gray-800 animate-spin"></div>
            <p className="mt-4 text-gray-600 animate-pulse">Loading</p>
          </div>
        </div>
      )}
      <div className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </>
  );
};

export default LoadingTransition;

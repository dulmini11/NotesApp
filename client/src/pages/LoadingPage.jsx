import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import NotePad from '../assets/leafpad.mp4';

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/40 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
      {/* Video Container */}
      <div className="relative group">
        <div className="relative rounded-3xl overflow-hidden w-[400px] h-[400px] flex items-center justify-center">
          <video
            src={NotePad}
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            className="w-full h-full object-cover"
          >
            <source src="/src/assets/leafpad.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

        {/* Loading Text */}
        <div className="text-center space-y-4">
          <div className="flex items-center gap-3 justify-center">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-900 bg-clip-text text-transparent">
              Loading Notes
            </h1>
          </div>
          <p className="text-green-700/70 font-medium text-lg">
            Preparing your workspace...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 space-y-2">
          <div className="w-full h-3 bg-green-100/20 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-900 rounded-full transition-all duration-300 ease-out shadow-lg relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
            </div>
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-semibold text-green-600">{progress}%</span>
            <span className="text-xs text-green-500 font-medium">Almost there...</span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-green-700 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-green-900 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
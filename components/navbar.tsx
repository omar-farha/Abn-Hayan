"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/15 backdrop-blur-xl border-b border-blue-500/30 shadow-lg shadow-blue-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="text-gray-300 text-lg font-medium ml-2">مستر/ </div>
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 font-mono">
              سامح حيان
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3 space-x-reverse">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0fd8d7] to-white bg-clip-text text-transparent">
                Abn Hayan
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="h-1 bg-gray-800/50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 transition-all duration-150 ease-out shadow-lg shadow-blue-500/50"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // ✅ Check if user has scrolled beyond 100vh
      if (window.scrollY >= window.innerHeight) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // استخدم useEffect لإغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest("nav")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);
  // أغلق القائمة عند التمرير
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [scrolled]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-blue-500/30 shadow-lg shadow-blue-500/10 transition-colors duration-300
  ${
    scrolled ? "bg-gradient-to-br from-blue-950 to-slate-900 " : "bg-black/15"
  }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between flex-row-reverse items-center h-fit py-2">
          {/* الشعار */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3 space-x-reverse">
              <img
                src="/logo22.png"
                alt="logo"
                className="w-[115px] h-[73px] transition-all duration-300"
              />
            </div>
          </div>

          {/* الأزرار - تظهر على الشاشات المتوسطة والكبيرة */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <button
              className="relative overflow-hidden px-4 py-2 rounded-xl border-2 border-cyan-500 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg transition-all hover:from-transparent hover:to-transparent duration-300 hover:scale-105"
              onClick={() => {
                const section = document.getElementById("th3");
                section?.scrollIntoView({ behavior: "smooth" }); // scroll
              }}
            >
              <span className="relative z-10">ابدأ التعلم 📚</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <Link href="https://wa.me/201141412551">
              <button className="relative px-4 py-2 rounded-xl border-2 border-cyan-500 text-cyan-400 font-semibold shadow-md transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:scale-105">
                الدعم الفني 💬
              </button>
            </Link>
          </div>

          {/* قائمة هامبرجر للشاشات الصغيرة */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg   text-white focus:outline-none focus:ring-2 transition-all duration-300 h"
              aria-label="فتح القائمة"
            >
              {/* أيقونة القائمة مع animation */}
              <div className="w-6 h-6 relative">
                <span
                  className={`absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 bg-white transition-all duration-300 ${
                    isMenuOpen ? "rotate-45" : "-translate-y-2"
                  }`}
                ></span>
                <span
                  className={`absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 bg-white transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 bg-white transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45" : "translate-y-2"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* القائمة المنبثقة للشاشات الصغيرة مع animation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-4 pb-4 border-t border-blue-500/30 pt-4">
            <div className="flex flex-col space-y-3">
              <button
                className="w-full text-center py-3 rounded-xl border-2 border-cyan-500 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  setIsMenuOpen(false); // close menu
                  const section = document.getElementById("th3");
                  section?.scrollIntoView({ behavior: "smooth" }); // scroll
                }}
              >
                ابدأ التعلم 📚
              </button>
              <Link href="https://wa.me/201141412551">
                <button
                  className="w-full text-center py-3 rounded-xl border-2 border-cyan-500 text-cyan-400 font-semibold shadow-md transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white transform hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  الدعم الفني 💬
                </button>
              </Link>
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

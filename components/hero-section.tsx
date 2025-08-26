"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-black pt-20">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        </div>

        {/* {mounted && (
          <>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </>
        )} */}

        <div className="absolute top-1/4 left-1/4 w-64 h-64 opacity-30">
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping"></div>
          <div className="absolute inset-4 rounded-full border border-cyan-300 animate-pulse"></div>
        </div>

        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 opacity-20">
          <div
            className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute inset-6 rounded-full border border-blue-300 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full border border-blue-500/20 rounded-full animate-spin-slow"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full border border-cyan-500/20 rounded-full animate-spin-slow-reverse"></div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent animate-pulse">
              Physics
            </span>
            <span className="text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-glow">
              {" "}
              Society
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-sans">
            منصة هتحببك وتميزك في الفيزياء مع
          </p>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed font-sans">
            م/ سامح حيان
          </p>

          <div className="relative inline-block">
            <Button
              size="lg"
              onClick={() => {
                const section = document.getElementById("th3");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative z-50 cursor-pointer px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]"
            >
              <span className="relative z-10">المحاضرات</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-cyan-400/20 animate-pulse"></div>
            </Button>
            <div className="absolute inset-0 rounded-lg border-2 border-blue-400/30 animate-ping"></div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { number: "كتاب", label: "شرح و حل اكثر من" },
              { number: "+200", label: "طالب" },
              { number: "24/7", label: "دعم فني" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>
  );
}

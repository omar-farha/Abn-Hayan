"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GradesSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <section
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-black pt-20"
      id="th3"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        </div>

        {mounted && (
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
        )}

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
            الصفوف الدراسية
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            نظمتهالك يا مديقي
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        <div className="flex justify-center">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/einstein-teacher-lab.png"
                  alt="Einstein والمعلم في المختبر"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  2026
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  الصف الدراسي الثالث
                </h3>
                <div className="w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-4"></div>
                <p className="text-gray-600 text-center mb-6">
                  جميع كورسات الصف الثالث الثانوي
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">عدد الدروس</span>
                    <span className="font-semibold text-blue-600">45 درس</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">المدة</span>
                    <span className="font-semibold text-blue-600">9 أشهر</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">المستوى</span>
                    <span className="font-semibold text-blue-600">متقدم</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
                  ابدأ التعلم الآن
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

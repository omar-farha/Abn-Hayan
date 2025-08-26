"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AccessCodeModal } from "@/components/access-code-modal";
import { UserDashboard } from "@/components/user-dashboard";
import { BarChart3, ChevronDown, Loader2 } from "lucide-react";
import {
  accessCodeService,
  userProgressService,
  courseService,
} from "@/lib/database";
import HeroSection from "@/components/hero-section";
import TeacherSection from "@/components/teacher-section";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [userCode, setUserCode] = useState<string>("");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [customerName, setCustomerName] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isAuthenticated]);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const savedCode = localStorage.getItem("access_code");
        if (savedCode) {
          // Verify the code is still valid
          const validCode = await accessCodeService.findByCode(savedCode);
          if (validCode && validCode.is_active) {
            setIsAuthenticated(true);
            setUserCode(savedCode);
            setCustomerName(validCode.customer_name); // ✅ Save name
            // Update user tracking
            await updateUserTracking(savedCode, "login");
          } else {
            localStorage.removeItem("access_code");
          }
        }

        // Load courses
        const coursesData = await courseService.getAll();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, []);

  const updateUserTracking = async (
    userCode: string,
    action: string,
    courseId?: string,
    sessionId?: string
  ) => {
    try {
      // Get existing progress or create new
      let existingProgress = await userProgressService.findByUserCode(userCode);

      if (!existingProgress) {
        // Get user info from access code
        const accessCode = await accessCodeService.findByCode(userCode);

        existingProgress = {
          user_code: userCode,
          customer_name: accessCode?.customer_name || "Unknown",
          completed_sessions: [],
          last_activity: new Date().toISOString(),
          current_course: courseId,
          current_session: sessionId,
          login_count: 0,
        };
      }

      // Update progress
      const updatedProgress = {
        ...existingProgress,
        last_activity: new Date().toISOString(),
        login_count:
          action === "login"
            ? existingProgress.login_count + 1
            : existingProgress.login_count,
        current_course: courseId || existingProgress.current_course,
        current_session: sessionId || existingProgress.current_session,
      };

      await userProgressService.upsert(updatedProgress);
    } catch (error) {
      console.error("Error updating user tracking:", error);
    }
  };

  const handleAccessGranted = async (code: string) => {
    setIsAuthenticated(true);
    setUserCode(code);
    setShowAccessModal(false);
    localStorage.setItem("access_code", code);
    const accessCode = await accessCodeService.findByCode(code);
    if (accessCode) {
      setCustomerName(accessCode.customer_name); // ✅ Save name
    }
    await updateUserTracking(code, "login");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_code");
    setIsAuthenticated(false);
    setUserCode("");
  };
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-black text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-white">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen text-gray-900">
        <Navbar />
        <HeroSection />
        <TeacherSection />
        <section
          className="relative bg-gradient-to-br from-blue-950 via-slate-900 to-black py-20 overflow-hidden"
          id="th3"
        >
          {/* === Physics Decorations (Many Shapes) === */}

          {/* Atoms */}
          {/* <svg
            className="absolute top-8 left-8 w-24 h-24 text-blue-300"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="5" className="fill-current" />
            <ellipse
              cx="50"
              cy="50"
              rx="38"
              ry="16"
              className="stroke-current"
              strokeWidth="2"
            />
            <ellipse
              cx="50"
              cy="50"
              rx="16"
              ry="38"
              className="stroke-current"
              strokeWidth="2"
              transform="rotate(30 50 50)"
            />
            <ellipse
              cx="50"
              cy="50"
              rx="16"
              ry="38"
              className="stroke-current"
              strokeWidth="2"
              transform="rotate(-30 50 50)"
            />
          </svg>
          <svg
            className="absolute bottom-12 right-12 w-32 h-32 text-cyan-400"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="5" className="fill-current" />
            <ellipse
              cx="50"
              cy="50"
              rx="38"
              ry="16"
              className="stroke-current"
              strokeWidth="2"
            />
            <ellipse
              cx="50"
              cy="50"
              rx="16"
              ry="38"
              className="stroke-current"
              strokeWidth="2"
              transform="rotate(30 50 50)"
            />
            <ellipse
              cx="50"
              cy="50"
              rx="16"
              ry="38"
              className="stroke-current"
              strokeWidth="2"
              transform="rotate(-30 50 50)"
            />
          </svg> */}
          <img
            src="/science.png"
            alt="atom"
            className="absolute top-8 left-8 w-24 h-24 text-blue-300"
          />

          {/* Multiple Sine Waves */}
          <svg
            className="absolute top-1/3 left-0 w-[500px] h-16 text-blue-400"
            viewBox="0 0 520 64"
            fill="none"
          >
            <path
              d="M0 32 C 40 0, 80 64, 120 32 S 200 0, 240 32 320 64, 360 32 440 0, 480 32 520 64, 560 32"
              className="stroke-current"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="absolute bottom-1/4 right-0 w-[500px] h-16 text-cyan-400"
            viewBox="0 0 520 64"
            fill="none"
          >
            <path
              d="M0 32 C 40 0, 80 64, 120 32 S 200 0, 240 32 320 64, 360 32 440 0, 480 32 520 64, 560 32"
              className="stroke-current"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Circuit sparks */}
          <svg
            className="absolute top-20 right-1/4 w-28 h-28 text-blue-500"
            viewBox="0 0 160 160"
            fill="none"
          >
            <circle cx="20" cy="80" r="6" className="fill-current" />
            <circle cx="140" cy="80" r="6" className="fill-current" />
            <path
              d="M26 80 H70 L90 40 L110 120 H134"
              className="stroke-current"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="absolute bottom-32 left-1/4 w-28 h-28 text-cyan-500"
            viewBox="0 0 160 160"
            fill="none"
          >
            <circle cx="20" cy="80" r="6" className="fill-current" />
            <circle cx="140" cy="80" r="6" className="fill-current" />
            <path
              d="M26 80 H70 L90 40 L110 120 H134"
              className="stroke-current"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* Physics equations */}
          <span className="absolute top-12 left-1/3 font-mono text-blue-500/50 text-xl select-none">
            E = mc²
          </span>
          <span className="absolute top-1/2 right-1/4 font-mono text-cyan-600/50 text-lg rotate-6 select-none">
            F = ma
          </span>
          <span className="absolute bottom-20 left-16 font-mono text-slate-600/50 text-base -rotate-6 select-none">
            ΔV = I R
          </span>
          <span className="absolute bottom-40 right-1/2 font-mono text-blue-400/50 text-lg rotate-3 select-none">
            p = mv
          </span>
          <span className="absolute top-40 right-10 font-mono text-cyan-500/50 text-base -rotate-12 select-none">
            KE = ½mv²
          </span>

          {/* === Your content (card) === */}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                الصفوف الدراسية
              </span>
              <h2 className="text-4xl  text-white mb-4 font-bold ">
                نظمتهالك يا صديقي
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            </div>

            <div className="flex justify-center">
              <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src="/Whisk_810050996c.jpg"
                      // src="/einstein-teacher-lab.png"
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
                      الصف الثالث الثانوي
                    </h3>
                    <div className="w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-4"></div>
                    {/* <p className="text-gray-600 text-center mb-6">
                      جميع كورسات الصف الثالث الثانوي
                    </p> */}

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">عدد الدروس</span>
                        <span className="font-semibold text-blue-600">
                          8 شباتر
                        </span>
                      </div>
                      {/* <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">المدة</span>
                        <span className="font-semibold text-blue-600">
                          9 أشهر
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">المستوى</span>
                        <span className="font-semibold text-blue-600">
                          متقدم
                        </span>
                      </div> */}
                    </div>

                    <Button
                      onClick={() => setShowAccessModal(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      ابدأ التعلم الآن
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Admin Access */}
        {/* <Link
          href="/admin"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          المدير
          </Link> */}

        <Footer />
        <AccessCodeModal
          isOpen={showAccessModal}
          onClose={() => setShowAccessModal(false)}
          onAccessGranted={handleAccessGranted}
        />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-slate-900 to-black text-gray-900 overflow-hidden">
        {/* Animated background gradient */}
        <div className="relative z-10">
          {/* Header */}
          {/* <header className="border-b border-blue-200/50 backdrop-blur-sm bg-white/20">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600 animate-fade-in-up font-serif">
              أكاديمية الفيزياء
            </h1>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => setShowUserDashboard(true)}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <BarChart3 className="w-4 h-4 ml-2" />
                تقدمي
              </button>
              <span className="text-sm text-gray-500">الكود: {userCode}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                تسجيل خروج
              </button>
            </div>
          </div>
        </header> */}

          <nav className="fixed top-0 left-0 right-0 z-50 bg-black/15 backdrop:blur-sm border-b border-blue-500/30 shadow-lg shadow-blue-500/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {/* <button
                  onClick={() => setShowUserDashboard(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 ml-2" />
                  تقدمي
                </button> */}
                  <span className="text-sm text-gray-500">الطالب:</span>
                  <span className="text-sm text-white">{customerName}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    تسجيل خروج
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
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
          {/* Hero Section */}

          <div className="min-h-screen relative overflow-hidden  pt-20">
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

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent animate-pulse">
                    أهلاً وسهلاً بك يا
                  </span>
                  <br />
                </h1>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-glow">
                    {customerName}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-sans">
                  الصف الثالث ثانوي
                </p>

                {/* سهم متحرك للنزول */}
                <div
                  className="mt-16 flex justify-center cursor-pointer"
                  onClick={() => {
                    const section = document.getElementById("chapters");
                    section?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <ChevronDown className="w-12 h-12 text-blue-400 animate-bounce" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Courses Section */}
          <section
            className="relative container mx-auto px-4 py-20 bg-white overflow-hidden "
            id="chapters"
          >
            {/* <img
              src="/magnetic.png"
              alt="atom"
              className="absolute top-8 left-12 w-24 h-24 text-blue-300/30"
            />
            <img
              src="/electrical-circuit.png"
              alt="atom"
              className="absolute bottom-12 right-12 w-32 h-32 text-cyan-400/30"
            />
            <svg
              className="absolute top-1/3 left-0 w-[500px] h-16 text-blue-400"
              viewBox="0 0 520 64"
              fill="none"
            >
              <path
                d="M0 32 C 40 0, 80 64, 120 32 S 200 0, 240 32 320 64, 360 32 440 0, 480 32 520 64, 560 32"
                className="stroke-current"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <svg
              className="absolute bottom-1/4 right-0 w-[500px] h-16 text-cyan-400"
              viewBox="0 0 520 64"
              fill="none"
            >
              <path
                d="M0 32 C 40 0, 80 64, 120 32 S 200 0, 240 32 320 64, 360 32 440 0, 480 32 520 64, 560 32"
                className="stroke-current"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
     
            {[
              {
                eq: "E = mc²",
                top: "5%",
                left: "10%",
                rotate: "-5deg",
                color: "text-blue-500/50",
                size: "text-lg",
              },
              {
                eq: "F = ma",
                top: "12%",
                left: "40%",
                rotate: "4deg",
                color: "text-cyan-600/50",
                size: "text-xl",
              },
              {
                eq: "ΔV = I·R",
                top: "18%",
                left: "70%",
                rotate: "-3deg",
                color: "text-slate-600/50",
                size: "text-base",
              },
              {
                eq: "p = mv",
                top: "25%",
                left: "20%",
                rotate: "6deg",
                color: "text-blue-400/50",
                size: "text-lg",
              },
              {
                eq: "KE = ½mv²",
                top: "30%",
                left: "85%",
                rotate: "-8deg",
                color: "text-cyan-500/50",
                size: "text-base",
              },
              {
                eq: "W = F·d",
                top: "38%",
                left: "55%",
                rotate: "5deg",
                color: "text-indigo-500",
                size: "text-base",
              },
              {
                eq: "Q = mcΔT",
                top: "42%",
                left: "15%",
                rotate: "-6deg",
                color: "text-purple-500",
                size: "text-lg",
              },
              {
                eq: "λ = h/p",
                top: "50%",
                left: "65%",
                rotate: "10deg",
                color: "text-orange-500",
                size: "text-base",
              },
              {
                eq: "P = W/t",
                top: "55%",
                left: "30%",
                rotate: "-7deg",
                color: "text-sky-500",
                size: "text-lg",
              },
              {
                eq: "V = IR",
                top: "62%",
                left: "80%",
                rotate: "3deg",
                color: "text-blue-600",
                size: "text-lg",
              },

              {
                eq: "F = qE",
                top: "70%",
                left: "12%",
                rotate: "-4deg",
                color: "text-green-500",
                size: "text-base",
              },
              {
                eq: "pV = nRT",
                top: "75%",
                left: "45%",
                rotate: "6deg",
                color: "text-red-500",
                size: "text-lg",
              },
              {
                eq: "I = Q/t",
                top: "82%",
                left: "68%",
                rotate: "-5deg",
                color: "text-pink-500",
                size: "text-base",
              },
              {
                eq: "F = -kx",
                top: "88%",
                left: "25%",
                rotate: "7deg",
                color: "text-yellow-500",
                size: "text-lg",
              },
              {
                eq: "Ek = 3/2 kT",
                top: "94%",
                left: "75%",
                rotate: "-9deg",
                color: "text-purple-400",
                size: "text-base",
              },

              {
                eq: "ΔE = W + Q",
                top: "8%",
                left: "85%",
                rotate: "6deg",
                color: "text-blue-400",
                size: "text-lg",
              },
              {
                eq: "F = dp/dt",
                top: "15%",
                left: "55%",
                rotate: "-5deg",
                color: "text-orange-400",
                size: "text-base",
              },
              {
                eq: "P = IV",
                top: "22%",
                left: "28%",
                rotate: "7deg",
                color: "text-cyan-400",
                size: "text-lg",
              },
              {
                eq: "g = 9.8 m/s²",
                top: "35%",
                left: "75%",
                rotate: "-6deg",
                color: "text-indigo-400",
                size: "text-base",
              },
              {
                eq: "a = Δv/Δt",
                top: "47%",
                left: "5%",
                rotate: "8deg",
                color: "text-teal-400",
                size: "text-lg",
              },

              {
                eq: "s = ut + ½at²",
                top: "53%",
                left: "48%",
                rotate: "-4deg",
                color: "text-blue-300",
                size: "text-base",
              },
              {
                eq: "E = hf",
                top: "60%",
                left: "90%",
                rotate: "6deg",
                color: "text-orange-300",
                size: "text-lg",
              },
              {
                eq: "τ = r × F",
                top: "68%",
                left: "38%",
                rotate: "-5deg",
                color: "text-cyan-300",
                size: "text-base",
              },

              {
                eq: "f = 1/T",
                top: "58%",
                left: "82%",
                rotate: "-4deg",
                color: "text-pink-200",
                size: "text-lg",
              },
              {
                eq: "KE + PE = const",
                top: "66%",
                left: "35%",
                rotate: "8deg",
                color: "text-yellow-200",
                size: "text-base",
              },
              {
                eq: "σ = F/A",
                top: "72%",
                left: "60%",
                rotate: "-5deg",
                color: "text-purple-200",
                size: "text-lg",
              },
              {
                eq: "ω = 2πf",
                top: "85%",
                left: "40%",
                rotate: "7deg",
                color: "text-orange-200",
                size: "text-base",
              },
              {
                eq: "Ek = pc",
                top: "92%",
                left: "18%",
                rotate: "-6deg",
                color: "text-teal-200",
                size: "text-lg",
              },
            ].map((item, i) => (
              <span
                key={i}
                className={`absolute font-mono select-none ${item.color} ${item.size}`}
                style={{
                  top: item.top,
                  left: item.left,
                  transform: `rotate(${item.rotate})`,
                }}
              >
                {item.eq}
              </span>
            ))} */}
            <img
              src="/science.png"
              alt="atom"
              className="absolute top-8 left-8 w-24 h-24 text-blue-300"
            />

            {/* Multiple Sine Waves */}
            <svg
              className="absolute top-1/3 left-0 w-[500px] h-16 text-blue-400"
              viewBox="0 0 520 64"
              fill="none"
            >
              <path
                d="M0 32 C 40 0, 80 64, 120 32 S 200 0, 240 32 320 64, 360 32 440 0, 480 32 520 64, 560 32"
                className="stroke-current"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <svg
              className="absolute bottom-1/4 right-0 w-[500px] h-16 text-cyan-400"
              viewBox="0 0 520 64"
              fill="none"
            >
              <path
                d="M0 32 C 40 0, 80 64, 120 32 S 200 0, 240 32 320 64, 360 32 440 0, 480 32 520 64, 560 32"
                className="stroke-current"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* Circuit sparks */}
            <svg
              className="absolute top-20 right-1/4 w-28 h-28 text-blue-500"
              viewBox="0 0 160 160"
              fill="none"
            >
              <circle cx="20" cy="80" r="6" className="fill-current" />
              <circle cx="140" cy="80" r="6" className="fill-current" />
              <path
                d="M26 80 H70 L90 40 L110 120 H134"
                className="stroke-current"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <svg
              className="absolute bottom-32 left-1/4 w-28 h-28 text-cyan-500"
              viewBox="0 0 160 160"
              fill="none"
            >
              <circle cx="20" cy="80" r="6" className="fill-current" />
              <circle cx="140" cy="80" r="6" className="fill-current" />
              <path
                d="M26 80 H70 L90 40 L110 120 H134"
                className="stroke-current"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            {/* Physics equations */}
            <span className="absolute top-12 left-1/3 font-mono text-blue-500/50 text-xl select-none">
              E = mc²
            </span>
            <span className="absolute top-1/2 right-1/4 font-mono text-cyan-600/50 text-lg rotate-6 select-none">
              F = ma
            </span>
            <span className="absolute bottom-20 left-16 font-mono text-slate-600/50 text-base -rotate-6 select-none">
              ΔV = I R
            </span>
            <span className="absolute bottom-40 right-1/2 font-mono text-blue-400/50 text-lg rotate-3 select-none">
              p = mv
            </span>
            <span className="absolute top-40 right-10 font-mono text-cyan-500/50 text-base -rotate-12 select-none">
              KE = ½mv²
            </span>

            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                المنهج الدراسي
              </span>
              <h2 className="text-4xl font-bold text-black/90 mb-4">
                نظمتهالك يا صديقي
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4"
              dir="rtl"
            >
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    opacity: 0,
                    animation: "fadeInUp 0.6s forwards",
                  }}
                >
                  {/* Course Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={course.image || "/Ohm and Science in Nature.png"}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /> */}

                    {/* Session badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md text-left">
                        {course.sessions.length} Sessions
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 mb-3">
                      {course.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2 h-8">
                      {course.description}
                    </p>

                    {/* Progress section */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">التقدم</span>
                        <span className="text-xs text-blue-600 font-medium">
                          0%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Action button */}
                    <Link
                      href={`/courses/${course.id}`}
                      onClick={() =>
                        updateUserTracking(userCode, "course_access", course.id)
                      }
                      className="flex items-center justify-center gap-2 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2.5 rounded-lg transition-all duration-300 group/btn"
                    >
                      <span>ابدأ التعلم الآن</span>
                      <svg
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>

                  {/* Hover effect overlay */}
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50/20 group-hover:to-blue-100/20 transition-all duration-500 pointer-events-none rounded-2xl"></div> */}
                </div>
              ))}
            </div>
          </section>
        </div>

        <UserDashboard
          isOpen={showUserDashboard}
          onClose={() => setShowUserDashboard(false)}
          userCode={userCode}
        />
        <section
          className="relative container mx-auto px-4 py-20 overflow-hidden"
          id="chapters"
        >
          <img
            src="/science.png"
            alt="atom"
            className="absolute top-12 right-12 w-24 h-24 text-blue-300"
          />

          {/* Multiple Sine Waves */}
          <svg
            className="absolute top-1/4 right-0 w-[500px] h-16 text-blue-400"
            viewBox="0 0 520 64"
            fill="none"
          >
            <path
              d="M0 32 C 40 0, 80 64, 120 32 S 200 0, 240 32 320 64, 360 32 440 0, 480 32 520 64, 560 32"
              className="stroke-current"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="absolute bottom-1/3 left-0 w-[500px] h-16 text-cyan-400"
            viewBox="0 0 520 64"
            fill="none"
          >
            <path
              d="M0 32 C 40 0, 80 64, 120 32 S 200 0, 240 32 320 64, 360 32 440 0, 480 32 520 64, 560 32"
              className="stroke-current"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Circuit sparks */}
          <svg
            className="absolute bottom-16 right-1/4 w-28 h-28 text-blue-500"
            viewBox="0 0 160 160"
            fill="none"
          >
            <circle cx="20" cy="80" r="6" className="fill-current" />
            <circle cx="140" cy="80" r="6" className="fill-current" />
            <path
              d="M26 80 H70 L90 40 L110 120 H134"
              className="stroke-current"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="absolute top-24 left-1/4 w-28 h-28 text-cyan-500"
            viewBox="0 0 160 160"
            fill="none"
          >
            <circle cx="20" cy="80" r="6" className="fill-current" />
            <circle cx="140" cy="80" r="6" className="fill-current" />
            <path
              d="M26 80 H70 L90 40 L110 120 H134"
              className="stroke-current"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* Physics equations */}
          <span className="absolute top-20 left-20 font-mono text-blue-500/50 text-xl select-none">
            E = mc²
          </span>
          <span className="absolute bottom-24 right-1/3 font-mono text-cyan-600/50 text-lg rotate-6 select-none">
            F = ma
          </span>
          <span className="absolute top-1/2 left-1/3 font-mono text-slate-600/50 text-base -rotate-6 select-none">
            ΔV = I R
          </span>
          <span className="absolute bottom-40 left-1/2 font-mono text-blue-400/50 text-lg rotate-3 select-none">
            p = mv
          </span>
          <span className="absolute top-1/3 right-12 font-mono text-cyan-500/50 text-base -rotate-12 select-none">
            KE = ½mv²
          </span>

          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                المنهج الدراسي
              </span>
              <h2 className="text-4xl font-bold text-white mb-4">
                حل الواجبات و الامتحانات
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Projects Card */}
              <div
                className="group relative bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-3xl p-8 border border-purple-200/60 hover:border-purple-400 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm"
                style={{ animationDelay: `${1000 + courses.length * 200}ms` }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200 rounded-full blur-2xl"></div>
                </div>

                {/* Icon */}
                <div className="relative mb-6">
                  <img
                    src="homework.png"
                    alt="HW-img"
                    className="text-5xl w-[50px] h-[50px] mb-2 group-hover:scale-110 transition-transform duration-500 animate-float"
                  />

                  <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-purple-700 group-hover:text-purple-800 transition-colors duration-300">
                  فيديوهات حل الواجبات
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  مشاهدة فيديوهات شرح تفصيلية لحل الواجب خطوة بخطوة لتبسيط الفهم
                  وتوضيح الأفكار.
                </p>

                {/* Badge */}
                <div className="mb-8">
                  <span className="inline-flex items-center text-sm text-purple-700 bg-purple-100/80 px-3 py-1.5 rounded-full border border-purple-200/50">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    تطبيق و حل
                  </span>
                </div>

                {/* Button */}
                <Link
                  href="/projects"
                  className="relative inline-flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3.5 px-6 rounded-xl overflow-hidden group/btn transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                >
                  <span className="relative z-10">عرض الفديوهات</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    className="w-5 h-5 mr-2 relative z-10 group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-purple-100/0 group-hover:from-purple-50/20 group-hover:to-purple-100/20 transition-all duration-500 pointer-events-none rounded-3xl"></div>
              </div>

              {/* Exams Card */}
              <div
                className="group relative bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-3xl p-8 border border-orange-200/60 hover:border-orange-400 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 backdrop-blur-sm"
                style={{
                  animationDelay: `${1000 + (courses.length + 1) * 200}ms`,
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200 rounded-full blur-2xl"></div>
                </div>

                {/* Icon */}
                <div className="relative mb-6">
                  <img
                    src="exam.png"
                    alt="img"
                    className="text-5xl w-[50px] h-[50px] mb-2 group-hover:scale-110 transition-transform duration-500 animate-float"
                  />

                  <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-orange-700 group-hover:text-orange-800 transition-colors duration-300">
                  الامتحانات
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  اختبر معرفتك بامتحانات شاملة. تتبع تقدمك
                </p>

                {/* Badge */}
                <div className="mb-8">
                  <span className="inline-flex items-center text-sm text-orange-700 bg-orange-100/80 px-3 py-1.5 rounded-full border border-orange-200/50">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    اختبار
                  </span>
                </div>

                {/* Button */}
                <Link
                  href="/exams"
                  className="relative inline-flex items-center justify-center w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold py-3.5 px-6 rounded-xl overflow-hidden group/btn transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
                >
                  <span className="relative z-10">خوض الامتحانات</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-orange-800 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    className="w-5 h-5 mr-2 relative z-10 group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-100/0 group-hover:from-orange-50/20 group-hover:to-orange-100/20 transition-all duration-500 pointer-events-none rounded-3xl"></div>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        {/* <section className="container mx-auto px-4 py-20 border-t border-blue-200/50">
          <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto text-center">
            {[
              {
                icon: "🎥",
                title: "دروس فيديو",
                desc: "تعلم من خلال دروس فيديو شاملة",
              },
              {
                icon: "📝",
                title: "واجبات",
                desc: "تدرب مع تمارين عملية في الفيزياء",
              },
              {
                icon: "🚀",
                title: "مشاريع حقيقية",
                desc: "ابني محاكيات وتطبيقات فيزيائية",
              },
              {
                icon: "📊",
                title: "تتبع التقدم",
                desc: "راقب رحلة التعلم الخاصة بك",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`group animate-fade-in-up`}
                style={{ animationDelay: `${1800 + index * 200}ms` }}
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-blue-600 group-hover:text-blue-700 transition-colors duration-300 font-serif">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section> */}
      </div>

      <Footer />
    </>
  );
}

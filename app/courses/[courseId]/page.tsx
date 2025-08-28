"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Play, Clock, BookOpen, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/navbar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Session {
  id: string;
  title: string;
  description: string;
  content: string;
  assignment: string;
  tasks: string[];
  video_url: string | null;
  order_index: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  sessions: Session[];
}

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

// Helper function to validate URLs
const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function CoursePage({ params }: CoursePageProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const validateAccessAndFetchCourse = async () => {
      try {
        setLoading(true);

        // 1. Check if access code exists in localStorage
        const accessCode = localStorage.getItem("access_code");

        if (!accessCode) {
          console.log("No access code found");
          router.push("/");
          return;
        }

        // 2. Verify the access code is valid and active
        const { data: accessData, error: accessError } = await supabase
          .from("access_codes")
          .select("*")
          .eq("code", accessCode)
          .eq("is_active", true)
          .single();

        if (!accessData || accessError) {
          console.error("Invalid or inactive access code:", accessError);
          router.push("/");
          return;
        }

        // 3. Fetch course data
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select(
            `
            id, 
            title, 
            description, 
            icon, 
            sessions (
              id,
              title,
              description,
              content,
              assignment,
              tasks,
              video_url,
              order_index
            )
          `
          )
          .eq("id", params.courseId)
          .single();

        if (courseError || !courseData) {
          console.error("Course fetch failed:", courseError);
          router.push("/courses");
          return;
        }

        // Sort sessions by order_index
        const sortedSessions = [...courseData.sessions].sort(
          (a, b) => a.order_index - b.order_index
        );

        setCourse({
          ...courseData,
          sessions: sortedSessions,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Unexpected error:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    validateAccessAndFetchCourse();
  }, [params.courseId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-black text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12  mx-auto mb-4 text-white" />
          <p className="text-white">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // The router will handle the redirect
    return null;
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Course not found.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-black pt-20"
      dir="ltr"
      lang="en"
    >
      {/* <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,197,253,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,253,0.15)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div> */}
      {/* Animated background */}
      {/* <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black animate-gradient-shift"></div> */}
      {/* <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(15,216,215,0.1),transparent_50%)] animate-pulse-slow"></div> */}
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
      <div className="relative z-10">
        {/* Header */}
        <div dir="rtl">
          <Navbar />
        </div>
        <div className="px-5 md:px-7 lg:px-12">
          <div className="container mx-auto  py-8">
            <Link
              href="/"
              className="inline-flex items-center text-[#0fd8d7] hover:text-[#0bc5c4] mb-8 transition-all duration-300 hover:transform hover:translate-x-1 animate-fade-in-up animation-delay-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>

            <div className="mb-16 animate-fade-in-up animation-delay-400">
              <div className="flex items-center mb-6">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-[#0fd8d7] to-white bg-clip-text text-transparent text-left">
                  {course.description}
                </h1>
              </div>
              <p className="text-xl text-gray-300 mb-8 max-w-4xl leading-relaxed text-left">
                {course.title}
              </p>
              <div className="flex items-center text-gray-400 bg-gray-900/50 rounded-lg px-4 py-2 w-fit backdrop-blur-sm">
                <Clock className="w-5 h-5 mr-2 text-[#0fd8d7]" />
                <span>{course.sessions.length} Sessions</span>
              </div>
            </div>

            <div className="max-w-5xl">
              <h2 className="text-3xl font-bold mb-12 text-white text-left">
                Sessions
              </h2>
              <div className="space-y-6">
                {course.sessions.map((session, index) => (
                  <div
                    key={session.id}
                    className={`group bg-gradient-to-r from-gray-900/80 to-gray-800/40 rounded-xl p-6 border border-gray-700/50 hover:border-[#0fd8d7]/50 transition-all duration-500 hover:transform hover:translate-x-2 hover:shadow-xl hover:shadow-[#0fd8d7]/20 backdrop-blur-sm animate-fade-in-up`}
                    style={{ animationDelay: `${800 + index * 100}ms` }}
                  >
                    <Link href={`/courses/${course.id}/sessions/${session.id}`}>
                      <div className="flex items-center justify-between text-left">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-[#0fd8d7] to-[#0bc5c4] text-black rounded-full w-12 h-12 flex items-center justify-center font-bold mr-6 group-hover:scale-110 transition-transform duration-300">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#0fd8d7] transition-colors duration-300">
                              {session.title}
                            </h3>
                            <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                              {session.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <BookOpen className="w-5 h-5 text-gray-500 group-hover:text-[#0fd8d7] transition-colors duration-300" />
                          <Play className="w-6 h-6 text-[#0fd8d7] group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>

                    {/* Video preview if available */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Circle, Loader2, Play } from "lucide-react";
import {
  accessCodeService,
  courseService,
  sessionProgressService,
  userProgressService,
} from "@/lib/database";
import Navbar from "@/components/navbar";

interface SessionPageProps {
  params: {
    courseId: string;
    sessionId: string;
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  sessions: Session[];
}

interface Session {
  id: string;
  title: string;
  description: string;
  content: string;
  assignment: string;
  tasks?: string[];
  video_url?: string;
  order_index: number;
}

export default function SessionPage({ params }: SessionPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const [userCode, setUserCode] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const updateUserTracking = async (
    userCode: string,
    action: string,
    courseId?: string,
    sessionId?: string
  ) => {
    try {
      let existingProgress = await userProgressService.findByUserCode(userCode);

      if (!existingProgress) {
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

      const updatedProgress = {
        ...existingProgress,
        last_activity: new Date().toISOString(),
        current_course: courseId || existingProgress.current_course,
        current_session: sessionId || existingProgress.current_session,
      };

      await userProgressService.upsert(updatedProgress);
    } catch (error) {
      console.error("Error updating user tracking:", error);
    }
  };

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        setIsLoading(true);

        // Check authentication
        const savedCode = localStorage.getItem("access_code");
        if (!savedCode) {
          redirect("/");
          return;
        }

        const accessCode = await accessCodeService.findByCode(savedCode);
        if (!accessCode || !accessCode.is_active) {
          localStorage.removeItem("access_code");
          redirect("/");
          return;
        }

        setUserCode(savedCode);
        setIsAuthenticated(true);

        // Load course and session data
        const courses = await courseService.getAll();
        const courseData = courses.find((c) => c.id === params.courseId);

        if (!courseData) {
          notFound();
          return;
        }

        const sessionData = courseData.sessions.find(
          (s) => s.id === params.sessionId
        );
        if (!sessionData) {
          notFound();
          return;
        }

        setCourse(courseData);
        setSession(sessionData);

        // Load session progress
        const sessionProgress =
          await sessionProgressService.findByUserAndSession(
            savedCode,
            params.courseId,
            params.sessionId
          );

        if (sessionProgress) {
          setCompletedTasks(sessionProgress.completed_tasks);
          setIsSessionCompleted(sessionProgress.is_completed);
        }

        // Update user tracking
        await updateUserTracking(
          savedCode,
          "session_access",
          params.courseId,
          params.sessionId
        );
      } catch (error) {
        console.error("Error loading session:", error);
        redirect("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [params.courseId, params.sessionId]);

  const toggleTask = async (task: string) => {
    if (!userCode) return;

    let updatedTasks: string[];
    if (completedTasks.includes(task)) {
      updatedTasks = completedTasks.filter((t) => t !== task);
    } else {
      updatedTasks = [...completedTasks, task];
    }

    setCompletedTasks(updatedTasks);

    try {
      await sessionProgressService.upsert({
        user_code: userCode,
        course_id: params.courseId,
        session_id: params.sessionId,
        completed_tasks: updatedTasks,
        is_completed: isSessionCompleted,
      });
    } catch (error) {
      console.error("Error updating task progress:", error);
    }
  };

  const markSessionComplete = async () => {
    if (!userCode) return;

    try {
      // Mark session as completed
      await sessionProgressService.upsert({
        user_code: userCode,
        course_id: params.courseId,
        session_id: params.sessionId,
        completed_tasks: completedTasks,
        is_completed: true,
      });

      setIsSessionCompleted(true);

      // Update user progress with completed session
      const existingProgress = await userProgressService.findByUserCode(
        userCode
      );
      if (existingProgress) {
        const sessionIdentifier = `${params.courseId}-${params.sessionId}`;
        const updatedCompletedSessions =
          existingProgress.completed_sessions.includes(sessionIdentifier)
            ? existingProgress.completed_sessions
            : [...existingProgress.completed_sessions, sessionIdentifier];

        await userProgressService.upsert({
          ...existingProgress,
          completed_sessions: updatedCompletedSessions,
          last_activity: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error marking session complete:", error);
    }
  };

  const getEmbeddableVideoUrl = (url: string) => {
    if (url.includes("drive.google.com")) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be")
        ? url.split("/").pop()?.split("?")[0]
        : url.match(/[?&]v=([^&]+)/)?.[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-black text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12  mx-auto mb-4 text-white" />
          <p className="text-white">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!course || !session || !isAuthenticated) {
    notFound();
  }

  const currentSessionIndex = course.sessions.findIndex(
    (s) => s.id === params.sessionId
  );
  const remainingSessions = course.sessions.length - currentSessionIndex - 1;
  const embedUrl = session.video_url
    ? getEmbeddableVideoUrl(session.video_url)
    : "";
  const progressPercentage = session.tasks
    ? Math.round((completedTasks.length / session.tasks.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white overflow-x-hidden">
      {/* Animated background */}
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

      {/* <div className="absolute top-1/4 left-1/4 w-64 h-64 opacity-30">
        <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping"></div>
        <div className="absolute inset-4 rounded-full border border-cyan-300 animate-pulse"></div>
      </div> */}

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

      <div className="relative z-10">
        {/* Header */}
        <Navbar />

        <div className="container mx-auto py-8 px-4 md:px-7 lg:px-12">
          {/* Back Button */}
          <Link
            href={`/courses/${params.courseId}`}
            className="inline-flex items-center text-[#0fd8d7] hover:text-[#0bc5c4] mb-6 md:mb-8 transition-all duration-300 hover:transform hover:translate-x-1 animate-fade-in-up animation-delay-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {course.title}
          </Link>

          {/* Session Header */}
          <div
            className="mb-6 md:mb-8 animate-fade-in-up animation-delay-400 mt-10 md:mt-6"
            dir="ltr"
            lang="en"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-4">
              <div className="">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#0fd8d7] bg-clip-text text-transparent text-left">
                  {session.title}
                </h1>
                <p className="text-base md:text-xl text-gray-300 mb-4 md:mb-6 mt-2 leading-relaxed text-left">
                  {session.description}
                </p>
              </div>
              <button
                onClick={markSessionComplete}
                className={`flex items-center px-4 py-2 md:px-6 md:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 w-auto justify-center ${
                  isSessionCompleted
                    ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-lg shadow-green-500/30"
                    : "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                }`}
              >
                {isSessionCompleted ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <Circle className="w-5 h-5 mr-2" />
                )}
                {isSessionCompleted ? "Completed" : "Mark Complete"}
              </button>
            </div>

            {/* Progress Tracker */}
            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/40 rounded-xl p-4 md:p-6 border border-gray-700/50 backdrop-blur-sm animate-fade-in-up animation-delay-600">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2">
                <span className="text-[#0fd8d7] font-semibold flex items-center">
                  <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Progress
                </span>
                <span className="text-gray-400 text-sm md:text-base">
                  {remainingSessions} session
                  {remainingSessions !== 1 ? "s" : ""} remaining
                </span>
              </div>
              <div className="bg-gray-800 rounded-full h-2 md:h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#0fd8d7] to-[#0bc5c4] h-2 md:h-3 rounded-full transition-all duration-1000 ease-out animate-progress-fill"
                  style={{
                    width: `${
                      ((currentSessionIndex + 1) / course.sessions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="mt-2 text-xs md:text-sm text-gray-400">
                Session {currentSessionIndex + 1} of {course.sessions.length}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Video Section */}
            <div className="lg:col-span-2 animate-fade-in-up animation-delay-800">
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50 mb-6 md:mb-8 backdrop-blur-sm hover:border-[#0fd8d7]/30 transition-colors duration-500">
                <div className="h-48 sm:h-64 md:h-80 lg:h-[600px] bg-gradient-to-br from-gray-800 to-gray-900">
                  {session.video_url ? (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full rounded-t-xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={session.title}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full group cursor-pointer">
                      <div className="text-center group-hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl md:text-6xl mb-2 md:mb-4 animate-pulse">
                          🎥
                        </div>
                        <p className="text-gray-400 text-sm md:text-lg mb-1 md:mb-2">
                          No video available yet
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
                          Video will be added soon
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Session Button */}
              {!isSessionCompleted && (
                <button
                  onClick={markSessionComplete}
                  className="w-full bg-gradient-to-r from-[#0fd8d7] to-[#0bc5c4] text-black font-semibold py-3 md:py-4 px-4 md:px-6 rounded-xl hover:from-[#0bc5c4] hover:to-[#0fd8d7] transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#0fd8d7]/30 animate-fade-in-up animation-delay-1600"
                >
                  Mark as Complete
                </button>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4 md:space-y-6 animate-fade-in-up animation-delay-1000">
              {/* Tasks Checklist */}

              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-xl p-4 md:p-6 lg:p-8 border border-gray-700/50 backdrop-blur-sm">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-[#0fd8d7] flex items-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-[#0fd8d7] to-[#0bc5c4] rounded-lg flex items-center justify-center mr-2 md:mr-3 text-xs md:text-base">
                    📝
                  </div>
                  Assignment
                </h3>
                <div className="space-y-4 md:space-y-6">
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {session.assignment}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between mt-10 md:mt-16 pt-6 md:pt-8 border-t border-gray-800/50 animate-fade-in-up animation-delay-1400 gap-4 sm:gap-0">
            <div>
              {currentSessionIndex > 0 && (
                <Link
                  href={`/courses/${params.courseId}/sessions/${
                    course.sessions[currentSessionIndex - 1].id
                  }`}
                  className="inline-flex items-center justify-center text-[#0fd8d7] hover:text-[#0bc5c4] transition-all duration-300 hover:transform hover:translate-x-1 px-4 py-2 rounded-lg backdrop-blur-sm w-full sm:w-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous Session
                </Link>
              )}
            </div>
            <div>
              {currentSessionIndex < course.sessions.length - 1 && (
                <Link
                  href={`/courses/${params.courseId}/sessions/${
                    course.sessions[currentSessionIndex + 1].id
                  }`}
                  className="inline-flex items-center justify-center text-[#0fd8d7] hover:text-[#0bc5c4] transition-all duration-300 hover:transform hover:-translate-x-1 bg-gray-900/50 px-4 py-2 rounded-lg backdrop-blur-sm w-full sm:w-auto"
                >
                  Next Session
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

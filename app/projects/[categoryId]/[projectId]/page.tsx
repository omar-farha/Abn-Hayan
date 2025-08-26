"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  Star,
  Code,
  ExternalLink,
  CheckCircle,
  Circle,
  Play,
  Video,
  Loader2,
} from "lucide-react";
import {
  accessCodeService,
  projectService,
  projectProgressService,
} from "@/lib/database";
import Navbar from "@/components/navbar";

interface ProjectPageProps {
  params: {
    categoryId: string;
    projectId: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [completedRequirements, setCompletedRequirements] = useState<string[]>(
    []
  );
  const [userCode, setUserCode] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const checkAuthAndLoadProject = async () => {
      try {
        const savedCode = localStorage.getItem("access_code");
        if (!savedCode) {
          window.location.href = "/";
          return;
        }

        const validCode = await accessCodeService.findByCode(savedCode);
        if (!validCode || !validCode.is_active) {
          localStorage.removeItem("access_code");
          window.location.href = "/";
          return;
        }

        setUserCode(savedCode);
        setIsAuthenticated(true);

        // Load project data
        const categories = await projectService.getAll();
        const category = categories.find((c) => c.id === params.categoryId);
        const projectData = category?.projects.find(
          (p: any) => p.id === params.projectId
        );

        if (!projectData) {
          window.location.href = "/projects";
          return;
        }

        setProject(projectData);

        // Load project progress
        const progress = await projectProgressService.findByUserAndProject(
          savedCode,
          params.categoryId,
          params.projectId
        );

        if (progress) {
          setCompletedRequirements(progress.completed_requirements);
        }
      } catch (error) {
        console.error("Error loading project:", error);
        window.location.href = "/";
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadProject();
  }, [params.categoryId, params.projectId]);

  const toggleRequirement = async (requirement: string) => {
    if (!userCode) return;

    let updated: string[];
    if (completedRequirements.includes(requirement)) {
      updated = completedRequirements.filter((req) => req !== requirement);
    } else {
      updated = [...completedRequirements, requirement];
    }

    setCompletedRequirements(updated);

    try {
      await projectProgressService.upsert({
        user_code: userCode,
        project_id: params.projectId,
        category_id: params.categoryId,
        completed_requirements: updated,
        is_completed: updated.length === project.requirements.length,
      });
    } catch (error) {
      console.error("Error updating project progress:", error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("drive.google.com/file/d/")) {
      const fileId = url.split("/file/d/")[1]?.split("/")[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
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

  if (!isAuthenticated || !project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">
            Project Not Found
          </h1>
          <Link
            href="/projects"
            className="text-[#0fd8d7] hover:text-[#0bc5c4] transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round(
    (completedRequirements.length / project.requirements.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-black pt-20">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        </div>

        {mounted && (
          <>
            {[...Array(12)].map((_, i) => (
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

        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 opacity-30">
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping"></div>
          <div className="absolute inset-4 rounded-full border border-cyan-300 animate-pulse"></div>
        </div>

        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 md:w-40 md:h-40 opacity-20">
          <div
            className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute inset-4 rounded-full border border-blue-300 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full border border-blue-500/20 rounded-full animate-spin-slow"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full border border-cyan-500/20 rounded-full animate-spin-slow-reverse"></div>
        </div>
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-3 py-6">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center text-[#0fd8d7] hover:text-[#0bc5c4] mb-4 md:mb-6 transition-all duration-300 hover:transform hover:translate-x-1 animate-fade-in-up animation-delay-200 text-sm"
          >
            <ArrowLeft className="w-3 h-3 mr-1 md:w-4 md:h-4 md:mr-2" />
            Back
          </Link>

          <div className="space-y-6 px-3 md:px-5">
            {/* Project Header */}
            <div className="animate-fade-in-up animation-delay-400">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                <div className="flex-1">
                  <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-[#0fd8d7] to-white bg-clip-text text-transparent mb-1 md:mb-2">
                    {project.title}
                  </h1>
                  <p className="text-sm md:text-lg text-gray-300">
                    {project.description}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold border ${getDifficultyColor(
                    project.difficulty
                  )} self-start md:self-auto`}
                >
                  {project.difficulty}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 md:gap-2 mb-4 md:mb-6">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 md:px-2 md:py-1 bg-[#0fd8d7]/10 text-[#0fd8d7] rounded-md text-xs md:text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Video Tutorial - Smaller Size */}
            {project.video_url && (
              <div
                className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/60 
                  rounded-2xl p-5 md:p-6 border border-gray-700/60 
                  backdrop-blur-md shadow-lg shadow-black/30 
                  animate-fade-in-up animation-delay-500 w-full md:w-[800px] mx-auto"
              >
                {/* Heading */}
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 md:w-6 md:h-6 text-[#0fd8d7] animate-pulse" />
                  <span className="bg-gradient-to-r from-[#0fd8d7] to-teal-400 bg-clip-text text-transparent">
                    Video
                  </span>
                </h2>

                {/* Video */}
                <div
                  className="aspect-video bg-black/40 rounded-xl overflow-hidden max-w-3xl mx-auto 
                    ring-1 ring-gray-700/40 hover:ring-[#0fd8d7]/60 transition-all duration-300"
                >
                  <iframe
                    src={getVideoEmbedUrl(project.video_url)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${project.title} Tutorial`}
                  ></iframe>
                </div>

                {/* Info */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0fd8d7]" />
                    <span className="tracking-wide">
                      {project.estimated_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="tracking-wide">
                      {progressPercentage}% Complete
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Demo and Source Links */}
            {(project.demo_url || project.source_code || project.video_url) && (
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 animate-fade-in-up animation-delay-800">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-[#0fd8d7] to-[#0bc5c4] text-black font-medium py-1.5 md:py-2 px-3 md:px-4 rounded-md hover:from-[#0bc5c4] hover:to-[#0fd8d7] transition-all duration-300 text-xs md:text-sm"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Demo
                  </a>
                )}
                {project.source_code && (
                  <a
                    href={project.source_code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-1.5 md:py-2 px-3 md:px-4 rounded-md transition-all duration-300 text-xs md:text-sm"
                  >
                    PDF File
                  </a>
                )}
                {project.video_url && (
                  <a
                    href={project.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 md:py-2 px-3 md:px-4 rounded-md transition-all duration-300 text-xs md:text-sm"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Watch Tutorial
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

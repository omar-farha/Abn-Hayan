"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  Star,
  Code,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { accessCodeService, projectService } from "@/lib/database";
import Navbar from "@/components/navbar";

export default function ProjectsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const checkAuthAndLoadProjects = async () => {
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

        setIsAuthenticated(true);

        // Load projects
        const projectsData = await projectService.getAll();
        setCategories(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
        window.location.href = "/";
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadProjects();
  }, []);

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-black pt-20">
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
        <Navbar />
        <div className="container mx-auto px-5 md:px-7 lg:px-12 py-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-[#0fd8d7] hover:text-[#0bc5c4] mb-8 transition-all duration-300 hover:transform hover:translate-x-1 animate-fade-in-up animation-delay-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Page Header */}
          <div className="mb-16 animate-fade-in-up animation-delay-400">
            <div className="flex items-center mb-6">
              <h1 className="text-5xl h-fit py-5 bg-gradient-to-r from-[#0fd8d7] to-white bg-clip-text text-transparent font-bold">
                شرح الواجبات
              </h1>
            </div>
          </div>

          {/* Project Categories */}
          <div className="space-y-16">
            {categories.map((category, categoryIndex) => (
              <div
                key={category.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${600 + categoryIndex * 200}ms` }}
              >
                <div className="flex items-center mb-8">
                  <span className="text-4xl mr-4">{category.icon}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {category.title}
                    </h2>
                    <p className="text-gray-400">{category.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.projects.map(
                    (project: any, projectIndex: number) => (
                      <Link
                        key={project.id}
                        href={`/projects/${category.id}/${project.id}`}
                        className={`block group bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-xl p-6 border border-gray-700/50 hover:border-[#0fd8d7]/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-[#0fd8d7]/20 backdrop-blur-sm animate-fade-in-up`}
                        style={{
                          animationDelay: `${
                            800 + categoryIndex * 200 + projectIndex * 100
                          }ms`,
                        }}
                      >
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                                project.difficulty
                              )}`}
                            >
                              {project.difficulty}
                            </span>
                            <div className="flex items-center text-gray-400">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {project.estimated_time}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#0fd8d7] transition-colors duration-300">
                            {project.title}
                          </h3>
                          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-4">
                            {project.description}
                          </p>
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech: string) => (
                              <span
                                key={tech}
                                className="px-2 py-1 bg-[#0fd8d7]/10 text-[#0fd8d7] rounded text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-500">
                            <Code className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              {project.requirements.length} Requirements
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {project.demo_url && (
                              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#0fd8d7] transition-colors duration-300" />
                            )}
                            <Star className="w-4 h-4 text-gray-500 group-hover:text-[#0fd8d7] transition-colors duration-300" />
                          </div>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

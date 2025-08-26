"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Users,
  BarChart3,
  Download,
  Edit3,
  Save,
  Video,
  BookOpen,
  Settings,
  Code,
  Play,
  Rocket,
  Clock,
  Star,
  FileText,
  Search,
  FileTextIcon,
  Timer,
  ImageIcon,
  Loader2,
} from "lucide-react";
import {
  accessCodeService,
  userProgressService,
  courseService,
  projectService,
  examService,
  examQuestionService,
  examAttemptService,
  examAnswerService, // Added exam answer service import
} from "@/lib/database";
import type {
  AccessCode,
  UserProgress,
  Course,
  ProjectCategory,
} from "@/lib/supabase";
import * as XLSX from "xlsx";

// Add this import at the top
import { isSupabaseConfigured } from "@/lib/database";
import Link from "next/link";

interface Exam {
  id: string;
  title: string;
  description: string;
  course_id: string | null;
  total_duration: number;
  per_question_time_limit: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  questions?: ExamQuestion[];
}

interface ExamQuestion {
  id: string;
  exam_id: string;
  question_text: string;
  question_image_url: string | null;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  correct_answers: string[];
  points: number;
  order_index: number;
}

interface ExamAttempt {
  id: string;
  exam_id: string;
  user_code: string;
  started_at: string;
  submitted_at: string | null;
  time_taken: number | null;
  total_score: number;
  max_score: number;
  percentage: number;
  is_completed: boolean;
}

interface ExamAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answers: string[];
  is_correct: boolean;
  points_earned: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [activeTab, setActiveTab] = useState<
    "codes" | "tracking" | "courses" | "projects" | "exams" | "results"
  >("codes");
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [projects, setProjects] = useState<ProjectCategory[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [examAnswers, setExamAnswers] = useState<ExamAnswer[]>([]);
  const [viewingAnswers, setViewingAnswers] = useState<string | null>(null);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingExam, setEditingExam] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Add local editing states
  const [editingCourseData, setEditingCourseData] = useState<any>(null);
  const [editingSessionData, setEditingSessionData] = useState<any>(null);
  const [editingProjectData, setEditingProjectData] = useState<any>(null);
  const [editingCategoryData, setEditingCategoryData] = useState<any>(null);
  const [editingExamData, setEditingExamData] = useState<Partial<Exam> | null>(
    null
  );
  const [editingQuestionData, setEditingQuestionData] =
    useState<Partial<ExamQuestion> | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAccessCodes, setFilteredAccessCodes] = useState([]);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    id: "",
    title: "",
    description: "",
    icon: "📚",
  });
  const [newCategory, setNewCategory] = useState({
    id: "",
    title: "",
    description: "",
    icon: "🚀",
  });
  const [showAddSessionForm, setShowAddSessionForm] = useState(null);
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    content: "",
    assignment: "",
    video_url: "",
    tasks: [],
  });
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [codesData, progressData, coursesData, projectsData] =
        await Promise.all([
          accessCodeService.getAll(),
          userProgressService.getAll(),
          courseService.getAll(),
          projectService.getAll(),
        ]);

      setAccessCodes(codesData);
      setUserProgress(progressData);
      setCourses(coursesData);
      setProjects(projectsData);

      await loadExamData();
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Error loading data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadExamData = async () => {
    try {
      console.log(". Loading exam data...");
      const [examsData, attemptsData, answersData] = await Promise.all([
        examService.getAll(),
        examAttemptService.getAll(),
        examAnswerService.getAll(), // Added loading of exam answers
      ]);

      console.log(". Loaded exams:", examsData);
      console.log(". Loaded attempts:", attemptsData);
      console.log(". Loaded answers:", answersData); // Added logging for exam answers
      setExams(examsData);
      setExamAttempts(attemptsData);
      setExamAnswers(answersData); // Set exam answers state
    } catch (error) {
      console.error("Error loading exam data:", error);
    }
  };

  const handleCreateExam = async (examData: Partial<Exam>) => {
    setLoading(true);
    try {
      const newExam = await examService.create({
        title: examData.title!,
        description: examData.description!,
        course_id: examData.course_id || null,
        total_duration: examData.total_duration!,
        per_question_time_limit: examData.per_question_time_limit || null,
        is_active: true,
      });

      await loadExamData();
      setShowCreateExam(false);
      setEditingExamData(null);
      console.log(". Exam created successfully:", newExam);
    } catch (error) {
      console.error(". Error creating exam:", error);
      alert("Error creating exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (
    examId: string,
    questionData: Partial<ExamQuestion>
  ) => {
    setLoading(true);
    try {
      console.log(". Adding question to exam:", examId, questionData);
      const questionsCount = await examQuestionService.getByExamId(examId);

      await examQuestionService.create({
        exam_id: examId,
        question_text: questionData.question_text!,
        question_image_url: questionData.question_image_url || null,
        option_a: questionData.option_a!,
        option_b: questionData.option_b!,
        option_c: questionData.option_c || null,
        option_d: questionData.option_d || null,
        correct_answers: questionData.correct_answers || [],
        points: questionData.points || 1,
        order_index: questionsCount.length,
      });

      console.log(". Question added successfully, reloading exam data...");
      await loadExamData();
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Error adding question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this exam? This will also delete all questions and attempts."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await examQuestionService.deleteByExamId(examId);
      await examService.delete(examId);
      await loadExamData();
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert("Error deleting exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExamStatus = async (examId: string, isActive: boolean) => {
    setLoading(true);
    try {
      await examService.update(examId, { is_active: !isActive });
      await loadExamData();
    } catch (error) {
      console.error("Error updating exam status:", error);
      alert("Error updating exam status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const newCode = await accessCodeService.create({
        code: generateCode(),
        customer_name: newCustomerName.trim(),
        customer_phone: newCustomerPhone.trim(),
        is_active: true,
      });

      setAccessCodes([newCode, ...accessCodes]);
      setNewCustomerName("");
      setNewCustomerPhone("");
    } catch (error) {
      console.error("Error generating code:", error);
      alert("Error generating code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCodeStatus = async (id: string) => {
    const code = accessCodes.find((c) => c.id === id);
    if (!code) return;

    setLoading(true);
    try {
      const updatedCode = await accessCodeService.update(id, {
        is_active: !code.is_active,
      });

      setAccessCodes(accessCodes.map((c) => (c.id === id ? updatedCode : c)));
    } catch (error) {
      console.error("Error updating code:", error);
      alert("Error updating code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCode = async (id: string) => {
    if (!confirm("Are you sure you want to delete this access code?")) return;

    setLoading(true);
    try {
      await accessCodeService.delete(id);
      setAccessCodes(accessCodes.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting code:", error);
      alert("Error deleting code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard!");
  };

  const getProgressPercentage = (completedSessions: string[]) => {
    const totalSessions = courses.reduce(
      (total, course) => total + course.sessions.length,
      0
    );
    return totalSessions > 0
      ? Math.round((completedSessions.length / totalSessions) * 100)
      : 0;
  };

  const getCurrentCourseInfo = (userCode: string) => {
    const progress = userProgress.find((p) => p.user_code === userCode);
    if (!progress || !progress.current_course) return null;

    const course = courses.find((c) => c.id === progress.current_course);
    const session = course?.sessions.find(
      (s) => s.id === progress.current_session
    );

    return { course, session };
  };

  const exportProgressData = () => {
    const csvData = userProgress.map((progress) => {
      const customer = accessCodes.find(
        (code) => code.code === progress.user_code
      );
      const currentInfo = getCurrentCourseInfo(progress.user_code);

      return {
        "Customer Name": customer?.customer_name || "Unknown",
        Phone: customer?.customer_phone || "Unknown",
        "Access Code": progress.user_code,
        "Completed Sessions": progress.completed_sessions.length,
        "Progress %": getProgressPercentage(progress.completed_sessions),
        "Current Course": currentInfo?.course?.title || "Not started",
        "Current Session": currentInfo?.session?.title || "Not started",
        "Login Count": progress.login_count,
        "Last Activity": new Date(progress.last_activity).toLocaleString(),
      };
    });

    const csvContent = [
      Object.keys(csvData[0] || {}).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student-progress-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Course editing functions
  const startEditingCourse = (course: Course) => {
    setEditingCourse(course.id);
    setEditingCourseData({ ...course });
  };

  const saveCourse = async () => {
    if (!editingCourseData || !editingCourse) return;

    setLoading(true);
    try {
      // إنشاء نسخة من البيانات بدون الجلسات
      const { sessions, ...courseDataWithoutSessions } = editingCourseData;

      await supabase
        .from("courses")
        .update(courseDataWithoutSessions)
        .eq("id", editingCourse);

      setCourses(
        courses.map((course) =>
          course.id === editingCourse ? editingCourseData : course
        )
      );
      setEditingCourse(null);
      setEditingCourseData(null);
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Error updating course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEditingCourse = () => {
    setEditingCourse(null);
    setEditingCourseData(null);
  };

  // Session editing functions
  const startEditingSession = (courseId: string, session: any) => {
    setEditingSession(session.id);
    // Store courseId separately, don't include it in the session data
    setEditingSessionData({
      courseId, // Keep this for reference
      id: session.id,
      title: session.title,
      description: session.description,
      content: session.content,
      assignment: session.assignment,
      video_url: session.video_url,
      tasks: session.tasks,
      order_index: session.order_index,
      course_id: session.course_id,
    });
  };

  const saveSession = async () => {
    if (!editingSessionData || !editingSession) return;

    setLoading(true);
    try {
      // Extract courseId and create clean session data without it
      const { courseId, ...sessionUpdateData } = editingSessionData;

      await courseService.updateSession(
        courseId,
        editingSession,
        sessionUpdateData
      );
      setCourses(
        courses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                sessions: course.sessions.map((session) =>
                  session.id === editingSession
                    ? { ...session, ...sessionUpdateData }
                    : session
                ),
              }
            : course
        )
      );
      setEditingSession(null);
      setEditingSessionData(null);
    } catch (error) {
      console.error("Error updating session:", error);
      alert("Error updating session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEditingSession = () => {
    setEditingSession(null);
    setEditingSessionData(null);
  };

  // Project category editing functions
  const startEditingCategory = (category: any) => {
    setEditingCategory(category.id);
    setEditingCategoryData({ ...category });
  };

  const saveCategory = async () => {
    if (!editingCategoryData || !editingCategory) return;

    setLoading(true);
    try {
      // إنشاء نسخة من البيانات بدون المشاريع
      const { projects, ...categoryDataWithoutProjects } = editingCategoryData;

      await supabase
        .from("project_categories")
        .update(categoryDataWithoutProjects)
        .eq("id", editingCategory);

      // إعادة تحميل البيانات
      await loadData();

      setEditingCategory(null);
      setEditingCategoryData(null);
    } catch (error) {
      console.error("Error updating project category:", error);
      alert("Error updating project category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEditingCategory = () => {
    setEditingCategory(null);
    setEditingCategoryData(null);
  };

  // Project editing functions
  const startEditingProject = (categoryId: string, project: any) => {
    setEditingProject(project.id);
    setEditingProjectData({
      categoryId, // Keep this for reference
      id: project.id,
      title: project.title,
      description: project.description,
      difficulty: project.difficulty,
      technologies: project.technologies,
      requirements: project.requirements,
      instructions: project.instructions,
      estimated_time: project.estimated_time,
      video_url: project.video_url,
      demo_url: project.demo_url,
      source_code: project.source_code,
      category_id: project.category_id,
    });
  };

  const saveProject = async () => {
    if (!editingProjectData || !editingProject) return;

    setLoading(true);
    try {
      // Extract categoryId and create clean project data without it
      const { categoryId, ...projectUpdateData } = editingProjectData;

      await projectService.updateProject(
        categoryId,
        editingProject,
        projectUpdateData
      );
      setProjects(
        projects.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                projects: category.projects.map((project) =>
                  project.id === editingProject
                    ? { ...project, ...projectUpdateData }
                    : project
                ),
              }
            : category
        )
      );
      setEditingProject(null);
      setEditingProjectData(null);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Error updating project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEditingProject = () => {
    setEditingProject(null);
    setEditingProjectData(null);
  };

  const addNewProject = async (categoryId: string) => {
    const newProject = {
      id: `project-${Date.now()}`,
      category_id: categoryId,
      title: "New Project",
      description: "Project description",
      difficulty: "Beginner" as const,
      technologies: ["HTML5", "CSS3"],
      requirements: ["Requirement 1", "Requirement 2"],
      instructions: "Project instructions go here...",
      estimated_time: "4-6 hours",
    };

    setLoading(true);
    try {
      const createdProject = await projectService.createProject(newProject);
      setProjects(
        projects.map((category) =>
          category.id === categoryId
            ? { ...category, projects: [...category.projects, createdProject] }
            : category
        )
      );
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (categoryId: string, projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    try {
      await projectService.deleteProject(categoryId, projectId);
      setProjects(
        projects.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                projects: category.projects.filter((p) => p.id !== projectId),
              }
            : category
        )
      );
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (userCode: string) => {
    const progress = userProgress.find((p) => p.user_code === userCode);
    if (progress?.customer_name) {
      return progress.customer_name;
    }
    // Generate a readable name from the code if no name is found
    return `Student ${userCode.slice(0, 3)}${userCode.slice(-2)}`;
  };

  const getAnswersForAttempt = (attemptId: string) => {
    return examAnswers.filter((answer) => answer.attempt_id === attemptId);
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAccessCodes(accessCodes);
    } else {
      const filtered = accessCodes.filter(
        (code) =>
          code.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          code.customer_phone.includes(searchTerm) ||
          code.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAccessCodes(filtered);
    }
  }, [accessCodes, searchTerm]);

  const exportToExcel = () => {
    try {
      // تجهيز البيانات
      const excelData = filteredAccessCodes.map((codeData) => ({
        "Customer Name": codeData.customer_name,
        "Access Code": codeData.code,
        "Phone Number": codeData.customer_phone,
      }));

      if (excelData.length === 0) {
        alert("لا توجد بيانات للتصدير");
        return;
      }

      // إنشاء ورقة Excel من البيانات
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // إنشاء ملف جديد
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Access Codes");

      // حفظ الملف
      XLSX.writeFile(
        workbook,
        `access-codes-${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("حدث خطأ في تصدير Excel");
    }
  };

  const createNewCourse = async () => {
    if (!newCourse.title.trim() || !newCourse.description.trim()) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const courseId = newCourse.id || `course-${Date.now()}`;

      const { error } = await supabase.from("courses").insert([
        {
          id: courseId,
          title: newCourse.title,
          description: newCourse.description,
          icon: newCourse.icon,
        },
      ]);

      if (error) throw error;

      // إعادة تحميل البيانات
      await loadData();

      // إعادة تعيين النموذج
      setNewCourse({ id: "", title: "", description: "", icon: "📚" });
      setShowAddCourseForm(false);

      alert("تم إنشاء الدورة بنجاح!");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("حدث خطأ في إنشاء الدورة");
    } finally {
      setLoading(false);
    }
  };
  const createNewSession = async (courseId) => {
    if (!newSession.title.trim()) {
      alert("يرجى إدخال عنوان الجلسة");
      return;
    }

    setLoading(true);
    try {
      const sessionId = `session-${Date.now()}`;

      const { error } = await supabase.from("sessions").insert([
        {
          id: sessionId,
          course_id: courseId,
          title: newSession.title,
          description: newSession.description || "",
          content: newSession.content || "",
          assignment: newSession.assignment || "",
          video_url: newSession.video_url || "",
          tasks: newSession.tasks || [],
          order_index:
            courses.find((c) => c.id === courseId)?.sessions?.length || 0,
        },
      ]);

      if (error) throw error;

      // إعادة تحميل البيانات
      await loadData();

      // إعادة تعيين النموذج
      setNewSession({
        title: "",
        description: "",
        content: "",
        assignment: "",
        video_url: "",
        tasks: [],
      });
      setShowAddSessionForm(null);

      alert("تم إنشاء الجلسة بنجاح!");
    } catch (error) {
      console.error("Error creating session:", error);
      alert("حدث خطأ في إنشاء الجلسة");
    } finally {
      setLoading(false);
    }
  };
  const createNewCategory = async () => {
    if (!newCategory.title.trim() || !newCategory.description.trim()) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const categoryId = newCategory.id || `category-${Date.now()}`;

      const { error } = await supabase.from("project_categories").insert([
        {
          id: categoryId,
          title: newCategory.title,
          description: newCategory.description,
          icon: newCategory.icon,
        },
      ]);

      if (error) throw error;

      // إعادة تحميل البيانات
      await loadData();

      // إعادة تعيين النموذج
      setNewCategory({ id: "", title: "", description: "", icon: "🚀" });
      setShowAddCategoryForm(false);

      alert("تم إنشاء الفئة بنجاح!");
    } catch (error) {
      console.error("Error creating category:", error);
      alert("حدث خطأ في إنشاء الفئة");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-black  text-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        </div>
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
        <div className=" rounded-2xl bg-white p-8 max-w-md w-full border border-blue-200 z-[1000]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2 font-serif">
              لوحة الإدارة
            </h1>
            <p className="text-gray-600">أدخل بيانات الإدارة الخاصة بك</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة مرور الإدارة
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-blue-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              دخول لوحة الإدارة
            </button>
          </form>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 font-io">
            لوحة الإدارة
          </h1>
          <Link
            href={"/"}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            تسجيل خروج
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 space-x-reverse mb-8 border-b border-blue-200">
          <button
            onClick={() => setActiveTab("codes")}
            className={`pb-3 px-1 border-b-2 transition-colors flex items-center ${
              activeTab === "codes"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Code className="w-4 h-4 ml-2" />
            أكواد الوصول
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`pb-3 px-1 border-b-2 transition-colors flex items-center ${
              activeTab === "tracking"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <BarChart3 className="w-4 h-4 ml-2" />
            تتبع الطلاب
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`pb-3 px-1 border-b-2 transition-colors flex items-center ${
              activeTab === "courses"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Settings className="w-4 h-4 ml-2" />
            إدراة المحاضرات
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-3 px-1 border-b-2 transition-colors flex items-center ${
              activeTab === "projects"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Rocket className="w-4 h-4 ml-2" />
            إدارة الواجبات
          </button>
          <button
            onClick={() => setActiveTab("exams")}
            className={`pb-3 px-1 border-b-2 transition-colors flex items-center ${
              activeTab === "exams"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText className="w-4 h-4 ml-2" />
            إدارة الامتحانات
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`pb-3 px-1 border-b-2 transition-colors flex items-center ${
              activeTab === "results"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <BarChart3 className="w-4 h-4 ml-2" />
            نتائج الامتحانات
          </button>
        </div>

        {/* Access Codes Tab */}
        {activeTab === "codes" && (
          <>
            <div className="bg-blue-50/50 rounded-lg p-6 mb-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-serif">
                <Plus className="w-5 h-5 ml-2 text-blue-600" />
                إنشاء كود وصول جديد
              </h3>
              <form
                onSubmit={handleGenerateCode}
                className="grid md:grid-cols-3 gap-4"
              >
                <input
                  type="text"
                  placeholder="اسم العميل"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="هاتف العميل"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? "جاري الإنشاء..." : "إنشاء كود"}
                </button>
              </form>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 font-serif">
                  أكواد الوصول ({filteredAccessCodes.length})
                </h3>
                <div className="flex space-x-4 space-x-reverse">
                  <button
                    onClick={exportToExcel}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center"
                  >
                    <FileTextIcon className="w-4 h-4 ml-2" />
                    تصدير PDF
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6 border border-blue-200">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="البحث بالاسم أو رقم الهاتف أو الكود..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredAccessCodes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {searchTerm
                      ? "لم يتم العثور على نتائج للبحث."
                      : "لم يتم إنشاء أكواد وصول بعد."}
                  </p>
                ) : (
                  filteredAccessCodes.map((codeData) => {
                    // ... existing code for displaying access codes ...
                    const progress = userProgress.find(
                      (p) => p.user_code === codeData.code
                    );
                    const currentInfo = getCurrentCourseInfo(codeData.code);

                    return (
                      <div
                        key={codeData.id}
                        className={`bg-blue-50/50 rounded-lg p-4 border ${
                          codeData.is_active
                            ? "border-green-300"
                            : "border-red-300"
                        }`}
                      >
                        {/* ... existing access code display code ... */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 space-x-reverse mb-2">
                              <span className="font-mono text-lg font-bold text-blue-600">
                                {codeData.code}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  codeData.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {codeData.is_active ? "نشط" : "غير نشط"}
                              </span>
                              {progress && (
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                  {getProgressPercentage(
                                    progress.completed_sessions
                                  )}
                                  % مكتمل
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-700 grid md:grid-cols-2 gap-2">
                              <div>
                                <p>
                                  <strong>العميل:</strong>{" "}
                                  {codeData.customer_name}
                                </p>
                                <p>
                                  <strong>الهاتف:</strong>{" "}
                                  {codeData.customer_phone}
                                </p>
                                <p>
                                  <strong>تاريخ الإنشاء:</strong>{" "}
                                  {new Date(
                                    codeData.created_at
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              {progress && (
                                <div>
                                  <p>
                                    <strong>عدد مرات الدخول:</strong>{" "}
                                    {progress.login_count}
                                  </p>
                                  <p>
                                    <strong>الجلسات المكتملة:</strong>{" "}
                                    {progress.completed_sessions.length}
                                  </p>
                                  <p>
                                    <strong>الدورة الحالية:</strong>{" "}
                                    {currentInfo?.course?.title || "لم تبدأ"}
                                  </p>
                                  <p>
                                    <strong>آخر نشاط:</strong>{" "}
                                    {new Date(
                                      progress.last_activity
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => copyToClipboard(codeData.code)}
                              className="p-2 bg-blue-200 hover:bg-blue-300 rounded-lg transition-colors"
                              title="نسخ الكود"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleCodeStatus(codeData.id)}
                              disabled={loading}
                              className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                                codeData.is_active
                                  ? "bg-red-200 hover:bg-red-300"
                                  : "bg-green-200 hover:bg-green-300"
                              }`}
                              title={
                                codeData.is_active ? "إلغاء التفعيل" : "تفعيل"
                              }
                            >
                              {codeData.is_active ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => deleteCode(codeData.id)}
                              disabled={loading}
                              className="p-2 bg-red-200 hover:bg-red-300 rounded-lg transition-colors disabled:opacity-50"
                              title="حذف الكود"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

        {/* Student Tracking Tab */}
        {activeTab === "tracking" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center font-serif">
                <Users className="w-5 h-5 ml-2 text-blue-600" />
                تتبع تقدم الطلاب ({userProgress.length} طالب نشط)
              </h3>
              <button
                onClick={exportProgressData}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center"
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير CSV
              </button>
            </div>

            {userProgress.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">لا يوجد نشاط طلابي حتى الآن.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userProgress.map((progress) => {
                  const customer = accessCodes.find(
                    (code) => code.code === progress.user_code
                  );
                  const currentInfo = getCurrentCourseInfo(progress.user_code);
                  const progressPercentage = getProgressPercentage(
                    progress.completed_sessions
                  );

                  return (
                    <div
                      key={progress.user_code}
                      className="bg-blue-50/50 rounded-lg p-6 border border-blue-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-1">
                            {customer?.customer_name || "طالب غير معروف"}
                          </h4>
                          <p className="text-gray-500">
                            الكود: {progress.user_code}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {progressPercentage}%
                          </div>
                          <div className="text-sm text-gray-500">مكتمل</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="bg-blue-100 rounded-full h-2 mb-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {progress.completed_sessions.length} من{" "}
                          {courses.reduce(
                            (total, course) => total + course.sessions.length,
                            0
                          )}{" "}
                          جلسة مكتملة
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">الدورة الحالية</p>
                          <p className="text-gray-900 font-semibold">
                            {currentInfo?.course?.title || "لم تبدأ"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">الجلسة الحالية</p>
                          <p className="text-gray-900 font-semibold">
                            {currentInfo?.session?.title || "لم تبدأ"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">النشاط</p>
                          <p className="text-gray-900 font-semibold">
                            {progress.login_count} مرات دخول
                          </p>
                          <p className="text-gray-500 text-xs">
                            آخر نشاط:{" "}
                            {new Date(
                              progress.last_activity
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Course Management Tab */}
        {activeTab === "courses" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center font-serif">
                <BookOpen className="w-5 h-5 ml-2 text-blue-600" />
                إدراة المحاضرات
              </h3>
              <button
                onClick={() => setShowAddCourseForm(!showAddCourseForm)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة دورة جديدة
              </button>
            </div>

            {showAddCourseForm && (
              <div className="bg-green-50/50 rounded-lg p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  إنشاء دورة جديدة
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="معرف الدورة (اختياري)"
                    value={newCourse.id}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, id: e.target.value })
                    }
                    className="px-4 py-2 bg-white border border-green-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500"
                  />
                  <input
                    type="text"
                    placeholder="عنوان الدورة"
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, title: e.target.value })
                    }
                    className="px-4 py-2 bg-white border border-green-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <textarea
                  placeholder="وصف الدورة"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  className="w-full mt-4 px-4 py-2 bg-white border border-green-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500"
                  rows={3}
                  required
                />
                <div className="flex items-center mt-4 space-x-4 space-x-reverse">
                  <input
                    type="text"
                    placeholder="أيقونة الدورة (emoji)"
                    value={newCourse.icon}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, icon: e.target.value })
                    }
                    className="px-4 py-2 bg-white border border-green-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 w-32"
                  />
                  <button
                    onClick={createNewCourse}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? "جاري الإنشاء..." : "إنشاء الدورة"}
                  </button>
                  <button
                    onClick={() => setShowAddCourseForm(false)}
                    className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all duration-300"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* ... existing courses display code ... */}
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-blue-50/50 rounded-lg p-6 border border-blue-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl ml-4">{course.icon}</span>
                    {editingCourse === course.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingCourseData?.title || ""}
                          onChange={(e) =>
                            setEditingCourseData({
                              ...editingCourseData,
                              title: e.target.value,
                            })
                          }
                          className="bg-blue-100 text-gray-900 px-3 py-1 rounded border border-blue-300 focus:border-blue-500"
                        />
                        <textarea
                          value={editingCourseData?.description || ""}
                          onChange={(e) =>
                            setEditingCourseData({
                              ...editingCourseData,
                              description: e.target.value,
                            })
                          }
                          className="bg-blue-100 text-gray-900 px-3 py-1 rounded border border-blue-300 focus:border-blue-500 w-full"
                          rows={2}
                        />
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {course.title}
                        </h4>
                        <p className="text-gray-500">{course.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    {editingCourse === course.id ? (
                      <>
                        <button
                          onClick={saveCourse}
                          disabled={loading}
                          className="p-2 bg-green-300 text-gray-900 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditingCourse}
                          className="p-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditingCourse(course)}
                        className="p-2 bg-blue-300 text-gray-900 rounded-lg hover:bg-blue-400 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* زر إضافة جلسة جديدة */}
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => setShowAddSessionForm(course.id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة جلسة جديدة
                  </button>
                </div>

                {/* نموذج إضافة جلسة جديدة */}
                {showAddSessionForm === course.id && (
                  <div className="bg-blue-100 rounded-lg p-4 border border-blue-300 mb-4">
                    <h5 className="text-md font-semibold text-gray-900 mb-3">
                      إنشاء جلسة جديدة
                    </h5>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="عنوان الجلسة"
                        value={newSession.title || ""}
                        onChange={(e) =>
                          setNewSession({
                            ...newSession,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        required
                      />
                      <textarea
                        placeholder="وصف الجلسة"
                        value={newSession.description || ""}
                        onChange={(e) =>
                          setNewSession({
                            ...newSession,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        rows={2}
                      />
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => createNewSession(course.id)}
                          disabled={loading}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
                        >
                          {loading ? "جاري الإنشاء..." : "إنشاء الجلسة"}
                        </button>
                        <button
                          onClick={() => setShowAddSessionForm(null)}
                          className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {course.sessions.map((session, index) => (
                    <div
                      key={session.id}
                      className="bg-blue-50/50 rounded-lg p-4 border border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className="bg-blue-300 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold ml-3">
                            {index + 1}
                          </span>
                          {editingSession === session.id ? (
                            <input
                              type="text"
                              value={editingSessionData?.title || ""}
                              onChange={(e) =>
                                setEditingSessionData({
                                  ...editingSessionData,
                                  title: e.target.value,
                                })
                              }
                              className="bg-blue-100 text-gray-900 px-3 py-1 rounded border border-blue-300 focus:border-blue-500"
                            />
                          ) : (
                            <h5 className="font-semibold text-gray-900">
                              {session.title}
                            </h5>
                          )}
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                          {editingSession === session.id ? (
                            <>
                              <button
                                onClick={saveSession}
                                disabled={loading}
                                className="p-1 bg-green-300 text-gray-900 rounded hover:bg-green-400 transition-colors disabled:opacity-50"
                              >
                                <Save className="w-3 h-3" />
                              </button>
                              <button
                                onClick={cancelEditingSession}
                                className="p-1 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() =>
                                startEditingSession(course.id, session)
                              }
                              className="p-1 bg-blue-200 text-gray-900 rounded hover:bg-blue-300 transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {editingSession === session.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              الوصف
                            </label>
                            <textarea
                              value={editingSessionData?.description || ""}
                              onChange={(e) =>
                                setEditingSessionData({
                                  ...editingSessionData,
                                  description: e.target.value,
                                })
                              }
                              className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              المحتوى
                            </label>
                            <textarea
                              value={editingSessionData?.content || ""}
                              onChange={(e) =>
                                setEditingSessionData({
                                  ...editingSessionData,
                                  content: e.target.value,
                                })
                              }
                              className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              الواجب
                            </label>
                            <textarea
                              value={editingSessionData?.assignment || ""}
                              onChange={(e) =>
                                setEditingSessionData({
                                  ...editingSessionData,
                                  assignment: e.target.value,
                                })
                              }
                              className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-1 flex items-center">
                              <Video className="w-4 h-4 ml-1" />
                              رابط الفيديو (Google Drive أو YouTube)
                            </label>
                            <input
                              type="url"
                              value={editingSessionData?.video_url || ""}
                              onChange={(e) =>
                                setEditingSessionData({
                                  ...editingSessionData,
                                  video_url: e.target.value,
                                })
                              }
                              placeholder="https://drive.google.com/file/d/... أو https://youtube.com/watch?v=..."
                              className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              المهام (مهمة واحدة في كل سطر)
                            </label>
                            <textarea
                              value={
                                editingSessionData?.tasks?.join("\n") || ""
                              }
                              onChange={(e) =>
                                setEditingSessionData({
                                  ...editingSessionData,
                                  tasks: e.target.value
                                    .split("\n")
                                    .filter((task) => task.trim()),
                                })
                              }
                              className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                              rows={4}
                              placeholder="المهمة 1&#10;المهمة 2&#10;المهمة 3"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-700">
                          <p className="mb-2">{session.description}</p>
                          {session.video_url && (
                            <div className="flex items-center text-blue-300 mb-2">
                              <Play className="w-4 h-4 ml-1" />
                              فيديو:{" "}
                              {session.video_url.length > 50
                                ? session.video_url.substring(0, 50) + "..."
                                : session.video_url}
                            </div>
                          )}
                          <p className="text-gray-500">
                            المهام: {session.tasks?.length || 0}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Management Tab */}
        {activeTab === "projects" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center font-serif">
                <Rocket className="w-5 h-5 ml-2 text-blue-600" />
                إدارة الواجبات
              </h3>
              <button
                onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة فئة جديدة
              </button>
            </div>

            {showAddCategoryForm && (
              <div className="bg-purple-50/50 rounded-lg p-6 border border-purple-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  إنشاء فئة مشاريع جديدة
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="معرف الفئة (اختياري)"
                    value={newCategory.id}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, id: e.target.value })
                    }
                    className="px-4 py-2 bg-white border border-purple-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="عنوان الفئة"
                    value={newCategory.title}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, title: e.target.value })
                    }
                    className="px-4 py-2 bg-white border border-purple-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <textarea
                  placeholder="وصف الفئة"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full mt-4 px-4 py-2 bg-white border border-purple-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  rows={3}
                  required
                />
                <div className="flex items-center mt-4 space-x-4 space-x-reverse">
                  <input
                    type="text"
                    placeholder="أيقونة الفئة (emoji)"
                    value={newCategory.icon}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, icon: e.target.value })
                    }
                    className="px-4 py-2 bg-white border border-purple-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 w-32"
                  />
                  <button
                    onClick={createNewCategory}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? "جاري الإنشاء..." : "إنشاء الفئة"}
                  </button>
                  <button
                    onClick={() => setShowAddCategoryForm(false)}
                    className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all duration-300"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* ... existing projects display code ... */}
            {projects.map((category) => (
              <div
                key={category.id}
                className="bg-blue-50/50 rounded-lg p-6 border border-blue-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="text-3xl ml-4">{category.icon}</span>
                    {editingCategory === category.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingCategoryData?.title || ""}
                          onChange={(e) =>
                            setEditingCategoryData({
                              ...editingCategoryData,
                              title: e.target.value,
                            })
                          }
                          className="bg-blue-100 text-gray-900 px-3 py-1 rounded border border-blue-300 focus:border-blue-500"
                        />
                        <textarea
                          value={editingCategoryData?.description || ""}
                          onChange={(e) =>
                            setEditingCategoryData({
                              ...editingCategoryData,
                              description: e.target.value,
                            })
                          }
                          className="bg-blue-100 text-gray-900 px-3 py-1 rounded border border-blue-300 focus:border-blue-500 w-full"
                          rows={2}
                        />
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {category.title}
                        </h4>
                        <p className="text-gray-500">{category.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => addNewProject(category.id)}
                      disabled={loading}
                      className="p-2 bg-green-300 text-gray-900 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50"
                      title="إضافة مشروع جديد"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    {editingCategory === category.id ? (
                      <>
                        <button
                          onClick={saveCategory}
                          disabled={loading}
                          className="p-2 bg-green-300 text-gray-900 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditingCategory}
                          className="p-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditingCategory(category)}
                        className="p-2 bg-blue-300 text-gray-900 rounded-lg hover:bg-blue-400 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {category.projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-blue-50/50 rounded-lg p-4 border border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            {editingProject === project.id ? (
                              <input
                                type="text"
                                value={editingProjectData?.title || ""}
                                onChange={(e) =>
                                  setEditingProjectData({
                                    ...editingProjectData,
                                    title: e.target.value,
                                  })
                                }
                                className="bg-blue-100 text-gray-900 px-3 py-1 rounded border border-blue-300 focus:border-blue-500"
                              />
                            ) : (
                              <h5 className="font-semibold text-gray-900">
                                {project.title}
                              </h5>
                            )}
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                project.difficulty === "Beginner"
                                  ? "bg-green-100 text-green-700"
                                  : project.difficulty === "Intermediate"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {editingProject === project.id
                                ? editingProjectData?.difficulty
                                : project.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                          {editingProject === project.id ? (
                            <>
                              <button
                                onClick={saveProject}
                                disabled={loading}
                                className="p-1 bg-green-300 text-gray-900 rounded hover:bg-green-400 transition-colors disabled:opacity-50"
                              >
                                <Save className="w-3 h-3" />
                              </button>
                              <button
                                onClick={cancelEditingProject}
                                className="p-1 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() =>
                                startEditingProject(category.id, project)
                              }
                              className="p-1 bg-blue-200 text-gray-900 rounded hover:bg-blue-300 transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              deleteProject(category.id, project.id)
                            }
                            disabled={loading}
                            className="p-1 bg-red-200 text-gray-900 rounded hover:bg-red-300 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {editingProject === project.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              الوصف
                            </label>
                            <textarea
                              value={editingProjectData?.description || ""}
                              onChange={(e) =>
                                setEditingProjectData({
                                  ...editingProjectData,
                                  description: e.target.value,
                                })
                              }
                              className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                              rows={2}
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-700 mb-1">
                                المستوى
                              </label>
                              <select
                                value={editingProjectData?.difficulty || ""}
                                onChange={(e) =>
                                  setEditingProjectData({
                                    ...editingProjectData,
                                    difficulty: e.target.value,
                                  })
                                }
                                className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                              >
                                <option value="Beginner">مبتدئ</option>
                                <option value="Intermediate">متوسط</option>
                                <option value="Advanced">متقدم</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700 mb-1">
                                الوقت المقدر
                              </label>
                              <input
                                type="text"
                                value={editingProjectData?.estimated_time || ""}
                                onChange={(e) =>
                                  setEditingProjectData({
                                    ...editingProjectData,
                                    estimated_time: e.target.value,
                                  })
                                }
                                className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                                placeholder="4-6 ساعات"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-gray-700 mb-1 flex items-center">
                              <Video className="w-4 h-4 ml-1" />
                              رابط الفيديو التعليمي (Google Drive أو YouTube)
                            </label>
                            <input
                              type="url"
                              value={editingProjectData?.video_url || ""}
                              onChange={(e) =>
                                setEditingProjectData({
                                  ...editingProjectData,
                                  video_url: e.target.value,
                                })
                              }
                              placeholder="https://drive.google.com/file/d/... أو https://youtube.com/watch?v=..."
                              className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              رابط ملف ال PDF (اختياري)
                            </label>
                            <input
                              type="url"
                              value={editingProjectData?.source_code || ""}
                              onChange={(e) =>
                                setEditingProjectData({
                                  ...editingProjectData,
                                  source_code: e.target.value,
                                })
                              }
                              className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                              placeholder="https://github.com/..."
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-700">
                          <p className="mb-2">{project.description}</p>
                          <div className="flex items-center space-x-4 space-x-reverse text-gray-500 mb-2">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 ml-1" />
                              <span>{project.estimated_time}</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 ml-1" />
                              <span>{project.requirements.length} متطلبات</span>
                            </div>
                            <div className="flex items-center">
                              <Code className="w-4 h-4 ml-1" />
                              <span>{project.technologies.join(", ")}</span>
                            </div>
                            {project.video_url && (
                              <div className="flex items-center text-blue-300">
                                <Play className="w-4 h-4 ml-1" />
                                <span>فيديو تعليمي</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ... existing exam tab code ... */}
        {activeTab === "exams" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center font-serif">
                <FileText className="w-5 h-5 ml-2 text-blue-600" />
                إدارة الامتحانات
              </h3>
              <button
                onClick={() => setShowCreateExam(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إنشاء امتحان جديد
              </button>
            </div>

            {/* Create Exam Modal */}
            {showCreateExam && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-blue-50 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    إنشاء امتحان جديد
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editingExamData) {
                        handleCreateExam(editingExamData);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        عنوان الامتحان
                      </label>
                      <input
                        type="text"
                        value={editingExamData?.title || ""}
                        onChange={(e) =>
                          setEditingExamData({
                            ...editingExamData,
                            title: e.target.value,
                          })
                        }
                        className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        الوصف
                      </label>
                      <textarea
                        value={editingExamData?.description || ""}
                        onChange={(e) =>
                          setEditingExamData({
                            ...editingExamData,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        الدورة (اختياري)
                      </label>
                      <select
                        value={editingExamData?.course_id || ""}
                        onChange={(e) =>
                          setEditingExamData({
                            ...editingExamData,
                            course_id: e.target.value || null,
                          })
                        }
                        className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                      >
                        <option value="">لا توجد دورة محددة</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          المدة الكلية (بالدقائق)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={editingExamData?.total_duration || ""}
                          onChange={(e) =>
                            setEditingExamData({
                              ...editingExamData,
                              total_duration: Number.parseInt(e.target.value),
                            })
                          }
                          className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          الحد الزمني لكل سؤال (بالثواني، اختياري)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={editingExamData?.per_question_time_limit || ""}
                          onChange={(e) =>
                            setEditingExamData({
                              ...editingExamData,
                              per_question_time_limit: e.target.value
                                ? Number.parseInt(e.target.value)
                                : null,
                            })
                          }
                          className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateExam(false);
                          setEditingExamData(null);
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-300 text-gray-900 rounded-lg hover:bg-blue-400 transition-colors disabled:opacity-50"
                      >
                        {loading ? "جاري الإنشاء..." : "إنشاء امتحان"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Exams List */}
            <div className="space-y-6">
              {exams.length === 0 ? (
                <div className="text-center py-12 bg-blue-50/50 rounded-lg">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    لم يتم إنشاء أي امتحانات حتى الآن
                  </p>
                  <p className="text-gray-500">أنشئ امتحانك الأول للبدء</p>
                </div>
              ) : (
                exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-blue-50/50 rounded-lg p-6 border border-blue-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="text-xl font-semibold text-gray-900 ml-3">
                            {exam.title}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              exam.is_active
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-red-100 text-red-700 border border-red-300"
                            }`}
                          >
                            {exam.is_active ? "نشط" : "غير نشط"}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{exam.description}</p>
                        <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-500">
                          <div className="flex items-center">
                            <Timer className="w-4 h-4 ml-1" />
                            {exam.total_duration} دقائق
                          </div>
                          {exam.per_question_time_limit && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 ml-1" />
                              {exam.per_question_time_limit} ثانية لكل سؤال
                            </div>
                          )}
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 ml-1" />
                            {exam.questions?.length || 0} أسئلة
                          </div>
                          {exam.course_id && (
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 ml-1" />
                              {courses.find((c) => c.id === exam.course_id)
                                ?.title || "دورة غير معروفة"}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() =>
                            toggleExamStatus(exam.id, !exam.is_active)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            exam.is_active
                              ? "bg-red-200 hover:bg-red-300 text-gray-900"
                              : "bg-green-200 hover:bg-green-300 text-gray-900"
                          }`}
                          title={
                            exam.is_active
                              ? "إلغاء تفعيل الامتحان"
                              : "تفعيل الامتحان"
                          }
                        >
                          {exam.is_active ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setShowAddQuestion(exam.id)}
                          className="p-2 bg-blue-200 text-gray-900 rounded-lg hover:bg-blue-300 transition-colors"
                          title="إضافة سؤال"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingExam(exam.id)}
                          className="p-2 bg-blue-300 text-gray-900 rounded-lg hover:bg-blue-400 transition-colors"
                          title="تعديل الامتحان"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExam(exam.id)}
                          className="p-2 bg-red-200 text-gray-900 rounded-lg hover:bg-red-300 transition-colors"
                          title="حذف الامتحان"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Questions List */}
                    {exam.questions && exam.questions.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h5 className="text-lg font-medium text-gray-900">
                          الأسئلة ({exam.questions.length})
                        </h5>
                        {exam.questions.map((question, index) => (
                          <div
                            key={question.id}
                            className="bg-blue-50/50 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <span className="bg-blue-300 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold ml-3">
                                    {index + 1}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {question.points} نقطة
                                    {question.points !== 1 ? "نقاط" : ""}
                                  </span>
                                </div>
                                <p className="text-gray-900 mb-2">
                                  {question.question_text}
                                </p>
                                {question.question_image_url && (
                                  <div className="flex items-center text-blue-300 mb-2">
                                    <ImageIcon className="w-4 h-4 ml-1" />
                                    صورة مرفقة
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div
                                    className={`p-2 rounded ${
                                      question.correct_answers.includes("A")
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-gray-700"
                                    }`}
                                  >
                                    أ) {question.option_a}
                                  </div>
                                  <div
                                    className={`p-2 rounded ${
                                      question.correct_answers.includes("B")
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-gray-700"
                                    }`}
                                  >
                                    ب) {question.option_b}
                                  </div>
                                  {question.option_c && (
                                    <div
                                      className={`p-2 rounded ${
                                        question.correct_answers.includes("C")
                                          ? "bg-green-100 text-green-700"
                                          : "bg-blue-100 text-gray-700"
                                      }`}
                                    >
                                      ج) {question.option_c}
                                    </div>
                                  )}
                                  {question.option_d && (
                                    <div
                                      className={`p-2 rounded ${
                                        question.correct_answers.includes("D")
                                          ? "bg-green-100 text-green-700"
                                          : "bg-blue-100 text-gray-700"
                                      }`}
                                    >
                                      د) {question.option_d}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 space-x-reverse ml-4">
                                <button
                                  onClick={() =>
                                    setEditingQuestion(question.id)
                                  }
                                  className="p-1 bg-blue-200 text-gray-900 rounded hover:bg-blue-300 transition-colors"
                                  title="تعديل السؤال"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Question Modal */}
                    {showAddQuestion === exam.id && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-blue-50 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                          <h4 className="text-xl font-semibold text-gray-900 mb-4">
                            إضافة سؤال جديد إلى {exam.title}
                          </h4>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (editingQuestionData) {
                                handleAddQuestion(exam.id, editingQuestionData);
                              }
                            }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-sm text-gray-700 mb-2">
                                نص السؤال
                              </label>
                              <textarea
                                value={editingQuestionData?.question_text || ""}
                                onChange={(e) =>
                                  setEditingQuestionData({
                                    ...editingQuestionData,
                                    question_text: e.target.value,
                                  })
                                }
                                className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                                rows={3}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700 mb-2">
                                رابط صورة السؤال (اختياري)
                              </label>
                              <input
                                type="url"
                                value={
                                  editingQuestionData?.question_image_url || ""
                                }
                                onChange={(e) =>
                                  setEditingQuestionData({
                                    ...editingQuestionData,
                                    question_image_url: e.target.value,
                                  })
                                }
                                className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm text-gray-700 mb-2">
                                  الخيار A
                                </label>
                                <input
                                  type="text"
                                  value={editingQuestionData?.option_a || ""}
                                  onChange={(e) =>
                                    setEditingQuestionData({
                                      ...editingQuestionData,
                                      option_a: e.target.value,
                                    })
                                  }
                                  className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-700 mb-2">
                                  الخيار B
                                </label>
                                <input
                                  type="text"
                                  value={editingQuestionData?.option_b || ""}
                                  onChange={(e) =>
                                    setEditingQuestionData({
                                      ...editingQuestionData,
                                      option_b: e.target.value,
                                    })
                                  }
                                  className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                                  required
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm text-gray-700 mb-2">
                                  الخيار C (اختياري)
                                </label>
                                <input
                                  type="text"
                                  value={editingQuestionData?.option_c || ""}
                                  onChange={(e) =>
                                    setEditingQuestionData({
                                      ...editingQuestionData,
                                      option_c: e.target.value,
                                    })
                                  }
                                  className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-700 mb-2">
                                  الخيار D (اختياري)
                                </label>
                                <input
                                  type="text"
                                  value={editingQuestionData?.option_d || ""}
                                  onChange={(e) =>
                                    setEditingQuestionData({
                                      ...editingQuestionData,
                                      option_d: e.target.value,
                                    })
                                  }
                                  className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700 mb-2">
                                الإجابات الصحيحة (A , B , C , D - مفصولة بفواصل)
                              </label>
                              <input
                                type="text"
                                value={
                                  editingQuestionData?.correct_answers?.join(
                                    ", "
                                  ) || ""
                                }
                                onChange={(e) =>
                                  setEditingQuestionData({
                                    ...editingQuestionData,
                                    correct_answers: e.target.value
                                      .split(",")
                                      .map((s) => s.trim().toUpperCase())
                                      .filter((s) =>
                                        ["A", "B", "C", "D"].includes(s)
                                      ),
                                  })
                                }
                                className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                                placeholder="أ، ب"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700 mb-2">
                                النقاط
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={editingQuestionData?.points || 1}
                                onChange={(e) =>
                                  setEditingQuestionData({
                                    ...editingQuestionData,
                                    points: Number.parseInt(e.target.value),
                                  })
                                }
                                className="w-full bg-blue-100 text-gray-900 px-3 py-2 rounded border border-blue-300 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                              <button
                                type="button"
                                onClick={() => setShowAddQuestion(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                إلغاء
                              </button>
                              <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-300 text-gray-900 rounded-lg hover:bg-blue-400 transition-colors disabled:opacity-50"
                              >
                                {loading ? "جاري الإضافة..." : "إضافة سؤال"}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {activeTab === "results" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-600">
                نتائج الامتحانات
              </h2>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">إجمالي المحاولات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        examAttempts.filter((attempt) => attempt.is_completed)
                          .length
                      }
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">
                      تم الاجتياز {"(≥70%)"}
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {
                        examAttempts.filter(
                          (attempt) =>
                            attempt.is_completed && attempt.percentage >= 70
                        ).length
                      }
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-green-700" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">
                      لم يتم الاجتياز {"(<70%)"}
                    </p>
                    <p className="text-2xl font-bold text-red-700">
                      {
                        examAttempts.filter(
                          (attempt) =>
                            attempt.is_completed && attempt.percentage < 70
                        ).length
                      }
                    </p>
                  </div>
                  <Timer className="w-8 h-8 text-red-700" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">متوسط الدرجات</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {examAttempts.filter((attempt) => attempt.is_completed)
                        .length > 0
                        ? Math.round(
                            examAttempts
                              .filter((attempt) => attempt.is_completed)
                              .reduce(
                                (sum, attempt) => sum + attempt.percentage,
                                0
                              ) /
                              examAttempts.filter(
                                (attempt) => attempt.is_completed
                              ).length
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Exam Results List */}
            <div className="space-y-4">
              {examAttempts.filter((attempt) => attempt.is_completed).length ===
              0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    لم يتم العثور على نتائج امتحانات
                  </p>
                  <p className="text-gray-500 text-sm">
                    ستظهر محاولات الامتحانات المكتملة هنا
                  </p>
                </div>
              ) : (
                examAttempts
                  .filter((attempt) => attempt.is_completed)
                  .sort(
                    (a, b) =>
                      new Date(b.submitted_at || "").getTime() -
                      new Date(a.submitted_at || "").getTime()
                  )
                  .map((attempt) => {
                    const exam = exams.find((e) => e.id === attempt.exam_id);
                    const attemptAnswers = getAnswersForAttempt(attempt.id);
                    const isViewingThisAttempt = viewingAnswers === attempt.id;

                    return (
                      <div
                        key={attempt.id}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {getStudentName(attempt.user_code)}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              الكود: {attempt.user_code}
                            </p>
                            <p className="text-gray-500">
                              الامتحان: {exam?.title || "امتحان غير معروف"}
                            </p>
                            {exam?.course_id && (
                              <p className="text-gray-500 text-sm">
                                الدورة: {exam.course_id.toUpperCase()}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-2xl font-bold ${
                                attempt.percentage >= 70
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {attempt.percentage}%
                            </div>
                            <div className="text-gray-500 text-sm">
                              {attempt.total_score}/{attempt.max_score} نقاط
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-500">الحالة: </span>
                            <span
                              className={`font-semibold ${
                                attempt.percentage >= 70
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {attempt.percentage >= 70
                                ? "تم الاجتياز"
                                : "لم يتم الاجتياز"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              الوقت المستغرق:{" "}
                            </span>
                            <span className="text-gray-900">
                              {attempt.time_taken}ثانية
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              تاريخ التسليم:{" "}
                            </span>
                            <span className="text-gray-900">
                              {attempt.submitted_at
                                ? new Date(
                                    attempt.submitted_at
                                  ).toLocaleString()
                                : "غير متوفر"}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end mb-4">
                          <button
                            onClick={() =>
                              setViewingAnswers(
                                isViewingThisAttempt ? null : attempt.id
                              )
                            }
                            className="px-4 py-2 bg-blue-300 text-gray-900 rounded-lg hover:bg-blue-400 transition-colors font-medium"
                          >
                            {isViewingThisAttempt
                              ? "إخفاء الإجابات"
                              : "عرض الإجابات"}
                          </button>
                        </div>

                        {isViewingThisAttempt && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                              الإجابات التفصيلية
                            </h4>
                            {attemptAnswers.length === 0 ? (
                              <p className="text-gray-500">
                                لم يتم العثور على إجابات تفصيلية لهذه المحاولة.
                              </p>
                            ) : (
                              <div className="space-y-4">
                                {attemptAnswers.map((answer, index) => {
                                  const question = exam?.questions?.find(
                                    (q) => q.id === answer.question_id
                                  );
                                  return (
                                    <div
                                      key={answer.id}
                                      className="p-4 bg-blue-100 rounded-lg"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-medium text-gray-900">
                                          السؤال {index + 1}
                                        </h5>
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${
                                              answer.is_correct
                                                ? "bg-green-300 text-gray-900"
                                                : "bg-red-300 text-gray-900"
                                            }`}
                                          >
                                            {answer.is_correct
                                              ? "صحيحة"
                                              : "غير صحيحة"}
                                          </span>
                                          <span className="text-gray-500 text-sm">
                                            {answer.points_earned}/
                                            {question?.points || 1} نقاط
                                          </span>
                                        </div>
                                      </div>

                                      {question && (
                                        <>
                                          <p className="text-gray-700 mb-3">
                                            {question.question_text}
                                          </p>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                            {["A", "B", "C", "D"].map(
                                              (option) => {
                                                const optionText = question[
                                                  `option_${option.toLowerCase()}` as keyof typeof question
                                                ] as string;
                                                const isSelected =
                                                  answer.selected_answers.includes(
                                                    option
                                                  );
                                                const isCorrect =
                                                  question.correct_answers.includes(
                                                    option
                                                  );

                                                return (
                                                  <div
                                                    key={option}
                                                    className={`p-2 rounded border ${
                                                      isSelected && isCorrect
                                                        ? "bg-green-300 border-green-300 text-gray-900"
                                                        : isSelected &&
                                                          !isCorrect
                                                        ? "bg-red-300 border-red-300 text-gray-900"
                                                        : !isSelected &&
                                                          isCorrect
                                                        ? "bg-green-100 border-green-300 text-green-700"
                                                        : "bg-blue-100 border-blue-300 text-gray-700"
                                                    }`}
                                                  >
                                                    <span className="font-medium">
                                                      {option}:
                                                    </span>{" "}
                                                    {optionText}
                                                    {isSelected && (
                                                      <span className="ml-2 text-xs">
                                                        (تم الاختيار)
                                                      </span>
                                                    )}
                                                    {!isSelected &&
                                                      isCorrect && (
                                                        <span className="ml-2 text-xs">
                                                          (صحيحة)
                                                        </span>
                                                      )}
                                                  </div>
                                                );
                                              }
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

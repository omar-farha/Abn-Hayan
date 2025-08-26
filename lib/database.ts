import { supabase } from "./supabase";
import type {
  AccessCode,
  UserProgress,
  Course,
  Session,
  ProjectCategory,
  Project,
  ProjectProgress,
  SessionProgress,
  Exam,
  ExamQuestion,
  ExamAttempt,
  ExamAnswer, // Added ExamAnswer type
} from "./supabase";

// Supabase service functions
const supabaseService = {
  accessCodes: {
    async getAll(): Promise<AccessCode[]> {
      const { data, error } = await supabase
        .from("access_codes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async create(
      accessCode: Omit<AccessCode, "id" | "created_at">
    ): Promise<AccessCode> {
      const { data, error } = await supabase
        .from("access_codes")
        .insert(accessCode)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(
      id: string,
      updates: Partial<AccessCode>
    ): Promise<AccessCode> {
      const { data, error } = await supabase
        .from("access_codes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from("access_codes")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },

    async findByCode(code: string): Promise<AccessCode | null> {
      const { data, error } = await supabase
        .from("access_codes")
        .select("*")
        .eq("code", code)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    },
  },

  userProgress: {
    async getAll(): Promise<UserProgress[]> {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .order("last_activity", { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async findByUserCode(userCode: string): Promise<UserProgress | null> {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_code", userCode)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    },

    async upsert(
      progress: Omit<UserProgress, "id" | "created_at" | "updated_at">
    ): Promise<UserProgress> {
      const { data, error } = await supabase
        .from("user_progress")
        .upsert(progress, { onConflict: "user_code" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async updateLoginCount(userCode: string): Promise<void> {
      const { error } = await supabase.rpc("increment_login_count", {
        user_code: userCode,
      });
      if (error) throw error;
    },
  },

  courses: {
    async getAll(): Promise<Course[]> {
      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .order("created_at");
      if (coursesError) throw coursesError;

      const { data: sessions, error: sessionsError } = await supabase
        .from("sessions")
        .select("*")
        .order("order_index");
      if (sessionsError) throw sessionsError;

      const coursesWithSessions =
        courses?.map((course) => ({
          ...course,
          sessions:
            sessions?.filter((session) => session.course_id === course.id) ||
            [],
        })) || [];

      return coursesWithSessions;
    },

    async update(courseId: string, updates: Partial<Course>): Promise<Course> {
      const { data, error } = await supabase
        .from("courses")
        .update(updates)
        .eq("id", courseId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async updateSession(
      courseId: string,
      sessionId: string,
      updates: Partial<Session>
    ): Promise<Session> {
      const { data, error } = await supabase
        .from("sessions")
        .update(updates)
        .eq("course_id", courseId)
        .eq("id", sessionId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  projects: {
    async getAll(): Promise<ProjectCategory[]> {
      const { data: categories, error: categoriesError } = await supabase
        .from("project_categories")
        .select("*")
        .order("created_at");
      if (categoriesError) throw categoriesError;

      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at");
      if (projectsError) throw projectsError;

      const categoriesWithProjects =
        categories?.map((category) => ({
          ...category,
          projects:
            projects?.filter(
              (project) => project.category_id === category.id
            ) || [],
        })) || [];

      return categoriesWithProjects;
    },
    async createCategory(categoryData: {
      title: string;
      description?: string;
      icon?: string;
    }): Promise<ProjectCategory> {
      try {
        const { data, error } = await supabase
          .from("project_categories")
          .insert([
            {
              title: categoryData.title,
              description: categoryData.description || "",
              icon: categoryData.icon || "🚀",
            },
          ])
          .select()
          .single();

        if (error) {
          console.error("Error creating category:", error);
          throw new Error(`Failed to create category: ${error.message}`);
        }

        return {
          id: data.id,
          title: data.title,
          description: data.description,
          icon: data.icon,
          projects: [],
        };
      } catch (error) {
        console.error("Error in createCategory:", error);
        throw error;
      }
    },
    async updateCategory(
      categoryId: string,
      updates: Partial<ProjectCategory>
    ): Promise<ProjectCategory> {
      const { data, error } = await supabase
        .from("project_categories")
        .update(updates)
        .eq("id", categoryId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async updateProject(
      categoryId: string,
      projectId: string,
      updates: Partial<Project>
    ): Promise<Project> {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("category_id", categoryId)
        .eq("id", projectId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async createProject(
      project: Omit<Project, "created_at" | "updated_at">
    ): Promise<Project> {
      const { data, error } = await supabase
        .from("projects")
        .insert(project)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async deleteProject(categoryId: string, projectId: string): Promise<void> {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("category_id", categoryId)
        .eq("id", projectId);
      if (error) throw error;
    },
  },

  sessionProgress: {
    async findByUser(userCode: string): Promise<SessionProgress[]> {
      const { data, error } = await supabase
        .from("session_progress")
        .select("*")
        .eq("user_code", userCode);
      if (error) throw error;
      return data || [];
    },

    async upsert(
      progress: Omit<SessionProgress, "id" | "created_at" | "updated_at">
    ): Promise<SessionProgress> {
      const { data, error } = await supabase
        .from("session_progress")
        .upsert(progress, { onConflict: "user_code,course_id,session_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async findByUserAndSession(
      userCode: string,
      courseId: string,
      sessionId: string
    ): Promise<SessionProgress | null> {
      const { data, error } = await supabase
        .from("session_progress")
        .select("*")
        .eq("user_code", userCode)
        .eq("course_id", courseId)
        .eq("session_id", sessionId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    },
  },

  projectProgress: {
    async findByUser(userCode: string): Promise<ProjectProgress[]> {
      const { data, error } = await supabase
        .from("project_progress")
        .select("*")
        .eq("user_code", userCode);
      if (error) throw error;
      return data || [];
    },

    async upsert(
      progress: Omit<ProjectProgress, "id" | "created_at" | "updated_at">
    ): Promise<ProjectProgress> {
      const { data, error } = await supabase
        .from("project_progress")
        .upsert(progress, { onConflict: "user_code,project_id,category_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async findByUserAndProject(
      userCode: string,
      categoryId: string,
      projectId: string
    ): Promise<ProjectProgress | null> {
      const { data, error } = await supabase
        .from("project_progress")
        .select("*")
        .eq("user_code", userCode)
        .eq("category_id", categoryId)
        .eq("project_id", projectId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    },
  },

  exams: {
    async getAll(): Promise<Exam[]> {
      const { data: exams, error: examsError } = await supabase
        .from("exams")
        .select("*")
        .order("created_at", { ascending: false });
      if (examsError) throw examsError;

      // Fetch questions for each exam
      const examsWithQuestions = await Promise.all(
        (exams || []).map(async (exam) => {
          const { data: questions, error: questionsError } = await supabase
            .from("exam_questions")
            .select("*")
            .eq("exam_id", exam.id)
            .order("order_index");

          if (questionsError) {
            console.error(
              "Error fetching questions for exam:",
              exam.id,
              questionsError
            );
            return { ...exam, questions: [] };
          }

          return { ...exam, questions: questions || [] };
        })
      );

      return examsWithQuestions;
    },

    async create(
      exam: Omit<Exam, "id" | "created_at" | "updated_at">
    ): Promise<Exam> {
      const { data, error } = await supabase
        .from("exams")
        .insert(exam)
        .select()
        .single();
      if (error) {
        console.error("[v0] Database error creating exam:", error);
        throw error;
      }
      console.log("[v0] Exam created in database:", data);
      return data;
    },

    async update(id: string, updates: Partial<Exam>): Promise<Exam> {
      const { data, error } = await supabase
        .from("exams")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from("exams").delete().eq("id", id);
      if (error) throw error;
    },

    async getById(id: string): Promise<Exam | null> {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("id", id)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    },

    async getActiveExams(): Promise<Exam[]> {
      const { data: exams, error: examsError } = await supabase
        .from("exams")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (examsError) throw examsError;

      // Fetch questions for each active exam
      const examsWithQuestions = await Promise.all(
        (exams || []).map(async (exam) => {
          const { data: questions, error: questionsError } = await supabase
            .from("exam_questions")
            .select("*")
            .eq("exam_id", exam.id)
            .order("order_index");

          if (questionsError) {
            console.error(
              "Error fetching questions for exam:",
              exam.id,
              questionsError
            );
            return { ...exam, questions: [] };
          }

          return { ...exam, questions: questions || [] };
        })
      );

      return examsWithQuestions;
    },
  },

  examQuestions: {
    async getByExamId(examId: string): Promise<ExamQuestion[]> {
      const { data, error } = await supabase
        .from("exam_questions")
        .select("*")
        .eq("exam_id", examId)
        .order("order_index");
      if (error) throw error;
      return data || [];
    },

    async create(
      question: Omit<ExamQuestion, "id" | "created_at">
    ): Promise<ExamQuestion> {
      const { data, error } = await supabase
        .from("exam_questions")
        .insert(question)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(
      id: string,
      updates: Partial<ExamQuestion>
    ): Promise<ExamQuestion> {
      const { data, error } = await supabase
        .from("exam_questions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from("exam_questions")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },

    async deleteByExamId(examId: string): Promise<void> {
      const { error } = await supabase
        .from("exam_questions")
        .delete()
        .eq("exam_id", examId);
      if (error) throw error;
    },
  },

  examAttempts: {
    async getAll(): Promise<ExamAttempt[]> {
      const { data, error } = await supabase
        .from("exam_attempts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async getByUserCode(userCode: string): Promise<ExamAttempt[]> {
      const { data, error } = await supabase
        .from("exam_attempts")
        .select("*")
        .eq("user_code", userCode)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async getByExamId(examId: string): Promise<ExamAttempt[]> {
      const { data, error } = await supabase
        .from("exam_attempts")
        .select("*")
        .eq("exam_id", examId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async create(
      attempt: Omit<ExamAttempt, "id" | "created_at">
    ): Promise<ExamAttempt> {
      const { data, error } = await supabase
        .from("exam_attempts")
        .insert(attempt)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(
      id: string,
      updates: Partial<ExamAttempt>
    ): Promise<ExamAttempt> {
      const { data, error } = await supabase
        .from("exam_attempts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async findByUserAndExam(
      userCode: string,
      examId: string
    ): Promise<ExamAttempt | null> {
      const { data, error } = await supabase
        .from("exam_attempts")
        .select("*")
        .eq("user_code", userCode)
        .eq("exam_id", examId)
        .eq("is_completed", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    },
  },

  examAnswers: {
    async getAll(): Promise<ExamAnswer[]> {
      const { data, error } = await supabase
        .from("exam_answers")
        .select("*")
        .order("answered_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async getByAttemptId(attemptId: string): Promise<ExamAnswer[]> {
      const { data, error } = await supabase
        .from("exam_answers")
        .select("*")
        .eq("attempt_id", attemptId)
        .order("answered_at");
      if (error) throw error;
      return data || [];
    },

    async getByQuestionId(questionId: string): Promise<ExamAnswer[]> {
      const { data, error } = await supabase
        .from("exam_answers")
        .select("*")
        .eq("question_id", questionId)
        .order("answered_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async create(
      answer: Omit<ExamAnswer, "id" | "answered_at">
    ): Promise<ExamAnswer> {
      const { data, error } = await supabase
        .from("exam_answers")
        .insert(answer)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(
      id: string,
      updates: Partial<ExamAnswer>
    ): Promise<ExamAnswer> {
      const { data, error } = await supabase
        .from("exam_answers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },
};

// Export the Supabase service as the default database service
export const accessCodeService = supabaseService.accessCodes;
export const userProgressService = supabaseService.userProgress;
export const courseService = supabaseService.courses;
export const projectService = supabaseService.projects;
export const sessionProgressService = supabaseService.sessionProgress;
export const projectProgressService = supabaseService.projectProgress;
export const examService = supabaseService.exams;
export const examQuestionService = supabaseService.examQuestions;
export const examAttemptService = supabaseService.examAttempts;
export const examAnswerService = supabaseService.examAnswers; // Added exam answer service export
// Export configuration status
export const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

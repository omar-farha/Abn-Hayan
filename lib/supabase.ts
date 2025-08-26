import { createClient } from "@supabase/supabase-js";

// Check if we're in development and provide fallback values
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Validate environment variables
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.warn(
    "⚠️ Supabase environment variables not found. Using localStorage fallback."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

// Database Types
export interface AccessCode {
  id: string;
  code: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
  is_active: boolean;
  last_access?: string;
}

export interface UserProgress {
  id: string;
  user_code: string;
  customer_name: string;
  completed_sessions: string[];
  last_activity: string;
  current_course?: string;
  current_session?: string;
  login_count: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  sessions: Session[];
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  assignment: string;
  tasks?: string[];
  video_url?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  category_id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  technologies: string[];
  requirements: string[];
  instructions: string;
  demo_url?: string;
  source_code?: string;
  video_url?: string;
  estimated_time: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectProgress {
  id: string;
  user_code: string;
  project_id: string;
  category_id: string;
  completed_requirements: string[];
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SessionProgress {
  id: string;
  user_code: string;
  course_id: string;
  session_id: string;
  completed_tasks: string[];
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Exam {
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

export interface ExamQuestion {
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
  created_at: string;
  updated_at: string;
}

export interface ExamAttempt {
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
  created_at: string;
  updated_at: string;
}

export interface ExamAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answers: string[];
  is_correct: boolean;
  points_earned: number;
  answered_at: string;
}

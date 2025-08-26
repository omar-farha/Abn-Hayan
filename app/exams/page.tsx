"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, FileText, Loader2, Play } from "lucide-react";
import { ExamInterface } from "@/components/exam-interface";
import { ExamResults } from "@/components/exam-results";
import { accessCodeService } from "@/lib/database";
import Navbar from "@/components/navbar";

interface Exam {
  id: string;
  title: string;
  description: string;
  course_id: string | null;
  total_duration: number;
  per_question_time_limit: number | null;
  is_active: boolean;
  questions: ExamQuestion[];
}

interface ExamQuestion {
  id: string;
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
  answers: Record<string, string[]>;
  question_results: any[];
}

export default function ExamsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userCode, setUserCode] = useState<string>("");
  const [exams, setExams] = useState<Exam[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showExamInterface, setShowExamInterface] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const validateAccess = async () => {
      try {
        const accessCode = localStorage.getItem("access_code");

        if (!accessCode) {
          router.push("/");
          return;
        }

        const accessData = await accessCodeService.findByCode(accessCode);

        if (!accessData || !accessData.is_active) {
          localStorage.removeItem("access_code");
          router.push("/");
          return;
        }

        setIsAuthenticated(true);
        setUserCode(accessCode);
        await loadExamData();
      } catch (error) {
        console.error("Error validating access:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    validateAccess();
  }, [router]);

  const loadExamData = async () => {
    try {
      console.log("[v0] Loading exam data from database...");
      const { examService, examAttemptService } = await import(
        "@/lib/database"
      );

      const [examsData, attemptsData] = await Promise.all([
        examService.getActiveExams(),
        examAttemptService.getByUserCode(userCode),
      ]);

      console.log("[v0] Loaded exams:", examsData);
      console.log("[v0] Loaded attempts:", attemptsData);
      setExams(examsData);
      setExamAttempts(attemptsData);
    } catch (error) {
      console.error("Error loading exam data:", error);
    }
  };

  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    setShowExamInterface(true);
  };

  const handleExamSubmit = async (
    answers: Record<string, string[]>,
    timeSpent: number
  ) => {
    if (!selectedExam) return;

    try {
      console.log("[v0] Submitting exam:", selectedExam.id, answers);
      // Calculate score
      let totalScore = 0;
      let maxScore = 0;
      const questionResults = selectedExam.questions.map((question) => {
        const userAnswers = answers[question.id] || [];
        const isCorrect =
          userAnswers.length === question.correct_answers.length &&
          userAnswers.every((answer) =>
            question.correct_answers.includes(answer)
          );

        const pointsEarned = isCorrect ? question.points : 0;
        totalScore += pointsEarned;
        maxScore += question.points;

        return {
          question_id: question.id,
          question_text: question.question_text,
          user_answers: userAnswers,
          correct_answers: question.correct_answers,
          is_correct: isCorrect,
          points_earned: pointsEarned,
          points_possible: question.points,
        };
      });

      const percentage = Math.round((totalScore / maxScore) * 100);

      const { examAttemptService } = await import("@/lib/database");

      const attemptData = {
        exam_id: selectedExam.id,
        user_code: userCode,
        started_at: new Date(Date.now() - timeSpent * 1000).toISOString(),
        submitted_at: new Date().toISOString(),
        time_taken: timeSpent,
        total_score: totalScore,
        max_score: maxScore,
        percentage,
        is_completed: true,
      };

      const savedAttempt = await examAttemptService.create(attemptData);
      console.log("[v0] Exam attempt saved:", savedAttempt);

      const { supabase } = await import("@/lib/supabase");

      for (const questionResult of questionResults) {
        await supabase.from("exam_answers").insert({
          attempt_id: savedAttempt.id,
          question_id: questionResult.question_id,
          selected_answers: questionResult.user_answers,
          is_correct: questionResult.is_correct,
          points_earned: questionResult.points_earned,
        });
      }

      // Create result object
      const result = {
        id: savedAttempt.id,
        exam_title: selectedExam.title,
        total_score: totalScore,
        max_score: maxScore,
        percentage,
        time_taken: timeSpent,
        submitted_at: savedAttempt.submitted_at,
        question_results: questionResults,
      };

      setExamResult(result);
      setShowExamInterface(false);
      setShowResults(true);

      // Reload exam data to update attempt history
      await loadExamData();
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Error submitting exam. Please try again.");
    }
  };

  const getUserAttempts = (examId: string) => {
    return examAttempts.filter(
      (attempt) => attempt.exam_id === examId && attempt.user_code === userCode
    );
  };

  const getBestScore = (examId: string) => {
    const attempts = getUserAttempts(examId);
    if (attempts.length === 0) return null;
    return Math.max(...attempts.map((a) => a.percentage));
  };

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

        <div className="container mx-auto px-5 md:px-7 lg:px-12 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-[#0fd8d7] hover:text-[#0bc5c4] mb-8 transition-all duration-300 hover:transform hover:translate-x-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="mb-16 animate-fade-in-up animation-delay-400">
            <div className="flex items-center mb-6">
              <h1 className="text-5xl h-fit py-5 bg-gradient-to-r from-[#0fd8d7] to-white bg-clip-text text-transparent font-bold">
                الامتحانات
              </h1>
            </div>
          </div>

          {/* Exams Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  No exams available at the moment
                </p>
                <p className="text-gray-500">
                  Check back later for new assessments
                </p>
              </div>
            ) : (
              exams.map((exam) => {
                const userAttempts = getUserAttempts(exam.id);
                const bestScore = getBestScore(exam.id);
                const hasAttempted = userAttempts.length > 0;

                return (
                  <div
                    key={exam.id}
                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-2xl p-6 border border-gray-700/50 hover:border-[#0fd8d7]/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-[#0fd8d7]/20 backdrop-blur-sm"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {exam.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {exam.description}
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        {exam.total_duration} minutes
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <FileText className="w-4 h-4 mr-2" />
                        {exam.questions?.length || 0} questions
                      </div>
                      {exam.per_question_time_limit && (
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          {exam.per_question_time_limit}s per question
                        </div>
                      )}
                    </div>

                    {/* Attempt History */}
                    {hasAttempted && (
                      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">
                            Best Score:
                          </span>
                          <span
                            className={`font-bold ${
                              bestScore! >= 70
                                ? "text-green-400"
                                : "text-yellow-400"
                            }`}
                          >
                            {bestScore}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            Attempts:
                          </span>
                          <span className="text-white">
                            {userAttempts.length}
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleStartExam(exam)}
                      disabled={!exam.is_active}
                      className="w-full bg-gradient-to-r from-[#0fd8d7] to-[#0bc5c4] text-black font-semibold py-3 px-4 rounded-lg hover:from-[#0bc5c4] hover:to-[#0fd8d7] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {hasAttempted ? "Retake Exam" : "Start Exam"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Exam Interface Modal */}
      {selectedExam && (
        <ExamInterface
          isOpen={showExamInterface}
          onClose={() => {
            setShowExamInterface(false);
            setSelectedExam(null);
          }}
          exam={selectedExam}
          userCode={userCode}
          onSubmit={handleExamSubmit}
        />
      )}

      {/* Results Modal */}
      {examResult && (
        <ExamResults
          isOpen={showResults}
          onClose={() => {
            setShowResults(false);
            setExamResult(null);
            setSelectedExam(null);
          }}
          result={examResult}
        />
      )}
    </div>
  );
}

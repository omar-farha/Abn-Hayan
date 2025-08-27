"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Clock,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Flag,
} from "lucide-react";

interface ExamQuestion {
  id: string;
  question_text: string;
  question_image_url: string | null;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  points: number;
  order_index: number;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  total_duration: number;
  per_question_time_limit: number | null;
  questions: ExamQuestion[];
}

interface ExamInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam;
  userCode: string;
  onSubmit: (answers: Record<string, string[]>, timeSpent: number) => void;
}

export function ExamInterface({
  isOpen,
  onClose,
  exam,
  userCode,
  onSubmit,
}: ExamInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(exam.total_duration * 60); // Convert to seconds
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState<
    number | null
  >(exam.per_question_time_limit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [examStartTime] = useState(Date.now());
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();
  const questionTimerRef = useRef<NodeJS.Timeout>();

  const currentQuestion = exam.questions[currentQuestionIndex];
  const totalQuestions = exam.questions.length;
  const [showReloadModal, setShowReloadModal] = useState(false);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        e.preventDefault();
        setShowReloadModal(true);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const confirmReload = () => {
    window.location.reload(); // force reload
  };
  // Timer effects
  useEffect(() => {
    if (!isOpen) return;

    // Main exam timer
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !exam.per_question_time_limit) return;

    // Per-question timer
    setQuestionTimeRemaining(exam.per_question_time_limit);

    questionTimerRef.current = setInterval(() => {
      setQuestionTimeRemaining((prev) => {
        if (prev && prev <= 1) {
          // Auto-advance to next question when time runs out
          if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          }
          return exam.per_question_time_limit;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, [
    isOpen,
    currentQuestionIndex,
    exam.per_question_time_limit,
    totalQuestions,
  ]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (
    questionId: string,
    option: string,
    isChecked: boolean
  ) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];

      if (isChecked) {
        return { ...prev, [questionId]: [...currentAnswers, option] };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((a) => a !== option),
        };
      }
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      if (exam.per_question_time_limit) {
        setQuestionTimeRemaining(exam.per_question_time_limit);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      if (exam.per_question_time_limit) {
        setQuestionTimeRemaining(exam.per_question_time_limit);
      }
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
    if (exam.per_question_time_limit) {
      setQuestionTimeRemaining(exam.per_question_time_limit);
    }
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleAutoSubmit = () => {
    const timeSpent = Math.floor((Date.now() - examStartTime) / 1000);
    onSubmit(answers, timeSpent);
  };

  const handleManualSubmit = () => {
    setIsSubmitting(true);
    const timeSpent = Math.floor((Date.now() - examStartTime) / 1000);

    // Clear timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);

    onSubmit(answers, timeSpent);
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).filter(
      (questionId) => answers[questionId] && answers[questionId].length > 0
    ).length;
  };

  const getQuestionStatus = (questionId: string, index: number) => {
    const isAnswered = answers[questionId] && answers[questionId].length > 0;
    const isFlagged = flaggedQuestions.has(questionId);
    const isCurrent = index === currentQuestionIndex;

    if (isCurrent) return "current";
    if (isAnswered) return "answered";
    if (isFlagged) return "flagged";
    return "unanswered";
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex"
      lang="en"
      dir="ltr"
    >
      {showReloadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg max-w-sm text-center">
            <h2 className="text-lg font-bold mb-3">Confirm Reload</h2>
            <p className="text-gray-300 mb-5">
              Reloading the page may cause you to lose progress. Are you sure
              you want to reload?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowReloadModal(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Continue Exam
              </button>
              <button
                onClick={confirmReload}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500"
              >
                Reload Anyway
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Sidebar */}

      {/* Main Exam Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-700 p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{exam.title}</h2>
              <p className="text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>

            {/* Timers + Exit */}
            <div className="flex items-center space-x-6">
              {questionTimeRemaining !== null && (
                <div className="flex items-center text-yellow-400 font-mono text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(questionTimeRemaining)}
                </div>
              )}
              <div
                className={`flex items-center font-mono text-lg ${
                  timeRemaining < 300 ? "text-red-400" : "text-[#0fd8d7]"
                }`}
              >
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(timeRemaining)}
              </div>
              <button
                onClick={() => setShowExitConfirm(true)}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
                title="Exit Exam"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        {showExitConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-sm">
              <h2 className="text-lg font-bold text-white mb-3">
                Are you sure?
              </h2>
              <p className="text-gray-300 text-sm mb-5">
                You cannot close the exam before submitting. Do you want to
                continue your exam?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Continue Exam
                </button>
                {/* Optional: if you want to allow submitting directly */}
                {/* 
        <button
          onClick={handleManualSubmit}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
        >
          Submit & Exit
        </button> 
        */}
              </div>
            </div>
          </div>
        )}

        {/* Question Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="bg-[#0fd8d7] text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 shadow-md">
                  {currentQuestionIndex + 1}
                </span>
                <span className="text-sm text-gray-400">
                  {currentQuestion.points} point
                  {currentQuestion.points !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Flag Button */}
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`p-2 rounded-lg transition ${
                  flaggedQuestions.has(currentQuestion.id)
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
                title="Flag for review"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <h3 className="text-lg md:text-xl text-white mb-4 leading-relaxed">
                {currentQuestion.question_text}
              </h3>
              {currentQuestion.question_image_url && (
                <img
                  src={currentQuestion.question_image_url}
                  alt="Question illustration"
                  className="max-w-full h-auto rounded-lg border border-gray-600 mb-6 shadow-md"
                />
              )}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {["A", "B", "C", "D"]
                .map((key) => ({
                  key,
                  text: currentQuestion[`option_${key.toLowerCase()}`],
                }))
                .filter((option) => option.text)
                .map((option) => (
                  <label
                    key={option.key}
                    className="flex items-start p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-[#0fd8d7]/70 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={
                        answers[currentQuestion.id]?.includes(option.key) ||
                        false
                      }
                      onChange={(e) =>
                        handleAnswerChange(
                          currentQuestion.id,
                          option.key,
                          e.target.checked
                        )
                      }
                      className="mt-1 mr-4 w-4 h-4 text-[#0fd8d7] bg-gray-700 border-gray-600 rounded focus:ring-[#0fd8d7] focus:ring-2"
                    />
                    <div className="flex-1">
                      <span className="text-[#0fd8d7] font-semibold mr-2">
                        {option.key})
                      </span>
                      <span className="text-white">{option.text}</span>
                    </div>
                  </label>
                ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-md"
              >
                Submit Exam
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center px-4 py-2 bg-[#0fd8d7] text-black rounded-lg hover:bg-[#0bc5c4] transition font-semibold shadow-md"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-700">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Submit Exam?</h3>
            </div>

            <div className="mb-6 space-y-2 text-sm text-gray-300">
              <p>
                You have answered {getAnsweredCount()} of {totalQuestions}{" "}
                questions.
              </p>
              <p>Time remaining: {formatTime(timeRemaining)}</p>
              <p className="text-yellow-400">
                Once submitted, you cannot make changes.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Continue Exam
              </button>
              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-semibold"
              >
                {isSubmitting ? "Submitting..." : "Submit Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

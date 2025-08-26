"use client"

import { useState } from "react"
import { X, CheckCircle, XCircle, Trophy, BarChart3, Download } from "lucide-react"

interface ExamResult {
  id: string
  exam_title: string
  total_score: number
  max_score: number
  percentage: number
  time_taken: number
  submitted_at: string
  question_results: QuestionResult[]
}

interface QuestionResult {
  question_id: string
  question_text: string
  user_answers: string[]
  correct_answers: string[]
  is_correct: boolean
  points_earned: number
  points_possible: number
}

interface ExamResultsProps {
  isOpen: boolean
  onClose: () => void
  result: ExamResult
}

export function ExamResults({ isOpen, onClose, result }: ExamResultsProps) {
  const [showDetailedResults, setShowDetailedResults] = useState(false)

  if (!isOpen) return null

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-400"
    if (percentage >= 80) return "text-blue-400"
    if (percentage >= 70) return "text-yellow-400"
    if (percentage >= 60) return "text-orange-400"
    return "text-red-400"
  }

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return "A"
    if (percentage >= 80) return "B"
    if (percentage >= 70) return "C"
    if (percentage >= 60) return "D"
    return "F"
  }

  const correctAnswers = result.question_results.filter((q) => q.is_correct).length
  const totalQuestions = result.question_results.length

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center">
            <Trophy className="w-6 h-6 text-[#0fd8d7] mr-3" />
            <h2 className="text-2xl font-bold text-white">Exam Results</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Overall Results */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <div className={`text-6xl font-bold mb-2 ${getGradeColor(result.percentage)}`}>{result.percentage}%</div>
              <div className={`text-3xl font-bold mb-4 ${getGradeColor(result.percentage)}`}>
                Grade: {getGradeLetter(result.percentage)}
              </div>
              <h3 className="text-xl text-white mb-2">{result.exam_title}</h3>
              <p className="text-gray-400">Completed on {new Date(result.submitted_at).toLocaleDateString()}</p>
            </div>

            {/* Score Breakdown */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-[#0fd8d7] mb-1">{result.total_score}</div>
                <div className="text-sm text-gray-400">Points Earned</div>
                <div className="text-xs text-gray-500">out of {result.max_score}</div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400 mb-1">{correctAnswers}</div>
                <div className="text-sm text-gray-400">Correct</div>
                <div className="text-xs text-gray-500">out of {totalQuestions}</div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-400 mb-1">{totalQuestions - correctAnswers}</div>
                <div className="text-sm text-gray-400">Incorrect</div>
                <div className="text-xs text-gray-500">questions</div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400 mb-1">{formatTime(result.time_taken)}</div>
                <div className="text-sm text-gray-400">Time Taken</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    result.percentage >= 70
                      ? "bg-gradient-to-r from-green-500 to-green-400"
                      : result.percentage >= 60
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                        : "bg-gradient-to-r from-red-500 to-red-400"
                  }`}
                  style={{ width: `${result.percentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-400">
                {result.percentage >= 70 ? "Passed" : "Failed"} - {result.percentage}% Score
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setShowDetailedResults(!showDetailedResults)}
              className="flex items-center px-4 py-2 bg-[#0fd8d7] text-black rounded-lg hover:bg-[#0bc5c4] transition-colors font-semibold"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {showDetailedResults ? "Hide" : "Show"} Detailed Results
            </button>

            <button
              onClick={() => {
                // TODO: Implement PDF export
                console.log("Export results as PDF")
              }}
              className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>

          {/* Detailed Results */}
          {showDetailedResults && (
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white mb-4">Question-by-Question Results</h4>

              {result.question_results.map((questionResult, index) => (
                <div
                  key={questionResult.question_id}
                  className={`bg-gray-800/50 rounded-lg p-4 border ${
                    questionResult.is_correct ? "border-green-500/30" : "border-red-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center mb-1">
                          {questionResult.is_correct ? (
                            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mr-2" />
                          )}
                          <span
                            className={`font-semibold ${questionResult.is_correct ? "text-green-400" : "text-red-400"}`}
                          >
                            {questionResult.is_correct ? "Correct" : "Incorrect"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {questionResult.points_earned} / {questionResult.points_possible} points
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-white mb-2">{questionResult.question_text}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Your Answer(s):</p>
                      <div className="space-y-1">
                        {questionResult.user_answers.length > 0 ? (
                          questionResult.user_answers.map((answer, i) => (
                            <span
                              key={i}
                              className={`inline-block px-2 py-1 rounded text-xs mr-1 ${
                                questionResult.correct_answers.includes(answer)
                                  ? "bg-green-900/30 text-green-400"
                                  : "bg-red-900/30 text-red-400"
                              }`}
                            >
                              {answer}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 italic">No answer selected</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-400 mb-1">Correct Answer(s):</p>
                      <div className="space-y-1">
                        {questionResult.correct_answers.map((answer, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-1 rounded text-xs mr-1 bg-green-900/30 text-green-400"
                          >
                            {answer}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

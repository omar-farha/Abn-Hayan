"use client"

import { useState, useEffect } from "react"
import { X, TrendingUp, Users, Award, BarChart3, Download } from "lucide-react"
import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

interface ExamAnalyticsProps {
  isOpen: boolean
  onClose: () => void
  examId?: string
  userCode?: string
}

interface AnalyticsData {
  totalAttempts: number
  completedAttempts: number
  averageScore: number
  averageTime: number
  passRate: number
  scoreDistribution: { range: string; count: number }[]
  timeDistribution: { range: string; count: number }[]
  questionAnalytics: QuestionAnalytics[]
  userPerformance?: UserPerformance[]
}

interface QuestionAnalytics {
  questionId: string
  questionText: string
  correctRate: number
  averageTime: number
  commonWrongAnswers: { answer: string; count: number }[]
}

interface UserPerformance {
  attemptDate: string
  score: number
  timeSpent: number
  percentage: number
}

export function ExamAnalytics({ isOpen, onClose, examId, userCode }: ExamAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "questions" | "users" | "trends">("overview")

  useEffect(() => {
    if (isOpen) {
      loadAnalyticsData()
    }
  }, [isOpen, examId, userCode])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual service calls
      const mockData: AnalyticsData = {
        totalAttempts: 45,
        completedAttempts: 42,
        averageScore: 78.5,
        averageTime: 1680, // seconds
        passRate: 73.8,
        scoreDistribution: [
          { range: "0-20%", count: 2 },
          { range: "21-40%", count: 3 },
          { range: "41-60%", count: 8 },
          { range: "61-80%", count: 15 },
          { range: "81-100%", count: 14 },
        ],
        timeDistribution: [
          { range: "0-10min", count: 5 },
          { range: "11-20min", count: 12 },
          { range: "21-30min", count: 18 },
          { range: "31-40min", count: 7 },
        ],
        questionAnalytics: [
          {
            questionId: "q1",
            questionText: "Which HTML element is used to define the main content?",
            correctRate: 85.7,
            averageTime: 45,
            commonWrongAnswers: [
              { answer: "B", count: 4 },
              { answer: "C", count: 2 },
            ],
          },
          {
            questionId: "q2",
            questionText: "Which are semantic HTML elements?",
            correctRate: 62.3,
            averageTime: 78,
            commonWrongAnswers: [
              { answer: "B", count: 8 },
              { answer: "D", count: 6 },
            ],
          },
        ],
        userPerformance: userCode
          ? [
              { attemptDate: "2024-01-15", score: 85, timeSpent: 1200, percentage: 85 },
              { attemptDate: "2024-01-20", score: 92, timeSpent: 1050, percentage: 92 },
            ]
          : undefined,
      }

      setAnalyticsData(mockData)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportAnalytics = () => {
    if (!analyticsData) return

    const csvData = [
      ["Metric", "Value"],
      ["Total Attempts", analyticsData.totalAttempts.toString()],
      ["Completed Attempts", analyticsData.completedAttempts.toString()],
      ["Average Score", analyticsData.averageScore.toFixed(1)],
      ["Pass Rate", `${analyticsData.passRate}%`],
      ["Average Time", `${Math.floor(analyticsData.averageTime / 60)}m ${analyticsData.averageTime % 60}s`],
      [],
      ["Score Distribution"],
      ...analyticsData.scoreDistribution.map((item) => [item.range, item.count.toString()]),
      [],
      ["Question Analytics"],
      ["Question", "Correct Rate", "Avg Time"],
      ...analyticsData.questionAnalytics.map((q) => [
        q.questionText.substring(0, 50) + "...",
        `${q.correctRate}%`,
        `${q.averageTime}s`,
      ]),
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `exam-analytics-${examId || "all"}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0fd8d7] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) return null

  // Chart configurations
  const scoreDistributionData = {
    labels: analyticsData.scoreDistribution.map((item) => item.range),
    datasets: [
      {
        label: "Number of Students",
        data: analyticsData.scoreDistribution.map((item) => item.count),
        backgroundColor: "rgba(15, 216, 215, 0.6)",
        borderColor: "rgba(15, 216, 215, 1)",
        borderWidth: 1,
      },
    ],
  }

  const timeDistributionData = {
    labels: analyticsData.timeDistribution.map((item) => item.range),
    datasets: [
      {
        data: analyticsData.timeDistribution.map((item) => item.count),
        backgroundColor: [
          "rgba(15, 216, 215, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  }

  const userPerformanceData = analyticsData.userPerformance
    ? {
        labels: analyticsData.userPerformance.map((attempt) => new Date(attempt.attemptDate).toLocaleDateString()),
        datasets: [
          {
            label: "Score %",
            data: analyticsData.userPerformance.map((attempt) => attempt.percentage),
            borderColor: "rgba(15, 216, 215, 1)",
            backgroundColor: "rgba(15, 216, 215, 0.1)",
            tension: 0.4,
          },
        ],
      }
    : null

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#9ca3af",
        },
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "#9ca3af",
        },
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
      },
    },
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex">
      <div className="w-full max-w-7xl mx-auto m-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 text-[#0fd8d7] mr-3" />
            <h2 className="text-2xl font-bold text-white">
              {userCode ? "My Performance Analytics" : "Exam Analytics"}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportAnalytics}
              className="flex items-center px-4 py-2 bg-[#0fd8d7] text-black rounded-lg hover:bg-[#0bc5c4] transition-colors font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 px-6 py-4 border-b border-gray-700">
          {[
            { key: "overview", label: "Overview", icon: TrendingUp },
            { key: "questions", label: "Questions", icon: BarChart3 },
            ...(userCode ? [] : [{ key: "users", label: "Users", icon: Users }]),
            ...(userCode ? [{ key: "trends", label: "My Progress", icon: Award }] : []),
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === key ? "bg-[#0fd8d7] text-black" : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-5 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-[#0fd8d7] mb-2">{analyticsData.totalAttempts}</div>
                  <div className="text-sm text-gray-400">Total Attempts</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{analyticsData.completedAttempts}</div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{analyticsData.averageScore.toFixed(1)}%</div>
                  <div className="text-sm text-gray-400">Avg Score</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{analyticsData.passRate}%</div>
                  <div className="text-sm text-gray-400">Pass Rate</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {Math.floor(analyticsData.averageTime / 60)}m
                  </div>
                  <div className="text-sm text-gray-400">Avg Time</div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Score Distribution</h3>
                  <Bar data={scoreDistributionData} options={chartOptions} />
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Time Distribution</h3>
                  <Pie data={timeDistributionData} options={{ responsive: true }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "questions" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Question Performance Analysis</h3>
              {analyticsData.questionAnalytics.map((question, index) => (
                <div key={question.questionId} className="bg-gray-800/50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-[#0fd8d7] text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </span>
                        <h4 className="text-lg font-semibold text-white">{question.questionText}</h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold mb-1 ${
                          question.correctRate >= 80
                            ? "text-green-400"
                            : question.correctRate >= 60
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {question.correctRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">Correct Rate</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <div className="text-lg font-bold text-blue-400 mb-1">{question.averageTime}s</div>
                      <div className="text-sm text-gray-400">Average Time</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <div className="text-lg font-bold text-red-400 mb-1">
                        {question.commonWrongAnswers.reduce((sum, ans) => sum + ans.count, 0)}
                      </div>
                      <div className="text-sm text-gray-400">Wrong Answers</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-2">Most Common Mistakes:</div>
                      <div className="space-y-1">
                        {question.commonWrongAnswers.slice(0, 2).map((wrong, i) => (
                          <div key={i} className="text-xs text-red-400">
                            Option {wrong.answer}: {wrong.count} times
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar for correct rate */}
                  <div className="mt-4">
                    <div className="bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          question.correctRate >= 80
                            ? "bg-green-400"
                            : question.correctRate >= 60
                              ? "bg-yellow-400"
                              : "bg-red-400"
                        }`}
                        style={{ width: `${question.correctRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "users" && !userCode && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">User Performance Overview</h3>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-400 text-center py-8">
                  Detailed user analytics will be available when connected to the database. This will show individual
                  student performance, completion rates, and progress tracking.
                </p>
              </div>
            </div>
          )}

          {activeTab === "trends" && userCode && userPerformanceData && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">My Progress Over Time</h3>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <Line data={userPerformanceData} options={chartOptions} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Attempt History</h4>
                  <div className="space-y-3">
                    {analyticsData.userPerformance?.map((attempt, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <div>
                          <div className="text-white font-medium">Attempt #{index + 1}</div>
                          <div className="text-sm text-gray-400">
                            {new Date(attempt.attemptDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              attempt.percentage >= 80
                                ? "text-green-400"
                                : attempt.percentage >= 60
                                  ? "text-yellow-400"
                                  : "text-red-400"
                            }`}
                          >
                            {attempt.percentage}%
                          </div>
                          <div className="text-sm text-gray-400">
                            {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Performance Summary</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Best Score:</span>
                      <span className="text-green-400 font-bold">
                        {Math.max(...(analyticsData.userPerformance?.map((a) => a.percentage) || [0]))}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Average Score:</span>
                      <span className="text-blue-400 font-bold">
                        {(
                          analyticsData.userPerformance?.reduce((sum, a) => sum + a.percentage, 0) /
                          (analyticsData.userPerformance?.length || 1)
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total Attempts:</span>
                      <span className="text-white font-bold">{analyticsData.userPerformance?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Improvement:</span>
                      <span
                        className={`font-bold ${
                          (analyticsData.userPerformance?.[analyticsData.userPerformance.length - 1]?.percentage || 0) >
                          (analyticsData.userPerformance?.[0]?.percentage || 0)
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {analyticsData.userPerformance && analyticsData.userPerformance.length > 1
                          ? `${analyticsData.userPerformance[analyticsData.userPerformance.length - 1].percentage - analyticsData.userPerformance[0].percentage > 0 ? "+" : ""}${(analyticsData.userPerformance[analyticsData.userPerformance.length - 1].percentage - analyticsData.userPerformance[0].percentage).toFixed(1)}%`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

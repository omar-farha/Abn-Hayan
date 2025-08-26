"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  X,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Users,
  BarChart3,
  Download,
  Trophy,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { courses } from "@/lib/course-data"
import { examAttemptService, examService } from "@/lib/database"

interface AccessCode {
  id: string
  code: string
  customerName: string
  customerPhone: string
  createdAt: string
  isActive: boolean
  lastAccess?: string
  totalSessions?: number
}

interface UserProgress {
  userCode: string
  customerName: string
  completedSessions: string[]
  lastActivity: string
  currentCourse?: string
  currentSession?: string
  totalTimeSpent?: number
  loginCount: number
}

interface ExamAttempt {
  id: string
  exam_id: string
  user_code: string
  started_at: string
  submitted_at: string | null
  time_taken: number | null
  total_score: number
  max_score: number
  percentage: number
  is_completed: boolean
  created_at?: string // Added for clarity
}

interface Exam {
  id: string
  title: string
  description: string
  course_id: string | null
  total_duration: number
  is_active: boolean
}

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [newCustomerName, setNewCustomerName] = useState("")
  const [newCustomerPhone, setNewCustomerPhone] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<"codes" | "tracking" | "examResults">("codes")

  const ADMIN_PASSWORD = "admin123" // Change this to your desired admin password

  useEffect(() => {
    if (isOpen) {
      loadAccessCodes()
      loadUserProgress()
      loadExamData()
    }
  }, [isOpen])

  const loadAccessCodes = () => {
    const stored = localStorage.getItem("accessCodes")
    if (stored) {
      setAccessCodes(JSON.parse(stored))
    }
  }

  const loadUserProgress = () => {
    const stored = localStorage.getItem("userProgressTracking")
    if (stored) {
      setUserProgress(JSON.parse(stored))
    }
  }

  const loadExamData = async () => {
    try {
      console.log("[v0] Loading exam data...")
      const [attemptsData, examsData] = await Promise.all([examAttemptService.getAll(), examService.getAll()])
      console.log("[v0] Loaded exams:", examsData)
      console.log("[v0] Loaded attempts:", attemptsData)
      setExamAttempts(attemptsData)
      setExams(examsData)
    } catch (error) {
      console.error("Error loading exam data:", error)
    }
  }

  const saveAccessCodes = (codes: AccessCode[]) => {
    localStorage.setItem("accessCodes", JSON.stringify(codes))
    setAccessCodes(codes)
  }

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert("Invalid admin password")
    }
  }

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
      alert("Please fill in all fields")
      return
    }

    const newCode: AccessCode = {
      id: Date.now().toString(),
      code: generateCode(),
      customerName: newCustomerName.trim(),
      customerPhone: newCustomerPhone.trim(),
      createdAt: new Date().toISOString(),
      isActive: true,
      totalSessions: 0,
    }

    const updatedCodes = [...accessCodes, newCode]
    saveAccessCodes(updatedCodes)
    setNewCustomerName("")
    setNewCustomerPhone("")
  }

  const toggleCodeStatus = (id: string) => {
    const updatedCodes = accessCodes.map((code) => (code.id === id ? { ...code, isActive: !code.isActive } : code))
    saveAccessCodes(updatedCodes)
  }

  const deleteCode = (id: string) => {
    if (confirm("Are you sure you want to delete this access code?")) {
      const updatedCodes = accessCodes.filter((code) => code.id !== id)
      saveAccessCodes(updatedCodes)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Code copied to clipboard!")
  }

  const getProgressPercentage = (completedSessions: string[]) => {
    const totalSessions = courses.reduce((total, course) => total + course.sessions.length, 0)
    return Math.round((completedSessions.length / totalSessions) * 100)
  }

  const getCurrentCourseInfo = (userCode: string) => {
    const progress = userProgress.find((p) => p.userCode === userCode)
    if (!progress || !progress.currentCourse) return null

    const course = courses.find((c) => c.id === progress.currentCourse)
    const session = course?.sessions.find((s) => s.id === progress.currentSession)

    return { course, session }
  }

  const exportProgressData = () => {
    const csvData = getAllUsers().map((progress) => {
      const customer = accessCodes.find((code) => code.code === progress.userCode)
      const currentInfo = getCurrentCourseInfo(progress.userCode)
      const userExamResults = getUserExamResults(progress.userCode)
      const avgExamScore =
        userExamResults.length > 0
          ? Math.round(userExamResults.reduce((sum, attempt) => sum + attempt.percentage, 0) / userExamResults.length)
          : 0

      return {
        "Customer Name": customer?.customerName || progress.customerName,
        Phone: customer?.customerPhone || "Unknown",
        "Access Code": progress.userCode,
        "Completed Sessions": progress.completedSessions.length,
        "Progress %": getProgressPercentage(progress.completedSessions),
        "Current Course": currentInfo?.course?.title || "Not started",
        "Current Session": currentInfo?.session?.title || "Not started",
        "Login Count": progress.loginCount,
        "Last Activity": new Date(progress.lastActivity).toLocaleString(),
        "Exams Taken": userExamResults.length,
        "Average Exam Score": avgExamScore + "%",
      }
    })

    const csvContent = [
      Object.keys(csvData[0] || {}).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `student-progress-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getUserExamResults = (userCode: string) => {
    return examAttempts.filter((attempt) => attempt.user_code === userCode && attempt.is_completed)
  }

  const getExamTitle = (examId: string) => {
    const exam = exams.find((e) => e.id === examId)
    return exam?.title || "Unknown Exam"
  }

  const formatTime = (seconds: number | null) => {
    if (!seconds) return "N/A"
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

  const getAllUsers = () => {
    const progressUsers = new Set(userProgress.map((p) => p.userCode))
    const examUsers = new Set(examAttempts.map((a) => a.user_code))

    // Combine all unique user codes
    const allUserCodes = new Set([...progressUsers, ...examUsers])

    return Array.from(allUserCodes).map((userCode) => {
      const existingProgress = userProgress.find((p) => p.userCode === userCode)

      // If user has progress data, use it; otherwise create minimal progress entry
      if (existingProgress) {
        return existingProgress
      } else {
        // Create minimal progress entry for exam-only users
        const userAttempts = examAttempts.filter((a) => a.user_code === userCode)
        const latestAttempt = userAttempts.sort(
          (a, b) => new Date(b.created_at || b.started_at).getTime() - new Date(a.created_at || a.started_at).getTime(),
        )[0]

        return {
          userCode,
          customerName: `Student ${userCode}`, // Default name for exam-only users
          completedSessions: [],
          lastActivity: latestAttempt?.submitted_at || latestAttempt?.started_at || new Date().toISOString(),
          loginCount: 0,
        }
      }
    })
  }

  if (!isOpen) return null

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#0fd8d7]">Admin Access</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#0fd8d7] transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0fd8d7] to-[#0bc5c4] text-black font-semibold py-3 px-6 rounded-lg hover:from-[#0bc5c4] hover:to-[#0fd8d7] transition-all duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#0fd8d7]">Admin Panel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("codes")}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === "codes"
                ? "border-[#0fd8d7] text-[#0fd8d7]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Access Codes
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === "tracking"
                ? "border-[#0fd8d7] text-[#0fd8d7]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Student Tracking
          </button>
          <button
            onClick={() => setActiveTab("examResults")}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === "examResults"
                ? "border-[#0fd8d7] text-[#0fd8d7]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            Exam Results
          </button>
        </div>

        {activeTab === "codes" && (
          <>
            {/* Generate New Code Form */}
            <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-[#0fd8d7]" />
                Generate New Access Code
              </h3>
              <form onSubmit={handleGenerateCode} className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0fd8d7]"
                  required
                />
                <input
                  type="tel"
                  placeholder="Customer Phone"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0fd8d7]"
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#0fd8d7] to-[#0bc5c4] text-black font-semibold py-2 px-4 rounded-lg hover:from-[#0bc5c4] hover:to-[#0fd8d7] transition-all duration-300"
                >
                  Generate Code
                </button>
              </form>
            </div>

            {/* Access Codes List */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Access Codes ({accessCodes.length})</h3>
              <div className="space-y-3">
                {accessCodes.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No access codes generated yet.</p>
                ) : (
                  accessCodes.map((codeData) => {
                    const progress = userProgress.find((p) => p.userCode === codeData.code)
                    const currentInfo = getCurrentCourseInfo(codeData.code)

                    return (
                      <div
                        key={codeData.id}
                        className={`bg-gray-800/50 rounded-lg p-4 border ${
                          codeData.isActive ? "border-green-500/30" : "border-red-500/30"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <span className="font-mono text-lg font-bold text-[#0fd8d7]">{codeData.code}</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  codeData.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {codeData.isActive ? "Active" : "Inactive"}
                              </span>
                              {progress && (
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                                  {getProgressPercentage(progress.completedSessions)}% Complete
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-300 grid md:grid-cols-2 gap-2">
                              <div>
                                <p>
                                  <strong>Customer:</strong> {codeData.customerName}
                                </p>
                                <p>
                                  <strong>Phone:</strong> {codeData.customerPhone}
                                </p>
                                <p>
                                  <strong>Created:</strong> {new Date(codeData.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              {progress && (
                                <div>
                                  <p>
                                    <strong>Logins:</strong> {progress.loginCount}
                                  </p>
                                  <p>
                                    <strong>Sessions Done:</strong> {progress.completedSessions.length}
                                  </p>
                                  <p>
                                    <strong>Current:</strong> {currentInfo?.course?.title || "Not started"}
                                  </p>
                                  <p>
                                    <strong>Last Active:</strong> {new Date(progress.lastActivity).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyToClipboard(codeData.code)}
                              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                              title="Copy Code"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleCodeStatus(codeData.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                codeData.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                              }`}
                              title={codeData.isActive ? "Deactivate" : "Activate"}
                            >
                              {codeData.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => deleteCode(codeData.id)}
                              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                              title="Delete Code"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "tracking" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-[#0fd8d7]" />
                Student Progress Tracking ({getAllUsers().length} students)
              </h3>
              <button
                onClick={exportProgressData}
                className="bg-gradient-to-r from-[#0fd8d7] to-[#0bc5c4] text-black font-semibold py-2 px-4 rounded-lg hover:from-[#0bc5c4] hover:to-[#0fd8d7] transition-all duration-300 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>

            {getAllUsers().length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No student activity yet.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Students will appear here once they start using their access codes or take exams.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getAllUsers().map((progress) => {
                  const customer = accessCodes.find((code) => code.code === progress.userCode)
                  const currentInfo = getCurrentCourseInfo(progress.userCode)
                  const progressPercentage = getProgressPercentage(progress.completedSessions)
                  const userExamResults = getUserExamResults(progress.userCode)

                  return (
                    <div key={progress.userCode} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-1">
                            {customer?.customerName || progress.customerName}
                          </h4>
                          <p className="text-gray-400">Code: {progress.userCode}</p>
                          {!customer && userExamResults.length > 0 && (
                            <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full mt-1">
                              Exam Only
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#0fd8d7] mb-1">{progressPercentage}%</div>
                          <div className="text-sm text-gray-400">Complete</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="bg-gray-700 rounded-full h-2 mb-2">
                          <div
                            className="bg-gradient-to-r from-[#0fd8d7] to-[#0bc5c4] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {progress.completedSessions.length} of{" "}
                          {courses.reduce((total, course) => total + course.sessions.length, 0)} sessions completed
                        </div>
                      </div>

                      {/* Current Status */}
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">Current Course</p>
                          <p className="text-white font-semibold">{currentInfo?.course?.title || "Not started"}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Current Session</p>
                          <p className="text-white font-semibold">{currentInfo?.session?.title || "Not started"}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Activity</p>
                          <p className="text-white font-semibold">{progress.loginCount} logins</p>
                          <p className="text-gray-400 text-xs">
                            Last: {new Date(progress.lastActivity).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Exam Results Section */}
                      {userExamResults.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex items-center mb-3">
                            <Trophy className="w-4 h-4 text-[#0fd8d7] mr-2" />
                            <p className="text-gray-400 text-sm">Exam Results ({userExamResults.length} completed):</p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            {userExamResults.map((attempt) => (
                              <div key={attempt.id} className="bg-gray-700/30 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-white truncate">
                                    {getExamTitle(attempt.exam_id)}
                                  </span>
                                  <div className="flex items-center">
                                    {attempt.percentage >= 70 ? (
                                      <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-400 mr-1" />
                                    )}
                                    <span className={`text-sm font-bold ${getGradeColor(attempt.percentage)}`}>
                                      {attempt.percentage}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                  <span>
                                    Score: {attempt.total_score}/{attempt.max_score}
                                  </span>
                                  <span>Time: {formatTime(attempt.time_taken)}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(attempt.submitted_at || attempt.started_at).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Exam Summary Stats */}
                          <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                            <div className="bg-gray-700/20 rounded-lg p-2">
                              <div className="text-lg font-bold text-[#0fd8d7]">
                                {Math.round(
                                  userExamResults.reduce((sum, attempt) => sum + attempt.percentage, 0) /
                                    userExamResults.length,
                                )}
                                %
                              </div>
                              <div className="text-xs text-gray-400">Avg Score</div>
                            </div>
                            <div className="bg-gray-700/20 rounded-lg p-2">
                              <div className="text-lg font-bold text-green-400">
                                {userExamResults.filter((attempt) => attempt.percentage >= 70).length}
                              </div>
                              <div className="text-xs text-gray-400">Passed</div>
                            </div>
                            <div className="bg-gray-700/20 rounded-lg p-2">
                              <div className="text-lg font-bold text-red-400">
                                {userExamResults.filter((attempt) => attempt.percentage < 70).length}
                              </div>
                              <div className="text-xs text-gray-400">Failed</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Course Progress Breakdown */}
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-gray-400 mb-2 text-sm">Course Progress:</p>
                        <div className="grid md:grid-cols-3 gap-4">
                          {courses.map((course) => {
                            const courseCompletedSessions = progress.completedSessions.filter((sessionKey) =>
                              sessionKey.startsWith(`${course.id}-`),
                            ).length
                            const courseProgress = Math.round((courseCompletedSessions / course.sessions.length) * 100)

                            return (
                              <div key={course.id} className="bg-gray-700/30 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-white">{course.title}</span>
                                  <span className="text-xs text-[#0fd8d7]">{courseProgress}%</span>
                                </div>
                                <div className="bg-gray-600 rounded-full h-1">
                                  <div
                                    className="bg-[#0fd8d7] h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${courseProgress}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {courseCompletedSessions}/{course.sessions.length} sessions
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "examResults" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-[#0fd8d7]" />
                Exam Results ({examAttempts.filter((attempt) => attempt.is_completed).length} completed attempts)
              </h3>
            </div>

            {examAttempts.filter((attempt) => attempt.is_completed).length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No exam attempts yet.</p>
                <p className="text-sm text-gray-500 mt-2">Completed exam attempts will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Exam Results Summary Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-[#0fd8d7] mb-1">
                      {examAttempts.filter((attempt) => attempt.is_completed).length}
                    </div>
                    <div className="text-sm text-gray-400">Total Attempts</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {examAttempts.filter((attempt) => attempt.is_completed && attempt.percentage >= 70).length}
                    </div>
                    <div className="text-sm text-gray-400">Passed ({"≥70%"})</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400 mb-1">
                      {examAttempts.filter((attempt) => attempt.is_completed && attempt.percentage < 70).length}
                    </div>
                    <div className="text-sm text-gray-400">Failed ({"<70%"})</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {examAttempts.filter((attempt) => attempt.is_completed).length > 0
                        ? Math.round(
                            examAttempts
                              .filter((attempt) => attempt.is_completed)
                              .reduce((sum, attempt) => sum + attempt.percentage, 0) /
                              examAttempts.filter((attempt) => attempt.is_completed).length,
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-400">Average Score</div>
                  </div>
                </div>

                {/* Individual Exam Attempts */}
                <div className="space-y-3">
                  {examAttempts
                    .filter((attempt) => attempt.is_completed)
                    .sort(
                      (a, b) =>
                        new Date(b.submitted_at || b.started_at).getTime() -
                        new Date(a.submitted_at || a.started_at).getTime(),
                    )
                    .map((attempt) => {
                      const customer = accessCodes.find((code) => code.code === attempt.user_code)
                      const examTitle = getExamTitle(attempt.exam_id)

                      return (
                        <div key={attempt.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-lg font-semibold text-white">{examTitle}</h4>
                                <div className="flex items-center">
                                  {attempt.percentage >= 70 ? (
                                    <CheckCircle className="w-5 h-5 text-green-400 mr-1" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-400 mr-1" />
                                  )}
                                  <span className={`text-lg font-bold ${getGradeColor(attempt.percentage)}`}>
                                    {attempt.percentage}%
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-300">
                                <p>
                                  <strong>Student:</strong> {customer?.customerName || `Student ${attempt.user_code}`}
                                </p>
                                <p>
                                  <strong>User Code:</strong> {attempt.user_code}
                                </p>
                                {customer?.customerPhone && (
                                  <p>
                                    <strong>Phone:</strong> {customer.customerPhone}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400 mb-1">
                                {new Date(attempt.submitted_at || attempt.started_at).toLocaleString()}
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  attempt.percentage >= 70
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {attempt.percentage >= 70 ? "PASSED" : "FAILED"}
                              </div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <p className="text-gray-400 mb-1">Score</p>
                              <p className="text-white font-semibold text-lg">
                                {attempt.total_score}/{attempt.max_score}
                              </p>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <p className="text-gray-400 mb-1">Time Taken</p>
                              <p className="text-white font-semibold text-lg">{formatTime(attempt.time_taken)}</p>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <p className="text-gray-400 mb-1">Started At</p>
                              <p className="text-white font-semibold">
                                {new Date(attempt.started_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

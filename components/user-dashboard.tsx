"use client"

import { useState, useEffect } from "react"
import { X, BarChart3, BookOpen, CheckCircle, Clock, Trophy, Rocket, FileText } from "lucide-react"
import { userProgressService, courseService, projectService, sessionProgressService } from "@/lib/database"
import { ExamAnalytics } from "./exam-analytics"

interface UserDashboardProps {
  isOpen: boolean
  onClose: () => void
  userCode: string
}

export function UserDashboard({ isOpen, onClose, userCode }: UserDashboardProps) {
  const [userProgress, setUserProgress] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [sessionProgress, setSessionProgress] = useState<any[]>([])
  const [showExamAnalytics, setShowExamAnalytics] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && userCode) {
      loadProgress()
    }
  }, [isOpen, userCode])

  const loadProgress = async () => {
    setLoading(true)
    try {
      const [progressData, coursesData, projectsData, sessionProgressData] = await Promise.all([
        userProgressService.findByUserCode(userCode),
        courseService.getAll(),
        projectService.getAll(),
        sessionProgressService.findByUser(userCode),
      ])

      setUserProgress(progressData)
      setCourses(coursesData)
      setProjects(projectsData)
      setSessionProgress(sessionProgressData)
    } catch (error) {
      console.error("Error loading progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProgressPercentage = () => {
    if (!userProgress || !courses.length) return 0
    const totalSessions = courses.reduce((total, course) => total + course.sessions.length, 0)
    return Math.round((userProgress.completed_sessions.length / totalSessions) * 100)
  }

  const getCourseProgress = (courseId: string) => {
    if (!userProgress) return 0
    const course = courses.find((c) => c.id === courseId)
    if (!course) return 0

    const courseCompletedSessions = userProgress.completed_sessions.filter((session: string) =>
      session.startsWith(`${courseId}-`),
    )
    return Math.round((courseCompletedSessions.length / course.sessions.length) * 100)
  }

  const getProjectProgress = (categoryId: string) => {
    const category = projects.find((c) => c.id === categoryId)
    if (!category) return { completed: 0, total: 0 }

    // This would need to be implemented with project progress tracking
    return { completed: 0, total: category.projects.length }
  }

  const getCurrentCourse = () => {
    if (!userProgress?.current_course) return null
    return courses.find((c) => c.id === userProgress.current_course)
  }

  const getCurrentSession = () => {
    const currentCourse = getCurrentCourse()
    if (!currentCourse || !userProgress?.current_session) return null
    return currentCourse.sessions.find((s) => s.id === userProgress.current_session)
  }

  if (!isOpen) return null

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل التقدم...</p>
          </div>
        </div>
      </div>
    )
  }

  const progressPercentage = getProgressPercentage()
  const currentCourse = getCurrentCourse()
  const currentSession = getCurrentSession()

  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-blue-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-200">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 text-blue-600 ml-3" />
            <h2 className="text-2xl font-bold text-gray-900 font-serif">تقدم التعلم الخاص بي</h2>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setShowExamAnalytics(true)}
              className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              <FileText className="w-4 h-4 ml-2" />
              تحليل الامتحانات
            </button>
            <button onClick={onClose} className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Overall Progress */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-100/50 to-blue-200/30 rounded-xl p-6 border border-blue-300/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 font-serif">التقدم العام</h3>
                <div className="text-3xl font-bold text-blue-600">{progressPercentage}%</div>
              </div>

              <div className="mb-4">
                <div className="bg-blue-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {userProgress?.completed_sessions.length || 0}
                  </div>
                  <div className="text-gray-600">جلسات مكتملة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{userProgress?.login_count || 0}</div>
                  <div className="text-gray-600">إجمالي تسجيلات الدخول</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {courses.reduce((total, course) => total + course.sessions.length, 0) -
                      (userProgress?.completed_sessions.length || 0)}
                  </div>
                  <div className="text-gray-600">جلسات متبقية</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Activity */}
          {currentCourse && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center font-serif">
                <BookOpen className="w-5 h-5 ml-2 text-blue-600" />
                النشاط الحالي
              </h3>
              <div className="bg-gradient-to-r from-blue-100/50 to-blue-200/30 rounded-xl p-6 border border-blue-300/50">
                <div className="flex items-center mb-3">
                  <span className="text-2xl ml-3">{currentCourse.icon}</span>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 font-serif">{currentCourse.title}</h4>
                    {currentSession && <p className="text-gray-600">حالياً في: {currentSession.title}</p>}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  آخر نشاط:{" "}
                  {userProgress?.last_activity
                    ? new Date(userProgress.last_activity).toLocaleDateString("ar-EG")
                    : "أبداً"}
                </div>
              </div>
            </div>
          )}

          {/* Course Progress */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center font-serif">
              <Trophy className="w-5 h-5 ml-2 text-blue-600" />
              تقدم الدورات
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {courses.map((course) => {
                const courseProgress = getCourseProgress(course.id)
                const courseCompletedSessions =
                  userProgress?.completed_sessions.filter((session: string) => session.startsWith(`${course.id}-`))
                    .length || 0

                return (
                  <div
                    key={course.id}
                    className="bg-gradient-to-r from-blue-100/50 to-blue-200/30 rounded-xl p-4 border border-blue-300/50"
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-2xl ml-3">{course.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 font-serif">{course.title}</h4>
                        <div className="text-sm text-gray-600">
                          {courseCompletedSessions}/{course.sessions.length} جلسة
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${courseProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-sm font-semibold text-blue-600">{courseProgress}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Project Progress */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center font-serif">
              <Rocket className="w-5 h-5 ml-2 text-blue-600" />
              تقدم المشاريع
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((category) => {
                const projectProgress = getProjectProgress(category.id)
                const progressPercentage =
                  category.projects.length > 0
                    ? Math.round((projectProgress.completed / projectProgress.total) * 100)
                    : 0

                return (
                  <div
                    key={category.id}
                    className="bg-gradient-to-r from-blue-100/50 to-blue-200/30 rounded-xl p-4 border border-blue-300/50"
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-2xl ml-3">{category.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 font-serif">{category.title}</h4>
                        <div className="text-sm text-gray-600">
                          {projectProgress.completed}/{projectProgress.total} مشروع مكتمل
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="bg-purple-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-sm font-semibold text-purple-600">{progressPercentage}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center font-serif">
              <Clock className="w-5 h-5 ml-2 text-blue-600" />
              النشاط الأخير
            </h3>
            <div className="bg-gradient-to-r from-blue-100/50 to-blue-200/30 rounded-xl p-4 border border-blue-300/50">
              {userProgress?.completed_sessions.length > 0 ? (
                <div className="space-y-3">
                  {userProgress.completed_sessions
                    .slice(-5)
                    .reverse()
                    .map((sessionId: string, index: number) => {
                      const [courseId, sessionIdOnly] = sessionId.split("-")
                      const course = courses.find((c) => c.id === courseId)
                      const session = course?.sessions.find((s) => s.id === sessionIdOnly)

                      return (
                        <div key={index} className="flex items-center space-x-3 space-x-reverse">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">مكتمل: {session?.title || "جلسة غير معروفة"}</div>
                            <div className="text-xs text-gray-600">{course?.title || "دورة غير معروفة"}</div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">لا توجد جلسات مكتملة بعد</p>
                  <p className="text-sm text-gray-500">ابدأ التعلم لترى تقدمك هنا!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exam Analytics Modal */}
      <ExamAnalytics isOpen={showExamAnalytics} onClose={() => setShowExamAnalytics(false)} userCode={userCode} />
    </div>
  )
}

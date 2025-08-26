"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { accessCodeService, userProgressService } from "@/lib/database";

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccessGranted: (code: string) => void;
}

export function AccessCodeModal({
  isOpen,
  onClose,
  onAccessGranted,
}: AccessCodeModalProps) {
  const [accessCode, setAccessCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  useEffect(() => {
    if (isOpen) {
      setAccessCode("");
      setError("");
      setShowCode(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setError("يرجى إدخال كود الوصول");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const codeData = await accessCodeService.findByCode(
        accessCode.trim().toUpperCase()
      );

      if (!codeData) {
        setError("كود وصول غير صحيح");
        return;
      }

      if (!codeData.is_active) {
        setError("تم إلغاء تفعيل كود الوصول هذا");
        return;
      }

      // Update last access time
      await accessCodeService.update(codeData.id, {
        last_access: new Date().toISOString(),
      });

      // Update or create user progress
      try {
        const existingProgress = await userProgressService.findByUserCode(
          accessCode.trim().toUpperCase()
        );

        if (existingProgress) {
          await userProgressService.updateLoginCount(
            accessCode.trim().toUpperCase()
          );
        } else {
          await userProgressService.upsert({
            user_code: accessCode.trim().toUpperCase(),
            customer_name: codeData.customer_name,
            completed_sessions: [],
            last_activity: new Date().toISOString(),
            login_count: 1,
          });
        }
      } catch (progressError) {
        console.error("Error updating user progress:", progressError);
        // Continue anyway as the main authentication succeeded
      }

      // Store in localStorage for session management
      localStorage.setItem("access_code", accessCode.trim().toUpperCase());
      localStorage.setItem("customer_name", codeData.customer_name);

      onAccessGranted(accessCode.trim().toUpperCase());
    } catch (error) {
      console.error("Error verifying access code:", error);
      setError("خطأ في التحقق من كود الوصول. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="relative bg-gradient-to-br from-blue-950 via-slate-900 to-black rounded-3xl p-8 max-w-md w-full border border-blue-200 shadow-2xl animate-fade-in-up scale-95 animate-in duration-300">
        {/* Gradient Border Accent */}
        <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-br from-blue-950 via-slate-900 to-black -z-10"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white font-serif tracking-wide">
            أدخل كود الوصول
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كود الوصول
            </label>
            <div className="relative">
              <input
                type={showCode ? "text" : "password"}
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 shadow-sm"
                placeholder="أدخل الكود المكون من 8 أحرف"
                maxLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showCode ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "جاري التحقق..." : "دخول المنصة"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ليس لديك كود وصول؟{" "}
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">
              تواصل مع المدرس
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

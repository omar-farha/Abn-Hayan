import type React from "react";
import type { Metadata } from "next";
import { Cairo, Amiri, Roboto, Oi, Rakkas } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import TeacherSection from "@/components/teacher-section";
import GradesSection from "@/components/grades-section";
import Footer from "@/components/footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"], // اختار الأوزان اللي محتاجها
  variable: "--font-roboto",
});

const oi = Oi({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-oi",
});
const rakkas = Rakkas({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rakkas",
});
export const metadata: Metadata = {
  title: "منصة ابن حيان - الصف الثالث الثانوي",
  description:
    "اتقن علم الفيزياء مع دورات منظمة في الميكانيكا والكهرباء والضوء. دروس تفاعلية ومهام وتتبع التقدم.",
  themeColor: "#ffffff", // يخلي لون الثيم أبيض على كل الأجهزة
  colorScheme: "light", // يجبر المتصفح على استخدام Light Mode
  icons: {
    icon: "/logo22.png", // الأيقونة العادية
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${amiri.variable} ${roboto.variable} ${oi.variable} ${rakkas.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}

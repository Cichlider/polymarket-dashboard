// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Polymarket Data Dashboard | 简历项目",
  description: "使用 Next.js 和 Tailwind CSS 构建的 Polymarket 预测市场数据分析仪表板。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Navbar />
        <div className="min-h-[calc(100vh-64px)]"> 
          {children}
        </div>
      </body>
    </html>
  );
}
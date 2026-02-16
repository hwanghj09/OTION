import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Outfit } from 'next/font/google';

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "OTION - AI 패션 스타일리스트",
  description: "날씨와 신체 정보에 맞는 최적의 패션을 추천합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-slate-50 antialiased">
        <header className="bg-white/90 backdrop-blur-md p-4 sticky top-0 z-50 border-b flex justify-between items-center max-w-md mx-auto w-full">
          <Link href="/"><h1 className="text-2xl font-black text-blue-600 italic tracking-tighter cursor-pointer">OTION</h1></Link>
          <nav className="flex bg-slate-100 p-1 rounded-full">
            <Link href="/" className="px-4 py-1.5 rounded-full text-xs font-bold hover:bg-white transition">AI 추천</Link>
            <Link href="/community" className="px-4 py-1.5 rounded-full text-xs font-bold hover:bg-white transition">커뮤니티</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
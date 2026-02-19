import type { Metadata } from "next";
import Link from "next/link";
import { Outfit } from "next/font/google";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OTION - AI 패션 스타일리스트",
  description: "날씨와 신체 정보에 맞는 최적의 패션을 추천합니다.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="ko">
      <body className={`${outfit.className} antialiased`}>
        <div className="page-shell">
          <header className="panel relative mb-6 overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
            <span className="floating-dot left-[-12px] top-[-12px] h-14 w-14 bg-[#f7ba94]" />
            <span className="floating-dot bottom-[-10px] right-10 h-10 w-10 bg-[#9dd9c2]" />
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="inline-flex items-end gap-3">
                <strong className="font-display text-3xl font-extrabold tracking-tight text-[#5a2f1b]">OTION</strong>
                <span className="rounded-full border border-[#f0c09a] bg-[#fff1e5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c85f34]">
                  Studio
                </span>
              </Link>
              <nav className="flex w-full gap-2 sm:w-auto">
                <Link
                  href="/"
                  className="flex-1 rounded-xl border border-[#f2d1b5] bg-[#fff7f0] px-4 py-2 text-center text-sm font-bold text-[#7a4022] hover:bg-[#ffe8d5] sm:flex-none"
                >
                  AI 추천
                </Link>
                <Link
                  href="/community"
                  className="flex-1 rounded-xl border border-[#d2ebdf] bg-[#ecf9f3] px-4 py-2 text-center text-sm font-bold text-[#1f6a52] hover:bg-[#dff3ea] sm:flex-none"
                >
                  커뮤니티
                </Link>
                {user ? (
                  <>
                    <span className="flex-1 rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-4 py-2 text-center text-sm font-semibold text-[#6c422d] sm:flex-none">
                      {user.name || user.email}
                    </span>
                    <form action={signOut} className="flex-1 sm:flex-none">
                      <button
                        type="submit"
                        className="w-full rounded-xl border border-[#f0c3b0] bg-[#fff0ea] px-4 py-2 text-sm font-bold text-[#a3452a] hover:bg-[#ffe5db]"
                      >
                        로그아웃
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex-1 rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-4 py-2 text-center text-sm font-bold text-[#6c422d] hover:bg-[#fff0e4] sm:flex-none"
                    >
                      로그인
                    </Link>
                    <Link
                      href="/signup"
                      className="flex-1 rounded-xl border border-[#f0c6ac] bg-[#ffeede] px-4 py-2 text-center text-sm font-bold text-[#8c4929] hover:bg-[#ffe4ce] sm:flex-none"
                    >
                      회원가입
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/app/auth/actions";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signUp({ name, email, password });
    if (!result.ok) {
      setError(result.message ?? "회원가입에 실패했습니다.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="mx-auto max-w-md pb-12">
      <section className="panel p-6 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ce6237]">Signup</p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#3f2516]">회원가입</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            type="text"
            placeholder="이름 (선택)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#ef8354]"
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#ef8354]"
          />
          <input
            type="password"
            placeholder="비밀번호 (8자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#ef8354]"
          />

          {error && <p className="rounded-lg bg-[#ffe9e4] px-3 py-2 text-sm font-semibold text-[#9b3a25]">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-[#1f2a37] px-4 py-3 text-sm font-bold text-white disabled:bg-[#99a2ad]"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="mt-4 text-sm text-[#6f4f3d]">
          이미 계정이 있나요? <Link href="/login" className="font-bold text-[#ce6237]">로그인</Link>
        </p>
      </section>
    </main>
  );
}

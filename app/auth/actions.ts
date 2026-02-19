"use server";

import { prisma } from "@/lib/db";
import { clearSession, createSession, hashPassword, verifyPassword } from "@/lib/auth";

export async function signUp(input: { email: string; password: string; name?: string }) {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const name = input.name?.trim() || null;

  if (!email || !password) {
    return { ok: false, message: "이메일과 비밀번호를 입력해주세요." };
  }

  if (password.length < 8) {
    return { ok: false, message: "비밀번호는 8자 이상이어야 합니다." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, message: "이미 가입된 이메일입니다." };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
  });

  await createSession(user.id);
  return { ok: true };
}

export async function signIn(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    return { ok: false, message: "이메일과 비밀번호를 입력해주세요." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { ok: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  await createSession(user.id);
  return { ok: true };
}

export async function signOut() {
  await clearSession();
}

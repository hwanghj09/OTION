import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// 1. 모든 게시물 불러오기 (GET)
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc", // 최신순 정렬
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "게시물을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 2. 새로운 게시물 저장하기 (POST)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { image, description, temp, status, age, height, weight, gender } = body;

    // 필수 데이터 확인
    if (!image || temp === undefined || temp === null) {
      return NextResponse.json(
        { error: "이미지와 기온 정보는 필수입니다." },
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        image,         // Base64 문자열로 들어온 이미지 데이터
        description: description || "",
        temp: Number(temp),
        status: status || "정보 없음",
        age: Number(age ?? 25),
        height: Number(height ?? 170),
        weight: Number(weight ?? 65),
        gender: gender || "미지정",
        userId: user.id,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("DB 저장 에러:", error);
    return NextResponse.json(
      { error: "게시물을 저장하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

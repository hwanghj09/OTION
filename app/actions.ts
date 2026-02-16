"use server";

import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

// 추가적인 옵션 없이 깨끗하게 생성합니다.
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. AI 패션 추천 함수
// src/app/actions.ts 수정

export async function getAIAdvice(data: any) {
  const { gender, age, height, weight, style, purpose, temp, dust, status } = data;
  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

  const prompt = `당신은 세계적인 패션 스타일리스트입니다. 
    다음 사용자의 상세 정보를 바탕으로 'TPO(시간, 장소, 상황)'에 완벽히 맞는 코디를 추천해주세요.

    [사용자 프로필]
    - 나이/성별: ${age}세 / ${gender}
    - 신체: 키 ${height}cm, 몸무게 ${weight}kg (BMI: ${bmi})
    - 선호 스타일: ${style}
    - 외출 목적: ${purpose}

    [현재 환경]
    - 기온: ${temp}도
    - 날씨 상태: ${status}
    - 미세먼지: ${dust} (농도 수치)

    [요구사항]
    1. ${age}세라는 나이에 어울리면서 ${style} 느낌을 살린 코디여야 합니다.
    2. ${purpose}라는 상황에 적절한 격식을 갖춰주세요.
    3. 현재 기온(${temp}도)에서 춥거나 덥지 않은 구체적인 상/하의 및 외투를 추천하세요.
    4. 어울리는 신발과 액세서리도 포함하세요.

    응답은 반드시 아래 JSON 형식으로만 하세요:
    {
      "clothes": "추천 의상 (상/하의/외투/신발)",
      "style": "스타일링 핵심 팁 (나이와 상황 고려)",
      "colors": "어울리는 색상 조합",
      "dustAdvice": "날씨/미세먼지 관련 주의사항"
    }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: "전문 패션 스타일리스트로서 조언합니다." }, { role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}


export async function createPost(formData: any) {
    return await prisma.post.create({
        data: {
            image: formData.image,
            description: formData.description,
            temp: formData.temp,
            status: formData.status,
            age: parseInt(formData.age),
            height: parseInt(formData.height),
            weight: parseInt(formData.weight),
            gender: formData.gender,
        }
    });
}

// 커뮤니티: 게시물 가져오기
export async function getPosts() {
    return await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
}

// 커뮤니티: 반응하기
export async function updateReaction(id: number, type: 'like' | 'dislike') {
    return await prisma.post.update({
        where: { id },
        data: {
            likes: type === 'like' ? { increment: 1 } : undefined,
            dislikes: type === 'dislike' ? { increment: 1 } : undefined,
        }
    });
}
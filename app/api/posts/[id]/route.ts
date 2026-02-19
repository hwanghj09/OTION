import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { type } = await request.json(); // 'like' 또는 'dislike'
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        likes: type === "like" ? { increment: 1 } : undefined,
        dislikes: type === "dislike" ? { increment: 1 } : undefined,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });
  }
}

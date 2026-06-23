import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const block = await db.contentBlock.findUnique({
      where: { slug: "cases" },
    });
    if (!block) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ content: block.content });
  } catch (error) {
    console.error("[API /content/cases] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!["super_admin", "admin", "moderator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "object") {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const existingBlock = await db.contentBlock.findUnique({
      where: { slug: "cases" },
    });
    if (!existingBlock) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    const title = (content as Record<string, unknown>).title as string || existingBlock.title;

    const updated = await db.contentBlock.update({
      where: { slug: "cases" },
      data: {
        content,
        title,
        version: existingBlock.version + 1,
      },
    });

    return NextResponse.json({ success: true, content: updated.content });
  } catch (error) {
    console.error("[API /content/cases PUT] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

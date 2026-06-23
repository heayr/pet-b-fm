import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const block = await db.contentBlock.findUnique({
      where: { slug: "cases" },
    });
    if (!block) {
      console.log("[API /content/cases] Block not found");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.log("[API /content/cases] Returning content:", JSON.stringify(block.content).slice(0, 200));
    return NextResponse.json({ content: block.content });
  } catch (error) {
    console.error("[API /content/cases] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const block = await db.contentBlock.findUnique({
    where: { slug: "proposal" },
  });
  if (!block) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ content: block.content });
}
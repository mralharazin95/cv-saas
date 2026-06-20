import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Public, unauthenticated endpoint that powers the shareable portfolio page
// (/p/<slug>). Only resumes the owner has explicitly published (isPublic) are
// exposed, and we return just the fields the public renderer needs.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const resume = await prisma.resume.findFirst({
      where: { slug, isPublic: true },
      select: {
        title: true,
        templateId: true,
        colorHex: true,
        dataJson: true,
      },
    });

    if (!resume) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ resume }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

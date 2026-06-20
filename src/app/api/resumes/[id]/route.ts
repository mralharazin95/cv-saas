import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

async function getUserId(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.id as string | undefined;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const resume = await prisma.resume.findUnique({
      where: { id, userId },
      include: {
        personalInfo: true,
        experiences: true,
        educations: true,
        skills: true,
        projects: true,
        languages: true,
        certificates: true,
      }
    });

    if (!resume) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ resume }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    // The full builder state (all sections, free-text dates) is stored as
    // JSON; the scalar columns stay in sync so the dashboard list works.
    await prisma.resume.update({
      where: { id, userId },
      data: {
        title: typeof data.title === "string" ? data.title : undefined,
        colorHex: typeof data.colorHex === "string" ? data.colorHex : undefined,
        templateId: typeof data.templateId === "string" ? data.templateId : undefined,
        dataJson: JSON.stringify(data),
      },
    });

    return NextResponse.json({ message: "Saved" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await prisma.resume.delete({ where: { id, userId } });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

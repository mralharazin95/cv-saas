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

    // Build a partial update. Full saves (resume content) rewrite dataJson;
    // publish-only requests ({ slug, isPublic }) must NOT touch dataJson.
    const update: Record<string, unknown> = {};
    if (typeof data.title === "string") update.title = data.title;
    if (typeof data.colorHex === "string") update.colorHex = data.colorHex;
    if (typeof data.templateId === "string") update.templateId = data.templateId;
    if (typeof data.slug === "string") update.slug = data.slug.trim() || null;
    else if (data.slug === null) update.slug = null;
    if (typeof data.isPublic === "boolean") update.isPublic = data.isPublic;

    const isFullResume = !!data && (data.personalInfo || Array.isArray(data.experiences) || Array.isArray(data.sectionOrder));
    if (isFullResume) update.dataJson = JSON.stringify(data);

    try {
      await prisma.resume.update({ where: { id, userId }, data: update });
    } catch (e) {
      // Most likely a duplicate slug (slug is unique).
      return NextResponse.json({ message: "That public link is already taken — try another." }, { status: 409 });
    }

    return NextResponse.json({ message: "Saved", slug: update.slug }, { status: 200 });
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

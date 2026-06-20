import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

async function getUserId(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.id as string | undefined;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resume = await prisma.resume.create({
      data: {
        userId,
        title: "Untitled CV",
        personalInfo: {
          create: { firstName: "", lastName: "", email: "" }
        }
      },
    });

    return NextResponse.json({ id: resume.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json({ message: "Failed to create resume" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ resumes: [] }, { status: 200 });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ resumes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

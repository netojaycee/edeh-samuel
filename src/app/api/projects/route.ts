import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import slugify from "slugify";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "published" },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDesc: true,
        tagline: true,
        role: true,
        industry: true,
        timeline: true,
        status: true,
        order: true,
        createdAt: true,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const slug = slugify(data.title, { lower: true, strict: true });

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug,
        shortDesc: data.shortDesc,
        tagline: data.tagline,
        role: data.role,
        industry: data.industry,
        timeline: data.timeline,
        body: data.body,
        status: data.status ?? "draft",
        order: data.order ?? 0,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

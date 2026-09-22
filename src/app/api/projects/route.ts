import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
        // shortDesc: true,
        tagline: true,
        role: true,
        industry: true,
        timeline: true,
        status: true,
        order: true,
        category: true,
        cardTitle: true,
        cardDescription: true,
        stats: true,
        companyName: true,
        companyLogoUrl: true,
        caseStudy: true,
        createdAt: true,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

function validateStats(data: { category?: string; stats?: unknown; caseStudy?: unknown }) {
  if (data.caseStudy != null && typeof data.caseStudy !== "object") {
    throw new Error("caseStudy must be an object or null");
  }
  if (data.category !== "marketing") return;
  if (data.stats == null) return;
  if (
    !Array.isArray(data.stats) ||
    data.stats.length > 3 ||
    !data.stats.every(
      (s) =>
        s &&
        typeof s === "object" &&
        typeof (s as { label?: unknown }).label === "string" &&
        typeof (s as { value?: unknown }).value === "string"
    )
  ) {
    throw new Error("stats must be an array of up to 3 { label, value } objects");
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const slug = slugify(data.title, { lower: true, strict: true });
    validateStats(data);

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug,
        // shortDesc: data.shortDesc,
        tagline: data.tagline,
        role: data.role,
        industry: data.industry,
        timeline: data.timeline,
        body: data.body,
        status: data.status ?? "draft",
        order: data.order ?? 0,
        category: data.category ?? "marketing",
        cardTitle: data.cardTitle,
        cardDescription: data.cardDescription,
        stats: data.stats,
        companyName: data.companyName,
        companyLogoUrl: data.companyLogoUrl,
        caseStudy: data.caseStudy,
      },
    });

    revalidatePath("/works");
    revalidatePath("/admin/projects");

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

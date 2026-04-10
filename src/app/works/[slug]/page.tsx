import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Footer } from "@/components/layout/Footer";
import { ProjectDetail } from "@/components/project/ProjectDetail";
import { BottomCTA } from "@/components/home/BottomCTA";
import type { Metadata } from "next";
import NavbarServer from "@/components/layout/NavbarServer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return {};
  return {
    title: `${project.title} — Edeh`,
    description: project.tagline,
  };
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project || project.status !== "published") {
    notFound();
  }

  return (
    <>
      <NavbarServer />
      <main>
        <ProjectDetail project={project} />
        <BottomCTA />
      </main>
      <Footer />
    </>
  );
}

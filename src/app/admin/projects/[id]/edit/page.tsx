import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/ProjectForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) notFound();

  return (
    <ProjectForm
      project={{
        id: project.id,
        title: project.title,
        // shortDesc: project.shortDesc,
        tagline: project.tagline,
        role: project.role,
        industry: project.industry,
        timeline: project.timeline,
        body: project.body,
        status: project.status,
        order: project.order,
        category: project.category,
        cardTitle: project.cardTitle,
        cardDescription: project.cardDescription,
        stats: project.stats,
        companyName: project.companyName,
        companyLogoUrl: project.companyLogoUrl,
        caseStudy: project.caseStudy,
      }}
    />
  );
}

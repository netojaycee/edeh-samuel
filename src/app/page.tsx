import { prisma } from "@/lib/prisma";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { WorksList } from "@/components/home/WorksList";
import { BottomCTA } from "@/components/home/BottomCTA";
import NavbarServer from "@/components/layout/NavbarServer";

export const revalidate = 60;

async function getProjects() {
  try {
    return await prisma.project.findMany({
      where: { status: "published" },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        cardTitle: true,
        cardDescription: true,
        stats: true,
        companyName: true,
        companyLogoUrl: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();
  const selectedWorks = projects.filter((p) => p.category === "marketing");
  const previousWork = projects.filter((p) => p.category !== "marketing");

  return (
    <>
      <NavbarServer />
      <main>
        <Hero />
        <SelectedWorks projects={selectedWorks} />
        <WorksList projects={previousWork} />
        <BottomCTA />
      </main>
      <Footer />
    </>
  );
}

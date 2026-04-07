import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { WorksList } from "@/components/home/WorksList";
import { WhatsHappening } from "@/components/home/WhatsHappening";
import { BottomCTA } from "@/components/home/BottomCTA";

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
        shortDesc: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WorksList projects={projects} />
        <WhatsHappening />
        <BottomCTA />
      </main>
      <Footer />
    </>
  );
}

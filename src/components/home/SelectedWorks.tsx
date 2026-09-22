"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stat {
  label: string;
  value: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  cardTitle?: string | null;
  cardDescription?: string | null;
  stats?: unknown;
  companyName?: string | null;
  companyLogoUrl?: string | null;
}

interface SelectedWorksProps {
  projects: Project[];
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function SelectedWorks({ projects }: SelectedWorksProps) {
  if (projects.length === 0) return null;

  return (
    <section id="works" className="max-w-2xl mx-auto px-6 pb-16 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-8">Selected Works</h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.1 }}
        className="space-y-5"
      >
        {projects.map((project) => {
          const stats = (Array.isArray(project.stats)
            ? (project.stats as Stat[])
            : []
          ).slice(0, 3);

          return (
            <motion.div
              key={project.id}
              variants={item}
              className="rounded-xl border border-border overflow-hidden bg-background"
            >
              <div className="p-5 space-y-2">
                <h3 className="text-base font-semibold leading-snug">
                  {project.cardTitle || project.title}
                </h3>
                {project.cardDescription && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.cardDescription}
                  </p>
                )}
              </div>

              {stats.length > 0 && (
                <div
                  className="grid border-t border-border"
                  style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
                >
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      className={`p-4 text-center ${
                        i > 0 ? "border-l border-border" : ""
                      }`}
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <p className="text-sm font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 p-4 border-t border-border">
                <div className="flex items-center gap-2 min-w-0">
                  {project.companyLogoUrl && (
                    <div className="relative w-6 h-6 shrink-0">
                      <Image
                        src={project.companyLogoUrl}
                        alt={project.companyName || ""}
                        fill
                        sizes="24px"
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}
                  {project.companyName && (
                    <span className="text-sm text-muted-foreground truncate">
                      {project.companyName}
                    </span>
                  )}
                </div>

                <Link href={`/works/${project.slug}`}>
                  <Button size="sm" className="gap-1.5 rounded-lg">
                    View case study
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

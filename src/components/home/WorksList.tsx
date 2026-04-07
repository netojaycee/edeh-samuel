"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
}

interface WorksListProps {
  projects: Project[];
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function WorksList({ projects }: WorksListProps) {
  return (
    <section id="works" className="max-w-2xl mx-auto px-6 pb-16 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-8">Current &amp; Past Work</h2>
      </motion.div>

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.08 }}
        className="space-y-6"
      >
        {projects.map((project) => (
          <motion.li key={project.id} variants={item}>
            <Link
              href={`/works/${project.slug}`}
              className="group flex items-start gap-1"
            >
              <span className="text-muted-foreground mr-1 mt-0.5 shrink-0">
                ·
              </span>
              <div>
                <span className="font-medium text-foreground group-hover:text-primary transition-colors underline underline-offset-4 decoration-border group-hover:decoration-primary inline-flex items-center gap-1">
                  {project.title}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5" />
                </span>
                <span className="text-muted-foreground">
                  : {project.shortDesc}
                </span>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { RichTextRenderer } from "@/components/editor/RichTextRenderer";

interface Project {
  id: string;
  title: string;
  tagline: string;
  role: string;
  industry: string;
  timeline: string;
  body: unknown;
}

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-12 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-foreground">
          {project.title}
        </h1>

        {/* Tagline */}
        <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
          {project.tagline}
        </p>

        {/* Metadata row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-2 ">
          <div className="space-y-0.5 bg-[#FAFAFA] dark:bg-[#2D2D2D] p-3 rounded">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Role
            </p>
            <p className="text-sm font-medium text-foreground">{project.role}</p>
          </div>
          <div className="space-y-0.5 bg-[#FAFAFA] dark:bg-[#2D2D2D] p-3 rounded">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Industry
            </p>
            <p className="text-sm font-medium text-foreground">
              {project.industry}
            </p>
          </div>
          <div className="space-y-0.5 bg-[#FAFAFA] dark:bg-[#2D2D2D] p-3 rounded">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Timeline
            </p>
            <p className="text-sm font-medium text-foreground">
              {project.timeline}
            </p>
          </div>
        </div>

        {/* Rich text body */}
        <div className="pt-4 border-t border-border/50">
          <RichTextRenderer content={project.body} />
        </div>
      </motion.div>
    </article>
  );
}

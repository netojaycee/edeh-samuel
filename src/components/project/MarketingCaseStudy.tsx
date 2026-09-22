"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { RichTextRenderer } from "@/components/editor/RichTextRenderer";
import { CaseStudyChart } from "@/components/project/CaseStudyChart";
import type { CaseStudyContent } from "@/types/case-study";

interface Stat {
  label: string;
  value: string;
}

interface Project {
  id: string;
  title: string;
  stats?: unknown;
  caseStudy?: unknown;
}

interface MarketingCaseStudyProps {
  project: Project;
}

export function MarketingCaseStudy({ project }: MarketingCaseStudyProps) {
  const cs = (project.caseStudy as CaseStudyContent | null) ?? null;
  const stats = (Array.isArray(project.stats) ? (project.stats as Stat[]) : []).slice(
    0,
    3
  );

  if (!cs) {
    return (
      <article className="max-w-2xl mx-auto px-6 pt-12 pb-16">
        <h1 className="text-3xl font-semibold">{project.title}</h1>
        <p className="text-sm text-muted-foreground mt-4">
          This case study hasn&apos;t been written up yet.
        </p>
      </article>
    );
  }

  return (
    <article className="max-w-2xl mx-auto px-6 pt-12 pb-16">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {cs.heroEyebrow && (
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            {cs.heroEyebrow}
          </p>
        )}

        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-foreground">
          {cs.heroTitle || project.title}
        </h1>

        {cs.heroThesis && (
          <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
            {cs.heroThesis}
          </p>
        )}

        {cs.metadata.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {cs.metadata.map((row, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  {row.label}
                </p>
                <p className="text-sm font-medium text-foreground">{row.value}</p>
              </div>
            ))}
          </div>
        )}

        {stats.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="inline-block text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded">
              {cs.impactLabel}
            </span>
            <div
              className="grid rounded-xl border border-border overflow-hidden"
              style={{
                gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
              }}
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`p-4 text-center ${i > 0 ? "border-l border-border" : ""}`}
                >
                  <p className="text-lg font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Sections */}
      <div className="mt-14 space-y-14">
        {cs.sections.map((section, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 pt-10 border-t border-border/50"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold text-primary tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="text-xl font-semibold text-foreground">
                {section.title}
              </h2>
            </div>

            {section.body && <RichTextRenderer content={section.body} />}

            {section.chart && (
              <div className="pt-2">
                <CaseStudyChart chart={section.chart} />
              </div>
            )}
          </motion.section>
        ))}
      </div>

      {/* Takeaway */}
      {(cs.takeawayTitle || cs.takeawayBody) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="mt-14 border-l-2 border-primary bg-muted/30 rounded-r-lg p-5 space-y-2"
        >
          {cs.takeawayTitle && (
            <p className="text-lg font-semibold text-foreground leading-snug">
              {cs.takeawayTitle}
            </p>
          )}
          {cs.takeawayBody && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {cs.takeawayBody}
            </p>
          )}
        </motion.div>
      )}

      {/* CTA */}
      {cs.ctaLabel && (
        <div className="mt-10">
          {cs.ctaUrl ? (
            <Link
              href={cs.ctaUrl}
              target={cs.ctaUrl.startsWith("http") ? "_blank" : undefined}
              rel={cs.ctaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {cs.ctaLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              {cs.ctaLabel}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

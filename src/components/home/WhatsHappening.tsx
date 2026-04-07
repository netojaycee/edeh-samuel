"use client";

import { motion } from "framer-motion";

export function WhatsHappening() {
  return (
    <section className="max-w-2xl mx-auto px-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold">What&apos;s Happening</h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          currently, i am working with{" "}
          <strong className="text-foreground font-semibold">Futurtech Dev</strong>{" "}
          on the design and development of a fintech platform focused on helping
          SMEs and individuals better manage their financial operations.
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed">
          alongside this, i continue to work as a freelance product designer and
          cro specialist, collaborating with teams to improve product usability,
          optimize user journeys, and drive measurable business outcomes. i am
          actively exploring new opportunities across both b2b and b2c
          environments where i can contribute to building thoughtful,
          research-driven digital products that balance user needs with business
          growth.
        </p>
      </motion.div>
    </section>
  );
}

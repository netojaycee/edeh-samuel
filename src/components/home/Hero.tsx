"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/ContactModal";
import { Mail } from "lucide-react";

// Headline broken into segments — highlighted phrases get the primary color
const segments: { text: string; highlight?: boolean }[] = [
  { text: "Product Designer specializing in " },
  { text: "fintech and e-commerce", highlight: true },
  { text: ". I care about the details that make users feel " },
  { text: "safe spending, sending, and shopping", highlight: true },
  { text: " — and the systems that make those details scale." },
];

// Flatten into per-word tokens for the stagger animation
const tokens: { word: string; highlight: boolean }[] = [];
for (const seg of segments) {
  const words = seg.text.split(/(\s+)/); // keep whitespace as tokens
  for (const w of words) {
    if (w.trim()) tokens.push({ word: w, highlight: !!seg.highlight });
    else if (w) tokens.push({ word: w, highlight: false }); // pure whitespace
  }
}

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function Hero() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <section className="max-w-2xl mx-auto px-6 pt-12 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Avatar */}
        <div className="relative w-16 h-16">
          <Image
            src="/sammy.png"
            alt="Profile photo"
            fill
            sizes="64px"
            className="rounded-full object-cover"
            priority
          />
        </div>

        {/* Headline — word-by-word reveal with highlighted phrases */}
        <motion.h1
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          className="text-[2rem] sm:text-[2.1rem] leading-[1.25] font-semibold tracking-tight max-w-2xl"
          aria-label={segments.map((s) => s.text).join("")}
        >
          {tokens.map((token, i) =>
            token.word.trim() === "" ? (
              // whitespace — render as a normal space, no animation
              <span key={i}>{token.word}</span>
            ) : (
              <motion.span
                key={i}
                variants={wordVariant}
                className={`inline-block mr-[0.22em] ${
                  token.highlight ? "text-primary" : "text-foreground"
                }`}
              >
                {token.word}
              </motion.span>
            )
          )}
        </motion.h1>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-muted-foreground leading-relaxed max-w-2xl"
        >
          I work at the intersection of Product Design and Conversion Rate
          Optimisation — which means I&apos;m equally comfortable shaping
          end-to-end user experiences and interrogating why users drop off,
          hesitate, or don&apos;t come back. I design with intent: every screen,
          flow, and interaction is built to move people forward.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <Button
            onClick={() => setContactOpen(true)}
            className="gap-2 rounded-lg px-6"
          >
            <Mail className="w-4 h-4" />
            Send me a Mail
          </Button>
        </motion.div>
      </motion.div>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </section>
  );
}

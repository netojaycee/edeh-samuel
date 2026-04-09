"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/ContactModal";
import { Mail } from "lucide-react";

export function BottomCTA() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <section className="max-w-2xl mx-auto px-6 py-20 border-t border-border/50">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold leading-tight max-w-md">
          Product Design that makes your competition irrelevant...
        </h2>

        <Button
          onClick={() => setContactOpen(true)}
          className="gap-2 rounded-lg px-6"
        >
          <Mail className="w-4 h-4" />
          Send me a Mail
        </Button>
      </motion.div>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </section>
  );
}

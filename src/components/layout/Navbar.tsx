"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isHome =
      typeof window !== "undefined" && window.location.pathname === "/";
    if (isHome) {
      e.preventDefault();
      document.getElementById("works")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Theme toggle circles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme("dark")}
            aria-label="Dark mode"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
              mounted && theme === "dark"
                ? "bg-foreground text-background"
                : "bg-foreground/20 text-foreground/60 hover:bg-foreground/40 hover:text-foreground"
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme("light")}
            aria-label="Light mode"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
              mounted && theme === "light"
                ? "bg-foreground text-background"
                : "bg-foreground/20 text-foreground/60 hover:bg-foreground/40 hover:text-foreground"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/#works"
            onClick={handleWorksClick}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Works
          </Link>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Resume
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

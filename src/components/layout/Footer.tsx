import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-6">
      <div className="max-w-2xl mx-auto px-6 flex items-center justify-end gap-6 text-sm text-muted-foreground">
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          X
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Resume
        </a>
      </div>
    </footer>
  );
}

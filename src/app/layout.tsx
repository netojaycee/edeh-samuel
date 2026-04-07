import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Edeh — Product Designer",
  description:
    "Product Designer specializing in fintech and e-commerce. I care about the details that make users feel safe spending, sending, and shopping.",
  openGraph: {
    title: "Edeh — Product Designer",
    description: "Product Designer specializing in fintech and e-commerce.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={bricolage.variable}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased font-[family-name:var(--font-bricolage)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster closeButton position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

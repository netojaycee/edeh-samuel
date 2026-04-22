import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
// import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

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
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PM5P42F4');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-[family-name:var(--font-bricolage)]">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PM5P42F4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
         {/* <GoogleTagManager gtmId="GTM-PM5P42F4" />
         <GoogleAnalytics gaId="GTM-PM5P42F4" /> */}
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

import fs from "node:fs";
import path from "node:path";
import type { Metadata, Viewport } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { Providers } from "@/providers/Providers";
import { WebGLRoot } from "@/webgl/WebGLRoot";
import { Chrome } from "@/components/chrome/Chrome";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ashwinte.vercel.app"),
  title: "Ashwin T E — Mechatronics & Robotics",
  description:
    "Portfolio of Ashwin T E. Mechatronics undergraduate at VIT Chennai building bio-inspired robots, ROS 2 autonomy, and embedded control systems.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ashwin T E — Mechatronics & Robotics",
    description:
      "Portfolio of Ashwin T E. Mechatronics undergraduate at VIT Chennai building bio-inspired robots, ROS 2 autonomy, and embedded control systems.",
    url: "https://ashwinte.vercel.app",
    siteName: "Ashwin T E Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin T E — Mechatronics & Robotics",
    description:
      "Portfolio of Ashwin T E. Mechatronics undergraduate at VIT Chennai building bio-inspired robots, ROS 2 autonomy, and embedded control systems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasPortrait = fs.existsSync(
    path.join(process.cwd(), "public", "images", "ashwin-portrait.jpg")
  );

  return (
    <html
      lang="en"
      data-surface="dark"
      className={`${sora.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <JsonLd />
        <Providers>
          <WebGLRoot hasPortrait={hasPortrait} />
          <Chrome />
          <main id="main-content" className="relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

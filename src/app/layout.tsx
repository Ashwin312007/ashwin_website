import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ExperienceProvider } from "@/context/ExperienceProvider";
import { JsonLd } from "@/components/seo/JsonLd";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

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
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#08080A] text-[#edf2fa] antialiased [&_:focus-visible]:outline-none [&_:focus-visible]:ring-2 [&_:focus-visible]:ring-[#9bc1ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9bc1ff]">
        <JsonLd />
        <ExperienceProvider>{children}</ExperienceProvider>
      </body>
    </html>
  );
}

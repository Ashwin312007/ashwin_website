import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ExperienceProvider } from "@/context/ExperienceProvider";

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
  title: "Ashwin T E — Mechatronics & Robotics",
  description:
    "Portfolio of Ashwin T E. Mechatronics undergraduate at VIT Chennai building bio-inspired robots, ROS 2 autonomy, and embedded control systems.",
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
      <body className="min-h-screen bg-[#08080A] text-[#edf2fa] antialiased">
        <ExperienceProvider>{children}</ExperienceProvider>
      </body>
    </html>
  );
}

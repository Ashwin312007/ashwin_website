import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Ashwin T E | Mechatronics, Robotics & Autonomous Systems Lead",
  description: "Portfolio of Ashwin T E - R&D Lead at VIT Chennai OSP, NASA HERC Winner, ROS2 & Embedded Systems Specialist.",
  openGraph: {
    title: "Ashwin T E | Portfolio",
    description: "R&D Lead at VIT Chennai OSP, NASA HERC Winner, ROS2 & Embedded Systems Specialist.",
    type: "website",
    locale: "en_US",
    url: "https://ashwin-portfolio.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin T E | Portfolio",
    description: "R&D Lead at VIT Chennai OSP, NASA HERC Winner, ROS2 & Embedded Systems Specialist.",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#06080e',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased text-white bg-[#08090d] min-h-screen selection:bg-[#00a3ff] selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}

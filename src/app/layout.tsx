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
  icons: { icon: "/icon.svg" },
  title: "Ashwin T E | Mechatronics, Robotics & Autonomous Systems Lead",
  description: "Ashwin T E — mechatronics, embedded systems, and robotics. Explore NASA HERC engineering, autonomous systems, and two pending patent applications.",
  openGraph: {
    title: "Ashwin T E | Portfolio",
    description: "Mechatronics, embedded systems, and robotics. Projects, patent applications, and engineering contributions by Ashwin T E.",
    type: "website",
    locale: "en_US",
    url: "https://ashwin-portfolio.vercel.app",
  },
  twitter: {
    card: "summary",
    title: "Ashwin T E | Portfolio",
    description: "Mechatronics, embedded systems, and robotics. Projects, patent applications, and engineering contributions by Ashwin T E.",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#090d14',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

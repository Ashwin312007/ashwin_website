import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ashwin T E | Robotics & Embedded Systems Developer",
  description: "Official Portfolio of Ashwin T E - Mechatronics & Automation Engineer specializing in Robotics and Embedded Systems.",
  openGraph: {
    title: "Ashwin T E | Portfolio",
    description: "Mechatronics & Automation Engineer specializing in Robotics and Embedded Systems.",
    type: "website",
    locale: "en_US",
    url: "https://ashwin-portfolio.vercel.app", // Placeholder
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin T E | Portfolio",
    description: "Mechatronics & Automation Engineer specializing in Robotics and Embedded Systems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white`}
      >
        {children}
      </body>
    </html>
  );
}

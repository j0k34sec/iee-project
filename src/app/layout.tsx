import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InnoQuest: Hackathon 2025 - Innovate Beyond Stars. Code the Cosmos.",
  description: "Join InnoQuest 2025, the ultimate space-themed hackathon. Innovate Beyond Stars. Code the Cosmos. Build, Learn, Compete, and Launch your ideas into a galaxy of opportunities.",
  keywords: ["InnoQuest", "Hackathon 2025", "Space Technology", "Innovation", "Coding Competition", "IEEE", "Technology"],
  authors: [{ name: "InnoQuest Team" }],
  openGraph: {
    title: "InnoQuest: Hackathon 2025",
    description: "Innovate Beyond Stars. Code the Cosmos. Join the ultimate space-themed hackathon experience.",
    url: "https://innoquest2025.dev",
    siteName: "InnoQuest Hackathon",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InnoQuest: Hackathon 2025",
    description: "Innovate Beyond Stars. Code the Cosmos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

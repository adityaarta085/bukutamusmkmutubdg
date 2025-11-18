import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buku Tamu Digital - SMK Muhammadiyah Bandongan",
  description: "Sistem buku tamu digital modern untuk SMK Muhammadiyah Bandongan dengan fitur lengkap.",
  keywords: ["Buku Tamu Digital", "SMK Muhammadiyah Bandongan", "Guest Book", "Digital Visitor Management"],
  authors: [{ name: "Siswa SMK Muhammadiyah Bandongan" }],
  icons: {
    icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-Rdj_KB9skzLT1EDNWQm3M3t3lAx8nCf3IhYhGN8XxI1a-7-Bkd_h-f-OeP6_134e2-k_r_Zjc-0gxu8DLjWGOjjx4DQ0nhKEW-7U1erYKzzyt-KXVjboTYN7zAbk_8wQIP9dtve_PbgIYXuCDgbC9Np8sq0vjsI6_zszRi8GShq8vKlDp5nPg7IPj6I/s320/images__2_-removebg-preview.png",
  },
  openGraph: {
    title: "Buku Tamu Digital - SMK Muhammadiyah Bandongan",
    description: "Sistem buku tamu digital modern dengan Success By Discipline",
    url: "https://smk-bandongan.sch.id",
    siteName: "SMK Muhammadiyah Bandongan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buku Tamu Digital - SMK Muhammadiyah Bandongan",
    description: "Sistem buku tamu digital modern",
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

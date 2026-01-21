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
  title: "New Athlete Academy | สโมสรแบดมินตัน",
  description: "พัฒนาทักษะแบดมินตันอย่างเป็นระบบ ตั้งแต่พื้นฐานจนถึงระดับนักกีฬา ด้วยหลักสูตร 60 Level และทีมโค้ชมืออาชีพ 7 สาขาทั่วกรุงเทพ",
  keywords: ["แบดมินตัน", "badminton", "สอนแบดมินตัน", "New Athlete", "กรุงเทพ"],
  authors: [{ name: "New Athlete Academy" }],
  openGraph: {
    title: "New Athlete Academy | สโมสรแบดมินตัน",
    description: "พัฒนาทักษะแบดมินตันอย่างเป็นระบบ ด้วยหลักสูตร 60 Level",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

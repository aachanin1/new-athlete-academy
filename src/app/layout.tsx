import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
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
      <body className={`${prompt.variable} antialiased`} style={{ fontFamily: "var(--font-prompt), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

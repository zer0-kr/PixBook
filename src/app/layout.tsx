import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const galmuri = localFont({
  src: [
    {
      path: "../../public/fonts/Galmuri11.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Galmuri11-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-galmuri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "픽북 - 나만의 독서 타워",
  description: "책을 읽고, 탑을 쌓고, 캐릭터를 모으세요!",
  other: {
    "theme-color": "#FFF8E7",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pressStart2P.variable} ${galmuri.variable} font-galmuri bg-cream text-brown antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

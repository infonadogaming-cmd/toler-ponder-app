import type { Metadata } from "next";
import { Fredoka, Bangers } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

const bangers = Bangers({
  weight: "400",
  variable: "--font-bangers",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "What is Toler Looking at??",
  description: "Upload an image and find out what Toler is looking at!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${bangers.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-sky-200">{children}</body>
    </html>
  );
}

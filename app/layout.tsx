import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "streamdown/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pitch Deck Analyzer",
  description:
    "Upload your pitch deck and get AI-powered feedback in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-4">
            <a href="/" className="text-lg font-semibold tracking-tight">
              Pitch Deck Analyzer
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-12">{children}</main>
      </body>
    </html>
  );
}

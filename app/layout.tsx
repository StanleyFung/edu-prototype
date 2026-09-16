import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Claude",
  description: "An AI chat workspace with projects, scheduled tasks, and workflow insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-canvas" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

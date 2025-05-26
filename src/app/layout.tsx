import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AI Tools for Every Job - Explore AI Tools That Transform Your Work",
  description: "Find the perfect AI tools for your job role. Get personalized recommendations and actionable prompts to boost your productivity.",
  icons: {
    icon: "/favicon.png",      // Generic icon
    shortcut: "/favicon.png",  // Windows / general shortcut icon
    apple: "/favicon.png",     // Apple touch icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

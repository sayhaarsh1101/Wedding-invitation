import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Great_Vibes } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

const vibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-vibes",
});

export const metadata: Metadata = {
  title: "Harsh & Rutbi - Royal Wedding Invitation",
  description: "We invite you to celebrate the royal wedding ceremony of Harsh and Rutbi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} ${vibes.variable}`}>
      <body className={`${jakarta.className} antialiased bg-[#2b040a] text-amber-50 selection:bg-[#d4af37] selection:text-[#2b0a0f]`}>
        {children}
      </body>
    </html>
  );
}
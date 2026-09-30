import type { Metadata } from "next";
import { Montserrat, Yellowtail } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const yellowtail = Yellowtail({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "THE CRESCENT — Admin Panel",
  description: "Reservations & orders dashboard for THE CRESCENT restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${yellowtail.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
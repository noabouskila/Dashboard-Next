import type { Metadata } from "next";
import localFont from "next/font/local";

import { inter } from "./ui/fonts";
import "./globals.css";




const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dashboard-next-a4ox.vercel.app/"),

  title: {
    template: "%s | Tableau de bord Acme ",
    default: "Tableau de bord Acme",
  },
  description: "Appli Next.js Dashboard avec app Router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

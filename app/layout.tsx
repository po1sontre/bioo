import "./globals.css";
import type { Metadata } from "next";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Prevent Font Awesome from automatically adding CSS
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Discord Bio Site",
  description: "A stylish bio site with 3D glassmorphism effects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

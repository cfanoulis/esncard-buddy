import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ESNcard Buddy",
  description: "Verify ESNcards & track redemptions with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="ESNcard Buddy" />
      </head>
      <body>{children}</body>
    </html>
  );
}

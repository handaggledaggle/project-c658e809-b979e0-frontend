import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "printtie",
  description: "Artist marketplace demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

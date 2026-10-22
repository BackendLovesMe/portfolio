import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akshat Mishra — Backend Engineer",
  description: "Backend engineer focused on Node.js, TypeScript, fintech integrations, and reliable systems.",
  metadataBase: new URL("https://example.vercel.app"),
  openGraph: {
    title: "Akshat Mishra — Backend Engineer",
    description: "Building reliable backend systems for real-world fintech problems.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

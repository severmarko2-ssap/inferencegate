import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://ssap.io"),

  title: {
    default: "SSAP — Decision layer for AI systems",
    template: "%s • SSAP",
  },

  description:
    "SSAP is a decision layer that decides before every AI call. Run, block, escalate — with full audit trail and EU AI Act compliance.",

  alternates: { canonical: "https://ssap.io/" },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://ssap.io/",
    title: "SSAP — Decision layer for AI systems",
    description:
      "SSAP is a decision layer that decides before every AI call. Run, block, escalate — with full audit trail and EU AI Act compliance.",
    siteName: "SSAP",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "SSAP — Decision layer for AI systems",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SSAP — Decision layer for AI systems",
    description:
      "SSAP is a decision layer that decides before every AI call. EU AI Act compliant.",
    images: ["/og.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

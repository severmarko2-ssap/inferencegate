import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://ssap.io"),

  title: {
    default: "SSAP Decision System",
    template: "%s • SSAP",
  },

  description:
    "A decision system for modern AI. Decide when AI should act, when to try cheaply, and when not to act at all. Built for governance: no raw prompts or completions stored by default.",

  applicationName: "SSAP Decision System",

  alternates: {
    canonical: "https://ssap.io/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "https://ssap.io/",
    title: "SSAP Decision System",
    description:
      "A decision system for modern AI. Decide when AI should act, when to try cheaply, and when not to act at all. Built for governance: no raw prompts or completions stored by default.",
    siteName: "SSAP",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "SSAP Decision System",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SSAP Decision System",
    description:
      "A decision system for modern AI. Decide when AI should act, when to try cheaply, and when not to act at all. Built for governance: no raw prompts or completions stored by default.",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://ssap.io"),

  title: {
    default: "InferenceGate by SSAP",
    template: "%s • InferenceGate by SSAP",
  },

  // A3: Updated to “Inference Governance” positioning (cost savings as consequence)
  description:
    "InferenceGate turns inference from an uncontrolled side-effect into a governed system — with deterministic decision paths, audit-friendly telemetry, stable latency, and continuous quality monitoring. Cost savings are the consequence.",

  applicationName: "InferenceGate",

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
    siteName: "SSAP",
    title: "InferenceGate by SSAP",
    // A3: Updated OG copy
    description:
      "Inference governance for production AI. Policy-driven routing with deterministic decision paths, audit-friendly telemetry, stable latency, and SS3 shadow QA — with cost savings as a consequence.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "InferenceGate by SSAP",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "InferenceGate by SSAP",
    // A3: Updated Twitter copy
    description:
      "Inference governance for production AI. Policy-driven routing with deterministic decision paths, audit-friendly telemetry, stable latency, and SS3 shadow QA — with cost savings as a consequence.",
    images: ["/og.png"],
  },

  icons: {
    // trenutno OBAVEZNO
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],

    // spremno za kasnije (ne smeta ako još ne postoji)
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

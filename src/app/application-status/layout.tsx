import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Status | TEDxKLH 2026",
  description:
    "Check your TEDxKLH 2026 delegate application and payment verification status. Look up by registered email or transaction reference.",
  alternates: {
    canonical: "https://tedxklhbowrampet.in/application-status",
  },
  openGraph: {
    title: "Application Status | TEDxKLH 2026",
    description:
      "Track your TEDxKLH 2026 delegate pass review and digital credential verification status.",
    url: "https://tedxklhbowrampet.in/application-status",
    images: [
      {
        url: "https://tedxklhbowrampet.in/metamorphosis-art.jpg",
        width: 1200,
        height: 630,
        alt: "TEDxKLH 2026 Application Status",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Application Status | TEDxKLH 2026",
    description:
      "Check your TEDxKLH 2026 pass review and verification status.",
    images: ["https://tedxklhbowrampet.in/metamorphosis-art.jpg"],
  },
};

export default function ApplicationStatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

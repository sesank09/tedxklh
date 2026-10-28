import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Delegate Pass | TEDxKLH 2026",
  description:
    "Register for official delegate passes to TEDxKLH 2026: METAMORPHOSIS on November 4, 2026 at KLH Auditorium, Bowrampet Campus, Hyderabad. Individual and 4-member squad passes available.",
  alternates: {
    canonical: "https://tedxklhbowrampet.in/apply",
  },
  openGraph: {
    title: "Apply for Delegate Pass | TEDxKLH 2026",
    description:
      "Secure your seat among 250 curated delegates at TEDxKLH 2026: METAMORPHOSIS. Keynotes, pavilion installations, and curated networking.",
    url: "https://tedxklhbowrampet.in/apply",
    images: [
      {
        url: "https://tedxklhbowrampet.in/metamorphosis-art.jpg",
        width: 1200,
        height: 630,
        alt: "TEDxKLH 2026 Delegate Application",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply for Delegate Pass | TEDxKLH 2026",
    description:
      "Join 250 curated delegates on Nov 4, 2026 at KLH Bowrampet Campus, Hyderabad.",
    images: ["https://tedxklhbowrampet.in/metamorphosis-art.jpg"],
  },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

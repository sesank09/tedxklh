import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Official Launch & Countdown | TEDxKLH 2026",
  description:
    "Official launch countdown for TEDxKLH 2026: METAMORPHOSIS on November 4, 2026 at KLH Auditorium, Bowrampet, Hyderabad.",
  alternates: {
    canonical: "https://tedxklhbowrampet.in/launch",
  },
  openGraph: {
    title: "Official Launch Countdown | TEDxKLH 2026",
    description:
      "Countdown to TEDxKLH 2026: METAMORPHOSIS. Exploring structural transformations on Nov 4, 2026 in Hyderabad.",
    url: "https://tedxklhbowrampet.in/launch",
    images: [
      {
        url: "https://tedxklhbowrampet.in/metamorphosis-art.jpg",
        width: 1200,
        height: 630,
        alt: "TEDxKLH 2026 Launch Countdown",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Official Launch Countdown | TEDxKLH 2026",
    description: "Nov 4, 2026 · KLH Bowrampet Campus, Hyderabad.",
    images: ["https://tedxklhbowrampet.in/metamorphosis-art.jpg"],
  },
};

export default function LaunchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

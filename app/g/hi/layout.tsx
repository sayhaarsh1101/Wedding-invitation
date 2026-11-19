import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "हर्ष & रुतबी - शादी का निमंत्रण",
  description: "आपको हर्ष और रुतबी की शादी के शुभ अवसर पर सादर आमंत्रित किया जाता है। 9 दिसंबर 2026, होटल नालंदा रीजेंसी, राजगीर, बिहार।",
  openGraph: {
    title: "हर्ष & रुतबी - शादी का निमंत्रण",
    description: "आपको हर्ष और रुतबी की शादी के शुभ अवसर पर सादर आमंत्रित किया जाता है। 9 दिसंबर 2026, होटल नालंदा रीजेंसी, राजगीर, बिहार।",
    type: "website",
    images: [
      {
        url: "/images/og-invite.png",
        width: 1080,
        height: 1920,
        alt: "हर्ष & रुतबी शादी का निमंत्रण",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "हर्ष & रुतबी - शादी का निमंत्रण",
    description: "आपको हर्ष और रुतबी की शादी के शुभ अवसर पर सादर आमंत्रित किया जाता है। 9 दिसंबर 2026।",
    images: ["/images/og-invite.png"],
  },
};

export default function HindiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

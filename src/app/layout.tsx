import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FARHAN P. ZAMMA — Director • Producer • Storyteller",
  description:
    "13+ years of making stories move. Explore the 3D cinematic filmography of Farhan P. Zamma, creator of Zee TV's Amma, writer/director of First Copy on Amazon MX Player, Discovery Channel's Inside the Burning, and pioneer of Viacom18's 4K production pipeline.",
  keywords: [
    "Farhan P. Zamma",
    "Farhan Zamma",
    "Director",
    "Producer",
    "Storyteller",
    "Amma Zee TV",
    "First Copy Amazon MX Player",
    "Munawar Faruqui",
    "Shabana Azmi",
    "Discovery Channel Inside the Burning",
    "Salt Media",
    "OMG Yeh Mera India",
  ],
  openGraph: {
    title: "FARHAN P. ZAMMA — Director • Producer • Storyteller",
    description: "13+ Years • 80+ Shows • One Obsession: Storytelling. Enter the 3D Filmography.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060608] text-white selection:bg-[#d4af37] selection:text-black">
        {/* Film Grain Texture Overlay */}
        <div className="film-grain" />

        {children}
      </body>
    </html>
  );
}

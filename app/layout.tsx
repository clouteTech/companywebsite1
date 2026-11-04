import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display face carried over from the original HTML site's headings.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cloute.co.in"),
  title: "Networking Company in India | Cloute Technologies",
  description:
    "Looking for a reliable networking company in India? Cloute Technologies provides secure IT networking, cloud solutions and managed IT services for businesses across India.",
  applicationName: "Cloute Technologies",
  openGraph: {
    type: "website",
    siteName: "Cloute Technologies",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1e39",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-svh flex-col">{children}</body>
    </html>
  );
}

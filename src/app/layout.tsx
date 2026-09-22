import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stimulx.in — Open Indian Behavioural Science",
  description:
    "A non-profit research infrastructure for Indian psychologists, neuroscientists, students, and service users. DPDP Act 2023 & ICMR 2017 compliant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,600;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full flex flex-col overflow-hidden font-sans">{children}</body>
    </html>
  );
}

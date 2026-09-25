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
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full flex flex-col overflow-hidden font-sans antialiased text-[#1B1A22] bg-[#FFFFFF]">{children}</body>
    </html>
  );
}

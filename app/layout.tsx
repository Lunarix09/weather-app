import type { Metadata } from "next";
import "./globals.css";
// import Bricolage from "next/font/google";

export const metadata: Metadata = {
  title: "Weather App solution",
  description: "Our users should be able to: search for weather information by entering a location in the search bar, view current weather conditions including temperature, weather icon, and location details",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" 
          crossOrigin="anonymous"
        />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body
        className={`bg-neutral-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

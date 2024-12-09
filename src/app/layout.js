
import localFont from "next/font/local";
import "./globals.css";
import ReactLayout from "./reactLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "The Ocean - A Unified Social Platform",
  description: "Connect, share, and explore on The Ocean, your unified social experience.",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background dark:bg-d_background text-text_clr dark:text-d_text_clr customScrollbar `}
      >
        <ReactLayout >
          {children}
        </ReactLayout>
      </body>
    </html>
  );
}

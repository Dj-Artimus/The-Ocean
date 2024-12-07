
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "./provider";
import RootProviders from "@/components/providers/RootProviders";

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

export const metadata: Metadata = {
  title: "MoneyMap",
  description: "created by Shadow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <html lang="en" className="dark" 
       style={{
        colorScheme:"dark"
       }}
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <RootProviders>
               
               {children}
            </RootProviders>
          
        </body>
      </html>
    </Provider>
  );
}

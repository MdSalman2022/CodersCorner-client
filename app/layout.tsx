import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { BookmarkProvider } from "@/lib/bookmark-context";
import { UniversalLayout } from "@/components/universal-layout";
import { Toaster } from "sonner";
import "./globals.css";

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
  title: "Coders Corner - Programming Blog Community",
  description:
    "A Medium-like blog platform focused on programming, development, and tech discussions. Share your knowledge with fellow developers.",
  keywords:
    "programming, coding, development, blog, tech, javascript, python, react, nextjs",
  authors: [{ name: "Coders Corner Team" }],
  openGraph: {
    title: "Coders Corner",
    description: "Programming blog community for developers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <BookmarkProvider>
              <UniversalLayout>{children}</UniversalLayout>
              <Toaster />
            </BookmarkProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

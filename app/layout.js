import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: ["400"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Motorsports Museum",
  description: "Experience the thrill of motorsport legends inside an interactive digital space.",
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  const skipText = locale === "es" ? "Saltar al contenido principal" : "Skip to main content";

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium focus:shadow-lg focus:outline-none"
        >
          {skipText}
        </a>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

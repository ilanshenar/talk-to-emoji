import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Mojimajic - AI Speech to Emoji Converter | Transform Your Voice into Emojis",
  description:
    "Transform your speech into emojis instantly with AI-powered voice recognition. Free online tool that converts spoken words to fun emoji expressions. Perfect for social media, messaging, and creative content.",
  keywords: [
    "speech to emoji",
    "voice to emoji",
    "AI emoji converter",
    "speech recognition",
    "emoji generator",
    "voice emoji",
    "text to emoji",
    "AI voice converter",
    "emoji translator",
    "speech to text emoji",
    "voice recognition emoji",
    "emoji maker",
    "AI emoji tool",
    "speak emoji",
    "voice emoji generator",
  ],
  authors: [{ name: "Mojimajic" }],
  creator: "Mojimajic",
  publisher: "Mojimajic",
  category: "Technology",
  classification: "AI Tools",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Mojimajic - AI Speech to Emoji Converter",
    description:
      "Transform your speech into emojis instantly with AI-powered voice recognition. Free online tool for converting voice to fun emoji expressions.",
    url: "https://mojimajic.com",
    siteName: "Mojimajic",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mojimajic - Speech to Emoji Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mojimajic - AI Speech to Emoji Converter",
    description:
      "Transform your speech into emojis instantly with AI-powered voice recognition.",
    creator: "@mojimajic",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://mojimajic.com",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧙</text></svg>",
    shortcut:
      "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧙</text></svg>",
    apple:
      "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧙</text></svg>",
  },
  verification: {
    google: "Q2mMlqlCKHS-xRzih3djEc1coU3dL6eMA6K4DHw-dkc",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#8b5cf6",
    "msapplication-TileColor": "#8b5cf6",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0, viewport-fit=cover"
        />
        <meta name="format-detection" content="telephone=no, email=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Mojimajic" />
        <meta
          name="theme-color"
          content="#8b5cf6"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#3b82f6"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="canonical" href="https://mojimajic.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Mojimajic",
              description:
                "AI-powered speech to emoji converter that transforms your voice into fun emoji expressions",
              url: "https://mojimajic.com",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "Mojimajic",
              },
              featureList: [
                "Speech recognition",
                "AI-powered emoji conversion",
                "Real-time voice processing",
                "Multi-language support",
                "Mobile-friendly interface",
              ],
              browserRequirements:
                "Requires microphone access and modern web browser",
            }),
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6136094194182486"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster
          theme="dark"
          className="toaster group"
          position="top-center"
          expand={false}
          richColors={true}
          toastOptions={{
            duration: 3000,
            classNames: {
              toast:
                "group toast group-[.toaster]:bg-purple-800/95 group-[.toaster]:backdrop-blur-lg group-[.toaster]:text-purple-100 group-[.toaster]:border-purple-600/50 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl",
              description: "group-[.toast]:text-purple-300",
              actionButton:
                "group-[.toast]:bg-purple-600 group-[.toast]:text-purple-100 group-[.toast]:hover:bg-purple-700",
              cancelButton:
                "group-[.toast]:bg-slate-600 group-[.toast]:text-slate-100 group-[.toast]:hover:bg-slate-700",
            },
          }}
        />
      </body>
    </html>
  );
}

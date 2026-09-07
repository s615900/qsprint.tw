import type { Metadata } from "next";
import IconSprite from "@/components/Icons";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s ・ 青春止秒",
    default: "青春止秒攝影集",
  },
  description:
    "田徑賽事攝影工作室的部落格式官網示範,以新聞報導版面呈現賽事花絮、作品集與合作邀約。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* next/font/google can't reliably self-host the Traditional Chinese subset for these fonts */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;600;700;900&family=Noto+Sans+TC:wght@400;500;600;700&family=Bebas+Neue&display=swap"
        />
      </head>
      <body className="bg-paper font-body text-ink antialiased">
        <IconSprite />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";
import SiteSearch from "./SiteSearch";
import { PROFILE_PAGE_SCHEMA, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";
import { themeInitScript } from "./theme";
import SystemThemeSync from "./ThemeToggle";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  applicationName: SITE_NAME,
  authors: [{ name: "Xu Junshan 许君山", url: SITE_URL }],
  creator: "Xu Junshan 许君山",
  publisher: "Xu Junshan 许君山",
  keywords: [
    "许君山",
    "华北水利水电大学 许君山",
    "许君山 华水",
    "许君山 华北水利水电大学",
    "许君山 华北水电",
    "许君山 NCWU",
    "许君山 杭电",
    "许君山 杭州电子科技大学",
    "许君山 HDU",
    "许君山 个人主页",
    "许君山 简历",
    "许君山 GitHub",
    "Xu Junshan",
    "Junshan Xu",
    "Xu Junshan NCWU",
    "AI Agent",
    "Multimodal LLM",
    "Computer Vision",
    "多模态大模型",
    "计算机视觉",
    "Feishuye",
    "飞书叶",
    "LangGraph",
    "RAG",
    "Java backend",
    "Spring Boot",
    "personal website",
    "portfolio",
    "华北水利水电大学",
    "Hangzhou Dianzi University",
    "North China University of Water Resources and Electric Power",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "zh_CN",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: "/profile.jpg",
        width: 512,
        height: 512,
        alt: "Xu Junshan 许君山",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/profile.jpg"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <SystemThemeSync />
        <Script id="profile-page-schema" type="application/ld+json">
          {JSON.stringify(PROFILE_PAGE_SCHEMA)}
        </Script>
        <meta name="baidu-site-verification" content="codeva-DSw5IENRfo" />
        <SiteSearch />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

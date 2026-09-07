import type { Metadata } from "next";
import NewsSection from "@/components/NewsSection";

export const metadata: Metadata = {
  title: "最新消息",
  description: "賽場邊的第一手記錄,從起跑到頒獎台,每一篇都是一場比賽的側寫。",
};

export default function NewsPage() {
  return <NewsSection />;
}

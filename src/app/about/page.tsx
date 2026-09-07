import type { Metadata } from "next";
import AboutSection from "@/components/AboutSection";

export const metadata: Metadata = {
  title: "關於我們",
  description: "如果青春會老,那就讓它在跑道上「止秒」。",
};

export default function AboutPage() {
  return <AboutSection />;
}

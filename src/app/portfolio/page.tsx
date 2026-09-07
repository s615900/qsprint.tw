import type { Metadata } from "next";
import PortfolioSection from "@/components/PortfolioSection";

export const metadata: Metadata = {
  title: "作品集",
  description: "以新聞現場的節奏整理每一場比賽的關鍵瞬間——起跑、交棒、衝線、頒獎。",
};

export default function PortfolioPage() {
  return <PortfolioSection />;
}

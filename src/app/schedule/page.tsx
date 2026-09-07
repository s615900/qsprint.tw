import type { Metadata } from "next";
import ScheduleSection from "@/components/ScheduleSection";

export const metadata: Metadata = {
  title: "賽事行事曆",
  description: "青春止秒團隊接下來確定進場拍攝的賽事清單,持續更新中。",
};

export default function SchedulePage() {
  return <ScheduleSection />;
}

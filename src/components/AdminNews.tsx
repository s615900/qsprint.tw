"use client";

import { useState } from "react";
import { news } from "@/lib/content";
import { IconPencil, IconTrash } from "./AdminIcons";

type Status = "published" | "draft";
type Filter = "all" | Status;

interface AdminNewsRow {
  status: Status;
  tag: string;
  title: string;
  excerpt: string;
  info: string;
}

const draftItem: AdminNewsRow = {
  status: "draft",
  tag: "賽事公告",
  title: "新北市中等學校田徑錦標賽・賽前預告",
  excerpt: "整理選手名單與場地資訊,賽前搶先看。",
  info: "預計 2026.09.15 前發布",
};

const rows: AdminNewsRow[] = [
  draftItem,
  ...news.map((item) => ({
    status: "published" as const,
    tag: item.tag,
    title: item.title,
    excerpt: item.excerpt,
    info: item.meta,
  })),
];

const publishedCount = rows.filter((r) => r.status === "published").length;
const draftCount = rows.length - publishedCount;

export default function AdminNews() {
  const [filter, setFilter] = useState<Filter>("all");
  const visibleRows = rows.filter((row) => filter === "all" || row.status === filter);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">最新消息</h2>
          <p className="mt-1 text-[12.5px] text-ink-soft">
            共 {rows.length} 篇,{draftCount} 篇草稿待發布。
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增消息
        </button>
      </div>

      <div className="flex gap-1.5">
        <FilterTab label={`全部 ${rows.length}`} active={filter === "all"} onClick={() => setFilter("all")} />
        <FilterTab
          label={`已發布 ${publishedCount}`}
          active={filter === "published"}
          onClick={() => setFilter("published")}
        />
        <FilterTab label={`草稿 ${draftCount}`} active={filter === "draft"} onClick={() => setFilter("draft")} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-paper-2">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
              <th className="border-b border-line px-4 py-2.5">狀態</th>
              <th className="border-b border-line px-4 py-2.5">標籤</th>
              <th className="border-b border-line px-4 py-2.5">標題</th>
              <th className="border-b border-line px-4 py-2.5">發布資訊</th>
              <th className="border-b border-line px-4 py-2.5 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr
                key={row.title}
                className={`text-[13px] hover:bg-paper-3 ${row.status === "draft" ? "bg-paper-3/60" : ""}`}
              >
                <td className="border-b border-line px-4 py-3.5">
                  {row.status === "draft" ? (
                    <span className="rounded-full border border-dashed border-line bg-paper-3 px-2.5 py-1 text-[11px] font-semibold text-muted">
                      草稿
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#e3efe1] px-2.5 py-1 text-[11px] font-semibold text-[#4c8c5a]">
                      已發布
                    </span>
                  )}
                </td>
                <td className="border-b border-line px-4 py-3.5">
                  <span className="whitespace-nowrap rounded-md bg-gold/10 px-2 py-0.5 text-[11px] text-gold">
                    {row.tag}
                  </span>
                </td>
                <td className="max-w-[360px] border-b border-line px-4 py-3.5 font-semibold">
                  {row.title}
                  <span className="mt-0.5 block truncate text-[11.5px] font-normal text-ink-soft">
                    {row.excerpt}
                  </span>
                </td>
                <td className="border-b border-line px-4 py-3.5 text-ink-soft">{row.info}</td>
                <td className="border-b border-line px-4 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                      <IconPencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                      <IconTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold ${
        active ? "border-ink bg-ink text-paper" : "border-line bg-paper-2 text-ink-soft hover:bg-paper-3"
      }`}
    >
      {label}
    </button>
  );
}

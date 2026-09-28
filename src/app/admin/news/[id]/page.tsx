import { notFound } from "next/navigation"; // 匯入「找不到頁面」的處理函式
import AdminNewsForm from "@/components/AdminNewsForm"; // 匯入最新消息整頁表單
import { getNewsById } from "@/lib/db"; // 匯入依 id 讀取單篇新聞(含草稿)的函式
import { toRichTextHtml } from "@/lib/rich-text"; // 匯入舊純文字內文轉 HTML 的工具

export const dynamic = "force-dynamic"; // 後台一定要看到最新資料

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) { // 後台「編輯消息」頁
  const { id } = await params;
  const item = await getNewsById(id);
  if (!item) notFound();
  return <AdminNewsForm item={item} initialContent={toRichTextHtml(item.content || item.excerpt)} />;
}

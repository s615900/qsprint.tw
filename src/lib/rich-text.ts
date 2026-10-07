import sanitizeHtml from "sanitize-html"; // 匯入 HTML 過濾工具，避免文章內容夾帶惡意程式碼

// 最新消息的內文由後台文字編輯器存成 HTML；舊文章是純文字(段落之間用空行分隔)，這裡統一轉成 HTML。
export function isHtml(content: string): boolean { // 判斷內容是不是 HTML(以標籤開頭)
  return /^\s*</.test(content);
}

function escapeHtml(text: string): string { // 把純文字裡的特殊符號轉成 HTML 實體
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function toRichTextHtml(content: string): string { // 舊的純文字內文轉成 <p> 段落，已經是 HTML 就原樣回傳
  if (isHtml(content)) return content;
  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function sanitizeRichText(html: string): string { // 只保留文字編輯器會產生的標籤與樣式
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "h2", "h3", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "blockquote", "hr", "img", "span"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
      span: ["style"],
      p: ["style"],
      h2: ["style"],
      h3: ["style"],
    },
    allowedStyles: {
      "*": {
        color: [/^#[0-9a-f]{3,8}$/i, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i],
        "text-align": [/^(left|center|right|justify)$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => ({ // 外部連結一律另開新分頁
        tagName,
        attribs: /^https?:\/\//.test(attribs.href ?? "") ? { ...attribs, target: "_blank", rel: "noopener noreferrer" } : attribs,
      }),
    },
  });
}

export function firstParagraphText(content: string): string { // 取內文第一段的純文字(去掉所有標籤)，用在只能放純文字的摘要處
  const firstP = toRichTextHtml(content).match(/<(p|h2|h3|li|blockquote)[^>]*>[\s\S]*?<\/\1>/i)?.[0] ?? "";
  return sanitizeHtml(firstP, { allowedTags: [], allowedAttributes: {} }) // 去掉標籤，並把 &amp; 等實體還原
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/\s+/g, " ").trim();
}

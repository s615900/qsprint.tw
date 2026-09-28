"use client"; // 標記為 Client Component，文字編輯器需要在瀏覽器端操作

import { useRef, useState, type ReactNode } from "react"; // 匯入 React 的 hook 與型別
import { useEditor, useEditorState, EditorContent, type Editor } from "@tiptap/react"; // 匯入 Tiptap 編輯器的 React 綁定
import StarterKit from "@tiptap/starter-kit"; // 匯入基本功能組(段落、標題、粗體、清單、引用、連結、底線等)
import Image from "@tiptap/extension-image"; // 匯入圖片功能
import TextAlign from "@tiptap/extension-text-align"; // 匯入文字對齊功能
import { TextStyle, Color } from "@tiptap/extension-text-style"; // 匯入文字顏色功能
import { uploadImageAction } from "@/app/admin/actions"; // 匯入圖片上傳的 Server Action

const textColors = [ // 文字顏色選項(沿用網站品牌色)
  { label: "預設", value: "" },
  { label: "金色", value: "#d58d3f" },
  { label: "珊瑚紅", value: "#d45757" },
  { label: "灰色", value: "#766d63" },
];

export default function RichTextEditor({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  // 文字編輯器，內容會以 HTML 存進同名的隱藏欄位，跟著表單一起送出
  const [html, setHtml] = useState(defaultValue); // 目前編輯器內容的 HTML
  const [uploading, setUploading] = useState(false); // 是否正在上傳內文圖片
  const [error, setError] = useState<string | null>(null); // 上傳失敗的錯誤訊息
  const fileInput = useRef<HTMLInputElement>(null); // 隱藏的檔案選擇框

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
    ],
    content: defaultValue,
    immediatelyRender: false, // Next.js 伺服器端渲染時不立即產生編輯器，避免 hydration 不一致
    editorProps: {
      attributes: { class: "rich-content min-h-[420px] px-5 py-4 focus:outline-none" }, // 與前台文章相同的排版樣式
    },
    onUpdate: ({ editor }) => setHtml(editor.isEmpty ? "" : editor.getHTML()), // 每次編輯都同步到隱藏欄位
  });

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) { // 選好圖片後上傳並插入內文
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const url = await uploadImageAction(formData);
      editor.chain().focus().setImage({ src: url, alt: "" }).run();
    } catch (err) {
      setError(err instanceof Error ? err.message : "圖片上傳失敗,請再試一次。");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-lg border border-line bg-paper"> {/* 編輯器外框(不用 overflow-hidden，否則工具列無法固定) */}
      <input type="hidden" name={name} value={html} />
      {editor && <Toolbar editor={editor} uploading={uploading} onPickImage={() => fileInput.current?.click()} />}
      <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleImage} />
      {error && <p className="border-b border-line bg-coral/10 px-4 py-2 text-[12px] text-coral">{error}</p>}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, uploading, onPickImage }: { editor: Editor; uploading: boolean; onPickImage: () => void }) {
  // 工具列；用 useEditorState 讓按鈕的選取狀態跟著游標位置更新
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      paragraph: editor.isActive("paragraph"),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      bullet: editor.isActive("bulletList"),
      ordered: editor.isActive("orderedList"),
      quote: editor.isActive("blockquote"),
      link: editor.isActive("link"),
      left: editor.isActive({ textAlign: "left" }),
      center: editor.isActive({ textAlign: "center" }),
      right: editor.isActive({ textAlign: "right" }),
      color: (editor.getAttributes("textStyle").color as string | undefined) ?? "",
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  function setLink() { // 設定或移除超連結
    const previous = (editor.getAttributes("link").href as string | undefined) ?? "";
    const url = window.prompt("輸入連結網址(留空移除連結)", previous || "https://");
    if (url === null) return; // 按取消
    if (url.trim() === "" || url.trim() === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  const chain = () => editor.chain().focus(); // 每個指令都先把焦點拉回編輯器

  return (
    <div className="sticky top-[78px] z-10 flex flex-wrap items-center gap-1 rounded-t-lg border-b border-line bg-paper-2 px-2 py-1.5"> {/* 捲動時工具列固定在頁面頂部列下方 */}
      <Btn label="復原" disabled={!state.canUndo} onClick={() => chain().undo().run()}>↶</Btn>
      <Btn label="重做" disabled={!state.canRedo} onClick={() => chain().redo().run()}>↷</Btn>
      <Sep />
      <Btn label="內文" active={state.paragraph} onClick={() => chain().setParagraph().run()}>內文</Btn>
      <Btn label="大標題" active={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>H2</Btn>
      <Btn label="小標題" active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>H3</Btn>
      <Sep />
      <Btn label="粗體" active={state.bold} onClick={() => chain().toggleBold().run()}><b>B</b></Btn>
      <Btn label="斜體" active={state.italic} onClick={() => chain().toggleItalic().run()}><i>I</i></Btn>
      <Btn label="底線" active={state.underline} onClick={() => chain().toggleUnderline().run()}><u>U</u></Btn>
      <Btn label="刪除線" active={state.strike} onClick={() => chain().toggleStrike().run()}><s>S</s></Btn>
      <select
        aria-label="文字顏色"
        value={state.color}
        onChange={(e) => (e.target.value ? chain().setColor(e.target.value).run() : chain().unsetColor().run())}
        className="h-8 rounded-md border border-line bg-paper px-1.5 text-[12.5px]"
      >
        {textColors.map((c) => (
          <option key={c.label} value={c.value}>
            {c.label === "預設" ? "文字顏色" : c.label}
          </option>
        ))}
      </select>
      <Btn label="清除格式" onClick={() => chain().unsetAllMarks().clearNodes().run()}>清除</Btn>
      <Sep />
      <Btn label="項目符號清單" active={state.bullet} onClick={() => chain().toggleBulletList().run()}>• 清單</Btn>
      <Btn label="編號清單" active={state.ordered} onClick={() => chain().toggleOrderedList().run()}>1. 清單</Btn>
      <Btn label="引用" active={state.quote} onClick={() => chain().toggleBlockquote().run()}>❝</Btn>
      <Btn label="分隔線" onClick={() => chain().setHorizontalRule().run()}>―</Btn>
      <Sep />
      <Btn label="靠左" active={state.left} onClick={() => chain().setTextAlign("left").run()}>靠左</Btn>
      <Btn label="置中" active={state.center} onClick={() => chain().setTextAlign("center").run()}>置中</Btn>
      <Btn label="靠右" active={state.right} onClick={() => chain().setTextAlign("right").run()}>靠右</Btn>
      <Sep />
      <Btn label="超連結" active={state.link} onClick={setLink}>連結</Btn>
      <Btn label="插入圖片" disabled={uploading} onClick={onPickImage}>{uploading ? "上傳中…" : "插入圖片"}</Btn>
    </div>
  );
}

function Btn({ label, active = false, disabled = false, onClick, children }: {
  label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode;
}) { // 工具列按鈕
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`h-8 min-w-8 rounded-md px-2 text-[12.5px] transition-colors disabled:opacity-35 ${
        active ? "bg-ink text-paper" : "text-ink hover:bg-paper-3"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() { // 工具列分隔線
  return <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />;
}

import type { IconId } from "@/components/ArtTile"; // 匯入圖示 ID 型別

export interface TonePreset { // 後台選色時使用的「圖示 + 配色」預設組合
  id: IconId; // 對應的圖示 ID，同時當作下拉選單的值
  label: string; // 下拉選單顯示的文字
  a: string; // 漸層主色
  b: string; // 漸層副色
}

export const tonePresets: TonePreset[] = [ // 預設配色清單，沿用網站既有的視覺風格
  { id: "baton", label: "接力棒・粉橘", a: "#FFB7C5", b: "#D58D3F" },
  { id: "blocks", label: "起跑器・黃藍", a: "#FFD699", b: "#1E2430" },
  { id: "hurdle", label: "跨欄・米橘", a: "#F8EFE2", b: "#D58D3F" },
  { id: "podium", label: "頒獎台・黃灰", a: "#FFD699", b: "#766D63" },
  { id: "stopwatch", label: "碼表・米紅", a: "#FDF6EC", b: "#D45757" },
  { id: "flags", label: "旗幟・粉藍", a: "#FFB7C5", b: "#1E2430" },
  { id: "lanes", label: "分道線・粉藍", a: "#FFB7C5", b: "#1E2430" },
  { id: "tape", label: "終點線・黃紅", a: "#FFD699", b: "#D45757" },
  { id: "stands", label: "看台・米藍", a: "#F8EFE2", b: "#1E2430" },
];

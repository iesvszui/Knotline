import * as THREE from "three";
import type { Publication } from "./publications";
import { trailImages } from "./publications";

const W = 768;
const H = 1086;

const loadImg = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });

function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const r = Math.max(w / img.width, h / img.height);
  const iw = img.width * r, ih = img.height * r;
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number, maxY: number) {
  const words = text.split(" ");
  let line = "";
  for (const w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y);
      line = w + " ";
      y += lh;
      if (y > maxY) return y;
    } else line = test;
  }
  ctx.fillText(line, x, y);
  return y + lh;
}

const LOREM =
  "Across the world's sea lanes, the quiet arithmetic of friction, fuel and time decides the fortunes of fleets. Operators who measure precisely gain an edge that compounds voyage after voyage. Our analysts spent the season aboard vessels, in dry docks and on terminal floors, collecting the observations that rarely make it into a spreadsheet. What emerges is a picture of an industry in transition, balancing regulatory pressure against commercial reality, and finding that the two are more aligned than they first appear. The data suggests that incremental improvements, consistently applied, outperform dramatic interventions. Crews remain the decisive variable, and technology is only as good as the routines that surround it. ";

function toTex(c: HTMLCanvasElement, mirror = false) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (mirror) {
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
    t.offset.x = 1;
  }
  return t;
}

export async function buildPages(pub: Publication) {
  const [coverImg, ...extras] = await Promise.all([loadImg(pub.cover), ...trailImages.map(loadImg)]);
  const total = pub.pageCount;
  const pages: HTMLCanvasElement[] = [];

  for (let p = 0; p < total; p++) {
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d")!;

    if (p === 0) {
      cover(ctx, coverImg, 0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgba(0,0,0,0.65)"); g.addColorStop(0.35, "rgba(0,0,0,0)");
      g.addColorStop(0.6, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.9)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.font = "600 34px Geist, Inter, sans-serif";
      ctx.letterSpacing = "14px";
      ctx.fillText("KNOTLINE", 56, 90);
      ctx.letterSpacing = "4px";
      ctx.font = "500 18px Inter, sans-serif";
      ctx.fillText(`${pub.edition.toUpperCase()}  ·  ${pub.date.toUpperCase()}`, 56, 128);
      ctx.letterSpacing = "0px";
      ctx.font = "italic 400 78px 'Playfair Display', serif";
      const y = wrap(ctx, pub.title, 56, H - 230, W - 112, 84, H);
      ctx.font = "400 22px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      wrap(ctx, pub.description, 56, Math.min(y + 4, H - 60), W - 160, 30, H);
    } else if (p === total - 1 || p === 1 || p === total - 2) {
      ctx.fillStyle = p === total - 1 ? "#0b0d10" : "#101317";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "600 26px Geist, Inter, sans-serif";
      ctx.letterSpacing = "12px";
      ctx.textAlign = "center";
      ctx.fillText("KNOTLINE", W / 2, H / 2);
      ctx.letterSpacing = "4px";
      ctx.font = "400 14px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillText("MARITIME STORIES, INTELLIGENCE & PUBLICATIONS", W / 2, H / 2 + 40);
      ctx.textAlign = "left";
      ctx.letterSpacing = "0px";
    } else {
      // paper
      ctx.fillStyle = "#f3efe6";
      ctx.fillRect(0, 0, W, H);
      const inner = ctx.createLinearGradient(p % 2 ? W : 0, 0, p % 2 ? W - 80 : 80, 0);
      inner.addColorStop(0, "rgba(0,0,0,0.12)"); inner.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = inner; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "500 13px Inter, sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillText(`KNOTLINE — ${pub.title.toUpperCase()}`, 60, 64);
      ctx.letterSpacing = "0px";
      ctx.fillRect(60, 80, W - 120, 1);
      const section = pub.sections[Math.floor((p - 2) / 4) % pub.sections.length] ?? "";
      const layout = p % 4;
      let y = 140;
      if (layout === 2 || layout === 0) {
        cover(ctx, extras[p % extras.length]!, 60, 110, W - 120, 440);
        y = 600;
      }
      ctx.fillStyle = "#0E5BA8";
      ctx.font = "600 13px Inter, sans-serif";
      ctx.letterSpacing = "3px";
      ctx.fillText(`SECTION ${String(Math.floor((p - 2) / 4) + 1).padStart(2, "0")}`, 60, y);
      ctx.letterSpacing = "0px";
      ctx.fillStyle = "#111";
      ctx.font = "italic 400 48px 'Playfair Display', serif";
      y = wrap(ctx, section, 60, y + 56, W - 120, 54, H);
      ctx.font = "400 17px Georgia, serif";
      ctx.fillStyle = "#333";
      const colW = (W - 120 - 30) / 2;
      const startY = y + 14;
      const text = LOREM.repeat(3);
      const half = Math.floor(text.length / 2);
      wrap(ctx, text.slice(p * 13 % 200, half), 60, startY, colW, 26, H - 110);
      wrap(ctx, text.slice(half), 60 + colW + 30, startY, colW, 26, H - 110);
      ctx.fillStyle = "#888";
      ctx.font = "500 13px Inter, sans-serif";
      ctx.textAlign = p % 2 ? "left" : "right";
      ctx.fillText(String(p), p % 2 ? 60 : W - 60, H - 50);
      ctx.textAlign = "left";
    }
    pages.push(c);
  }
  return pages;
}

export function pagesToSheetTextures(pages: HTMLCanvasElement[]) {
  const sheets: { front: THREE.Texture; back: THREE.Texture }[] = [];
  for (let i = 0; i < pages.length; i += 2) {
    sheets.push({ front: toTex(pages[i]!), back: toTex(pages[i + 1] ?? pages[i]!, true) });
  }
  return sheets;
}

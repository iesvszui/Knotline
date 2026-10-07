import { useEffect, useRef, useState } from "react";
import { trailImages } from "@/lib/publications";

type Item = { id: number; x: number; y: number; src: string; r: number };

export function ImageTrail({ slow = false }: { slow?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const last = useRef({ x: -999, y: -999, t: 0 });
  const idx = useRef(0);
  const id = useRef(0);
  const slowRef = useRef(slow);
  slowRef.current = slow;

  useEffect(() => {
    const el = ref.current!;
    const spawn = (x: number, y: number) => {
      const item = { id: id.current++, x, y, src: trailImages[idx.current++ % trailImages.length]!, r: (Math.random() - 0.5) * 8 };
      setItems((s) => [...s.slice(-14), item]);
      setTimeout(() => setItems((s) => s.filter((i) => i.id !== item.id)), slowRef.current ? 2600 : 1300);
    };
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      last.current.t = Date.now();
      const thr = slowRef.current ? 260 : 90;
      if (Math.hypot(x - last.current.x, y - last.current.y) > thr) {
        last.current.x = x; last.current.y = y;
        spawn(x, y);
      }
    };
    let a = 0;
    const auto = setInterval(() => {
      if (Date.now() - last.current.t < 2500) return;
      a += 0.45;
      const r = el.getBoundingClientRect();
      spawn(r.width / 2 + Math.sin(a) * r.width * 0.32, r.height / 2 + Math.sin(a * 1.7) * r.height * 0.22);
    }, slow ? 700 : 260);
    window.addEventListener("pointermove", onMove);
    return () => { window.removeEventListener("pointermove", onMove); clearInterval(auto); };
  }, [slow]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {items.map((i) => (
        <img
          key={i.id}
          src={i.src}
          alt=""
          className="trail-img"
          style={{ left: i.x, top: i.y, ["--r" as string]: `${i.r}deg`, ["--d" as string]: slow ? "2.6s" : "1.3s" }}
        />
      ))}
    </div>
  );
}

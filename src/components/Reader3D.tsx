import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import type { Publication } from "@/lib/publications";
import { buildPages, pagesToSheetTextures } from "@/lib/pageTextures";
import { playPageTurn, SOUND_KEY } from "@/lib/sound";

const PW = 1.4;
const PH = PW * 1.414;
const GAP = 0.0045;
const SEG = 36;

type Sheet = { front: THREE.Texture; back: THREE.Texture };

function PageSheet({ index, sheet, total, current }: { index: number; sheet: Sheet; total: number; current: number }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(PW, PH, SEG, 1);
    g.translate(PW / 2, 0, 0);
    return g;
  }, []);
  const base = useMemo(() => Float32Array.from(geo.getAttribute("position").array as Float32Array), [geo]);
  const theta = useRef(index < current ? Math.PI : 0);
  const dir = useRef(1);

  useFrame((_, dt) => {
    const target = index < current ? Math.PI : 0;
    const diff = target - theta.current;
    if (Math.abs(diff) > 0.0005) dir.current = Math.sign(diff);
    theta.current += diff * (1 - Math.exp(-dt * 4.2));
    const t = theta.current;
    const k = (Math.sin(t) * 1.1 * dir.current) / PW;
    const zUn = (total - index) * GAP;
    const zTu = index * GAP;
    const zb = zUn + (zTu - zUn) * (t / Math.PI);
    const pos = geo.getAttribute("position").array as Float32Array;
    for (let i = 0; i < pos.length; i += 3) {
      const x = base[i]!;
      let X: number, Z: number;
      if (Math.abs(k) < 1e-4) {
        X = x * Math.cos(t); Z = x * Math.sin(t);
      } else {
        X = (Math.sin(t) - Math.sin(t - k * x)) / k;
        Z = (Math.cos(t - k * x) - Math.cos(t)) / k;
      }
      pos[i] = X; pos[i + 2] = Z + zb;
    }
    geo.getAttribute("position").needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial map={sheet.front} side={THREE.FrontSide} roughness={0.85} />
      </mesh>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial map={sheet.back} side={THREE.BackSide} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Book({ sheets, current, ended }: { sheets: Sheet[]; current: number; ended: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const intro = useRef(0);
  const S = sheets.length;
  const rightD = Math.max(0.001, (S - current) * GAP);
  const leftD = Math.max(0.001, current * GAP);

  useFrame((_, dt) => {
    intro.current = Math.min(1, intro.current + dt / 1.8);
    const e = 1 - Math.pow(1 - intro.current, 4);
    const g = group.current!;
    const targetX = current === 0 ? -PW / 2 : current === S ? PW / 2 : 0;
    g.position.x += (targetX - g.position.x) * (1 - Math.exp(-dt * 3));
    g.position.z = -3 * (1 - e);
    const ry = (ended ? 0.35 : 0) + -0.7 * (1 - e);
    g.rotation.y += (ry - g.rotation.y) * (1 - Math.exp(-dt * (intro.current < 1 ? 20 : 1.5)));
    g.rotation.x = -0.12 * (1 - e) - 0.04;
    const aspect = size.width / size.height;
    const fit = (2 * PW + 0.4) / aspect / (2 * Math.tan(THREE.MathUtils.degToRad(17.5)));
    const zTarget = Math.max(4.4, fit);
    camera.position.z += (zTarget - camera.position.z) * (1 - Math.exp(-dt * 3));
  });

  return (
    <group ref={group}>
      {sheets.map((s, i) => (
        <PageSheet key={i} index={i} sheet={s} total={S} current={current} />
      ))}
      <mesh position={[PW / 2, 0, rightD / 2]}>
        <boxGeometry args={[PW * 0.995, PH * 0.995, rightD]} />
        <meshStandardMaterial color="#e9e3d6" roughness={1} />
      </mesh>
      <mesh position={[-PW / 2, 0, leftD / 2]}>
        <boxGeometry args={[PW * 0.995, PH * 0.995, leftD]} />
        <meshStandardMaterial color="#e9e3d6" roughness={1} />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.04, PH * 1.01, 0.02]} />
        <meshStandardMaterial color="#14181e" roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Reader3D({ pub, onExit }: { pub: Publication; onExit: () => void }) {
  const [sheets, setSheets] = useState<Sheet[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [sound, setSound] = useState(true);
  const [showEnd, setShowEnd] = useState(false);
  const lastWheel = useRef(0);
  const down = useRef<{ x: number; y: number } | null>(null);
  const S = sheets?.length ?? 0;

  useEffect(() => {
    setSound(localStorage.getItem(SOUND_KEY) !== "off");
    let alive = true;
    document.fonts.ready.then(() => buildPages(pub)).then((pages) => {
      if (alive) setSheets(pagesToSheetTextures(pages));
    });
    return () => { alive = false; };
  }, [pub]);

  useEffect(() => {
    if (!sheets) return;
    const t = setTimeout(() => setCurrent(1), 1500);
    return () => clearTimeout(t);
  }, [sheets]);

  const go = useCallback(
    (d: number) => {
      setCurrent((c) => {
        const n = Math.max(0, Math.min(S, c + d));
        if (n !== c && sound) playPageTurn();
        return n;
      });
    },
    [S, sound],
  );

  useEffect(() => {
    if (!S) return;
    if (current === S) {
      const t = setTimeout(() => setShowEnd(true), 1300);
      return () => clearTimeout(t);
    }
    setShowEnd(false);
  }, [current, S]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onExit]);

  const toggleSound = () => {
    setSound((s) => {
      localStorage.setItem(SOUND_KEY, s ? "off" : "on");
      return !s;
    });
  };

  const pageLabel = Math.min(Math.max(1, current * 2), pub.pageCount);

  return (
    <div
      className="fixed inset-0 z-50 bg-background touch-none select-none"
      onWheel={(e) => {
        const now = Date.now();
        if (now - lastWheel.current < 700 || Math.abs(e.deltaY) < 8) return;
        lastWheel.current = now;
        go(e.deltaY > 0 ? 1 : -1);
      }}
      onPointerDown={(e) => (down.current = { x: e.clientX, y: e.clientY })}
      onPointerUp={(e) => {
        if (!down.current || showEnd) return;
        const dx = e.clientX - down.current.x;
        down.current = null;
        if ((e.target as HTMLElement).closest("button")) return;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        else go(e.clientX > window.innerWidth / 2 ? 1 : -1);
      }}
    >
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 45% at 50% 45%, oklch(0.22 0.02 250 / 0.6), transparent 70%)" }} />
      {sheets ? (
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 35 }} gl={{ antialias: true }}>
          <ambientLight intensity={0.55} />
          <spotLight position={[1.5, 3, 5]} angle={0.6} penumbra={0.8} intensity={60} castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-3, 2, 4]} intensity={0.6} />
          <Book sheets={sheets} current={current} ended={current === S} />
        </Canvas>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center eyebrow animate-pulse">Preparing publication</div>
      )}

      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-6 md:p-8">
        <button onClick={onExit} className="pointer-events-auto font-display text-sm font-semibold tracking-[0.4em]">
          KNOTLINE
        </button>
        <div className="text-right">
          <p className="font-serif italic text-base md:text-lg">{pub.title}</p>
          <p className="eyebrow mt-1">{pub.edition} · {pub.date}</p>
        </div>
      </header>

      <footer className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8">
        <div className="pointer-events-auto flex items-center gap-6">
          <button onClick={onExit} className="btn-ghost-lux">← Archive</button>
          <button onClick={toggleSound} className="btn-ghost-lux" aria-label="Toggle page sound">
            {sound ? "Sound On" : "Sound Off"}
          </button>
        </div>
        <div className="flex items-center gap-5">
          <div className="pointer-events-auto flex gap-2 md:hidden">
            <button onClick={() => go(-1)} className="btn-ghost-lux px-2" aria-label="Previous page">←</button>
            <button onClick={() => go(1)} className="btn-ghost-lux px-2" aria-label="Next page">→</button>
          </div>
          <p className="font-display text-sm tabular-nums tracking-widest">
            {pageLabel} <span className="text-muted-foreground">/ {pub.pageCount}</span>
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {showEnd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-background/70 backdrop-blur-sm"
          >
            <p className="eyebrow">{pub.title}</p>
            <h2 className="font-display text-3xl md:text-5xl font-light tracking-[0.25em] text-center">END OF PUBLICATION</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button className="btn-lux" onClick={() => setCurrent(0)}>Read Again</button>
              <button className="btn-ghost-lux px-6" onClick={onExit}>Back To Archive</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

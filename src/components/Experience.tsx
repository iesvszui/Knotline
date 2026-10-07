import { lazy, Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import Lenis from "lenis";
import { ImageTrail } from "./ImageTrail";
import { Bookshelf } from "./Bookshelf";
import { BookCover } from "./BookCover";
import { publications, getPublication, type Publication } from "@/lib/publications";

const Reader3D = lazy(() => import("./Reader3D"));
const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "hero" | "leaving" | "archive" | "focus" | "opening" | "reader";

export function Experience({ initialSlug }: { initialSlug?: string }) {
  const [phase, setPhase] = useState<Phase>("hero");
  const [picked, setPicked] = useState<{ pub: Publication; rect: DOMRect } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const p = initialSlug ? getPublication(initialSlug) : undefined;
    if (p) {
      setPicked({ pub: p, rect: new DOMRect(window.innerWidth / 2 - 96, window.innerHeight / 2 - 136, 192, 272) });
      setPhase("reader");
    }
  }, [initialSlug]);

  useEffect(() => {
    if (phase !== "archive" && phase !== "focus") return;
    const lenis = new Lenis({ lerp: 0.085 });
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    if (phase === "focus") lenis.stop();
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, [phase]);

  const explore = () => {
    setPhase("leaving");
    setTimeout(() => setPhase("archive"), 1700);
  };

  const readIssue = () => {
    if (!picked) return;
    setPhase("opening");
    setTimeout(() => {
      setPhase("reader");
      navigate({ to: "/publication/$slug", params: { slug: picked.pub.slug }, replace: false });
    }, 1400);
  };

  const exitReader = () => {
    setPhase("archive");
    setPicked(null);
    navigate({ to: "/" });
  };

  const showHero = phase === "hero" || phase === "leaving";

  return (
    <div className="relative min-h-screen bg-background">
      {showHero && (
        <motion.section
          className="grain fixed inset-0 overflow-hidden"
          animate={phase === "leaving" ? { scale: 1.18 } : { scale: 1 }}
          transition={{ duration: 1.7, ease: EASE }}
        >
          <ImageTrail slow={phase === "leaving"} />
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, var(--background) 95%)" }} />
          <motion.div
            className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
            animate={phase === "leaving" ? { opacity: 0, y: -30, filter: "blur(8px)" } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <p className="eyebrow mb-8">Maritime Stories, Intelligence & Publications</p>
            <h1 className="font-display text-[18vw] font-semibold leading-none tracking-[0.06em] md:text-[11rem]">KNOTLINE</h1>
            <p className="mt-8 max-w-md text-base text-muted-foreground md:text-lg">
              Explore our latest insights through immersive digital publications.
            </p>
            <button onClick={explore} className="btn-lux pointer-events-auto mt-12">
              Explore Archive <span aria-hidden>→</span>
            </button>
          </motion.div>
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "leaving" ? 1 : 0 }}
            transition={{ duration: 1.6, ease: EASE, delay: phase === "leaving" ? 0.2 : 0 }}
          />
        </motion.section>
      )}

      {!showHero && phase !== "reader" && (
        <motion.main
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{
            opacity: phase === "opening" ? 0 : 1,
            scale: phase === "opening" ? 1.08 : 1,
            filter: phase === "focus" || phase === "opening" ? "blur(6px)" : "blur(0px)",
          }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative mx-auto max-w-6xl px-0 pb-40 pt-28 md:px-6"
        >
          <header className="mb-24 flex flex-col items-center px-6 text-center">
            <button onClick={() => setPhase("hero")} className="font-display text-sm font-semibold tracking-[0.45em]">KNOTLINE</button>
            <p className="eyebrow mt-16">The Archive · {publications.length} Publications</p>
            <h2 className="mt-6 max-w-2xl font-serif text-4xl italic leading-tight md:text-6xl">A library of the sea, bound in editions.</h2>
          </header>
          <Bookshelf
            pubs={publications}
            hiddenSlug={phase === "focus" || phase === "opening" ? picked?.pub.slug : undefined}
            onPick={(pub, rect) => { setPicked({ pub, rect }); setPhase("focus"); }}
          />
        </motion.main>
      )}

      <AnimatePresence>
        {picked && (phase === "focus" || phase === "opening") && (
          <motion.div
            key="focus"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            initial={{ backgroundColor: "oklch(0.105 0 0 / 0)" }}
            animate={{ backgroundColor: phase === "opening" ? "oklch(0.105 0 0 / 1)" : "oklch(0.105 0 0 / 0.55)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            onClick={(e) => { if (e.target === e.currentTarget && phase === "focus") setPhase("archive"); }}
          >
            <FocusBook pub={picked.pub} rect={picked.rect} opening={phase === "opening"} />
            <motion.div
              className="mt-12 flex flex-col items-center gap-4 text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: phase === "opening" ? 0 : 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: phase === "opening" ? 0 : 1.1 }}
            >
              <p className="eyebrow">{picked.pub.edition} · {picked.pub.date}</p>
              <p className="max-w-xs text-sm text-muted-foreground">{picked.pub.description}</p>
              <button className="btn-lux mt-2" onClick={readIssue}>Read Issue</button>
              <button className="btn-ghost-lux mt-1" onClick={() => setPhase("archive")}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "reader" && picked && (
        <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
          <Reader3D pub={picked.pub} onExit={exitReader} />
        </Suspense>
      )}
    </div>
  );
}

function FocusBook({ pub, rect, opening }: { pub: Publication; rect: DOMRect; opening: boolean }) {
  const w = typeof window !== "undefined" ? Math.min(260, window.innerWidth * 0.6) : 260;
  const h = w * 1.414;
  const cx = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  const cy = typeof window !== "undefined" ? window.innerHeight / 2 - 80 : 0;
  const dx = rect.left + rect.width / 2 - cx;
  const dy = rect.top + rect.height / 2 - cy;
  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        style={{ width: w, height: h, transformStyle: "preserve-3d", boxShadow: "var(--shadow-book-lift)" }}
        initial={{ x: dx, y: dy, z: 0, scale: rect.width / w, rotateY: 0 }}
        animate={
          opening
            ? { x: 0, y: 0, z: 400, scale: 1.3, rotateY: -25, opacity: 0, transition: { duration: 1.3, ease: EASE } }
            : {
                x: [dx, dx, 0], y: [dy, dy - 20, 0], z: [0, 120, 60], scale: [rect.width / w, rect.width / w, 1.05],
                rotateY: [0, 35, -8], transition: { duration: 1.3, ease: EASE, times: [0, 0.35, 1] },
              }
        }
      >
        <BookCover pub={pub} large />
      </motion.div>
    </div>
  );
}

import type { Publication } from "@/lib/publications";

export function BookCover({ pub, large = false }: { pub: Publication; large?: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-surface">
      <img src={pub.cover} alt={pub.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="cover-sheen absolute inset-0" />
      <div className={`absolute inset-0 flex flex-col justify-between ${large ? "p-7" : "p-3 md:p-4"}`}>
        <div>
          <p className={`font-display font-semibold tracking-[0.4em] ${large ? "text-sm" : "text-[0.55rem]"}`}>KNOTLINE</p>
          <p className={`mt-1 tracking-[0.2em] text-foreground/70 ${large ? "text-xs" : "text-[0.5rem]"}`}>
            {pub.edition.toUpperCase()} · {pub.date.toUpperCase()}
          </p>
        </div>
        <p className={`font-serif italic leading-[1.05] ${large ? "text-4xl" : "text-base md:text-lg"}`}>{pub.title}</p>
      </div>
    </div>
  );
}

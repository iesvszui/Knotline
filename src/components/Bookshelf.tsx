import type { Publication } from "@/lib/publications";
import { BookCover } from "./BookCover";

export function Bookshelf({ pubs, onPick, hiddenSlug }: { pubs: Publication[]; onPick: (p: Publication, rect: DOMRect) => void; hiddenSlug?: string | undefined }) {
  const rows: Publication[][] = [];
  for (let i = 0; i < pubs.length; i += 4) rows.push(pubs.slice(i, i + 4));

  return (
    <div className="space-y-20 md:space-y-28">
      {rows.map((row, ri) => (
        <div key={ri} className="shelf-row relative">
          <div className="shelf-back absolute inset-x-0 -top-10 bottom-4 -z-10" />
          <div className="flex items-end gap-6 overflow-x-auto px-4 pt-14 md:justify-center md:gap-12 md:overflow-visible md:px-10">
            {row.map((p) => (
              <button
                key={p.slug}
                className="book shrink-0 text-left outline-none"
                style={{ opacity: hiddenSlug === p.slug ? 0 : 1 }}
                onClick={(e) => onPick(p, (e.currentTarget.querySelector(".book-inner") as HTMLElement).getBoundingClientRect())}
                aria-label={`Open ${p.title}`}
              >
                <div className="book-inner h-[13.5rem] w-[9.5rem] md:h-[17rem] md:w-[12rem]">
                  <div className="book-spine" />
                  <BookCover pub={p} />
                </div>
              </button>
            ))}
          </div>
          <div className="shelf-plank relative mx-auto h-5 w-full md:h-6" />
          <div className="mx-auto h-3 w-[98%] bg-wood-dark/80" />
        </div>
      ))}
    </div>
  );
}

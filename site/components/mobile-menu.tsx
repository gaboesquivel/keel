"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

type Item = { href: string; label: string };

/** Receives its links as props so the client bundle doesn't include the generated content. */
export function MobileMenu({ learn, items, repoUrl }: { learn: Item[]; items: Item[]; repoUrl: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const link = (item: Item) => (
    <li key={item.href}>
      <Link href={item.href} onClick={() => setOpen(false)} className="block border-b border-line py-4 text-lg font-semibold text-fg">
        {item.label}
      </Link>
    </li>
  );
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-10 items-center justify-center rounded-lg border border-line-strong text-fg"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          {open ? <path d="m5 5 10 10M15 5 5 15" /> : <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />}
        </svg>
      </button>
      {open ? (
        <nav id={id} aria-label="Mobile" className="absolute inset-x-0 top-[4.25rem] max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-b border-line bg-canvas px-5 pb-6 pt-2 shadow-2xl">
          {learn.length ? (
            <>
              <p className="label-mono pt-4">Read</p>
              <ul className="flex flex-col">{learn.map(link)}</ul>
              <p className="label-mono pt-6">Tools and project</p>
            </>
          ) : null}
          <ul className="flex flex-col">
            {items.map(link)}
            <li>
              <a href={repoUrl} rel="noopener" className="block py-4 text-lg font-semibold text-fg">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

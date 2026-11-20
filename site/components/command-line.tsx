"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";

/**
 * A copyable command: a shell command (`$`) or a Claude Code prompt (`>`).
 * `boxed` stands alone with its own border; `plain` sits inside a surface that already frames it.
 */
export function CommandLine({
  command,
  prompt = "$",
  label = "command",
  variant = "boxed",
  className,
}: {
  command: string;
  prompt?: "$" | ">";
  label?: string;
  variant?: "boxed" | "plain";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 font-mono text-sm sm:gap-4",
        variant === "boxed" && "rounded-xl border border-line-strong bg-canvas-deep px-4 py-3.5 sm:px-5 sm:py-4",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("select-none", prompt === "$" ? "text-pink" : "text-periwinkle")}>
        {prompt}
      </span>
      {/* One logical line: long commands scroll inside this region; the page itself never overflows. */}
      <code className="scrollbar-thin min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-1 pr-4 text-[#ead9ff] [mask-image:linear-gradient(to_right,#000_calc(100%-1.25rem),transparent)] focus-visible:outline-offset-1 sm:pr-0 sm:[mask-image:none]">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 font-sans text-xs font-medium transition-colors",
          copied ? "border-lavender/40 text-lavender" : "border-line-strong text-fg-muted hover:border-lavender/40 hover:text-fg",
        )}
      >
        {copied ? <Check aria-hidden="true" className="size-3" /> : <Copy aria-hidden="true" className="size-3" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        <span className="sr-only"> {label}</span>
      </button>
    </div>
  );
}

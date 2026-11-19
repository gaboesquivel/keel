"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

/** A copyable command: a shell command (`$`) or a Claude Code prompt (`>`). */
export function CommandLine({ command, prompt = "$", label = "command", className }: { command: string; prompt?: "$" | ">"; label?: string; className?: string }) {
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
    <div className={cn("flex items-start gap-3 rounded-xl border border-line-strong bg-canvas-deep px-4 py-3.5 font-mono text-sm sm:items-center sm:gap-4 sm:px-5 sm:py-4", className)}>
      <span aria-hidden="true" className={cn("select-none", prompt === "$" ? "text-pink" : "text-periwinkle")}>
        {prompt}
      </span>
      <code className="min-w-0 flex-1 text-[#ead9ff] [overflow-wrap:anywhere] sm:overflow-x-auto sm:whitespace-nowrap sm:[overflow-wrap:normal]">{command}</code>
      <button type="button" onClick={copy} className="-my-1 shrink-0 rounded-md px-2 py-1 text-xs text-fg-muted hover:bg-panel-raised hover:text-fg">
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        <span className="sr-only"> {label}</span>
      </button>
    </div>
  );
}

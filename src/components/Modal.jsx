"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

export default function Modal({ open, onClose, children, className, label = "Dialog" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-label={label}
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        style={{ animation: "pop-in 0.3s var(--ease-out-cinema)" }}
      />
      <div
        className={cn(
          "relative w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-bg-2",
          className
        )}
        style={{
          animation: "pop-in 0.4s var(--ease-out-cinema)",
          boxShadow:
            "0 50px 100px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 inline-flex size-9 items-center justify-center rounded-full border border-line bg-surface text-fg-2 transition hover:bg-surface-2 hover:text-fg"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

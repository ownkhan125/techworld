"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

// Nav links resolve to real routes on the deep-dive pages. Home only
// carries a subset of these as anchor sections, so pointing users at the
// full pages avoids dead hash links and gives the Navbar a proper IA.
const NAV_LINKS = [
  { label: "Platform", href: "/platform" },
  { label: "Projects", href: "/projects" },
  { label: "Customers", href: "/customers" },
  { label: "Developers", href: "/developers" },
  { label: "Contact", href: "/contact" },
];

// Match logic — a link is "active" when the current pathname equals the
// link's href OR (for anything but "/") is a nested route under it. The
// second case only matters if we later add /platform/foo sub-routes; it's
// still correct today because none of those exist.
function isActiveRoute(pathname, href) {
  if (href === "/") return pathname === "/";
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

function Logo() {
  return (
    <Link
      href="/"
      aria-label="Techworld home"
      className="group flex min-w-0 shrink-0 items-center gap-2"
    >
      <span
        className="relative inline-flex size-7 items-center justify-center overflow-hidden rounded-md"
        style={{
          background:
            "linear-gradient(135deg, hsl(178 92% 66%) 0%, hsl(262 90% 72%) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 0 0 1px rgba(255,255,255,0.18), 0 6px 20px -8px rgba(94,240,230,0.55)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 9.5l3-6 2.2 4L9 4.5l3 5"
            stroke="rgba(6,7,10,0.85)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-sm font-semibold tracking-tight text-fg">
        Techworld
      </span>
    </Link>
  );
}

function NavLink({ href, children, active }) {
  // Active treatment reuses the hover chrome so behavior stays consistent:
  //   - text goes to fg
  //   - surface pill fades in
  //   - underline gradient scales to full width
  // Achieved by keeping the hover selectors AND adding data-active which
  // forces the same computed style. That way hovering an active link
  // doesn't visibly "double" the effect.
  return (
    <Link
      href={href}
      data-active={active ? "true" : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative inline-flex h-9 items-center rounded-md px-3 text-[13px] font-medium transition-colors duration-300",
        active ? "text-fg" : "text-fg-3 hover:text-fg"
      )}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className={cn(
          "absolute inset-1 -z-0 rounded-md bg-surface transition-opacity duration-300",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-3 bottom-1.5 h-px origin-left bg-gradient-to-r from-cyan/0 via-cyan/70 to-violet/0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
      {/* Active dot — small cyan pip anchored top-right of the pill so the
          state reads at a glance even for keyboard users. Hidden when
          inactive so hover chrome stays clean. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-1.5 top-1.5 size-1 rounded-full bg-cyan transition-opacity duration-300",
          active ? "opacity-100" : "opacity-0"
        )}
        style={{ boxShadow: active ? "0 0 8px hsla(178,92%,66%,0.7)" : "none" }}
      />
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes so nav clicks don't
  // leave the sheet hanging open on the destination page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
      <div
        className={cn(
          "pointer-events-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-2 rounded-2xl border border-line/80 px-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-4",
          scrolled
            ? "bg-bg/65 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]"
            : "bg-bg/35 backdrop-blur-md"
        )}
      >
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.href} href={l.href} active={isActiveRoute(pathname, l.href)}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden text-[13px] font-medium text-fg-3 transition-colors hover:text-fg sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/contact"
            className="btn-key h-9 whitespace-nowrap px-3 text-[13px] sm:px-3.5"
          >
            Get access
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-line text-fg-2 transition-colors hover:bg-surface lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 right-0 top-0 h-px bg-current transition-transform duration-300",
                  open ? "translate-y-[6px] rotate-45" : ""
                )}
              />
              <span
                className={cn(
                  "absolute left-0 right-0 top-[6px] h-px bg-current transition-opacity duration-200",
                  open ? "opacity-0" : "opacity-100"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 right-0 top-[12px] h-px bg-current transition-transform duration-300",
                  open ? "-translate-y-[6px] -rotate-45" : ""
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "pointer-events-auto fixed inset-x-3 top-20 z-40 origin-top overflow-hidden rounded-2xl border border-line bg-bg-2/95 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "pointer-events-none opacity-0 scale-95 -translate-y-2"
        )}
      >
        <nav className="flex flex-col p-3">
          {NAV_LINKS.map((l, i) => {
            const active = isActiveRoute(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-3 text-sm transition",
                  active
                    ? "bg-surface text-fg"
                    : "text-fg-2 hover:bg-surface hover:text-fg"
                )}
                style={{ transitionDelay: open ? `${i * 30}ms` : "0ms" }}
              >
                <span className="inline-flex items-center gap-2">
                  {active ? (
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-cyan"
                      style={{ boxShadow: "0 0 8px hsla(178,92%,66%,0.7)" }}
                    />
                  ) : null}
                  {l.label}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={active ? "text-cyan" : "text-fg-4"}>
                  <path
                    d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="btn-key mt-2 h-11 w-full justify-center"
          >
            Get access
          </Link>
        </nav>
      </div>
    </header>
  );
}

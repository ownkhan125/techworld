import Link from "next/link";

// Footer links point at real routes where they exist. Anchors are only
// used for links that resolve to a section still on the home page (e.g.
// #ai, #features on "/"). Everything else routes to /platform, /customers,
// /developers or /contact so nothing dead-ends.
const COLS = [
  {
    title: "Product",
    links: [
      { l: "Platform",      href: "/platform" },
      { l: "AI",            href: "/#ai" },
      { l: "Capabilities",  href: "/platform#agents" },
      { l: "Developers",    href: "/developers" },
      { l: "Changelog",     href: "/developers#docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { l: "About",         href: "/" },
      { l: "Customers",     href: "/customers" },
      { l: "Careers",       href: "/contact" },
      { l: "Press",         href: "/contact" },
      { l: "Brand",         href: "/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { l: "Docs",          href: "/developers#docs" },
      { l: "Samples",       href: "/developers" },
      { l: "API reference", href: "/developers" },
      { l: "Status",        href: "/#ai" },
      { l: "Support",       href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { l: "Privacy",       href: "/contact" },
      { l: "Terms",         href: "/contact" },
      { l: "Security",      href: "/contact" },
      { l: "DPA",           href: "/contact" },
      { l: "Compliance",    href: "/contact" },
    ],
  },
];

// Social icons were dropped: there's no real Twitter/GitHub/LinkedIn URL
// to route to, and pointing them all at /contact (or "/") reads as
// misleading — a Twitter icon should land on Twitter. Removing the strip
// avoids dead clickable elements. The Contact link column already gives
// a proper "reach us" destination below.

export default function Footer() {
  return (
    // Footer glass darkened (bg-2/40 → bg/80 + bg-2/85 stack) so the
    // Footer reads as a heavier base plate than the sections above it.
    // Adds subtle inner top hairline for depth.
    <footer
      className="relative border-t border-line bg-bg pt-16"
      style={{
        background:
          "linear-gradient(180deg, rgba(10,11,15,0.82) 0%, rgba(6,7,10,0.96) 60%, rgba(6,7,10,1) 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="container-x">
        <div className="grid grid-cols-2 gap-10 pb-16 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span
                className="relative inline-flex size-7 items-center justify-center rounded-md"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(178 92% 66%) 0%, hsl(262 90% 72%) 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 0 0 1px rgba(255,255,255,0.18)",
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
            <p className="mt-5 max-w-[28ch] text-[13px] leading-relaxed text-fg-2">
              The compute fabric powering a new generation of autonomous products.
            </p>
            {/* Dead social icons removed — see SOCIALS comment above. */}
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-3">
                {c.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((it) => (
                  <li key={it.l}>
                    <Link
                      href={it.href}
                      className="text-[13px] text-fg-2 transition-colors duration-300 hover:text-fg"
                    >
                      {it.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-line py-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-fg-3">
            © {new Date().getFullYear()} Techworld Labs, Inc. · Built in Brooklyn & Lisbon
          </p>
          <p className="font-mono text-[11px] text-fg-3">
            v0.9.21 · status: <span className="text-cyan">nominal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

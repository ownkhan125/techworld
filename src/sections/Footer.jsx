import Link from "next/link";

const COLS = [
  {
    title: "Product",
    links: ["Platform", "Edge runtime", "Observability", "Pricing", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Customers", "Careers", "Press", "Brand"],
  },
  {
    title: "Resources",
    links: ["Docs", "Guides", "API reference", "Status", "Support"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "DPA", "Compliance"],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-bg-2/40 pt-16">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-10 pb-16 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="#top" className="flex items-center gap-2">
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
            <p className="mt-5 max-w-[28ch] text-[13px] leading-relaxed text-fg-3">
              The compute fabric powering a new generation of autonomous products.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { label: "Twitter", path: "M22 5.8c-.7.3-1.5.6-2.4.7.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.7 1A4.3 4.3 0 0011 9.4 12.2 12.2 0 013 5.1a4.3 4.3 0 001.3 5.7 4.3 4.3 0 01-1.9-.5v.1c0 2 1.5 3.8 3.4 4.2a4.3 4.3 0 01-1.9.1 4.3 4.3 0 004 3 8.6 8.6 0 01-6.3 1.8 12.2 12.2 0 006.6 1.9c7.9 0 12.2-6.6 12.2-12.2v-.6c.8-.6 1.5-1.3 2.1-2.1z" },
                { label: "GitHub", path: "M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.7-.3 2.5-.3.8 0 1.7.1 2.5.3 1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0012 2z" },
                { label: "LinkedIn", path: "M4.98 3.5a2.5 2.5 0 11.02 5 2.5 2.5 0 010-5zM3 9h4v12H3V9zm6 0h3.8v1.7h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9-1.8 0-2.1 1.4-2.1 2.8V21H9V9z" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="inline-flex size-9 items-center justify-center rounded-md border border-line text-fg-3 transition hover:bg-surface hover:text-fg"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-4">
                {c.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[13px] text-fg-3 transition-colors duration-300 hover:text-fg"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-line py-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-fg-4">
            © {new Date().getFullYear()} Techworld Labs, Inc. · Built in Brooklyn & Lisbon
          </p>
          <p className="font-mono text-[11px] text-fg-4">
            v0.9.21 · status: <span className="text-cyan">nominal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

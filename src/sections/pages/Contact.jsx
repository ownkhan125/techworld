"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CinematicSection from "@/components/CinematicSection";
import SectionTitle from "@/components/SectionTitle";
import SectionFrame from "@/components/SectionFrame";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Contact page — dedicated route (/contact).
 *
 * Layout:
 *   LEFT  — glassmorphism form. Real client-side validation, animated
 *           loading state, success state that swaps into the card body.
 *   RIGHT — contact-methods panel: three chips (email / chat / HQ), each
 *           reads as a card in the same tone family as the home page's
 *           LiveCards. Beneath: a subtle "response-time" pill.
 *
 * Cinematic: entry uses the shared CinematicSection stages (frame → media
 * → heading → body → cta) so it inherits the home page's motion language.
 * SectionFrame traces the card wrapper on enter.
 */

const REASONS = [
  { value: "product", label: "Product question" },
  { value: "pilot", label: "Enterprise pilot" },
  { value: "security", label: "Security / compliance" },
  { value: "press", label: "Press or partnership" },
  { value: "other", label: "Something else" },
];

const CONTACT_METHODS = [
  {
    key: "email",
    label: "Write",
    value: "hello@techworld.dev",
    href: "mailto:hello@techworld.dev",
    tone: "cyan",
    body: "Reach the founding team directly. Replies within one working day.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  // Chat + Visit have no real destination — they're informational only
  // (no /chat page, no venue booking flow). `href: null` renders them as
  // non-interactive `<div>`s in the ContactMethods panel below, so users
  // aren't fooled into clicking a dead affordance.
  {
    key: "chat",
    label: "Chat",
    value: "techworld.dev/chat",
    href: null,
    tone: "violet",
    body: "Live product help during business hours in Lisbon and Brooklyn.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v8A2.5 2.5 0 0117.5 17H10l-4 3v-3H6.5A2.5 2.5 0 014 14.5v-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "office",
    label: "Visit",
    value: "Brooklyn · Lisbon",
    href: null,
    tone: "amber",
    body: "By appointment. Two hubs, one team, one shared workspace.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s7-6.6 7-12a7 7 0 10-14 0c0 5.4 7 12 7 12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const TONE_BORDER = {
  cyan: "rgba(94,240,230,0.35)",
  violet: "rgba(167,139,250,0.35)",
  amber: "rgba(251,191,36,0.35)",
};

const TONE_FG = {
  cyan: "text-cyan",
  violet: "text-violet",
  amber: "text-amber",
};

export default function Contact() {
  return (
    <>
      <CinematicSection
        id="contact"
        mode="onload"
        className="relative isolate flex min-h-[clamp(680px,92svh,940px)] flex-col justify-center overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pt-36"
      >
        {/* Soft radial vignette */}
        <div
          aria-hidden
          data-stage="bg"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] sm:h-[940px]"
          style={{
            background:
              "radial-gradient(ellipse 55% 55% at 50% 40%, rgba(6,7,10,0.6) 0%, rgba(6,7,10,0.28) 55%, transparent 100%)",
          }}
        />

        <div className="container-x">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div data-stage="frame">
              <Eyebrow tone="cyan">Contact</Eyebrow>
            </div>
            <SectionTitle
              title="Let's talk."
              sub="Tell us what you're building. Whether it's a two-week pilot or a 200-node fleet, we'll get back within one working day."
            />
          </div>

          {/* Two-column contact grid */}
          <div className="relative mx-auto mt-10 grid max-w-[1180px] grid-cols-1 gap-6 lg:mt-14 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
            <SectionFrame radius={22} inset={-8} />
            <ContactForm />
            <ContactMethods />
          </div>
        </div>
      </CinematicSection>
    </>
  );
}

/* --------------------- form --------------------- */

function ContactForm() {
  const [state, setState] = useState({
    values: { name: "", email: "", company: "", reason: "product", message: "" },
    errors: {},
    status: "idle", // idle | submitting | success
  });
  const successRef = useRef(null);

  const setField = (k, v) => {
    setState((s) => ({
      ...s,
      values: { ...s.values, [k]: v },
      errors: { ...s.errors, [k]: undefined },
    }));
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name.trim()) errors.name = "Your name, please.";
    else if (values.name.trim().length < 2) errors.name = "That looks a little short.";
    if (!values.email.trim()) errors.email = "Where should we reply?";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errors.email = "That email doesn't look right.";
    if (!values.message.trim()) errors.message = "A short note goes a long way.";
    else if (values.message.trim().length < 12)
      errors.message = "A bit more context helps us reply well.";
    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (state.status !== "idle") return;
    const errors = validate(state.values);
    if (Object.keys(errors).length) {
      setState((s) => ({ ...s, errors }));
      // focus first invalid
      const first = Object.keys(errors)[0];
      const el = document.querySelector(`[data-field="${first}"]`);
      el?.focus?.();
      return;
    }
    setState((s) => ({ ...s, status: "submitting" }));
    // Simulate a real network round-trip so the loading state is meaningful.
    // Swap for a real POST when the endpoint exists.
    await new Promise((r) => setTimeout(r, 1400));
    setState((s) => ({ ...s, status: "success" }));
  };

  // Animate the success takeover with GSAP for a cinematic swap that matches
  // the rest of the site's motion language.
  useEffect(() => {
    if (state.status !== "success") return;
    if (!successRef.current) return;
    const ctx = gsap.context(() => {
      const parts = successRef.current.querySelectorAll("[data-success-part]");
      gsap.fromTo(
        parts,
        { opacity: 0, y: 14, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.08,
          ease: "expo.out",
        }
      );
    }, successRef);
    return () => ctx.revert();
  }, [state.status]);

  return (
    <Reveal
      data-stage="media"
      className="relative"
    >
      <div
        className="relative overflow-hidden rounded-3xl border border-line-strong p-6 backdrop-blur-2xl sm:p-8 lg:p-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,22,30,0.72) 0%, rgba(12,14,20,0.86) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), 0 40px 90px -40px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Corner glow — top-right cyan bloom */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, hsla(178,92%,66%,0.28), transparent 70%)",
            filter: "blur(8px)",
          }}
        />

        {state.status === "success" ? (
          <SuccessPanel ref={successRef} onReset={() =>
            setState({
              values: { name: "", email: "", company: "", reason: "product", message: "" },
              errors: {},
              status: "idle",
            })
          } />
        ) : (
          <form onSubmit={onSubmit} noValidate className="relative">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
              Send a message
            </p>
            <h3 className="mt-2 text-[22px] font-semibold tracking-tight text-fg sm:text-[26px]">
              Tell us what you're building.
            </h3>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Name"
                name="name"
                autoComplete="name"
                required
                value={state.values.name}
                onChange={(v) => setField("name", v)}
                error={state.errors.name}
              />
              <Field
                label="Work email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={state.values.email}
                onChange={(v) => setField("email", v)}
                error={state.errors.email}
              />
              <Field
                label="Company"
                name="company"
                autoComplete="organization"
                value={state.values.company}
                onChange={(v) => setField("company", v)}
                error={state.errors.company}
              />
              <SelectField
                label="Reason"
                name="reason"
                value={state.values.reason}
                onChange={(v) => setField("reason", v)}
                options={REASONS}
              />
            </div>

            <div className="mt-4">
              <TextareaField
                label="Message"
                name="message"
                required
                value={state.values.message}
                onChange={(v) => setField("message", v)}
                error={state.errors.message}
                rows={5}
                counter={{ current: state.values.message.length, max: 800 }}
              />
            </div>

            <div className="mt-6 flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[11px] text-fg-3">
                We reply personally. No auto-drip, no CRM tag.
              </p>
              <button
                type="submit"
                disabled={state.status !== "idle"}
                className="btn-key h-11 min-w-[168px] justify-center px-5"
              >
                {state.status === "submitting" ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner />
                    <span>Sending</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <span>Send message</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Reveal>
  );
}

/* --------------- form primitives --------------- */

function Field({ label, name, type = "text", value, onChange, error, required, autoComplete }) {
  const id = `field-${name}`;
  const invalid = !!error;
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.2em] text-fg-3">
        <span>{label}{required ? <span className="ml-1 text-cyan">*</span> : null}</span>
        {invalid ? <span className="normal-case tracking-normal text-[11px] font-sans text-rose">{error}</span> : null}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        data-field={name}
        aria-invalid={invalid}
        className={
          "block w-full rounded-lg border bg-bg-2/80 px-3.5 py-2.5 text-[14px] text-fg placeholder:text-fg-4 outline-none transition-colors duration-200 " +
          (invalid
            ? "border-rose/60 focus:border-rose"
            : "border-line focus:border-cyan/60 focus:bg-bg-2")
        }
      />
    </label>
  );
}

function TextareaField({ label, name, value, onChange, error, required, rows, counter }) {
  const id = `field-${name}`;
  const invalid = !!error;
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.2em] text-fg-3">
        <span>{label}{required ? <span className="ml-1 text-cyan">*</span> : null}</span>
        {invalid ? (
          <span className="normal-case tracking-normal text-[11px] font-sans text-rose">{error}</span>
        ) : counter ? (
          <span className="tabular-nums text-fg-4">
            {counter.current}/{counter.max}
          </span>
        ) : null}
      </span>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, counter?.max ?? Infinity))}
        rows={rows}
        data-field={name}
        aria-invalid={invalid}
        className={
          "block w-full resize-y rounded-lg border bg-bg-2/80 px-3.5 py-2.5 text-[14px] leading-relaxed text-fg placeholder:text-fg-4 outline-none transition-colors duration-200 " +
          (invalid
            ? "border-rose/60 focus:border-rose"
            : "border-line focus:border-cyan/60 focus:bg-bg-2")
        }
      />
    </label>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  const id = `field-${name}`;
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-[0.2em] text-fg-3">
        {label}
      </span>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full appearance-none rounded-lg border border-line bg-bg-2/80 px-3.5 py-2.5 pr-9 text-[14px] text-fg outline-none transition-colors duration-200 focus:border-cyan/60 focus:bg-bg-2"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-bg text-fg">
              {o.label}
            </option>
          ))}
        </select>
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          fill="none"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg-3"
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </label>
  );
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="0.9s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

/* --------------- success takeover --------------- */
const SuccessPanel = forwardRef(function SuccessPanel({ onReset }, ref) {
  return (
    <div ref={ref} className="relative min-h-[380px]">
        <div data-success-part className="flex items-center gap-3">
          <span
            className="relative inline-flex size-11 items-center justify-center rounded-full"
            style={{
              background:
                "linear-gradient(135deg, hsl(178 92% 66%), hsl(195 90% 55%))",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 30px hsla(178,92%,66%,0.45)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 8" stroke="rgba(6,7,10,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
            Message received
          </p>
        </div>
        <h3 data-success-part className="mt-5 max-w-[24ch] text-[26px] font-semibold tracking-tight text-fg sm:text-[30px]">
          We'll be in touch shortly.
        </h3>
        <p data-success-part className="mt-3 max-w-[46ch] text-[14px] leading-relaxed text-fg-2">
          Your note is on our founding team's desk. Replies land within one working day —
          usually the same day for pilots and security reviews.
        </p>

        <div data-success-part className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { k: "Reply", v: "≤ 24h" },
            { k: "Channel", v: "Same thread" },
            { k: "From", v: "Founding team" },
          ].map((row) => (
            <div
              key={row.k}
              className="rounded-lg border border-line bg-bg-2/70 px-3.5 py-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-3">{row.k}</p>
              <p className="mt-1 text-[13px] font-semibold text-fg">{row.v}</p>
            </div>
          ))}
        </div>

      <div data-success-part className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="btn-ghost h-10 px-4 text-[13px]"
        >
          Send another
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-fg-2 transition-colors hover:text-fg"
        >
          Back to home
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
});

/* --------------- right column: contact methods --------------- */

function ContactMethods() {
  return (
    <Reveal data-stage="body" className="relative">
      <div className="flex flex-col gap-4">
        {CONTACT_METHODS.map((m) => {
          // Only render as an anchor when the method actually has a
          // destination. Chat / Visit are informational — no `href` means
          // no clickable affordance, so users don't try clicking a card
          // that doesn't go anywhere.
          const clickable = !!m.href;
          const chrome = {
            className:
              "group relative block overflow-hidden rounded-2xl border bg-bg-2/70 p-5 backdrop-blur-md sm:p-6" +
              (clickable
                ? " transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-bg-2/90"
                : ""),
            style: {
              borderColor: TONE_BORDER[m.tone] || "rgba(255,255,255,0.14)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 40px -24px rgba(0,0,0,0.7)",
            },
          };
          const inner = (
            <div className="flex items-start gap-4">
              <span
                className={
                  "relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface " +
                  (TONE_FG[m.tone] || "text-cyan")
                }
                style={{
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                {m.icon}
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
                  {m.label}
                </p>
                <p className="mt-1 truncate text-[15px] font-semibold text-fg">
                  {m.value}
                </p>
                <p className="mt-2 max-w-[36ch] text-[13px] leading-relaxed text-fg-2">
                  {m.body}
                </p>
              </div>
              {clickable ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="ml-auto mt-1 shrink-0 text-fg-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path
                    d="M4 10L10 4M10 4H5M10 4v5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </div>
          );
          if (clickable) {
            return (
              <a key={m.key} href={m.href} {...chrome}>
                {inner}
              </a>
            );
          }
          return (
            <div key={m.key} {...chrome}>
              {inner}
            </div>
          );
        })}

        {/* Response-time pill */}
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-dashed border-line px-5 py-4">
          <span className="relative flex size-2 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-cyan/70" />
            <span className="relative size-2 rounded-full bg-cyan" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-fg">Currently online</p>
            <p className="mt-0.5 font-mono text-[11px] text-fg-3">
              Median reply time · 3h 12m
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

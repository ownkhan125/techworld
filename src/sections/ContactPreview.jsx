"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";

export default function ContactPreview() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Early access");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="section-pad relative">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <SectionTitle
          align="left"
          eyebrow="Get in touch"
          eyebrowTone="amber"
          title="Tell us what you're building."
          sub="An engineer replies — no SDR funnel, no scheduling theatre. Most replies arrive within an hour."
        />

        <Reveal>
          <form
            onSubmit={onSubmit}
            className="card relative grid grid-cols-1 gap-4 p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-4">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-11 rounded-md border border-line bg-bg/60 px-3 text-[14px] text-fg placeholder:text-fg-4 outline-none transition focus:border-cyan/60 focus:bg-bg"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-4">
                  Topic
                </span>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="h-11 rounded-md border border-line bg-bg/60 px-3 text-[14px] text-fg outline-none transition focus:border-cyan/60 focus:bg-bg"
                >
                  <option>Early access</option>
                  <option>Enterprise</option>
                  <option>Research</option>
                  <option>Partnership</option>
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-4">
                What are you building?
              </span>
              <textarea
                rows={4}
                placeholder="A fleet of vision agents for warehouse automation…"
                className="resize-none rounded-md border border-line bg-bg/60 px-3 py-3 text-[14px] text-fg placeholder:text-fg-4 outline-none transition focus:border-cyan/60 focus:bg-bg"
              />
            </label>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] text-fg-4">
                By submitting you agree to our{" "}
                <a href="#" className="text-fg-2 underline-offset-2 hover:underline">
                  privacy policy
                </a>
                .
              </p>
              <button type="submit" className="btn-key h-11 px-5 text-[14px]">
                {sent ? "Sent — talk soon" : "Send message"}
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

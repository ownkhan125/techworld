"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import { cn } from "@/utils/cn";

const ITEMS = [
  {
    q: "How is Techworld different from a model API?",
    a: "Model APIs hand you a single endpoint. Techworld hands you a substrate — the place where models, agents, devices, queues, and policies live as one programmable graph. You bring the logic; we handle the distribution.",
  },
  {
    q: "Can I bring my own models?",
    a: "Yes. Any container or model artifact you can run elsewhere runs here, with the same APIs and the same accelerator support. We co-locate with the major foundries so you don't pay egress to use them.",
  },
  {
    q: "What does pricing look like?",
    a: "Usage-based — you pay for compute-seconds and edge invocations. There is a generous free tier for development, and committed-use discounts kick in automatically as your fleet grows.",
  },
  {
    q: "Is my data isolated?",
    a: "Every tenant runs inside hardware-attested enclaves with per-tenant key vaults. SOC 2 Type II, ISO 27001 and HIPAA-eligible. Bring-your-own-VPC for regulated workloads.",
  },
  {
    q: "How do you handle multi-region failover?",
    a: "Graphs declare placement intent, not physical regions. Our planner keeps replicas warm across availability zones and continents and reroutes within milliseconds if a region degrades.",
  },
  {
    q: "Do you support on-prem and edge devices?",
    a: "The same runtime ships as a 30MB binary that runs on x86, ARM and NVIDIA Jetson. Bring it on-device and it joins your fleet the moment it has a network.",
  },
];

function Item({ q, a, open, onClick, i }) {
  return (
    <div className="border-b border-line">
      <button
        onClick={onClick}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-300 hover:text-fg"
      >
        <span className={cn("text-base font-medium tracking-tight sm:text-lg", open ? "text-fg" : "text-fg-2")}>
          {q}
        </span>
        <span
          className={cn(
            "relative ml-4 flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-fg-3 transition-colors duration-300 group-hover:text-fg",
            open && "bg-surface text-fg"
          )}
        >
          <span className="absolute h-px w-3 bg-current" />
          <span
            className={cn(
              "absolute h-3 w-px bg-current transition-transform duration-300",
              open && "scale-y-0"
            )}
          />
        </span>
      </button>
      <div
        className="grid overflow-hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          <p className="pb-6 text-[14px] leading-relaxed text-fg-3 sm:text-[15px]">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section-pad relative">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionTitle
          align="left"
          eyebrow="Frequently asked"
          eyebrowTone="violet"
          title="Answers, before you have to ask."
          sub="If you don't see what you need, our team replies in under an hour during business hours."
        />
        <Reveal>
          <div className="card divide-y divide-line p-2 sm:p-4">
            <div className="px-4">
              {ITEMS.map((it, i) => (
                <Item
                  key={it.q}
                  i={i}
                  q={it.q}
                  a={it.a}
                  open={open === i}
                  onClick={() => setOpen(open === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

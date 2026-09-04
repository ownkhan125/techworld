// Portfolio catalog. Add new projects here — the /projects page filter
// bar, featured spotlight and grid pick them up automatically. Categories
// below are the source of truth for the chip filter; every project.category
// value must exist in CATEGORIES.
//
// Keep the first entry as the "featured" project — it renders in the
// spotlight card above the grid.

export const CATEGORIES = [
  { value: "all",       label: "All work",   tone: "cyan" },
  { value: "vision",    label: "Vision",     tone: "violet" },
  { value: "agents",    label: "Agents",     tone: "cyan" },
  { value: "fleet",     label: "Fleet ops",  tone: "rose" },
  { value: "internal",  label: "Internal",   tone: "amber" },
  { value: "research",  label: "Research",   tone: "emerald" },
];

export const PROJECTS = [
  {
    slug: "helion-fleet",
    title: "Autonomous warehouse fleet — 212 robots on one plan.",
    client: "Helion Robotics",
    year: "2026",
    category: "fleet",
    categoryLabel: "Fleet ops",
    tone: "cyan",
    image:
      "https://images.unsplash.com/photo-1581091012184-7ce2b6b0a37e?w=1600&q=80&auto=format&fit=crop",
    body:
      "We rewrote Helion's 14-service inference pipeline as a single Techworld plan. Signed rollouts land in seconds, latency dropped 6×, and the ops team shrank from eight to two — with better visibility than they had before.",
    tags: ["Robotics", "Rollouts", "Traces"],
    metrics: [
      { k: "Latency",   v: "−83%" },
      { k: "Nodes",     v: "212" },
      { k: "Ops team",  v: "8 → 2" },
    ],
  },
  {
    slug: "sentry-vision",
    title: "Real-time detection network across 1,400 cameras.",
    client: "Sentry Vision",
    year: "2026",
    category: "vision",
    categoryLabel: "Vision",
    tone: "violet",
    image:
      "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=1600&q=80&auto=format&fit=crop",
    body:
      "One inference surface for every RTSP feed. Zero-shot fine-tuning on the hardest 40 clips took a week; every subsequent camera onboards in a keystroke.",
    tags: ["RTSP", "Detection", "Edge"],
    metrics: [
      { k: "Cameras",   v: "1,400" },
      { k: "Throughput", v: "142 fps" },
      { k: "MTTR",      v: "22m" },
    ],
  },
  {
    slug: "lattice-agents",
    title: "Deterministic agents for a live trading desk.",
    client: "Lattice AI",
    year: "2025",
    category: "agents",
    categoryLabel: "Agents",
    tone: "violet",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80&auto=format&fit=crop",
    body:
      "47 agent SKUs, all replay-able token by token. Incidents that used to take three hours to reconstruct now close in twenty minutes because the desk can walk through every decision.",
    tags: ["Agents", "Replay", "Finance"],
    metrics: [
      { k: "MTTR",   v: "3h → 22m" },
      { k: "SKUs",   v: "47" },
      { k: "Regions", v: "12" },
    ],
  },
  {
    slug: "gro-internal",
    title: "Every internal tool, one keystroke away.",
    client: "Gro",
    year: "2025",
    category: "internal",
    categoryLabel: "Internal",
    tone: "amber",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80&auto=format&fit=crop",
    body:
      "Snippets, quicklinks, hotkeys and dashboards, all wired through one Techworld workspace. The whole team switched in a week and the CS queue got 30% faster.",
    tags: ["Workflow", "Extensions"],
    metrics: [
      { k: "Tools", v: "42" },
      { k: "CS TTR", v: "−31%" },
      { k: "Adoption", v: "94%" },
    ],
  },
  {
    slug: "cortex-oncall",
    title: "The dashboard on-call actually leaves open.",
    client: "Cortex",
    year: "2025",
    category: "fleet",
    categoryLabel: "Fleet ops",
    tone: "rose",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80&auto=format&fit=crop",
    body:
      "A single fleet-inspector panel replaced four vendor consoles. Latency, cost and health render on the same plane, with signed rollouts one keystroke away.",
    tags: ["SRE", "Rollouts", "Cost"],
    metrics: [
      { k: "Consoles", v: "4 → 1" },
      { k: "Rollout",  v: "3.2s" },
      { k: "Cost",     v: "−22%" },
    ],
  },
  {
    slug: "rin-replay",
    title: "Token-grain replay for an ML research team.",
    client: "Rin AI",
    year: "2025",
    category: "research",
    categoryLabel: "Research",
    tone: "emerald",
    image:
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1600&q=80&auto=format&fit=crop",
    body:
      "Every training and evaluation run streams into a Techworld trace store. Diffing two runs at the token level is now a right-click — no offline post-processing, no missing spans.",
    tags: ["Research", "Eval", "Traces"],
    metrics: [
      { k: "Traces / day", v: "1.2B" },
      { k: "Sample rate",  v: "1:1" },
      { k: "Retention $",  v: "−41%" },
    ],
  },
  {
    slug: "petal-vision",
    title: "In-store vision for a specialty retailer.",
    client: "Petal",
    year: "2024",
    category: "vision",
    categoryLabel: "Vision",
    tone: "rose",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80&auto=format&fit=crop",
    body:
      "Shelf-level detection across 120 stores. Restocks trigger the moment a facing drops below the model's threshold — no manual walkthroughs, no lost sales.",
    tags: ["Retail", "Edge", "Detection"],
    metrics: [
      { k: "Stores",   v: "120" },
      { k: "Restocks", v: "+38%" },
      { k: "Cost / store", v: "$14/mo" },
    ],
  },
  {
    slug: "meridian-agents",
    title: "Claim triage agents for an insurance platform.",
    client: "Meridian",
    year: "2024",
    category: "agents",
    categoryLabel: "Agents",
    tone: "amber",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80&auto=format&fit=crop",
    body:
      "Long-running claim agents with human-in-the-loop pauses at every regulatory checkpoint. The compliance team can audit any decision back to the source doc.",
    tags: ["Insurance", "Compliance", "Agents"],
    metrics: [
      { k: "Time to triage", v: "9m" },
      { k: "Audit trail",    v: "100%" },
      { k: "Escalations",    v: "−54%" },
    ],
  },
  {
    slug: "fable-internal",
    title: "A private assistant that never leaves the room.",
    client: "Fable",
    year: "2024",
    category: "internal",
    categoryLabel: "Internal",
    tone: "cyan",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80&auto=format&fit=crop",
    body:
      "A fully on-fleet assistant for a legal team that couldn't send a byte outside their VPC. Fine-tuned on their runbooks; served entirely on Techworld nodes they operate.",
    tags: ["Private", "Legal", "On-fleet"],
    metrics: [
      { k: "Query p50", v: "180ms" },
      { k: "Data egress", v: "0" },
      { k: "Adoption",   v: "88%" },
    ],
  },
];

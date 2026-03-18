import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "motion/react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useIsMobile } from "./ui/useMediaQuery";

/* ─────────────────────────────────────────
   Constants & Easing
   ───────────────────────────────────────── */
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const COLORS = {
  bg: "#0a0a0b",
  fg: "#e8e6e3",
  muted: "#8a8a96",
  dim: "#6b6b76",
  ghost: "#3a3a42",
  accent: "#c4ff00",
  accentMuted: "rgba(196,255,0,0.5)",
  accentGhost: "rgba(196,255,0,0.08)",
  border: "rgba(255,255,255,0.06)",
  card: "#111113",
  cardHover: "#151517",
};

/* ─────────────────────────────────────────
   Data
   ───────────────────────────────────────── */

const HERO_METRICS = [
  { value: 340, suffix: "%", label: "Avg. Conversion Lift", prefix: "+", description: "Across 6 flagship redesigns" },
  { value: 2.4, suffix: "M", label: "Users Impacted", prefix: "", description: "Monthly active users reached" },
  { value: 67, suffix: "%", label: "Avg. Task-Time Reduction", prefix: "-", description: "Measured via usability studies" },
  { value: 96, suffix: "", label: "NPS Score (Highest)", prefix: "", description: "Post-launch user satisfaction" },
];

const GROWTH_DATA = [
  { month: "Jan", users: 120, engagement: 34 },
  { month: "Feb", users: 145, engagement: 38 },
  { month: "Mar", users: 210, engagement: 45 },
  { month: "Apr", users: 280, engagement: 52 },
  { month: "May", users: 340, engagement: 61 },
  { month: "Jun", users: 395, engagement: 68 },
  { month: "Jul", users: 520, engagement: 74 },
  { month: "Aug", users: 610, engagement: 79 },
  { month: "Sep", users: 780, engagement: 83 },
  { month: "Oct", users: 920, engagement: 86 },
  { month: "Nov", users: 1050, engagement: 89 },
  { month: "Dec", users: 1240, engagement: 92 },
];

const BEFORE_AFTER = [
  {
    metric: "Onboarding Completion",
    before: 23,
    after: 71,
    unit: "%",
    project: "Meridian",
    context: "Redesigned 12-step flow into 4 progressive stages",
  },
  {
    metric: "Support Tickets / Week",
    before: 340,
    after: 89,
    unit: "",
    project: "VOID",
    context: "Clarity-driven UI reduced confusion by 74%",
  },
  {
    metric: "Time-to-First-Value",
    before: 14,
    after: 3,
    unit: " min",
    project: "AETHER",
    context: "Streamlined setup wizard with smart defaults",
  },
  {
    metric: "Feature Adoption Rate",
    before: 12,
    after: 58,
    unit: "%",
    project: "FORMA",
    context: "Progressive disclosure + contextual education",
  },
];

const FUNNEL_DATA = [
  { stage: "Visitors", value: 100, count: "2.4M" },
  { stage: "Sign-ups", value: 68, count: "1.63M" },
  { stage: "Activated", value: 52, count: "1.25M" },
  { stage: "Engaged (D7)", value: 41, count: "984K" },
  { stage: "Retained (D30)", value: 34, count: "816K" },
  { stage: "Paid Convert", value: 18, count: "432K" },
];

const UX_IMPROVEMENTS = [
  { label: "Task Success Rate", value: 97, prev: 64 },
  { label: "Error Rate Reduction", value: 82, prev: 0 },
  { label: "Accessibility Score", value: 98, prev: 52 },
  { label: "SUS Score", value: 91, prev: 58 },
];

const PROJECT_OUTCOMES = [
  {
    project: "Meridian",
    role: "Lead Product Designer",
    metrics: [
      { label: "Revenue Impact", value: "+$4.2M ARR" },
      { label: "Conversion Lift", value: "+340%" },
      { label: "Churn Reduction", value: "-28%" },
    ],
    summary: "End-to-end billing platform redesign for Stripe. Transformed a developer-hostile flow into an intuitive self-serve experience.",
  },
  {
    project: "VOID",
    role: "Design Lead & Strategy",
    metrics: [
      { label: "DAU Growth", value: "+180%" },
      { label: "Session Duration", value: "+4.2 min" },
      { label: "NPS Score", value: "96" },
    ],
    summary: "Spatial computing interface for creative professionals. Pioneered gesture-based navigation that became an industry reference.",
  },
  {
    project: "AETHER",
    role: "Creative Director",
    metrics: [
      { label: "Adoption Rate", value: "+420%" },
      { label: "Time-to-Value", value: "-78%" },
      { label: "Retention (D30)", value: "72%" },
    ],
    summary: "AI-powered design tool. Reduced cognitive overhead through progressive complexity and smart defaults.",
  },
];

/* ─────────────────────────────────────────
   Reveal Wrapper
   ───────────────────────────────────────── */

function Reveal({
  children,
  delay = 0,
  y = 35,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Animated Counter — counts from 0 to target
   ───────────────────────────────────────── */

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    stiffness: 40,
    damping: 25,
    duration: duration * 1000,
  });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) {
      motionVal.set(value);
    }
  }, [inView, value, motionVal]);

  useEffect(() => {
    const unsub = springVal.on("change", (v) => {
      setDisplay(
        decimals > 0
          ? v.toFixed(decimals)
          : Math.round(v).toLocaleString()
      );
    });
    return unsub;
  }, [springVal, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────
   Hero KPI Card
   ───────────────────────────────────────── */

function KPICard({
  metric,
  index,
}: {
  metric: (typeof HERO_METRICS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group border border-white/[0.04] hover:border-[#c4ff00]/[0.12] p-8 md:p-10 transition-colors duration-700 overflow-hidden"
    >
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: hovered
            ? "radial-gradient(ellipse at 50% 100%, rgba(196,255,0,0.04) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 100%, rgba(196,255,0,0) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Index */}
      <span
        className="text-[0.5rem] tracking-[0.5em] text-[#3a3a42] block mb-6"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Big number */}
      <div className="mb-4">
        <span
          className="text-[clamp(2.4rem,5vw,4rem)] tracking-[-0.04em] text-[#e8e6e3] block"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1 }}
        >
          <AnimatedCounter
            value={metric.value}
            prefix={metric.prefix}
            suffix={metric.suffix}
            decimals={metric.value % 1 !== 0 ? 1 : 0}
          />
        </span>
      </div>

      {/* Label */}
      <span
        className="text-[0.625rem] tracking-[0.4em] uppercase text-[#8a8a96] group-hover:text-[#c4ff00] transition-colors duration-500 block mb-3"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {metric.label}
      </span>

      {/* Description */}
      <span
        className="text-[0.8125rem] text-[#6b6b76] leading-[1.6]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {metric.description}
      </span>

      {/* Corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-5 h-5 border-t border-r border-[#c4ff00]/25"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Radial Progress Ring — UX Improvement
   ───────────────────────────────────────── */

function RadialRing({
  item,
  index,
}: {
  item: (typeof UX_IMPROVEMENTS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const circumference = 2 * Math.PI * 42;
  const progress = (item.value / 100) * circumference;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      className="flex flex-col items-center text-center group"
    >
      <div className="relative w-[108px] h-[108px] mb-6">
        <svg width="108" height="108" viewBox="0 0 108 108" className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx="54"
            cy="54"
            r="42"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="2"
            fill="none"
          />
          {/* Progress */}
          <motion.circle
            cx="54"
            cy="54"
            r="42"
            stroke="#c4ff00"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: circumference - progress } : { strokeDashoffset: circumference }}
            transition={{ duration: 1.5, delay: 0.3 + index * 0.12, ease: EASE }}
          />
          {/* Ghost ring — previous value */}
          {item.prev > 0 && (
            <circle
              cx="54"
              cy="54"
              r="42"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (item.prev / 100) * circumference}
            />
          )}
        </svg>

        {/* Center number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[1.5rem] tracking-[-0.03em] text-[#e8e6e3] tabular-nums"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1 }}
          >
            {inView ? <AnimatedCounter value={item.value} suffix="%" /> : "0%"}
          </span>
          {item.prev > 0 && (
            <span
              className="text-[0.5rem] tracking-[0.2em] text-[#3a3a42] mt-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              was {item.prev}%
            </span>
          )}
        </div>
      </div>

      <span
        className="text-[0.5625rem] tracking-[0.35em] uppercase text-[#6b6b76] group-hover:text-[#8a8a96] transition-colors duration-500"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {item.label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Before/After Card
   ───────────────────────────────────────── */

function BeforeAfterCard({
  item,
  index,
}: {
  item: (typeof BEFORE_AFTER)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  const improvement = item.after > item.before
    ? `+${Math.round(((item.after - item.before) / item.before) * 100)}%`
    : `-${Math.round(((item.before - item.after) / item.before) * 100)}%`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-white/[0.04] hover:border-[#c4ff00]/[0.1] p-7 md:p-8 transition-colors duration-700 relative overflow-hidden"
    >
      {/* Hover bg */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: hovered
            ? "linear-gradient(180deg, rgba(196,255,0,0.02) 0%, transparent 60%)"
            : "linear-gradient(180deg, rgba(196,255,0,0) 0%, transparent 60%)",
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Project tag */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <span
          className="text-[0.5rem] tracking-[0.5em] uppercase text-[#3a3a42]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {item.project}
        </span>
        <span
          className="text-[0.625rem] tracking-[0.15em] text-[#c4ff00] px-2 py-1 bg-[#c4ff00]/[0.06] border border-[#c4ff00]/[0.1]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {improvement}
        </span>
      </div>

      {/* Metric name */}
      <span
        className="text-[clamp(0.9rem,1.3vw,1.1rem)] tracking-[-0.01em] text-[#e8e6e3] block mb-5 relative z-10"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, lineHeight: 1.3 }}
      >
        {item.metric}
      </span>

      {/* Before / After bars */}
      <div className="space-y-3 mb-5 relative z-10">
        {/* Before */}
        <div className="flex items-center gap-3">
          <span
            className="text-[0.5rem] tracking-[0.4em] text-[#3a3a42] w-12 shrink-0"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            BEFORE
          </span>
          <div className="flex-1 h-2 bg-white/[0.03] relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-white/[0.08]"
              initial={{ width: 0 }}
              animate={inView ? { width: `${(item.before / Math.max(item.before, item.after)) * 100}%` } : {}}
              transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: EASE }}
            />
          </div>
          <span
            className="text-[0.75rem] text-[#6b6b76] tabular-nums w-12 text-right shrink-0"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {item.before}{item.unit}
          </span>
        </div>

        {/* After */}
        <div className="flex items-center gap-3">
          <span
            className="text-[0.5rem] tracking-[0.4em] text-[#c4ff00]/50 w-12 shrink-0"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            AFTER
          </span>
          <div className="flex-1 h-2 bg-white/[0.03] relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#c4ff00]/60 to-[#c4ff00]/20"
              initial={{ width: 0 }}
              animate={inView ? { width: `${(item.after / Math.max(item.before, item.after)) * 100}%` } : {}}
              transition={{ duration: 1.2, delay: 0.5 + index * 0.1, ease: EASE }}
            />
          </div>
          <span
            className="text-[0.75rem] text-[#e8e6e3] tabular-nums w-12 text-right shrink-0"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {item.after}{item.unit}
          </span>
        </div>
      </div>

      {/* Context */}
      <p
        className="text-[0.75rem] text-[#6b6b76] leading-[1.6] relative z-10"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {item.context}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Funnel Visual
   ───────────────────────────────────────── */

function FunnelVisualization() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="relative">
      <div className="space-y-1">
        {FUNNEL_DATA.map((stage, i) => {
          const widthPct = stage.value;
          const dropoff = i > 0
            ? Math.round(((FUNNEL_DATA[i - 1].value - stage.value) / FUNNEL_DATA[i - 1].value) * 100)
            : 0;

          return (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              className="group"
            >
              <div className="flex items-center gap-4 md:gap-6">
                {/* Label */}
                <div className="w-24 md:w-32 shrink-0 text-right">
                  <span
                    className="text-[0.5625rem] tracking-[0.25em] uppercase text-[#6b6b76] group-hover:text-[#8a8a96] transition-colors duration-300"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {stage.stage}
                  </span>
                </div>

                {/* Bar */}
                <div className="flex-1 relative h-8 md:h-10">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#c4ff00]/[0.15] to-[#c4ff00]/[0.04] border-l-2 border-[#c4ff00]/40 group-hover:from-[#c4ff00]/[0.2] group-hover:to-[#c4ff00]/[0.06] transition-colors duration-500"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${widthPct}%` } : {}}
                    transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: EASE }}
                  />

                  {/* Count label inside bar */}
                  <motion.div
                    className="absolute inset-y-0 left-3 flex items-center"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 + i * 0.12, duration: 0.5 }}
                  >
                    <span
                      className="text-[0.6875rem] text-[#e8e6e3]/80 tabular-nums"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {stage.count}
                    </span>
                  </motion.div>
                </div>

                {/* Dropoff indicator */}
                <div className="w-12 shrink-0 text-right">
                  {dropoff > 0 && (
                    <motion.span
                      className="text-[0.5rem] tracking-[0.15em] text-[#6b6b76]/50"
                      style={{ fontFamily: "var(--font-mono)" }}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 1 + i * 0.1, duration: 0.4 }}
                    >
                      -{dropoff}%
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Project Outcome Card
   ───────────────────────────────────────── */

function ProjectOutcomeCard({
  project,
  index,
}: {
  project: (typeof PROJECT_OUTCOMES)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: EASE }}
      className="border border-white/[0.04] hover:border-[#c4ff00]/[0.1] transition-colors duration-700 overflow-hidden group"
    >
      {/* Header */}
      <div className="px-6 md:px-8 pt-6 md:pt-8 pb-6 border-b border-white/[0.03]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <span
            className="text-[clamp(1.2rem,2vw,1.6rem)] tracking-[-0.02em] text-[#e8e6e3]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1 }}
          >
            {project.project}
          </span>
          <span
            className="text-[0.5rem] tracking-[0.4em] uppercase text-[#3a3a42] group-hover:text-[#6b6b76] transition-colors duration-500"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {project.role}
          </span>
        </div>
        <p
          className="text-[0.8125rem] text-[#6b6b76] leading-[1.6] group-hover:text-[#8a8a96] transition-colors duration-500"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {project.summary}
        </p>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.03]">
        {project.metrics.map((m, i) => (
          <motion.div
            key={m.label}
            className="px-6 py-6 text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: EASE }}
          >
            <span
              className="text-[clamp(1.1rem,2.2vw,1.6rem)] tracking-[-0.02em] text-[#c4ff00] block mb-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1 }}
            >
              {m.value}
            </span>
            <span
              className="text-[0.45rem] tracking-[0.4em] uppercase text-[#6b6b76]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {m.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Custom Recharts Tooltip
   ───────────────────────────────────────── */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="border border-white/[0.08] px-4 py-3 backdrop-blur-md"
      style={{ background: "rgba(10,10,11,0.92)" }}
    >
      <span
        className="text-[0.5rem] tracking-[0.4em] text-[#6b6b76] block mb-2"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </span>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: p.color }}
          />
          <span
            className="text-[0.6875rem] text-[#e8e6e3] tabular-nums"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
            {p.name === "Engagement" ? "%" : p.name === "Users" ? "K" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Efficiency Bar Chart Data
   ───────────────────────────────────────── */

const EFFICIENCY_DATA = [
  { name: "Design Handoff", before: 5.2, after: 1.1 },
  { name: "QA Cycles", before: 4.8, after: 1.6 },
  { name: "User Research", before: 3.5, after: 2.8 },
  { name: "Iteration Speed", before: 2.0, after: 4.8 },
  { name: "Stakeholder Sign-off", before: 4.2, after: 1.4 },
];

/* ═════════════════════════════════════════
   MAIN — ImpactSection
   ═════════════════════════════════════════ */

export function ImpactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const oversizedY = useTransform(scrollYProgress, [0, 1], isMobile ? [30, -40] : [80, -120]);
  const oversized2Y = useTransform(scrollYProgress, [0.3, 0.8], isMobile ? [20, -20] : [60, -60]);

  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, margin: "-60px" });

  const barChartRef = useRef<HTMLDivElement>(null);
  const barChartInView = useInView(barChartRef, { once: true, margin: "-60px" });

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="relative overflow-hidden"
    >
      {/* ═══ CH.1 — HERO METRICS ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 pt-32 md:pt-48 pb-24 md:pb-36">
        {/* Oversized background */}
        <motion.div
          style={{ y: oversizedY }}
          className="absolute top-8 md:top-16 left-0 right-0 pointer-events-none select-none z-0 overflow-hidden"
        >
          <span className="oversized-label block text-right pr-[5%]">
            IMPACT
          </span>
        </motion.div>

        {/* Header */}
        <div className="relative z-10 max-w-4xl mb-20 md:mb-28">
          <Reveal>
            <span className="type-label text-[#6b6b76] block mb-8">
              Measurable Outcomes
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="text-[clamp(2rem,4.5vw,4rem)] tracking-[-0.035em] text-[#e8e6e3] mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 0.95 }}
            >
              Design that moves
              <br />
              <span
                style={{
                  WebkitTextStroke: "1.5px rgba(232,230,227,0.2)",
                  color: "transparent",
                }}
              >
                the needle
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              className="text-[var(--type-body)] leading-[1.85] text-[#6b6b76] max-w-[var(--max-prose)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              I measure success not by pixels shipped, but by outcomes achieved.
              These numbers represent real impact across products used by millions —
              rigorously measured, honestly reported.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <span
              className="text-[clamp(0.85rem,1.2vw,1rem)] text-[#c4ff00]/30 block mt-4"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              — numbers don't lie, but they do need context
            </span>
          </Reveal>
        </div>

        {/* KPI Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.02]">
          {HERO_METRICS.map((m, i) => (
            <KPICard key={m.label} metric={m} index={i} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="editorial-rule mx-6 md:mx-12 lg:mx-16" />

      {/* ═══ CH.2 — GROWTH CHART + UX RINGS ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 py-32 md:py-48">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Growth Chart */}
          <div className="lg:col-span-7" ref={chartRef}>
            <Reveal>
              <span className="type-label text-[#6b6b76] block mb-4">
                Product Growth
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <span
                className="text-[clamp(1.2rem,2.2vw,1.8rem)] tracking-[-0.02em] text-[#e8e6e3] block mb-2"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.1 }}
              >
                Meridian — Year One Trajectory
              </span>
            </Reveal>
            <Reveal delay={0.15}>
              <span
                className="text-[0.8125rem] text-[#6b6b76] block mb-10"
                style={{ fontFamily: "var(--font-body)" }}
              >
                User growth (K) and engagement (%) post-redesign launch
              </span>
            </Reveal>

            <motion.div
              initial={{ opacity: 0 }}
              animate={chartInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative h-[280px] md:h-[340px]"
            >
              {/* Define gradients in a separate hidden SVG to avoid recharts duplicate key warnings */}
              <svg width={0} height={0} style={{ position: 'absolute' }}>
                <defs>
                  <linearGradient id="impact-gradientUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c4ff00" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#c4ff00" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="impact-gradientEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e8e6e3" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#e8e6e3" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
              </svg>
              {chartInView && (
              <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
                <AreaChart data={GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} id="impact-area-chart">
                  <CartesianGrid
                    key="grid"
                    stroke="rgba(255,255,255,0.03)"
                    strokeDasharray="2 6"
                    vertical={false}
                  />
                  <XAxis
                    key="xaxis"
                    dataKey="month"
                    stroke="rgba(255,255,255,0.08)"
                    tick={{
                      fill: "#3a3a42",
                      fontSize: 9,
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.1em",
                    }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    key="yaxis"
                    stroke="rgba(255,255,255,0.08)"
                    tick={{
                      fill: "#3a3a42",
                      fontSize: 9,
                      fontFamily: "var(--font-mono)",
                    }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip key="tooltip" content={<CustomTooltip />} />
                  <Area
                    key="area-users"
                    type="monotone"
                    dataKey="users"
                    name="Users"
                    stroke="#c4ff00"
                    strokeWidth={1.5}
                    fill="url(#impact-gradientUsers)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#c4ff00",
                      stroke: "#0a0a0b",
                      strokeWidth: 2,
                    }}
                  />
                  <Area
                    key="area-engagement"
                    type="monotone"
                    dataKey="engagement"
                    name="Engagement"
                    stroke="rgba(232,230,227,0.2)"
                    strokeWidth={1}
                    fill="url(#impact-gradientEngagement)"
                    dot={false}
                    activeDot={{
                      r: 3,
                      fill: "#e8e6e3",
                      stroke: "#0a0a0b",
                      strokeWidth: 2,
                    }}
                    strokeDasharray="4 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </motion.div>

            {/* Legend */}
            <div className="flex items-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-px bg-[#c4ff00]" />
                <span
                  className="text-[0.5rem] tracking-[0.4em] text-[#6b6b76]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  USERS (K)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-px bg-[#e8e6e3]/20" style={{ borderTop: "1px dashed rgba(232,230,227,0.2)" }} />
                <span
                  className="text-[0.5rem] tracking-[0.4em] text-[#6b6b76]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ENGAGEMENT (%)
                </span>
              </div>
            </div>
          </div>

          {/* UX Improvement Rings */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <span className="type-label text-[#6b6b76] block mb-4">
                UX Quality
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <span
                className="text-[clamp(1.2rem,2.2vw,1.8rem)] tracking-[-0.02em] text-[#e8e6e3] block mb-3"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.1 }}
              >
                Usability Benchmarks
              </span>
            </Reveal>
            <Reveal delay={0.15}>
              <span
                className="text-[0.8125rem] text-[#6b6b76] block mb-12"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Averaged across 6 major product redesigns
              </span>
            </Reveal>

            <div className="grid grid-cols-2 gap-10">
              {UX_IMPROVEMENTS.map((item, i) => (
                <RadialRing key={item.label} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="editorial-rule mx-6 md:mx-12 lg:px-16" />

      {/* ═══ CH.3 — BEFORE / AFTER ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 py-32 md:py-48">
        <motion.div
          style={{ y: oversized2Y }}
          className="absolute top-10 md:top-20 left-0 right-0 pointer-events-none select-none z-0 overflow-hidden"
        >
          <span className="oversized-label block pl-[5%]">
            Δ
          </span>
        </motion.div>

        <div className="relative z-10 max-w-3xl mb-16 md:mb-24">
          <Reveal>
            <span className="type-label text-[#6b6b76] block mb-8">
              Before → After
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="text-[clamp(1.6rem,3.5vw,3rem)] tracking-[-0.03em] text-[#e8e6e3] mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1 }}
            >
              The delta that{" "}
              <span
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                className="text-[#c4ff00]/60"
              >
                matters
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              className="text-[var(--type-body)] leading-[1.85] text-[#6b6b76] max-w-[var(--max-prose)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Every redesign starts with a baseline and ends with measurable improvement.
              These are specific metrics from specific projects — no vanity numbers, no inflated claims.
            </p>
          </Reveal>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.02]">
          {BEFORE_AFTER.map((item, i) => (
            <BeforeAfterCard key={item.metric} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="editorial-rule mx-6 md:px-12 lg:px-16" />

      {/* ═══ CH.4 — FUNNEL + EFFICIENCY ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 py-32 md:py-48">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          {/* Funnel */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="type-label text-[#6b6b76] block mb-4">
                Conversion Funnel
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <span
                className="text-[clamp(1.2rem,2.2vw,1.8rem)] tracking-[-0.02em] text-[#e8e6e3] block mb-3"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.1 }}
              >
                Meridian — Optimized Funnel
              </span>
            </Reveal>
            <Reveal delay={0.15}>
              <span
                className="text-[0.8125rem] text-[#6b6b76] block mb-12"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Full-funnel optimization through progressive onboarding and trust signals
              </span>
            </Reveal>

            <FunnelVisualization />

            <Reveal delay={0.4}>
              <blockquote className="mt-10 pl-6 border-l border-[#c4ff00]/15">
                <span
                  className="text-[clamp(0.85rem,1.2vw,1rem)] leading-[1.6] text-[#6b6b76]/60 block"
                  style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                >
                  "18% visitor-to-paid conversion is 3× the industry benchmark for SaaS. The redesign paid for itself in 6 weeks."
                </span>
              </blockquote>
            </Reveal>
          </div>

          {/* Efficiency Bar Chart */}
          <div className="lg:col-span-5" ref={barChartRef}>
            <Reveal>
              <span className="type-label text-[#6b6b76] block mb-4">
                Team Efficiency
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <span
                className="text-[clamp(1.2rem,2.2vw,1.8rem)] tracking-[-0.02em] text-[#e8e6e3] block mb-3"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.1 }}
              >
                Days per Cycle
              </span>
            </Reveal>
            <Reveal delay={0.15}>
              <span
                className="text-[0.8125rem] text-[#6b6b76] block mb-10"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Process improvements after design system adoption
              </span>
            </Reveal>

            <motion.div
              initial={{ opacity: 0 }}
              animate={barChartInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative h-[300px]"
            >
              {barChartInView && (
              <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
                <BarChart
                  data={EFFICIENCY_DATA}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                  barGap={3}
                  id="impact-bar-chart"
                >
                  <CartesianGrid
                    key="bar-grid"
                    stroke="rgba(255,255,255,0.03)"
                    strokeDasharray="2 6"
                    horizontal={false}
                  />
                  <XAxis
                    key="bar-xaxis"
                    type="number"
                    stroke="rgba(255,255,255,0.08)"
                    tick={{
                      fill: "#3a3a42",
                      fontSize: 9,
                      fontFamily: "var(--font-mono)",
                    }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 6]}
                  />
                  <YAxis
                    key="bar-yaxis"
                    type="category"
                    dataKey="name"
                    stroke="rgba(255,255,255,0.08)"
                    tick={{
                      fill: "#6b6b76",
                      fontSize: 8,
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.05em",
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={isMobile ? 72 : 100}
                  />
                  <Tooltip key="bar-tooltip" content={<CustomTooltip />} />
                  <Bar
                    key="bar-before"
                    dataKey="before"
                    name="Before"
                    fill="rgba(255,255,255,0.06)"
                    radius={[0, 2, 2, 0]}
                    barSize={8}
                  />
                  <Bar
                    key="bar-after"
                    dataKey="after"
                    name="After"
                    radius={[0, 2, 2, 0]}
                    barSize={8}
                  >
                    {EFFICIENCY_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.after > entry.before
                            ? "rgba(196,255,0,0.5)"
                            : "rgba(196,255,0,0.3)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              )}
            </motion.div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-white/[0.06] rounded-sm" />
                <span
                  className="text-[0.5rem] tracking-[0.4em] text-[#6b6b76]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  BEFORE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-[#c4ff00]/40 rounded-sm" />
                <span
                  className="text-[0.5rem] tracking-[0.4em] text-[#6b6b76]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  AFTER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="editorial-rule mx-6 md:px-12 lg:px-16" />

      {/* ═══ CH.5 — PROJECT OUTCOMES ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 py-32 md:py-48">
        <div className="relative z-10 max-w-3xl mb-16 md:mb-24">
          <Reveal>
            <span className="type-label text-[#6b6b76] block mb-8">
              Project Impact
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="text-[clamp(1.6rem,3.5vw,3rem)] tracking-[-0.03em] text-[#e8e6e3] mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1 }}
            >
              Where craft met{" "}
              <span className="text-[#c4ff00]">consequence</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              className="text-[var(--type-body)] leading-[1.85] text-[#6b6b76] max-w-[var(--max-prose)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Select projects with measurable business outcomes. Each represents months of
              deep collaboration, rigorous testing, and iterative refinement.
            </p>
          </Reveal>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.02]">
          {PROJECT_OUTCOMES.map((project, i) => (
            <ProjectOutcomeCard key={project.project} project={project} index={i} />
          ))}
        </div>
      </div>

      {/* ═══ CLOSING NOTE ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 pb-32 md:pb-48">
        <div className="editorial-rule mb-20" />
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <span
              className="text-[clamp(0.9rem,1.5vw,1.2rem)] text-[#6b6b76]/40 block mb-8"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              A note on integrity
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="text-[clamp(1rem,2vw,1.6rem)] leading-[1.5] tracking-[-0.01em] text-[#8a8a96] mb-8"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Every number on this page is{" "}
              <span className="text-[#e8e6e3]">real</span>. I don't inflate metrics,
              cherry-pick timeframes, or take sole credit for team outcomes.
              Design is a{" "}
              <span
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                className="text-[#e8e6e3]/70"
              >
                collaborative discipline
              </span>
              {" "}— these results reflect the work of exceptional cross-functional teams
              I had the privilege to lead and learn from.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-px bg-[#c4ff00]/20" />
              <span
                className="text-[0.5rem] tracking-[0.5em] text-[#3a3a42]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                P.A. — 2026
              </span>
              <div className="w-8 h-px bg-[#c4ff00]/20" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
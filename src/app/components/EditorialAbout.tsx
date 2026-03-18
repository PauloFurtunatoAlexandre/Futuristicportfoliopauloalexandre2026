import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "motion/react";
import { useIsMobile } from "./ui/useMediaQuery";

/* ─────────────────────────────────────────
   Constants & Data
   ───────────────────────────────────────── */

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const PRINCIPLES = [
  {
    id: "01",
    title: "Clarity Over Cleverness",
    body: "The smartest interface is the one nobody notices. I strip away everything that doesn't serve the person using it — then obsess over what remains.",
    accent: "less, but better",
  },
  {
    id: "02",
    title: "Emotion Is Information",
    body: "How something feels is just as real as how it functions. I design for the pause before a click, the exhale after a task, the trust that builds silently.",
    accent: "feel, then think",
  },
  {
    id: "03",
    title: "Systems, Not Screens",
    body: "Screens are symptoms. I work at the level of systems — the logic, relationships, and rhythms that make a product coherent across every touchpoint.",
    accent: "think in networks",
  },
  {
    id: "04",
    title: "Craft Is Care",
    body: "The 1px adjustment no one asked for. The easing curve that took three hours. Craft isn't perfectionism — it's the visible proof that someone gave a damn.",
    accent: "details compound",
  },
  {
    id: "05",
    title: "Tension Creates Interest",
    body: "The best work lives in the friction between opposing forces — beauty and function, complexity and clarity, boldness and restraint.",
    accent: "embrace duality",
  },
  {
    id: "06",
    title: "Ship, Then Sharpen",
    body: "Perfection is a mirage. I'd rather put imperfect work in front of real people than polish a prototype that never sees daylight.",
    accent: "iterate relentlessly",
  },
];

const TIMELINE = [
  {
    period: "2025 — Now",
    role: "Rentvine — Senior Product Designer",
    note: "Leading end-to-end product design for a B2B property management SaaS platform. Pioneered AI-assisted design workflows with Claude AI, mentored senior designers in AI-augmented ResearchOps, and built DesignOps infrastructure that increased validated solution rate by 30%.",
  },
  {
    period: "2024 — 2025",
    role: "Solstice Innovations — Senior Product Designer",
    note: "Directed the creation of a company-wide design system that streamlined redesign cycles. Mentored 3 designers, refining Figma workflows and accelerating design-to-development handoff through functional prototypes.",
  },
  {
    period: "2022 — 2023",
    role: "HealthPilot — Senior Product Designer",
    note: "Led the full UX/UI process for an AI-powered Medicare recommendation platform. Produced design specs and prototypes that supported a $10M funding round. Achieved 97% satisfaction rate and 51% usability increase.",
  },
  {
    period: "2021 — 2022",
    role: "Great American Insurance Group — Lead Product Designer",
    note: "Led a team of 5 designers delivering digital products across insured portals and risk management platforms. Revamped the corporate design system with accessibility focus, reducing UI inconsistencies by 70%.",
  },
  {
    period: "2018 — 2021",
    role: "Freelance & Advice Media — Product Designer",
    note: "Built data-driven design solutions and visual systems across healthcare, cannabis, and media industries. Implemented WCAG standards and facilitated discovery workshops translating complex business goals into effective UX strategies.",
  },
];

const STRENGTHS = [
  { label: "Product Strategy", level: 95 },
  { label: "Design Systems", level: 97 },
  { label: "UX Research", level: 92 },
  { label: "Prototyping & Interaction", level: 94 },
  { label: "AI-Augmented Design", level: 88 },
  { label: "Frontend Development", level: 80 },
];

/* ─────────────────────────────────────────
   Reveal Wrapper — consistent entrance
   ───────────────────────────────────────── */

function Reveal({
  children,
  delay = 0,
  y = 40,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Scroll-Driven Manifesto Text
   Words illuminate as the reader scrolls
   ───────────────────────────────────────── */

function ScrollWord({
  word,
  index,
  total,
  scrollYProgress,
  isAccent,
}: {
  word: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  isAccent: boolean;
}) {
  const progress = useTransform(
    scrollYProgress,
    [index / total, (index + 1) / total],
    [0, 1]
  );
  const wordOpacity = useTransform(progress, [0, 1], [0.08, 1]);

  return (
    <motion.span
      className="inline-block mr-[0.3em] will-change-[opacity]"
      style={{
        opacity: wordOpacity,
        color: isAccent ? "#c4ff00" : "#e8e6e3",
      }}
    >
      {word}
    </motion.span>
  );
}

function ScrollManifesto({
  text,
  accentPhrases = [],
}: {
  text: string;
  accentPhrases?: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.25"],
  });

  const words = text.split(" ");

  // Build a set of word-index ranges that should be accented
  const accentIndices = new Set<number>();
  accentPhrases.forEach((phrase) => {
    const start = text.indexOf(phrase);
    if (start >= 0) {
      const wordStart = text.slice(0, start).split(" ").filter(Boolean).length;
      const phraseLen = phrase.split(" ").length;
      for (let i = wordStart; i < wordStart + phraseLen; i++) accentIndices.add(i);
    }
  });

  return (
    <div ref={containerRef} className="relative">
      <p
        className="text-[clamp(1.6rem,4.2vw,3.8rem)] leading-[1.18] tracking-[-0.018em]"
        style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
      >
        {words.map((word, i) => (
          <ScrollWord
            key={i}
            word={word}
            index={i}
            total={words.length}
            scrollYProgress={scrollYProgress}
            isAccent={accentIndices.has(i)}
          />
        ))}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Animated Stat Bar
   ───────────────────────────────────────── */

function StrengthBar({
  label,
  level,
  index,
}: {
  label: string;
  level: number;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      className="group"
    >
      <div className="flex items-baseline justify-between mb-3">
        <span
          className="text-[0.6875rem] tracking-[0.35em] uppercase text-[#8a8a96] group-hover:text-[#e8e6e3] transition-colors duration-500"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {label}
        </span>
        <span
          className="text-[0.5625rem] tracking-[0.3em] text-[#6b6b76] tabular-nums"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {level}
        </span>
      </div>
      <div className="relative h-px bg-white/[0.06] overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#c4ff00]/80 to-[#c4ff00]/20"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.3 + index * 0.08, ease: EASE }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Principle Card — hover-interactive
   ───────────────────────────────────────── */

function PrincipleCard({
  principle,
  index,
}: {
  principle: (typeof PRINCIPLES)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group border border-white/[0.04] hover:border-[#c4ff00]/[0.12] p-8 md:p-10 transition-colors duration-700 overflow-hidden"
    >
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: hovered
            ? "radial-gradient(ellipse at 50% 0%, rgba(196,255,0,0.04) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(196,255,0,0) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Number */}
      <span
        className="text-[0.5625rem] tracking-[0.5em] text-[#3a3a42] block mb-6"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {principle.id}
      </span>

      {/* Title */}
      <h3
        className="text-[clamp(1.1rem,1.8vw,1.4rem)] tracking-[-0.02em] text-[#e8e6e3] mb-4 relative z-10"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.2 }}
      >
        {principle.title}
      </h3>

      {/* Serif accent */}
      <motion.span
        className="text-[clamp(0.85rem,1.2vw,1rem)] text-[#c4ff00]/40 block mb-5 relative z-10"
        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        animate={{ opacity: hovered ? 0.8 : 0.4, x: hovered ? 4 : 0 }}
        transition={{ duration: 0.4 }}
      >
        — {principle.accent}
      </motion.span>

      {/* Body */}
      <p
        className="text-[0.875rem] leading-[1.8] text-[#6b6b76] group-hover:text-[#8a8a96] transition-colors duration-700 relative z-10"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {principle.body}
      </p>

      {/* Corner accent on hover */}
      <motion.div
        className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#c4ff00]/30"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Timeline Entry
   ───────────────────────────────────────── */

function TimelineEntry({
  entry,
  index,
}: {
  entry: (typeof TIMELINE)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
      className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-10 border-b border-white/[0.04] hover:border-[#c4ff00]/[0.08] transition-colors duration-700"
    >
      {/* Period */}
      <div className="md:col-span-3">
        <span
          className="text-[0.625rem] tracking-[0.4em] text-[#6b6b76] group-hover:text-[#c4ff00]/60 transition-colors duration-500"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {entry.period}
        </span>
      </div>

      {/* Role */}
      <div className="md:col-span-4">
        <span
          className="text-[clamp(0.95rem,1.4vw,1.15rem)] tracking-[-0.01em] text-[#e8e6e3] block"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, lineHeight: 1.3 }}
        >
          {entry.role}
        </span>
      </div>

      {/* Note */}
      <div className="md:col-span-5">
        <p
          className="text-[0.8125rem] leading-[1.75] text-[#6b6b76] group-hover:text-[#8a8a96] transition-colors duration-500"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {entry.note}
        </p>
      </div>

      {/* Animated dot */}
      <motion.div
        className="hidden md:block absolute -left-[3px] w-1.5 h-1.5 rounded-full bg-[#3a3a42] group-hover:bg-[#c4ff00] transition-colors duration-500"
        style={{ top: "50%" }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Portrait Block — cinematic with parallax
   ───────────────────────────────────────── */

function PortraitBlock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], isMobile ? [30, -30] : [80, -80]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], isMobile ? [1.05, 1, 1.03] : [1.15, 1, 1.08]);
  const curtainHeight = useTransform(scrollYProgress, [0.05, 0.35], ["100%", "0%"]);
  const captionY = useTransform(scrollYProgress, [0.2, 0.45], [30, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const bgImgY = useTransform(scrollYProgress, [0, 1], isMobile ? [15, -15] : [40, -40]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-3, 3]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);

  const handleMouse = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };

  return (
    <div ref={containerRef} onMouseMove={handleMouse} className="relative">
      {/* Background texture image — blurred, offset */}
      <motion.div
        style={{ y: bgImgY }}
        className="absolute -top-16 -right-8 md:-right-20 w-[70%] h-[110%] opacity-[0.06] pointer-events-none z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1649182784901-48f5f2d40ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFyY2hpdGVjdHVyZSUyMGRhcmslMjBnZW9tZXRyaWMlMjBtaW5pbWFsfGVufDF8fHx8MTc3MzQxNzk5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "blur(2px) grayscale(100%)" }}
        />
      </motion.div>

      {/* Main portrait */}
      <motion.div
        style={{ y: imgY, rotateY, rotateX, perspective: 1200 }}
        className="relative z-10 overflow-hidden aspect-[3/4] max-w-[480px]"
      >
        <motion.div className="w-full h-full" style={{ scale: imgScale }}>
          <img
            src="https://images.unsplash.com/photo-1627890458144-4c0c481bf4b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBwb3J0cmFpdCUyMGNyZWF0aXZlJTIwZGlyZWN0b3IlMjBkYXJrJTIwc3R1ZGlvJTIwbW9vZHl8ZW58MXx8fHwxNzczNDE3OTkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Paulo Alexandre — portrait"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.7) contrast(1.1)" }}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-[#0a0a0b]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 border border-white/[0.04]" />

        {/* Curtain reveal */}
        <motion.div
          className="absolute inset-0 bg-[#0a0a0b] origin-top z-10"
          style={{ height: curtainHeight }}
        />

        {/* Name overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
          <Reveal delay={0.5}>
            <span
              className="text-[clamp(1.6rem,3vw,2.4rem)] tracking-[-0.03em] text-[#e8e6e3] block"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1 }}
            >
              PAULO
            </span>
            <span
              className="text-[clamp(1.6rem,3vw,2.4rem)] tracking-[-0.03em] block"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                lineHeight: 1,
                WebkitTextStroke: "1px rgba(232,230,227,0.25)",
                color: "transparent",
              }}
            >
              ALEXANDRE
            </span>
          </Reveal>
        </div>
      </motion.div>

      {/* Floating caption card */}
      <motion.div
        style={{ y: captionY, opacity: captionOpacity }}
        className="absolute -bottom-8 right-0 md:-right-16 bg-[#0a0a0b]/90 backdrop-blur-sm border border-white/[0.06] px-7 py-5 z-20 max-w-[220px]"
      >
        <span className="type-label text-[#c4ff00] block mb-2">
          Based in St. Pete, FL / Remote
        </span>
        <span
          className="text-[0.75rem] text-[#6b6b76] leading-[1.6]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Available for select projects & creative partnerships
        </span>
      </motion.div>

      {/* Vertical text */}
      <motion.div
        className="absolute -left-6 top-1/4 hidden lg:block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.35 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 1.2 }}
      >
        <span
          className="type-label-sm text-[#6b6b76] block"
          style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
        >
          Senior Product Designer — Full Stack Builder
        </span>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Animated Counter
   ───────────────────────────────────────── */

function AnimatedStat({
  num,
  label,
  index,
}: {
  num: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      className="relative"
    >
      <motion.span
        className="text-[clamp(2.2rem,4.5vw,4rem)] tracking-[-0.04em] text-[#e8e6e3] block"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: EASE }}
      >
        {num}
      </motion.span>
      <motion.p
        className="type-label text-[#6b6b76] mt-3"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
}

/* ═════════════════════════════════════════
   MAIN COMPONENT — EditorialAbout
   ═════════════════════════════════════════ */

export function EditorialAbout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const oversizedY = useTransform(scrollYProgress, [0, 1], isMobile ? [30, -40] : [80, -120]);
  const oversized2Y = useTransform(scrollYProgress, [0.3, 0.8], isMobile ? [20, -20] : [60, -60]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden"
    >
      {/* ═══ CH.1 — MANIFESTO ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 pt-20 md:pt-32 pb-16 md:pb-28">
        {/* Oversized background label */}
        <motion.div
          style={{ y: oversizedY }}
          className="absolute top-8 md:top-16 left-0 right-0 pointer-events-none select-none z-0 overflow-hidden"
        >
          <span className="oversized-label block text-right pr-[5%]">
            ABOUT
          </span>
        </motion.div>

        <div className="relative z-10 max-w-6xl">
          {/* Serif prelude */}
          <Reveal>
            <span
              className="text-[clamp(0.95rem,1.6vw,1.3rem)] text-[#6b6b76]/50 block mb-10"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              A manifesto, of sorts
            </span>
          </Reveal>

          <ScrollManifesto
            text="I started in graphic design and never stopped evolving. Over 12 years, I've moved from pixels to products, from visual systems to full-stack builds, from following briefs to shaping strategy. I design for the moments that matter — when a confused Medicare enrollee finally understands their options, when an insurance team ships twice as fast because the system just works, when a cannabis shopper finds exactly the feeling they were looking for. The work I care about lives where empathy meets engineering."
            accentPhrases={[
              "moments that matter",
              "empathy meets engineering",
            ]}
          />

          {/* Attribution line */}
          <Reveal delay={0.4}>
            <div className="mt-12 flex items-center gap-4">
              <div className="w-12 h-px bg-[#c4ff00]/30" />
              <span
                className="text-[0.5625rem] tracking-[0.5em] text-[#6b6b76]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                PAULO ALEXANDRE — 2026
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Divider */}
      <div className="editorial-rule mx-6 md:mx-12 lg:mx-16" />

      {/* ═══ CH.2 — PORTRAIT + BIO ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 py-20 md:py-32">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          {/* Portrait column */}
          <div className="md:col-span-5 md:col-start-1 relative">
            <PortraitBlock />
          </div>

          {/* Content column — offset for asymmetry */}
          <div className="md:col-span-5 md:col-start-8 pt-0 md:pt-32">
            {/* Section label */}
            <Reveal>
              <span className="type-label text-[#6b6b76] block mb-10">
                Who I Am
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <p
                className="text-[var(--type-body-lg)] leading-[1.85] text-[#8a8a96] mb-8"
                style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
              >
                I'm a senior product designer with 12+ years of experience across insurance,
                healthcare, SaaS, and emerging industries. I've led design teams, built
                company-wide design systems from scratch, and shipped products that helped
                secure $10M in funding. I also write code — React, JavaScript, Node — because
                understanding what engineers build makes me a better designer.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                className="text-[var(--type-body)] leading-[1.85] text-[#6b6b76] mb-8"
                style={{ fontFamily: "var(--font-body)" }}
              >
                My career is a story of compounding breadth. I started in graphic design
                and digital illustration in Brazil, studied business and marketing, then
                went full-stack through a Bloomtech bootcamp. That path wasn't accidental —
                I kept hitting walls where understanding the adjacent discipline was the only
                way to break through. Today I design at the systems level: DesignOps
                infrastructure, AI-augmented research workflows, and scalable product
                experiences that survive contact with real users and real organizations.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p
                className="text-[var(--type-body)] leading-[1.85] text-[#6b6b76] mb-10"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Right now I'm at Rentvine, pioneering AI-assisted design workflows with Claude
                and building DesignOps infrastructure for a B2B property management platform.
                Before that, I helped HealthPilot translate complex AI into interfaces that
                seniors could actually use, and led a 5-designer team at Great American Insurance
                Group redesigning their entire corporate design system. I hold an MBA in UX
                Research and Leadership and never stop learning.
              </p>
            </Reveal>

            {/* Pull quote */}
            <Reveal delay={0.4}>
              <blockquote className="relative pl-8 py-6 my-8 border-l border-[#c4ff00]/20">
                <span
                  className="text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.55] text-[#e8e6e3]/50 block"
                  style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                >
                  "I keep hitting walls where understanding the adjacent discipline is the only way to break through. So I keep learning."
                </span>
              </blockquote>
            </Reveal>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-10 pt-10 border-t border-white/[0.04] mt-6">
              <AnimatedStat num="12+" label="Years in Design" index={0} />
              <AnimatedStat num="$10M" label="Funding Supported" index={1} />
              <AnimatedStat num="97%" label="Highest Satisfaction" index={2} />
              <AnimatedStat num="70%" label="UI Inconsistencies Cut" index={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="editorial-rule mx-6 md:mx-12 lg:mx-16" />

      {/* ═══ CH.3 — DESIGN PRINCIPLES ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 py-20 md:py-32">
        {/* Oversized background label */}
        <motion.div
          style={{ y: oversized2Y }}
          className="absolute top-10 md:top-20 left-0 right-0 pointer-events-none select-none z-0 overflow-hidden"
        >
          <span className="oversized-label block pl-[5%]">
            ETHOS
          </span>
        </motion.div>

        <div className="relative z-10">
          {/* Header */}
          <div className="max-w-3xl mb-20 md:mb-28">
            <Reveal>
              <span className="type-label text-[#6b6b76] block mb-8">
                Design Principles
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                className="text-[clamp(2rem,4.5vw,4rem)] tracking-[-0.035em] text-[#e8e6e3] mb-6"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 0.95 }}
              >
                Six ideas I return
                <br />
                <span
                  className="inline-block"
                  style={{
                    WebkitTextStroke: "1.5px rgba(232,230,227,0.2)",
                    color: "transparent",
                  }}
                >
                  to again
                </span>{" "}
                &{" "}
                <span
                  style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                  className="text-[#c4ff00]/60"
                >
                  again
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p
                className="text-[var(--type-body)] leading-[1.85] text-[#6b6b76] max-w-[var(--max-prose)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Not rules — tendencies. These are the beliefs that shape how I approach
                every project, from the first whiteboard sketch to the final easing curve.
              </p>
            </Reveal>
          </div>

          {/* Principles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.02]">
            {PRINCIPLES.map((p, i) => (
              <PrincipleCard key={p.id} principle={p} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="editorial-rule mx-6 md:mx-12 lg:mx-16" />

      {/* ═══ CH.4 — EXPERIENCE TIMELINE + STRENGTHS ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 py-20 md:py-32">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Timeline column */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="type-label text-[#6b6b76] block mb-10">
                Experience
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <h2
                className="text-[clamp(1.6rem,3vw,2.8rem)] tracking-[-0.03em] text-[#e8e6e3] mb-14"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1 }}
              >
                Where I've been
              </h2>
            </Reveal>

            <div className="relative">
              {/* Vertical line */}
              <div className="hidden md:block absolute top-0 bottom-0 left-0 w-px bg-white/[0.04]" />

              <div className="md:pl-8">
                {TIMELINE.map((entry, i) => (
                  <TimelineEntry key={entry.period} entry={entry} index={i} />
                ))}
              </div>
            </div>

            {/* Education note */}
            <Reveal delay={0.3}>
              <div className="mt-12 md:pl-8 flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3a3a42] mt-2 shrink-0" />
                <div>
                  <span
                    className="text-[0.625rem] tracking-[0.4em] text-[#3a3a42] block mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    EDUCATION
                  </span>
                  <span
                    className="text-[0.875rem] text-[#6b6b76]"
                    style={{ fontFamily: "var(--font-body)", lineHeight: 1.6 }}
                  >
                    MBA, UX Research & Leadership — UNIFATEC / Toronto Business School · Full Stack Web Dev — Bloomtech · Business — Columbia College
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Strengths column */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <span className="type-label text-[#6b6b76] block mb-10">
                Strengths
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <span
                className="text-[clamp(0.9rem,1.3vw,1.1rem)] text-[#6b6b76]/40 block mb-12"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                where I go deepest
              </span>
            </Reveal>

            <div className="space-y-7">
              {STRENGTHS.map((s, i) => (
                <StrengthBar key={s.label} {...s} index={i} />
              ))}
            </div>

            {/* Workspace image */}
            <Reveal delay={0.5}>
              <div className="mt-16 relative overflow-hidden aspect-[16/10]">
                <img
                  src="https://images.unsplash.com/photo-1751200065687-a126e7c304da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwd29ya3NwYWNlJTIwZGVzaWduZXIlMjBkZXNrJTIwb3ZlcmhlYWQlMjBtb29keXxlbnwxfHx8fDE3NzM0MTc5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Workspace"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.5) contrast(1.1) grayscale(0.3)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent" />
                <div className="absolute inset-0 border border-white/[0.04]" />
                <div className="absolute bottom-4 left-4">
                  <span
                    className="text-[0.5rem] tracking-[0.5em] uppercase text-[#6b6b76]/50"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    The workshop
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ═══ CLOSING — personal note ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 pb-20 md:pb-32">
        <div className="editorial-rule mb-20" />
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <span
              className="text-[clamp(1rem,1.8vw,1.4rem)] text-[#6b6b76]/40 block mb-8"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              One more thing
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="text-[clamp(1.2rem,2.8vw,2.2rem)] leading-[1.35] tracking-[-0.015em] text-[#8a8a96] mb-10"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              I'm not looking to work with{" "}
              <span className="text-[#e8e6e3]">everyone</span>. I'm looking
              to work with the{" "}
              <span className="text-[#c4ff00]">right people</span> — teams that
              believe design isn't decoration, but the{" "}
              <span
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                className="text-[#e8e6e3]/70"
              >
                core of what they're building
              </span>
              .
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-4 px-10 py-4 border border-white/[0.08] hover:border-[#c4ff00]/30 transition-colors duration-500 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="type-label text-[#e8e6e3] group-hover:text-[#c4ff00] transition-colors duration-500">
                Let's Talk
              </span>
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#c4ff00]/60"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
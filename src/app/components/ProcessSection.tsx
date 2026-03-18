import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "motion/react";
import { useIsMobile } from "./ui/useMediaQuery";

/* ─────────────────────────────────────────
   Constants
   ───────────────────────────────────────── */

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/* ─────────────────────────────────────────
   Process Stage Data — 6 acts
   Based on Paulo's real methodology across
   HealthPilot, GAIG, Solstice, Rentvine
   ───────────────────────────────────────── */

const STAGES = [
  {
    num: "01",
    title: "LISTEN",
    subtitle: "Before designing, I disappear into the problem",
    serifAccent: "empathy is the first skill, not the soft one",
    story:
      "At HealthPilot, I didn't start with wireframes — I started with 15 user interviews and a 349-person survey. At GAIG, I sat through 12 insured interviews watching people fail silently at enrollment. At Solstice, I audited 5 modules and documented 120+ inconsistencies before touching Figma. The pattern is always the same: resist the urge to solve until you've earned the right to understand.",
    activities: [
      "User interviews & contextual inquiry",
      "Heuristic evaluation & competitive audit",
      "Quantitative data analysis",
      "Stakeholder alignment sessions",
      "Journey mapping & service blueprints",
    ],
    artifact: "Research synthesis & opportunity map",
  },
  {
    num: "02",
    title: "FRAME",
    subtitle: "Turn chaos into a clear problem statement",
    serifAccent: "a well-framed problem is half-solved",
    story:
      "The hardest part of design isn't generating solutions — it's choosing which problem to solve. At Rise Cannabis, analytics showed drop-offs at product pages, but framing revealed the real issue: the entire information architecture was misaligned with how customers make emotional decisions. At GAIG, 33 business lines each thought their UI was 'special enough' to warrant custom treatment. The frame that unlocked progress: consistency isn't constraint — it's freedom.",
    activities: [
      "Problem prioritization (Impact/Effort)",
      "Design Studio workshops",
      "Persona & scenario development",
      "Risk & assumptions matrix",
      "Stakeholder storytelling",
    ],
    artifact: "Problem brief & strategy pillars",
  },
  {
    num: "03",
    title: "EXPLORE",
    subtitle: "Generate divergently, then converge with conviction",
    serifAccent: "the first idea is never the best one",
    story:
      "I believe in structured divergence — not brainstorming chaos, but disciplined exploration. At HealthPilot, I facilitated Design Studio workshops that generated 15+ ideas, then used dot-voting with PMs and engineers to converge on the three highest-impact interventions. At Solstice, I prototyped four navigation patterns in parallel before testing showed the unified sidebar won decisively. The goal isn't more ideas — it's better-tested convictions.",
    activities: [
      "Rapid sketching & concept generation",
      "Low-fidelity wireframing",
      "Parallel prototyping",
      "Design critique sessions",
      "Early concept testing",
    ],
    artifact: "Validated wireframes & interaction specs",
  },
  {
    num: "04",
    title: "CRAFT",
    subtitle: "Where pixel-level precision meets system-level thinking",
    serifAccent: "the details are not the details — they make the design",
    story:
      "This is where my graphic design roots and full-stack experience compound. At GAIG, I didn't just design components — I built a token-first system encoding every visual decision into governed primitives across 33 business lines. At Solstice, I established a Storybook instance as the engineering source of truth alongside the Figma library. Every interaction state, every feedback pattern, every accessibility requirement gets the same obsessive attention as the hero screen.",
    activities: [
      "High-fidelity UI design",
      "Design system architecture",
      "Interaction & motion design",
      "Accessibility compliance (WCAG)",
      "Design-to-dev specification",
    ],
    artifact: "Production-ready design system & specs",
  },
  {
    num: "05",
    title: "VALIDATE",
    subtitle: "Test with real humans, not assumptions",
    serifAccent: "opinions are free — data costs effort",
    story:
      "At HealthPilot, remote moderated testing with 10 participants showed a 90% success rate — and revealed edge cases no stakeholder had predicted. At Rise, usability tests showed 60% of users could find products matching their desired effects, transforming confused browsing into confident buying. At Rentvine, I pioneered AI-assisted research workflows with Claude that let us run continuous validation without waiting for formal test cycles. Testing isn't a phase — it's a habit.",
    activities: [
      "Moderated usability testing",
      "Unmoderated remote studies",
      "A/B testing & analytics",
      "AI-augmented research synthesis",
      "Stakeholder review & sign-off",
    ],
    artifact: "Test results & iteration backlog",
  },
  {
    num: "06",
    title: "MULTIPLY",
    subtitle: "Scale the work by scaling the people",
    serifAccent: "the best system outlives its creator",
    story:
      "Design that depends on one person doesn't scale. At Solstice, I mentored 3 junior designers through individualized growth tracks — all were promoted within 12 months. At GAIG, I trained 4 designers on UX methodologies and Figma best practices, then co-created a governance framework that made consistency self-sustaining. At Rentvine, I'm building DesignOps infrastructure that increases validated solution rate by 30%. My job isn't to be the best designer in the room — it's to make the room better.",
    activities: [
      "Mentorship & design coaching",
      "DesignOps infrastructure",
      "Governance & documentation",
      "Knowledge transfer & workshops",
      "Continuous improvement rituals",
    ],
    artifact: "Self-sustaining design culture",
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
   Stage Card
   ───────────────────────────────────────── */

function StageCard({
  stage,
  index,
}: {
  stage: (typeof STAGES)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [expanded, setExpanded] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
      className="relative"
    >
      {/* Connector line from timeline */}
      <div className="hidden lg:block absolute top-14 left-0 w-full pointer-events-none">
        <motion.div
          className="h-px bg-gradient-to-r from-[#c4ff00]/20 via-[#c4ff00]/[0.06] to-transparent"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          style={{ originX: 0 }}
        />
      </div>

      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 ${
          isEven ? "" : "lg:direction-rtl"
        }`}
      >
        {/* Left column — number & title */}
        <div className={`lg:col-span-4 ${isEven ? "" : "lg:col-start-9"}`}>
          {/* Number */}
          <motion.span
            className="text-[clamp(4rem,8vw,7rem)] tracking-[-0.06em] block leading-[0.8]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              WebkitTextStroke: "1.5px rgba(196,255,0,0.15)",
              color: "transparent",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            {stage.num}
          </motion.span>

          {/* Title */}
          <motion.h3
            className="text-[clamp(1.6rem,3vw,2.4rem)] tracking-[-0.035em] text-[#e8e6e3] mt-4 mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              lineHeight: 1,
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          >
            {stage.title}
          </motion.h3>

          {/* Subtitle */}
          <motion.p
            className="text-[0.875rem] text-[#6b6b76] leading-[1.6] mb-4"
            style={{ fontFamily: "var(--font-body)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          >
            {stage.subtitle}
          </motion.p>

          {/* Serif accent */}
          <motion.span
            className="text-[clamp(0.85rem,1.2vw,1rem)] text-[#c4ff00]/30 block"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          >
            — {stage.serifAccent}
          </motion.span>
        </div>

        {/* Right column — story & details */}
        <div className={`lg:col-span-7 ${isEven ? "lg:col-start-6" : "lg:col-start-1"}`}>
          {/* Story paragraph */}
          <motion.p
            className="text-[clamp(0.9rem,1.1vw,1rem)] leading-[1.85] text-[#8a8a96] mb-8"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          >
            {stage.story}
          </motion.p>

          {/* Expandable details */}
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-3 group mb-6"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span
              className="text-[0.5625rem] tracking-[0.4em] text-[#6b6b76] group-hover:text-[#c4ff00] transition-colors duration-300"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {expanded ? "COLLAPSE" : "ACTIVITIES & ARTIFACTS"}
            </span>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-[#6b6b76] group-hover:text-[#c4ff00] transition-colors duration-300"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.button>

          <motion.div
            initial={false}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-4">
              {/* Activities */}
              <div>
                <span
                  className="text-[0.5rem] tracking-[0.5em] text-[#3a3a42] block mb-4"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ACTIVITIES
                </span>
                <ul className="space-y-2">
                  {stage.activities.map((a, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[0.8125rem] text-[#6b6b76] leading-[1.5]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <span className="w-1 h-1 rounded-full bg-[#c4ff00]/30 mt-2 shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Artifact */}
              <div>
                <span
                  className="text-[0.5rem] tracking-[0.5em] text-[#3a3a42] block mb-4"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  KEY ARTIFACT
                </span>
                <div className="border border-white/[0.04] px-5 py-4">
                  <span
                    className="text-[0.8125rem] text-[#e8e6e3]/70"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {stage.artifact}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom rule */}
          <div className="h-px bg-white/[0.04] mt-6" />
        </div>
      </div>
    </motion.div>
  );
}

/* ═════════════════════════════════════════
   MAIN — ProcessSection
   ═════════════════════════════════════════ */

export function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const oversizedY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [20, -30] : [60, -80]
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* ═══ HEADER ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 pt-12 md:pt-20 pb-12 md:pb-20">
        {/* Oversized background */}
        <motion.div
          style={{ y: oversizedY }}
          className="absolute top-8 md:top-16 left-0 right-0 pointer-events-none select-none z-0 overflow-hidden"
        >
          <span className="oversized-label block text-right pr-[5%]">
            HOW
          </span>
        </motion.div>

        <div className="relative z-10 max-w-4xl">
          <Reveal>
            <span className="type-label text-[#6b6b76] block mb-8">
              How I Work
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="text-[clamp(2rem,4.5vw,3.5rem)] tracking-[-0.035em] text-[#e8e6e3] mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                lineHeight: 0.95,
              }}
            >
              Six acts of{" "}
              <span
                style={{
                  WebkitTextStroke: "1.5px rgba(232,230,227,0.2)",
                  color: "transparent",
                }}
              >
                disciplined
              </span>
              <br />
              <span
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                className="text-[#c4ff00]/60"
              >
                creative rigor
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              className="text-[var(--type-body)] leading-[1.85] text-[#6b6b76] max-w-[var(--max-prose)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              My process isn't linear — it's a rhythm. Each project finds its own
              cadence, but the underlying discipline stays constant. Research
              before intuition. Testing before launch. People before pixels. These
              are the six acts that recur across every project I've led, from
              Medicare platforms to enterprise design systems.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ═══ STAGES ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 pb-16 md:pb-24 space-y-20 md:space-y-28">
        {/* Vertical timeline line */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-[calc(33.333%+2rem)] w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent pointer-events-none" />

        {STAGES.map((stage, i) => (
          <StageCard key={stage.num} stage={stage} index={i} />
        ))}
      </div>

      {/* ═══ CLOSING NOTE ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 pb-12 md:pb-20">
        <div className="editorial-rule mb-12" />
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <span
              className="text-[clamp(0.9rem,1.5vw,1.2rem)] text-[#6b6b76]/40 block mb-8"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              A note on process
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="text-[clamp(1rem,2vw,1.6rem)] leading-[1.5] tracking-[-0.01em] text-[#8a8a96] mb-8"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Process isn't a cage — it's a{" "}
              <span className="text-[#e8e6e3]">compass</span>. The best work
              happens when you have enough structure to stay focused and enough
              flexibility to follow{" "}
              <span
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                className="text-[#c4ff00]/50"
              >
                what the research is actually telling you
              </span>
              . Every project I've led has deviated from the plan — and been
              better for it.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-px bg-[#c4ff00]/20" />
              <span
                className="text-[0.5rem] tracking-[0.5em] text-[#3a3a42]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                LISTEN · FRAME · EXPLORE · CRAFT · VALIDATE · MULTIPLY
              </span>
              <div className="w-8 h-px bg-[#c4ff00]/20" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
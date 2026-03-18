import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
  AnimatePresence,
} from "motion/react";
import { useIsMobile } from "./ui/useMediaQuery";

/* ─────────────────────────────────────────
   Constants
   ───────────────────────────────────────── */

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/* ─────────────────────────────────────────
   Process Stage Data — 7 acts
   ───────────────────────────────────────── */

const STAGES = [
  {
    num: "01",
    title: "DISCOVER",
    subtitle: "Understanding the terrain",
    serifAccent: "listen before you leap",
    philosophy:
      "Before designing anything, I immerse myself in the problem space until I can articulate the pain better than the people experiencing it. This isn't about gathering requirements — it's about building conviction.",
    activities: [
      "Stakeholder depth-interviews",
      "Competitive & analogous audits",
      "Quantitative data analysis",
      "User shadowing & contextual inquiry",
      "Jobs-to-be-done mapping",
    ],
    deliverables: ["Research synthesis deck", "Opportunity landscape map", "User persona archetypes"],
    duration: "2–4 weeks",
    collaborators: "Product, Engineering, Research",
    insight:
      "The best insights come from the things people don't say. I pay attention to workarounds, frustrations masked as habits, and the questions nobody thought to ask.",
    icon: "discover",
  },
  {
    num: "02",
    title: "DEFINE",
    subtitle: "Framing the right problem",
    serifAccent: "precision before ambition",
    philosophy:
      "A beautiful solution to the wrong problem is still a failure. This phase is about ruthless focus — narrowing from infinite possibility to the one constraint that, if solved, unlocks everything else.",
    activities: [
      "Problem statement synthesis",
      "Opportunity prioritization (RICE/ICE)",
      "Experience principles definition",
      "Success metrics alignment",
      "Scope negotiation with stakeholders",
    ],
    deliverables: ["Strategic brief", "Design principles", "Measurable success criteria"],
    duration: "1–2 weeks",
    collaborators: "Product, Leadership, Data",
    insight:
      "I've learned that the define phase is where projects are won or lost. Skip it, and you'll design three things instead of the right one.",
    icon: "define",
  },
  {
    num: "03",
    title: "EXPLORE",
    subtitle: "Divergent thinking at scale",
    serifAccent: "dare to be wrong",
    philosophy:
      "This is where I push past the first good idea — and the second, and the tenth. The breakthrough usually hides behind the concepts you almost discarded. Exploration demands courage and volume.",
    activities: [
      "Rapid concept sketching (Crazy 8s)",
      "Cross-functional ideation workshops",
      "Analogous inspiration mapping",
      "Low-fidelity wireframe sprints",
      "Concept narrative storyboarding",
    ],
    deliverables: ["Concept directions (3–5)", "Annotated wireframes", "Experience storyboards"],
    duration: "2–3 weeks",
    collaborators: "Design, Product, Engineering, Content",
    insight:
      "I intentionally explore at least one direction I think won't work. It almost always teaches me something the 'safe' concepts don't.",
    icon: "explore",
  },
  {
    num: "04",
    title: "PROTOTYPE",
    subtitle: "Making ideas tangible",
    serifAccent: "think with your hands",
    philosophy:
      "Prototypes aren't deliverables — they're thinking tools. I build to learn, not to impress. Fidelity follows intent: sometimes a paper sketch reveals more than a polished Figma comp.",
    activities: [
      "Interactive prototype construction",
      "Micro-interaction choreography",
      "Design system component authoring",
      "Motion design & easing specification",
      "Responsive behavior definition",
    ],
    deliverables: ["Interactive prototypes (Figma/code)", "Interaction specification", "Component library updates"],
    duration: "2–4 weeks",
    collaborators: "Design, Engineering (early pairing)",
    insight:
      "I prototype in code when the interaction can't be faked. The gap between a Figma click-through and a real gesture is where magic lives — or dies.",
    icon: "prototype",
  },
  {
    num: "05",
    title: "VALIDATE",
    subtitle: "Testing assumptions with reality",
    serifAccent: "let the work be questioned",
    philosophy:
      "Validation isn't a gate — it's a conversation. I test early and often, using methods matched to the question: usability tests for flow, A/B tests for conversion, diary studies for long-term adoption.",
    activities: [
      "Moderated usability testing (5–8 users)",
      "Unmoderated remote testing at scale",
      "Heuristic evaluation with peers",
      "Accessibility audit (WCAG 2.1 AA)",
      "Stakeholder design review",
    ],
    deliverables: ["Test findings & recommendations", "Iteration backlog", "Confidence score matrix"],
    duration: "1–2 weeks per round",
    collaborators: "Research, Product, Accessibility",
    insight:
      "I've watched users break my most 'intuitive' designs in seconds. That humility is the most valuable design skill I've developed.",
    icon: "validate",
  },
  {
    num: "06",
    title: "SHIP",
    subtitle: "From design to production",
    serifAccent: "craft survives the handoff",
    philosophy:
      "Shipping isn't the finish line — it's the first real test. I stay embedded with engineering through implementation, because the 100 micro-decisions made during development define the actual user experience.",
    activities: [
      "Detailed engineering handoff (spec + tokens)",
      "Implementation QA & visual regression",
      "Edge case & error state design",
      "Launch sequence planning",
      "Stakeholder alignment & go/no-go",
    ],
    deliverables: ["Production-ready specs", "QA checklist", "Launch playbook"],
    duration: "2–6 weeks (with eng)",
    collaborators: "Engineering, QA, Product, Marketing",
    insight:
      "I review every pull request that touches UI. Not to gatekeep — to partner. The best engineering relationships are built on mutual craft obsession.",
    icon: "ship",
  },
  {
    num: "07",
    title: "LEARN",
    subtitle: "Closing the loop",
    serifAccent: "the work is never done",
    philosophy:
      "Launch is a hypothesis, not a conclusion. I set up measurement frameworks before shipping and revisit them relentlessly — because the only way to get better is to honestly evaluate what you've built.",
    activities: [
      "Post-launch metric analysis",
      "Qualitative feedback synthesis",
      "Design retrospective with team",
      "Pattern documentation for future work",
      "Backlog grooming for v2 iteration",
    ],
    deliverables: ["Impact report", "Lessons-learned document", "V2 opportunity brief"],
    duration: "Ongoing",
    collaborators: "Data, Product, Full team",
    insight:
      "Every product I've shipped has taught me something the research couldn't. The learn phase is where junior designers become senior ones.",
    icon: "learn",
  },
];

/* ─────────────────────────────────────────
   SVG Icons — bespoke, minimal line art
   ───────────────────────────────────────── */

function StageIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? "#c4ff00" : "#3a3a42";
  const size = 48;

  const paths: Record<string, React.ReactNode> = {
    discover: (
      <>
        <circle cx="24" cy="24" r="10" stroke={color} strokeWidth="1.2" fill="none" />
        <line x1="31" y1="31" x2="38" y2="38" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="24" cy="24" r="4" stroke={color} strokeWidth="0.8" fill="none" opacity="0.4" />
      </>
    ),
    define: (
      <>
        <rect x="12" y="12" width="24" height="24" rx="2" stroke={color} strokeWidth="1.2" fill="none" />
        <line x1="17" y1="20" x2="31" y2="20" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <line x1="17" y1="24" x2="27" y2="24" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <line x1="17" y1="28" x2="23" y2="28" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <circle cx="33" cy="14" r="4" stroke={color} strokeWidth="1" fill="none" />
      </>
    ),
    explore: (
      <>
        <path d="M12 24 C12 12, 36 12, 36 24 C36 36, 12 36, 12 24" stroke={color} strokeWidth="1.2" fill="none" />
        <path d="M18 24 C18 18, 30 18, 30 24" stroke={color} strokeWidth="0.8" fill="none" opacity="0.4" />
        <circle cx="24" cy="24" r="2" fill={color} opacity="0.6" />
      </>
    ),
    prototype: (
      <>
        <rect x="14" y="10" width="20" height="28" rx="3" stroke={color} strokeWidth="1.2" fill="none" />
        <line x1="14" y1="16" x2="34" y2="16" stroke={color} strokeWidth="0.8" opacity="0.3" />
        <line x1="14" y1="32" x2="34" y2="32" stroke={color} strokeWidth="0.8" opacity="0.3" />
        <polygon points="21,22 21,28 28,25" stroke={color} strokeWidth="1" fill="none" />
      </>
    ),
    validate: (
      <>
        <path d="M16 24 L22 30 L34 16" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="14" stroke={color} strokeWidth="1" fill="none" opacity="0.3" />
      </>
    ),
    ship: (
      <>
        <path d="M24 10 L24 32" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M18 26 L24 32 L30 26" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="14" y1="38" x2="34" y2="38" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </>
    ),
    learn: (
      <>
        <path d="M12 30 C16 18, 20 26, 24 20 C28 14, 32 22, 36 16" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <circle cx="36" cy="16" r="2.5" stroke={color} strokeWidth="1" fill="none" />
        <circle cx="12" cy="30" r="1.5" fill={color} opacity="0.5" />
      </>
    ),
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      animate={{ opacity: active ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
    >
      {paths[icon]}
    </motion.svg>
  );
}

/* ─────────────────────────────────────────
   Reveal Wrapper
   ───────────────────────────────────────── */

function Reveal({
  children,
  delay = 0,
  y = 30,
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
   Timeline Dot — vertical nav
   ───────────────────────────────────────── */

function TimelineDot({
  stage,
  index,
  active,
  onClick,
}: {
  stage: (typeof STAGES)[0];
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 py-2 relative"
    >
      {/* Dot */}
      <motion.div
        className="relative w-2.5 h-2.5 rounded-full shrink-0"
        animate={{
          backgroundColor: active ? "#c4ff00" : "rgba(58,58,66,0.6)",
          scale: active ? 1.3 : 1,
        }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {active && (
          <motion.div
            className="absolute inset-0 rounded-full bg-[#c4ff00]/20"
            animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>

      {/* Label */}
      <motion.span
        className="text-[0.5rem] tracking-[0.4em] uppercase whitespace-nowrap"
        style={{ fontFamily: "var(--font-mono)" }}
        animate={{
          color: active ? "#c4ff00" : "#3a3a42",
          x: active ? 2 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {stage.num}
      </motion.span>
    </button>
  );
}

/* ─────────────────────────────────────────
   Detail Panel — expandable content drawer
   ───────────────────────────────────────── */

function DetailPanel({
  stage,
  expanded,
  onToggle,
}: {
  stage: (typeof STAGES)[0];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mt-10">
      {/* Toggle */}
      <button
        onClick={onToggle}
        className="flex items-center gap-3 group/toggle mb-0"
      >
        <motion.div
          className="w-5 h-5 border border-[#c4ff00]/30 rounded-full flex items-center justify-center"
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className="text-[9px] text-[#c4ff00] leading-none"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            +
          </span>
        </motion.div>
        <span
          className="text-[0.5625rem] tracking-[0.4em] uppercase text-[#6b6b76] group-hover/toggle:text-[#c4ff00] transition-colors duration-300"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {expanded ? "Collapse Details" : "Expand Details"}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Activities */}
              <div>
                <span
                  className="text-[0.5rem] tracking-[0.5em] uppercase text-[#3a3a42] block mb-5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  KEY ACTIVITIES
                </span>
                <ul className="space-y-3">
                  {stage.activities.map((a, i) => (
                    <motion.li
                      key={a}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#c4ff00]/40 mt-[7px] shrink-0" />
                      <span
                        className="text-[0.8125rem] text-[#8a8a96] leading-[1.6]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {a}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div>
                <span
                  className="text-[0.5rem] tracking-[0.5em] uppercase text-[#3a3a42] block mb-5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  DELIVERABLES
                </span>
                <ul className="space-y-3">
                  {stage.deliverables.map((d, i) => (
                    <motion.li
                      key={d}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#c4ff00]/40 mt-[7px] shrink-0" />
                      <span
                        className="text-[0.8125rem] text-[#8a8a96] leading-[1.6]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {d}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Meta */}
              <div className="space-y-6">
                <div>
                  <span
                    className="text-[0.5rem] tracking-[0.5em] uppercase text-[#3a3a42] block mb-3"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    TYPICAL DURATION
                  </span>
                  <span
                    className="text-[0.9375rem] text-[#e8e6e3]"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                  >
                    {stage.duration}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[0.5rem] tracking-[0.5em] uppercase text-[#3a3a42] block mb-3"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    COLLABORATORS
                  </span>
                  <span
                    className="text-[0.9375rem] text-[#e8e6e3]"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                  >
                    {stage.collaborators}
                  </span>
                </div>
              </div>
            </div>

            {/* Insight quote */}
            <motion.blockquote
              className="mt-10 pl-6 border-l border-[#c4ff00]/15 max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span
                className="text-[clamp(0.9rem,1.3vw,1.1rem)] leading-[1.6] text-[#6b6b76]/80 block"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                "{stage.insight}"
              </span>
            </motion.blockquote>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   Stage Content — the main card for each step
   ───────────────────────────────────────── */

function StageContent({
  stage,
  isActive,
  direction,
}: {
  stage: (typeof STAGES)[0];
  isActive: boolean;
  direction: number;
}) {
  const [detailExpanded, setDetailExpanded] = useState(false);

  // Reset expanded state when stage changes
  useEffect(() => {
    if (!isActive) setDetailExpanded(false);
  }, [isActive]);

  return (
    <motion.div
      key={stage.num}
      initial={{ opacity: 0, y: direction > 0 ? 60 : -60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: direction > 0 ? -40 : 40 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative"
    >
      {/* Icon + Number row */}
      <div className="flex items-start gap-6 md:gap-10 mb-8">
        <StageIcon icon={stage.icon} active={true} />
        <div className="flex-1 min-w-0">
          {/* Number */}
          <motion.span
            className="text-[clamp(4rem,9vw,8rem)] leading-[0.8] tracking-[-0.05em] block"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              WebkitTextStroke: "1.5px rgba(196,255,0,0.2)",
              color: "transparent",
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {stage.num}
          </motion.span>
        </div>
      </div>

      {/* Title */}
      <motion.h3
        className="text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.04em] text-[#e8e6e3] mb-3"
        style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
      >
        {stage.title}
      </motion.h3>

      {/* Subtitle */}
      <motion.span
        className="text-[clamp(0.85rem,1.4vw,1.1rem)] text-[#6b6b76] block mb-2"
        style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {stage.subtitle}
      </motion.span>

      {/* Serif accent */}
      <motion.span
        className="text-[clamp(0.85rem,1.2vw,1rem)] text-[#c4ff00]/30 block mb-8"
        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        — {stage.serifAccent}
      </motion.span>

      {/* Divider */}
      <motion.div
        className="w-16 h-px bg-gradient-to-r from-[#c4ff00]/40 to-transparent mb-8"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
        style={{ originX: 0 }}
      />

      {/* Philosophy text */}
      <motion.p
        className="text-[clamp(0.9rem,1.3vw,1.15rem)] leading-[1.85] text-[#8a8a96] max-w-2xl mb-0"
        style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7, ease: EASE }}
      >
        {stage.philosophy}
      </motion.p>

      {/* Expandable details */}
      <DetailPanel
        stage={stage}
        expanded={detailExpanded}
        onToggle={() => setDetailExpanded(!detailExpanded)}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Progress Ring — circular micro-visualization
   ───────────────────────────────────────── */

function ProgressRing({ current, total }: { current: number; total: number }) {
  const circumference = 2 * Math.PI * 20;
  const progress = ((current + 1) / total) * circumference;

  return (
    <div className="relative w-12 h-12">
      <svg width="48" height="48" viewBox="0 0 48 48" className="rotate-[-90deg]">
        <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          stroke="#c4ff00"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[0.5rem] tracking-[0.2em] text-[#6b6b76]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {current + 1}/{total}
      </span>
    </div>
  );
}

/* ═════════════════════════════════════════
   MAIN — ProcessSection
   Sticky scroll-driven storytelling layout
   ═════════════════════════════════════════ */

export function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Map scroll progress to active stage
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Reserve top 10% for header, bottom 5% for outro
    const adjusted = Math.max(0, (latest - 0.1) / 0.85);
    const idx = Math.min(STAGES.length - 1, Math.floor(adjusted * STAGES.length));
    if (idx !== activeIndex && idx >= 0) {
      setDirection(idx > activeIndex ? 1 : -1);
      setActiveIndex(idx);
    }
  });

  // Parallax for background elements
  const oversizedY = useTransform(scrollYProgress, [0, 1], isMobile ? [40, -60] : [100, -200]);
  const lineProgress = useTransform(scrollYProgress, [0.08, 0.95], ["0%", "100%"]);

  // Stage progress for the horizontal bar
  const stageBarWidth = useTransform(
    scrollYProgress,
    [0.1, 0.95],
    ["0%", "100%"]
  );

  const activeStage = STAGES[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative"
      style={{ height: isMobile ? `${STAGES.length * 80 + 40}vh` : `${STAGES.length * 120 + 60}vh` }}
    >
      {/* ── Sticky container ── */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Grain */}
        <div
          className="absolute inset-0 z-50 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Oversized background number */}
        <motion.div
          style={{ y: oversizedY }}
          className="absolute -top-12 -right-8 md:right-0 pointer-events-none select-none z-0"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={activeStage.num}
              className="text-[clamp(14rem,40vw,36rem)] leading-[0.75] tracking-[-0.06em] block"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                WebkitTextStroke: "1px rgba(255,255,255,0.015)",
                color: "transparent",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {activeStage.num}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Background image — ultra subtle */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
          <img
            src="https://images.unsplash.com/photo-1622185412539-2b4ddeb7d0ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGxpZ2h0JTIwcmF5cyUyMGRhcmslMjBtaW5pbWFsfGVufDF8fHx8MTc3MzQxODMyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(100%)" }}
          />
        </div>

        {/* ── Header — only visible at start ── */}
        <motion.div
          ref={headerRef}
          className="absolute top-0 left-0 right-0 z-10 px-6 md:px-12 lg:px-16 pt-24 md:pt-32"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.06, 0.12], [1, 1, 0]),
            y: useTransform(scrollYProgress, [0.06, 0.14], [0, -60]),
          }}
        >
          <motion.span
            className="type-label text-[#6b6b76] block mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Process
          </motion.span>
          <div className="overflow-hidden">
            <motion.h2
              className="type-headline text-[#e8e6e3]"
              initial={{ y: 80 }}
              animate={headerInView ? { y: 0 } : {}}
              transition={{ duration: 1, ease: EASE }}
            >
              HOW I
            </motion.h2>
          </div>
          <div className="flex items-end gap-6">
            <div className="overflow-hidden">
              <motion.h2
                className="type-headline type-stroke"
                initial={{ y: 80 }}
                animate={headerInView ? { y: 0 } : {}}
                transition={{ delay: 0.1, duration: 1, ease: EASE }}
              >
                WORK
              </motion.h2>
            </div>
            <motion.span
              className="text-[clamp(1rem,2vw,1.6rem)] text-[#6b6b76]/30 mb-2 hidden md:block"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              initial={{ opacity: 0, x: -20 }}
              animate={headerInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              — a seven-act structure
            </motion.span>
          </div>
        </motion.div>

        {/* ── Main stage content ── */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center"
          style={{
            opacity: useTransform(scrollYProgress, [0.05, 0.12], [0, 1]),
          }}
        >
          <div className="w-full px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Vertical timeline nav — desktop only */}
              <div className="hidden lg:flex lg:col-span-1 flex-col items-center pt-4 relative">
                {/* Vertical track */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/[0.04]">
                  <motion.div
                    className="w-full bg-[#c4ff00]/20 origin-top"
                    style={{ height: lineProgress }}
                  />
                </div>

                <div className="relative flex flex-col gap-1">
                  {STAGES.map((stage, i) => (
                    <TimelineDot
                      key={stage.num}
                      stage={stage}
                      index={i}
                      active={i === activeIndex}
                      onClick={() => {
                        // Scroll to corresponding position
                        if (!sectionRef.current) return;
                        const rect = sectionRef.current.getBoundingClientRect();
                        const sectionTop = window.scrollY + rect.top;
                        const sectionHeight = rect.height;
                        const targetScroll = sectionTop + (0.1 + (i / STAGES.length) * 0.85) * sectionHeight;
                        window.scrollTo({ top: targetScroll, behavior: "smooth" });
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Center: Stage content */}
              <div className="lg:col-span-8 lg:col-start-3 max-w-3xl">
                <AnimatePresence mode="wait" custom={direction}>
                  <StageContent
                    key={activeStage.num}
                    stage={activeStage}
                    isActive={true}
                    direction={direction}
                  />
                </AnimatePresence>
              </div>

              {/* Right: Meta sidebar — desktop only */}
              <div className="hidden lg:flex lg:col-span-2 lg:col-start-11 flex-col items-end gap-8 pt-4">
                <ProgressRing current={activeIndex} total={STAGES.length} />

                {/* All stage titles */}
                <div className="flex flex-col items-end gap-3">
                  {STAGES.map((s, i) => (
                    <motion.span
                      key={s.num}
                      className="text-[0.5rem] tracking-[0.35em] uppercase text-right cursor-pointer"
                      style={{ fontFamily: "var(--font-mono)" }}
                      animate={{
                        color: i === activeIndex ? "#c4ff00" : "#3a3a42",
                        opacity: i === activeIndex ? 1 : 0.5,
                      }}
                      whileHover={{ color: "#6b6b76" }}
                      transition={{ duration: 0.3 }}
                      onClick={() => {
                        if (!sectionRef.current) return;
                        const rect = sectionRef.current.getBoundingClientRect();
                        const sectionTop = window.scrollY + rect.top;
                        const sectionHeight = rect.height;
                        const targetScroll = sectionTop + (0.1 + (i / STAGES.length) * 0.85) * sectionHeight;
                        window.scrollTo({ top: targetScroll, behavior: "smooth" });
                      }}
                    >
                      {s.title}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Mobile: Bottom progress bar ── */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 z-20">
          {/* Stage indicator pills */}
          <div className="px-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {STAGES.map((s, i) => (
                <motion.button
                  key={s.num}
                  className="relative h-1 rounded-full overflow-hidden"
                  animate={{
                    width: i === activeIndex ? 28 : 8,
                    backgroundColor:
                      i === activeIndex
                        ? "#c4ff00"
                        : i < activeIndex
                        ? "rgba(196,255,0,0.3)"
                        : "rgba(255,255,255,0.06)",
                  }}
                  transition={{ duration: 0.4, ease: EASE }}
                  onClick={() => {
                    if (!sectionRef.current) return;
                    const rect = sectionRef.current.getBoundingClientRect();
                    const sectionTop = window.scrollY + rect.top;
                    const sectionHeight = rect.height;
                    const targetScroll = sectionTop + (0.1 + (i / STAGES.length) * 0.85) * sectionHeight;
                    window.scrollTo({ top: targetScroll, behavior: "smooth" });
                  }}
                />
              ))}
            </div>
            <span
              className="text-[0.5rem] tracking-[0.4em] text-[#6b6b76]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {activeStage.num} / 07
            </span>
          </div>

          {/* Full-width progress bar */}
          <div className="h-px bg-white/[0.04] relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#c4ff00]/60 to-[#c4ff00]/20"
              style={{ width: stageBarWidth }}
            />
          </div>
        </div>

        {/* ── Scroll hint — visible at very start ── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.04, 0.08], [1, 0.5, 0]),
          }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-6 bg-gradient-to-b from-[#c4ff00]/30 to-transparent"
          />
          <span
            className="type-label-sm text-[#6b6b76]/40"
          >
            Scroll to explore
          </span>
        </motion.div>

        {/* Corner accents */}
        <div className="absolute top-6 left-6 w-5 h-5 border-l border-t border-white/[0.04] pointer-events-none hidden lg:block" />
        <div className="absolute top-6 right-6 w-5 h-5 border-r border-t border-white/[0.04] pointer-events-none hidden lg:block" />
        <div className="absolute bottom-6 left-6 w-5 h-5 border-l border-b border-white/[0.04] pointer-events-none hidden lg:block" />
        <div className="absolute bottom-6 right-6 w-5 h-5 border-r border-b border-white/[0.04] pointer-events-none hidden lg:block" />
      </div>
    </section>
  );
}
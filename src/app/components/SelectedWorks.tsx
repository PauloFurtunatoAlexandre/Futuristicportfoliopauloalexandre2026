import { useRef, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
} from "motion/react";
import { useIsMobile } from "./ui/useMediaQuery";
import hpHeroImg from "../../assets/7bbfacf2ed4c6625d9871c3ff14d7a198146a50e.png";
import gaigHeroImg from "../../assets/a14953c0d7236138483f4078155353567d3722c4.png";
const riseHeroImg = "https://images.unsplash.com/photo-1764795849755-ab58c8fef307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5uYWJpcyUyMGRpc3BlbnNhcnklMjBtb2Rlcm4lMjByZXRhaWwlMjBzdG9yZXxlbnwxfHx8fDE3NzM4MDc4Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

/* ─────────────────────────────────────────
   Data
   ───────────────────────────────────────── */
interface Project {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  role: string;
  problem: string;
  category: string;
  year: string;
  image: string;
  color: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  slug: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "RENTVINE",
    subtitle: "Redesigning Lease Renewals & Property Operations for Scale",
    client: "Rentvine",
    role: "Senior Product Designer",
    problem:
      "Property managers drowning in manual lease renewals and a dashboard that showed everything but communicated nothing. Redesigned the renewal pipeline for batch processing and rebuilt the POD with information hierarchy — 22% feature adoption lift, 25% less engineering rework.",
    category: "B2B SaaS & AI-Augmented Design",
    year: "2025",
    image: "https://images.unsplash.com/photo-1758304481488-c323378f89ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMG1hbmFnZW1lbnQlMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NzM4NTExODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "#c4ff00",
    metrics: [
      { label: "Feature Adoption", value: "+22%" },
      { label: "Rework Reduction", value: "-25%" },
      { label: "Validated Solutions", value: "+30%" },
    ],
    tags: ["B2B SaaS", "AI Workflows", "DesignOps"],
    slug: "rentvine",
  },
  {
    id: "02",
    title: "SOLSTICE",
    subtitle: "Scaling a Consultancy's Product Through Design System Discipline",
    client: "Solstice Innovations",
    role: "Senior Product Designer & Design Lead",
    problem:
      "A powerful enterprise platform growing feature by feature with no shared design language — six different UI dialects, 120+ inconsistencies, and a team of three junior designers shipping in isolation. Built a design system, mentored the team, and turned chaos into a +63% usability lift.",
    category: "Design Systems & Mentorship",
    year: "2024 – 2025",
    image:
      "https://images.unsplash.com/photo-1702726001096-096efcf640b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29uc3VsdGluZyUyMG9mZmljZSUyMG1vZGVybiUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzM4MDMwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "#c4ff00",
    metrics: [
      { label: "Usability", value: "+63%" },
      { label: "Inconsistencies", value: "-80%" },
      { label: "Designers Mentored", value: "3" },
    ],
    tags: ["Design Systems", "Mentorship", "UX Research"],
    slug: "solstice",
  },
  {
    id: "03",
    title: "HEALTHPILOT",
    subtitle: "Turning Medicare Chaos Into Confident Decisions",
    client: "HealthPilot",
    role: "Senior Product Designer",
    problem:
      "Seniors abandoning Medicare enrollment mid-flow — confused by jargon, lost without guidance, distrustful of their own decisions. Rewrote the language, added step-by-step cues, and built a plan comparison engine that turned the scariest step into the most empowering one.",
    category: "Product Design",
    year: "2023",
    image:
      hpHeroImg,
    color: "#c4ff00",
    metrics: [
      { label: "Drop-Off", value: "-25%" },
      { label: "Satisfaction", value: "97%" },
      { label: "Investment", value: "$10M" },
    ],
    tags: ["Healthcare", "Web", "UX Research"],
    slug: "healthpilot",
  },
  {
    id: "04",
    title: "GAIG",
    subtitle: "Taming 33 Business Lines With One Design Language",
    client: "Great American Insurance Group",
    role: "Lead Product Designer",
    problem:
      "33 business lines, 33 different UIs, zero shared language. Agents lost 15+ minutes per task reorienting across products. Insureds abandoned enrollment mid-flow because the platform never confirmed their actions worked. Built a scalable design system and UX governance framework that unified everything.",
    category: "Design Systems",
    year: "2022",
    image: gaigHeroImg,
    color: "#c4ff00",
    metrics: [
      { label: "Feature Delivery", value: "+30%" },
      { label: "Satisfaction", value: "+39%" },
      { label: "Business Lines", value: "33" },
    ],
    tags: ["Design Systems", "B2B", "Accessibility"],
    slug: "gaig",
  },
  {
    id: "05",
    title: "RISE",
    subtitle: "When Shopping Becomes Feeling",
    client: "Rise Cannabis / GTI",
    role: "Product Designer",
    problem:
      "Users couldn't translate emotions into products on a platform built like a pharmaceutical catalog. Redesigned the entire shopping paradigm around feelings — a Fit Guide and emotion-tagged reviews turned confused browsing into confident buying.",
    category: "E-Commerce",
    year: "2021",
    image: riseHeroImg,
    color: "#c4ff00",
    metrics: [
      { label: "Product Matches", value: "+61%" },
      { label: "Repeat Users", value: "+52%" },
      { label: "Engagement", value: "+44%" },
    ],
    tags: ["Cannabis", "Emotion UX", "E-Commerce"],
    slug: "rise",
  },
];

/* ─────────────────────────────────────────
   Sticky Stacking Project Card
   ───────────────────────────────────────── */
function StickyProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(cardRef, { margin: "-20% 0px -20% 0px" });
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  /* ── scroll progress for this card ── */
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const imgParallax = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [20, -20] : [60, -60]
  );
  const imgScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isMobile ? [1.05, 1, 1.03] : [1.15, 1, 1.1]
  );
  const contentY = useTransform(scrollYProgress, [0.1, 0.4], [50, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  /* ── 3D tilt ── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 25,
  });
  const glareX = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(my, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!imageContainerRef.current) return;
      const { left, top, width, height } =
        imageContainerRef.current.getBoundingClientRect();
      mx.set((e.clientX - left) / width - 0.5);
      my.set((e.clientY - top) / height - 0.5);
    },
    [mx, my]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  /* ── sticky offset so cards stack with a visible edge ── */
  const stickyTop = isMobile ? 60 + index * 12 : 80 + index * 28;

  return (
    <div
      ref={cardRef}
      className="relative"
      style={{
        height: isMobile ? "auto" : "120vh",
        marginBottom: index === total - 1 ? 0 : isMobile ? "2rem" : "-20vh",
        minHeight: isMobile ? undefined : undefined,
        position: "relative",
      }}
    >
      <div
        className={isMobile ? "px-4" : "sticky px-4 md:px-8 lg:px-12"}
        style={isMobile ? undefined : { top: stickyTop }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative rounded-sm overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #111113 0%, #0e0e10 100%)`,
            boxShadow: `0 ${40 + index * 4}px ${60 + index * 8}px -20px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Top accent line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px z-30"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${project.color}50 50%, transparent 100%)`,
            }}
            animate={{ opacity: isHovered ? 1 : 0.3 }}
            transition={{ duration: 0.5 }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* ═══════ Image Side ═══════ */}
            <div
              ref={imageContainerRef}
              className="lg:col-span-7 relative overflow-hidden cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate(`/case-study/${project.slug}`)}
              style={{ perspective: isMobile ? undefined : "1200px" }}
            >
              <motion.div
                style={isMobile ? undefined : { rotateX, rotateY }}
                className="relative"
              >
                <div className="relative aspect-[16/10] lg:aspect-auto lg:h-[70vh] min-h-[260px] md:min-h-[340px] overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover will-change-transform"
                    style={{ scale: imgScale, y: imgParallax }}
                    animate={{
                      filter: isHovered
                        ? "brightness(1.05) saturate(1.15)"
                        : "brightness(0.55) saturate(0.85)",
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />

                  {/* Overlay gradient */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      background: isHovered
                        ? `linear-gradient(160deg, rgba(10,10,11,0.2) 0%, rgba(10,10,11,0.6) 60%, rgba(10,10,11,0.85) 100%)`
                        : `linear-gradient(160deg, rgba(10,10,11,0.35) 0%, rgba(10,10,11,0.65) 60%, rgba(10,10,11,0.9) 100%)`,
                    }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Specular glare on tilt */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0"
                    animate={{ opacity: isHovered ? 0.06 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      background: useTransform(
                        [glareX, glareY],
                        ([gx, gy]) =>
                          `radial-gradient(circle at ${gx}% ${gy}%, white 0%, transparent 60%)`
                      ),
                    }}
                  />

                  {/* Project number watermark */}
                  <motion.span
                    className="absolute top-6 left-8 z-10 text-[clamp(4rem,10vw,8rem)] leading-none tracking-[-0.05em] pointer-events-none select-none"
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      WebkitTextStroke: `1px ${project.color}18`,
                      color: "transparent",
                    }}
                    animate={{ opacity: isHovered ? 0.5 : 0.15 }}
                    transition={{ duration: 0.5 }}
                  >
                    {project.id}
                  </motion.span>

                  {/* ── Metrics overlay — always visible on mobile ── */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 z-10">
                    <motion.div
                      className="flex flex-wrap gap-x-6 md:gap-x-8 gap-y-3"
                      initial={false}
                      animate={{
                        opacity: isMobile ? 1 : (isHovered ? 1 : 0),
                        y: isMobile ? 0 : (isHovered ? 0 : 20),
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      {project.metrics.map((metric, i) => (
                        <motion.div
                          key={metric.label}
                          initial={false}
                          animate={{
                            opacity: isMobile ? 1 : (isHovered ? 1 : 0),
                            y: isMobile ? 0 : (isHovered ? 0 : 12),
                          }}
                          transition={{
                            delay: !isMobile && isHovered ? 0.05 + i * 0.07 : 0,
                            duration: 0.4,
                          }}
                          className="flex flex-col"
                        >
                          <span
                            className="text-[clamp(1.2rem,2.5vw,2rem)] tracking-[-0.03em] text-[#e8e6e3]"
                            style={{
                              fontFamily: "'Syne', sans-serif",
                              fontWeight: 700,
                            }}
                          >
                            {metric.value}
                          </span>
                          <span
                            className="text-[11px] tracking-[0.25em] uppercase mt-1"
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              color: `${project.color}90`,
                            }}
                          >
                            {metric.label}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Persistent bottom line */}
                    <motion.div
                      className="mt-6 h-px"
                      style={{
                        background: `linear-gradient(90deg, ${project.color}30, transparent)`,
                      }}
                      animate={{ scaleX: isHovered ? 1 : 0.3, originX: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>

                  {/* View CTA */}
                  <motion.div
                    className="absolute top-6 right-8 z-10 flex items-center gap-3"
                    initial={false}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      x: isHovered ? 0 : 16,
                    }}
                    transition={{ duration: 0.4, delay: isHovered ? 0.15 : 0 }}
                  >
                    <span
                      className="text-[10px] tracking-[0.35em] uppercase text-[#e8e6e3]/80"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      View Project
                    </span>
                    <motion.div
                      className="w-9 h-9 rounded-full border flex items-center justify-center backdrop-blur-sm"
                      animate={{
                        borderColor: isHovered
                          ? `${project.color}50`
                          : "rgba(255,255,255,0.1)",
                        backgroundColor: isHovered
                          ? `${project.color}10`
                          : "rgba(255,255,255,0.03)",
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                      >
                        <path
                          d="M2 11L11 2M11 2H5M11 2V8"
                          stroke={project.color}
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* ═══════ Content Side ═══════ */}
            <div className="lg:col-span-5 relative">
              <motion.div
                style={{ y: contentY, opacity: contentOpacity }}
                className="p-6 md:p-10 lg:p-12 flex flex-col justify-center lg:min-h-[70vh]"
              >
                {/* Category + Year */}
                <div className="flex items-center gap-3 mb-8">
                  <span
                    className="text-[10px] tracking-[0.5em] uppercase"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: project.color,
                    }}
                  >
                    {project.category}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span
                    className="text-[10px] tracking-[0.3em] text-[#6b6b76]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {project.year}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-[clamp(1.8rem,4vw,3.5rem)] leading-[0.88] tracking-[-0.04em] text-[#e8e6e3] mb-3"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
                >
                  {project.title}
                </h3>

                {/* Subtitle */}
                <p
                  className="text-[clamp(0.95rem,1.4vw,1.15rem)] text-[#e8e6e3]/50 mb-8"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500 }}
                >
                  {project.subtitle}
                </p>

                {/* Divider */}
                <div
                  className="w-10 h-px mb-8"
                  style={{ backgroundColor: `${project.color}30` }}
                />

                {/* Client & Role */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <span
                      className="block text-[11px] tracking-[0.4em] uppercase text-[#6b6b76]/60 mb-1.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Client
                    </span>
                    <span
                      className="text-[12px] tracking-[0.1em] text-[#e8e6e3]/80"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {project.client}
                    </span>
                  </div>
                  <div>
                    <span
                      className="block text-[11px] tracking-[0.4em] uppercase text-[#6b6b76]/60 mb-1.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Role
                    </span>
                    <span
                      className="text-[12px] tracking-[0.1em] text-[#e8e6e3]/80"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {project.role}
                    </span>
                  </div>
                </div>

                {/* Problem statement */}
                <p
                  className="text-[13px] leading-[1.7] text-[#6b6b76] mb-8 max-w-md"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {project.problem}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-10">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-[11px] tracking-[0.25em] uppercase border rounded-full"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        borderColor: `${project.color}20`,
                        color: `${project.color}90`,
                        backgroundColor: `${project.color}06`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  onClick={() => navigate(`/case-study/${project.slug}`)}
                  className="group inline-flex items-center gap-4 self-start"
                  whileHover="hover"
                >
                  <motion.div
                    className="relative px-6 py-3 overflow-hidden"
                    style={{
                      border: `1px solid ${project.color}25`,
                    }}
                  >
                    <motion.span
                      className="relative z-10 text-[10px] tracking-[0.35em] uppercase"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: project.color,
                      }}
                      variants={{ hover: { color: "#0a0a0b" } }}
                      transition={{ duration: 0.35 }}
                    >
                      Read Case Study
                    </motion.span>
                    <motion.div
                      className="absolute inset-0"
                      style={{ backgroundColor: project.color }}
                      initial={{ scaleX: 0, originX: 0 }}
                      variants={{ hover: { scaleX: 1 } }}
                      transition={{
                        duration: 0.45,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    />
                  </motion.div>
                  <motion.svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="opacity-30 group-hover:opacity-100 transition-opacity duration-500"
                    variants={{ hover: { x: 6 } }}
                    transition={{ duration: 0.35 }}
                  >
                    <path
                      d="M3 9h12M10 4l5 5-5 5"
                      stroke={project.color}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Bottom colored glow */}
          <motion.div
            className="absolute -bottom-8 left-[10%] right-[10%] h-16 rounded-[50%] blur-3xl pointer-events-none z-0"
            initial={{ backgroundColor: "rgba(0,0,0,0)" }}
            animate={{
              backgroundColor: isHovered
                ? `${project.color}0a`
                : "rgba(0,0,0,0)",
            }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Section Header
   ───────────────────────────────────────── */
function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.2"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const lineScale = useTransform(scrollYProgress, [0.2, 1], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <div ref={ref} className="relative px-4 md:px-8 lg:px-16 mb-20 md:mb-32" style={{ position: "relative" }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        {/* Left label */}
        <motion.div
          style={{ opacity: headingOpacity, y: labelY }}
          className="lg:col-span-3 flex flex-col gap-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#c4ff00]/60" />
            <span className="type-label text-[#c4ff00]/60">
              Featured Work
            </span>
          </div>
          <p
            className="text-[12px] tracking-[0.1em] text-[#6b6b76] max-w-[260px] leading-[1.7]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            A curated gallery of product thinking, visual craft, and measurable impact.
          </p>
        </motion.div>

        {/* Large heading */}
        <div className="lg:col-span-8 lg:col-start-5">
          <motion.div style={{ y: headingY, opacity: headingOpacity }}>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 120 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="type-display text-[#e8e6e3]"
              >
                SELECTED
              </motion.h2>
            </div>
            <div className="flex items-end gap-5 md:gap-8">
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: 120 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="type-display type-stroke"
                >
                  WORKS
                </motion.h2>
              </div>
              <motion.div
                style={{ scaleX: lineScale, originX: 0 }}
                className="hidden md:block flex-1 h-px bg-gradient-to-r from-[#c4ff00]/30 via-[#c4ff00]/10 to-transparent mb-5"
              />
              <motion.span
                style={{ opacity: headingOpacity }}
                className="hidden md:block type-label-sm text-[#6b6b76]/50 mb-4 whitespace-nowrap"
              >
                {String(projects.length).padStart(2, "0")} PROJECTS
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Export
   ───────────────────────────────────────── */
export function SelectedWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const projectColors = useMemo(
    () => projects.map((p) => p.color),
    []
  );

  const navigate = useNavigate();

  const isMobile = useIsMobile();

  return (
    <section id="work" ref={sectionRef} className="relative py-20 md:py-32" style={{ position: "relative" }}>
      <SectionHeader />

      {/* Sticky card stack */}
      <div className="relative">
        {projects.map((project, index) => (
          <StickyProjectCard
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9 }}
        className="mt-32 md:mt-48 flex flex-col items-center gap-8 px-4"
      >
        <motion.div
          className="w-px h-20 bg-gradient-to-b from-[#c4ff00]/25 to-transparent"
          animate={{ scaleY: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.a
          href="#contact"
          className="group relative flex items-center gap-5 px-10 py-5 border border-white/[0.05] hover:border-[#c4ff00]/20 transition-all duration-700 overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#c4ff00]/[0.03]"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <span
            className="relative z-10 text-[11px] tracking-[0.4em] uppercase text-[#6b6b76] group-hover:text-[#c4ff00] transition-colors duration-500"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Have a project in mind?
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="relative z-10 text-[#6b6b76] group-hover:text-[#c4ff00] transition-all duration-500 group-hover:translate-x-1"
          >
            <path
              d="M4 9h10M10 4l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.a>

        <span
          className="text-[11px] tracking-[0.5em] uppercase text-[#6b6b76]/30"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Let's build together
        </span>
      </motion.div>
    </section>
  );
}
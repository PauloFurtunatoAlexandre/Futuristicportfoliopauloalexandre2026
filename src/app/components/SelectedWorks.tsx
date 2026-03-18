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
    title: "MERIDIAN",
    subtitle: "Turning Onboarding Into a Trust Engine",
    client: "Meridian Financial",
    role: "Lead Product Designer",
    problem:
      "Hemorrhaging ~$2.4M annually — 40% abandoned onboarding before identity verification. Reframed the entire flow as a guided conversation with progressive trust, micro-celebrations, and compliance UX that doesn't feel like compliance.",
    category: "Product Design",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1663000803107-132fb64cc148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9vZHklMjBiYW5raW5nJTIwYXBwJTIwbW9iaWxlJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3MzQxMDE0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "#c4ff00",
    metrics: [
      { label: "Onboarding", value: "+67%" },
      { label: "NPS", value: "82" },
      { label: "Time to Value", value: "-53%" },
    ],
    tags: ["Fintech", "Mobile", "Brand System"],
    slug: "meridian",
  },
  {
    id: "02",
    title: "VOID",
    subtitle: "Designing for the Body, Not the Screen",
    client: "VOID Technologies",
    role: "Creative Director",
    problem:
      "Sub-60% task completion, 12-minute session fatigue. 2D paradigms extruded into 3D space. Built a gesture-first interaction model treating the body as input device — proximity-aware UI, multi-sensory feedback, adaptive rest states.",
    category: "Interaction Design",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1562672421-94d4c2aaabe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwcmVhbGl0eSUyMG1peGVkJTIwcmVhbGl0eSUyMGRhcmslMjBzdHVkaW98ZW58MXx8fHwxNzczNDEwMTQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "#ff6b35",
    metrics: [
      { label: "Task Completion", value: "94%" },
      { label: "Gesture Accuracy", value: "+41%" },
      { label: "Satisfaction", value: "4.8/5" },
    ],
    tags: ["XR", "Spatial UI", "Prototyping"],
    slug: "void",
  },
  {
    id: "03",
    title: "AETHER",
    subtitle: "Making Algorithmic Art Feel Like Painting",
    client: "Aether Labs",
    role: "Product Designer & Strategist",
    problem:
      "80% of potential users — visual artists — had no path into algorithmic creation. Designed a dual-mode node editor with progressive complexity that converted visual-first creators at 4x the previous rate.",
    category: "Creative Direction",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1764866127860-1da95e9c74a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwYWJzdHJhY3QlMjBkaWdpdGFsJTIwYXJ0JTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc3MzQxMDE0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "#a855f7",
    metrics: [
      { label: "Creators", value: "12K+" },
      { label: "Artworks", value: "1.2M" },
      { label: "Avg. Session", value: "34min" },
    ],
    tags: ["Web App", "Creative Tools", "AI"],
    slug: "aether",
  },
  {
    id: "04",
    title: "FORMA",
    subtitle: "Unifying Six Products That Grew Up Separately",
    client: "Forma Inc.",
    role: "Systems Design Lead",
    problem:
      "Six teams, five years of drift, zero shared language — 47 button variants, 23 grays, 3-week component shipping time. Architected a token-first design system with automated governance that all six teams actually adopted.",
    category: "Systems Design",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1662906047226-971b484f5056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBjb25jcmV0ZSUyMGFyY2hpdGVjdHVyZSUyMHNoYWRvd3xlbnwxfHx8fDE3NzM0MTAxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "#06b6d4",
    metrics: [
      { label: "Velocity", value: "+120%" },
      { label: "Components", value: "480+" },
      { label: "Adoption", value: "6/6" },
    ],
    tags: ["Design Ops", "Tokens", "Figma"],
    slug: "forma",
  },
  {
    id: "05",
    title: "LUXE",
    subtitle: "Where Editorial Storytelling Meets Commerce",
    client: "Maison Luxe",
    role: "Lead Product Designer",
    problem:
      "Converting 40% below luxury benchmarks — a product catalog disconnected from the boutique experience. Reimagined e-commerce as editorial magazine where story-driven pages blur the line between reading and shopping.",
    category: "E-Commerce",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1771955216611-0a826d819978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkYXJrJTIwcHJvZHVjdCUyMHN0aWxsJTIwbGlmZSUyMG1pbmltYWx8ZW58MXx8fHwxNzczNDEwMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "#f0abfc",
    metrics: [
      { label: "Conversion", value: "+89%" },
      { label: "AOV", value: "+34%" },
      { label: "Return Rate", value: "3.2×" },
    ],
    tags: ["Shopify", "Brand", "Editorial"],
    slug: "luxe",
  },
  {
    id: "06",
    title: "SYNTH",
    subtitle: "Making the Smart Home Disappear",
    client: "SynthOS",
    role: "Creative Director & Designer",
    problem:
      "Smart home controls scattered across 6+ apps — 73% of users had abandoned devices because the apps were too frustrating. Designed an ambient, room-centric interface that cut daily interactions from 47 to 8 with zero-config setup.",
    category: "IoT / Dashboard",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1751945965597-71171ec7a458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWJpZW50JTIwbGlnaHRpbmclMjBzbWFydCUyMGhvbWUlMjBpbnRlcmlvciUyMG1vb2R5fGVufDF8fHx8MTc3MzQxMDE0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "#34d399",
    metrics: [
      { label: "DAU", value: "280K" },
      { label: "Interactions", value: "47/day" },
      { label: "Setup", value: "<2min" },
    ],
    tags: ["IoT", "Dashboard", "Ambient"],
    slug: "synth",
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
        marginBottom: index === total - 1 ? 0 : isMobile ? "1.5rem" : "-20vh",
        minHeight: isMobile ? undefined : undefined,
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
              onClick={() => isMobile && navigate(`/case-study/${project.slug}`)}
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
                            className="text-[9px] tracking-[0.25em] uppercase mt-1"
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
                      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm"
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
                  className="text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.88] tracking-[-0.04em] text-[#e8e6e3] mb-3"
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
                      className="block text-[9px] tracking-[0.4em] uppercase text-[#6b6b76]/60 mb-1.5"
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
                      className="block text-[9px] tracking-[0.4em] uppercase text-[#6b6b76]/60 mb-1.5"
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
                      className="px-3 py-1 text-[9px] tracking-[0.25em] uppercase border rounded-full"
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
                    <span
                      className="relative z-10 text-[10px] tracking-[0.35em] uppercase transition-colors duration-500"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: isHovered ? "#0a0a0b" : project.color,
                      }}
                    >
                      Read Case Study
                    </span>
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
   Progress Indicator
   ───────────────────────────────────────── */
function ProgressIndicator({
  total,
  scrollProgress,
  colors,
}: {
  total: number;
  scrollProgress: ReturnType<typeof useTransform>;
  colors: string[];
}) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3">
      {Array.from({ length: total }, (_, i) => {
        const segmentStart = i / total;
        const segmentEnd = (i + 1) / total;
        return (
          <ProgressDot
            key={i}
            index={i}
            segmentStart={segmentStart}
            segmentEnd={segmentEnd}
            scrollProgress={scrollProgress}
            color={colors[i]}
            id={projects[i].id}
          />
        );
      })}
    </div>
  );
}

function ProgressDot({
  index,
  segmentStart,
  segmentEnd,
  scrollProgress,
  color,
  id,
}: {
  index: number;
  segmentStart: number;
  segmentEnd: number;
  scrollProgress: ReturnType<typeof useTransform>;
  color: string;
  id: string;
}) {
  const isActive = useTransform(scrollProgress, (v: number) => {
    return v >= segmentStart && v < segmentEnd;
  });
  const scale = useTransform(isActive, (active: boolean) => (active ? 1 : 0.6));
  const opacity = useTransform(isActive, (active: boolean) =>
    active ? 1 : 0.25
  );
  const springScale = useSpring(scale, { stiffness: 300, damping: 25 });
  const springOpacity = useSpring(opacity, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="flex items-center gap-2 group cursor-pointer"
      style={{ opacity: springOpacity }}
    >
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: color,
          scale: springScale,
        }}
      />
      <motion.span
        className="text-[8px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color,
        }}
      >
        {id}
      </motion.span>
    </motion.div>
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
    <div ref={ref} className="relative px-4 md:px-8 lg:px-16 mb-20 md:mb-32">
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
    <section id="work" ref={sectionRef} className="relative py-20 md:py-32">
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

      {/* Side progress */}
      <ProgressIndicator
        total={projects.length}
        scrollProgress={scrollYProgress}
        colors={projectColors}
      />

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
          className="text-[8px] tracking-[0.5em] uppercase text-[#6b6b76]/30"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Let's build together
        </span>
      </motion.div>
    </section>
  );
}
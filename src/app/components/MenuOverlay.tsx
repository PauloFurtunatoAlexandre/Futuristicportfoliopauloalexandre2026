import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { ArrowUpRight, X } from "lucide-react";
const gaigHeroImg = "https://images.unsplash.com/photo-1640323240640-ee731d18dcb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN1cmFuY2UlMjBlbnRlcnByaXNlJTIwc29mdHdhcmUlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzczODA3MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
import hpHeroImg from "../../assets/7bbfacf2ed4c6625d9871c3ff14d7a198146a50e.png";
const riseHeroImg = "https://images.unsplash.com/photo-1764795849755-ab58c8fef307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5uYWJpcyUyMGRpc3BlbnNhcnklMjBtb2Rlcm4lMjByZXRhaWwlMjBzdG9yZXxlbnwxfHx8fDE3NzM4MDc4Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

/* ─────────────────────────────────────────
   Constants
   ───────────────────────────────────────── */

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_SMOOTH = [0.43, 0.13, 0.23, 0.96] as const;

/* ─────────────────────────────────────────
   Project Data
   ───────────────────────────────────────── */

const PROJECTS = [
  {
    title: "RENTVINE",
    subtitle: "Redesigning Lease Renewals & Property Operations for Scale",
    slug: "rentvine",
    year: "2025",
    category: "B2B SaaS & AI-Augmented Design",
    image: "https://images.unsplash.com/photo-1758304481488-c323378f89ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMG1hbmFnZW1lbnQlMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NzM4NTExODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "HEALTHPILOT",
    subtitle: "Turning Medicare Chaos Into Confident Decisions",
    slug: "healthpilot",
    year: "2025",
    category: "Product Design",
    image: hpHeroImg,
  },
  {
    title: "SOLSTICE",
    subtitle: "Scaling a Consultancy's Product Through Design System Discipline",
    slug: "solstice",
    year: "2024",
    category: "Design Systems & Mentorship",
    image:
      "https://images.unsplash.com/photo-1702726001096-096efcf640b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29uc3VsdGluZyUyMG9mZmljZSUyMG1vZGVybiUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzM4MDMwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "GAIG",
    subtitle: "Taming 33 Business Lines With One Design Language",
    slug: "gaig",
    year: "2022",
    category: "Design Systems",
    image: gaigHeroImg,
  },
  {
    title: "RISE",
    subtitle: "When Shopping Becomes Feeling",
    slug: "rise",
    year: "2021",
    category: "E-Commerce",
    image: riseHeroImg,
  },
];

const SECTION_LINKS = [
  { label: "Work", id: "work" },
  { label: "About", id: "about" },
  { label: "Impact", id: "impact" },
  { label: "Contact", id: "contact" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/paulofurtunatoalexandre/" },
  { label: "Resume", href: "/resume" },
];

/* ─────────────────────────────────────────
   Project Row — hover-reveal image
   ───────────────────────────────────────── */

function ProjectRow({
  project,
  index,
  onNavigate,
  onHover,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  onNavigate: (slug: string) => void;
  onHover: (img: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      className="w-full text-left group"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        delay: 0.15 + index * 0.06,
        duration: 0.7,
        ease: EASE,
      }}
      onMouseEnter={() => {
        setHovered(true);
        // onHover(project.image); // Removed hover image
      }}
      onMouseLeave={() => {
        setHovered(false);
        // onHover(null); // Removed hover image
      }}
      onClick={() => onNavigate(project.slug)}
    >
      <div className="border-b border-white/[0.04] py-5 md:py-6 flex items-center justify-between">
        <div className="flex items-baseline gap-4 md:gap-6 flex-1 min-w-0">
          {/* Index */}
          <motion.span
            className="text-[0.5rem] tracking-[0.4em] tabular-nums shrink-0"
            style={{ fontFamily: "var(--font-mono)" }}
            animate={{ color: hovered ? "#c4ff00" : "#3a3a42" }}
            transition={{ duration: 0.3 }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          {/* Title */}
          <div className="flex items-baseline gap-3 md:gap-5 min-w-0">
            <motion.span
              className="text-[clamp(1rem,2vw,1.6rem)] tracking-[-0.03em] whitespace-nowrap"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                lineHeight: 1,
              }}
              animate={{
                color: hovered ? "#c4ff00" : "#e8e6e3",
                x: hovered ? 8 : 0,
              }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {project.title}
            </motion.span>

            <motion.span
              className="text-[0.75rem] text-[#6b6b76]/0 truncate hidden md:block"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              animate={{
                color: hovered
                  ? "rgba(107,107,118,0.6)"
                  : "rgba(107,107,118,0)",
                x: hovered ? 0 : -10,
              }}
              transition={{ duration: 0.35 }}
            >
              {project.subtitle}
            </motion.span>
          </div>
        </div>

        {/* Right — year + arrow */}
        <div className="flex items-center gap-4 shrink-0">
          <span
            className="text-[0.5rem] tracking-[0.3em] text-[#3a3a42] hidden md:block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {project.year}
          </span>
          <motion.div
            animate={{
              x: hovered ? 0 : -4,
              opacity: hovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight size={16} className="text-[#c4ff00]" />
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
}

/* ═════════════════════════════════════════
   MENU OVERLAY
   ═════════════════════════════════════════ */

export function MenuOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse-following image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY]
  );

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleNavigate = useCallback(
    (slug: string) => {
      onClose();
      setTimeout(() => navigate(`/case-study/${slug}`), 400);
    },
    [navigate, onClose]
  );

  const handleSectionClick = useCallback(
    (id: string) => {
      onClose();
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: "smooth" });
        }, 600);
      } else {
        setTimeout(() => {
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: "smooth" });
        }, 400);
      }
    },
    [onClose, location, navigate]
  );

  // Current time
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "America/New_York",
        })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[95] flex flex-col"
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background layers */}
          <motion.div
            className="absolute inset-0 bg-[#0a0a0b]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.98 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(196,255,0,0.015) 0%, transparent 100%)",
            }}
          />

          {/* Floating hover image — desktop only */}
          <AnimatePresence>
            {hoveredImage && (
              <motion.div
                className="fixed z-[1] w-[280px] h-[180px] pointer-events-none hidden lg:block"
                style={{
                  left: springX,
                  top: springY,
                  x: 24,
                  y: -90,
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <div className="w-full h-full overflow-hidden border border-white/[0.06]">
                  <img
                    src={hoveredImage}
                    alt=""
                    className="w-full h-full object-cover brightness-[0.5] saturate-[0.8]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/60 to-transparent" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close button — top right */}
          <motion.button
            className="absolute top-6 right-6 md:top-8 md:right-12 z-[10] flex items-center gap-3 group"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onClick={onClose}
          >
            <span
              className="text-[0.5rem] tracking-[0.5em] text-[#6b6b76] group-hover:text-[#c4ff00] transition-colors duration-300 hidden md:block"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              CLOSE
            </span>
            <div className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center group-hover:border-[#c4ff00]/30 transition-colors duration-500">
              <X size={16} className="text-[#6b6b76] group-hover:text-[#c4ff00] transition-colors duration-300" />
            </div>
          </motion.button>

          {/* CONTENT */}
          <div className="relative z-[5] flex-1 overflow-y-auto overflow-x-hidden">
            <div className="min-h-full flex flex-col px-6 md:px-12 lg:px-16">
              {/* Top bar */}
              <motion.div
                className="pt-6 md:pt-8 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <button
                  onClick={() => {
                    onClose();
                    if (location.pathname !== "/") {
                      navigate("/");
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <span
                    className="text-[clamp(1rem,2vw,1.3rem)] tracking-[-0.03em] text-[#e8e6e3]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                    }}
                  >
                    P.A.
                  </span>
                  <span
                    className="text-[0.6rem] text-[#c4ff00]/40 ml-1 hidden md:block"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                    }}
                  >
                    portfolio
                  </span>
                </button>

                <span
                  className="text-[0.5rem] tracking-[0.4em] text-[#3a3a42] tabular-nums hidden md:block"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {time} WET
                </span>
              </motion.div>

              {/* Main grid — projects + navigation */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-12 md:py-16">
                {/* Projects — left */}
                <div className="lg:col-span-8">
                  <motion.span
                    className="type-label text-[#6b6b76] block mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    Selected Projects
                  </motion.span>

                  <div className="border-t border-white/[0.04]">
                    {PROJECTS.map((p, i) => (
                      <ProjectRow
                        key={p.slug}
                        project={p}
                        index={i}
                        onNavigate={handleNavigate}
                        onHover={setHoveredImage}
                      />
                    ))}
                  </div>
                </div>

                {/* Navigation + info — right */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  {/* Section nav */}
                  <div>
                    <motion.span
                      className="type-label text-[#6b6b76] block mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.5 }}
                    >
                      Navigate
                    </motion.span>

                    <div className="space-y-0">
                      {SECTION_LINKS.map((link, i) => (
                        <motion.button
                          key={link.id}
                          className="w-full text-left group block"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.3 + i * 0.05,
                            duration: 0.5,
                            ease: EASE,
                          }}
                          onClick={() => handleSectionClick(link.id)}
                        >
                          <div className="py-3 flex items-center gap-4">
                            <div className="w-4 h-px bg-white/[0.06] group-hover:bg-[#c4ff00]/40 group-hover:w-8 transition-all duration-500" />
                            <span
                              className="text-[0.9375rem] text-[#6b6b76] group-hover:text-[#e8e6e3] transition-colors duration-300"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {link.label}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom section — socials & availability */}
                  <div className="mt-12 lg:mt-0">
                    <motion.span
                      className="type-label text-[#6b6b76] block mb-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      Connect
                    </motion.span>

                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {SOCIALS.map((s, i) => (
                        <motion.a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.75rem] text-[#3a3a42] hover:text-[#c4ff00] transition-colors duration-300"
                          style={{ fontFamily: "var(--font-mono)" }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.55 + i * 0.04, duration: 0.4 }}
                        >
                          {s.label}
                        </motion.a>
                      ))}
                    </div>

                    {/* Availability badge */}
                    <motion.div
                      className="mt-8 flex items-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full bg-[#c4ff00]"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <span
                        className="text-[0.5rem] tracking-[0.4em] text-[#6b6b76]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        AVAILABLE FOR PROJECTS — Q2 2026
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Footer line */}
              <motion.div
                className="pb-6 md:pb-8 flex items-center justify-between border-t border-white/[0.03] pt-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <span
                  className="text-[0.45rem] tracking-[0.5em] text-[#3a3a42]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  &copy; 2026 P.A. — ALL RIGHTS RESERVED
                </span>
                <span
                  className="text-[0.6rem] text-[#3a3a42]/50"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                  }}
                >
                  designed with obsessive attention
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
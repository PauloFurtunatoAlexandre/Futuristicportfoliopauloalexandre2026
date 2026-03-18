import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { MenuOverlay } from "./MenuOverlay";

/* ─────────────────────────────────────────
   Constants
   ───────────────────────────────────────── */

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const HOME_SECTIONS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "impact", label: "Impact" },
  { id: "reel", label: "Reel" },
  { id: "contact", label: "Contact" },
];

/* ─────────────────────────────────────────
   Hamburger Icon — animated 3-line to X
   ───────────────────────────────────────── */

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-4 h-3 flex flex-col justify-between relative">
      <motion.span
        className="block w-full h-px bg-current origin-left"
        animate={
          isOpen
            ? { rotate: 45, y: 0, width: "115%" }
            : { rotate: 0, y: 0, width: "100%" }
        }
        transition={{ duration: 0.35, ease: EASE }}
      />
      <motion.span
        className="block w-2/3 h-px bg-current"
        animate={
          isOpen ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }
        }
        transition={{ duration: 0.25, ease: EASE }}
      />
      <motion.span
        className="block w-full h-px bg-current origin-left"
        animate={
          isOpen
            ? { rotate: -45, y: 0, width: "115%" }
            : { rotate: 0, y: 0, width: "100%" }
        }
        transition={{ duration: 0.35, ease: EASE }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Scroll Progress — top bar
   ───────────────────────────────────────── */

function GlobalProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 60, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[82] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, rgba(196,255,0,0.7) 0%, rgba(196,255,0,0.3) 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      role="progressbar"
      aria-label="Page scroll progress"
    />
  );
}

/* ─────────────────────────────────────────
   Section Progress Dots — right rail
   ───────────────────────────────────────── */

function SectionDots({
  sections,
  activeSection,
  visible,
}: {
  sections: { id: string; label: string }[];
  activeSection: string;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          className="fixed right-5 md:right-8 top-1/2 -translate-y-1/2 z-[79] hidden md:flex flex-col items-end gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {sections.map((s) => {
            const isActive = activeSection === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex items-center gap-3"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(s.id);
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {/* Label — appears on hover and when active */}
                <motion.span
                  className="text-[0.45rem] tracking-[0.4em] uppercase whitespace-nowrap"
                  style={{ fontFamily: "var(--font-mono)" }}
                  animate={{
                    opacity: isActive ? 0.8 : 0,
                    x: isActive ? 0 : 8,
                    color: isActive ? "#c4ff00" : "#6b6b76",
                  }}
                  whileHover={{ opacity: 0.6, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {s.label}
                </motion.span>

                {/* Dot / line */}
                <motion.div
                  className="rounded-full"
                  animate={{
                    width: isActive ? 16 : 4,
                    height: isActive ? 2 : 4,
                    backgroundColor: isActive
                      ? "#c4ff00"
                      : "rgba(107,107,118,0.2)",
                    borderRadius: isActive ? 1 : 999,
                  }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </a>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

/* ═════════════════════════════════════════
   MAIN — FloatingNav
   ═════════════════════════════════════════ */

export function FloatingNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isCaseStudy = location.pathname.startsWith("/case-study");

  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Show nav after scrolling past hero
  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 400);
    setScrolled(latest > 80);
  });

  // Observe sections on homepage
  useEffect(() => {
    if (!isHome) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.15, rootMargin: "-15% 0px -65% 0px" }
    );

    HOME_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  // Derive slug from path for case study context
  const slug = isCaseStudy
    ? location.pathname.split("/").pop() ?? ""
    : "";

  // Keyboard shortcuts for global nav
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setMenuOpen((prev) => !prev);
      } else if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        navigate("/");
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  return (
    <>
      {/* Global scroll progress bar */}
      <GlobalProgressBar />

      {/* Section dots — right rail (homepage only) */}
      {isHome && (
        <SectionDots
          sections={HOME_SECTIONS}
          activeSection={activeSection}
          visible={visible}
        />
      )}

      {/* ════════ THE NAV BAR ════════ */}
      <AnimatePresence>
        {(visible || menuOpen) && (
          <motion.header
            className="fixed top-0 left-0 right-0 z-[81] px-4 md:px-8 pt-4 md:pt-5 pointer-events-none"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <nav
              className="pointer-events-auto mx-auto flex items-center justify-between h-12 md:h-14 px-4 md:px-6 rounded-full border transition-colors duration-700"
              style={{
                background: menuOpen
                  ? "rgba(10,10,11,0.95)"
                  : "rgba(10,10,11,0.75)",
                backdropFilter: "blur(24px) saturate(1.3)",
                WebkitBackdropFilter: "blur(24px) saturate(1.3)",
                borderColor: menuOpen
                  ? "rgba(196,255,0,0.08)"
                  : "rgba(255,255,255,0.05)",
              }}
            >
              {/* LEFT — Logo / Back */}
              <div className="flex items-center gap-3">
                {isCaseStudy && !menuOpen ? (
                  <motion.button
                    className="flex items-center gap-2.5 group"
                    onClick={() => navigate("/")}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <div className="w-7 h-7 rounded-full border border-white/[0.08] flex items-center justify-center group-hover:border-[#c4ff00]/30 transition-colors duration-500">
                      <ArrowLeft
                        size={12}
                        className="text-[#6b6b76] group-hover:text-[#c4ff00] transition-colors duration-300"
                      />
                    </div>
                    <span
                      className="text-[0.5rem] tracking-[0.3em] uppercase text-[#6b6b76] group-hover:text-[#c4ff00] transition-colors duration-300 hidden md:block"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      All Projects
                    </span>
                  </motion.button>
                ) : (
                  <button
                    className="flex items-center gap-1.5"
                    onClick={() => {
                      if (menuOpen) {
                        setMenuOpen(false);
                      }
                      if (location.pathname !== "/") {
                        navigate("/");
                      } else {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                  >
                    <span
                      className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-[-0.02em] text-[#e8e6e3]"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                      }}
                    >
                      P.A.
                    </span>
                  </button>
                )}

                {/* Case study title — subtle context */}
                {isCaseStudy && !menuOpen && slug && (
                  <motion.span
                    className="text-[0.45rem] tracking-[0.4em] uppercase text-[#3a3a42] hidden lg:block"
                    style={{ fontFamily: "var(--font-mono)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    / {slug}
                  </motion.span>
                )}
              </div>

              {/* CENTER — Section nav (homepage only) */}
              {isHome && !menuOpen && (
                <div className="hidden md:flex items-center gap-0.5">
                  {HOME_SECTIONS.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="relative px-3 lg:px-4 py-1.5 rounded-full"
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(item.id);
                          el?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="nav-active-pill"
                            className="absolute inset-0 bg-white/[0.06] rounded-full"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 32,
                            }}
                          />
                        )}
                        <span
                          className="relative z-10 text-[0.5rem] tracking-[0.45em] uppercase transition-colors duration-300"
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: isActive ? "#c4ff00" : "#6b6b76",
                          }}
                        >
                          {item.label}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}

              {/* RIGHT — Menu trigger + pulse */}
              <div className="flex items-center gap-3">
                {/* Availability dot */}
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[#c4ff00] hidden md:block"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Menu button */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2.5 group"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                  <span
                    className="text-[0.5rem] tracking-[0.4em] text-[#6b6b76] group-hover:text-[#e8e6e3] transition-colors duration-300 hidden md:block"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {menuOpen ? "CLOSE" : "MENU"}
                  </span>
                  <div className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center group-hover:border-[#c4ff00]/25 transition-colors duration-500 text-[#6b6b76] group-hover:text-[#c4ff00]">
                    <MenuIcon isOpen={menuOpen} />
                  </div>
                </button>
              </div>
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Full-screen menu overlay */}
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
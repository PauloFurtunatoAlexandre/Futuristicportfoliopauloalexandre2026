import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "motion/react";
import { ArrowUpRight, ArrowUp, Mail, Download, Copy, Check } from "lucide-react";

/* ─────────────────────────────────────────
   Easing & Constants
   ───────────────────────────────────────── */

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_SMOOTH = [0.43, 0.13, 0.23, 0.96] as const;
const EMAIL = "furtuna.alexandre@gmail.com";

const SOCIAL_LINKS = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/paulofurtunatoalexandre/", desc: "Professional" },
  { label: "Resume", url: "/paulo-alexandre-resume.pdf", desc: "Download PDF", download: "Paulo_Alexandre_Resume.pdf" },
  { label: "Medium", url: "https://medium.com/@paulo-alexandreuxd", desc: "Writing" },
];

const FOOTER_NAV = [
  { label: "Work", id: "work" },
  { label: "About", id: "about" },
  { label: "Process", id: "process" },
  { label: "Impact", id: "impact" },
  { label: "Reel", id: "reel" },
];

/* ─────────────────────────────────────────
   Ambient Orb — floating light
   ───────────────────────────────────────── */

function AmbientOrb({
  size,
  x,
  y,
  color,
  delay,
  duration,
}: {
  size: number;
  x: string;
  y: string;
  color: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(60px)",
      }}
      animate={{
        y: [0, -30, 10, -20, 0],
        x: [0, 15, -10, 20, 0],
        opacity: [0.3, 0.6, 0.4, 0.7, 0.3],
        scale: [1, 1.15, 0.95, 1.1, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

/* ─────────────────────────────────────────
   Magnetic Letter
   ───────────────────────────────────────── */

function MagneticLetter({
  char,
  delay,
  color,
}: {
  char: string;
  delay: number;
  color?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 16 });
  const springY = useSpring(y, { stiffness: 180, damping: 16 });
  const isInView = useInView(ref, { once: true });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * 0.12);
      y.set((e.clientY - cy) * 0.12);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (char === " ") {
    return <span className="inline-block w-[0.25em]">&nbsp;</span>;
  }

  return (
    <motion.span
      ref={ref}
      className="inline-block cursor-default"
      style={{ x: springX, y: springY, color }}
      initial={{ y: 100, opacity: 0, filter: "blur(8px)" }}
      animate={
        isInView
          ? { y: 0, opacity: 1, filter: "blur(0px)" }
          : {}
      }
      transition={{
        delay,
        duration: 0.9,
        ease: EASE,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.12, color: "#c4ff00" }}
    >
      {char}
    </motion.span>
  );
}

/* ─────────────────────────────────────────
   Premium CTA Button — magnetic + glow
   ───────────────────────────────────────── */

function PremiumCTAButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 18 });
  const springY = useSpring(y, { stiffness: 150, damping: 18 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * 0.18);
      y.set((e.clientY - cy) * 0.18);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setHovered(false);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={`mailto:${EMAIL}`}
      className="relative group inline-flex items-center gap-5 md:gap-6 px-8 md:px-12 py-5 md:py-6"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
    >
      {/* Border — animates on hover */}
      <motion.div
        className="absolute inset-0"
        style={{
          border: "1px solid",
          borderColor: hovered
            ? "rgba(196,255,0,0.6)"
            : "rgba(255,255,255,0.08)",
        }}
        animate={{
          borderColor: hovered
            ? "rgba(196,255,0,0.6)"
            : "rgba(255,255,255,0.08)",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Fill */}
      <motion.div
        className="absolute inset-0 bg-[#c4ff00]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE_SMOOTH }}
        style={{ originX: 0 }}
      />

      {/* Glow */}
      <motion.div
        className="absolute -inset-4 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(196,255,0,0.06) 0%, transparent 70%)",
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Content */}
      <span
        className="relative z-10 text-[0.6875rem] md:text-[0.6875rem] tracking-[0.5em] uppercase transition-colors duration-500"
        style={{
          fontFamily: "var(--font-mono)",
          color: hovered ? "#0a0a0b" : "#e8e6e3",
        }}
      >
        Start a Conversation
      </span>

      <motion.div
        className="relative z-10 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-colors duration-500"
        style={{
          border: `1px solid ${hovered ? "rgba(10,10,11,0.2)" : "rgba(196,255,0,0.2)"}`,
          backgroundColor: hovered ? "rgba(10,10,11,0.1)" : "transparent",
        }}
        animate={{ rotate: hovered ? 45 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <ArrowUpRight
          size={18}
          className="transition-colors duration-500"
          style={{ color: hovered ? "#0a0a0b" : "#c4ff00" }}
        />
      </motion.div>
    </motion.a>
  );
}

/* ─────────────────────────────────────────
   Copy Email Button
   ───────────────────────────────────────── */

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-3 transition-colors duration-300"
    >
      <span
        className="text-[var(--type-body)] tracking-[-0.01em] text-[#8a8a96] group-hover:text-[#c4ff00] transition-colors duration-300"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {EMAIL}
      </span>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={14} className="text-[#c4ff00]" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="group-hover:opacity-100"
          >
            <Copy
              size={12}
              className="text-[#6b6b76] group-hover:text-[#c4ff00] transition-colors duration-300"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ─────────────────────────────────────────
   Social Link — premium hover
   ───────────────────────────────────────── */

function SocialLink({
  label,
  url,
  desc,
  index,
  download,
}: {
  label: string;
  url: string;
  desc: string;
  index: number;
  download?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={url}
      {...(download
        ? { download }
        : { target: "_blank", rel: "noopener noreferrer" })}
      className="group flex items-center justify-between py-4 border-b border-white/[0.03] last:border-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.5, ease: EASE }}
    >
      <div className="flex items-center gap-4">
        {/* Animated dot */}
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          animate={{
            backgroundColor: hovered ? "#c4ff00" : "rgba(107,107,118,0.3)",
            scale: hovered ? 1.5 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <div className="flex flex-col">
          <span
            className="text-[0.8125rem] text-[#8a8a96] group-hover:text-[#e8e6e3] transition-colors duration-300"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {label}
          </span>
          <motion.span
            className="text-[0.6875rem] tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
            animate={{
              color: hovered ? "rgba(196,255,0,0.5)" : "rgba(107,107,118,0.3)",
              y: hovered ? 0 : 2,
              opacity: hovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {desc}
          </motion.span>
        </div>
      </div>

      <motion.div
        animate={{
          x: hovered ? 0 : -6,
          opacity: hovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <ArrowUpRight size={14} className="text-[#c4ff00]" />
      </motion.div>
    </motion.a>
  );
}

/* ─────────────────────────────────────────
   Reveal wrapper
   ───────────────────────────────────────── */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ═════════════════════════════════════════
   MAIN — Contact Section + Footer
   ═════════════════════════════════════════ */

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  // Current time
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/New_York",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const line1 = "LET'S";
  const line2 = "CREATE";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* ═══════════════════════════════════════
         PART 1 — ATMOSPHERIC PRELUDE
         ═══════════════════════════════════════ */}
      <div className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center px-6 md:px-12 lg:px-16 py-32 md:py-48">
        {/* Ambient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <AmbientOrb
            size={400}
            x="20%"
            y="30%"
            color="rgba(196,255,0,0.04)"
            delay={0}
            duration={12}
          />
          <AmbientOrb
            size={300}
            x="65%"
            y="50%"
            color="rgba(196,255,0,0.03)"
            delay={3}
            duration={15}
          />
          <AmbientOrb
            size={200}
            x="80%"
            y="20%"
            color="rgba(232,230,227,0.015)"
            delay={6}
            duration={18}
          />
          <AmbientOrb
            size={150}
            x="10%"
            y="70%"
            color="rgba(196,255,0,0.025)"
            delay={4}
            duration={14}
          />
        </div>

        {/* Radial backdrop */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: overlayOpacity }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(196,255,0,0.02) 0%, transparent 80%)",
            }}
          />
        </motion.div>

        {/* Closing statement */}
        <motion.div style={{ y: bgY }} className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Serif prelude */}
          <motion.span
            className="block text-[clamp(1rem,2vw,1.5rem)] text-[#6b6b76]/30 mb-6"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            A parting thought
          </motion.span>

          <Reveal delay={0.15}>
            <p
              className="text-[clamp(1.3rem,3vw,2.4rem)] leading-[1.4] tracking-[-0.02em] text-[#e8e6e3]/70"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              I believe the best products are{" "}
              <span
                className="text-[#c4ff00]/80"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                quiet acts of empathy
              </span>
              {" "}— invisible craftsmanship that makes someone's day just slightly better. That's the work I care about.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="w-8 h-px bg-[#c4ff00]/20" />
              <span
                className="text-[0.5rem] tracking-[0.6em] uppercase text-[#6b6b76]/40"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Paulo Alexandre
              </span>
              <div className="w-8 h-px bg-[#c4ff00]/20" />
            </div>
          </Reveal>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════
         PART 2 — THE CTA
         ═══════════════════════════════════════ */}
      <div
        ref={ctaRef}
        className="relative px-6 md:px-12 lg:px-16 pt-16 md:pt-24 pb-24 md:pb-40"
      >
        {/* Oversized background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <motion.div
            className="absolute -top-16 -right-8 md:-right-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            <span className="oversized-label block" style={{ opacity: 0.2 }}>
              HELLO
            </span>
          </motion.div>
        </div>

        <div className="relative z-10">
          {/* Serif intro */}
          <motion.span
            className="text-[clamp(0.875rem,1.5vw,1.2rem)] text-[#6b6b76]/30 block mb-2"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Let's build something
          </motion.span>

          <motion.span
            className="type-label text-[#6b6b76]/60 block mb-8 md:mb-12"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            extraordinary together
          </motion.span>

          {/* Line 1 */}
          <div className="overflow-hidden">
            <h2 className="type-mega text-[#e8e6e3]">
              {line1.split("").map((char, i) => (
                <MagneticLetter
                  key={`l1-${i}`}
                  char={char}
                  delay={0.04 * i}
                />
              ))}
            </h2>
          </div>

          {/* Line 2 + CTA button */}
          <div className="overflow-hidden flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
            <h2 className="type-mega">
              {line2.split("").map((char, i) => (
                <MagneticLetter
                  key={`l2-${i}`}
                  char={char}
                  delay={0.04 * (line1.length + i)}
                  color="#c4ff00"
                />
              ))}
            </h2>

            <Reveal delay={0.5} className="mb-3 md:mb-8">
              <PremiumCTAButton />
            </Reveal>
          </div>

          {/* Info row beneath CTA */}
          <div className="mt-12 md:mt-20 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6 md:gap-12">
            <Reveal delay={0.4}>
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-[#c4ff00]/40" />
                <CopyEmail />
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <div className="flex items-center gap-3">
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
                  className="text-[0.6875rem] tracking-[0.4em] uppercase text-[#6b6b76]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Available Q2 2026
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.6}>
              <span
                className="type-label text-[#6b6b76]/40"
              >
                Response within 24hrs
              </span>
            </Reveal>

            <Reveal delay={0.65}>
              <a
                href="/paulo-alexandre-resume.pdf"
                download="Paulo_Alexandre_Resume.pdf"
                className="group flex items-center gap-2"
              >
                <Download size={12} className="text-[#6b6b76]/40 group-hover:text-[#c4ff00] transition-colors duration-300" />
                <span
                  className="text-[0.6875rem] tracking-[0.4em] uppercase text-[#6b6b76]/60 group-hover:text-[#c4ff00] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Download Resume
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
         PART 3 — PREMIUM FOOTER
         ═══════════════════════════════════════ */}
      <footer className="relative border-t border-white/[0.04]">
        {/* Subtle top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(196,255,0,0.15) 50%, transparent 100%)",
          }}
        />

        <div className="px-6 md:px-12 lg:px-16 pt-16 md:pt-24 pb-8">
          {/* Main footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 md:mb-32">
            {/* Col 1 — Brand + blurb */}
            <div className="lg:col-span-4">
              <Reveal>
                <div className="mb-6">
                  <span
                    className="text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.03em] text-[#e8e6e3]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                    }}
                  >
                    P.A.
                  </span>
                  <span
                    className="ml-2 text-[0.875rem] text-[#c4ff00]/30"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                    }}
                  >
                    portfolio
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p
                  className="text-[0.8125rem] leading-[1.7] text-[#6b6b76] max-w-xs mb-8"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Product designer crafting thoughtful digital experiences at the
                  intersection of strategy, aesthetics, and human behaviour.
                  Based in Saint Petersburg, FL — available worldwide.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#c4ff00]/30" />
                  <span
                    className="text-[0.6875rem] tracking-[0.4em] uppercase text-[#3a3a42]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {time} EST — Florida
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Col 2 — Navigation */}
            <div className="lg:col-span-2 lg:col-start-6">
              <Reveal>
                <span
                  className="type-label text-[#6b6b76] block mb-6"
                >
                  Navigate
                </span>
              </Reveal>
              <div className="space-y-3">
                {FOOTER_NAV.map((item, i) => (
                  <Reveal key={item.id} delay={0.05 + i * 0.04}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(item.id);
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="block text-[0.8125rem] text-[#6b6b76]/60 hover:text-[#e8e6e3] transition-colors duration-300"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.label}
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Col 3 — Connect */}
            <div className="lg:col-span-3 lg:col-start-8">
              <Reveal>
                <span
                  className="type-label text-[#6b6b76] block mb-6"
                >
                  Connect
                </span>
              </Reveal>
              <div>
                {SOCIAL_LINKS.map((link, i) => (
                  <SocialLink
                    key={link.label}
                    label={link.label}
                    url={link.url}
                    desc={link.desc}
                    index={i}
                    download={link.download}
                  />
                ))}
              </div>
            </div>

            {/* Col 4 — Colophon */}
            <div className="lg:col-span-2 lg:col-start-11">
              <Reveal>
                <span
                  className="type-label text-[#6b6b76] block mb-6"
                >
                  Colophon
                </span>
              </Reveal>
              <div className="space-y-4">
                {[
                  { label: "Typefaces", value: "Syne, Space Grotesk, JetBrains Mono, Instrument Serif" },
                  { label: "Stack", value: "React, Motion, Tailwind CSS" },
                  { label: "Design", value: "Figma" },
                  { label: "Version", value: "3.0" },
                ].map((item, i) => (
                  <Reveal key={item.label} delay={0.05 + i * 0.04}>
                    <div>
                      <span
                        className="block text-[0.6875rem] tracking-[0.4em] uppercase text-[#3a3a42] mb-1"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="text-[0.6875rem] text-[#6b6b76]/50"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {item.value}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Bottom bar ─── */}
          <div className="border-t border-white/[0.03] pt-6 pb-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Left — copyright + attribution */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <span
                  className="text-[0.5rem] tracking-[0.4em] uppercase text-[#3a3a42]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  &copy; {new Date().getFullYear()} Paulo Alexandre
                </span>
                <div className="w-8 h-px bg-[#c4ff00]/20" />
              </div>

              {/* Right — back to top */}
              <motion.button
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="group flex items-center gap-3"
                whileHover="hover"
              >
                <motion.span
                  className="text-[0.5rem] tracking-[0.4em] uppercase text-[#3a3a42] group-hover:text-[#c4ff00] transition-colors duration-500"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Back to Top
                </motion.span>
                <motion.div
                  className="w-8 h-8 rounded-full border border-white/[0.06] flex items-center justify-center group-hover:border-[#c4ff00]/30 transition-colors duration-500"
                  variants={{ hover: { y: -3 } }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <ArrowUp
                    size={12}
                    className="text-[#3a3a42] group-hover:text-[#c4ff00] transition-colors duration-300"
                  />
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* ─── Signature watermark ─── */}
          <motion.div
            className="mt-12 md:mt-20 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="flex flex-col items-center gap-2">
              <span
                className="text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.04em] text-[#e8e6e3]/[0.03]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                }}
              >
                PAULO ALEXANDRE
              </span>
              <div className="w-6 h-px bg-[#c4ff00]/10" />
            </div>
          </motion.div>
        </div>
      </footer>
    </section>
  );
}
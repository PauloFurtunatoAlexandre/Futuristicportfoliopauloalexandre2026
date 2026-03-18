import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { useIsMobile, useIsDesktop } from "./ui/useMediaQuery";

// Floating UI fragment data
const UI_FRAGMENTS = [
  { id: 1, x: "8%", y: "18%", w: 180, h: 120, delay: 2.2, depth: 0.03 },
  { id: 2, x: "78%", y: "22%", w: 160, h: 100, delay: 2.6, depth: 0.05 },
  { id: 3, x: "85%", y: "65%", w: 140, h: 90, delay: 3.0, depth: 0.04 },
  { id: 4, x: "5%", y: "68%", w: 170, h: 110, delay: 2.8, depth: 0.06 },
];

const ABSTRACT_SHAPES = [
  { id: "s1", x: "15%", y: "30%", size: 8, delay: 1.8, depth: 0.02 },
  { id: "s2", x: "70%", y: "15%", size: 6, delay: 2.0, depth: 0.04 },
  { id: "s3", x: "90%", y: "45%", size: 10, delay: 2.4, depth: 0.03 },
  { id: "s4", x: "25%", y: "80%", size: 5, delay: 2.6, depth: 0.05 },
  { id: "s5", x: "60%", y: "75%", size: 7, delay: 1.6, depth: 0.02 },
  { id: "s6", x: "45%", y: "12%", size: 4, delay: 3.0, depth: 0.06 },
];

const GRID_LINES = Array.from({ length: 8 }, (_, i) => ({
  id: `gl-${i}`,
  position: `${(i + 1) * 12.5}%`,
}));

function FloatingUICard({ fragment, mouseX, mouseY }: {
  fragment: typeof UI_FRAGMENTS[0];
  mouseX: ReturnType<typeof useMotionValue>;
  mouseY: ReturnType<typeof useMotionValue>;
}) {
  const x = useTransform(mouseX, [-0.5, 0.5], [-30 * fragment.depth * 20, 30 * fragment.depth * 20]);
  const y = useTransform(mouseY, [-0.5, 0.5], [-20 * fragment.depth * 20, 20 * fragment.depth * 20]);
  const springX = useSpring(x, { stiffness: 50, damping: 20 });
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ delay: fragment.delay, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ left: fragment.x, top: fragment.y, x: springX, y: springY }}
      className="absolute z-10 hidden lg:block"
    >
      <div
        className="rounded-lg border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
        style={{ width: fragment.w, height: fragment.h }}
      >
        <div className="p-3 flex flex-col h-full justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c4ff00]/60" />
            <div className="h-1 w-12 bg-white/10 rounded-full" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1 w-full bg-white/[0.06] rounded-full" />
            <div className="h-1 w-3/4 bg-white/[0.06] rounded-full" />
            <div className="h-1 w-1/2 bg-white/[0.04] rounded-full" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-12 rounded bg-[#c4ff00]/10 border border-[#c4ff00]/20" />
            <div className="h-4 w-8 rounded bg-white/[0.04]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Reduce parallax intensity on mobile
  const y2 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -60 : -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, isMobile ? 0.97 : 0.92]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.8], [0, isMobile ? 3 : 6]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const bgGradientX = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20]);
  const bgGradientY = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20]);
  const orb1X = useTransform(smoothMouseX, [-0.5, 0.5], [30, -30]);
  const orb1Y = useTransform(smoothMouseY, [-0.5, 0.5], [20, -20]);
  const orb2X = useTransform(smoothMouseX, [-0.5, 0.5], [-40, 40]);
  const orb2Y = useTransform(smoothMouseY, [-0.5, 0.5], [-30, 30]);
  const textLayerX = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);
  const textLayerY = useTransform(smoothMouseY, [-0.5, 0.5], [-5, 5]);

  const [time, setTime] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - left) / width - 0.5);
      mouseY.set((e.clientY - top) / height - 0.5);
    },
    [mouseX, mouseY]
  );

  const staggeredLetters = (text: string, baseDelay: number, isOutline = false) => {
    return text.split("").map((char, i) => (
      <motion.span
        key={`${text}-${i}`}
        initial={{ y: 200, rotateX: 40, opacity: 0 }}
        animate={isReady ? { y: 0, rotateX: 0, opacity: 1 } : {}}
        transition={{
          delay: baseDelay + i * 0.04,
          duration: 1.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="inline-block"
        style={isOutline ? {
          WebkitTextStroke: "1.5px rgba(232,230,227,0.2)",
          color: "transparent",
        } : undefined}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ));
  };

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: isMobile ? "115vh" : "130vh" }}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="sticky top-0 h-screen flex flex-col justify-between overflow-hidden relative"
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 z-50 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Subtle grid lines */}
        <div className="absolute inset-0 z-[1] pointer-events-none hidden lg:block">
          {GRID_LINES.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0 }}
              animate={isReady ? { opacity: 1 } : {}}
              transition={{ delay: 2.5, duration: 2 }}
              className="absolute top-0 bottom-0 w-px bg-white/[0.02]"
              style={{ left: line.position }}
            />
          ))}
        </div>

        {/* Luminous orb 1 */}
        <motion.div
          style={{ x: orb1X, y: orb1Y }}
          className="absolute z-[2] pointer-events-none"
        >
          <motion.div
            className="absolute -top-20 -right-20 w-[700px] h-[700px] rounded-full"
            style={{ right: "5%", top: "5%" }}
            animate={{
              background: [
                "radial-gradient(circle, rgba(196,255,0,0.07) 0%, rgba(196,255,0,0.02) 40%, transparent 70%)",
                "radial-gradient(circle, rgba(196,255,0,0.12) 0%, rgba(196,255,0,0.04) 40%, transparent 70%)",
                "radial-gradient(circle, rgba(196,255,0,0.07) 0%, rgba(196,255,0,0.02) 40%, transparent 70%)",
              ],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Luminous orb 2 */}
        <motion.div
          style={{ x: orb2X, y: orb2Y }}
          className="absolute z-[2] pointer-events-none"
        >
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{ left: "-5%", bottom: "10%" }}
            animate={{
              background: [
                "radial-gradient(circle, rgba(120,80,255,0.04) 0%, transparent 60%)",
                "radial-gradient(circle, rgba(120,80,255,0.08) 0%, transparent 60%)",
                "radial-gradient(circle, rgba(120,80,255,0.04) 0%, transparent 60%)",
              ],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>

        {/* Diagonal accent line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isReady ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ delay: 2.0, duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute z-[3] top-0 left-0 w-full h-full pointer-events-none hidden lg:block"
          style={{ originX: 0 }}
        >
          <div
            className="absolute w-[140%] h-px bg-gradient-to-r from-transparent via-[#c4ff00]/10 to-transparent"
            style={{ top: "35%", left: "-20%", transform: "rotate(-8deg)" }}
          />
        </motion.div>

        {/* Atmospheric gradients */}
        <motion.div
          style={{ x: bgGradientX, y: bgGradientY }}
          className="absolute inset-0 z-[3] pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-transparent to-[#0a0a0b]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/60 via-transparent to-[#0a0a0b]/60" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0a0a0b] to-transparent" />
        </motion.div>

        {/* Floating abstract shapes */}
        {ABSTRACT_SHAPES.map((shape) => (
          <motion.div
            key={shape.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={isReady ? { opacity: 0.4, scale: 1 } : {}}
            transition={{ delay: shape.delay, duration: 1.5, ease: "easeOut" }}
            className="absolute z-[5] pointer-events-none hidden lg:block"
            style={{ left: shape.x, top: shape.y }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20 + shape.size * 3, repeat: Infinity, ease: "linear" }}
              className="border border-white/[0.06]"
              style={{
                width: shape.size * 6,
                height: shape.size * 6,
                borderRadius: shape.size % 2 === 0 ? "50%" : "2px",
              }}
            />
          </motion.div>
        ))}

        {/* Floating UI fragments */}
        {UI_FRAGMENTS.map((fragment) => (
          <FloatingUICard key={fragment.id} fragment={fragment} mouseX={mouseX} mouseY={mouseY} />
        ))}

        {/* ── Top nav bar ── */}
        <motion.nav
          style={{ opacity }}
          className="relative z-20 flex items-center justify-between px-6 md:px-12 lg:px-16 pt-8 md:pt-12"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isReady ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="flex items-center gap-3"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-[#c4ff00]"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="type-label text-[#6b6b76]">
              Available for work
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isReady ? { opacity: 1 } : {}}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="type-label text-[#6b6b76] hidden md:block"
          >
            {time} — Local Time
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isReady ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="flex items-center gap-8"
          >
            {["Work", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="type-label text-[#6b6b76] hover:text-[#c4ff00] transition-colors duration-500 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c4ff00] group-hover:w-full transition-all duration-500" />
              </a>
            ))}
          </motion.div>
        </motion.nav>

        {/* ── Main hero content ── */}
        <motion.div
          style={{
            y: y2,
            scale,
            opacity,
            filter: useTransform(heroBlur, (v) => `blur(${v}px)`),
          }}
          className="relative z-20 flex-1 flex flex-col items-center justify-center px-6"
        >
          {/* Serif prelude — editorial accent */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isReady ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-[clamp(1rem,2vw,1.6rem)] text-[#6b6b76]/60 mb-4"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            Senior Product Designer & Full Stack Builder
          </motion.span>

          {/* Role label line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isReady ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-16 h-px bg-[#c4ff00]/40 mb-10"
          />

          {/* Big name - line 1 */}
          <motion.div style={{ x: textLayerX, y: textLayerY }} className="overflow-hidden">
            <h1
              className="text-[clamp(2.8rem,11vw,14rem)] leading-[0.82] tracking-[-0.045em] text-center text-[#e8e6e3]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                perspective: "600px",
              }}
            >
              {staggeredLetters("PAULO", 0.1)}
            </h1>
          </motion.div>

          {/* Big name - line 2 (outlined) */}
          <motion.div
            style={{
              x: useTransform(smoothMouseX, [-0.5, 0.5], [12, -12]),
              y: useTransform(smoothMouseY, [-0.5, 0.5], [6, -6]),
            }}
            className="overflow-hidden relative"
          >
            <h1
              className="text-[clamp(2.8rem,11vw,14rem)] leading-[0.82] tracking-[-0.045em] text-center"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                perspective: "600px",
              }}
            >
              {staggeredLetters("ALEXANDRE", 0.25, true)}
            </h1>
            {/* Accent underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isReady ? { scaleX: 1 } : {}}
              transition={{ delay: 1.5, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute bottom-[-4px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#c4ff00]/40 to-transparent"
              style={{ originX: 0 }}
            />
          </motion.div>

          {/* Tagline — with better line length */}
          <motion.p
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={isReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ delay: 1.4, duration: 1.2 }}
            className="mt-12 max-w-lg text-center text-[var(--type-caption)] leading-relaxed text-[#6b6b76] tracking-wide"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Translating <span className="text-[#c4ff00]">complex problems</span> into
            intuitive experiences — from user research and design systems to accessible, data-driven products that impact millions.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isReady ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.8, duration: 1 }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-5"
          >
            <motion.a
              href="#work"
              className="group relative px-10 py-4 bg-[#c4ff00] text-[#0a0a0b] overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className="relative z-10 flex items-center gap-3 type-label"
                style={{ color: "#0a0a0b" }}
              >
                View Selected Work
                <motion.svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </span>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </motion.a>

            <motion.a
              href="#contact"
              className="group relative px-10 py-4 border border-white/10 text-[#e8e6e3] hover:border-[#c4ff00]/30 transition-colors duration-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-3 type-label">
                Get in Touch
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[#c4ff00]/60"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
            </motion.a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isReady ? { opacity: 1 } : {}}
            transition={{ delay: 2.5, duration: 1.5 }}
            className="mt-20 flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-8 bg-gradient-to-b from-[#c4ff00]/40 to-transparent"
            />
            <p className="type-label-sm text-[#6b6b76]/50">
              Scroll
            </p>
          </motion.div>
        </motion.div>

        {/* ── Bottom info strip ── */}
        <motion.div
          style={{ opacity }}
          className="relative z-20 flex items-end justify-between px-6 md:px-12 lg:px-16 pb-8 md:pb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isReady ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="flex flex-col gap-3"
          >
            <p className="type-label-sm text-[#c4ff00]/40">
              ©2026
            </p>
            <p
              className="text-[11px] tracking-[0.1em] text-[#6b6b76] max-w-[300px]"
              style={{ fontFamily: "var(--font-mono)", lineHeight: "1.6" }}
            >
              Crafting digital experiences at the intersection of art & technology
            </p>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isReady ? { opacity: 1 } : {}}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="hidden md:flex items-center gap-8"
          >
            {["Dribbble", "Twitter", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="type-label text-[#6b6b76] hover:text-[#c4ff00] transition-colors duration-500"
              >
                {social}
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isReady ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.2, duration: 0.8 }}
          >
            <p
              className="text-[11px] tracking-[0.1em] text-[#6b6b76] hidden md:block"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Based in Saint Petersburg, FL / Remote
            </p>
          </motion.div>
        </motion.div>

        {/* Corner accents */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isReady ? { opacity: 0.25 } : {}}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute top-10 left-10 z-20 w-8 h-8 border-l border-t border-white/8 pointer-events-none hidden lg:block"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isReady ? { opacity: 0.25 } : {}}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute top-10 right-10 z-20 w-8 h-8 border-r border-t border-white/8 pointer-events-none hidden lg:block"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isReady ? { opacity: 0.25 } : {}}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-10 left-10 z-20 w-8 h-8 border-l border-b border-white/8 pointer-events-none hidden lg:block"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isReady ? { opacity: 0.25 } : {}}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-10 right-10 z-20 w-8 h-8 border-r border-b border-white/8 pointer-events-none hidden lg:block"
        />
      </div>
    </section>
  );
}
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useIsMobile } from "./ui/useMediaQuery";

export function FullScreenMoment() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-30%" });
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], isMobile ? [1.1, 1, 1.05] : [1.3, 1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], isMobile ? [40, 0, -40] : [80, 0, -80]);
  const filterBlur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [8, 0, 0, 8]);

  /* Horizontal speed lines — reduced on mobile */
  const speedLine1 = useTransform(scrollYProgress, [0, 1], isMobile ? [-150, 150] : [-400, 400]);
  const speedLine2 = useTransform(scrollYProgress, [0, 1], isMobile ? [100, -100] : [300, -300]);
  const speedLine3 = useTransform(scrollYProgress, [0, 1], isMobile ? [-80, 80] : [-200, 200]);

  const words1 = "The best design doesn't ask you".split(" ");
  const words2 = "to learn it —".split(" ");
  const accentWords = "it already knows you.".split(" ");

  return (
    <section ref={ref} className="relative h-[130vh] overflow-hidden">
      {/* Background image */}
      <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
        <img
          src="https://images.unsplash.com/photo-1673431738089-c4fc9c2e96a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwd29ya3NwYWNlJTIwZGVzayUyMGNvbXB1dGVyfGVufDF8fHx8MTc3MzQwMTk4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Workspace"
          className="w-full h-full object-cover brightness-[0.18]"
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-transparent to-[#0a0a0b]" />
      <div className="absolute inset-0 bg-[#0a0a0b]/30" />

      {/* Horizontal speed lines */}
      <motion.div
        className="absolute top-[30%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c4ff00]/[0.04] to-transparent pointer-events-none"
        style={{ x: speedLine1 }}
      />
      <motion.div
        className="absolute top-[55%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none"
        style={{ x: speedLine2 }}
      />
      <motion.div
        className="absolute top-[75%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c4ff00]/[0.03] to-transparent pointer-events-none"
        style={{ x: speedLine3 }}
      />

      {/* Sticky content area */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        <motion.div
          style={{
            opacity,
            y: textY,
            filter: useTransform(filterBlur, (v) => `blur(${v}px)`),
          }}
          className="relative z-10 flex flex-col items-center px-6 text-center max-w-5xl"
        >
          {/* Label */}
          <motion.span
            className="type-label block mb-10"
            style={{ color: "rgba(196,255,0,0.5)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6 }}
          >
            Design Philosophy
          </motion.span>

          {/* Opening quote — serif accent */}
          <motion.span
            className="text-[clamp(6rem,14vw,12rem)] leading-[0.4] text-[#c4ff00]/[0.06] block mb-4 select-none"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            "
          </motion.span>

          {/* Word-by-word reveal — line 1 */}
          <div className="flex flex-wrap justify-center gap-x-[0.35em] mb-1">
            {words1.map((word, i) => (
              <motion.span
                key={`w1-${i}`}
                className="text-[clamp(1.5rem,4vw,3.5rem)] leading-[1.2] tracking-[-0.025em] text-[#e8e6e3]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: 20, filter: "blur(6px)" }
                }
                transition={{
                  delay: 0.1 + i * 0.06,
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Word-by-word reveal — line 2 */}
          <div className="flex flex-wrap justify-center gap-x-[0.35em] mb-1">
            {words2.map((word, i) => (
              <motion.span
                key={`w2-${i}`}
                className="text-[clamp(1.5rem,4vw,3.5rem)] leading-[1.2] tracking-[-0.025em] text-[#e8e6e3]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: 20, filter: "blur(6px)" }
                }
                transition={{
                  delay: 0.1 + (words1.length + i) * 0.06,
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Accent words */}
          <div className="flex flex-wrap justify-center gap-x-[0.35em]">
            {accentWords.map((word, i) => (
              <motion.span
                key={`accent-${i}`}
                className="text-[clamp(1.5rem,4vw,3.5rem)] leading-[1.2] tracking-[-0.025em] text-[#c4ff00]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: 30, filter: "blur(8px)" }
                }
                transition={{
                  delay: 0.15 + (words1.length + words2.length + i) * 0.08,
                  duration: 0.9,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Closing mark — serif */}
          <motion.span
            className="text-[clamp(6rem,14vw,12rem)] leading-[0.4] text-[#c4ff00]/[0.06] block mt-4 select-none"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ delay: 1, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            "
          </motion.span>

          {/* Attribution */}
          <motion.div
            className="mt-12 flex items-center gap-5"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div
              className="h-px bg-[#c4ff00]/30"
              initial={{ width: 0 }}
              animate={isInView ? { width: 40 } : { width: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            />
            <span className="type-label text-[#6b6b76]">
              P.A.
            </span>
            <motion.div
              className="h-px bg-[#c4ff00]/30"
              initial={{ width: 0 }}
              animate={isInView ? { width: 40 } : { width: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
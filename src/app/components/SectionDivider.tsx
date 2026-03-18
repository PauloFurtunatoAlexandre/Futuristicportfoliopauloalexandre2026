import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useRef } from "react";

export function SectionDivider({ label }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineWidthLeft = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
  const lineWidthRight = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative py-6 md:py-12 px-6 md:px-12 lg:px-16">
      <div className="relative flex items-center gap-0">
        {/* Left line grows right */}
        <motion.div
          style={{ width: lineWidthLeft, opacity }}
          className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-white/[0.04] origin-left"
        />

        {/* Center cluster */}
        {label && (
          <div className="relative flex items-center gap-5 px-8 shrink-0">
            {/* Pulse dot */}
            <motion.div
              className="relative w-2 h-2"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="absolute inset-0 rounded-full bg-[#c4ff00]/60" />
              <motion.div
                className="absolute inset-0 rounded-full bg-[#c4ff00]/20"
                animate={isInView ? { scale: [1, 3, 1], opacity: [0.4, 0, 0.4] } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
            </motion.div>

            <motion.span
              className="type-label text-[#6b6b76] shrink-0"
              initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
              animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {label}
            </motion.span>

            {/* Accent tick */}
            <motion.div
              className="w-5 h-px bg-[#c4ff00]/30"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              style={{ originX: 0 }}
            />
          </div>
        )}

        {/* Right line grows left */}
        <motion.div
          style={{ width: lineWidthRight, opacity }}
          className="h-px bg-gradient-to-l from-transparent via-white/[0.06] to-white/[0.04] origin-right"
        />
      </div>

      {/* Ambient glow behind label */}
      {label && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-20 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(196,255,0,0.025) 0%, transparent 70%)",
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        />
      )}
    </div>
  );
}
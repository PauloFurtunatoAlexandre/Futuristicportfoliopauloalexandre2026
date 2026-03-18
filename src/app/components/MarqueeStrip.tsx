import { useState } from "react";
import { motion } from "motion/react";

function MarqueeWord({ word }: { word: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.span
      className="relative cursor-default select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        className="text-[clamp(1.3rem,3.2vw,2.2rem)] tracking-[-0.015em] inline-block"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        animate={{
          color: hovered ? "#c4ff00" : "#2a2a30",
          scale: hovered ? 1.06 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {word}
      </motion.span>
      {/* Glow behind on hover */}
      <motion.span
        className="absolute inset-0 -inset-x-2 pointer-events-none rounded-full"
        animate={{
          boxShadow: hovered
            ? "0 0 30px 6px rgba(196,255,0,0.08)"
            : "0 0 0px 0px transparent",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.span>
  );
}

export function MarqueeStrip({
  items,
  direction = "left",
  speed = 30,
}: {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
}) {
  const doubled = [...items, ...items, ...items];
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="overflow-hidden py-10 md:py-14 border-t border-b border-white/[0.03] relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="marquee"
      aria-label="Skills and expertise"
    >
      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0b] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0b] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex items-center gap-14 whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-33.333%"] : ["-33.333%", "0%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: isPaused ? speed * 3 : speed,
            ease: "linear",
          },
        }}
      >
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-14">
            <MarqueeWord word={item} />
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              animate={{
                backgroundColor: isPaused
                  ? "rgba(196,255,0,0.35)"
                  : "rgba(196,255,0,0.12)",
              }}
              transition={{ duration: 0.4 }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
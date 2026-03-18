import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function NotFoundPage() {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  };

  return (
    <div
      className="w-full min-h-screen bg-[#0a0a0b] text-[#e8e6e3] overflow-hidden relative flex flex-col items-center justify-center"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      onMouseMove={handleMouseMove}
    >
      {/* Grain */}
      <div className="grain-overlay" />

      {/* Ambient glow following mouse */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(circle, rgba(196,255,0,0.03) 0%, transparent 60%)",
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Oversized 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isReady ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: EASE }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.span
          className="text-[clamp(8rem,30vw,22rem)] leading-[0.8] tracking-[-0.06em] select-none"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            WebkitTextStroke: "1.5px rgba(196,255,0,0.12)",
            color: "transparent",
          }}
          initial={{ y: 60, filter: "blur(12px)" }}
          animate={isReady ? { y: 0, filter: "blur(0px)" } : {}}
          transition={{ delay: 0.1, duration: 1, ease: EASE }}
        >
          404
        </motion.span>

        {/* Serif accent */}
        <motion.span
          className="text-[clamp(1rem,2.5vw,1.8rem)] text-[#6b6b76]/40 mt-4"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic" }}
          initial={{ opacity: 0, y: 20 }}
          animate={isReady ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          This page doesn't exist
        </motion.span>

        {/* Divider */}
        <motion.div
          className="w-12 h-px bg-[#c4ff00]/30 mt-8 mb-8"
          initial={{ scaleX: 0 }}
          animate={isReady ? { scaleX: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{ originX: 0.5 }}
        />

        {/* Description */}
        <motion.p
          className="text-[13px] leading-[1.7] text-[#6b6b76] text-center max-w-sm mb-12"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          initial={{ opacity: 0, y: 15 }}
          animate={isReady ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          The page you're looking for has either moved, been removed,
          or never existed in the first place. Let's get you back on track.
        </motion.p>

        {/* CTA */}
        <motion.button
          onClick={() => navigate("/")}
          className="group relative flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isReady ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.7 }}
          whileHover="hover"
        >
          <motion.div
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#c4ff00]/40 transition-colors duration-500"
            variants={{ hover: { scale: 1.05 } }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft
              size={16}
              className="text-[#6b6b76] group-hover:text-[#c4ff00] transition-colors duration-300"
            />
          </motion.div>
          <div className="relative px-6 py-3 overflow-hidden border border-white/[0.08] group-hover:border-[#c4ff00]/30 transition-colors duration-500">
            <span
              className="relative z-10 text-[10px] tracking-[0.35em] uppercase text-[#6b6b76] group-hover:text-[#e8e6e3] transition-colors duration-500"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Back to Portfolio
            </span>
          </div>
        </motion.button>
      </motion.div>

      {/* Corner accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 0.15 } : {}}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute top-8 left-8 w-6 h-6 border-l border-t border-white/10 pointer-events-none hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 0.15 } : {}}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute top-8 right-8 w-6 h-6 border-r border-t border-white/10 pointer-events-none hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 0.15 } : {}}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-8 w-6 h-6 border-l border-b border-white/10 pointer-events-none hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 0.15 } : {}}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 right-8 w-6 h-6 border-r border-b border-white/10 pointer-events-none hidden lg:block"
      />

      {/* Bottom info */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div className="w-1 h-1 rounded-full bg-[#c4ff00]/30" />
        <span
          className="text-[8px] tracking-[0.5em] uppercase text-[#3a3a42]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          P.A. — Portfolio 2026
        </span>
        <div className="w-1 h-1 rounded-full bg-[#c4ff00]/30" />
      </motion.div>
    </div>
  );
}
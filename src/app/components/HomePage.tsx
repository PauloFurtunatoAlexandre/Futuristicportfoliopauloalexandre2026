import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HeroSection } from "./HeroSection";
import { SectionDivider } from "./SectionDivider";
import { SelectedWorks } from "./SelectedWorks";
import { EditorialAbout } from "./EditorialAbout";
import { MarqueeStrip } from "./MarqueeStrip";
import { ProcessSection } from "./ProcessSection";
import { ImpactSection } from "./ImpactSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { ContactSection } from "./ContactSection";
import { CustomCursor } from "./CustomCursor";
import { FloatingNav } from "./FloatingNav";

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "complete">("loading");

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhase("complete");
            setTimeout(onComplete, 600);
            return 100;
          }
          // Smoother, more organic progress — fast start, slow middle, fast end
          const speed = prev < 30 ? 12 : prev < 70 ? 4 : prev < 90 ? 8 : 15;
          return Math.min(100, prev + Math.random() * speed + 2);
        });
      }, 100);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0a0a0b] flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Subtle ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "complete" ? 0.8 : 0.3 }}
        transition={{ duration: 1.5 }}
        style={{
          background: "radial-gradient(ellipse 40% 40% at 50% 50%, rgba(196,255,0,0.02) 0%, transparent 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center relative z-10"
      >
        {/* Serif accent for loading */}
        <motion.span
          className="text-[clamp(1.4rem,3vw,2.2rem)] text-[#e8e6e3]/40 mb-2"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          animate={{ opacity: phase === "complete" ? 0.8 : 0.4 }}
          transition={{ duration: 0.6 }}
        >
          Portfolio
        </motion.span>
        <motion.span
          className="text-[clamp(2rem,5vw,4rem)] tracking-[-0.05em] text-[#e8e6e3] mb-12"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          animate={{ 
            letterSpacing: phase === "complete" ? "-0.02em" : "-0.05em",
          }}
          transition={{ duration: 0.8 }}
        >
          P.A.
        </motion.span>

        {/* Progress bar */}
        <div className="w-48 h-px bg-white/[0.06] relative overflow-hidden">
          <motion.div
            className="h-full bg-[#c4ff00]"
            style={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
        </div>

        {/* Counter */}
        <motion.span
          className="mt-5 type-label-sm text-[#6b6b76]"
          animate={{ color: phase === "complete" ? "#c4ff00" : "#6b6b76" }}
          transition={{ duration: 0.4 }}
        >
          {String(Math.min(Math.floor(progress), 100)).padStart(3, "0")}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

export function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className="w-full min-h-screen bg-[#0a0a0b] text-[#e8e6e3] overflow-x-hidden relative"
      style={{ fontFamily: "var(--font-body)", position: "relative" }}
    >
      {/* Skip to content — accessibility */}
      <a href="#work" className="skip-to-content">
        Skip to content
      </a>

      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Persistent grain texture — consolidated class */}
      <div className="grain-overlay" />

      <motion.main
        id="main-content"
        className="relative"
        style={{ position: "relative" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <HeroSection />

        <SectionDivider label="Selected Works" />

        <SelectedWorks />

        <MarqueeStrip
          items={[
            "PRODUCT DESIGN",
            "CREATIVE DIRECTION",
            "INTERACTION DESIGN",
            "BRAND SYSTEMS",
            "DESIGN STRATEGY",
            "SPATIAL COMPUTING",
            "MOTION DESIGN",
          ]}
          direction="left"
          speed={40}
        />

        <SectionDivider label="About" />

        <EditorialAbout />

        <MarqueeStrip
          items={[
            "FIGMA",
            "FRAMER",
            "AFTER EFFECTS",
            "BLENDER",
            "SWIFT UI",
            "REACT",
            "THREE.JS",
            "WEBGL",
          ]}
          direction="right"
          speed={35}
        />

        <SectionDivider label="Process" />

        <ProcessSection />

        <SectionDivider label="Impact" />

        <ImpactSection />

        <SectionDivider label="Testimonials" />

        <TestimonialsSection />

        <SectionDivider label="Get in Touch" />

        <ContactSection />
      </motion.main>

      <CustomCursor />
      <FloatingNav />
    </div>
  );
}
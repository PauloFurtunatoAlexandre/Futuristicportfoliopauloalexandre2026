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
import { useIsMobile } from "./ui/useMediaQuery";

/* ─────────────────────────────────────────
   Constants
   ───────────────────────────────────────── */

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/* ─────────────────────────────────────────
   Data
   ───────────────────────────────────────── */

const HERO_REEL = {
  poster:
    "https://images.unsplash.com/photo-1765496052099-6dc0f4fa1eb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBnZW9tZXRyaWMlMjBtb3Rpb24lMjBibHVyfGVufDF8fHx8MTc3MzQxODgzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  title: "2025 Design Reel",
  duration: "2:48",
  description:
    "A curated collection of product work, interaction design, and visual systems — spanning fintech, spatial computing, AI tools, and brand design.",
};

const PROJECT_VIDEOS = [
  {
    id: "meridian",
    poster:
      "https://images.unsplash.com/photo-1587803537744-c6d63897f2cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwcHJvZHVjdCUyMGludGVyZmFjZSUyMG1vYmlsZSUyMGFwcCUyMHNjcmVlbnxlbnwxfHx8fDE3NzM0MTg4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Meridian",
    subtitle: "Product Walkthrough",
    duration: "1:34",
    category: "PRODUCT DEMO",
    description:
      "End-to-end onboarding redesign for Meridian Financial — from identity verification through first transaction, reducing drop-off by 67%.",
  },
  {
    id: "void",
    poster:
      "https://images.unsplash.com/photo-1760931969401-9bd6ee902798?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZGlnaXRhbCUyMGFydCUyMGZ1dHVyaXN0aWMlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzczNDE4ODM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "VOID",
    subtitle: "Spatial Interface Demo",
    duration: "2:12",
    category: "PROTOTYPE DEMO",
    description:
      "Gesture-first spatial computing interface for mixed reality — demonstrating volumetric navigation and contextual layering in 3D space.",
  },
  {
    id: "aether",
    poster:
      "https://images.unsplash.com/photo-1672957582204-b1972c5a7c91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbWluaW1hbCUyMFVJJTIwZGFzaGJvYXJkJTIwZGVzaWdufGVufDF8fHx8MTc3MzQxODgzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "AETHER",
    subtitle: "AI Tool Prototype",
    duration: "1:58",
    category: "CASE STUDY REEL",
    description:
      "AI-powered design assistant showcasing progressive complexity — from smart defaults to full manual override, adapting to user expertise level.",
  },
  {
    id: "forma",
    poster:
      "https://images.unsplash.com/photo-1610736311554-fc17d5c43de8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZGVza3RvcCUyMHdvcmtzcGFjZSUyMGNyZWF0aXZlJTIwdG9vbHN8ZW58MXx8fHwxNzczNDE4ODM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "FORMA",
    subtitle: "Design System Motion",
    duration: "0:52",
    category: "MOTION DESIGN",
    description:
      "Comprehensive motion language for FORMA's component library — establishing easing curves, choreography principles, and state transition patterns.",
  },
];

const MICRO_INTERACTIONS = [
  {
    poster:
      "https://images.unsplash.com/photo-1587803537744-c6d63897f2cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwcHJvZHVjdCUyMGludGVyZmFjZSUyMG1vYmlsZSUyMGFwcCUyMHNjcmVlbnxlbnwxfHx8fDE3NzM0MTg4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    label: "Pull-to-Refresh",
    detail: "Custom spring physics with haptic feedback sync — 220ms total cycle",
    project: "Meridian",
  },
  {
    poster:
      "https://images.unsplash.com/photo-1760931969401-9bd6ee902798?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZGlnaXRhbCUyMGFydCUyMGZ1dHVyaXN0aWMlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzczNDE4ODM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    label: "Spatial Pinch-Zoom",
    detail: "Multi-axis scaling with momentum decay — gesture-driven, 60fps",
    project: "VOID",
  },
  {
    poster:
      "https://images.unsplash.com/photo-1672957582204-b1972c5a7c91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbWluaW1hbCUyMFVJJTIwZGFzaGJvYXJkJTIwZGVzaWdufGVufDF8fHx8MTc3MzQxODgzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    label: "AI Response Shimmer",
    detail: "Gradient sweep animation during inference — perceived latency reduced 40%",
    project: "AETHER",
  },
  {
    poster:
      "https://images.unsplash.com/photo-1610736311554-fc17d5c43de8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZGVza3RvcCUyMHdvcmtzcGFjZSUyMGNyZWF0aXZlJTIwdG9vbHN8ZW58MXx8fHwxNzczNDE4ODM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    label: "Toggle State Machine",
    detail: "Layout animation with color morph — interruption-safe transitions",
    project: "FORMA",
  },
  {
    poster:
      "https://images.unsplash.com/photo-1669811247691-f59af80a9974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbWluaW1hbCUyMDNEJTIwcmVuZGVyaW5nJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzczNDE4ODM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    label: "Card Stack Dismiss",
    detail: "Inertia-based swipe with spring-back — custom gesture recognizer",
    project: "LUXE",
  },
  {
    poster:
      "https://images.unsplash.com/photo-1765496052099-6dc0f4fa1eb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBnZW9tZXRyaWMlMjBtb3Rpb24lMjBibHVyfGVufDF8fHx8MTc3MzQxODgzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    label: "Page Transition Morph",
    detail: "Shared-element transition with blur dissolve — 400ms orchestrated",
    project: "SYNTH",
  },
];

const STICKY_ANNOTATIONS = [
  {
    time: "0:00",
    title: "Problem Context",
    body: "The legacy onboarding flow had 12 discrete steps across 8 screens. Users were forced to context-switch between the app and their email for verification — causing a 40% abandonment rate at step 3.",
  },
  {
    time: "0:18",
    title: "Progressive Disclosure",
    body: "We collapsed the 12 steps into 4 progressive stages. Each stage adapts based on prior input — if you connect a bank via Plaid, we skip manual entry entirely. The interface breathes with the user's pace.",
  },
  {
    time: "0:36",
    title: "Trust Architecture",
    body: "Security indicators are embedded contextually rather than bolted on. The biometric prompt uses a custom animation that echoes the brand's motion language, turning a friction point into a moment of delight.",
  },
  {
    time: "0:52",
    title: "Micro-Interaction Layer",
    body: "Every state transition is choreographed. Success confirmations use a radial pulse that matches the haptic feedback timing (220ms). Loading states feature branded skeleton screens instead of generic spinners.",
  },
  {
    time: "1:12",
    title: "First-Value Moment",
    body: "The onboarding culminates in a personalized dashboard reveal — an orchestrated animation that introduces each module sequentially, creating a cinematic 'curtain rise' that makes the first interaction feel curated.",
  },
];

/* ─────────────────────────────────────────
   Reveal Wrapper
   ───────────────────────────────────────── */

function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Play Button — reusable cinematic play icon
   ───────────────────────────────────────── */

function PlayButton({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/20"
        whileHover={{ borderColor: "rgba(196,255,0,0.4)", scale: 1.08 }}
        transition={{ duration: 0.4 }}
      />
      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[#c4ff00]/10"
        animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Background */}
      <div className="absolute inset-[2px] rounded-full bg-[#0a0a0b]/80 backdrop-blur-sm" />
      {/* Triangle */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="absolute inset-0 w-full h-full p-[38%]"
      >
        <path
          d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28a1 1 0 00-1.5.86z"
          fill="#c4ff00"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   Video Frame — poster with play state
   Simulates video with animated poster
   ───────────────────────────────────────── */

function VideoFrame({
  poster,
  isPlaying,
  onPlay,
  onPause,
  aspectRatio = "16/9",
  children,
  className = "",
}: {
  poster: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  aspectRatio?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      style={{ aspectRatio }}
    >
      {/* Poster image */}
      <motion.img
        src={poster}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        animate={{
          scale: isPlaying ? 1.04 : 1,
          filter: isPlaying
            ? "brightness(0.35) saturate(1.15)"
            : "brightness(0.3) saturate(0.85)",
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Simulated video playback overlay — animated scanlines + glow */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Moving scanline */}
            <motion.div
              className="absolute left-0 right-0 h-px bg-[#c4ff00]/[0.06]"
              animate={{ top: ["-2%", "102%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,11,0.7) 100%)",
              }}
            />
            {/* Corner timecode */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#c4ff00]"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span
                className="text-[0.5rem] tracking-[0.3em] text-[#c4ff00]/60 tabular-nums"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                REC
              </span>
            </div>
            {/* Waveform bars — bottom */}
            <div className="absolute bottom-4 left-4 flex items-end gap-[2px] h-3">
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-[2px] bg-[#c4ff00]/30 rounded-full"
                  animate={{
                    height: [
                      `${30 + Math.random() * 70}%`,
                      `${20 + Math.random() * 80}%`,
                      `${30 + Math.random() * 70}%`,
                    ],
                  }}
                  transition={{
                    duration: 0.6 + Math.random() * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-[#0a0a0b]/30 z-[5]" />

      {/* Border */}
      <motion.div
        className="absolute inset-0 border z-20 pointer-events-none"
        animate={{
          borderColor: isPlaying
            ? "rgba(196,255,0,0.12)"
            : "rgba(255,255,255,0.04)",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Custom children (play button, info overlays etc) */}
      <div className="absolute inset-0 z-30">{children}</div>

      {/* Click handler */}
      <button
        className="absolute inset-0 z-40 cursor-pointer"
        onClick={isPlaying ? onPause : onPlay}
        aria-label={isPlaying ? "Pause video" : "Play video"}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Lightbox Modal
   ───────────────────────────────────────── */

function Lightbox({
  isOpen,
  onClose,
  poster,
  title,
  subtitle,
  duration,
  description,
}: {
  isOpen: boolean;
  onClose: () => void;
  poster: string;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
}) {
  // Close on escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#0a0a0b]/95 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 w-full max-w-5xl mx-6"
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 flex items-center gap-2 group"
            >
              <span
                className="text-[0.5rem] tracking-[0.5em] text-[#6b6b76] group-hover:text-[#c4ff00] transition-colors duration-300"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                CLOSE
              </span>
              <div className="w-6 h-6 border border-white/10 group-hover:border-[#c4ff00]/30 rounded-full flex items-center justify-center transition-colors duration-300">
                <span className="text-[10px] text-[#6b6b76] group-hover:text-[#c4ff00] transition-colors duration-300">
                  ✕
                </span>
              </div>
            </button>

            {/* Video container */}
            <div className="relative aspect-video overflow-hidden border border-white/[0.06]">
              <img
                src={poster}
                alt={title}
                className="w-full h-full object-cover brightness-[0.35] saturate-110"
              />

              {/* Simulated playback UI */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Animated scanline */}
                <motion.div
                  className="absolute left-0 right-0 h-px bg-[#c4ff00]/[0.04]"
                  animate={{ top: ["-2%", "102%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                {/* Center play indicator */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
                >
                  <PlayButton size={80} />
                </motion.div>

                {/* Waveform */}
                <motion.div
                  className="absolute bottom-6 left-6 right-6 flex items-end gap-[1px] h-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {Array.from({ length: 64 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-[#c4ff00]/20 rounded-full"
                      animate={{
                        height: [
                          `${20 + Math.random() * 80}%`,
                          `${10 + Math.random() * 90}%`,
                          `${20 + Math.random() * 80}%`,
                        ],
                      }}
                      transition={{
                        duration: 0.8 + Math.random() * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.02,
                      }}
                    />
                  ))}
                </motion.div>

                {/* REC indicator */}
                <div className="absolute top-5 right-5 flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#c4ff00]"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <span
                    className="text-[0.5rem] tracking-[0.3em] text-[#c4ff00]/50 tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    PLAYING
                  </span>
                </div>
              </div>

              {/* Vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,11,0.6) 100%)",
                }}
              />
            </div>

            {/* Info bar */}
            <motion.div
              className="mt-5 flex items-start justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div>
                <span
                  className="text-[clamp(1rem,2vw,1.4rem)] tracking-[-0.02em] text-[#e8e6e3] block"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  {title}
                </span>
                <span
                  className="text-[0.8125rem] text-[#6b6b76] block mt-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {subtitle}
                </span>
                <p
                  className="text-[0.8125rem] text-[#6b6b76]/60 max-w-xl mt-3 leading-[1.6]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {description}
                </p>
              </div>
              <span
                className="text-[0.5rem] tracking-[0.4em] text-[#3a3a42] tabular-nums shrink-0 mt-2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {duration}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   Hover Preview Card — grid items
   ───────────────────────────────────────── */

function HoverVideoCard({
  video,
  index,
  onExpand,
}: {
  video: (typeof PROJECT_VIDEOS)[0];
  index: number;
  onExpand: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 200, damping: 25 });
  const springY = useSpring(my, { stiffness: 200, damping: 25 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 8);
      my.set(((e.clientY - r.top) / r.height - 0.5) * 6);
    },
    [mx, my]
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: EASE }}
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHovered(false);
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div style={{ x: springX, y: springY }}>
        {/* Video thumbnail */}
        <div
          className="relative overflow-hidden border border-white/[0.04] group-hover:border-[#c4ff00]/[0.12] transition-colors duration-700 cursor-pointer"
          style={{ aspectRatio: "16/10" }}
          onClick={onExpand}
        >
          <motion.img
            src={video.poster}
            alt={video.title}
            className="w-full h-full object-cover"
            animate={{
              scale: hovered ? 1.06 : 1,
              filter: hovered
                ? "brightness(0.4) saturate(1.1)"
                : "brightness(0.25) saturate(0.8)",
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/30 to-transparent" />

          {/* Simulated playback on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Scanline */}
                <motion.div
                  className="absolute left-0 right-0 h-px bg-[#c4ff00]/[0.06]"
                  animate={{ top: ["-2%", "102%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                {/* Mini waveform */}
                <div className="absolute bottom-3 left-3 flex items-end gap-[1px] h-2.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-[2px] bg-[#c4ff00]/30 rounded-full"
                      animate={{
                        height: [`${30 + Math.random() * 70}%`, `${20 + Math.random() * 80}%`],
                      }}
                      transition={{
                        duration: 0.5 + Math.random() * 0.3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.04,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center play button */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              animate={{ scale: hovered ? 1 : 0.8, opacity: hovered ? 1 : 0.5 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <PlayButton size={48} />
            </motion.div>
          </div>

          {/* Category badge */}
          <div className="absolute top-4 left-4 z-10">
            <motion.span
              className="text-[0.45rem] tracking-[0.5em] uppercase px-2.5 py-1.5 border"
              style={{
                fontFamily: "var(--font-mono)",
                background: "rgba(10,10,11,0.7)",
                backdropFilter: "blur(8px)",
              }}
              animate={{
                borderColor: hovered ? "rgba(196,255,0,0.2)" : "rgba(255,255,255,0.06)",
                color: hovered ? "#c4ff00" : "#6b6b76",
              }}
              transition={{ duration: 0.3 }}
            >
              {video.category}
            </motion.span>
          </div>

          {/* Duration */}
          <div className="absolute top-4 right-4 z-10">
            <span
              className="text-[0.5rem] tracking-[0.3em] text-[#6b6b76] tabular-nums"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {video.duration}
            </span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <span
              className="text-[clamp(1rem,1.8vw,1.3rem)] tracking-[-0.02em] text-[#e8e6e3] block"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.1 }}
            >
              {video.title}
            </span>
            <motion.span
              className="text-[0.75rem] text-[#6b6b76] block mt-1"
              style={{ fontFamily: "var(--font-body)" }}
              animate={{ opacity: hovered ? 1 : 0.6 }}
            >
              {video.subtitle}
            </motion.span>
          </div>

          {/* Hover border glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            animate={{
              boxShadow: hovered
                ? "inset 0 0 60px -15px rgba(196,255,0,0.05)"
                : "inset 0 0 0px 0px rgba(0,0,0,0)",
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Description — below card */}
        <motion.p
          className="mt-4 text-[0.75rem] text-[#6b6b76]/60 leading-[1.6] max-w-sm"
          style={{ fontFamily: "var(--font-body)" }}
          animate={{ opacity: hovered ? 0.8 : 0.4 }}
          transition={{ duration: 0.3 }}
        >
          {video.description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Micro Interaction Card — small inline loops
   ───────────────────────────────────────── */

function MicroCard({
  item,
  index,
}: {
  item: (typeof MICRO_INTERACTIONS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden border border-white/[0.04] group-hover:border-[#c4ff00]/[0.1] transition-colors duration-500 mb-4">
        <motion.img
          src={item.poster}
          alt={item.label}
          className="w-full h-full object-cover"
          animate={{
            scale: hovered ? 1.08 : 1,
            filter: hovered
              ? "brightness(0.45) saturate(1.1)"
              : "brightness(0.2) saturate(0.7)",
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Loop indicator on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Circular progress */}
              <svg width="40" height="40" viewBox="0 0 40 40" className="rotate-[-90deg]">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                  fill="none"
                />
                <motion.circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="#c4ff00"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 16}
                  animate={{
                    strokeDashoffset: [2 * Math.PI * 16, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </svg>
              <span
                className="absolute text-[0.45rem] tracking-[0.3em] text-[#c4ff00]/60"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                LOOP
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project tag */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className="text-[0.4rem] tracking-[0.4em] uppercase text-[#3a3a42]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {item.project}
          </span>
        </div>
      </div>

      {/* Label */}
      <span
        className="text-[0.6875rem] tracking-[-0.01em] text-[#e8e6e3] block mb-1 group-hover:text-[#c4ff00] transition-colors duration-300"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, lineHeight: 1.2 }}
      >
        {item.label}
      </span>
      <span
        className="text-[0.6875rem] text-[#6b6b76]/50 leading-[1.5] block"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {item.detail}
      </span>
    </motion.div>
  );
}

/* ═════════════════════════════════════════
   MAIN — VideoShowcase
   ═════════════════════════════════════════ */

export function VideoShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const oversizedY = useTransform(scrollYProgress, [0, 1], isMobile ? [20, -30] : [60, -100]);

  const [heroPlaying, setHeroPlaying] = useState(false);
  const [lightbox, setLightbox] = useState<null | (typeof PROJECT_VIDEOS)[0]>(null);

  /* Sticky section scroll */
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stickyProgress } = useScroll({
    target: stickyRef,
    offset: ["start start", "end end"],
  });
  const [activeAnnotation, setActiveAnnotation] = useState(0);

  // Derive sticky progress width as a motion value
  const stickyProgressWidth = useTransform(stickyProgress, [0, 1], ["0%", "100%"]);

  // Track which annotation is active based on scroll
  useEffect(() => {
    const unsub = stickyProgress.on("change", (v) => {
      const idx = Math.min(
        STICKY_ANNOTATIONS.length - 1,
        Math.floor(v * STICKY_ANNOTATIONS.length)
      );
      if (idx >= 0) setActiveAnnotation(idx);
    });
    return unsub;
  }, [stickyProgress]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" id="reel">
      {/* ═══ CH.1 — HERO DESIGN REEL ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 pt-32 md:pt-48 pb-24 md:pb-36">
        {/* Oversized bg */}
        <motion.div
          style={{ y: oversizedY }}
          className="absolute top-6 md:top-12 left-0 right-0 pointer-events-none select-none z-0 overflow-hidden"
        >
          <span className="oversized-label block text-right pr-[5%]">
            REEL
          </span>
        </motion.div>

        {/* Header */}
        <div className="relative z-10 max-w-4xl mb-16 md:mb-24">
          <Reveal>
            <span className="type-label text-[#6b6b76] block mb-8">
              In Motion
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="text-[clamp(2rem,4.5vw,4rem)] tracking-[-0.035em] text-[#e8e6e3] mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                lineHeight: 0.95,
              }}
            >
              Design is a{" "}
              <span
                style={{
                  WebkitTextStroke: "1.5px rgba(232,230,227,0.2)",
                  color: "transparent",
                }}
              >
                temporal
              </span>
              <br />
              medium
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              className="text-[var(--type-body)] leading-[1.85] text-[#6b6b76] max-w-[var(--max-prose)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Static mockups tell half the story. These recordings capture what
              matters most — the transitions, the timing, the moment-to-moment
              experience of using something I've designed.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <span
              className="text-[clamp(0.85rem,1.2vw,1rem)] text-[#c4ff00]/30 block mt-4"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              — because motion reveals intent
            </span>
          </Reveal>
        </div>

        {/* Hero video */}
        <Reveal delay={0.2} className="relative z-10">
          <VideoFrame
            poster={HERO_REEL.poster}
            isPlaying={heroPlaying}
            onPlay={() => setHeroPlaying(true)}
            onPause={() => setHeroPlaying(false)}
            aspectRatio="21/9"
          >
            {/* Center play */}
            {!heroPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
                >
                  <PlayButton size={72} />
                </motion.div>
                <motion.span
                  className="mt-5 text-[0.5rem] tracking-[0.5em] text-[#6b6b76]"
                  style={{ fontFamily: "var(--font-mono)" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  {HERO_REEL.title} — {HERO_REEL.duration}
                </motion.span>
              </div>
            )}

            {/* Playing state — pause indicator */}
            {heroPlaying && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-8 bg-[#e8e6e3]/80 rounded-sm" />
                  <div className="w-3 h-8 bg-[#e8e6e3]/80 rounded-sm" />
                </div>
              </div>
            )}

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-4 flex items-end justify-between pointer-events-none">
              <div>
                <span
                  className="text-[clamp(0.9rem,1.5vw,1.2rem)] tracking-[-0.01em] text-[#e8e6e3] block"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  {HERO_REEL.title}
                </span>
                <span
                  className="text-[0.75rem] text-[#6b6b76] block mt-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {HERO_REEL.description}
                </span>
              </div>

              {/* Progress simulation */}
              {heroPlaying && (
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-24 h-px bg-white/[0.06] relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-[#c4ff00]/50"
                      animate={{ width: ["0%", "100%"] }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <span
                    className="text-[0.45rem] tracking-[0.3em] text-[#3a3a42] tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {HERO_REEL.duration}
                  </span>
                </motion.div>
              )}
            </div>
          </VideoFrame>
        </Reveal>
      </div>

      {/* Divider */}
      <div className="editorial-rule mx-6 md:mx-12 lg:mx-16" />

      {/* ═══ CH.2 — PROJECT VIDEO GRID ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 py-32 md:py-48">
        <div className="relative z-10 max-w-3xl mb-16 md:mb-24">
          <Reveal>
            <span className="type-label text-[#6b6b76] block mb-8">
              Project Walkthroughs
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="text-[clamp(1.6rem,3.5vw,3rem)] tracking-[-0.03em] text-[#e8e6e3] mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1 }}
            >
              Watch the{" "}
              <span
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                className="text-[#c4ff00]/60"
              >
                experience
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              className="text-[var(--type-body)] leading-[1.85] text-[#6b6b76] max-w-[var(--max-prose)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Hover to preview. Click to expand. Each recording captures the
              designed flow as a user would experience it — no narration, just
              the product speaking for itself.
            </p>
          </Reveal>
        </div>

        {/* Grid — 2×2 */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {PROJECT_VIDEOS.map((v, i) => (
            <HoverVideoCard
              key={v.id}
              video={v}
              index={i}
              onExpand={() => setLightbox(v)}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="editorial-rule mx-6 md:mx-12 lg:mx-16" />

      {/* ═══ CH.3 — STICKY VIDEO + SCROLLING ANNOTATIONS ═══ */}
      <div
        ref={stickyRef}
        className="relative"
        style={{ height: isMobile ? `${STICKY_ANNOTATIONS.length * 70 + 30}vh` : `${STICKY_ANNOTATIONS.length * 100 + 50}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Sticky video */}
            <div className="lg:col-span-7 relative hidden lg:block">
              <div className="absolute inset-0 flex items-center p-12 pr-6">
                <div className="w-full relative overflow-hidden border border-white/[0.04]" style={{ aspectRatio: "16/10" }}>
                  <img
                    src={PROJECT_VIDEOS[0].poster}
                    alt="Meridian walkthrough"
                    className="w-full h-full object-cover brightness-[0.3] saturate-[0.9]"
                  />

                  {/* Animated elements */}
                  <motion.div
                    className="absolute left-0 right-0 h-px bg-[#c4ff00]/[0.04]"
                    animate={{ top: ["-2%", "102%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Time marker — synced to scroll */}
                  <div className="absolute top-4 left-4 flex items-center gap-3">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-[#c4ff00]"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={activeAnnotation}
                        className="text-[0.5rem] tracking-[0.3em] text-[#c4ff00]/50 tabular-nums"
                        style={{ fontFamily: "var(--font-mono)" }}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.3 }}
                      >
                        {STICKY_ANNOTATIONS[activeAnnotation].time}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.04]">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#c4ff00]/60 to-[#c4ff00]/20"
                      style={{
                        width: stickyProgressWidth,
                      }}
                    />
                  </div>

                  {/* Vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,11,0.5) 100%)",
                    }}
                  />

                  {/* Chapter label overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={activeAnnotation}
                        className="text-[0.5rem] tracking-[0.5em] uppercase text-[#6b6b76]/40"
                        style={{ fontFamily: "var(--font-mono)" }}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.4 }}
                      >
                        CHAPTER {String(activeAnnotation + 1).padStart(2, "0")} — {STICKY_ANNOTATIONS[activeAnnotation].title}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Scrolling annotations */}
            <div className="lg:col-span-5 flex items-center px-6 lg:px-8 lg:pr-12">
              <div className="w-full">
                {/* Section label */}
                <span
                  className="type-label text-[#6b6b76] block mb-6"
                >
                  Annotated Walkthrough
                </span>
                <span
                  className="text-[clamp(1.1rem,2vw,1.6rem)] tracking-[-0.02em] text-[#e8e6e3] block mb-3"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.1 }}
                >
                  Meridian — Onboarding Flow
                </span>
                <span
                  className="text-[0.75rem] text-[#6b6b76]/50 block mb-10"
                  style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                >
                  Scroll to advance through the walkthrough
                </span>

                {/* Annotations */}
                <div className="space-y-0">
                  {STICKY_ANNOTATIONS.map((ann, i) => {
                    const isActive = i === activeAnnotation;
                    return (
                      <motion.div
                        key={i}
                        className="py-6 border-l-[2px] pl-6 transition-colors duration-500"
                        animate={{
                          borderColor: isActive
                            ? "rgba(196,255,0,0.4)"
                            : "rgba(255,255,255,0.03)",
                        }}
                      >
                        {/* Time + Title */}
                        <div className="flex items-center gap-3 mb-3">
                          <motion.span
                            className="text-[0.45rem] tracking-[0.4em] tabular-nums px-2 py-1 border"
                            style={{ fontFamily: "var(--font-mono)" }}
                            animate={{
                              color: isActive ? "#c4ff00" : "#3a3a42",
                              borderColor: isActive
                                ? "rgba(196,255,0,0.2)"
                                : "rgba(255,255,255,0.04)",
                              backgroundColor: isActive
                                ? "rgba(196,255,0,0.04)"
                                : "rgba(0,0,0,0)",
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            {ann.time}
                          </motion.span>
                          <motion.span
                            className="text-[0.8125rem] tracking-[-0.01em]"
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 600,
                            }}
                            animate={{
                              color: isActive ? "#e8e6e3" : "#3a3a42",
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            {ann.title}
                          </motion.span>
                        </div>

                        {/* Body */}
                        <motion.p
                          className="text-[0.8125rem] leading-[1.7]"
                          style={{ fontFamily: "var(--font-body)" }}
                          animate={{
                            color: isActive
                              ? "rgba(138,138,150,0.9)"
                              : "rgba(58,58,66,0.5)",
                            height: isActive ? "auto" : "auto",
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {ann.body}
                        </motion.p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Scroll progress dots — mobile-friendly */}
                <div className="flex items-center gap-2 mt-8">
                  {STICKY_ANNOTATIONS.map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-1 rounded-full"
                      animate={{
                        width: i === activeAnnotation ? 20 : 6,
                        backgroundColor:
                          i === activeAnnotation
                            ? "#c4ff00"
                            : i < activeAnnotation
                            ? "rgba(196,255,0,0.3)"
                            : "rgba(255,255,255,0.06)",
                      }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="editorial-rule mx-6 md:mx-12 lg:mx-16" />

      {/* ═══ CH.4 — MICROINTERACTION SHOWCASE ═══ */}
      <div className="relative px-6 md:px-12 lg:px-16 py-32 md:py-48">
        <div className="relative z-10 max-w-3xl mb-16 md:mb-24">
          <Reveal>
            <span className="type-label text-[#6b6b76] block mb-8">
              Craft Details
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="text-[clamp(1.6rem,3.5vw,3rem)] tracking-[-0.03em] text-[#e8e6e3] mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1 }}
            >
              The{" "}
              <span className="text-[#c4ff00]">micro</span>
              {" "}matters
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              className="text-[var(--type-body)] leading-[1.85] text-[#6b6b76] max-w-[var(--max-prose)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              The difference between good and great lives in the moments between
              moments. These micro-interactions are the invisible architecture of
              delight — each one engineered with specific easing curves, timing,
              and physical metaphors.
            </p>
          </Reveal>
        </div>

        {/* Micro grid — 3×2 */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6">
          {MICRO_INTERACTIONS.map((item, i) => (
            <MicroCard key={item.label} item={item} index={i} />
          ))}
        </div>

        {/* Closing thought */}
        <Reveal delay={0.3} className="mt-20 md:mt-28">
          <blockquote className="max-w-2xl pl-6 border-l border-[#c4ff00]/15">
            <span
              className="text-[clamp(0.9rem,1.3vw,1.1rem)] leading-[1.6] text-[#6b6b76]/60 block"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              "I prototype every interaction in code before handing it off.
              The gap between a Figma animation and a real 60fps gesture is
              where the magic lives — or dies."
            </span>
          </blockquote>
        </Reveal>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          isOpen={!!lightbox}
          onClose={() => setLightbox(null)}
          poster={lightbox.poster}
          title={lightbox.title}
          subtitle={lightbox.subtitle}
          duration={lightbox.duration}
          description={lightbox.description}
        />
      )}
    </section>
  );
}
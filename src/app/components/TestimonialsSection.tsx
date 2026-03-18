import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";

const testimonials = [
  {
    quote:
      "Paulo doesn't just design products — he redesigns how you think about them. Working with him felt like a masterclass in intentionality.",
    name: "Sarah Chen",
    role: "VP of Product, Meridian",
    year: "2025",
  },
  {
    quote:
      "The level of craft is almost unnerving. Every micro-interaction, every transition, every spacing decision tells you someone cared deeply.",
    name: "Marcus Webb",
    role: "CEO, Void Labs",
    year: "2025",
  },
  {
    quote:
      "He brought a cinematic quality to our product that we didn't even know we were missing. Our users feel it, even if they can't name it.",
    name: "Yuki Tanaka",
    role: "Creative Director, Aether",
    year: "2024",
  },
];

function AnimatedQuote({ text, isActive }: { text: string; isActive: boolean }) {
  const words = text.split(" ");

  return (
    <p
      className="text-[clamp(1.15rem,2.4vw,2rem)] leading-[1.45]"
      style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${text.slice(0, 10)}-${i}`}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={
            isActive
              ? { opacity: 0.9, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 12, filter: "blur(4px)" }
          }
          transition={{
            delay: i * 0.025,
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ color: "#e8e6e3" }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20%" });

  /* Auto-cycle when in view */
  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isInView]);

  /* Progress for the auto-timer */
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    setProgress(0);
    const start = Date.now();
    const frame = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / 6000, 1);
      setProgress(pct);
      if (pct < 1) requestAnimationFrame(frame);
    };
    const raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active, isInView]);

  return (
    <section ref={ref} className="relative px-6 md:px-12 lg:px-16 py-32 md:py-48">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        {/* Left label */}
        <div className="md:col-span-3">
          <span className="type-label text-[#6b6b76] block mb-4">
            Kind Words
          </span>
          {/* Serif editorial accent */}
          <span
            className="text-[clamp(0.9rem,1.4vw,1.2rem)] text-[#6b6b76]/30 block mb-10"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            from collaborators
          </span>

          {/* Navigation dots with progress */}
          <div className="flex md:flex-col gap-4">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="flex items-center gap-3 group text-left"
              >
                <div className="relative">
                  <motion.div
                    className="h-px"
                    animate={{
                      width: active === i ? 48 : 16,
                      backgroundColor:
                        active === i
                          ? "#c4ff00"
                          : "rgba(107,107,118,0.3)",
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  {active === i && (
                    <motion.div
                      className="absolute top-0 left-0 h-px bg-[#c4ff00]/30"
                      style={{ width: `${progress * 100}%` }}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className="type-label transition-colors duration-300"
                    style={{
                      color: active === i ? "#c4ff00" : "#6b6b76",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <motion.span
                    className="type-label-sm hidden md:block"
                    animate={{
                      color: active === i ? "#6b6b76" : "rgba(107,107,118,0.3)",
                      height: active === i ? "auto" : 0,
                      opacity: active === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {t.name.split(" ")[0]}
                  </motion.span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="md:col-span-8 md:col-start-5 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-14">
                {/* Opening quote — serif accent */}
                <motion.span
                  className="text-[clamp(5rem,12vw,10rem)] leading-none block mb-[-24px] select-none"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(196,255,0,0.1)",
                  }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  "
                </motion.span>

                <AnimatedQuote
                  text={testimonials[active].quote}
                  isActive={true}
                />
              </div>

              <motion.div
                className="flex items-center gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.div
                  className="w-12 h-px bg-[#c4ff00]/30"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  style={{ originX: 0 }}
                />
                <div>
                  <span
                    className="text-[14px] text-[#e8e6e3] block"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {testimonials[active].name}
                  </span>
                  <span
                    className="type-label text-[#6b6b76] mt-1 block"
                  >
                    {testimonials[active].role} — {testimonials[active].year}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
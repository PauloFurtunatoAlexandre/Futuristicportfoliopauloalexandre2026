import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
} from "motion/react";

const testimonials = [
  {
    quote:
      "As our company's Lead UX Designer, Paulo was responsible for many core initiatives including a complete redesign of our design system and site branding, mobile first designs, site wide accessibility, and implementing user research practices. Paulo is strong in all aspects of UX design but certainly a very talented UX researcher. For instance, Paulo lead usability tests, moderated interviews, and broad-based user surveys that gave our teams immense insights into our users and had direct impacts on our product roadmap. Paulo is a terrific interviewer and was always able to extract deep user insights from his research. Paulo then was able to translate those insights into effective designs to solve users' needs.",
    name: "Matthew Hoty",
    role: "Head of Product & Data at HealthPilot",
    year: "2024",
  },
  {
    quote:
      "Paulo, is a talented UX designer who has been a valuable member of our team. In his time with us, Paulo has consistently demonstrated their exceptional skills and creativity in designing innovative and intuitive user experiences. He is an excellent collaborator, always willing to go the extra mile to ensure that our projects meet the highest standards of quality. As a Mentor, he has played a huge role in my journey as a UX designer and set me on a path for growth. Overall, Paulo is an outstanding UX designer who would be a tremendous asset to any organization. I highly recommend him without reservation and would be happy to provide further information or answer any questions you may have.",
    name: "Alexander Hounsou",
    role: "UX Designer at Great American Insurance Group",
    year: "2023",
  },
  {
    quote:
      "I had the pleasure of working with Paulo Alexandre during our time at HealthPilot, where he was the Senior Product Designer. Paulo is incredibly passionate about design and consistently strives to refine his craft. His attention to detail and ability to create user experiences that are both intuitive and visually compelling made a significant impact on our projects. One of Paulo’s standout qualities is his commitment to understanding the end user. He takes the time to speak with users directly, gathering feedback and insights that shape his designs in meaningful ways. This user-focused approach, combined with his awareness of accessibility needs, ensures that his work is not only innovative but also inclusive and functional for everyone. What also sets Paulo apart is his dedication to staying ahead of the curve with UI/UX trends and best practices. He doesn’t just follow trends—he applies them thoughtfully to create designs that are modern, practical, and aligned with user needs. In addition to his technical expertise, Paulo is a collaborative and approachable team player. He’s always open to feedback and has a great ability to bring teams together to align on design goals. His talent for turning ideas into polished, user-focused solutions was a huge asset to our work at HealthPilot. Paulo’s work speaks for itself, and I would confidently recommend him to any organization looking for a skilled, user-centered, and results-driven designer.",
    name: "Natasha Alves",
    role: "UX Designer at Healthpilot",
    year: "2023",
  },
  {
    quote:
      'I might have met people who work as hard as Paulo but I can\'t think of anyone that would work harder than him. Some people, including myself, see product people categorized into the "Problem Team" and the "Solution Team". Paulo is the guy that plays well (and simultaneously) in both. Passionated, smart, talented, competent, and always willing to help. Definitely a great asset to any team.',
    name: "Daniel Camargo",
    role: "Founder at PracticeFront",
    year: "2021",
  },
  {
    quote:
      "It’s rare that you come across someone so eager to learn. I hired Paulo after he showed me some very impressive personal project that he was working on as he was learning to code.  Paulo's background in design and marketing made him an important asset to our team. We still miss him on the office Dota and CS games! Paulo would be an asset to any team.",
    name: "Phil Alves",
    role: "CEO at Devsquad & DevStats",
    year: "2017",
  },
];

function AnimatedQuote({
  text,
  isActive,
}: {
  text: string;
  isActive: boolean;
}) {
  const words = text.split(" ");

  return (
    <p
      className="text-[clamp(0.95rem,1.8vw,1.5rem)] leading-[1.55]"
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: 300,
      }}
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
            delay: i * 0.012,
            duration: 0.4,
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
    }, 12000);
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
      const pct = Math.min(elapsed / 12000, 1);
      setProgress(pct);
      if (pct < 1) requestAnimationFrame(frame);
    };
    const raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active, isInView]);

  return (
    <section
      ref={ref}
      className="relative px-6 md:px-12 lg:px-16 py-20 md:py-32"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        {/* Left label */}
        <div className="md:col-span-3">
          <span className="type-label text-[#6b6b76] block mb-4">
            Kind Words
          </span>
          {/* Serif editorial accent */}
          <span
            className="text-[clamp(0.9rem,1.4vw,1.2rem)] text-[#6b6b76]/30 block mb-10"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
            }}
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
                      color:
                        active === i ? "#c4ff00" : "#6b6b76",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <motion.span
                    className="type-label-sm hidden md:block"
                    animate={{
                      color:
                        active === i
                          ? "#6b6b76"
                          : "rgba(107,107,118,0.3)",
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
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
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
                  <span className="type-label text-[#6b6b76] mt-1 block">
                    {testimonials[active].role} —{" "}
                    {testimonials[active].year}
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
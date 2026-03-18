import { useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useIsMobile } from "./ui/useMediaQuery";

const images = [
  {
    src: "https://images.unsplash.com/photo-1485025798926-cde0f0d24cca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFyY2hpdGVjdHVyZSUyMGRhcmslMjBtaW5pbWFsfGVufDF8fHx8MTc3MzQwNzY3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    label: "FORM",
    caption: "Architecture as interface metaphor",
  },
  {
    src: "https://images.unsplash.com/photo-1760860992203-85ca32536788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBicmFuZCUyMGVkaXRvcmlhbCUyMGRhcmt8ZW58MXx8fHwxNzczNDA3NjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    label: "TEXTURE",
    caption: "Material language and tactility",
  },
  {
    src: "https://images.unsplash.com/photo-1771153847642-9204ec2ed92e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbXVzZXVtJTIwZ2FsbGVyeSUyMHNwYWNlfGVufDF8fHx8MTc3MzQwNzY3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    label: "SPACE",
    caption: "Negative space as design element",
  },
  {
    src: "https://images.unsplash.com/photo-1697292866717-0b20bd310268?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ24lMjBkYXJrJTIwc2NyZWVufGVufDF8fHx8MTc3MzQwNzY3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    label: "CRAFT",
    caption: "Obsessive attention to detail",
  },
];

function GalleryImage({
  src,
  label,
  caption,
  aspectClass,
  offsetClass,
  scrollYProgress,
  index,
}: {
  src: string;
  label: string;
  caption: string;
  aspectClass: string;
  offsetClass: string;
  scrollYProgress: any;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  const isMobile = useIsMobile();
  const speeds = isMobile ? [20, -15, 25, -20] : [60, -40, 80, -60];
  const y = useTransform(scrollYProgress, [0, 1], [0, speeds[index]]);

  /* Magnetic hover */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 200, damping: 25 });
  const springY = useSpring(my, { stiffness: 200, damping: 25 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const relX = (e.clientX - left) / width - 0.5;
      const relY = (e.clientY - top) / height - 0.5;
      mx.set(relX * 12);
      my.set(relY * 12);
    },
    [mx, my]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const revealDirection = index % 2 === 0 ? "left" : "right";

  return (
    <motion.div
      ref={ref}
      style={{ y, x: springX }}
      className={`${offsetClass} group relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-hover
    >
      <motion.div
        style={{ y: springY }}
        className={`${aspectClass} overflow-hidden relative`}
      >
        {/* Curtain reveal mask */}
        <motion.div
          className="absolute inset-0 bg-[#0a0a0b] z-20 pointer-events-none"
          initial={{
            [revealDirection === "left" ? "left" : "right"]: 0,
            width: "100%",
          }}
          animate={isInView ? { width: "0%" } : { width: "100%" }}
          transition={{
            delay: index * 0.15,
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            [revealDirection === "left" ? "right" : "left"]: "auto",
            originX: revealDirection === "left" ? 1 : 0,
          }}
        />

        <motion.img
          src={src}
          alt={label}
          className="w-full h-full object-cover will-change-transform"
          animate={{
            scale: isHovered ? 1.08 : 1,
            filter: isHovered
              ? "brightness(0.85) saturate(1.1)"
              : "brightness(0.55) saturate(0.9)",
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/80 via-transparent to-transparent" />
        <motion.div
          className="absolute inset-0 border transition-colors duration-500"
          animate={{
            borderColor: isHovered
              ? "rgba(196,255,0,0.15)"
              : "rgba(255,255,255,0.04)",
          }}
        />

        {/* Label + Caption */}
        <div className="absolute bottom-5 left-5 right-5 z-10">
          <motion.span
            className="type-label block"
            animate={{
              color: isHovered ? "#c4ff00" : "rgba(255,255,255,0.35)",
            }}
            transition={{ duration: 0.4 }}
          >
            {label}
          </motion.span>
          <motion.span
            className="text-[10px] tracking-[0.1em] text-white/0 block mt-1.5"
            style={{ fontFamily: "var(--font-mono)" }}
            animate={{
              color: isHovered
                ? "rgba(107,107,118,0.7)"
                : "rgba(255,255,255,0)",
              y: isHovered ? 0 : 6,
            }}
            transition={{ duration: 0.4 }}
          >
            {caption}
          </motion.span>
        </div>

        {/* Hover lens glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          animate={{
            boxShadow: isHovered
              ? "inset 0 0 80px -20px rgba(196,255,0,0.06)"
              : "inset 0 0 0px 0px transparent",
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
}

export function ImmersiveGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const oversizedY = useTransform(scrollYProgress, [0, 1], isMobile ? [10, -10] : [30, -30]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-40 overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* Oversized background label */}
      <motion.div
        style={{ y: oversizedY }}
        className="absolute -top-2 md:top-0 left-0 right-0 pointer-events-none select-none z-0"
      >
        <span className="oversized-label block pl-[5%]" style={{ opacity: 0.3 }}>
          VISUAL
        </span>
      </motion.div>

      {/* Header */}
      <div ref={headerRef} className="relative z-10 px-6 md:px-12 lg:px-16 mb-20 md:mb-32">
        <div className="flex items-end justify-between">
          <div>
            <motion.span
              className="type-label text-[#6b6b76] block mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Visual Language
            </motion.span>
            <div className="overflow-hidden">
              <motion.h2
                className="type-headline text-[#e8e6e3]"
                initial={{ y: 80 }}
                animate={headerInView ? { y: 0 } : {}}
                transition={{
                  duration: 1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                INSPIRATION
              </motion.h2>
            </div>
            <div className="flex items-end gap-4">
              <div className="overflow-hidden">
                <motion.h2
                  className="type-headline text-[#c4ff00]"
                  initial={{ y: 80 }}
                  animate={headerInView ? { y: 0 } : {}}
                  transition={{
                    delay: 0.1,
                    duration: 1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  ARCHIVE
                </motion.h2>
              </div>
              {/* Serif accent */}
              <motion.span
                className="text-[clamp(0.9rem,1.6vw,1.3rem)] text-[#6b6b76]/30 mb-1 hidden md:block"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                initial={{ opacity: 0 }}
                animate={headerInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                vol. iv
              </motion.span>
            </div>
          </div>
          <motion.p
            className="text-[12px] text-[#6b6b76] max-w-[220px] text-right hidden md:block leading-[1.7]"
            style={{ fontFamily: "var(--font-mono)" }}
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            A curated collection of visual references that inform my design
            philosophy
          </motion.p>
        </div>
      </div>

      {/* Asymmetric masonry gallery */}
      <div className="relative z-10 px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {images.map((img, i) => {
            const heights = [
              "aspect-[3/4]",
              "aspect-[4/5]",
              "aspect-[2/3]",
              "aspect-[3/4]",
            ];
            const offsets = [
              "mt-0",
              "mt-16 md:mt-28",
              "mt-6 md:mt-10",
              "mt-20 md:mt-40",
            ];
            return (
              <GalleryImage
                key={img.label}
                src={img.src}
                label={img.label}
                caption={img.caption}
                aspectClass={heights[i]}
                offsetClass={offsets[i]}
                scrollYProgress={scrollYProgress}
                index={i}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
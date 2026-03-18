import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "motion/react";

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  accentColor?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  accentColor = "#c4ff00",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = Math.max(2, Math.min(98, (x / rect.width) * 100));
      setPosition(percent);
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      updatePosition(e.clientX);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  /* Keyboard support */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(2, p - 2));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(98, p + 2));
    }
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
      className="relative overflow-hidden rounded-sm select-none my-16 md:my-24"
      style={{ touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
    >
      {/* After image (full background) */}
      <div className="w-full aspect-[16/9] relative">
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.65]"
          draggable={false}
        />

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover brightness-[0.65]"
            style={{ width: `${containerWidth}px`, maxWidth: "none" }}
            draggable={false}
          />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/60 via-transparent to-[#0a0a0b]/20 pointer-events-none" />

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <div
            className="w-px h-full"
            style={{ backgroundColor: accentColor }}
          />

          {/* Handle */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <motion.div
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center backdrop-blur-md"
              style={{
                borderColor: accentColor,
                backgroundColor: "rgba(10,10,11,0.6)",
              }}
              animate={{ scale: isDragging ? 1.15 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                className="opacity-80"
              >
                <path
                  d="M5 1L1 7L5 13M13 1L17 7L13 13"
                  stroke={accentColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 pointer-events-none">
          <span
            className="text-[9px] tracking-[0.4em] uppercase px-2 py-1"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: accentColor,
              backgroundColor: "rgba(10,10,11,0.6)",
            }}
          >
            {beforeLabel}
          </span>
        </div>
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 pointer-events-none">
          <span
            className="text-[9px] tracking-[0.4em] uppercase px-2 py-1"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: accentColor,
              backgroundColor: "rgba(10,10,11,0.6)",
            }}
          >
            {afterLabel}
          </span>
        </div>

        {/* Border */}
        <div className="absolute inset-0 border border-white/[0.04] pointer-events-none" />
      </div>
    </motion.div>
  );
}

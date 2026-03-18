import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useSpring(cursorX, { stiffness: 300, damping: 28 });
  const dotY = useSpring(cursorY, { stiffness: 300, damping: 28 });
  const ringX = useSpring(cursorX, { stiffness: 120, damping: 22 });
  const ringY = useSpring(cursorY, { stiffness: 120, damping: 22 });
  const ringScale = useMotionValue(1);
  const springRingScale = useSpring(ringScale, { stiffness: 300, damping: 25 });
  const dotScale = useMotionValue(1);
  const springDotScale = useSpring(dotScale, { stiffness: 400, damping: 30 });
  const ringOpacity = useMotionValue(0.4);
  const springRingOpacity = useSpring(ringOpacity, { stiffness: 200, damping: 25 });
  const mixBlend = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    },
    [cursorX, cursorY]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]");
      if (interactive) {
        ringScale.set(1.8);
        dotScale.set(0.5);
        ringOpacity.set(0.8);
        if (mixBlend.current) mixBlend.current.style.mixBlendMode = "difference";
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]");
      if (interactive) {
        ringScale.set(1);
        dotScale.set(1);
        ringOpacity.set(0.4);
        if (mixBlend.current) mixBlend.current.style.mixBlendMode = "normal";
      }
    };

    const handleDown = () => {
      ringScale.set(0.8);
      dotScale.set(1.4);
    };

    const handleUp = () => {
      ringScale.set(1);
      dotScale.set(1);
    };

    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [handleMouseMove, ringScale, dotScale, ringOpacity]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none hidden lg:block">
      {/* Outer ring */}
      <motion.div
        ref={mixBlend}
        className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full border border-[#c4ff00]/40"
        style={{
          left: ringX,
          top: ringY,
          scale: springRingScale,
          opacity: springRingOpacity,
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[#c4ff00]"
        style={{
          left: dotX,
          top: dotY,
          scale: springDotScale,
        }}
      />
    </div>
  );
}

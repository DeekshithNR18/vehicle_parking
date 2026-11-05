import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function Sparkle({ x, y, isLight }) {
  const lightColors = ["#FF007F", "#7C3AED", "#00F0FF", "#FFD700", "#FF5E00"]; 
  const darkColors = ["#00E5A0", "#00BFFF", "#8A2BE2", "#FFD700", "#FF1493"]; 
  const colorSet = isLight ? lightColors : darkColors;
  const randomColor = colorSet[Math.floor(Math.random() * colorSet.length)];
  const randomSize = isLight ? Math.random() * 8 + 3 : Math.random() * 10 + 4;
  const randomX = (Math.random() - 0.5) * (isLight ? 60 : 80);
  const randomY = (Math.random() - 0.5) * (isLight ? 60 : 80);
  const isSquare = isLight && Math.random() > 0.5;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, x: x - randomSize / 2, y: y - randomSize / 2 }}
      animate={{ opacity: 0, scale: 0, x: x + randomX, y: y + randomY, rotate: Math.random() * 360 }}
      transition={{ duration: isLight ? 0.9 : 1.2, ease: "easeOut" }}
      className={`fixed top-0 left-0 pointer-events-none z-[9998] ${isLight ? "mix-blend-multiply" : "mix-blend-screen"}`}
      style={{ 
        width: randomSize, height: randomSize, backgroundColor: randomColor, 
        boxShadow: isLight ? `0 0 8px ${randomColor}` : `0 0 20px ${randomColor}, 0 0 40px ${randomColor}`,
        borderRadius: isSquare ? "2px" : "50%",
        transform: isSquare ? "rotate(45deg)" : "none"
      }}
    />
  );
}

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [isLight, setIsLight] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Accessibility Check
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const checkTheme = () => setIsLight(document.documentElement.classList.contains("light"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (reduceMotion) return; // Don't spawn sparkles if reduced motion

      const now = Date.now();
      if (!window.lastSparkle || now - window.lastSparkle > (isLight ? 25 : 30)) {
        window.lastSparkle = now;
        setSparkles((prev) => [...prev.slice(isLight ? -25 : -20), { id: now + Math.random(), x: e.clientX, y: e.clientY }]);
      }
    };

    const handleMouseOver = (e) => {
      if (e.target.closest("button") || e.target.closest("a") || e.target.classList.contains("cursor-pointer")) setIsHovered(true);
      else setIsHovered(false);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isLight, reduceMotion]);

  // If user prefers reduced motion, hide the custom cursor entirely
  if (reduceMotion) return null;

  return (
    <>
      {sparkles.map((s) => <Sparkle key={s.id} x={s.x} y={s.y} isLight={isLight} />)}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring, y: cursorYSpring,
          border: isLight ? "2px solid transparent" : "2px solid rgba(0, 229, 160, 0.8)",
          backgroundImage: isLight ? "linear-gradient(white, white), linear-gradient(135deg, #FF007F, #7C3AED, #00F0FF)" : "none",
          backgroundOrigin: "border-box", backgroundClip: isLight ? "content-box, border-box" : "border-box",
          boxShadow: isLight ? "0 0 15px rgba(124, 58, 237, 0.4)" : "0 0 20px rgba(0, 229, 160, 0.4), inset 0 0 10px rgba(0, 229, 160, 0.4)",
        }}
        animate={{ scale: isHovered ? 1.3 : 1, rotate: isLight ? 360 : 0, backgroundColor: isHovered ? (isLight ? "rgba(255, 0, 127, 0.1)" : "rgba(0, 229, 160, 0.1)") : "transparent" }}
        transition={{ scale: { duration: 0.2 }, rotate: { duration: 3, repeat: Infinity, ease: "linear" } }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] flex items-center justify-center"
        style={{ x: cursorX, y: cursorY, translateX: isLight ? 12 : 10, translateY: isLight ? 12 : 10, width: isLight ? "16px" : "12px", height: isLight ? "16px" : "12px" }}
        animate={{ scale: isHovered ? 0 : 1 }}
      >
        {isLight ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="#FF007F" filter="drop-shadow(0 0 4px #FF007F)" /></svg>
        ) : (
          <div className="w-full h-full rounded-full bg-white shadow-[0_0_15px_#00E5A0,0_0_30px_#00E5A0,0_0_45px_#00E5A0]" />
        )}
      </motion.div>
    </>
  );
}

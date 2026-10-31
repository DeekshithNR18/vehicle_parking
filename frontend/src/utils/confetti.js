import confetti from "canvas-confetti";

export function fireConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;
  const colors = ["#00E5A0", "#5B8CFF", "#A78BFA", "#FFB020"];

  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

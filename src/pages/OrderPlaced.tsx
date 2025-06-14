
import React from "react";
import { useNavigate } from "react-router-dom";

// Neon moody animated gradient and checkmark glow styles
const bgStyle = `
@keyframes moody-gradient-move {
  0% { background-position: 0% 100%; }
  35% { background-position: 80% 40%; }
  70% { background-position: 10% 0%; }
  100% { background-position: 0% 100%; }
}
.moody-gradient-bg {
  background: linear-gradient(120deg,
    #d946ef 0%,
    #6b21a8 53%,
    #38bdf8 100%);
  background-size: 330% 330%;
  animation: moody-gradient-move 21s ease-in-out infinite;
}

@keyframes bg-glow-pulse {
  0%, 100% { opacity: 0.11; }
  40% { opacity: 0.26; }
  70% { opacity: 0.17; }
}
.glow-overlay {
  background: radial-gradient(ellipse 90% 60% at 60% 80%, #38bdf8 0%, transparent 65%),
    radial-gradient(ellipse 72% 72% at 10% 8%, #d946ef 0%, transparent 75%);
  opacity: 0.16;
  pointer-events: none;
  filter: blur(28px) saturate(1.13);
  position: absolute;
  inset: 0;
  z-index: 0;
  animation: bg-glow-pulse 11s ease-in-out infinite alternate;
}

@keyframes draw-check {
  0% { stroke-dashoffset: 24; }
  80% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 0; }
}
.calm-checkmark {
  stroke: #e879f9;
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  filter: drop-shadow(0 0 6px #d946ef66) drop-shadow(0 0 8px #38bdf866);
  animation: draw-check 1s 0.22s cubic-bezier(0.55,1.6,0.5,1) forwards;
}
`;

// Airy, blurred, less-prominent confetti, positioned brand-wise
const confettiBrand = [
  { emoji: "💖", style: { left: "13%", top: "8%", opacity: 0.10, fontSize: "2.4rem", rotate: "-11deg", filter: "blur(4.5px)" } },
  { emoji: "💙", style: { left: "83%", top: "15%", opacity: 0.12, fontSize: "2.1rem", rotate: "10deg", filter: "blur(4px)" } },
  { emoji: "✨", style: { left: "18%", top: "89%", opacity: 0.08, fontSize: "2.2rem", rotate: "-5deg", filter: "blur(5px)" } }
];

const OrderPlaced: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 moody-gradient-bg"
      style={{ minHeight: "100vh" }}
    >
      <style>{bgStyle}</style>
      <div className="glow-overlay" aria-hidden />
      {/* Extra subtle confetti for brand mood */}
      <div className="pointer-events-none select-none absolute inset-0" aria-hidden>
        {confettiBrand.map((c, i) => (
          <span
            key={i}
            style={{
              ...c.style,
              position: "absolute",
              userSelect: "none"
            }}
            aria-hidden
          >
            {c.emoji}
          </span>
        ))}
      </div>
      {/* Luxe card, contrasty + semi-opaque */}
      <div className="relative bg-white/80 backdrop-blur-[5px] rounded-2xl py-10 px-7 shadow-[0_8px_90px_8px_rgba(127,56,199,0.34)] flex flex-col items-center animate-scale-in max-w-sm w-full mx-4 border border-barrush-platinum z-10">
        {/* Animated checkmark with neon glow */}
        <svg viewBox="0 0 32 32" width={64} height={64} className="mb-4" aria-label="Order complete, checkmark" role="img">
          <circle cx="16" cy="16" r="15" fill="#fbeafd" />
          <path
            className="calm-checkmark"
            d="M10.6 17.2l4 4.6 7.2-8.5"
            fill="none"
          />
        </svg>
        <h1 className="text-2xl sm:text-3xl font-semibold text-barrush-burgundy mb-2 animate-fade-in text-center drop-shadow-[0_2px_7px_rgba(234,76,232,0.13)]">
          Your Order is Complete!
        </h1>
        <p className="text-base sm:text-lg text-gray-800 mb-5 text-center animate-fade-in [animation-delay:0.18s]">
          Thank you for shopping with us.<br />
          Your payment was received, and your order is now being processed.
        </p>
        <button
          className="px-6 py-2.5 bg-neon-pink text-white rounded-lg text-base font-semibold shadow-md hover:bg-pink-600 transition focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2"
          onClick={() => navigate("/products")}
        >
          Back to Shop
        </button>
        <p className="mt-7 text-xs text-barrush-charcoal/80 animate-fade-in [animation-delay:0.31s] text-center">
          A confirmation email with details has been sent.<br />
          Questions? <a href="/help" className="underline text-neon-purple hover:text-neon-pink hover:underline">Contact support</a>.
        </p>
      </div>
    </div>
  );
};

export default OrderPlaced;


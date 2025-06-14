
import React from "react";
import { useNavigate } from "react-router-dom";

const bgStyle = `
@keyframes calm-gradient-move {
  0% { background-position: 0% 70%; }
  50% { background-position: 100% 30%; }
  100% { background-position: 0% 70%; }
}
.calm-gradient-bg {
  background: linear-gradient(120deg, #e3ffe9 0%, #fceaff 50%, #faf3df 100%);
  background-size: 150% 200%;
  animation: calm-gradient-move 22s ease-in-out infinite;
}
@keyframes draw-check {
  0% { stroke-dashoffset: 24; }
  80% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 0; }
}
.calm-checkmark {
  stroke: #a855f7;
  stroke-width: 3.6;
  stroke-linecap: round;
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: draw-check 1s 0.25s cubic-bezier(0.5,1.6,0.5,1) forwards;
}
`;

const confettiSoft = [
  { emoji: "✨", style: { left: "16%", top: "11%", opacity: 0.16, fontSize: "2rem", rotate: "-9deg" } },
  { emoji: "🎉", style: { left: "78%", top: "14%", opacity: 0.16, fontSize: "2.1rem", rotate: "9deg" } },
  { emoji: "🥂", style: { left: "26%", top: "80%", opacity: 0.14, fontSize: "1.7rem", rotate: "-5deg" } },
  { emoji: "🎊", style: { left: "61%", top: "88%", opacity: 0.13, fontSize: "1.8rem", rotate: "7deg" } }
];

const OrderPlaced: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 calm-gradient-bg"
      style={{ minHeight: "100vh" }}
    >
      <style>{bgStyle}</style>
      {/* Gentle confetti (background, not distracting) */}
      <div className="pointer-events-none select-none absolute inset-0" aria-hidden>
        {confettiSoft.map((c, i) => (
          <span
            key={i}
            style={{ ...c.style, position: "absolute", filter: "blur(0.5px)" }}
            aria-hidden
          >
            {c.emoji}
          </span>
        ))}
      </div>
      {/* Soft, centered confirmation card */}
      <div className="relative bg-white bg-opacity-90 rounded-2xl py-10 px-7 shadow-xl flex flex-col items-center animate-scale-in max-w-sm w-full mx-4 border border-barrush-platinum">
        {/* Animated checkmark */}
        <svg viewBox="0 0 32 32" width={62} height={62} className="mb-4" aria-label="Order complete, checkmark" role="img">
          <circle cx="16" cy="16" r="15" fill="#edf6ff" />
          <path
            className="calm-checkmark"
            d="M10.6 17.2l4 4.6 7.2-8.5"
            fill="none"
          />
        </svg>
        <h1 className="text-2xl sm:text-3xl font-semibold text-barrush-burgundy mb-2 animate-fade-in text-center">
          Your Order is Complete!
        </h1>
        <p className="text-base sm:text-lg text-gray-800 mb-5 text-center animate-fade-in [animation-delay:0.13s]">
          Thank you for shopping with us.<br />
          Your payment was received, and your order is now being processed.
        </p>
        <button
          className="px-6 py-2.5 bg-neon-pink text-white rounded-lg text-base font-semibold shadow-md hover:bg-pink-600 transition focus:outline-none focus:ring-2 focus:ring-barrush-gold focus:ring-offset-2"
          onClick={() => navigate("/products")}
        >
          Back to Shop
        </button>
        <p className="mt-7 text-xs text-gray-700 animate-fade-in [animation-delay:0.23s] text-center">
          A confirmation email with details has been sent.<br />
          Questions? <a href="/help" className="underline text-neon-purple">Contact support</a>.
        </p>
      </div>
    </div>
  );
};

export default OrderPlaced;

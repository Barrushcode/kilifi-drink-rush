
import React from "react";
import { useNavigate } from "react-router-dom";

const gradientBgStyle = `
@keyframes bg-gradient-move {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.gentle-gradient-bg {
  background: linear-gradient(135deg, #ffdde1 0%, #f7bb97 100%, #eec6ff 100%, #ffe5ec 100%);
  background-size: 300% 300%;
  animation: bg-gradient-move 12s ease-in-out infinite;
}
`;

const confettiArray = [
  "🎉", "🍾", "🥳", "✨", "🎊", "🪅"
];

const OrderPlaced: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 gentle-gradient-bg" style={{ minHeight: '100vh' }}>
      <style>{gradientBgStyle}</style>
      {/* Soft Confetti Top Row */}
      <div className="absolute top-8 left-0 right-0 flex justify-center gap-5 opacity-80 pointer-events-none select-none text-2xl sm:text-3xl">
        {confettiArray.map((c, i) => (
          <span key={i} style={{ animation: `fade-in ${0.6 + i * 0.2}s both` }}>{c}</span>
        ))}
      </div>
      <div className="relative bg-white bg-opacity-95 rounded-xl py-10 px-7 shadow-2xl flex flex-col items-center animate-scale-in max-w-md w-full mx-4">
        <div className="text-7xl mb-3 animate-pulse drop-shadow-lg">🎉</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-neon-pink mb-2 animate-fade-in text-center">Order Placed Successfully!</h1>
        <p className="text-lg sm:text-xl text-gray-800 mb-6 text-center animate-fade-in">
          Thank you for your order.<br />
          We’ve received your payment and will begin processing it shortly.
        </p>
        <button
          className="px-7 py-3 bg-neon-pink text-white rounded-lg text-base sm:text-lg font-semibold shadow-lg hover:bg-pink-700 transition"
          onClick={() => navigate("/products")}
        >
          Back to Shop
        </button>
        <p className="mt-6 text-sm text-gray-700 animate-fade-in text-center">
          A confirmation email will be sent with your order details. <br />
          Need help? <a href="/help" className="underline text-neon-purple">Contact support</a>.
        </p>
      </div>
      {/* Soft Confetti Bottom Row */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 opacity-70 pointer-events-none select-none text-xl sm:text-2xl">
        {confettiArray.slice().reverse().map((c, i) => (
          <span key={i} style={{ animation: `fade-in ${0.9 + i * 0.18}s both` }}>{c}</span>
        ))}
      </div>
    </div>
  );
};

export default OrderPlaced;


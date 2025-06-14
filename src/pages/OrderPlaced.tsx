
import React from "react";
import { useNavigate } from "react-router-dom";

const strobeStyle = `
@keyframes strobe {
  0%, 100% { background: #000; }
  10% { background: #ff00cc; }
  20% { background: #fff200; }
  30% { background: #ff00cc; }
  40% { background: #00ffe7; }
  50% { background: #fff; }
  60% { background: #00ffe7; }
  70% { background: #ff00cc; }
  80% { background: #fff200; }
  90% { background: #000; }
}
.strobe-bg {
  animation: strobe 1s infinite;
}
`;

const OrderPlaced: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 strobe-bg" style={{minHeight: '100vh'}}>
      <style>{strobeStyle}</style>
      <div className="relative bg-white bg-opacity-90 rounded-xl p-8 shadow-2xl flex flex-col items-center animate-scale-in">
        <div className="text-7xl mb-4 animate-pulse drop-shadow-lg">🎉</div>
        <h1 className="text-4xl font-bold text-neon-pink mb-3 animate-fade-in">Order Placed Successfully!</h1>
        <p className="text-xl text-gray-900 mb-8 text-center animate-fade-in">
          Thank you for your order.<br />
          We’ve received your payment and will begin processing it shortly.
        </p>
        <button
          className="px-8 py-3 bg-neon-pink text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-pink-700 transition"
          onClick={() => navigate("/products")}
        >
          Back to Shop
        </button>
        <p className="mt-6 text-sm text-gray-800 animate-fade-in">
          A confirmation email will be sent with your order details. <br />
          Need help? <a href="/help" className="underline text-neon-purple">Contact support</a>.
        </p>
      </div>
    </div>
  );
};

export default OrderPlaced;

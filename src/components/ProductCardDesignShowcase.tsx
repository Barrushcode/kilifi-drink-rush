
import React, { useState } from "react";

const sampleProduct = {
  id: 1001,
  name: "Mateus Rosé",
  price: "KES 1,250",
  description: "A fresh, young and slightly sparkling Rosé wine from Portugal. Perfect for hot weather and light meals.",
  image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  category: "Wine"
};

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: typeof sampleProduct;
  designTitle: string;
}

function ProductModal({ open, onClose, product, designTitle }: ProductModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        className="bg-barrush-midnight max-w-xs w-[350px] sm:w-[400px] md:w-[440px] rounded-xl shadow-2xl text-barrush-platinum p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-barrush-platinum/60 hover:text-white text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-3">
          <img src={product.image} alt={product.name}
            className="rounded-lg w-32 h-32 object-cover mb-2 shadow-md"
          />
          <h2 className="font-bold text-2xl mb-1">{product.name}</h2>
          <span className="font-bold text-pink-400 text-lg mb-2">{product.price}</span>
          <span className="text-xs bg-barrush-steel/40 px-2 py-0.5 rounded-full mb-2">{product.category}</span>
          <p className="text-barrush-platinum/90 text-sm text-center">{product.description}</p>
          <div className="text-xs mt-4 text-barrush-platinum/50">{designTitle}</div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCardDesignShowcase() {
  const [modalOpen, setModalOpen] = useState<number | null>(null);

  // Card click handler opens modal for card idx
  const handleCardClick = (idx: number) => setModalOpen(idx);

  // Card preview blocks (definitions kept minimal, only name & price)
  const designs = [
    {
      card: (
        <div
          className="bg-glass-effect rounded-2xl shadow-lg border border-barrush-steel/20 overflow-hidden hover:shadow-xl transition-all duration-300 font-iphone relative cursor-pointer"
          onClick={() => handleCardClick(0)}
          tabIndex={0}
          role="button"
          aria-label="Open product details"
        >
          <div className="relative">
            <img src={sampleProduct.image} alt={sampleProduct.name}
              className="w-full h-48 object-cover rounded-t-2xl"
              style={{ filter: "brightness(1)" }}
            />
            {/* No badge, no category */}
          </div>
          <div className="p-5 flex flex-col gap-1">
            <h3 className="text-lg font-bold text-white mb-1">{sampleProduct.name}</h3>
            <span className="text-xl font-bold text-pink-400">{sampleProduct.price}</span>
          </div>
        </div>
      ),
      title: "Design 1: Glassmorphism"
    },
    {
      card: (
        <div
          className="bg-barrush-midnight rounded-xl p-5 border border-barrush-steel/30 flex flex-col items-center shadow-sm hover:shadow-lg transition font-iphone cursor-pointer"
          onClick={() => handleCardClick(1)}
          tabIndex={0}
          role="button"
          aria-label="Open product details"
        >
          <img src={sampleProduct.image} alt={sampleProduct.name}
            className="rounded-lg w-28 h-28 object-cover mb-3"
            style={{ filter: "brightness(1)" }}
          />
          <h3 className="font-bold text-base text-white mb-2 text-center">{sampleProduct.name}</h3>
          <span className="font-bold text-pink-400">{sampleProduct.price}</span>
        </div>
      ),
      title: "Design 2: Minimalist Card"
    },
    {
      card: (
        <div
          className="relative bg-barrush-slate rounded-2xl p-4 shadow-lg border border-barrush-steel/30 font-iphone hover:shadow-xl transition cursor-pointer"
          onClick={() => handleCardClick(2)}
          tabIndex={0}
          role="button"
          aria-label="Open product details"
        >
          <img src={sampleProduct.image} alt={sampleProduct.name}
            className="rounded-xl w-24 h-24 absolute -top-8 left-1/2 -translate-x-1/2 shadow-lg border-2 border-barrush-slate bg-barrush-midnight"
            style={{ objectFit: "cover" }}
          />
          <div className="pt-16 pb-3 flex flex-col items-center">
            <h3 className="text-base font-semibold text-white">{sampleProduct.name}</h3>
            <span className="bg-pink-500/90 px-3 py-0.5 text-lg font-bold rounded-full text-white shadow ml-1 mt-2">
              {sampleProduct.price}
            </span>
          </div>
        </div>
      ),
      title: "Design 3: Sticker Style"
    }
  ];

  return (
    <section className="w-full bg-gradient-to-tr from-barrush-midnight to-barrush-slate rounded-xl py-6 mb-8 shadow-lg border border-barrush-steel/20">
      <h2 className="text-2xl md:text-3xl font-bold font-iphone text-white mb-6 text-center tracking-tight">
        Preview Product Card Designs
      </h2>
      <div className="flex flex-col gap-6 md:flex-row md:gap-4 items-stretch justify-center max-w-6xl mx-auto px-2">
        {designs.map((design, idx) => (
          <div key={idx} className="flex-1 min-w-[260px] max-w-xs mx-auto">
            {design.card}
            <div className="text-center mt-3 text-xs text-barrush-platinum/60">{design.title}</div>
            {/* Modal for each card */}
            <ProductModal
              open={modalOpen === idx}
              onClose={() => setModalOpen(null)}
              product={sampleProduct}
              designTitle={design.title}
            />
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-barrush-platinum/80 mt-6">
        <span>Click any card to see full product details. Which design layout do you want in your shop?</span>
      </div>
    </section>
  );
}

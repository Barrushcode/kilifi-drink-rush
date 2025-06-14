
import React from "react";

const sampleProduct = {
  id: 1001,
  name: "Mateus Rosé",
  price: "KES 1,250",
  description: "A fresh, young and slightly sparkling Rosé wine from Portugal. Perfect for hot weather and light meals.",
  image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  category: "Wine"
};

export default function ProductCardDesignShowcase() {
  return (
    <section className="w-full bg-gradient-to-tr from-barrush-midnight to-barrush-slate rounded-xl py-6 mb-8 shadow-lg border border-barrush-steel/20">
      <h2 className="text-2xl md:text-3xl font-bold font-iphone text-white mb-6 text-center tracking-tight">
        Preview Product Card Designs
      </h2>
      <div className="flex flex-col gap-6 md:flex-row md:gap-4 items-stretch justify-center max-w-6xl mx-auto px-2">
        {/* Design 1 */}
        <div className="flex-1 min-w-[260px] max-w-xs mx-auto">
          <div className="bg-glass-effect rounded-2xl shadow-lg border border-barrush-steel/20 overflow-hidden hover:shadow-xl transition-all duration-300 font-iphone relative">
            <div className="relative">
              <img src={sampleProduct.image} alt={sampleProduct.name}
                className="w-full h-48 object-cover rounded-t-2xl"
                style={{ filter: "brightness(1)" }}
              />
              <span className="absolute top-3 right-3 bg-pink-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                {sampleProduct.category}
              </span>
            </div>
            <div className="p-5 flex flex-col gap-2">
              <h3 className="text-lg font-bold text-white mb-1">{sampleProduct.name}</h3>
              <p className="text-barrush-platinum/70 text-sm line-clamp-2">{sampleProduct.description}</p>
              <div className="flex flex-row items-center justify-between mt-3 mb-1">
                <span className="text-xl font-bold text-pink-400">{sampleProduct.price}</span>
                <button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 text-xs font-bold transition-all">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-3 text-xs text-barrush-platinum/60">Design 1: Glassmorphism</div>
        </div>
        {/* Design 2 */}
        <div className="flex-1 min-w-[260px] max-w-xs mx-auto">
          <div className="bg-barrush-midnight rounded-xl p-5 border border-barrush-steel/30 flex flex-col items-center shadow-sm hover:shadow-lg transition font-iphone">
            <img src={sampleProduct.image} alt={sampleProduct.name}
              className="rounded-lg w-28 h-28 object-cover mb-3"
              style={{ filter: "brightness(1)" }}
            />
            <h3 className="font-bold text-base text-white mb-1 text-center">{sampleProduct.name}</h3>
            <p className="text-barrush-platinum/60 text-xs mb-2 text-center">{sampleProduct.description}</p>
            <div className="w-full flex justify-between items-center mt-auto">
              <span className="font-bold text-pink-400">{sampleProduct.price}</span>
              <button className="bg-rose-600 hover:bg-rose-500 font-bold text-xs rounded-lg px-4 py-1 text-white">Add to Cart</button>
            </div>
          </div>
          <div className="text-center mt-3 text-xs text-barrush-platinum/60">Design 2: Minimalist Card</div>
        </div>
        {/* Design 3 */}
        <div className="flex-1 min-w-[260px] max-w-xs mx-auto">
          <div className="relative bg-barrush-slate rounded-2xl p-4 shadow-lg border border-barrush-steel/30 font-iphone hover:shadow-xl transition">
            <img src={sampleProduct.image} alt={sampleProduct.name}
              className="rounded-xl w-24 h-24 absolute -top-8 left-1/2 -translate-x-1/2 shadow-lg border-2 border-barrush-slate bg-barrush-midnight"
              style={{ objectFit: "cover" }}
            />
            <div className="pt-16 pb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-semibold text-white">{sampleProduct.name}</h3>
                <span className="bg-pink-500/90 px-2 py-0.5 text-xs font-bold rounded-full text-white shadow ml-1 -mt-2">
                  {sampleProduct.price}
                </span>
              </div>
              <p className="text-xs text-barrush-platinum/70 mt-1 line-clamp-2">{sampleProduct.description}</p>
              <div className="flex gap-2 mt-3">
                <button className="bg-barrush-gold/80 hover:bg-barrush-gold text-barrush-midnight font-bold py-1.5 px-3 rounded-lg text-xs">Add</button>
                <button className="bg-transparent border border-rose-600 text-pink-500 font-semibold py-1.5 px-3 rounded-lg text-xs hover:bg-rose-700 hover:text-white transition">Buy</button>
              </div>
            </div>
          </div>
          <div className="text-center mt-3 text-xs text-barrush-platinum/60">Design 3: Sticker Style</div>
        </div>
      </div>
      <div className="text-center text-sm text-barrush-platinum/80 mt-6">
        <span>Click any button to see focus/hover styles. Select your favorite and let me know which design number you want!</span>
      </div>
    </section>
  );
}

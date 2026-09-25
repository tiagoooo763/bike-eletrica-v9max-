import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Modal } from '../common/Modal';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch Swipe Handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="relative w-full bg-white select-none">
      {/* Main Image Container */}
      <div
        className="relative aspect-square w-full bg-slate-100 overflow-hidden cursor-zoom-in group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => setIsZoomOpen(true)}
      >
        <img
          src={images[currentIndex] || images[0]}
          alt={`${productName} - Imagem ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Navigation Arrows (Desktop / Hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
              aria-label="Imagem Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
              aria-label="Próxima Imagem"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Badge (e.g. 1/8) */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none shadow-sm">
          {currentIndex + 1}/{images.length}
        </div>

        {/* Zoom Icon Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomOpen(true);
          }}
          className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Zoom na imagem"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnails (Desktop & Tablet) */}
      {images.length > 1 && (
        <div className="hidden sm:flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                currentIndex === idx
                  ? 'border-brand ring-2 ring-brand/30 scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* High-Resolution Zoom Modal */}
      <Modal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} maxWidth="xl">
        <div className="relative aspect-square max-h-[75vh] w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={productName}
            className="w-full h-full object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

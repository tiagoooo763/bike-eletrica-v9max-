import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquarePlus, Image as ImageIcon } from 'lucide-react';
import { ProductReview } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';

interface ReviewSectionProps {
  productId: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  rating,
  reviewCount,
  salesCount,
}) => {
  const { reviews, addReview } = useStore();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  // Form states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const productReviews = reviews[productId] || [];

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast({
        type: 'error',
        message: 'Você precisa estar logado para avaliar.',
      });
      return;
    }
    if (!newComment.trim()) return;

    addReview(productId, {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: newRating,
      comment: newComment,
      verifiedPurchase: true,
    });

    setNewComment('');
    setIsWriteReviewOpen(false);
    addToast({
      type: 'success',
      title: 'Avaliação Publicada!',
      message: 'Obrigado por ajudar outros compradores!',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Avaliações dos Clientes</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                />
              ))}
            </div>
            <span className="font-extrabold text-slate-900 text-sm">{rating.toFixed(1)}</span>
            <span className="text-xs text-slate-500">({reviewCount} avaliações)</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">{salesCount} vendidos</span>
          </div>
        </div>

        <button
          onClick={() => setIsWriteReviewOpen(true)}
          className="text-xs font-bold text-brand bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>Avaliar</span>
        </button>
      </div>

      {/* Review List Preview */}
      <div className="space-y-3">
        {productReviews.slice(0, 3).map((review) => (
          <div key={review.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{review.userName}</span>
                    {review.verifiedPurchase && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
                        <CheckCircle className="w-3 h-3" /> Compra Verificada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400">{review.date}</span>
                  </div>
                </div>
              </div>

              {review.variantSelected && (
                <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600 hidden sm:inline">
                  {review.variantSelected}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{review.comment}</p>

            {/* Review Photos if any */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 pt-1">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Foto do cliente"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400 pt-1">
              <ThumbsUp className="w-3 h-3" />
              <span>{review.likesCount} pessoas acharam útil</span>
            </div>
          </div>
        ))}
      </div>

      {productReviews.length > 3 && (
        <button
          onClick={() => setIsAllReviewsModalOpen(true)}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
        >
          Ver Todas as {productReviews.length} Avaliações
        </button>
      )}

      {/* Modal: Write Review */}
      <Modal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        title="Escrever Avaliação"
      >
        <form onSubmit={handleCreateReview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sua Nota</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${star <= newRating ? 'fill-amber-400' : 'text-slate-200'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Seu Comentário
            </label>
            <textarea
              required
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="O que você achou da qualidade, entrega e desempenho do produto?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand-600 transition-colors text-sm"
          >
            Enviar Avaliação
          </button>
        </form>
      </Modal>

      {/* Modal: All Reviews */}
      <Modal
        isOpen={isAllReviewsModalOpen}
        onClose={() => setIsAllReviewsModalOpen(false)}
        title="Todas as Avaliações"
      >
        <div className="space-y-3">
          {productReviews.map((review) => (
            <div key={review.id} className="p-3 bg-slate-50 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{review.userName}</span>
                <span className="text-[10px] text-slate-400">{review.date}</span>
              </div>
              <p className="text-xs text-slate-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

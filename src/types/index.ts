export type UserRole = 'customer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  avatar: string;
  role: UserRole;
  storeId?: string; // If role is seller
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  followersCount: number;
  isVerified: boolean;
  joinedDate: string;
  responseTime: string;
}

export interface Creator {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  isVerified: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image: string;
  itemCount: number;
  subcategories?: { id: string; name: string; slug: string }[];
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Azul / 110V"
  type: string; // "cor", "tamanho", "voltagem", etc.
  value: string;
  price?: number;
  oldPrice?: number;
  stock: number;
  sku: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  variantSelected?: string;
  verifiedPurchase: boolean;
  images?: string[];
  likesCount: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  storeRating: number;
  storeVerified: boolean;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  oldPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  stock: number;
  sku: string;
  images: string[];
  variants?: ProductVariant[];
  isFlashDeal: boolean;
  flashDealEndTimestamp?: number; // timestamp in ms
  shipping: {
    freeShipping: boolean;
    standardPrice: number;
    expressPrice: number;
    estimatedDaysMin: number;
    estimatedDaysMax: number;
  };
  tags: string[];
  specifications: { label: string; value: string }[];
  featured: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountValue: number;
  discountType: 'fixed' | 'percentage';
  minOrderValue: number;
  maxDiscount?: number;
  storeId?: string; // if null, platform-wide
  expiresAt: string;
}

export interface CartItem {
  id: string; // unique item id in cart
  productId: string;
  product: Product;
  variantId?: string;
  variantName?: string;
  price: number;
  quantity: number;
  selected: boolean;
}

export interface Cart {
  items: CartItem[];
  appliedCoupon?: Coupon;
}

export type OrderStatus = 
  | 'pending_payment' 
  | 'confirmed' 
  | 'preparing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  price: number;
  quantity: number;
  storeId: string;
  storeName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  shippingOption: {
    name: string;
    price: number;
    estimatedDelivery: string;
  };
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  paymentDetails: {
    pixQrCode?: string;
    pixCopyPaste?: string;
    cardLast4?: string;
    cardBrand?: string;
    installments?: number;
    boletoCode?: string;
  };
  createdAt: string;
  updatedAt: string;
  trackingCode?: string;
}

export interface VideoPost {
  id: string;
  creatorId: string;
  creator: Creator;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  songTitle?: string;
  productId: string;
  product: Product;
  isLiked?: boolean;
}

export interface LiveMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  isHost?: boolean;
  time: string;
}

export interface LiveStream {
  id: string;
  creatorId: string;
  creator: Creator;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  viewerCount: number;
  isLive: boolean;
  products: Product[];
  currentProductIndex: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'user' | 'store';
  text: string;
  timestamp: string;
  productId?: string;
  product?: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
}

export interface ChatConversation {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  linkUrl: string;
  bgColor?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'social' | 'system';
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  onlyFlashDeals?: boolean;
  onlyFreeShipping?: boolean;
  sortBy?: 'relevance' | 'sales' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

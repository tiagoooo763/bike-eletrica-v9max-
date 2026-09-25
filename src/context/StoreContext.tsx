import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  Category, 
  Store, 
  Order, 
  VideoPost, 
  LiveStream, 
  Coupon, 
  Banner,
  ProductReview,
  Address
} from '../types';
import { 
  mockProducts, 
  mockCategories, 
  mockStores, 
  mockVideos, 
  mockLiveStreams, 
  mockCoupons, 
  mockBanners,
  mockReviews
} from '../data/mockData';

interface StoreContextData {
  products: Product[];
  categories: Category[];
  stores: Store[];
  videos: VideoPost[];
  liveStreams: LiveStream[];
  coupons: Coupon[];
  banners: Banner[];
  orders: Order[];
  reviews: Record<string, ProductReview[]>;
  userAddresses: Address[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getStoreBySlug: (slug: string) => Store | undefined;
  getStoreById: (id: string) => Store | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'likesCount'>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  toggleVideoLike: (videoId: string) => void;
}

const StoreContext = createContext<StoreContextData>({} as StoreContextData);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('@PulseShop:products');
    return saved ? JSON.parse(saved) : mockProducts;
  });

  const [categories] = useState<Category[]>(mockCategories);
  const [stores] = useState<Store[]>(mockStores);
  const [banners] = useState<Banner[]>(mockBanners);
  const [coupons] = useState<Coupon[]>(mockCoupons);
  const [liveStreams] = useState<LiveStream[]>(mockLiveStreams);

  const [videos, setVideos] = useState<VideoPost[]>(() => {
    const saved = localStorage.getItem('@PulseShop:videos');
    return saved ? JSON.parse(saved) : mockVideos;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('@PulseShop:orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Record<string, ProductReview[]>>(() => {
    const saved = localStorage.getItem('@PulseShop:reviews');
    return saved ? JSON.parse(saved) : { 'prod_furadeira_48v': mockReviews };
  });

  const [userAddresses, setUserAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('@PulseShop:addresses');
    return saved ? JSON.parse(saved) : [
      {
        id: 'addr_1',
        userId: 'usr_customer_1',
        recipientName: 'Lucas Silva',
        cep: '01310-100',
        street: 'Avenida Paulista',
        number: '1000',
        complement: 'Apto 42',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        isDefault: true,
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('@PulseShop:products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('@PulseShop:videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('@PulseShop:orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('@PulseShop:reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('@PulseShop:addresses', JSON.stringify(userAddresses));
  }, [userAddresses]);

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getStoreBySlug = (slug: string) => {
    return stores.find((s) => s.slug === slug);
  };

  const getStoreById = (id: string) => {
    return stores.find((s) => s.id === id);
  };

  const getCategoryBySlug = (slug: string) => {
    return categories.find((c) => c.slug === slug);
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
  };

  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...newProdData,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addReview = (productId: string, reviewData: Omit<ProductReview, 'id' | 'date' | 'likesCount'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      date: 'Hoje',
      likesCount: 0,
    };
    setReviews((prev) => ({
      ...prev,
      [productId]: [newRev, ...(prev[productId] || [])],
    }));
  };

  const addAddress = (addrData: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addrData,
      id: `addr_${Date.now()}`,
    };
    setUserAddresses((prev) => [...prev, newAddr]);
  };

  const toggleVideoLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isLiked = !v.isLiked;
          return {
            ...v,
            isLiked,
            likesCount: isLiked ? v.likesCount + 1 : v.likesCount - 1,
          };
        }
        return v;
      })
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        stores,
        videos,
        liveStreams,
        coupons,
        banners,
        orders,
        reviews,
        userAddresses,
        getProductBySlug,
        getProductById,
        getStoreBySlug,
        getStoreById,
        getCategoryBySlug,
        addOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        addAddress,
        toggleVideoLike,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

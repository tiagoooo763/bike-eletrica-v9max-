-- ==========================================================
-- PulseShop Social Commerce & Marketplace - PostgreSQL Schema
-- ==========================================================

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('customer', 'seller', 'admin');
CREATE TYPE order_status AS ENUM ('pending_payment', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE discount_type AS ENUM ('fixed', 'percentage');
CREATE TYPE payment_method_type AS ENUM ('pix', 'credit_card', 'boleto');

-- 2. USERS & PROFILES
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    cpf VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SELLERS & STORES
CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(30) UNIQUE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    followers_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    response_time VARCHAR(100) DEFAULT 'Responde em poucos minutos',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CATEGORIES
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PRODUCTS & VARIANTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE RESTRICT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    old_price NUMERIC(10, 2),
    discount_percentage INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    is_flash_deal BOOLEAN DEFAULT FALSE,
    flash_deal_end_at TIMESTAMP WITH TIME ZONE,
    free_shipping BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    variant_type VARCHAR(50) NOT NULL,
    value VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2),
    stock INT DEFAULT 0,
    sku VARCHAR(100),
    image_url TEXT
);

CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    stock_quantity INT NOT NULL DEFAULT 0,
    min_stock_alert INT DEFAULT 5,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ADDRESSES
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    cep VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(50) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. COUPONS & DISCOUNTS
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE, -- NULL means platform-wide
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_value NUMERIC(10, 2) NOT NULL,
    discount_type discount_type NOT NULL,
    min_order_value NUMERIC(10, 2) DEFAULT 0.00,
    max_discount NUMERIC(10, 2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE coupon_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    order_id UUID,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CART & ITEMS
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1,
    selected BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. ORDERS & PAYMENTS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    address_id UUID REFERENCES addresses(id) ON DELETE RESTRICT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    shipping_cost NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    status order_status DEFAULT 'pending_payment',
    tracking_code VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT NOT NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    store_id UUID REFERENCES stores(id) ON DELETE RESTRICT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE NOT NULL,
    method payment_method_type NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    pix_qr_code TEXT,
    pix_copy_paste TEXT,
    card_last4 VARCHAR(4),
    card_brand VARCHAR(50),
    installments INT DEFAULT 1,
    boleto_barcode TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. SOCIAL COMMERCE: CREATORS, VIDEOS & LIVES
CREATE TABLE creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    bio TEXT,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    song_title VARCHAR(255),
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE live_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    thumbnail_url TEXT NOT NULL,
    video_url TEXT,
    viewer_count INT DEFAULT 0,
    is_live BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE live_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    live_stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    display_order INT DEFAULT 0
);

-- 11. SOCIAL INTERACTIONS: FAVORITES, REVIEWS, FOLLOWERS, CHAT
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images JSONB,
    verified_purchase BOOLEAN DEFAULT TRUE,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE followers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    target_id UUID NOT NULL, -- can be user, creator or store
    target_type VARCHAR(20) NOT NULL, -- 'store' or 'creator'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (follower_id, target_id, target_type)
);

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, store_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    sender_role VARCHAR(20) NOT NULL, -- 'user' or 'store'
    text TEXT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    badge VARCHAR(50),
    image_url TEXT NOT NULL,
    link_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_flash_deal ON products(is_flash_deal);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_videos_creator ON videos(creator_id);
CREATE INDEX idx_videos_product ON videos(product_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);

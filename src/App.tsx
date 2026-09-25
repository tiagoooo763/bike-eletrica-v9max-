import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ChatProvider } from './context/ChatContext';

// Pages
import { FerramentaPage } from './pages/FerramentaPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PixPaymentPage } from './pages/PixPaymentPage';
import { EnderecoPage } from './pages/EnderecoPage';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { StorePage } from './pages/StorePage';
import { CreatorPage } from './pages/CreatorPage';
import { VideoFeedPage } from './pages/VideoFeedPage';
import { LiveShoppingPage } from './pages/LiveShoppingPage';
import { ChatPage } from './pages/ChatPage';
import { SellerDashboardPage } from './pages/seller/SellerDashboardPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <StoreProvider>
            <CartProvider>
              <FavoritesProvider>
                <ChatProvider>
                  <Routes>
                    {/* Cloned TikTok Shop Routes */}
                    <Route path="/" element={<FerramentaPage />} />
                    <Route path="/ferramenta" element={<FerramentaPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/codigo-pagamento" element={<PixPaymentPage />} />
                    <Route path="/pix" element={<PixPaymentPage />} />
                    <Route path="/endereco" element={<EnderecoPage />} />

                    {/* Standard Market Routes */}
                    <Route path="/loja" element={<HomePage />} />
                    <Route path="/busca" element={<SearchPage />} />
                    <Route path="/categoria/:slug" element={<CategoryPage />} />
                    <Route path="/produto/:slug" element={<ProductDetailPage />} />
                    <Route path="/carrinho" element={<CartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/cadastro" element={<RegisterPage />} />
                    <Route path="/perfil" element={<ProfilePage />} />
                    <Route path="/pedidos" element={<OrdersPage />} />
                    <Route path="/pedido/:id" element={<OrderDetailPage />} />
                    <Route path="/favoritos" element={<FavoritesPage />} />
                    <Route path="/loja/:slug" element={<StorePage />} />
                    <Route path="/criador/:username" element={<CreatorPage />} />
                    <Route path="/videos" element={<VideoFeedPage />} />
                    <Route path="/live" element={<LiveShoppingPage />} />
                    <Route path="/chat" element={<ChatPage />} />

                    {/* Seller Panel Routes */}
                    <Route path="/vendedor" element={<SellerDashboardPage />} />
                    <Route path="/vendedor/produtos" element={<SellerDashboardPage />} />
                    <Route path="/vendedor/pedidos" element={<SellerDashboardPage />} />
                    <Route path="/vendedor/vendas" element={<SellerDashboardPage />} />
                    <Route path="/vendedor/estoque" element={<SellerDashboardPage />} />
                    <Route path="/vendedor/ofertas" element={<SellerDashboardPage />} />
                    <Route path="/vendedor/analytics" element={<SellerDashboardPage />} />

                    {/* Admin Panel Routes */}
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/usuarios" element={<AdminDashboardPage />} />
                    <Route path="/admin/vendedores" element={<AdminDashboardPage />} />
                    <Route path="/admin/produtos" element={<AdminDashboardPage />} />
                    <Route path="/admin/pedidos" element={<AdminDashboardPage />} />
                    <Route path="/admin/categorias" element={<AdminDashboardPage />} />
                    <Route path="/admin/banners" element={<AdminDashboardPage />} />
                    <Route path="/admin/ofertas" element={<AdminDashboardPage />} />
                    <Route path="/admin/analytics" element={<AdminDashboardPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/ferramenta" replace />} />
                  </Routes>
                </ChatProvider>
              </FavoritesProvider>
            </CartProvider>
          </StoreProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;

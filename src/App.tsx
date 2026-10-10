import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { useAuth } from './context/AuthContext';

// Client Pages
import { ExplorePage } from './pages/client/ExplorePage';
import { MapPage } from './pages/client/MapPage';
import { ServiceDetailPage } from './pages/client/ServiceDetailPage';
import { CheckoutPage } from './pages/client/CheckoutPage';
import { ConfirmationPage } from './pages/client/ConfirmationPage';
import { MyBookingsPage } from './pages/client/MyBookingsPage';

// Business Pages
import { DashboardPage } from './pages/business/DashboardPage';
import { PublishSlotPage } from './pages/business/PublishSlotPage';
import { PublishedSlotsPage } from './pages/business/PublishedSlotsPage';
import { ServicesCatalogPage } from './pages/business/ServicesCatalogPage';

// Auth Page & Security
import { LoginPage } from './pages/auth/LoginPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';

/** Guard global: redireciona para /login se não houver sessão ativa */
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isRealAuth, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isRealAuth) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MarketplaceProvider>
          <div className="min-h-screen flex flex-col bg-surface text-on-surface">
            <Header />
            <main className="flex-1 pt-[72px]">
              <Routes>
                {/* Auth Route — pública */}
                <Route path="/login" element={<LoginPage />} />

                {/* Client Routes — protegidas por AuthGuard */}
                <Route path="/" element={<AuthGuard><ExplorePage /></AuthGuard>} />
                <Route path="/explorar" element={<AuthGuard><ExplorePage /></AuthGuard>} />
                <Route path="/mapa" element={<AuthGuard><MapPage /></AuthGuard>} />
                <Route path="/servico/:slotId" element={<AuthGuard><ServiceDetailPage /></AuthGuard>} />
                <Route path="/checkout/:slotId" element={<AuthGuard><CheckoutPage /></AuthGuard>} />
                <Route path="/reserva-confirmada/:bookingId" element={<AuthGuard><ConfirmationPage /></AuthGuard>} />
                <Route path="/minhas-reservas" element={<AuthGuard><MyBookingsPage /></AuthGuard>} />

                {/* Business Routes — protegidas por papel + AuthGuard */}
                <Route
                  path="/negocios/dashboard"
                  element={
                    <AuthGuard>
                      <ProtectedRoute allowedRole="profissional">
                        <DashboardPage />
                      </ProtectedRoute>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/negocios/publicar"
                  element={
                    <AuthGuard>
                      <ProtectedRoute allowedRole="profissional">
                        <PublishSlotPage />
                      </ProtectedRoute>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/negocios/horarios"
                  element={
                    <AuthGuard>
                      <ProtectedRoute allowedRole="profissional">
                        <PublishedSlotsPage />
                      </ProtectedRoute>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/negocios/servicos"
                  element={
                    <AuthGuard>
                      <ProtectedRoute allowedRole="profissional">
                        <ServicesCatalogPage />
                      </ProtectedRoute>
                    </AuthGuard>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </MarketplaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

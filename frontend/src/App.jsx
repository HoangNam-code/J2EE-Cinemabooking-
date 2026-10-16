import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './store/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CineAiWidget } from './components/common/CineAiWidget';
import { AppRouter } from './router';

// Component to scroll to top automatically on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: '#0f1117',
              borderColor: '#262626',
              color: '#f8fafc',
            },
          }}
        />
        <div className="flex flex-col min-h-screen bg-[#0b0c10] text-neutral-100 font-sans selection:bg-amber-400/30 selection:text-amber-200">
          <Navbar />
          <main className="flex-1">
            <AppRouter />
          </main>
          <Footer />
          <CineAiWidget />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

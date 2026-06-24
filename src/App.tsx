import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from '@/hooks/useAppContext';
import BottomNav from '@/components/BottomNav';
import Toast from '@/components/Toast';
import StickyCartBar from '@/components/StickyCartBar';
import SplashScreen from '@/screens/SplashScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import HomeScreen from '@/screens/HomeScreen';
import CanteenDetailScreen from '@/screens/CanteenDetailScreen';
import CartScreen from '@/screens/CartScreen';
import PaymentScreen from '@/screens/PaymentScreen';
import OrderSuccessScreen from '@/screens/OrderSuccessScreen';
import OrderTrackingScreen from '@/screens/OrderTrackingScreen';
import OrdersScreen from '@/screens/OrdersScreen';
import GroupOrderScreen from '@/screens/GroupOrderScreen';
import OffersScreen from '@/screens/OffersScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import CanteenDashboardScreen from '@/screens/CanteenDashboardScreen';
import AdminScreen from '@/screens/AdminScreen';

const tabRoots: string[] = ['home', 'orders', 'offers', 'groupOrder', 'profile'];

function ScreenRouter() {
  const { state } = useApp();

  const variants = {
    enter: (direction: string) => ({
      x: direction === 'push' ? '100%' : direction === 'pop' ? '-30%' : 0,
      y: direction === 'modal' ? '100%' : 0,
      opacity: direction === 'modal' ? 1 : 0.8,
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'push' ? '-30%' : direction === 'pop' ? '100%' : 0,
      y: 0,
      opacity: direction === 'modal' ? 1 : 0.5,
    }),
  };

  const renderScreen = () => {
    switch (state.screen) {
      case 'splash': return <SplashScreen />;
      case 'onboarding': return <OnboardingScreen />;
      case 'home': return <HomeScreen />;
      case 'canteenDetail': return <CanteenDetailScreen />;
      case 'cart': return <CartScreen />;
      case 'payment': return <PaymentScreen />;
      case 'orderSuccess': return <OrderSuccessScreen />;
      case 'orderTracking': return <OrderTrackingScreen />;
      case 'orders': return <OrdersScreen />;
      case 'groupOrder': return <GroupOrderScreen />;
      case 'offers': return <OffersScreen />;
      case 'profile': return <ProfileScreen />;
      case 'canteenDashboard': return <CanteenDashboardScreen />;
      case 'admin': return <AdminScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <AnimatePresence mode="wait" custom={state.navDirection}>
      <motion.div
        key={state.screen}
        custom={state.navDirection}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'tween', duration: 0.3, ease: [0.65, 0, 0.35, 1] },
          y: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        className="h-full w-full"
      >
        {renderScreen()}
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const { state } = useApp();

  const showNav = tabRoots.includes(state.screen);
  const showCartBar = tabRoots.includes(state.screen) && state.screen !== 'cart';

  return (
    <div className="h-screen w-full bg-neutral-950 flex justify-center items-center p-0 md:p-4">
      {/* Mobile viewport container */}
      <div className="w-full max-w-[430px] h-[100dvh] md:h-[850px] bg-[#0F0F0F] rounded-none overflow-hidden shadow-2xl relative isolate flex flex-col">
        {/* Main content area */}
        <main className="flex-1 overflow-hidden relative">
          <ScreenRouter />
        </main>

        {/* Sticky Cart Bar */}
        {showCartBar && <StickyCartBar />}

        {/* Bottom Navigation */}
        {showNav && <BottomNav />}

        {/* Toast Notifications */}
        <Toast />

        {/* Floating particles background - only on home */}
        {state.screen === 'home' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {['🍔', '🍕', '☕', '🍩', '🌮', '🍜', '🍟', '🥤'].map((emoji, i) => (
              <span
                key={i}
                className="absolute text-lg select-none"
                style={{
                  left: `${(i * 12.5) % 100}%`,
                  opacity: 0.04,
                  animation: `float-slow ${18 + i * 3}s infinite linear`,
                  animationDelay: `${i * 2.5}s`,
                  fontSize: `${16 + (i % 3) * 8}px`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

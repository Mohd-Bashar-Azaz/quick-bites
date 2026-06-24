import { motion } from 'framer-motion';
import { Home, ClipboardList, Gift, Users, User } from 'lucide-react';
import { useApp } from '@/hooks/useAppContext';
import type { TabName } from '@/types';

const tabs: { key: TabName; icon: React.ElementType; label: string }[] = [
  { key: 'home', icon: Home, label: 'Home' },
  { key: 'orders', icon: ClipboardList, label: 'Orders' },
  { key: 'offers', icon: Gift, label: 'Offers' },
  { key: 'group', icon: Users, label: 'Group' },
  { key: 'profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const { state, dispatch } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-[430px]">
        <div
          className="flex items-center justify-around h-16 px-2"
          style={{
            background: 'rgba(15, 15, 15, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {tabs.map((tab) => {
            const isActive = state.activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => dispatch({ type: 'SET_TAB', tab: tab.key })}
                className="flex flex-col items-center justify-center gap-1 w-14 h-14 relative"
              >
                <motion.div
                  animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Icon
                    size={22}
                    className={isActive ? 'text-white' : 'text-[#6B6B6B]'}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                </motion.div>
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? 'text-white' : 'text-[#6B6B6B]'
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full food-gradient"
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)] bg-[rgba(15,15,15,0.85)]" />
      </div>
    </nav>
  );
}

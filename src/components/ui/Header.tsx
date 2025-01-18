import { LogOut } from 'lucide-react';
import { Button } from './Button';
import { LOGO_URL, APP_NAME } from '../../utils/constants';

interface HeaderProps {
  showNavigation?: boolean;
  onLogout?: () => void;
  onMenuToggle?: () => void;
  children?: React.ReactNode;
}

export function Header({ showNavigation = true, onLogout, onMenuToggle, children }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <div className="h-16 sm:h-20 bg-gradient-to-r from-[#105283] to-[#2D85B2] shadow-lg">
        <nav className="h-full px-4 sm:px-6">
          <div className="h-full mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showNavigation && onMenuToggle && (
                <button
                  onClick={onMenuToggle}
                  className="text-white p-2 rounded-md hover:bg-white/10 lg:hidden"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <div className="flex items-center">
                <img
                  src={LOGO_URL}
                  alt="Trans Kota Kita Logo"
                  className="h-8 sm:h-10 w-auto object-contain"
                />
                {/* <span className="ml-3 text-lg sm:text-xl font-bold text-white hidden sm:block">
                  {APP_NAME}
                </span> */}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {onLogout && (
                <Button
                  onClick={onLogout}
                  variant="secondary"
                  size="sm"
                  className="hidden sm:flex bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Keluar
                </Button>
              )}
              {children}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
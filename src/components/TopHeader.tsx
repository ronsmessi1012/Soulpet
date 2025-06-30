import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Settings, Coins, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TopHeader = () => {
  const [sidebarWidth, setSidebarWidth] = useState(288); // 18rem = 288px
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, logout, currentCoins, coinUpdateTrigger } = useAuth(); // NEW: Use currentCoins directly

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  useEffect(() => {
    // Listen for sidebar width changes
    const updateSidebarWidth = () => {
      const sidebar = document.querySelector('[data-sidebar]');
      if (sidebar) {
        const width = sidebar.getBoundingClientRect().width;
        setSidebarWidth(width);
        document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
      }
    };

    // Initial check
    updateSidebarWidth();

    // Listen for resize events
    window.addEventListener('resize', updateSidebarWidth);
    
    // Use MutationObserver to detect sidebar changes
    const observer = new MutationObserver(updateSidebarWidth);
    const sidebar = document.querySelector('[data-sidebar]');
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }

    // Listen for CSS variable changes
    const checkSidebarWidth = () => {
      const cssWidth = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width');
      if (cssWidth) {
        const numericWidth = parseFloat(cssWidth);
        if (numericWidth !== sidebarWidth) {
          setSidebarWidth(numericWidth);
        }
      }
    };

    const interval = setInterval(checkSidebarWidth, 100);

    return () => {
      window.removeEventListener('resize', updateSidebarWidth);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [sidebarWidth]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header 
      className="fixed top-0 right-0 z-20 h-16 backdrop-blur-2xl bg-white/80 border-b border-white/20 shadow-sm transition-all duration-300"
      style={{ 
        left: window.innerWidth >= 1024 ? `${sidebarWidth}px` : '0px',
        width: window.innerWidth >= 1024 ? `calc(100% - ${sidebarWidth}px)` : '100%'
      }}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search pets, creators, or experiences..."
              className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all duration-300 shadow-sm text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* ULTIMATE: Coins Display with direct currentCoins */}
          <div 
            key={`header-coins-${currentCoins}-${coinUpdateTrigger}-${Date.now()}`}
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 px-4 py-2 rounded-2xl border border-white/30 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
          >
            <Coins className="h-5 w-5 text-yellow-600 animate-pulse" />
            <span className="font-bold text-gray-800 text-lg">{currentCoins.toLocaleString()}</span>
            <span className="text-xs text-gray-600 hidden sm:block">Cuddle Coins</span>
          </div>
          
          <Link
            to="/settings"
            className="p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50/80 rounded-2xl transition-all duration-300 backdrop-blur-sm"
          >
            <Settings className="h-6 w-6" />
          </Link>
          
          {/* Enhanced User Profile with Dropdown */}
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-purple-50/80 rounded-2xl transition-all duration-300 group backdrop-blur-sm"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-gray-800 flex items-center">
                  {user?.name || 'Pet Parent'}
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </div>
                <div className="text-xs text-gray-500">Soul Keeper</div>
              </div>
            </button>

            {/* Enhanced User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 py-4 z-50 transform transition-all duration-300 scale-100 opacity-100">
                {/* User Info Header */}
                <div className="px-6 py-4 border-b border-white/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-bold text-gray-800">{user?.name}</div>
                      <div className="text-sm text-gray-600">{user?.email}</div>
                      <div className="flex items-center mt-2">
                        <div className="text-sm text-purple-600 font-semibold">Level {user?.level || 1}</div>
                        <div className="mx-2 text-gray-400">•</div>
                        <div className="text-sm text-gray-600">{user?.totalPets || 0} Pets</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ULTIMATE: Stats Section with direct currentCoins */}
                <div className="px-6 py-4 border-b border-white/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      key={`dropdown-coins-${currentCoins}-${coinUpdateTrigger}-${Date.now()}`}
                      className="text-center p-3 bg-gradient-to-r from-yellow-100/60 to-orange-100/60 rounded-2xl"
                    >
                      <div className="text-xl font-bold text-gray-800 flex items-center justify-center">
                        <Coins className="h-5 w-5 mr-1 text-yellow-600" />
                        {currentCoins.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Cuddle Coins</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-r from-purple-100/60 to-pink-100/60 rounded-2xl">
                      <div className="text-xl font-bold text-gray-800">{user?.totalPets || 0}</div>
                      <div className="text-xs text-gray-600">Soul Companions</div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/settings"
                    className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50/80 hover:text-purple-600 transition-all duration-300"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-5 w-5 mr-4" />
                    <div>
                      <div className="font-medium">Profile</div>
                      <div className="text-xs text-gray-500">Manage your account</div>
                    </div>
                  </Link>
                  
                  <Link
                    to="/soul-premium"
                    className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50/80 hover:text-purple-600 transition-all duration-300"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-5 w-5 mr-4" />
                    <div>
                      <div className="font-medium">Subscription</div>
                      <div className="text-xs text-gray-500">Premium features</div>
                    </div>
                  </Link>

                  <div className="border-t border-white/30 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-red-50/80 transition-all duration-300"
                    >
                      <LogOut className="h-5 w-5 mr-4" />
                      <div>
                        <div className="font-medium">Sign Out</div>
                        <div className="text-xs text-red-400">See you soon!</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
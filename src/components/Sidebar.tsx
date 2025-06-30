import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sparkles, ShoppingBag, Menu, X, Smile } from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Daily Wags', path: '/daily-wags', icon: Smile },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
  ];

  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsCollapsed(!isCollapsed);
  };

  // Update CSS variable when sidebar state changes
  useEffect(() => {
    const newWidth = isCollapsed ? '5rem' : '18rem';
    document.documentElement.style.setProperty('--sidebar-width', newWidth);
    
    // Add/remove collapsed class to body for additional styling
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isCollapsed]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 dark:border-gray-600/30 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
      >
        {isMobileOpen ? <X className="h-6 w-6 text-gray-700 dark:text-gray-300" /> : <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full z-30 transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
        data-sidebar
      >
        <div className="h-full backdrop-blur-2xl bg-white/95 dark:bg-gray-900/95 border-r border-white/30 dark:border-gray-700/30 shadow-2xl flex flex-col transition-colors duration-300">
          {/* Logo Section - Clickable to Toggle */}
          <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-white/30 dark:border-gray-700/30 flex ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <button 
              onClick={handleLogoClick}
              className={`flex items-center group ${isCollapsed ? 'justify-center' : 'space-x-4'} hover:scale-105 transition-all duration-300 outline-none focus:outline-none ${isCollapsed ? 'p-1' : 'p-2'}`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              style={{ border: 'none', background: 'none' }}
            >
              <div className="relative flex-shrink-0">
                <img
                  src="/new logo.jpg"
                  alt="Soul Pet AI"
                  className="w-12 h-12 rounded-full object-cover shadow-xl border-2 border-white/50 dark:border-gray-600/50 group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:border-purple-300 dark:group-hover:border-purple-400"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-sm transition-all duration-500"></div>
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-pink-700 transition-all duration-300">
                  Soul Pet AI
                </span>
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center ${isCollapsed ? 'justify-center px-3 py-4' : 'space-x-4 px-4 py-4'} rounded-2xl transition-all duration-300 relative overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:text-purple-600 dark:hover:text-purple-400'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${isActive ? 'opacity-0' : ''}`}></div>
                      
                      <Icon className={`h-6 w-6 flex-shrink-0 relative z-10 ${
                        isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                      }`} />
                      
                      {!isCollapsed && (
                        <span className="font-semibold text-lg relative z-10">{item.name}</span>
                      )}
                      
                      {isActive && !isCollapsed && (
                        <div className="absolute right-2 w-1 h-8 bg-white rounded-full"></div>
                      )}
                      
                      {/* Active indicator for collapsed state */}
                      {isActive && isCollapsed && (
                        <div className="absolute right-1 w-1 h-8 bg-white rounded-full"></div>
                      )}
                    </Link>
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Footer Info */}
          {!isCollapsed && (
            <div className="p-6 border-t border-white/30 dark:border-gray-700/30">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Made with ❤️</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">© 2024 Soul Pet AI</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
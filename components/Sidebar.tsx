import { LayoutDashboard, Wallet, Moon, Sun } from 'lucide-react';
import logoImage from 'figma:asset/64f66579314c70e88cf769a66abd30feafe9e919.png';

type View = 'dashboard' | 'accounts';
type Theme = 'dark' | 'light';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  theme: Theme;
  onThemeToggle: () => void;
}

export function Sidebar({ activeView, onViewChange, theme, onThemeToggle }: SidebarProps) {
  const isDark = theme === 'dark';

  return (
    <aside className={`w-20 ${isDark ? 'bg-sidebar-dark' : 'bg-sidebar-light'} flex flex-col items-center py-8 border-r ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      {/* Logo */}
      <div className="mb-12">
        <img 
          src={logoImage} 
          alt="AFW Capital" 
          className={`w-12 h-12 object-contain ${isDark ? 'brightness-0 invert' : ''}`}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-6">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group ${
            activeView === 'dashboard' 
              ? isDark ? 'bg-gray-800/50' : 'bg-gray-200/70'
              : 'hover:bg-gray-800/30'
          }`}
        >
          {activeView === 'dashboard' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-r-full"></div>
          )}
          <LayoutDashboard 
            size={24} 
            className={`${
              activeView === 'dashboard' 
                ? 'text-purple-400' 
                : isDark ? 'text-gray-400' : 'text-gray-600'
            } group-hover:text-purple-400 transition-colors`}
          />
        </button>

        <button
          onClick={() => onViewChange('accounts')}
          className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group ${
            activeView === 'accounts' 
              ? isDark ? 'bg-gray-800/50' : 'bg-gray-200/70'
              : 'hover:bg-gray-800/30'
          }`}
        >
          {activeView === 'accounts' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-r-full"></div>
          )}
          <Wallet 
            size={24} 
            className={`${
              activeView === 'accounts' 
                ? 'text-purple-400' 
                : isDark ? 'text-gray-400' : 'text-gray-600'
            } group-hover:text-purple-400 transition-colors`}
          />
        </button>
      </nav>

      {/* Theme Toggle */}
      <button
        onClick={onThemeToggle}
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isDark ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-gray-200/70 hover:bg-gray-300/70'
        }`}
      >
        {isDark ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} className="text-indigo-600" />
        )}
      </button>
    </aside>
  );
}

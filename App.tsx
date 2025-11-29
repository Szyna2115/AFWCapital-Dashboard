import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Accounts } from './components/Accounts';

type View = 'dashboard' | 'accounts';
type Theme = 'dark' | 'light';

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
      <Sidebar 
        activeView={activeView}
        onViewChange={setActiveView}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      <main className="flex-1 overflow-auto">
        {activeView === 'dashboard' ? (
          <Dashboard theme={theme} />
        ) : (
          <Accounts theme={theme} />
        )}
      </main>
    </div>
  );
}

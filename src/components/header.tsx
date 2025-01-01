import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';
import CitySearch from './ui/CitySearch';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={'/'}>
          <img 
            src="https://png.pngtree.com/png-clipart/20200710/original/pngtree-cloud-logo-vector-png-image_4135134.jpg" 
            alt="logo" 
            className="h-14" 
          />
        </Link>


        <CitySearch />

        <div>
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`p-2 bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer duration-500 ${isDark ? 'rotate-180' : 'rotate-0'}`}
          >
            {isDark ? (
              <Sun className="h-6 w-6 text-white rotate-0 transition-all" />
            ) : (
              <Moon className="h-6 w-6 text-yellow-500 rotate-0 transition-all" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

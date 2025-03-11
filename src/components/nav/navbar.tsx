'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  User, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  Heart, 
  Dog, 
  Info, 
  MessageSquare,
  Home,
  Search,
  ChevronDown
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore, useIsAuthenticated, useUser, useIsLoading, logAuthState, useForceUpdate } from '@/lib/stores/auth-store';
import { Fade } from '@/components/ui/animations/fade';
import { Motion } from '@/components/ui/animations/motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useInView } from '@/lib/hooks/use-animation';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from '@/components/theme-toggle';

interface NavLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  isMobileLink?: boolean;
  children?: React.ReactNode;
}

const NavLink = ({ href, label, icon, isMobileLink = false, children }: NavLinkProps) => {
  const pathname = usePathname();
  // Check if the current path starts with this link's href for more accurate active state
  // This handles nested routes better (e.g. /pets/123 should highlight the /pets link)
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
  const { ref: inViewRef, isInView } = useInView();
  
  return (
    <Motion 
      type="slide-down" 
      delay={isMobileLink ? 50 * Math.floor(Math.random() * 5) : 0}
      animate={isInView}
    >
      <div className="relative group" ref={inViewRef}>
        <Link 
          href={href}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 text-sm rounded-full transition-all duration-200",
            "relative hover:bg-primary/5 focus-visible:bg-primary/5 outline-none",
            isActive 
              ? "text-primary font-medium" 
              : "text-foreground/80 hover:text-foreground focus-visible:text-foreground"
          )}
        >
          {icon && (
            <span className={cn(
              "text-current", 
              isActive ? "text-primary" : "text-foreground/70 group-hover:text-foreground/90"
            )}>
              {icon}
            </span>
          )}
          <span className={isMobileLink ? "font-medium" : ""}>{label}</span>
          {children && <ChevronDown size={16} className="ml-1 opacity-70" />}
          {isActive && (
            <span className="sr-only">(current page)</span>
          )}
        </Link>
        
        {/* Desktop active indicator - subtle pill highlight */}
        {!isMobileLink && (
          <span className={cn(
            "absolute inset-0 rounded-full -z-10 transition-all duration-200",
            isActive ? "bg-primary/10" : "bg-transparent"
          )}></span>
        )}
        
        {/* Mobile active indicator - visible only on mobile */}
        {isMobileLink && isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-full" />
        )}
        
        {/* Render children if any (for dropdown menus) */}
        {children}
      </div>
    </Motion>
  );
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // For controlling the mobile menu and hamburger button state
  const [menuState, setMenuState] = useState<'closed' | 'closing' | 'open'>('closed');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Keep for backward compatibility
  
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Get auth state from Zustand store
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useIsLoading();
  const forceUpdate = useForceUpdate(); 
  const signOut = useAuthStore((state) => state.signOut);

  // Track scroll position to add shadow and background opacity
  useEffect(() => {
    const handleScroll = () => {
      const scrollOffset = window.scrollY;
      setIsScrolled(scrollOffset > 10);
    };

    // Add initial check and event listener with passive option for better performance
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fix hydration mismatch by only rendering auth-dependent UI after mount
  useEffect(() => {
    setMounted(true);
    logAuthState();
  }, [isAuthenticated, user, isLoading, forceUpdate]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close mobile menu when clicking outside
      if (
        menuState === 'open' &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        toggleMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuState]);

  // Close mobile menu when route changes
  useEffect(() => {
    if (menuState === 'open') {
      toggleMobileMenu();
    }
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      logAuthState();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Force re-render on auth state change
  useEffect(() => {
    if (mounted && isAuthenticated) {
      const timeout = setTimeout(() => {
        router.refresh();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [forceUpdate, mounted, router, isAuthenticated]);

  // Render different UI based on authentication state
  const renderAuthUI = () => {
    if (!mounted) {
      return <Skeleton variant="circular" width={40} height={40} className="rounded-full" />;
    }
    
    if (isLoading) {
      return (
        <div className="h-10 w-10 rounded-full bg-primary-lighter/15 flex items-center justify-center">
          <Spinner size="sm" className="text-primary" />
        </div>
      );
    }
    
    if (isAuthenticated && user) {
      // User is authenticated
      return (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                type="button"
                className="inline-flex items-center justify-start space-x-2 bg-transparent rounded-lg hover:bg-gray-50 px-3 py-1.5 text-sm font-medium"
                aria-label="User menu"
              >
                <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-primary text-white">
                  <User size={18} />
                </div>
                <div className="inline-block">{user.email?.split('@')[0] || 'Profile'}</div>
                <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1 p-1">
              <div className="px-3 py-2 mb-1 border-b border-gray-100">
                <p className="font-medium text-sm">{user.email?.split('@')[0] || 'Profile'}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{user.email}</p>
              </div>
              <DropdownMenuItem asChild>
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 cursor-pointer rounded-md p-2 hover:bg-gray-50"
                >
                  <User size={16} className="text-gray-500" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex items-center gap-2 cursor-pointer rounded-md p-2 text-red-500 hover:bg-red-50"
              >
                {isSigningOut ? (
                  <>
                    <Spinner size="xs" className="text-red-500" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
    
    // User is not authenticated
    return (
      <div className="inline-flex items-center gap-2">
        <button 
          type="button"
          className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
          onClick={() => router.push('/login')}
        >
          <span className="inline-block">Log in</span>
        </button>
        
        <button 
          type="button"
          className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium bg-primary hover:bg-primary-dark text-white rounded-lg"
          onClick={() => router.push('/signup')}
        >
          <span className="inline-block">Sign up</span>
        </button>
      </div>
    );
  };

  const mainNavItems = [
    { href: '/', label: 'Home', icon: <Home size={18} /> },
    { href: '/pets', label: 'Pets', icon: <Dog size={18} /> },
    { href: '/about', label: 'About', icon: <Info size={18} /> },
    { href: '/contact', label: 'Contact', icon: <MessageSquare size={18} /> },
  ];

  // Open or close the mobile menu
  const toggleMobileMenu = () => {
    if (menuState === 'closed') {
      setMenuState('open');
      setIsMobileMenuOpen(true); // For backward compatibility
    } else if (menuState === 'open') {
      setMenuState('closing');
      setIsMobileMenuOpen(false); // For backward compatibility
      // After animation completes, set to fully closed
      setTimeout(() => {
        setMenuState('closed');
      }, 300); // Match this with the transition duration
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Logo and brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Dog className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AdoptMe</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/" label="Home" icon={<Home size={18} />} />
          <NavLink href="/pets" label="Find Pets" icon={<Search size={18} />} />
          <NavLink href="/about" label="About" icon={<Info size={18} />} />
          <NavLink href="/contact" label="Contact" icon={<MessageSquare size={18} />} />
          {isAuthenticated && (
            <NavLink href="/favorites" label="Favorites" icon={<Heart size={18} />} />
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Auth UI (login/profile) */}
          {renderAuthUI()}

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="inline-flex md:hidden items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            aria-expanded={menuState === 'open'}
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">
              {menuState === 'open' ? 'Close main menu' : 'Open main menu'}
            </span>
            {menuState === 'open' ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className={cn(
          "md:hidden bg-white border-t border-gray-100 shadow-md",
          "fixed top-16 left-0 right-0 bottom-0 z-40 overflow-y-auto",
          menuState === 'open' || menuState === 'closing'
            ? "translate-x-0 opacity-100" 
            : "translate-x-full opacity-0 pointer-events-none",
          menuState === 'closing' && "animate-slide-out-right"
        )}
        style={{ transition: "transform 0.3s ease, opacity 0.3s ease" }}
        aria-hidden={menuState !== 'open'}
      >
        <div className="relative p-4">
          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full w-8 h-8 text-gray-500 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>

          {/* Mobile search input */}
          <div className="mb-6 pt-2 relative">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3 text-gray-400" />
              <Input
                id="search-mobile"
                type="search"
                placeholder="Search for pets..."
                className="w-full pl-9 pr-3 h-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = e.currentTarget.value;
                    if (value) {
                      router.push(`/search?q=${encodeURIComponent(value)}`);
                      setIsMobileMenuOpen(false);
                    }
                  }
                }}
              />
            </div>
            <p className="text-gray-400 mt-2 ml-2 text-sm">
              Encuentra tu compañero perfecto hoy
            </p>
          </div>
          
          <nav className="mt-8">
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg",
                      pathname === item.href 
                        ? "text-primary bg-primary/5 font-medium" 
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                    onClick={toggleMobileMenu}
                  >
                    {item.icon && (
                      <span className="text-gray-400">{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Show auth UI in mobile menu */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              {isAuthenticated && user && (
                <>
                  <div className="px-3 py-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary text-white">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.email?.split('@')[0] || 'Profile'}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                    onClick={toggleMobileMenu}
                  >
                    <span className="inline-flex text-gray-400"><User size={18} /></span>
                    <span className="inline-block">My Profile</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut} 
                    className="w-full justify-start text-red-500 hover:bg-red-50/50 gap-2 rounded-lg px-3 py-2 mt-1"
                    disabled={isSigningOut}
                  >
                    <span className="inline-flex text-red-400"><LogOut size={18} /></span>
                    <span className="inline-block">{isSigningOut ? "Signing out..." : "Sign out"}</span>
                  </Button>
                </>
              )}
              {!isAuthenticated && renderAuthUI()}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
} 
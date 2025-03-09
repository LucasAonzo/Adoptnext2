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
      <div className="relative group">
        <Link 
          href={href} 
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adopt-purple-300 focus-visible:ring-offset-2",
            isMobileLink 
              ? "text-base w-full"
              : "text-sm hover:scale-105 transform duration-200",
            isActive 
              ? "text-adopt-purple-600 bg-adopt-purple-50 dark:bg-adopt-purple-900/20" 
              : "text-adopt-gray-700 hover:text-adopt-purple-600 hover:bg-adopt-purple-50/50"
          )}
          aria-current={isActive ? "page" : undefined}
          ref={el => {
            if (el) inViewRef.current = el as unknown as HTMLDivElement;
          }}
        >
          {icon && <span className={cn(
            "transition-colors",
            isActive ? "text-adopt-purple-600" : "text-adopt-gray-500 group-hover:text-adopt-purple-600"
          )}>
            {icon}
          </span>}
          <span>{label}</span>
          {children && <ChevronDown size={16} className="ml-1" />}
          {isActive && (
            <span className="sr-only">(current page)</span>
          )}
        </Link>
        
        {/* Active indicator bar - visible only on desktop */}
        {!isMobileLink && (
          <div className={cn(
            "absolute bottom-0 left-0 h-0.5 bg-adopt-purple-500 rounded-full transition-all duration-300 ease-in-out",
            isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
          )} />
        )}
        
        {/* Mobile active indicator - visible only on mobile */}
        {isMobileLink && isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-adopt-purple-500 rounded-r-full" />
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fix hydration mismatch by only rendering auth-dependent UI after mount
  useEffect(() => {
    setMounted(true);
    logAuthState();
  }, [isAuthenticated, user, isLoading, forceUpdate]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
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
      return <Skeleton variant="circular" width={36} height={36} />;
    }
    
    if (isLoading) {
      return (
        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
          <Spinner size="sm" />
        </div>
      );
    }
    
    if (isAuthenticated && user) {
      // User is authenticated
      return (
        <div className="flex items-center gap-3">
          <Link 
            href="/profile" 
            className={cn(
              "flex items-center gap-2 hover:scale-105 transform transition-all duration-200 rounded-full",
              "p-1 pr-2 md:pr-3 hover:bg-adopt-purple-50",
              pathname.startsWith('/profile') ? "ring-2 ring-adopt-purple-300" : ""
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-adopt-purple-500 text-white shadow-sm">
              <User size={18} />
            </div>
            <span className="hidden md:inline-block font-medium text-sm text-adopt-gray-700">
              {user.email?.split('@')[0] || 'User'}
            </span>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut} 
            className={cn(
              "text-adopt-gray-600 hover:text-adopt-gray-900 gap-1.5 rounded-lg",
              "hover:bg-adopt-amber-50 hover:text-adopt-amber-700 transition-colors"
            )}
            disabled={isSigningOut}
            aria-label="Sign out"
          >
            {isSigningOut ? (
              <div className="flex items-center gap-2">
                <Spinner size="xs" />
                <span className="hidden md:inline-block">Signing out...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogOut size={16} />
                <span className="hidden md:inline-block">Logout</span>
              </div>
            )}
          </Button>
        </div>
      );
    }
    
    // User is not authenticated
    return (
      <Link href="/auth">
        <Button 
          variant="default" 
          size="sm" 
          className="gap-1.5 shadow-sm hover:scale-105 transform transition-all duration-200 bg-adopt-purple-600 hover:bg-adopt-purple-700 text-white"
          aria-label="Login or Sign up"
        >
          <LogIn size={16} />
          <span>Login</span>
        </Button>
      </Link>
    );
  };

  const mainNavItems = [
    { href: '/', label: 'Home', icon: <Home size={18} /> },
    { href: '/pets', label: 'Pets', icon: <Dog size={18} /> },
    { href: '/about', label: 'About', icon: <Info size={18} /> },
    { href: '/contact', label: 'Contact', icon: <MessageSquare size={18} /> },
  ];

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "backdrop-blur-lg supports-[backdrop-filter]:bg-background/80",
        isScrolled ? 
          "border-b border-adopt-purple-100 shadow-sm bg-white/95" : 
          "bg-white/50 border-b border-adopt-purple-100/40"
      )}
      role="banner"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              className="flex items-center space-x-2 transition-all duration-200 hover:scale-105 transform"
              aria-label="Adopt Homepage"
            >
              <div className="relative">
                <span className="bg-adopt-purple-500 rounded-lg w-9 h-9 flex items-center justify-center shadow-sm">
                  <Dog size={22} className="text-white" />
                </span>
                {/* Improved subtle glow effect */}
                <span className="absolute -inset-0.5 bg-adopt-purple-500/30 rounded-lg blur-sm -z-10"></span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-adopt-purple-600 to-adopt-purple-700 bg-clip-text text-transparent">
                Adopt
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <ul className="flex space-x-1 items-center">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <NavLink 
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                  />
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Right Section with Search & Auth */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "text-adopt-gray-500 hover:text-adopt-purple-600 rounded-full transition-colors",
                "hover:bg-adopt-purple-50 h-9 w-9"
              )}
              aria-label="Search"
            >
              <Search size={18} />
            </Button>
            
            {/* Show favorites link on desktop */}
            <div className="hidden md:block">
              <NavLink 
                href="/favorites" 
                label="Favorites" 
                icon={<Heart size={18} />}
              />
            </div>
            
            {renderAuthUI()}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden rounded-full transition-transform",
                "hover:bg-adopt-purple-50 text-adopt-gray-600 h-9 w-9",
                isMobileMenuOpen ? "bg-adopt-purple-50 rotate-90" : ""
              )}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <Fade show={isMobileMenuOpen} duration="fast">
        <div 
          id="mobile-menu"
          ref={mobileMenuRef}
          className="md:hidden border-t border-adopt-purple-100 bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/90 shadow-sm animate-slideDown"
          aria-hidden={!isMobileMenuOpen}
        >
          <nav className="container px-4">
            <ul className="py-4 flex flex-col space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <NavLink 
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    isMobileLink
                  />
                </li>
              ))}
              
              {/* Mobile-only links */}
              <li className="pt-2 mt-2 border-t border-adopt-purple-100/50">
                <NavLink 
                  href="/favorites" 
                  label="Favorites" 
                  icon={<Heart size={18} />}
                  isMobileLink
                />
              </li>
            </ul>
          </nav>
        </div>
      </Fade>
    </header>
  );
} 
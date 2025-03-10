'use client';

import Link from 'next/link';
import { Dog, Heart, Mail, MessageSquare, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInView } from '@/lib/hooks/use-animation';
import { Motion, MotionGroup } from '@/components/ui/animations/motion';

interface FooterColumnProps {
  title: string;
  links: Array<{
    href: string;
    label: string;
    external?: boolean;
  }>;
  delay?: number;
}

function FooterColumn({ title, links, delay = 0 }: FooterColumnProps) {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  
  return (
    <div className="space-y-4" ref={ref}>
      <Motion type="fade" animate={isInView} delay={delay}>
        <h3 className="text-lg font-semibold text-foreground/90">{title}</h3>
      </Motion>
      
      <ul className="space-y-2 text-sm">
        <MotionGroup animate={isInView} staggerDelay={75} initialDelay={delay + 100}>
          {links.map((link) => (
            <Motion key={link.href} type="slide-up">
              <li>
                <Link 
                  href={link.href}
                  className="text-foreground/70 hover:text-primary transition-colors flex items-center gap-1.5 hover-lift w-fit"
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                  {link.external && (
                    <ExternalLink size={12} className="inline opacity-70" />
                  )}
                </Link>
              </li>
            </Motion>
          ))}
        </MotionGroup>
      </ul>
    </div>
  );
}

export function Footer() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { href: "/", label: "Home" },
        { href: "/pets", label: "Adopt a Pet" },
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
      ]
    },
    {
      title: "Resources",
      links: [
        { href: "/faqs", label: "FAQs" },
        { href: "/blog", label: "Blog" },
        { href: "/how-it-works", label: "How It Works" },
        { href: "https://www.aspca.org/", label: "ASPCA", external: true },
      ]
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/cookies", label: "Cookie Policy" },
        { href: "/accessibility", label: "Accessibility" },
      ]
    },
  ];

  return (
    <footer className="bg-primary-lighter/10 border-t border-primary-lighter/30" ref={ref}>
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link href="/" className="inline-block group relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
                  <Dog size={22} />
                </span>
                <span className="absolute -inset-0.5 rounded-lg bg-primary/30 blur-sm group-hover:bg-primary/40 transition-all duration-300 -z-10"></span>
              </Link>
            </div>
            
            <h2 className="text-xl font-bold mb-4">Adopt</h2>
            
            <p className="text-foreground/70 max-w-md">
              Adoptar una mascota es más que un acto de bondad; es el comienzo de una relación llena de amor incondicional y momentos inolvidables.
            </p>
            
            <div className="mt-8">
              <h3 className="font-medium text-foreground/90">Subscribe to our newsletter</h3>
              <form className="mt-2 flex gap-2 max-w-md">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white border-primary-lighter/50 focus-visible:ring-primary-lighter"
                />
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-foreground/60">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
          
          {/* Grid for the link groups */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {footerSections.map((section, index) => (
                <FooterColumn 
                  key={section.title} 
                  title={section.title} 
                  links={section.links} 
                  delay={index * 50}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t border-primary-lighter/30 text-sm text-foreground/60">
          <div className="flex gap-4">
            <span>© 2023 Adopt. All rights reserved.</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="https://github.com" className="text-foreground/60 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
            </Link>
            <span className="text-xs">Made with <Heart size={12} className="inline text-primary" /> for pets</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 
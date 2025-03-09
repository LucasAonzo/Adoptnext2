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
        <h3 className="text-lg font-semibold text-adopt-gray-800">{title}</h3>
      </Motion>
      
      <ul className="space-y-2 text-sm">
        <MotionGroup animate={isInView} staggerDelay={75} initialDelay={delay + 100}>
          {links.map((link) => (
            <Motion key={link.href} type="slide-up">
              <li>
                <Link 
                  href={link.href}
                  className="text-adopt-gray-600 hover:text-adopt-purple-600 transition-colors flex items-center gap-1.5 hover-lift w-fit"
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
    <footer className="bg-adopt-purple-50/50 border-t border-adopt-purple-100" ref={ref}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 lg:gap-12">
          {/* Brand & Subscribe Column */}
          <div className="space-y-6 md:col-span-4 lg:col-span-1">
            <Motion type="fade" animate={isInView}>
              <Link href="/" className="flex items-center gap-2 w-fit group">
                <div className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-adopt-purple-500 text-white shadow-sm">
                    <Dog size={24} />
                  </span>
                  <span className="absolute -inset-0.5 rounded-lg bg-adopt-purple-500/30 blur-sm group-hover:bg-adopt-purple-500/40 transition-all duration-300 -z-10"></span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-adopt-purple-600 to-adopt-purple-700 bg-clip-text text-transparent">
                  Adopt
                </span>
              </Link>
            </Motion>

            <Motion type="slide-up" animate={isInView} delay={100}>
              <p className="text-adopt-gray-600 max-w-md">
                Find your perfect pet companion. We connect loving homes with pets in need of adoption.
              </p>
            </Motion>

            <Motion type="slide-up" animate={isInView} delay={150}>
              <div className="space-y-3 max-w-md">
                <h3 className="font-medium text-adopt-gray-800">Subscribe to our newsletter</h3>
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-white border-adopt-purple-200 focus-visible:ring-adopt-purple-400"
                  />
                  <Button 
                    size="default" 
                    className="bg-adopt-purple-600 hover:bg-adopt-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Mail size={16} className="mr-2" />
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-adopt-gray-500">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates.
                </p>
              </div>
            </Motion>
          </div>

          {/* Link Columns */}
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

        {/* Bottom Section */}
        <Motion type="fade" animate={isInView} delay={300}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t border-adopt-purple-100 text-sm text-adopt-gray-500">
            <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start">
              <span>&copy; {currentYear} Adopt. All rights reserved.</span>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:text-adopt-purple-600 transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-adopt-purple-600 transition-colors">Terms</Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="https://github.com" className="text-adopt-gray-500 hover:text-adopt-purple-600 transition-colors" target="_blank" rel="noopener noreferrer">
                <Github size={18} />
              </Link>
              <span className="text-xs">Made with <Heart size={12} className="inline text-adopt-purple-500" /> for pets</span>
            </div>
          </div>
        </Motion>
      </div>
    </footer>
  );
} 
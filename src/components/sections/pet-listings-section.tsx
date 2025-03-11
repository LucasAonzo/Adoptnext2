'use client'

import { PetList } from "@/components/pets/pet-list"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PetCard } from "@/components/cards/pet-card"
import { usePetsWithFilters } from "@/hooks/usePetsWithFilters"
import { Motion } from "@/components/ui/animations/motion"
import type { Pet } from "@/types/pets"
import Link from "next/link"
import "@/styles/animations.css"
import { RiPawPrintFill } from "react-icons/ri"

interface PetListingsSectionProps {
  pets: Pet[]
}

export function PetListingsSection({ pets }: PetListingsSectionProps) {
  return (
    <section 
      className="py-20 sm:py-28 relative overflow-hidden min-h-[85vh] flex items-center" 
      aria-labelledby="available-pets-heading"
    >
      {/* Modern layered background with subtle animations */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary-lighter/5 to-background/95 z-0"></div>
      <div 
        className="absolute inset-0 opacity-[0.04] z-0 bg-[url('/images/paw-pattern.svg')] bg-repeat bg-[length:42px_42px]"
        style={{ animation: 'patternFloat 40s linear infinite' }}
      ></div>

      {/* Subtle decorative elements with gentle animations */}
      <div className="absolute top-1/4 right-[10%] w-64 h-64 bg-secondary-light/10 rounded-full blur-[80px] animate-pulse" 
           style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-1/4 left-[5%] w-80 h-80 bg-primary-lighter/15 rounded-full blur-[100px] animate-pulse" 
           style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
      <div className="absolute top-[15%] left-[25%] w-48 h-48 bg-accent-light/10 rounded-full blur-[70px] animate-pulse" 
           style={{ animationDuration: '10s', animationDelay: '0.5s' }}></div>

      {/* Elegant top wave */}
      <div className="absolute top-0 left-0 right-0 h-20 opacity-20" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,0 C300,80 600,100 900,80 C1050,70 1150,40 1200,20 L1200,120 L0,120 Z"
            fill="currentColor"
            className="text-primary-light"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Motion type="slide-up" className="space-y-16">
          {/* Modern, centered header with enhanced typography */}
          <div className="text-center max-w-4xl mx-auto pt-8 sm:pt-0"> 
            <span className="inline-block px-5 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 mt-4 sm:mt-0 shadow-sm transform hover:scale-105 transition-all duration-300 ease-out">
              Encuentra tu compañero perfecto
            </span>
            
            <h2
              id="available-pets-heading"
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-8 tracking-tight"
            >
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">Mascotas</span>
              <span className="relative mx-4 inline-block">
                <span className="bg-gradient-to-r from-primary-dark to-primary bg-clip-text text-transparent">
                  Disponibles
                </span>
                <svg className="absolute -bottom-3 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path 
                    d="M0,5 Q25,2 50,5 T100,5" 
                    stroke="url(#gradient)" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    fill="none" 
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h2>
            
            <p className="text-foreground/75 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto mt-6">
              Encuentra a tu nuevo mejor amigo entre nuestras adorables mascotas que esperan un hogar. 
              <span className="hidden sm:inline"> Cada una tiene una personalidad única lista para llenar tu vida de alegría y amor incondicional.</span>
            </p>
          </div>

          {/* Modern card container with subtle effects */}
          <div className="relative group">
            {/* Container decorative elements */}
            <div className="absolute inset-0 bg-white/60 rounded-3xl transform -rotate-1 scale-[1.02] -translate-y-2 opacity-70 
                            shadow-xl shadow-primary-lighter/10 transition-all duration-500 ease-out 
                            group-hover:scale-[1.03] group-hover:-rotate-2 group-hover:shadow-2xl group-hover:shadow-primary-lighter/20"></div>
            
            <div className="relative rounded-2xl bg-white/90 backdrop-blur-sm border border-primary-lighter/20 
                           p-6 sm:p-8 md:p-10 shadow-lg shadow-primary-lighter/5 
                           transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-lighter/10 rounded-full blur-[60px] -translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-light/10 rounded-full blur-[60px] translate-x-10 translate-y-10"></div>
              
              <div className="relative z-10">
                <PetList pets={pets} />
              </div>
            </div>
          </div>

          {/* Modern CTA button area */}
          <div className="text-center">
            <Motion type="slide-up" delay={0.2}>
              <div className="inline-block relative group">
                {/* Button glow effect - improved accessibility and naming */}
                <div 
                  className="absolute inset-0 bg-adopt-purple-400/20 rounded-full blur-md opacity-70 transition-opacity duration-300 group-hover:opacity-90"
                  aria-hidden="true"
                  data-testid="button-glow-effect"
                ></div>
                
                 <Button
                   variant="primary"
                   size="lg-pill"
                   className="relative z-10 shadow-md hover:shadow-lg transition-all duration-300 px-8 py-3 !bg-adopt-purple-600 !text-white hover:!bg-adopt-purple-700"
                   asChild
                   aria-label="Ver todas las mascotas disponibles para adopción"
                 >
                  <Link href="/pets" className="flex items-center gap-2 font-medium group">
                    <span>Ver Todas las Mascotas</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="transition-transform duration-300 transform group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                 </Button>
              </div>
             </Motion>
           </div>
        </Motion>
      </div>
    </section>
  )
} 
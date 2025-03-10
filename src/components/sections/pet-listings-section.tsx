'use client'

import { PetList } from "@/components/pets/pet-list"
import { Button } from "@/components/ui/button"
import { Motion } from "@/components/ui/animations/motion"
import type { Pet } from "@/types/pets"
import Link from "next/link"
import "@/styles/animations.css"

interface PetListingsSectionProps {
  pets: Pet[]
}

export function PetListingsSection({ pets }: PetListingsSectionProps) {
  return (
    <section 
      className="py-16 sm:py-24 relative overflow-hidden min-h-[80vh] flex items-center" 
      aria-labelledby="available-pets-heading"
    >
      {/* Enhanced layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-lighter/20 via-white/40 to-white/90 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-complementary/5 z-0"></div>
      <div 
        className="absolute inset-0 opacity-[0.07] z-0 bg-[url('/images/paw-pattern.svg')] bg-repeat bg-[length:48px_48px]"
        style={{ animation: 'patternFloat 30s linear infinite' }}
      ></div>

      {/* Enhanced decorative elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-complementary/15 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-primary-lighter/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-white/50 to-transparent z-0"></div>

      {/* Enhanced wave pattern */}
      <div className="absolute top-0 left-0 right-0 h-16 opacity-30 transform rotate-180" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,0 C150,90 400,100 650,40 C900,-20 1050,50 1200,80 L1200,120 L0,120 Z"
            fill="currentColor"
            className="text-primary-lighter"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <Motion type="slide-up" className="space-y-12 md:space-y-16">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 transform hover:scale-105 transition-transform duration-300">
              Encuentra tu compañero perfecto
            </span>
            <h2
              id="available-pets-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"
            >
              Mascotas <span className="relative inline-block">
                Disponibles
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
                  <path d="M0,5 Q25,0 50,5 T100,5" stroke="currentColor" strokeWidth="4" fill="none" className="text-complementary/60" />
                </svg>
              </span>
            </h2>
            <p className="text-foreground/80 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
              Encuentra a tu nuevo mejor amigo entre nuestras adorables mascotas que esperan un hogar. Cada una tiene
              una personalidad única lista para llenar tu vida de alegría y amor incondicional.
            </p>
          </div>

          <div className="relative group">
            {/* Container decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-primary-lighter/20 rounded-2xl transform -rotate-1 scale-[1.02] opacity-70 transition-transform duration-300 group-hover:scale-[1.03]"></div>
            
            <div className="relative rounded-2xl border border-primary-lighter/30 bg-white/90 backdrop-blur-xl p-8 md:p-10 shadow-xl shadow-primary-lighter/10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-lighter/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-primary-lighter/10 rounded-2xl opacity-50"></div>
              <div className="relative z-10">
                <PetList pets={pets} />
              </div>
            </div>
          </div>

          <div className="text-center">
            <Motion type="slide-up" delay={0.2}>
              <Button
                className="group relative bg-primary hover:bg-primary-dark text-white rounded-full px-8 py-4 text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-1 transition-all duration-300"
                aria-label="Ver todas las mascotas disponibles para adopción"
              >
                <Link href="/pets" className="flex items-center gap-3">
                  Ver Todas las Mascotas
                  <span className="relative w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute inset-0"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </Button>
            </Motion>
          </div>
        </Motion>
      </div>
    </section>
  )
} 
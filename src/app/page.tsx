import { PetList } from '@/components/pets/pet-list';
import { supabase } from '@/lib/supabase';
import { type Pet } from '@/types/pets';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Motion } from '@/components/ui/animations/motion';
import { Dog, Heart, Search, CheckCircle, Info } from 'lucide-react';
import Image from 'next/image';
import { ui } from '@/lib/ui.config';

/**
 * Fetches pets from the database
 * @returns {Promise<Pet[]>} List of pets
 */
async function getPets() {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Pet[];
}

export default async function Home() {
  const pets = await getPets();

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden min-h-[650px] flex items-center" 
        aria-labelledby="hero-heading"
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-adopt-purple-100/90 to-adopt-purple-50/80 z-0"></div>
        
        {/* Background pattern (subtle) */}
        <div className="absolute inset-0 opacity-15 z-0 bg-[url('/images/paw-pattern.svg')] bg-repeat bg-center"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-adopt-purple-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-adopt-teal-200/30 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
            <div className="max-w-xl">
              <div className="animate-fadeInUp space-y-6">
                <span 
                  className="inline-block bg-adopt-purple-100 backdrop-blur-sm px-4 py-1.5 rounded-full text-adopt-purple-800 font-medium mb-2 shadow-sm"
                  style={{ 
                    backgroundColor: `color-mix(in oklch, ${ui.colors.primary.lighter} 90%, transparent)`,
                    color: ui.colors.primary.dark
                  }}
                >
                  Encuentra tu compañero perfecto hoy
                </span>
                
                <h1 
                  id="hero-heading"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-adopt-gray-900"
                >
                  Un Amigo Más
                  <span 
                    className="block text-adopt-purple-600 mt-2 md:mt-3"
                    style={{ color: ui.colors.primary.DEFAULT }}
                  >
                    Miles de Alegrías
                  </span>
                </h1>
                
                <div 
                  className="w-20 h-1.5 bg-adopt-amber-400 rounded-full"
                  style={{ backgroundColor: ui.colors.complementary.DEFAULT }}
                  aria-hidden="true"
                ></div>
                
                <p className="text-adopt-gray-600 text-base md:text-lg leading-relaxed max-w-[95%]">
                  Tener una mascota significa tener más alegría, un nuevo amigo, una persona feliz que siempre estará contigo para divertirse.
                  ¡Tenemos más de 200 mascotas diferentes que pueden satisfacer tus necesidades!
                </p>
                
                <div className="flex flex-wrap gap-4 md:gap-6 items-center">
                  <Button 
                    className="bg-adopt-purple-600 hover:bg-adopt-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px] rounded-full"
                    style={{ 
                      backgroundColor: `var(--primary)`,
                      transition: `all ${ui.animation.duration.default} ${ui.animation.easing.default}`  
                    }}
                    aria-label="Ver todas las mascotas disponibles"
                  >
                    <Link href="/pets" className="inline-flex items-center justify-center gap-2 text-base px-6 sm:px-8 py-2.5 sm:py-3">
                      <span>Ver Mascotas</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-y-[1px]" aria-hidden="true">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="bg-white/90 hover:bg-adopt-purple-50 border-2 border-adopt-purple-200 text-adopt-purple-700 transition-all duration-200 hover:translate-y-[-2px] rounded-full"
                    style={{ 
                      borderColor: `color-mix(in oklch, ${ui.colors.primary.lighter} 80%, transparent)`,
                      color: ui.colors.primary.DEFAULT,
                      transition: `all ${ui.animation.duration.default} ${ui.animation.easing.default}`
                    }}
                    aria-label="Conocer más sobre el proceso de adopción"
                  >
                    <Link href="/about" className="inline-flex items-center justify-center gap-2 text-base px-6 sm:px-8 py-2.5 sm:py-3">
                      <span>Conocer Más</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-y-[-1px]" aria-hidden="true">
                        <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </Button>
                </div>
                
                {/* Trust indicators */}
                <div 
                  className="mt-8 md:mt-12 flex gap-4 md:gap-6 items-center p-4 md:p-5 bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm"
                  role="presentation"
                  aria-label="Estadísticas de adopción"
                >
                  <div className="flex -space-x-4 rtl:space-x-reverse">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white overflow-hidden bg-adopt-purple-200 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <div className="w-full h-full bg-adopt-gray-100"></div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-adopt-gray-800 font-semibold">+2,500 Personas</p>
                    <p className="text-adopt-gray-600 text-sm">Ya han adoptado</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative mt-8 md:mt-0 animate-fadeIn">
              <div className="relative h-[350px] sm:h-[400px] md:h-[550px] rounded-2xl overflow-hidden shadow-xl group">
                <Image 
                  src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1169&auto=format&fit=crop" 
                  alt="Perro feliz con su dueño, mostrando el vínculo que se crea en la adopción"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 50vw"
                  priority
                />
                
                {/* Image overlay gradient */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-adopt-purple-900/50 via-transparent to-transparent"
                  aria-hidden="true"
                ></div>
                
                {/* Pet details card */}
                <div 
                  className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-lg transform transition-transform duration-200 group-hover:translate-y-[-4px]"
                  style={{ transition: `transform ${ui.animation.duration.slow} ${ui.animation.easing.out}` }}
                >
                  <div className="flex items-center gap-4">
                    <span 
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-adopt-purple-100 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5 11C17.9853 11 20 8.98528 20 6.5C20 4.01472 17.9853 2 15.5 2C13.0147 2 11 4.01472 11 6.5C11 8.98528 13.0147 11 15.5 11Z" fill="#8B5CF6"/>
                        <path d="M8.5 9C10.433 9 12 7.43333 12 5.5C12 3.56667 10.4333 2 8.5 2C6.56667 2 5 3.56667 5 5.5C5 7.43333 6.56667 9 8.5 9Z" fill="#8B5CF6" fillOpacity="0.7"/>
                        <path d="M15.5 22C17.9853 22 20 19.9853 20 17.5C20 15.0147 17.9853 13 15.5 13C13.0147 13 11 15.0147 11 17.5C11 19.9853 13.0147 22 15.5 22Z" fill="#8B5CF6" fillOpacity="0.4"/>
                        <path d="M8.5 22C10.4333 22 12 20.4333 12 18.5C12 16.5667 10.4333 15 8.5 15C6.56667 15 5 16.5667 5 18.5C5 20.4333 6.56667 22 8.5 22Z" fill="#8B5CF6" fillOpacity="0.9"/>
                      </svg>
                    </span>
                    <div>
                      <h3 className="font-bold text-lg text-adopt-gray-900">¿Listo para adoptar?</h3>
                      <p className="text-adopt-gray-600">Comienza tu aventura hoy</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative badges - hidden on mobile for better UX */}
              <div 
                className="absolute -bottom-5 -right-8 bg-white p-4 rounded-lg shadow-lg rotate-3 hidden md:block"
                aria-hidden="true"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-adopt-teal-100 rounded-full flex items-center justify-center text-adopt-teal-700">
                    <CheckCircle size={20} />
                  </span>
                  <div>
                    <p className="text-xs text-adopt-gray-500">Revisados por veterinarios</p>
                    <p className="text-sm font-medium text-adopt-gray-800">Mascotas Saludables</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="absolute -top-6 -left-8 bg-white p-4 rounded-lg shadow-lg -rotate-3 hidden md:block"
                aria-hidden="true"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-adopt-amber-100 rounded-full flex items-center justify-center text-adopt-amber-700">
                    <Info size={20} />
                  </span>
                  <div>
                    <p className="text-xs text-adopt-gray-500">Soporte experto</p>
                    <p className="text-sm font-medium text-adopt-gray-800">Ayuda 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave decoration at bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-8 opacity-20"
          aria-hidden="true"
        >
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 C300,90 600,100 1200,30 L1200,100 L0,100 Z" fill="currentColor" className="text-adopt-purple-200"></path>
          </svg>
      </div>
      </section>
      
      {/* Pet Listings Section */}
      <section 
        className="py-12 sm:py-16 bg-white"
        aria-labelledby="available-pets-heading"
      >
        <div className="container mx-auto px-4">
          <Motion type="slide-up">
            <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
              <h2 
                id="available-pets-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-adopt-gray-900"
              >
                Mascotas <span className="text-adopt-purple-600">Disponibles</span>
              </h2>
              <p className="text-adopt-gray-700 text-base md:text-lg">
                Encuentra a tu nuevo mejor amigo entre nuestras adorables mascotas que esperan un hogar.
                Cada una tiene una personalidad única lista para llevar alegría a tu vida.
              </p>
              <div 
                className="w-20 h-1 bg-adopt-amber-500 rounded-full mx-auto mt-6 md:mt-8"
                style={{ backgroundColor: ui.colors.complementary.DEFAULT }}
                aria-hidden="true"
              ></div>
            </div>
          </Motion>
          
          <div 
            className="rounded-xl border border-adopt-purple-200 bg-white p-6 md:p-8 shadow-sm"
            style={{ borderColor: `color-mix(in oklch, ${ui.colors.primary.lighter} 80%, transparent)` }}
          >
      <PetList pets={pets} />
          </div>
          
          <div className="mt-8 md:mt-12 text-center">
            <Button 
              className="bg-adopt-purple-600 hover:bg-adopt-purple-700 text-white rounded-full px-6 sm:px-8 py-3 md:py-4 shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px] text-base font-medium"
              style={{ 
                backgroundColor: ui.colors.primary.DEFAULT,
                transition: `all ${ui.animation.duration.default} ${ui.animation.easing.default}`
              }}
              aria-label="Ver todas las mascotas disponibles para adopción"
            >
              <Link href="/pets">
                <span className="flex items-center gap-2">
                  Ver Todas las Mascotas
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Loading state
export function Loading() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

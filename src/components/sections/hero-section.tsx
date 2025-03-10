import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, ArrowUpRight, PawPrintIcon as Paw, Heart, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-br from-white to-primary/5"
      aria-labelledby="hero-heading"
    >
      {/* Modern background elements */}
      <div className="absolute inset-0 bg-[url('/images/paw-pattern.svg')] bg-repeat opacity-[0.03] mix-blend-overlay"></div>
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 blur-[100px]"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary/15 blur-[120px]"></div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Content (spans 6 columns on large screens) */}
          <div className="lg:col-span-6 space-y-8">
            {/* Tag with improved styling */}
            <div className="inline-flex items-center py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Paw size={14} className="text-primary mr-2" />
              <span className="text-primary font-medium text-sm">Encuentra tu compañero perfecto hoy</span>
            </div>

            {/* Main Heading with modern typography */}
            <div>
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900"
              >
                Un Amigo Más
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
                  Miles de Alegrías
                </span>
              </h1>
            </div>

            {/* Description with improved readability */}
            <p className="text-gray-700 text-lg leading-relaxed max-w-xl">
              Tener una mascota significa tener más alegría, un nuevo amigo, una persona feliz que siempre estará
              contigo para divertirse. ¡Tenemos más de{" "}
              <span className="font-semibold text-primary">200 mascotas diferentes</span> que pueden satisfacer tus
              necesidades!
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { icon: <Heart className="text-primary h-5 w-5" />, text: "Adopción responsable" },
                { icon: <Shield className="text-primary h-5 w-5" />, text: "Mascotas verificadas" },
                { icon: <CheckCircle className="text-primary h-5 w-5" />, text: "Soporte continuo" },
                { icon: <Paw className="text-primary h-5 w-5" />, text: "Seguimiento post-adopción" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  {feature.icon}
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Button Group with modern styling */}
            <div className="flex flex-wrap gap-4 items-center pt-4">
              <Button
                className="bg-primary hover:bg-primary-dark text-white rounded-full px-6 py-6 shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]"
                aria-label="Ver todas las mascotas disponibles"
              >
                <Link href="/pets" className="flex items-center gap-2">
                  <span className="font-medium">Ver Mascotas</span>
                  <ArrowRight size={16} />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="border-primary/30 hover:border-primary text-primary hover:bg-primary/5 rounded-full px-6 py-6 transition-all hover:translate-y-[-2px]"
                aria-label="Conocer más sobre el proceso de adopción"
              >
                <Link href="/about" className="flex items-center gap-2">
                  <span className="font-medium">Conocer Más</span>
                  <ArrowUpRight size={16} />
                </Link>
              </Button>
            </div>

            {/* Modern trust indicator */}
            <div
              className="mt-6 flex items-center gap-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100"
              role="presentation"
              aria-label="Estadísticas de adopción"
            >
              <div className="flex -space-x-3">
                {[
                  "bg-gradient-to-br from-primary to-primary-dark",
                  "bg-gradient-to-br from-primary-dark to-primary",
                  "bg-gradient-to-br from-complementary to-primary",
                  "bg-gradient-to-br from-accent-teal to-complementary",
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full border-2 border-white ${color} flex items-center justify-center text-white text-xs font-bold shadow-md`}
                    aria-hidden="true"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">+2,500 Personas</p>
                <p className="text-sm text-gray-600">Ya han adoptado con nosotros</p>
              </div>
            </div>
          </div>

          {/* Right Column - Image (spans 6 columns on large screens) */}
          <div className="lg:col-span-6 relative">
            {/* Main Image Container with modern styling */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl transform lg:rotate-2 transition-all hover:rotate-0 duration-500">
              <Image
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1169&auto=format&fit=crop"
                alt="Perro feliz con suéter amarillo listo para ser adoptado"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 50vw"
                priority
              />

              {/* Modern overlay gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                aria-hidden="true"
              ></div>

              {/* Modern card overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/30 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-primary to-primary-dark rounded-full p-3 shadow-lg">
                    <Paw size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white">¿Listo para adoptar?</h3>
                    <p className="text-white/90">Comienza tu aventura hoy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating info cards with modern styling */}
            <div
              className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm"
              aria-hidden="true"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <CheckCircle size={20} className="text-primary" />
                </div>
                <p className="text-sm font-medium">Mascotas Verificadas</p>
              </div>
            </div>

            {/* Additional floating element for visual interest */}
            <div
              className="absolute -top-4 -left-4 md:-left-8 bg-white p-4 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm"
              aria-hidden="true"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Heart size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">+200 Mascotas</p>
                  <p className="text-xs text-gray-500">Esperando un hogar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


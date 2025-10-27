import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center hero-pattern rubber-texture overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg-alt to-border opacity-90"></div>

      {/* Mountain silhouette SVG */}
      <div className="absolute bottom-0 left-0 right-0 opacity-5">
        <svg viewBox="0 0 1200 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0,300 L0,200 L200,120 L400,180 L600,80 L800,140 L1000,100 L1200,160 L1200,300 Z" fill="#0F172A" />
          <path d="M0,300 L0,240 L150,180 L350,220 L550,140 L750,180 L950,160 L1200,200 L1200,300 Z" fill="#0F172A" opacity="0.6" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 text-center animate-fade-in-up">
        <div className="inline-block mb-6">
          <span className="font-mono text-xs tracking-wider bg-primary text-white px-4 py-2 border border-primary rounded">
            MALAYSIA'S FIRST CLIMBING BRAND
          </span>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
            <Image
              src="/gunung-logo.png"
              alt="Gunung Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading mb-6 leading-tight tracking-tight">
          GUNUNG
        </h1>

        <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-600 mb-4">
          Born from our soil, built for ascent.
        </p>

        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12">
          Malaysia's first homegrown climbing brand — connecting world-class gear with local climbers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#contact"
            className="bg-accent text-white px-8 py-3 border border-accent rounded shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 text-lg font-semibold btn-hover"
          >
            Partner With Us
          </a>
          <a
            href="#about"
            className="bg-transparent text-accent px-8 py-3 border border-accent rounded shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-accent/10 transition-all duration-200 text-lg font-semibold"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}

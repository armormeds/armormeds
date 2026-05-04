import React from "react";
import { Star, Shield, Zap, ChevronRight, Activity } from "lucide-react";

export function RebelPoster() {
  return (
    <div className="relative w-full min-h-[900px] bg-[#000814] overflow-hidden font-sans text-white flex flex-col items-center">
      {/* Google Fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Saira+Stencil+One&family=Russo+One&family=Oswald:wght@400;600;700&display=swap" />

      {/* Starfield Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10% 20%, white 100%, transparent),
            radial-gradient(1px 1px at 30% 40%, white 100%, transparent),
            radial-gradient(1.5px 1.5px at 50% 60%, white 100%, transparent),
            radial-gradient(1px 1px at 70% 80%, white 100%, transparent),
            radial-gradient(2px 2px at 90% 10%, white 100%, transparent),
            radial-gradient(1px 1px at 20% 80%, white 100%, transparent),
            radial-gradient(1px 1px at 80% 30%, white 100%, transparent)
          `,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Distress Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Navbar */}
      <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-[#FFD60A]" />
          <span 
            className="text-2xl tracking-widest text-[#FFD60A]"
            style={{ fontFamily: "'Russo One', sans-serif" }}
          >
            ARMORMEDS
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "'Oswald', sans-serif" }}>
          <a href="#" className="text-white hover:text-[#FFD60A] uppercase tracking-wider transition-colors">Weight Loss</a>
          <a href="#" className="text-white hover:text-[#FFD60A] uppercase tracking-wider transition-colors">Hair Loss</a>
          <a href="#" className="text-white hover:text-[#FFD60A] uppercase tracking-wider transition-colors">Sexual Health</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="hidden sm:block text-white/70 hover:text-white uppercase tracking-wider text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>Login</a>
          <button className="bg-[#FF0033] hover:bg-[#cc0029] text-white px-6 py-2 uppercase tracking-wider font-bold transition-all border-2 border-[#FF0033] hover:border-[#cc0029]" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Hero Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12 gap-12">
        
        {/* Left: Typography & CTA */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-20">
          <div className="inline-flex items-center gap-2 px-4 py-1 border border-[#FFD60A]/50 bg-[#FFD60A]/10 text-[#FFD60A] mb-6 uppercase tracking-widest text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>
            <Star className="w-4 h-4" />
            <span>Enlist Today</span>
          </div>

          <h1 
            className="text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text leading-none mb-6 drop-shadow-[0_0_15px_rgba(255,214,10,0.5)]"
            style={{ 
              fontFamily: "'Saira Stencil One', sans-serif",
              backgroundImage: 'linear-gradient(to bottom, #FFD60A, #FF9900)'
            }}
          >
            JOIN THE WELLNESS ALLIANCE
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-xl" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>
            YOUR MISSION FOR BETTER HEALTH STARTS HERE. VETERAN MEDICAL EXPERTS ARE STANDING BY.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              className="group relative px-8 py-4 bg-[#FFD60A] text-[#000814] font-bold text-xl uppercase tracking-wider overflow-hidden"
              style={{ fontFamily: "'Russo One', sans-serif" }}
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <span className="relative flex items-center justify-center gap-2">
                START MY MISSION <ChevronRight className="w-6 h-6" />
              </span>
            </button>

            <button 
              className="px-8 py-4 bg-transparent border-2 border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10 font-bold text-xl uppercase tracking-wider transition-colors"
              style={{ fontFamily: "'Russo One', sans-serif" }}
            >
              EXPLORE TREATMENTS
            </button>
          </div>

          {/* Holographic Callout */}
          <div className="mt-12 w-full max-w-md p-4 border border-[#00B4D8]/30 bg-[#00B4D8]/5 backdrop-blur-sm relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#00B4D8] shadow-[0_0_10px_#00B4D8]" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-[#00B4D8]" style={{ fontFamily: "'Oswald', sans-serif" }}>
                <Shield className="w-5 h-5" />
                <span className="uppercase tracking-wider">Licensed Medics</span>
              </div>
              <div className="flex items-center gap-2 text-[#00B4D8]" style={{ fontFamily: "'Oswald', sans-serif" }}>
                <Zap className="w-5 h-5" />
                <span className="uppercase tracking-wider">Discreet Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Propaganda Poster Image */}
        <div className="w-full md:w-1/2 flex justify-center relative z-10 mt-12 md:mt-0">
          <div className="relative w-full max-w-md aspect-[3/4] p-3 border-4 border-[#FFD60A] bg-[#FF0033]/20 shadow-[0_0_30px_rgba(255,0,51,0.3)] transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
            {/* Corner Accents */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-white" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-white" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-white" />
            
            <img 
              src="/__mockup/images/rebel-poster-hero.png" 
              alt="Alliance Fighter Pilot" 
              className="w-full h-full object-cover grayscale-[20%] contrast-125 sepia-[10%]"
            />

            {/* Poster Text Overlay */}
            <div className="absolute bottom-6 left-0 w-full text-center">
              <span className="bg-[#FF0033] text-white px-4 py-1 text-2xl tracking-widest shadow-[4px_4px_0_#000814] transform -skew-x-12 inline-block" style={{ fontFamily: "'Russo One', sans-serif" }}>
                ENLIST NOW
              </span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-[#FF0033] via-[#FFD60A] to-[#00B4D8]" />
    </div>
  );
}

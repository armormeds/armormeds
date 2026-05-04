import React from 'react';

export function WesternOutlaw() {
  return (
    <div className="relative min-h-[900px] w-full max-w-[1280px] mx-auto overflow-hidden text-[#3b2d24] bg-[#f4ebd8]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
    }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=Rye&family=Smokum&family=Special+Elite&display=swap" rel="stylesheet" />

      {/* Background distressed corners/edges */}
      <div className="absolute inset-0 pointer-events-none" style={{
        boxShadow: 'inset 0 0 100px rgba(59, 45, 36, 0.2)'
      }} />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b-2 border-[#3b2d24]/20">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold tracking-widest text-[#8b3a3a]" style={{ fontFamily: "'Rye', serif" }}>ARMORMEDS</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-lg font-bold tracking-wider" style={{ fontFamily: "'IM Fell English SC', serif" }}>
          <a href="#" className="hover:text-[#8b3a3a] transition-colors border-b-2 border-transparent hover:border-[#8b3a3a] pb-1">WEIGHT LOSS</a>
          <a href="#" className="hover:text-[#8b3a3a] transition-colors border-b-2 border-transparent hover:border-[#8b3a3a] pb-1">HAIR LOSS</a>
          <a href="#" className="hover:text-[#8b3a3a] transition-colors border-b-2 border-transparent hover:border-[#8b3a3a] pb-1">SEXUAL HEALTH</a>
          <a href="#" className="hover:text-[#8b3a3a] transition-colors border-b-2 border-transparent hover:border-[#8b3a3a] pb-1">LOGIN</a>
        </nav>

        <button className="px-6 py-2 border-2 border-[#3b2d24] text-[#3b2d24] font-bold tracking-widest uppercase hover:bg-[#3b2d24] hover:text-[#f4ebd8] transition-all" style={{ fontFamily: "'IM Fell English SC', serif" }}>
          Get Started
        </button>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-[calc(900px-90px)] px-8 py-12 gap-12">
        
        {/* Left Column - Text */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <div className="mb-4 text-xl tracking-[0.2em] font-bold text-[#8b3a3a] border-y-2 border-[#8b3a3a] py-2 px-4" style={{ fontFamily: "'IM Fell English SC', serif" }}>
            DOC'S ORDERS
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5rem] leading-[1.1] mb-6 text-[#2a1f18] drop-shadow-sm" style={{ fontFamily: "'Rye', serif" }}>
            MEDS DELIVERED.<br/>NO QUESTIONS ASKED.
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-[#4a392e] max-w-xl leading-relaxed" style={{ fontFamily: "'Special Elite', cursive" }}>
            Telehealth for the modern frontier. Weight loss, hair loss, and sexual health treatments brought straight to your hideout.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mb-12 w-full justify-center lg:justify-start">
            <button className="relative px-8 py-4 bg-[#8b3a3a] text-[#f4ebd8] text-xl font-bold tracking-widest hover:bg-[#6e2a2a] transition-colors border-4 border-[#3b2d24] shadow-[4px_4px_0_#3b2d24]" style={{ fontFamily: "'Smokum', cursive" }}>
              START MY VISIT
              <div className="absolute inset-0 border-2 border-dashed border-[#f4ebd8]/30 m-1 pointer-events-none"></div>
            </button>
            
            <button className="relative px-8 py-4 bg-transparent text-[#3b2d24] text-xl font-bold tracking-widest hover:bg-[#e6dcc6] transition-colors border-4 border-[#3b2d24] shadow-[4px_4px_0_#3b2d24]" style={{ fontFamily: "'Smokum', cursive" }}>
              SEE TREATMENTS
              <div className="absolute inset-0 border-2 border-dashed border-[#3b2d24]/30 m-1 pointer-events-none"></div>
            </button>
          </div>

          {/* Benefits Badge/Panel */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 p-4 border-2 border-dashed border-[#3b2d24] bg-[#e6dcc6]/50">
            <div className="flex items-center gap-2">
              <span className="text-2xl text-[#8b3a3a]">★</span>
              <span className="font-bold tracking-widest" style={{ fontFamily: "'IM Fell English SC', serif" }}>DISCREET DELIVERY</span>
            </div>
            <div className="hidden sm:block text-[#3b2d24] opacity-50">•</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-[#8b3a3a]">★</span>
              <span className="font-bold tracking-widest" style={{ fontFamily: "'IM Fell English SC', serif" }}>LICENSED PHYSICIANS</span>
            </div>
            <div className="hidden sm:block text-[#3b2d24] opacity-50">•</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-[#8b3a3a]">★</span>
              <span className="font-bold tracking-widest" style={{ fontFamily: "'IM Fell English SC', serif" }}>NO INSURANCE NEEDED</span>
            </div>
          </div>

        </div>

        {/* Right Column - Illustration */}
        <div className="flex-1 flex justify-center lg:justify-end relative mt-12 lg:mt-0">
          <div className="relative w-full max-w-md">
            {/* Reward Badge */}
            <div className="absolute -top-12 -right-8 z-20 bg-[#8b3a3a] text-[#f4ebd8] w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 border-[#3b2d24] shadow-[6px_6px_0_#3b2d24] rotate-12 transform hover:scale-105 transition-transform cursor-pointer">
              <div className="absolute inset-2 border-2 border-dashed border-[#f4ebd8]/50 rounded-full"></div>
              <span className="text-xl tracking-widest mb-1" style={{ fontFamily: "'IM Fell English SC', serif" }}>REWARD</span>
              <span className="text-4xl font-bold" style={{ fontFamily: "'Rye', serif" }}>$0</span>
              <span className="text-sm tracking-widest mt-1" style={{ fontFamily: "'IM Fell English SC', serif" }}>COPAY</span>
            </div>

            {/* Oval Frame */}
            <div className="relative w-full aspect-[3/4] p-4 border-8 border-double border-[#3b2d24] bg-[#3b2d24] rounded-t-[200px] shadow-2xl">
              <div className="w-full h-full rounded-t-[180px] overflow-hidden border-4 border-[#d4af37] bg-[#f4ebd8]">
                <img 
                  src="/__mockup/images/western-outlaw-hero.png" 
                  alt="Frontier Doctor" 
                  className="w-full h-full object-cover sepia-[.4] contrast-125 hover:sepia-0 transition-all duration-700"
                />
              </div>
              <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-[#f4ebd8] border-4 border-[#3b2d24] px-8 py-2 shadow-[4px_4px_0_#3b2d24] whitespace-nowrap z-10">
                <span className="text-2xl font-bold tracking-widest text-[#8b3a3a]" style={{ fontFamily: "'Rye', serif" }}>WANTED</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

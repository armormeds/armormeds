import React from 'react';

export function CyberpunkNeon() {
  return (
    <div className="relative min-h-[900px] w-full max-w-[1280px] mx-auto overflow-hidden bg-black text-white selection:bg-[#FF006E] selection:text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Orbitron:wght@400;700;900&family=VT323&display=swap" rel="stylesheet" />
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60 mix-blend-screen"
        style={{ backgroundImage: "url('/__mockup/images/cyberpunk-city.png')" }}
      />
      
      {/* Scanline Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{ 
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 4px, 3px 100%"
        }}
      />

      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full min-h-[900px] px-8 py-6">
        
        {/* Navbar */}
        <nav className="flex items-center justify-between border-b border-[#00F5FF]/30 pb-4">
          <div className="flex items-center gap-2 text-2xl font-black tracking-widest text-[#00F5FF]" style={{ textShadow: "0 0 10px rgba(0,245,255,0.7), 2px 2px 0px rgba(255,0,110,0.8)" }}>
            ARMORMEDS<span className="text-[#FF006E] animate-pulse">_</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm tracking-widest font-bold" style={{ fontFamily: "'VT323', monospace", fontSize: "1.4rem" }}>
            <a href="#" className="hover:text-[#FF006E] transition-colors uppercase" style={{ textShadow: "0 0 5px rgba(255,0,110,0)" }}>Weight Loss</a>
            <a href="#" className="hover:text-[#FF006E] transition-colors uppercase">Hair Loss</a>
            <a href="#" className="hover:text-[#FF006E] transition-colors uppercase">Sexual Health</a>
            <a href="#" className="hover:text-[#00F5FF] transition-colors uppercase">Login</a>
          </div>
          <button className="px-6 py-2 border border-[#FF006E] text-[#FF006E] font-bold text-sm tracking-wider uppercase hover:bg-[#FF006E] hover:text-white transition-all shadow-[0_0_15px_rgba(255,0,110,0.3)] hover:shadow-[0_0_20px_rgba(255,0,110,0.8)] backdrop-blur-sm">
            Get Started
          </button>
        </nav>

        {/* Hero Body */}
        <div className="flex-1 flex flex-col justify-center items-start max-w-4xl mt-12">
          
          <div className="inline-block px-3 py-1 mb-6 border border-[#00F5FF] bg-[#00F5FF]/10 text-[#00F5FF] text-sm tracking-widest font-bold" style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem", textShadow: "0 0 5px rgba(0,245,255,0.5)" }}>
            [ SYSTEM ONLINE ] // NIGHT_CITY_CLINIC
          </div>
          
          <h1 
            className="text-6xl md:text-8xl font-black uppercase leading-none mb-6 text-white"
            style={{ 
              fontFamily: "'Audiowide', cursive", 
              textShadow: "-4px 0px 0px #FF006E, 4px 0px 0px #00F5FF"
            }}
          >
            UPGRADE <br/>YOUR BIOLOGY
          </h1>
          
          <p className="text-xl max-w-2xl mb-12 text-[#e0e0e0] leading-relaxed font-light tracking-wide" style={{ fontFamily: "'VT323', monospace", fontSize: "1.6rem" }}>
            Advanced protocols for weight management, hair restoration, and optimal performance. Delivered directly to your coordinates. No insurance required.
          </p>
          
          <div className="flex flex-wrap items-center gap-6 mb-16">
            <button className="px-8 py-4 bg-[#FF006E]/20 border border-[#FF006E] text-white font-black text-lg tracking-widest uppercase hover:bg-[#FF006E] transition-all shadow-[0_0_20px_rgba(255,0,110,0.4)] hover:shadow-[0_0_30px_rgba(255,0,110,0.8)] backdrop-blur-md">
              START MY VISIT
            </button>
            <button className="px-8 py-4 bg-black/40 border border-[#00F5FF] text-[#00F5FF] font-bold text-lg tracking-widest uppercase hover:bg-[#00F5FF]/20 transition-all shadow-[0_0_15px_rgba(0,245,255,0.3)] hover:shadow-[0_0_25px_rgba(0,245,255,0.7)] backdrop-blur-md">
              SEE TREATMENTS
            </button>
          </div>
          
          {/* Benefits Panel */}
          <div className="flex flex-wrap gap-6 border-l-4 border-[#FF006E] pl-6 py-2 bg-black/30 backdrop-blur-sm" style={{ fontFamily: "'VT323', monospace", fontSize: "1.3rem" }}>
            <div className="flex items-center gap-2 text-[#00F5FF]">
              <span className="text-[#FF006E] animate-pulse">{'>'}</span> DISCREET DELIVERY
            </div>
            <span className="text-gray-600 hidden md:inline">|</span>
            <div className="flex items-center gap-2 text-[#00F5FF]">
              <span className="text-[#FF006E] animate-pulse" style={{ animationDelay: '300ms' }}>{'>'}</span> LICENSED PHYSICIANS
            </div>
            <span className="text-gray-600 hidden md:inline">|</span>
            <div className="flex items-center gap-2 text-[#00F5FF]">
              <span className="text-[#FF006E] animate-pulse" style={{ animationDelay: '600ms' }}>{'>'}</span> NO INSURANCE NEEDED
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

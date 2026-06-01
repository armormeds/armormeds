import React from "react";

export function Synthwave80sSplit() {
  return (
    <div className="relative min-h-[1080px] w-full overflow-hidden bg-[#0b001a] text-white font-sans selection:bg-[#FF00CC] selection:text-white flex flex-col">
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Press+Start+2P&family=Outfit:wght@400;700&display=swap" rel="stylesheet" />

      {/* CRT Scanlines Overlay (Full Screen) */}
      <div 
        className="pointer-events-none absolute inset-0 z-50 opacity-10"
        style={{
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 4px, 3px 100%"
        }}
      />

      {/* Top Navigation spanning full width */}
      <div className="relative z-40 w-full px-12 py-8 flex items-center justify-between border-b border-[#FF00CC]/30 shadow-[0_0_15px_rgba(255,0,204,0.2)] bg-[#0b001a]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span 
            className="text-3xl font-bold tracking-wider"
            style={{ 
              fontFamily: "'Audiowide', cursive",
              color: "#00FFF0",
              textShadow: "0 0 5px #00FFF0, 0 0 10px #00FFF0"
            }}
          >
            ArmorMeds
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest text-[#00FFF0]" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <a href="#" className="hover:text-[#FF00CC] hover:drop-shadow-[0_0_8px_#FF00CC] transition-all uppercase">Weight Loss</a>
          <a href="#" className="hover:text-[#FF00CC] hover:drop-shadow-[0_0_8px_#FF00CC] transition-all uppercase">Hair Loss</a>
          <a href="#" className="hover:text-[#FF00CC] hover:drop-shadow-[0_0_8px_#FF00CC] transition-all uppercase">Sexual Health</a>
          <a href="#" className="hover:text-[#FF00CC] hover:drop-shadow-[0_0_8px_#FF00CC] transition-all uppercase">Login</a>
          
          <button className="px-6 py-2 border-2 border-[#FF00CC] text-[#FF00CC] bg-[#ff00cc10] hover:bg-[#FF00CC] hover:text-white transition-all uppercase shadow-[0_0_15px_#FF00CC] hover:shadow-[0_0_25px_#FF00CC]">
            Insert Coin
          </button>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="flex-1 w-full flex flex-col md:flex-row relative z-10">
        
        {/* LEFT HALF */}
        <div className="w-full md:w-1/2 p-12 lg:p-20 xl:p-24 flex flex-col justify-center relative">
          
          <div className="inline-flex items-center gap-3 mb-8 bg-[#00000080] border border-[#00FFF0] px-4 py-2 self-start rounded-none backdrop-blur-sm shadow-[0_0_10px_#00FFF0]">
            <span className="animate-pulse text-[#00FFF0] text-xs" style={{ fontFamily: "'Press Start 2P', monospace" }}>▶</span>
            <span className="text-[#00FFF0] text-xs tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>HEALTH.EXE_</span>
          </div>

          <h1 
            className="text-6xl md:text-8xl lg:text-[7rem] font-black uppercase leading-tight mb-8"
            style={{ 
              fontFamily: "'Audiowide', cursive",
              backgroundImage: "linear-gradient(to bottom, #ffffff 0%, #cccccc 40%, #333333 50%, #ffffff 51%, #00FFF0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(255,0,204,0.5))"
            }}
          >
            WELLNESS<br />LOADED.
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-xl mb-14 uppercase tracking-widest leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Retro results. Modern medicine. Defeat weight loss, hair loss, and vitality issues with licensed treatments.
          </p>

          <div className="flex flex-col xl:flex-row gap-6">
            <button 
              className="relative group px-10 py-5 bg-gradient-to-r from-[#FF00CC] to-[#7000FF] border-2 border-[#FF00CC] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-[-20deg] -translate-x-full" />
              <span 
                className="relative z-10 text-white tracking-widest text-lg drop-shadow-[0_0_8px_#fff]"
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.8rem' }}
              >
                START GAME
              </span>
              <div className="absolute inset-0 shadow-[0_0_20px_#FF00CC] opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button 
              className="relative group px-10 py-5 bg-transparent border-2 border-[#00FFF0] overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-[#00FFF0]/10 group-hover:bg-[#00FFF0]/20 transition-colors" />
              <span 
                className="relative z-10 text-[#00FFF0] tracking-widest text-lg drop-shadow-[0_0_8px_#00FFF0]"
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.8rem' }}
              >
                VIEW GEAR
              </span>
              <div className="absolute inset-0 shadow-[inset_0_0_15px_#00FFF0] opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* GLOWING NEON DIVIDER */}
        <div className="hidden md:block w-px bg-[#FF00CC] relative z-20 shadow-[0_0_15px_#FF00CC,0_0_30px_#FF00CC]" />

        {/* RIGHT HALF (CRT Arcade Monitor Frame) */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 xl:p-16 flex items-center justify-center">
          
          {/* Bezel Frame */}
          <div className="relative w-full h-full max-h-[800px] border-4 border-gray-600 rounded-3xl overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,1),0_0_30px_rgba(255,0,204,0.3)] bg-black"
               style={{
                 border: "8px solid #222",
                 boxShadow: "inset 0 0 20px #000, 0 0 20px rgba(0, 255, 240, 0.4), 0 0 40px rgba(255, 0, 204, 0.2)",
                 borderImage: "linear-gradient(to bottom, #666, #111) 1"
               }}>
            
            {/* Grid and Sun Background */}
            <div className="absolute inset-0 z-0 flex flex-col justify-end overflow-hidden bg-[#1A0033]">
              <div className="absolute inset-0 bg-gradient-to-b from-[#1A0033] via-[#2a0044] to-[#ff00cc20] z-0" />
              <div 
                className="absolute inset-0 opacity-80 z-0 bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: "url('/__mockup/images/synthwave-sun.png')" }}
              />
              
              {/* Animated Perspective Grid */}
              <div className="absolute bottom-0 w-full h-[60%] overflow-hidden z-0">
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%] opacity-60 origin-bottom"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #00FFF0 2px, transparent 2px),
                      linear-gradient(to bottom, #FF00CC 2px, transparent 2px)
                    `,
                    backgroundSize: "60px 40px",
                    transform: "perspective(500px) rotateX(60deg) translateY(100px) scale(1.5)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#1A0033]" />
              </div>
            </div>

            {/* CRT monitor glass effect (inner curve shadow) */}
            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,1)] pointer-events-none z-10 rounded-2xl" />

            {/* Benefit Cards Floating over lower right grid */}
            <div className="absolute bottom-10 right-10 z-30 flex flex-col gap-4 w-72">
              {[
                { icon: "📦", title: "DISCREET DELIVERY" },
                { icon: "🩺", title: "LICENSED PHYSICIANS" },
                { icon: "🛡️", title: "NO INSURANCE NEEDED" }
              ].map((benefit, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-4 bg-[#1a0033]/90 border border-[#FF00CC]/70 p-4 backdrop-blur-md shadow-[0_0_15px_rgba(255,0,204,0.4)] hover:scale-105 transition-transform"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <div className="text-2xl drop-shadow-[0_0_5px_#00FFF0]">{benefit.icon}</div>
                  <div className="text-sm font-bold tracking-widest text-[#00FFF0] uppercase leading-tight">
                    {benefit.title}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

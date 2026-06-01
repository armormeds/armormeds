import React from "react";

export function Synthwave80sAsymmetric() {
  return (
    <div className="relative min-h-[1080px] w-full overflow-hidden bg-[#0b001a] text-white font-sans selection:bg-[#FF00CC] selection:text-white flex flex-col">
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Press+Start+2P&family=Outfit:wght@400;700&display=swap" rel="stylesheet" />

      {/* CRT Scanlines Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-50 opacity-10"
        style={{
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 4px, 3px 100%"
        }}
      />

      {/* Grid and Sun Background - Off-center toward top-right */}
      <div className="absolute inset-0 z-0 flex flex-col overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0033] via-[#2a0044] to-[#ff00cc20] z-0" />
        
        {/* Sun - shifted top right */}
        <div 
          className="absolute opacity-60 z-0 bg-center bg-contain bg-no-repeat w-[800px] h-[800px] -right-[100px] -top-[100px]"
          style={{ backgroundImage: "url('/__mockup/images/synthwave-sun.png')" }}
        />
        
        {/* Animated Perspective Grid - shifted right to match sun perspective loosely */}
        <div className="absolute bottom-0 right-0 w-[120%] h-[60%] overflow-hidden z-0">
          <div 
            className="absolute bottom-0 left-[60%] -translate-x-1/2 w-[200%] h-[200%] opacity-40 origin-bottom"
            style={{
              backgroundImage: `
                linear-gradient(to right, #00FFF0 2px, transparent 2px),
                linear-gradient(to bottom, #FF00CC 2px, transparent 2px)
              `,
              backgroundSize: "60px 40px",
              transform: "perspective(500px) rotateX(60deg) translateY(100px) scale(1.5)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#1A0033]/50 to-[#1A0033]" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full min-h-[1080px] flex flex-col px-10 py-8">
        
        {/* Navigation */}
        <nav className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span 
              className="text-4xl font-bold tracking-wider"
              style={{ 
                fontFamily: "'Audiowide', cursive",
                color: "#00FFF0",
                textShadow: "0 0 5px #00FFF0, 0 0 10px #00FFF0"
              }}
            >
              ArmorMeds
            </span>
          </div>
          
          <div className="flex flex-col items-end gap-6">
            <div className="inline-flex items-center gap-3 bg-[#00000080] border border-[#00FFF0] px-4 py-2 rounded-none backdrop-blur-sm shadow-[0_0_10px_#00FFF0]">
              <span className="animate-pulse text-[#00FFF0] text-xs" style={{ fontFamily: "'Press Start 2P', monospace" }}>▶</span>
              <span className="text-[#00FFF0] text-xs tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>HEALTH.EXE_</span>
            </div>

            <div className="hidden md:flex items-center gap-10 text-sm font-bold tracking-widest text-[#00FFF0]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <a href="#" className="hover:text-[#FF00CC] hover:drop-shadow-[0_0_8px_#FF00CC] transition-all uppercase">Weight Loss</a>
              <a href="#" className="hover:text-[#FF00CC] hover:drop-shadow-[0_0_8px_#FF00CC] transition-all uppercase">Hair Loss</a>
              <a href="#" className="hover:text-[#FF00CC] hover:drop-shadow-[0_0_8px_#FF00CC] transition-all uppercase">Sexual Health</a>
              <a href="#" className="hover:text-[#FF00CC] hover:drop-shadow-[0_0_8px_#FF00CC] transition-all uppercase">Login</a>
              
              <button className="px-6 py-2 border-2 border-[#FF00CC] text-[#FF00CC] bg-[#ff00cc10] hover:bg-[#FF00CC] hover:text-white transition-all uppercase shadow-[0_0_15px_#FF00CC] hover:shadow-[0_0_25px_#FF00CC]">
                Insert Coin
              </button>
            </div>
          </div>
        </nav>

        {/* Main Hero Grid Layout */}
        <div className="flex-1 w-full grid grid-cols-12 grid-rows-12 gap-6 mt-12 relative">
          
          {/* TOP-LEFT: Giant Headline */}
          <div className="col-span-12 md:col-span-8 row-span-4 flex flex-col justify-start -ml-4">
            <h1 
              className="text-7xl md:text-9xl lg:text-[9rem] font-black uppercase leading-[0.85] tracking-tighter"
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
          </div>

          {/* MIDDLE-RIGHT: Sub-copy */}
          <div className="col-span-12 md:col-span-6 md:col-start-6 row-start-6 row-span-3 flex items-center justify-end text-right pr-24">
            <p className="text-2xl md:text-3xl text-white/90 max-w-xl uppercase tracking-widest leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-r-4 border-[#FF00CC] pr-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Retro results. Modern medicine. Defeat weight loss, hair loss, and vitality issues with licensed treatments.
            </p>
          </div>

          {/* LOWER-LEFT: CTA Buttons */}
          <div className="col-span-12 md:col-span-6 row-start-10 row-span-2 flex flex-col sm:flex-row gap-6 items-end pb-12">
            <button 
              className="relative group px-12 py-6 bg-gradient-to-r from-[#FF00CC] to-[#7000FF] border-2 border-[#FF00CC] overflow-hidden w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-[-20deg] -translate-x-full" />
              <span 
                className="relative z-10 text-white tracking-widest text-xl drop-shadow-[0_0_8px_#fff]"
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.9rem' }}
              >
                START GAME
              </span>
              <div className="absolute inset-0 shadow-[0_0_20px_#FF00CC] opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button 
              className="relative group px-12 py-6 bg-[#0b001a]/80 border-2 border-[#00FFF0] overflow-hidden backdrop-blur-sm w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-[#00FFF0]/10 group-hover:bg-[#00FFF0]/20 transition-colors" />
              <span 
                className="relative z-10 text-[#00FFF0] tracking-widest text-xl drop-shadow-[0_0_8px_#00FFF0]"
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.9rem' }}
              >
                VIEW GEAR
              </span>
              <div className="absolute inset-0 shadow-[inset_0_0_15px_#00FFF0] opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* RIGHT EDGE: Vertical Benefits Sidebar */}
          <div className="absolute right-0 top-1/4 bottom-12 flex flex-col justify-between w-64 gap-6 z-20">
            {[
              { icon: "📦", title: "DISCREET DELIVERY" },
              { icon: "🩺", title: "LICENSED PHYSICIANS" },
              { icon: "🛡️", title: "NO INSURANCE NEEDED" }
            ].map((benefit, i) => (
              <div 
                key={i}
                className="flex flex-col items-center justify-center text-center gap-4 bg-[#1a0033]/80 border border-[#FF00CC]/50 p-6 backdrop-blur-md shadow-[0_0_15px_rgba(255,0,204,0.2)] h-full flex-1 hover:border-[#00FFF0] transition-colors group"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <div className="text-4xl drop-shadow-[0_0_5px_#00FFF0] group-hover:scale-110 transition-transform">{benefit.icon}</div>
                <div className="text-sm font-bold tracking-widest text-[#00FFF0] uppercase leading-relaxed">
                  {benefit.title}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

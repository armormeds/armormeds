import React from 'react';

export function OpeningCrawl() {
  return (
    <div className="relative min-h-[900px] w-full max-w-[1280px] mx-auto overflow-hidden bg-[#000814] text-white font-sans">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Saira+Stencil+One&display=swap" />
      
      {/* Starfield Background */}
      <div 
        className="absolute inset-0 z-0 opacity-80 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0))',
          backgroundSize: '200px 200px'
        }}
      />
      
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 bg-transparent">
        <div className="text-3xl font-bold tracking-widest text-[#FFD60A]" style={{ fontFamily: "'Saira Stencil One', cursive" }}>
          ARMORMEDS
        </div>
        <div className="hidden md:flex gap-8 text-sm tracking-widest uppercase font-semibold text-[#48CAE4]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          <a href="#" className="hover:text-white transition-colors">Weight Loss</a>
          <a href="#" className="hover:text-white transition-colors">Hair Loss</a>
          <a href="#" className="hover:text-white transition-colors">Sexual Health</a>
          <a href="#" className="hover:text-white transition-colors">Login</a>
        </div>
        <button className="px-6 py-2 bg-transparent border border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-[#000814] transition-all font-bold tracking-wider uppercase rounded-sm shadow-[0_0_10px_#00B4D8]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Get Started
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(900px-100px)]">
        
        {/* The Crawl Container */}
        <div className="relative w-full max-w-2xl mx-auto h-[500px] overflow-hidden flex flex-col items-center justify-end">
          
          <div className="text-[#48CAE4] text-xl font-bold mb-4 tracking-[0.2em] uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            PHASE I — THE AWAKENING
          </div>

          <div 
            className="w-full text-center"
            style={{
              transform: 'perspective(400px) rotateX(30deg)',
              transformOrigin: 'bottom center',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
            }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-[#FFD60A] leading-tight tracking-widest mb-8" style={{ fontFamily: "'Saira Stencil One', cursive" }}>
              JOIN THE WELLNESS ALLIANCE
            </h1>
            
            <p className="text-2xl text-[#FFD60A] leading-relaxed font-bold tracking-wide" style={{ fontFamily: "'Saira Stencil One', cursive" }}>
              It is a period of medical revolution.<br/><br/>
              Advanced treatments for weight loss, hair loss, and sexual health have been uncovered.<br/><br/>
              Armed with clinically proven medications, a new hope emerges for those seeking to reclaim their vitality and forge a healthier future...
            </p>
          </div>
        </div>

        {/* Planet Horizon & Actions */}
        <div className="absolute bottom-0 left-0 w-full h-[400px] flex flex-col items-center justify-end pb-12 pointer-events-none">
           <div className="absolute bottom-0 w-full h-full">
              <img src="/__mockup/images/sci_fi_planet_horizon.png" alt="Planet Horizon" className="w-full h-full object-cover opacity-60 mix-blend-screen mask-image-b-to-t" style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)' }} />
           </div>
           
           <div className="relative z-20 flex gap-6 mt-8 pointer-events-auto">
             <button className="px-8 py-4 bg-[#FFD60A] text-[#000814] font-black text-lg tracking-widest uppercase hover:bg-white transition-colors rounded-sm" style={{ fontFamily: "'Orbitron', sans-serif" }}>
               Start My Mission
             </button>
             <button className="px-8 py-4 bg-[#000814] border-2 border-[#FFD60A] text-[#FFD60A] font-bold text-lg tracking-widest uppercase hover:bg-[#FFD60A]/10 transition-colors rounded-sm shadow-[0_0_15px_rgba(255,214,10,0.3)]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
               Explore Treatments
             </button>
           </div>
           
           <div className="relative z-20 flex gap-8 mt-12 text-[#48CAE4] text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#00B4D8] shadow-[0_0_8px_#00B4D8]" />
               Licensed Physicians
             </div>
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#00B4D8] shadow-[0_0_8px_#00B4D8]" />
               Discreet Delivery
             </div>
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#00B4D8] shadow-[0_0_8px_#00B4D8]" />
               No Insurance Needed
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
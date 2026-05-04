import React from 'react';

export function ExplosionImpact() {
  return (
    <div className="relative w-full min-h-[900px] overflow-hidden font-sans text-black"
         style={{
           backgroundColor: '#FFD60A',
           backgroundImage: 'radial-gradient(circle, black 1px, transparent 1.5px)',
           backgroundSize: '12px 12px'
         }}>
      
      {/* Fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bangers&family=Archivo+Black&display=swap" />

      {/* Styles */}
      <style>{`
        .font-comic { font-family: 'Bangers', cursive; }
        .font-heavy { font-family: 'Archivo Black', sans-serif; }
        
        .comic-border {
          border: 4px solid #000;
          box-shadow: 6px 6px 0px #000;
        }

        .text-outline {
          color: white;
          text-shadow: 
            -2px -2px 0 #000,
             2px -2px 0 #000,
            -2px  2px 0 #000,
             2px  2px 0 #000,
             4px  4px 0 #000;
        }
        
        .text-outline-red {
          color: #E63946;
          text-shadow: 
            -2px -2px 0 #000,
             2px -2px 0 #000,
            -2px  2px 0 #000,
             2px  2px 0 #000,
             4px  4px 0 #000;
        }

        .speech-bubble {
          position: relative;
          background: white;
          border: 4px solid black;
          border-radius: 50%;
          padding: 24px;
        }

        .speech-bubble::before {
          content: "";
          position: absolute;
          bottom: -20px;
          left: 40px;
          border-width: 20px 20px 0 0;
          border-style: solid;
          border-color: white transparent transparent transparent;
          z-index: 2;
        }

        .speech-bubble::after {
          content: "";
          position: absolute;
          bottom: -26px;
          left: 37px;
          border-width: 24px 24px 0 0;
          border-style: solid;
          border-color: black transparent transparent transparent;
          z-index: 1;
        }
          
        .explosion {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          background: #FFD60A;
          border: 10px solid black; /* Clip path hides border, we use svg instead below for reliable border */
        }
        
        .sunburst-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-conic-gradient(
            from 0deg,
            #FFD60A 0deg 15deg,
            #E63946 15deg 30deg
          );
          opacity: 0.8;
          z-index: 0;
        }
      `}</style>

      {/* Sunburst Background */}
      <div className="sunburst-bg" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 bg-white/90 border-b-4 border-black">
        <div className="flex items-center gap-2">
          <div className="bg-[#E63946] text-white px-4 py-1 font-comic text-3xl italic comic-border -rotate-2">
            ArmorMeds
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-heavy text-lg uppercase tracking-wider">
          <a href="#" className="hover:text-[#E63946] hover:underline decoration-4 underline-offset-4">Weight Loss</a>
          <a href="#" className="hover:text-[#E63946] hover:underline decoration-4 underline-offset-4">Hair Loss</a>
          <a href="#" className="hover:text-[#E63946] hover:underline decoration-4 underline-offset-4">Sexual Health</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="font-heavy text-lg hover:text-[#E63946]">LOGIN</a>
          <button className="bg-[#FFD60A] text-black font-heavy uppercase px-6 py-2 rounded-full comic-border hover:bg-[#E63946] hover:text-white transition-colors duration-200">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-[800px] flex items-center justify-center">
        
        {/* Central KAPOW Explosion SVG Container */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] flex items-center justify-center z-20 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[15px_15px_0_rgba(0,0,0,1)]">
            <path d="M50 0 L60 25 L95 15 L75 40 L100 60 L70 70 L80 95 L55 80 L35 100 L30 75 L5 85 L20 60 L0 40 L25 35 L10 10 L40 20 Z" 
                  fill="#FFD60A" 
                  stroke="black" 
                  strokeWidth="2" 
                  strokeLinejoin="round" />
            <path d="M50 5 L58 28 L90 19 L72 42 L95 59 L68 68 L76 90 L54 77 L37 94 L32 72 L9 81 L22 59 L5 42 L27 38 L14 15 L41 23 Z" 
                  fill="white" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinejoin="round" />
          </svg>
          
          <div className="absolute flex flex-col items-center text-center mt-8 rotate-[-5deg]">
            <h1 className="font-comic text-[100px] leading-[0.9] text-outline tracking-wider">
              BIG RESULTS.<br/>
              <span className="text-outline-red">LITTLE PILLS.</span>
            </h1>
            <p className="font-heavy text-2xl mt-4 max-w-md border-y-4 border-black py-2 bg-white/90">
              MEDS THAT WORK. NO SHAME. DOCTOR-APPROVED.
            </p>
            
            <div className="flex gap-4 mt-8 pointer-events-auto">
              <button className="bg-[#E63946] text-white font-heavy text-2xl px-10 py-4 rounded-full comic-border hover:-translate-y-1 transition-transform">
                START MY VISIT
              </button>
              <button className="bg-white text-black font-heavy text-xl px-8 py-4 rounded-full comic-border hover:bg-[#FFD60A] hover:-translate-y-1 transition-all">
                SEE TREATMENTS
              </button>
            </div>
          </div>
        </div>

        {/* Floating elements & Character */}
        <div className="absolute bottom-10 left-10 z-30">
          <div className="relative">
            <div className="speech-bubble mb-6 w-64 bg-[#E63946] text-white comic-border font-heavy text-lg italic rotate-[-5deg]">
              <ul className="list-disc pl-4 space-y-2">
                <li>DISCREET DELIVERY</li>
                <li>LICENSED DOCTORS</li>
                <li>NO INSURANCE NEEDED</li>
              </ul>
            </div>
            <div className="w-[300px] h-[300px] comic-border bg-white overflow-hidden rounded-full ml-10">
              <img src="/__mockup/images/comic-guy-pill-explosion.png" alt="Confident man" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        
        {/* Pow Accent */}
        <div className="absolute top-20 right-20 z-30 rotate-12">
          <svg viewBox="0 0 100 100" className="w-40 h-40">
            <path d="M50 0 L65 30 L100 40 L70 65 L80 100 L50 80 L20 100 L30 65 L0 40 L35 30 Z" 
                  fill="#E63946" stroke="black" strokeWidth="3" />
            <text x="50" y="55" fontFamily="Bangers" fontSize="24" fill="white" 
                  textAnchor="middle" stroke="black" strokeWidth="1" dominantBaseline="middle">
              FAST!
            </text>
          </svg>
        </div>

      </div>
    </div>
  );
}

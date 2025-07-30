import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import clickMp3 from '@/assets/click.mp3';
import { useFocusMode } from '@/contexts/FocusModeContext';

// Register GSAP plugins
gsap.registerPlugin(Draggable, MorphSVGPlugin);

interface BulbComponentProps {
  style?: React.CSSProperties;
  className?: string;
  [key: string]: any;
}

const BulbComponent: React.FC<BulbComponentProps> = ({ style, className, ...props }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { isFocusMode, toggleFocusMode } = useFocusMode();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const proxyRef = useRef({ x: 98.7255, y: 380.5405 });
  const startPosRef = useRef({ x: 0, y: 0 });

  // Audio setup
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    // Initialize audio
    audioRef.current = new Audio(clickMp3);
    audioRef.current.preload = 'auto';
    audioRef.current.volume = 0.5; // Set a reasonable volume

    const svg = svgRef.current;
    const cords = svg.querySelectorAll('.toggle-scene__cord');
    const hit = svg.querySelector('.toggle-scene__hit-spot') as SVGCircleElement;
    const dummy = svg.querySelector('.toggle-scene__dummy-cord') as SVGGElement;
    const dummyCord = svg.querySelector('.toggle-scene__dummy-cord line') as SVGLineElement;

    const ENDX = 98.7255;
    const ENDY = 380.5405;
    const CORD_DURATION = 0.1;

    // Reset function
    const reset = () => {
      gsap.set(proxyRef.current, { x: ENDX, y: ENDY });
    };

    reset();

    // Create timeline
    const cordTL = gsap.timeline({
      paused: true,
      onStart: () => {
        toggleFocusMode();
        gsap.set([dummy, hit], { display: 'none' });
        gsap.set(cords[0], { display: 'block' });
        if (audioRef.current) {
          // Reset audio to beginning and play
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((error) => {
            console.log('Audio play failed:', error);
            // Handle audio play failure silently
          });
        }
      },
      onComplete: () => {
        gsap.set([dummy, hit], { display: 'block' });
        gsap.set(cords[0], { display: 'none' });
        reset();
      },
    });

    // Add morphing animations to timeline
    for (let i = 1; i < cords.length; i++) {
      cordTL.add(
        gsap.to(cords[0], {
          morphSVG: cords[i] as SVGPathElement,
          duration: CORD_DURATION,
          repeat: 1,
          yoyo: true,
        })
      );
    }

    timelineRef.current = cordTL;

    // Helper function to convert screen coordinates to SVG coordinates
    const screenToSVG = (screenX: number, screenY: number) => {
      const svgRect = svg.getBoundingClientRect();
      const svgX = ((screenX - svgRect.left) / svgRect.width) * 197.451;
      const svgY = ((screenY - svgRect.top) / svgRect.height) * 481.081;
      return { x: svgX, y: svgY };
    };

    // Create draggable with a proxy element
    const proxyElement = document.createElement('div');
    proxyElement.style.position = 'absolute';
    proxyElement.style.left = '0px';
    proxyElement.style.top = '0px';
    proxyElement.style.width = '1px';
    proxyElement.style.height = '1px';
    proxyElement.style.pointerEvents = 'none';
    document.body.appendChild(proxyElement);
    
    const draggable = Draggable.create(proxyElement, {
      trigger: hit,
      type: 'x,y',
      onPress: (e: any) => {
        const svgCoords = screenToSVG(e.clientX || e.x, e.clientY || e.y);
        startPosRef.current.x = svgCoords.x;
        startPosRef.current.y = svgCoords.y;
        
        // Set initial position without jump
        gsap.set(dummyCord, {
          attr: {
            x2: svgCoords.x,
            y2: svgCoords.y,
          },
        });
      },
      onDrag: function(this: any, e: any) {
        const svgCoords = screenToSVG(e.clientX || e.x, e.clientY || e.y);
        gsap.set(dummyCord, {
          attr: {
            x2: svgCoords.x,
            y2: svgCoords.y,
          },
        });
      },
      onRelease: function(this: any, e: any) {
        const svgCoords = screenToSVG(e.clientX || e.x, e.clientY || e.y);
        const distX = Math.abs(svgCoords.x - startPosRef.current.x);
        const distY = Math.abs(svgCoords.y - startPosRef.current.y);
        const travelled = Math.sqrt(distX * distX + distY * distY);
        
        gsap.to(dummyCord, {
          attr: { x2: ENDX, y2: ENDY },
          duration: CORD_DURATION,
          onComplete: () => {
            if (travelled > 30) { // Reduced threshold for easier triggering
              cordTL.restart();
            } else {
              reset();
            }
          },
        });
      },
    });

    // Cleanup
    return () => {
      draggable[0].kill();
      cordTL.kill();
      if (document.body.contains(proxyElement)) {
        document.body.removeChild(proxyElement);
      }
    };
  }, []);

  // Update CSS custom properties when state changes
  useEffect(() => {
    document.documentElement.style.setProperty('--on', isFocusMode ? '1' : '0');
  }, [isFocusMode]);

  return (
    <div 
      className={`bulb-container ${className || ''}`} 
      style={style}
      {...props}
    >
      <style>{`
        * {
          box-sizing: border-box;
        }

        :root {
          --on: ${isFocusMode ? '1' : '0'};
          --bg: transparent;
          --cord: ${isFocusMode 
            ? 'hsl(0, 0%, 40%)' 
            : 'hsl(0, 0%, 70%)'
          };
          --stroke: ${isFocusMode 
            ? 'hsl(0, 0%, 30%)' 
            : 'hsl(0, 0%, 60%)'
          };
          --shine: ${isFocusMode 
            ? 'hsla(0, 0%, 100%, 0.8)' 
            : 'hsla(0, 0%, 100%, 0.2)'
          };
          --cap: ${isFocusMode 
            ? 'hsl(0, 0%, 60%)' 
            : 'hsl(0, 0%, 45%)'
          };
          --filament: hsl(45, ${Number(isFocusMode) * 80}%, ${25 + (Number(isFocusMode) * 75)}%);
        }

        .bulb-container {
          width: 100%;
          height: 100%;
          min-height: 440px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          transition: background 0.4s ease;
          z-index: 1000;
          position: relative;
        }

        .toggle-scene {
          overflow: visible !important;
          height: 80vmin;
          position: relative;
          z-index: 10;
          transform: translateY(80px);
        }

        /* Concentric circles */
        .concentric-circles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          pointer-events: none;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.4s ease;
        }

        .circle-1 {
          width: 140px;
          height: 140px;
          background: ${isFocusMode 
            ? 'radial-gradient(circle, hsla(45, 80%, 80%, 0.5) 0%, hsla(45, 80%, 80%, 0.1) 100%)'
            : 'radial-gradient(circle, hsla(220, 20%, 40%, 0.3) 0%, hsla(220, 20%, 40%, 0.05) 100%)'
          };
          ${isFocusMode 
            ? 'box-shadow: 0 0 50px hsla(45, 80%, 80%, 0.4), inset 0 0 30px hsla(45, 80%, 90%, 0.2);' 
            : 'box-shadow: 0 0 20px hsla(220, 30%, 50%, 0.3);'
          }
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          background: ${isFocusMode 
            ? 'radial-gradient(circle, hsla(45, 70%, 85%, 0.4) 0%, hsla(45, 70%, 85%, 0.05) 100%)'
            : 'radial-gradient(circle, hsla(220, 25%, 35%, 0.2) 0%, hsla(220, 25%, 35%, 0.02) 100%)'
          };
          ${isFocusMode 
            ? 'box-shadow: 0 0 70px hsla(45, 80%, 80%, 0.3), inset 0 0 40px hsla(45, 80%, 90%, 0.1);' 
            : 'box-shadow: 0 0 30px hsla(220, 30%, 50%, 0.2);'
          }
        }

        .circle-3 {
          width: 260px;
          height: 260px;
          background: ${isFocusMode 
            ? 'radial-gradient(circle, hsla(45, 60%, 90%, 0.3) 0%, hsla(45, 60%, 90%, 0.02) 100%)'
            : 'radial-gradient(circle, hsla(220, 30%, 30%, 0.15) 0%, hsla(220, 30%, 30%, 0.01) 100%)'
          };
          ${isFocusMode 
            ? 'box-shadow: 0 0 90px hsla(45, 80%, 80%, 0.2);' 
            : 'box-shadow: 0 0 40px hsla(220, 30%, 50%, 0.15);'
          }
        }

        .circle-4 {
          width: 320px;
          height: 320px;
          background: ${isFocusMode 
            ? 'radial-gradient(circle, hsla(45, 50%, 95%, 0.2) 0%, hsla(45, 50%, 95%, 0.01) 100%)'
            : 'radial-gradient(circle, hsla(220, 35%, 25%, 0.1) 0%, hsla(220, 35%, 25%, 0.005) 100%)'
          };
          ${isFocusMode 
            ? 'box-shadow: 0 0 110px hsla(45, 80%, 80%, 0.15);' 
            : 'box-shadow: 0 0 50px hsla(220, 30%, 50%, 0.1);'
          }
        }

        .toggle-scene__cord {
          stroke: var(--cord);
          cursor: move;
          transition: stroke 0.3s ease;
        }

        .toggle-scene__cord:nth-of-type(1) {
          display: none;
        }

        .toggle-scene__cord:nth-of-type(2),
        .toggle-scene__cord:nth-of-type(3),
        .toggle-scene__cord:nth-of-type(4),
        .toggle-scene__cord:nth-of-type(5) {
          display: none;
        }

        .toggle-scene__cord-end {
          stroke: var(--cord);
          fill: var(--cord);
          transition: stroke 0.3s ease, fill 0.3s ease;
        }

        .toggle-scene__dummy-cord {
          stroke-width: 6;
          stroke: var(--cord);
          transition: stroke 0.3s ease;
        }

        .toggle-scene__hit-spot {
          cursor: grab;
        }

        .toggle-scene__hit-spot:active {
          cursor: grabbing;
        }

        .bulb__filament {
          stroke: var(--filament);
          transition: stroke 0.3s ease;
        }

        .bulb__shine {
          stroke: var(--shine);
          transition: stroke 0.3s ease;
        }

        .bulb__flash {
          stroke: hsl(45, 80%, 80%);
          display: none;
        }

        .bulb__bulb {
          stroke: var(--stroke);
          fill: ${isFocusMode 
            ? 'hsla(45, 80%, 85%, 0.9)'
            : 'hsla(220, 20%, 50%, 0.4)'
          };
          transition: stroke 0.4s ease, fill 0.4s ease;
        }

        .bulb__cap {
          fill: var(--cap);
          transition: fill 0.3s ease;
        }

        .bulb__cap-shine {
          fill: var(--shine);
          transition: fill 0.3s ease;
        }

        .bulb__cap-outline {
          stroke: var(--stroke);
          transition: stroke 0.3s ease;
        }

        /* Add enhanced glow effects */
        ${isFocusMode ? `
        .bulb__bulb {
          filter: drop-shadow(0 0 25px hsla(45, 80%, 80%, 0.8)) drop-shadow(0 0 50px hsla(45, 80%, 80%, 0.4));
        }
        
        .bulb__filament {
          filter: drop-shadow(0 0 15px hsla(45, 80%, 80%, 1)) drop-shadow(0 0 30px hsla(45, 80%, 80%, 0.6));
        }

        .bulb__flash {
          display: block !important;
          stroke: hsla(45, 100%, 90%, 0.8);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        ` : `
        .bulb__bulb {
          filter: drop-shadow(0 0 5px hsla(220, 30%, 60%, 0.3));
        }
        
        .bulb__filament {
          filter: none;
        }
        `}
      `}</style>
      
      <div className="concentric-circles">
        <div className="circle circle-4"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-1"></div>
      </div>
      
      <svg 
        ref={svgRef}
        className="toggle-scene" 
        xmlns="http://www.w3.org/2000/svg" 
        preserveAspectRatio="xMinYMin" 
        viewBox="0 0 197.451 481.081"
      >
        <defs>
          <marker id="e" orient="auto" overflow="visible" refX="0" refY="0">
            <path className="toggle-scene__cord-end" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </marker>
          <marker id="d" orient="auto" overflow="visible" refX="0" refY="0">
            <path className="toggle-scene__cord-end" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </marker>
          <marker id="c" orient="auto" overflow="visible" refX="0" refY="0">
            <path className="toggle-scene__cord-end" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </marker>
          <marker id="b" orient="auto" overflow="visible" refX="0" refY="0">
            <path className="toggle-scene__cord-end" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </marker>
          <marker id="a" orient="auto" overflow="visible" refX="0" refY="0">
            <path className="toggle-scene__cord-end" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </marker>
          <clipPath id="g" clipPathUnits="userSpaceOnUse">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.677" d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z"></path>
          </clipPath>
          <clipPath id="f" clipPathUnits="userSpaceOnUse">
            <path d="M-868.418 945.051c-4.188 73.011 78.255 53.244 150.216 52.941 82.387-.346 98.921-19.444 98.921-47.058 0-27.615-4.788-42.55-73.823-42.55-69.036 0-171.436-30.937-175.314 36.667z"></path>
          </clipPath>
        </defs>
        <g className="toggle-scene__cords">
          <path className="toggle-scene__cord" markerEnd="url(#a)" fill="none" strokeLinecap="square" strokeWidth="6" d="M123.228-28.56v150.493" transform="translate(-24.503 256.106)"></path>
          <path className="toggle-scene__cord" markerEnd="url(#a)" fill="none" strokeLinecap="square" strokeWidth="6" d="M123.228-28.59s28 8.131 28 19.506-18.667 13.005-28 19.507c-9.333 6.502-28 8.131-28 19.506s28 19.507 28 19.507" transform="translate(-24.503 256.106)"></path>
          <path className="toggle-scene__cord" markerEnd="url(#a)" fill="none" strokeLinecap="square" strokeWidth="6" d="M123.228-28.575s-20 16.871-20 28.468c0 11.597 13.333 18.978 20 28.468 6.667 9.489 20 16.87 20 28.467 0 11.597-20 28.468-20 28.468" transform="translate(-24.503 256.106)"></path>
          <path className="toggle-scene__cord" markerEnd="url(#a)" fill="none" strokeLinecap="square" strokeWidth="6" d="M123.228-28.569s16 20.623 16 32.782c0 12.16-10.667 21.855-16 32.782-5.333 10.928-16 20.623-16 32.782 0 12.16 16 32.782 16 32.782" transform="translate(-24.503 256.106)"></path>
          <path className="toggle-scene__cord" markerEnd="url(#a)" fill="none" strokeLinecap="square" strokeWidth="6" d="M123.228-28.563s-10 24.647-10 37.623c0 12.977 6.667 25.082 10 37.623 3.333 12.541 10 24.647 10 37.623 0 12.977-10 37.623-10 37.623" transform="translate(-24.503 256.106)"></path>
          <g className="line toggle-scene__dummy-cord">
            <line markerEnd="url(#a)" x1="98.7255" x2="98.7255" y1="240.5405" y2="380.5405"></line>
          </g>
          <circle className="toggle-scene__hit-spot" cx="98.7255" cy="380.5405" r="60" fill="transparent"></circle>
        </g>
        <g className="toggle-scene__bulb bulb" transform="translate(844.069 -645.213)">
          <path className="bulb__cap" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.677" d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z"></path>
          <path className="bulb__cap-shine" d="M-778.379 802.873h25.512v118.409h-25.512z" clipPath="url(#g)" transform="matrix(.52452 0 0 .90177 -368.282 82.976)"></path>
          <path className="bulb__cap" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v0s-8.439 10.115-28.817 10.115c-21.673 0-29.59-10.115-29.59-10.115z"></path>
          <path className="bulb__cap-outline" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.677" d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z"></path>
          <g className="bulb__filament" fill="none" strokeLinecap="round" strokeWidth="5">
            <path d="M-752.914 823.875l-8.858-33.06"></path>
            <path d="M-737.772 823.875l8.858-33.06"></path>
          </g>
          <path className="bulb__bulb" strokeLinecap="round" strokeWidth="5" d="M-783.192 803.855c5.251 8.815 5.295 21.32 13.272 27.774 12.299 8.045 36.46 8.115 49.127 0 7.976-6.454 8.022-18.96 13.273-27.774 3.992-6.7 14.408-19.811 14.408-19.811 8.276-11.539 12.769-24.594 12.769-38.699 0-35.898-29.102-65-65-65-35.899 0-65 29.102-65 65 0 13.667 4.217 26.348 12.405 38.2 0 0 10.754 13.61 14.746 20.31z"></path>
          <circle className="bulb__flash" cx="-745.343" cy="743.939" r="83.725" fill="none" strokeDasharray="10,30" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"></circle>
          <path className="bulb__shine" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="M-789.19 757.501a45.897 45.897 0 013.915-36.189 45.897 45.897 0 0129.031-21.957"></path>
        </g>
      </svg>
    </div>
  );
};

export default function Bulb({ style, className, ...props }: BulbComponentProps = {}) {
  return <BulbComponent style={style} className={className} {...props} />;
}

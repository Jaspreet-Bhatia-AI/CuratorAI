import React, { useEffect, useRef, useState } from 'react';

export default function InteractiveGrid() {
  const gridRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  // Smaller cell size = more cells, but 50 is a good balance of performance and aesthetics
  const CELL_SIZE = 60; 

  useEffect(() => {
    let timeoutId;
    const updateDimensions = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDimensions({
          w: window.innerWidth,
          h: window.innerHeight
        });
      }, 100);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!gridRef.current || dimensions.w === 0) return;
    
    let ticking = false;
    let mouseX = -1000;
    let mouseY = -1000;
    const cells = gridRef.current.children;
    const maxDist = 250; // Radius of interaction

    // Pre-calculate cell centers for fast math
    const cellCenters = new Float32Array(cells.length * 2);
    for (let i = 0; i < cells.length; i++) {
      const rect = cells[i].getBoundingClientRect();
      cellCenters[i * 2] = rect.left + rect.width / 2;
      cellCenters[i * 2 + 1] = rect.top + rect.height / 2;
    }

    const updateGrid = () => {
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const cellCenterX = cellCenters[i * 2];
        const cellCenterY = cellCenters[i * 2 + 1];
        
        const distX = mouseX - cellCenterX;
        const distY = mouseY - cellCenterY;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < maxDist) {
          // Normalize from 0 (at maxDist) to 1 (at center)
          const pop = Math.pow(1 - (dist / maxDist), 1.5); 
          
          cell.style.transform = `scale(${1 + pop * 0.2}) translateY(-${pop * 8}px) translateZ(${pop * 20}px)`;
          cell.style.backgroundColor = `rgba(96, 99, 238, ${pop * 0.12})`;
          cell.style.borderColor = `rgba(96, 99, 238, ${pop * 0.4})`;
          cell.style.boxShadow = `0 ${pop * 10}px ${pop * 20}px rgba(96, 99, 238, ${pop * 0.1})`;
          cell.style.zIndex = Math.round(pop * 10);
        } else {
          // Reset
          cell.style.transform = 'scale(1) translateY(0) translateZ(0)';
          cell.style.backgroundColor = 'transparent';
          cell.style.borderColor = 'rgba(118, 117, 134, 0.08)';
          cell.style.boxShadow = 'none';
          cell.style.zIndex = 0;
        }
      }
      ticking = false;
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!ticking) {
        requestAnimationFrame(updateGrid);
        ticking = true;
      }
    };
    
    // Also clear the effect when mouse leaves window
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      if (!ticking) {
        requestAnimationFrame(updateGrid);
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Run once to reset all cells
    requestAnimationFrame(updateGrid);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dimensions]);

  if (dimensions.w === 0) return null;

  // Add 1 to ensure full coverage
  const cols = Math.ceil(dimensions.w / CELL_SIZE) + 1;
  const rows = Math.ceil(dimensions.h / CELL_SIZE) + 1;
  const totalCells = cols * rows;

  return (
    <div 
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background"
      style={{ perspective: '800px' }} // Gives true 3D popping depth
    >
      <div 
        ref={gridRef}
        className="absolute top-0 left-0 flex flex-wrap"
        style={{
          width: `${cols * CELL_SIZE}px`,
          height: `${rows * CELL_SIZE}px`,
        }}
      >
        {Array.from({ length: totalCells }).map((_, i) => (
          <div 
            key={i} 
            className="box-border transition-all duration-[400ms] ease-out"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              border: '1px solid rgba(118, 117, 134, 0.08)',
              transformOrigin: 'center center',
              willChange: 'transform, background-color, border-color, box-shadow'
            }}
          />
        ))}
      </div>
      {/* Soft gradient overlay to blend edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none"></div>
    </div>
  );
}

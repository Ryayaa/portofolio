import React, { useEffect, useRef, useState } from 'react';

export default function NekoCat() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [catState, setCatState] = useState('idle'); // 'idle', 'run-left', 'run-right', 'sleep', 'scratch'
  const [angle, setAngle] = useState(0);

  const targetRef = useRef({ x: 100, y: 100 });
  const lastPositionRef = useRef({ x: 100, y: 100 });
  const idleTimerRef = useRef(null);

  useEffect(() => {
    // Track mouse movement
    const handleMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let animId;
    const speed = 4.5;

    const update = () => {
      setPosition((prev) => {
        const target = targetRef.current;
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let nextX = prev.x;
        let nextY = prev.y;
        let nextState = 'idle';

        if (dist > 30) {
          // Cat runs towards mouse
          const rad = Math.atan2(dy, dx);
          setAngle(rad);
          nextX += Math.cos(rad) * speed;
          nextY += Math.sin(rad) * speed;
          nextState = dx < 0 ? 'run-left' : 'run-right';

          if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
          }
        } else {
          // Near mouse, stay idle or sleep
          nextState = catState;
          if (nextState !== 'sleep' && nextState !== 'scratch' && !idleTimerRef.current) {
            nextState = 'idle';
            idleTimerRef.current = setTimeout(() => {
              // Randomly sleep or scratch
              setCatState(Math.random() > 0.5 ? 'sleep' : 'scratch');
            }, 3000);
          }
        }

        if (nextState === 'run-left' || nextState === 'run-right' || nextState === 'idle') {
          setCatState(nextState);
        }

        return { x: nextX, y: nextY };
      });

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [catState]);

  // Render SVG cat based on state
  return (
    <div
      style={{
        position: 'fixed',
        left: position.x - 20,
        top: position.y - 20,
        width: 40,
        height: 40,
        zIndex: 9999,
        pointerEvents: 'none',
        transform: `rotate(${catState === 'sleep' ? 0 : angle * 0.1}rad)`,
        transition: 'transform 0.15s ease-out'
      }}
    >
      {catState === 'sleep' ? (
        // Sleeping Cat
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <circle cx="16" cy="18" r="10" fill="#facc15" />
          <path d="M 12 18 Q 14 20 16 18 Q 18 20 20 18" stroke="#374151" strokeWidth="2" fill="none" />
          <path d="M 8 12 Q 10 16 14 15" stroke="#facc15" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 24 12 Q 22 16 18 15" stroke="#facc15" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Zzz text bubbles */}
          <text x="22" y="10" fill="#60a5fa" fontSize="8" fontWeight="bold" className="animate-pulse">Z</text>
          <text x="26" y="6" fill="#60a5fa" fontSize="6" fontWeight="bold" className="animate-ping">z</text>
        </svg>
      ) : catState === 'scratch' ? (
        // Scratching/Playing Cat
        <svg viewBox="0 0 32 32" className="w-full h-full animate-bounce">
          <circle cx="16" cy="16" r="9" fill="#facc15" />
          <polygon points="10,10 8,3 15,9" fill="#eab308" />
          <polygon points="22,10 24,3 17,9" fill="#eab308" />
          <circle cx="13" cy="14" r="1.5" fill="#111" />
          <circle cx="19" cy="14" r="1.5" fill="#111" />
          <path d="M 14 19 Q 16 21 18 19" stroke="#111" strokeWidth="1.5" fill="none" />
          <path d="M 10 24 L 6 26 M 22 24 L 26 26" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ) : (
        // Running / Idle Cat
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full"
          style={{
            transform: catState === 'run-left' ? 'scaleX(-1)' : 'none'
          }}
        >
          <polygon points="10,12 7,4 14,11" fill="#facc15" />
          <polygon points="22,12 25,4 18,11" fill="#facc15" />
          <circle cx="16" cy="18" r="9" fill="#facc15" />
          <circle cx="13" cy="16" r="1.5" fill="#000" />
          <circle cx="19" cy="16" r="1.5" fill="#000" />
          <path d="M 15 21 Q 16 22.5 17 21" stroke="#000" strokeWidth="1.5" fill="none" />
          {/* Moving Tail */}
          <path
            d="M 8 22 Q 4 18 2 24"
            stroke="#facc15"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            className="animate-pulse"
          />
        </svg>
      )}
    </div>
  );
}

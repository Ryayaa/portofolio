import React, { useEffect, useRef, useState } from 'react';
import { X, Play, RotateCcw } from 'lucide-react';

const playSound = (freq, type = 'square', duration = 0.08) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = window._audioCtx || new AudioContext();
    window._audioCtx = ctx;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

export default function BugHunter({ onClose, lang = 'en' }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  const stateRef = useRef({
    player: { x: 0, y: 0, w: 40, h: 30 },
    bullets: [],
    bugs: [],
    particles: [],
    mouse: { x: 0 },
    lastShot: 0
  });

  const animFrameRef = useRef(null);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stateRef.current.player.y = canvas.height - 80;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const handleMouseMove = (e) => {
      stateRef.current.mouse.x = e.clientX;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        stateRef.current.mouse.x = e.touches[0].clientX;
      }
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Game Loop
  useEffect(() => {
    if (!isPlaying || isGameOver || isGameWon) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const bugTypes = ['🐛', '404', 'ERROR', 'NULL_PTR', 'SYNTAX_ERR', 'CRASH', 'BUG'];

    const loop = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { player, bullets, bugs, particles, mouse } = stateRef.current;

      // Update Player position
      player.x = mouse.x - player.w / 2;
      if (player.x < 0) player.x = 0;
      if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

      // Auto Fire Bullets
      if (timestamp - stateRef.current.lastShot > 140) {
        bullets.push({ x: player.x + player.w / 2, y: player.y, r: 3, speed: 10 });
        playSound(600, 'sine', 0.05);
        stateRef.current.lastShot = timestamp;
      }

      // Draw Spaceship
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(player.x + player.w / 2, player.y);
      ctx.lineTo(player.x, player.y + player.h);
      ctx.lineTo(player.x + player.w, player.y + player.h);
      ctx.closePath();
      ctx.fill();

      // Wing decoration
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(player.x + 2, player.y + player.h - 8, 6, 8);
      ctx.fillRect(player.x + player.w - 8, player.y + player.h - 8, 6, 8);

      // Update & Draw Bullets
      stateRef.current.bullets = bullets.filter(b => b.y > 0);
      stateRef.current.bullets.forEach(b => {
        b.y -= b.speed;
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spawn Bugs
      if (Math.random() < 0.035 && bugs.length < 15) {
        const text = bugTypes[Math.floor(Math.random() * bugTypes.length)];
        const textWidth = ctx.measureText(text).width;
        bugs.push({
          x: Math.random() * (canvas.width - 60) + 30,
          y: -20,
          w: textWidth + 12,
          h: 24,
          text,
          speed: Math.random() * 2 + 1.5,
          color: `hsl(${Math.random() * 40}, 90%, 55%)` // Reddish colors
        });
      }

      // Update & Draw Bugs
      stateRef.current.bugs = bugs.filter(b => b.y < canvas.height);
      stateRef.current.bugs.forEach(b => {
        b.y += b.speed;

        // Draw bug box
        ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 6);
        ctx.fill();
        ctx.stroke();

        // Draw bug text
        ctx.fillStyle = b.color;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.text, b.x, b.y);

        // Collision: Spaceship vs Bug
        const distToPlayerX = Math.abs(b.x - (player.x + player.w / 2));
        const distToPlayerY = Math.abs(b.y - (player.y + player.h / 2));
        if (distToPlayerX < (player.w + b.w) / 2 && distToPlayerY < (player.h + b.h) / 2) {
          b.y = canvas.height + 100; // Trigger destruction
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setIsGameOver(true);
              playSound(150, 'sawtooth', 0.5);
            } else {
              playSound(200, 'sawtooth', 0.2);
            }
            return nextL;
          });
        }

        // Collision: Bullets vs Bug
        stateRef.current.bullets.forEach(bullet => {
          const distBulletX = Math.abs(bullet.x - b.x);
          const distBulletY = Math.abs(bullet.y - b.y);

          if (distBulletX < b.w / 2 && distBulletY < b.h / 2) {
            b.y = canvas.height + 100; // Destroy bug
            bullet.y = -100; // Destroy bullet
            setScore(s => s + 20);
            playSound(350 + Math.random() * 100, 'triangle', 0.08);

            // Spawn particles
            for (let p = 0; p < 8; p++) {
              particles.push({
                x: b.x,
                y: b.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                r: Math.random() * 2 + 1.5,
                color: b.color,
                alpha: 1
              });
            }
          }
        });
      });

      // Update & Draw Particles
      stateRef.current.particles = particles.filter(p => p.alpha > 0.01);
      stateRef.current.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, isGameOver, isGameWon]);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setIsGameWon(false);
    setScore(0);
    setLives(3);
    stateRef.current.bugs = [];
    stateRef.current.bullets = [];
    stateRef.current.particles = [];
  };

  return (
    <div className="fixed inset-0 z-[150] select-none">
      <canvas ref={canvasRef} className="absolute inset-0 bg-black/90" />

      {/* Interface */}
      <div className="absolute top-4 left-6 text-white font-mono z-[160] flex gap-8">
        <div>
          <h3 className="text-[10px] tracking-widest text-gray-500 font-bold uppercase">SCORE</h3>
          <p className="text-xl font-black text-blue-500">{score}</p>
        </div>
        <div>
          <h3 className="text-[10px] tracking-widest text-gray-500 font-bold uppercase">LIVES</h3>
          <p className="text-xl font-black text-red-500">{"❤️ ".repeat(lives)}</p>
        </div>
      </div>

      <div className="absolute top-4 right-6 z-[160]">
        <button
          onClick={onClose}
          className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Start screen */}
      {!isPlaying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md z-[155]">
          <div className="text-center space-y-6 max-w-sm p-6">
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">👾 Bug Hunter!</h2>
            <p className="text-gray-400 text-xs leading-relaxed font-sans">
              {lang === 'id' 
                ? "Geser kursor mouse atau sentuh layar untuk mengendalikan pesawat tempur. Hancurkan semua bug merah yang berjatuhan sebelum mereka menabrak pesawat Anda!"
                : "Slide your cursor or touch to move your spaceship. Shoot down all falling red programming bugs before they hit your spaceship!"}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 mx-auto text-xs uppercase font-mono tracking-wider shadow-lg"
            >
              <Play size={16} />
              <span>{lang === 'id' ? 'Mulai Berburu' : 'Start Hunting'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Over screen */}
      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-[155]">
          <div className="text-center space-y-6 max-w-xs p-6">
            <h2 className="text-4xl font-black text-red-500 uppercase tracking-widest animate-pulse">SYSTEM CRASHED</h2>
            <p className="text-gray-400 text-xs">
              {lang === 'id' ? "Pesawat Anda hancur tertabrak bug fatal!" : "Your spaceship was destroyed by fatal bug exceptions!"}
            </p>
            <p className="text-xl font-bold font-mono text-blue-500">FINAL SCORE: {score}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={startGame}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <RotateCcw size={14} />
                <span>{lang === 'id' ? 'Coba Lagi' : 'Retry'}</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <span>{lang === 'id' ? 'Keluar' : 'Exit'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

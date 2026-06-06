import React, { useEffect, useRef, useState } from 'react';
import { X, Play, RotateCcw } from 'lucide-react';

const playBeep = (freq, duration = 0.1) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = window._audioCtx || new AudioContext();
    window._audioCtx = ctx;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // fail silently
  }
};

export default function BrickBreaker({ onClose, lang = 'en' }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const stateRef = useRef({
    ball: { x: 0, y: 0, vx: 5, vy: -5, r: 8 },
    paddle: { x: 0, y: 0, w: 120, h: 12 },
    bricks: [],
    mouse: { x: 0 }
  });

  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Gather all actual elements on the screen to turn them into bricks!
    const items = document.querySelectorAll('.gravity-item, .card-spotlight');
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    const bricks = Array.from(items).map((el, index) => {
      const rect = el.getBoundingClientRect();
      // Store original style visibility so we can restore it
      const originalOpacity = el.style.opacity;
      const originalPointerEvents = el.style.pointerEvents;
      
      // Hide the actual element on screen when game is playing!
      if (isPlaying) {
        el.style.opacity = '0.1';
        el.style.pointerEvents = 'none';
      }

      return {
        el,
        originalOpacity,
        originalPointerEvents,
        x: rect.left,
        y: rect.top, // using screen coordinate
        w: rect.width,
        h: rect.height,
        color: `hsl(${(index * 360 / items.length) || 200}, 75%, 55%)`,
        destroyed: false
      };
    });

    stateRef.current.bricks = bricks;

    // Resize Canvas to take entire page space
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reset paddle & ball positions
      stateRef.current.paddle.y = canvas.height - 40;
      stateRef.current.paddle.x = (canvas.width - stateRef.current.paddle.w) / 2;
      
      if (!isPlaying) {
        stateRef.current.ball.x = canvas.width / 2;
        stateRef.current.ball.y = stateRef.current.paddle.y - 15;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinates
    const handleMouseMove = (e) => {
      stateRef.current.mouse.x = e.clientX;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Touch support for mobile
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
      
      // Restore all hidden elements on screen!
      bricks.forEach(b => {
        b.el.style.opacity = b.originalOpacity;
        b.el.style.pointerEvents = b.originalPointerEvents;
      });
    };
  }, [isPlaying]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying || isGameOver || isGameWon) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { ball, paddle, bricks, mouse } = stateRef.current;

      // Update Paddle
      paddle.x = mouse.x - paddle.w / 2;
      if (paddle.x < 0) paddle.x = 0;
      if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;

      // Update Ball Position
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Draw Bricks
      let activeBricksCount = 0;
      bricks.forEach(b => {
        if (b.destroyed) return;
        activeBricksCount++;

        // Draw Brick
        ctx.fillStyle = b.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 8);
        ctx.fill();
        ctx.stroke();

        // Collision: Ball vs Brick
        const closestX = Math.max(b.x, Math.min(ball.x, b.x + b.w));
        const closestY = Math.max(b.y, Math.min(ball.y, b.y + b.h));
        
        const distX = ball.x - closestX;
        const distY = ball.y - closestY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance <= ball.r) {
          b.destroyed = true;
          // Hide actual element
          b.el.style.opacity = '0';
          setScore(s => s + 10);
          playBeep(440 + Math.random() * 200, 0.08);

          // Bounce math
          if (ball.x < b.x || ball.x > b.x + b.w) {
            ball.vx = -ball.vx;
          } else {
            ball.vy = -ball.vy;
          }
        }
      });

      if (activeBricksCount === 0 && bricks.length > 0) {
        setIsGameWon(true);
        playBeep(880, 0.4);
        return;
      }

      // Ball collision with left/right walls
      if (ball.x - ball.r <= 0) {
        ball.x = ball.r;
        ball.vx = -ball.vx;
        playBeep(250, 0.05);
      } else if (ball.x + ball.r >= canvas.width) {
        ball.x = canvas.width - ball.r;
        ball.vx = -ball.vx;
        playBeep(250, 0.05);
      }

      // Ball collision with ceiling
      if (ball.y - ball.r <= 0) {
        ball.y = ball.r;
        ball.vy = -ball.vy;
        playBeep(250, 0.05);
      }

      // Ball collision with paddle
      if (
        ball.y + ball.r >= paddle.y &&
        ball.y - ball.r <= paddle.y + paddle.h &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.w
      ) {
        ball.y = paddle.y - ball.r;
        ball.vy = -ball.vy;
        
        // Add angles based on where it hit paddle
        const relativeHit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        ball.vx = relativeHit * 8;
        playBeep(330, 0.08);
      }

      // Ball fell down (Game Over)
      if (ball.y - ball.r > canvas.height) {
        setIsGameOver(true);
        playBeep(120, 0.5);
        return;
      }

      // Draw Paddle
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6);
      ctx.fill();

      // Draw Ball
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();

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
    
    // reset ball/speed
    const canvas = canvasRef.current;
    stateRef.current.ball = {
      x: canvas ? canvas.width / 2 : 300,
      y: canvas ? canvas.height - 60 : 400,
      vx: (Math.random() > 0.5 ? 4 : -4) * (1.2 + Math.random() * 0.4),
      vy: -6,
      r: 8
    };
  };

  return (
    <div className="fixed inset-0 z-[150] select-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
      />

      {/* Game controls / overlays */}
      <div className="absolute top-4 left-6 text-white font-mono z-[160]">
        <h3 className="text-sm font-bold opacity-60">PORTFOLIO BRICK BREAKER</h3>
        <p className="text-xl font-black text-blue-500">SCORE: {score}</p>
      </div>

      <div className="absolute top-4 right-6 z-[160]">
        <button
          onClick={onClose}
          className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center"
        >
          <X size={20} />
        </button>
      </div>

      {/* Starting Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-[155]">
          <div className="text-center space-y-6 max-w-md p-6">
            <h2 className="text-4xl font-black text-white tracking-tight">Portfolio <span className="text-blue-500">Breaker</span>!</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {lang === 'id' 
                ? "Gunakan mouse atau geser layar untuk memindahkan papan pemukul. Hancurkan semua kartu portofolio di layar dengan memantulkan bola!"
                : "Move the paddle using your mouse or touch screen. Destroy all the portfolio cards on the screen by bouncing the ball!"}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 mx-auto shadow-lg shadow-blue-600/35 text-sm uppercase tracking-wider"
            >
              <Play size={18} />
              <span>{lang === 'id' ? 'Mulai Game' : 'Start Game'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Over / Game Won overlay */}
      {(isGameOver || isGameWon) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-[155]">
          <div className="text-center space-y-6 max-w-md p-6">
            <h2 className="text-5xl font-black tracking-tight">
              {isGameWon 
                ? <span className="text-green-500">VICTORY!</span> 
                : <span className="text-red-500">GAME OVER</span>}
            </h2>
            <p className="text-gray-400 text-sm">
              {isGameWon 
                ? (lang === 'id' ? "Luar biasa! Semua portofolio Anda telah runtuh!" : "Amazing! All your portfolio items have collapsed!")
                : (lang === 'id' ? "Sayang sekali bolanya jatuh!" : "Oops! The ball fell down!")}
            </p>
            <p className="text-2xl font-bold text-blue-500">FINAL SCORE: {score}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>{lang === 'id' ? 'Main Lagi' : 'Play Again'}</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{lang === 'id' ? 'Tutup' : 'Close'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

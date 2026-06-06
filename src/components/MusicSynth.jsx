import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const NOTE_FREQS = {
  a: { note: 'C4', freq: 261.63, color: '#ef4444' },
  s: { note: 'D4', freq: 293.66, color: '#f97316' },
  d: { note: 'E4', freq: 329.63, color: '#eab308' },
  f: { note: 'F4', freq: 349.23, color: '#22c55e' },
  g: { note: 'G4', freq: 392.00, color: '#06b6d4' },
  h: { note: 'A4', freq: 440.00, color: '#3b82f6' },
  j: { note: 'B4', freq: 493.88, color: '#6366f1' },
  k: { note: 'C5', freq: 523.25, color: '#a855f7' },
  l: { note: 'D5', freq: 587.33, color: '#ec4899' }
};

export default function MusicSynth({ onClose, lang = 'en' }) {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Audio Context Setup
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = window._audioCtx || new AudioContext();
    window._audioCtx = audioCtx;

    const playNote = (freq) => {
      try {
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // Synth instrument: triangle wave with lowpass filter for warmth
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1.2);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      } catch (e) {}
    };

    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      const noteInfo = NOTE_FREQS[key];
      if (noteInfo) {
        playNote(noteInfo.freq);
        
        // Add a visual ripple at random position
        const radius = Math.random() * 80 + 40;
        ripplesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height - 180) + 60,
          r: 5,
          maxR: radius,
          color: noteInfo.color,
          alpha: 1,
          note: noteInfo.note
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Canvas animation loop
    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripplesRef.current = ripplesRef.current.filter((r) => r.alpha > 0.01);
      ripplesRef.current.forEach((r) => {
        r.r += (r.maxR - r.r) * 0.08;
        r.alpha -= 0.015;

        ctx.strokeStyle = r.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = r.alpha;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = r.color;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(r.note, r.x, r.y);
      });
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[150] select-none">
      <canvas ref={canvasRef} className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      
      {/* Help Banner & Key Helper */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/95 border border-white/10 p-5 rounded-2xl shadow-2xl flex flex-col items-center gap-3 backdrop-blur-md z-[160] max-w-sm w-full">
        <h4 className="text-white text-xs font-mono font-bold uppercase tracking-wider">
          {lang === 'id' ? '🎹 KONTROL PIANO SYNTHESIZER' : '🎹 PIANO SYNTHESIZER CONTROLS'}
        </h4>
        <div className="flex gap-1">
          {Object.keys(NOTE_FREQS).map((k) => (
            <div key={k} className="flex flex-col items-center">
              <div className="w-8 h-12 bg-white rounded-md text-black flex items-center justify-center font-mono font-bold text-xs shadow-md border-b-4 border-gray-300">
                {k.toUpperCase()}
              </div>
              <span className="text-gray-400 font-mono text-[9px] mt-1">{NOTE_FREQS[k].note}</span>
            </div>
          ))}
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
    </div>
  );
}

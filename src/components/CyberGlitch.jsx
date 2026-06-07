import React, { useEffect } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import './CyberGlitch.css';

export default function CyberGlitch({ onClose, lang = 'en' }) {
  useEffect(() => {
    // Web Audio API Context setup
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = window._audioCtx || (AudioContext ? new AudioContext() : null);
    if (audioCtx) window._audioCtx = audioCtx;

    const playGlitchBuzz = () => {
      if (!audioCtx) return;
      try {
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // Use sawtooth wave for retro hum
        osc.type = 'sawtooth';
        // 50Hz to 90Hz random low hum
        const baseFreq = Math.random() * 40 + 50;
        osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
        
        // Random high pitch blips to simulate data glitch
        if (Math.random() > 0.4) {
          osc.frequency.setValueAtTime(Math.random() * 400 + 100, audioCtx.currentTime + 0.05);
        }

        gainNode.gain.setValueAtTime(0.012, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.35);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } catch (e) {}
    };

    // Play periodic data blips & buzzes
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        playGlitchBuzz();
      }
    }, 1800);

    // Initial buzz on spawn
    playGlitchBuzz();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="cyber-glitch-overlay-container">
      {/* Repeating Scanlines Overlay */}
      <div className="cyber-scanlines" />

      {/* Cyber Flicker Grid */}
      <div className="cyber-grid-overlay" />

      {/* Static Noise Overlay */}
      <div className="cyber-noise" />

      {/* Top Banner Alert */}
      <div className="cyber-alert-banner">
        <ShieldAlert size={16} className="animate-pulse text-red-500" />
        <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] font-black uppercase text-red-500">
          {lang === 'id' ? 'PERINGATAN: ANOMALI SISTEM AKTIF' : 'WARNING: SYSTEM ANOMALY ACTIVE'}
        </span>
        <ShieldAlert size={16} className="animate-pulse text-red-500" />
      </div>

      {/* Floating Status Indicator */}
      <div className="cyber-status-box">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
          <span className="text-red-500 font-mono text-[9px] uppercase tracking-wider font-bold">
            {lang === 'id' ? 'DEKRIPSI DATA' : 'DECRYPTING DATA'}
          </span>
        </div>
        <div className="text-[10px] text-gray-400 font-mono mt-1 leading-normal">
          ERR_CONN_BYPASS: TRUE<br />
          INTRUSION_LEVEL: 98%
        </div>
      </div>

      {/* Close button */}
      <div className="cyber-close-btn-container">
        <button
          onClick={onClose}
          className="p-3 bg-red-950/40 hover:bg-red-900/40 text-red-500 hover:text-red-400 border border-red-500/20 rounded-xl transition-all cursor-pointer font-mono text-xs flex items-center gap-2 backdrop-blur-md"
        >
          <X size={16} />
          <span>{lang === 'id' ? 'TUTUP ANOMALI' : 'CLOSE ANOMALY'}</span>
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { X, Award, ShieldAlert, CheckCircle, HelpCircle } from 'lucide-react';

export const EASTER_EGGS = [
  { id: 'konami', name: 'Chiptune Retro Sound', hint: 'Gunakan kode cheat gaming legendaris di keyboard Anda (↑↑↓↓←→←→ba)' },
  { id: 'matrix', name: 'Digital Matrix Rain', hint: 'Ketik password terminal peretas "matrix"' },
  { id: 'retro', name: 'Green Phosphor CRT', hint: 'Ketik gaya visual layar monitor lama "retro"' },
  { id: 'gravity', name: 'Gravity Collapser', hint: 'Ketik pemicu gravitasi runtuh "gravity" atau "boom"' },
  { id: 'terminal', name: 'Command Line Terminal', hint: 'Ketik kata shell peretas developer "shell" atau "terminal"' },
  { id: 'paint', name: 'Neon Paint Canvas', hint: 'Ketik kata melukis kursor "paint" atau "draw"' },
  { id: 'game', name: 'Portfolio Brick Breaker', hint: 'Ketik kata untuk bermain mini-game "play" atau "game"' },
  { id: 'neko', name: 'Neko Cat Follower', hint: 'Ketik panggilan kucing peliharaan "neko" atau "cat"' },
  { id: 'tilt', name: '3D Viewport Tilt', hint: 'Ketik kata perspektif tiga dimensi "3d" atau "tilt"' }
];

export default function EggTracker({ isOpen, onClose, unlockedEggs = [], lang = 'en' }) {
  if (!isOpen) return null;

  const totalEggs = EASTER_EGGS.length;
  const unlockedCount = unlockedEggs.length;
  const progressPercent = Math.round((unlockedCount / totalEggs) * 100);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#151515] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px] max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1e1e1e] px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Award className="text-yellow-500 animate-bounce" size={22} />
            <div>
              <h3 className="text-white text-base font-black tracking-wide">
                {lang === 'id' ? 'Pelacak Telur Paskah' : 'Easter Egg Achievement Tracker'}
              </h3>
              <p className="text-gray-400 text-xs font-mono">
                {unlockedCount} / {totalEggs} {lang === 'id' ? 'Terbuka' : 'Unlocked'} ({progressPercent}%)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1.5 hover:bg-white/5 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-[#1a1a1a] border-b border-white/5">
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-yellow-500 via-green-500 to-blue-500 transition-all duration-500"
            />
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-2 text-right">
            {unlockedCount === totalEggs 
              ? (lang === 'id' ? "🏆 LUAR BIASA! SEMUA TERBUKA!" : "🏆 LEGENDARY! ALL UNLOCKED!")
              : (lang === 'id' ? "Temukan semua rahasia yang tersembunyi!" : "Discover all hidden secrets on this website!")}
          </p>
        </div>

        {/* Checklist */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#0f0f0f]">
          {EASTER_EGGS.map((egg) => {
            const isUnlocked = unlockedEggs.includes(egg.id);

            return (
              <div 
                key={egg.id}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  isUnlocked 
                    ? 'bg-green-500/5 border-green-500/20' 
                    : 'bg-white/5 border-white/5 opacity-70'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${
                  isUnlocked ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-500'
                }`}>
                  {isUnlocked ? <CheckCircle size={20} /> : <HelpCircle size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold truncate ${isUnlocked ? 'text-white' : 'text-gray-400 font-medium'}`}>
                    {isUnlocked ? egg.name : (lang === 'id' ? 'Rahasia Terkunci' : 'Locked Secret')}
                  </h4>
                  <p className="text-gray-500 text-xs mt-1 leading-normal font-sans">
                    {isUnlocked 
                      ? (lang === 'id' ? '✓ Berhasil diaktifkan!' : '✓ Achievement Unlocked!')
                      : egg.hint}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

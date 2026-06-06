import React, { useEffect, useRef, useState } from 'react';
import { X, Award, CheckCircle, HelpCircle, Trophy, Copy, Check } from 'lucide-react';

export const EASTER_EGGS = [
  { 
    id: 'konami', 
    name: 'Retro Chiptune Sound', 
    hint_id: 'Gunakan cheat gaming legendaris di keyboard Anda (Mulai dengan Atas, Atas, Bawah, Bawah... dan akhiri dengan dua tombol aksi retro terkenal)',
    hint_en: 'Use the legendary retro gaming cheat code on your keyboard (Starts with Up, Up, Down, Down... and ends with the two famous action keys)'
  },
  { 
    id: 'matrix', 
    name: 'Digital Matrix Rain', 
    hint_id: 'Ketik password peretas legendaris bernuansa hujan kode hijau digital',
    hint_en: 'Type the legendary hacker password themed after green digital code rain'
  },
  { 
    id: 'retro', 
    name: 'Green Phosphor CRT', 
    hint_id: 'Panggil kata kunci monitor tabung kaca lama bernuansa monokrom hijau klasik',
    hint_en: 'Summon the classic green monochrome CRT monitor look with a simple retro word'
  },
  { 
    id: 'gravity', 
    name: 'Gravity Collapser', 
    hint_id: 'Jatuhkan dan hancurkan keseimbangan tata letak situs ini dengan kata daya tarik bumi atau ledakan',
    hint_en: 'Collapse and destroy the layout balance of this website using the word of earth attraction or explosion'
  },
  { 
    id: 'terminal', 
    name: 'Command Line Terminal', 
    hint_id: 'Buka konsol interaktif developer dengan mengetik pintu gerbang baris perintah (bahasa Inggris shell/konsol)',
    hint_en: 'Open the developer console command shell by typing the gate of command lines'
  },
  { 
    id: 'paint', 
    name: 'Neon Paint Canvas', 
    hint_id: 'Kuas neon menyala di tangan Anda. Ketik kata kerja bahasa Inggris melukis atau menggambar',
    hint_en: 'Glowing neon brush in your hand. Type the English verb for painting or drawing'
  },
  { 
    id: 'game', 
    name: 'Portfolio Brick Breaker', 
    hint_id: 'Mari menghancurkan kartu-kartu situs ini dengan memantulkan bola. Ketik kata untuk bermain atau game',
    hint_en: 'Let\'s destroy the cards of this website by bouncing a ball. Type the word for playing or game'
  },
  { 
    id: 'neko', 
    name: 'Neko Cat Follower', 
    hint_id: 'Panggil kucing desktop legendaris untuk berlari mengejar kursor mouse Anda',
    hint_en: 'Summon the legendary desktop cat to chase your mouse cursor around'
  },
  { 
    id: 'tilt', 
    name: '3D Viewport Tilt', 
    hint_id: 'Goyangkan sudut pandang situs ini secara tiga dimensi mengikuti mata Anda',
    hint_en: 'Tilt the perspective of this website three-dimensionally matching your eyes'
  },
  { 
    id: 'card', 
    name: 'Custom ID Card Maker', 
    hint_id: 'Identitas palsu? Bukan, ini kartu nama digital keren buatan sendiri untuk menyamar di kantor! (Benda berbahan plastik tipis persegi panjang di dompet Anda atau tanda pengenal)',
    hint_en: 'A fake identity? No, it\'s a cool self-made digital badge to sneak into the office! (The thin rectangular plastic item in your wallet or a form of identification)'
  },
  { 
    id: 'shoot', 
    name: 'Code Bug Hunter Space Game', 
    hint_id: 'Basmi musuh terbesar developer di luar angkasa! Aksi menarik pelatuk senjata atau tempat hampa tak berujung di antara bintang-bintang dalam bahasa Inggris.',
    hint_en: 'Exterminate the developer\'s worst nightmare in outer space! The action of pulling a gun trigger or the endless black void between stars in English.'
  },
  { 
    id: 'synth', 
    name: 'Keyboard Music Synthesizer', 
    hint_id: 'Ubah keyboard Anda menjadi alat musik tuts klasik pembawa harmoni indah, atau versi elektronik modern yang penuh modifikasi suara dalam bahasa Inggris.',
    hint_en: 'Turn your keyboard keys into a classical keyed instrument that creates beautiful harmony, or its modern electronic counterpart used for sound modification in English.'
  }
];

function ConfettiEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = ['#facc15', '#3b82f6', '#ec4899', '#10b981', '#a855f7', '#f97316'];
    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 5 + 4,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        if (p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
          p.tilt = Math.random() * 10 - 5;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[10]" />;
}

export default function EggTracker({ isOpen, onClose, unlockedEggs = [], onReset, lang = 'en' }) {
  const [copied, setCopied] = useState(false);
  const [showAchievementsList, setShowAchievementsList] = useState(false);

  if (!isOpen) return null;

  const totalEggs = EASTER_EGGS.length;
  const unlockedCount = unlockedEggs.length;
  const progressPercent = Math.round((unlockedCount / totalEggs) * 100);
  const isAllUnlocked = unlockedCount === totalEggs;

  const secretCode = "ARRYACHAMP99";

  const handleCopy = () => {
    navigator.clipboard.writeText(secretCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#151515] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[540px] max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Victory Confetti */}
        {isAllUnlocked && <ConfettiEffect />}

        {/* Header */}
        <div className="bg-[#1e1e1e] px-6 py-4 flex items-center justify-between border-b border-white/5 z-20">
          <div className="flex items-center gap-2.5">
            {isAllUnlocked ? (
              <Trophy className="text-yellow-500 animate-bounce" size={22} />
            ) : (
              <Award className="text-blue-500 animate-pulse" size={22} />
            )}
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

        {/* Victory Screen (Gimmick Reward) */}
        {isAllUnlocked && !showAchievementsList ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 bg-[#0f0f0f] z-20 overflow-y-auto">
            <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/30 text-yellow-500 animate-pulse shadow-lg shadow-yellow-500/5">
              <Trophy size={42} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 uppercase tracking-wide leading-normal">
                {lang === 'id' ? '🏆 PENJELAJAH LEGENDA!' : '🏆 LEGENDARY EXPLORER!'}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
                {lang === 'id' 
                  ? 'Selamat! Anda telah memecahkan semua teka-teki rahasia di website ini. Sebagai tanda penghargaan, gunakan kode rekrutmen VIP ini:' 
                  : 'Congratulations! You solved all the secret riddles on this website. As a reward, copy this VIP recruitment code:'}
              </p>
            </div>

            {/* Code Copy Widget */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5 pl-4 max-w-xs w-full shadow-inner">
              <span className="font-mono text-sm font-bold text-yellow-400 flex-1 text-left">{secretCode}</span>
              <button 
                onClick={handleCopy}
                className="p-2.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="text-[10px] uppercase font-bold">{copied ? (lang === 'id' ? 'Tersalin' : 'Copied') : (lang === 'id' ? 'Salin' : 'Copy')}</span>
              </button>
            </div>

            <p className="text-gray-500 text-xs italic max-w-xs">
              {lang === 'id' 
                ? 'Kirimkan kode ini saat menghubungi saya melalui form kontak untuk mendapatkan respon prioritas utama! 🚀' 
                : 'Send this code when contacting me through the form to receive high-priority response! 🚀'}
            </p>

            <button 
              onClick={() => setShowAchievementsList(true)}
              className="text-xs text-blue-500 hover:underline cursor-pointer pt-2 font-mono uppercase tracking-wider"
            >
              {lang === 'id' ? 'Lihat Daftar Pencapaian' : 'View Achievements Checklist'}
            </button>

            <button 
              onClick={onReset}
              className="text-xs text-red-500/70 hover:text-red-500 hover:underline cursor-pointer pt-2 font-mono uppercase tracking-wider block mx-auto"
            >
              {lang === 'id' ? 'Reset Semua Progress' : 'Reset All Progress'}
            </button>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="px-6 py-4 bg-[#1a1a1a] border-b border-white/5 z-20">
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-yellow-500 via-green-500 to-blue-500 transition-all duration-500"
                />
              </div>
              <div className="flex items-center justify-between mt-2 font-mono text-[9px] text-gray-500">
                <span>{progressPercent}% COMPLETE</span>
                {isAllUnlocked && (
                  <button 
                    onClick={() => setShowAchievementsList(false)}
                    className="text-yellow-500 hover:underline cursor-pointer uppercase font-bold"
                  >
                    {lang === 'id' ? 'Lihat Hadiah 🎁' : 'Show Reward 🎁'}
                  </button>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#0f0f0f] z-20">
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
                          : (lang === 'id' ? egg.hint_id : egg.hint_en)}
                      </p>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={onReset}
                className="w-full mt-4 py-3 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl font-bold transition-all text-xs uppercase tracking-wider cursor-pointer border border-red-500/20 hover:border-transparent flex items-center justify-center gap-2"
              >
                {lang === 'id' ? 'Reset Semua Pencapaian & Mode' : 'Reset Achievements & Active Modes'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

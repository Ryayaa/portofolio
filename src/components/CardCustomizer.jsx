import React, { useState, useRef } from 'react';
import { X, Upload, Download, Check, RefreshCw } from 'lucide-react';

export default function CardCustomizer({ onClose, lang = 'en' }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  
  const cardRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const handleReset = () => {
    setName('');
    setRole('');
    setAvatar('');
    setIsGenerated(false);
  };

  // Holographic 3D Tilt effect on Card Preview
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const angleX = (yc - y) / 10;
    const angleY = (x - xc) / 10;

    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    card.style.transition = 'none';

    // Update glass sheen overlay
    const sheen = card.querySelector('.sheen');
    if (sheen) {
      sheen.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, transparent 70%)`;
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    card.style.transition = 'transform 0.4s ease-out';
    const sheen = card.querySelector('.sheen');
    if (sheen) {
      sheen.style.background = 'transparent';
    }
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = '#0b0b0e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 25) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 25) {
      ctx.beginPath();
      ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
    }

    // Glow Border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    const drawText = () => {
      // Header
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ARRYA DEV ID', canvas.width / 2, 60);

      // Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(name.toUpperCase() || 'EXPLORER', canvas.width / 2, 360);

      // Role
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(role.toUpperCase() || 'DEVELOPER GUEST', canvas.width / 2, 395);

      // Metadata
      ctx.fillStyle = '#4b5563';
      ctx.font = '12px monospace';
      ctx.fillText('EXPIRES: 12/2030', canvas.width / 2, 480);
      ctx.fillText('STATUS: UNLOCKED', canvas.width / 2, 505);

      // Barcode
      ctx.fillStyle = '#ffffff';
      for (let i = 80; i < canvas.width - 80; i += Math.random() * 6 + 2) {
        ctx.fillRect(i, 535, Math.random() * 3 + 1, 35);
      }

      // Download trigger
      const link = document.createElement('a');
      link.download = `${name.toLowerCase().replace(/\s+/g, '-')}-id-card.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    if (avatar) {
      const img = new Image();
      img.src = avatar;
      img.onload = () => {
        // Draw photo
        ctx.save();
        const photoX = canvas.width / 2 - 70;
        const photoY = 120;
        const photoW = 140;
        const photoH = 140;
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoW, photoH, 16);
        ctx.clip();
        ctx.drawImage(img, photoX, photoY, photoW, photoH);
        ctx.restore();

        // Photo Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoW, photoH, 16);
        ctx.stroke();

        drawText();
      };
    } else {
      // Default placeholder photo box
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(canvas.width / 2 - 70, 120, 140, 140, 16);
      ctx.fill();
      drawText();
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#121214] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1c1c1e] px-6 py-4 flex items-center justify-between border-b border-white/5 shrink-0">
          <h3 className="text-white text-base font-black tracking-wide">
            {lang === 'id' ? '🪪 Pembuat Kartu ID Kustom' : '🪪 Custom ID Card Generator'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
          {/* Card customizer panel */}
          {!isGenerated ? (
          <form onSubmit={handleApply} className="p-6 space-y-6">
            <p className="text-gray-400 text-xs leading-normal">
              {lang === 'id' 
                ? 'Tulis nama, jabatan, dan unggah foto Anda di bawah ini untuk merancang Kartu ID Digital kustom Anda sendiri!'
                : 'Write your name, role, and upload a photo below to design your own custom Digital ID Card!'}
            </p>

            <div className="space-y-4">
              {/* Input Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {lang === 'id' ? 'Nama Lengkap' : 'Full Name'}
                </label>
                <input 
                  type="text" 
                  maxLength={24}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="JOHN DOE"
                  required
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-gray-600 font-sans" 
                />
              </div>

              {/* Input Role */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {lang === 'id' ? 'Jabatan / Peran' : 'Role / Title'}
                </label>
                <input 
                  type="text" 
                  maxLength={20}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="DEVELOPER GUEST"
                  required
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-gray-600 font-sans" 
                />
              </div>

              {/* Upload Avatar */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {lang === 'id' ? 'Unggah Foto Profil' : 'Upload Profile Photo'}
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center shrink-0">
                    {avatar ? (
                      <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload size={22} className="text-gray-500" />
                    )}
                  </div>
                  <label className="flex-1 px-4 py-3 border border-dashed border-white/20 hover:border-blue-500/50 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs text-gray-400 hover:text-white font-mono uppercase">
                    <span>{lang === 'id' ? 'Pilih Gambar' : 'Choose Image'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarChange}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-white/5"
              >
                {lang === 'id' ? 'Batal' : 'Cancel'}
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30"
              >
                <span>{lang === 'id' ? 'Buat Kartu' : 'Generate Card'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Card Preview Screen */
          <div className="p-6 flex flex-col items-center gap-6 bg-[#0f0f11]">
            
            {/* 3D Holographic Card Container */}
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-[280px] h-[420px] bg-[#0b0b0e] border border-blue-500/30 rounded-2xl p-5 shadow-2xl relative flex flex-col items-center justify-between overflow-hidden cursor-pointer"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
              }}
            >
              {/* Glass sheen overlay */}
              <div className="sheen absolute inset-0 pointer-events-none z-10" />

              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

              {/* Header */}
              <div className="text-blue-500 font-mono font-bold text-[10px] tracking-[0.2em] z-20">
                ARRYA DEV ID
              </div>

              {/* Profile Photo */}
              <div className="w-[120px] h-[120px] bg-white/5 border-2 border-white/15 rounded-2xl overflow-hidden relative shadow-lg z-20">
                {avatar ? (
                  <img src={avatar} alt="ID Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold font-mono">
                    DEV
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="text-center space-y-1.5 z-20 w-full">
                <h4 className="text-white font-black text-lg truncate tracking-wide font-sans">{name.toUpperCase()}</h4>
                <p className="text-blue-400 font-mono font-bold text-xs truncate tracking-wider">{role.toUpperCase()}</p>
              </div>

              {/* Footer details */}
              <div className="w-full space-y-4 z-20">
                <div className="flex justify-between font-mono text-[8px] text-gray-500 px-2">
                  <span>EXPIRES: 12/2030</span>
                  <span>STATUS: UNLOCKED</span>
                </div>
                
                {/* Barcode lines */}
                <div className="w-full h-8 flex justify-center gap-[1.5px] overflow-hidden opacity-90 px-4">
                  {Array.from({ length: 32 }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className="h-full bg-white" 
                      style={{ 
                        width: idx % 3 === 0 ? '3px' : idx % 5 === 0 ? '1px' : '2px',
                        opacity: idx % 4 === 0 ? 0.3 : 1
                      }} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex gap-3 pt-2">
              <button 
                onClick={handleReset}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-white/5 flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={14} />
                <span>{lang === 'id' ? 'Buat Baru' : 'Reset'}</span>
              </button>
              <button 
                onClick={handleDownload}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30"
              >
                <Download size={14} />
                <span>{lang === 'id' ? 'Unduh PNG' : 'Download PNG'}</span>
              </button>
            </div>

          </div>
        )}
        </div>

      </div>
    </div>
  );
}

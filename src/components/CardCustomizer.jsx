import React, { useState } from 'react';
import { X, Upload, Check } from 'lucide-react';

export default function CardCustomizer({ onClose, lang = 'en' }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('');

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
    
    // Set global custom card data and trigger update event
    window._customCardData = {
      name: name || 'EXPLORER',
      role: role || 'DEV GUEST',
      avatar: avatar || ''
    };
    window.dispatchEvent(new Event('custom-card-update'));
    onClose();
  };

  const handleReset = () => {
    window._customCardData = null;
    window.dispatchEvent(new Event('custom-card-update'));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#121214] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1c1c1e] px-6 py-4 flex items-center justify-between border-b border-white/5">
          <h3 className="text-white text-base font-black tracking-wide">
            {lang === 'id' ? '🪪 Pembuat Kartu ID Kustom' : '🪪 Custom ID Card Generator'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApply} className="p-6 space-y-6">
          <p className="text-gray-400 text-xs leading-normal">
            {lang === 'id' 
              ? 'Tulis nama, jabatan, dan unggah foto Anda di bawah ini untuk melihatnya terpasang secara ajaib pada Kartu Tali 3D Lanyard Anda!'
              : 'Write your name, role, and upload a photo below to see them magically applied to your 3D Lanyard Card!'}
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
                placeholder="RECRUITER"
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
              onClick={handleReset}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-white/5"
            >
              {lang === 'id' ? 'Reset Default' : 'Reset Default'}
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30"
            >
              <Check size={14} />
              <span>{lang === 'id' ? 'Terapkan' : 'Apply'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { X, Trash2, Download } from 'lucide-react';

export default function PaintCanvas({ onClose, lang = 'en' }) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#00ff66');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = ['#00ff66', '#3b82f6', '#ec4899', '#eab308', '#a855f7', '#ff0000', '#ffffff'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.drawImage(tempCanvas, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'arrya-portfolio-doodle.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[150] select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="absolute inset-0 cursor-crosshair bg-black/40 backdrop-blur-[1px]"
      />

      {/* Toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/95 border border-white/10 p-3 pr-4 rounded-2xl shadow-2xl flex items-center gap-4 backdrop-blur-md z-[160]">
        <div className="flex items-center gap-1.5 border-r border-white/10 pr-4">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-125 ${
                color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : ''
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 border-r border-white/10 pr-4">
          <span className="text-white text-xs font-bold font-mono">SIZE</span>
          <input
            type="range"
            min="2"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-20 accent-blue-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            title={lang === 'id' ? 'Hapus Semua' : 'Clear All'}
            className="p-2 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={downloadDrawing}
            title={lang === 'id' ? 'Unduh Gambar' : 'Download Doodle'}
            className="p-2 bg-white/5 hover:bg-blue-500/10 text-gray-400 hover:text-blue-500 rounded-xl transition-colors cursor-pointer"
          >
            <Download size={18} />
          </button>
          <button
            onClick={onClose}
            title={lang === 'id' ? 'Keluar' : 'Exit Paint'}
            className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer ml-2"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

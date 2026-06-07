import React, { useEffect, useRef } from 'react';

export default function Confetti({ duration = 6000, onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let isActive = true;

    // Handle resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color palette
    const colors = [
      '#FF3366', '#FF9933', '#FFFF33', '#33FF66', 
      '#33FFFF', '#3366FF', '#9933FF', '#FF33FF',
      '#FFD700', '#FF4500', '#ADFF2F', '#00FFFF'
    ];

    // Particle class
    class Particle {
      constructor() {
        // Explode from bottom corners or randomly from the bottom half to make it feel like a real party pop
        const fromLeft = Math.random() > 0.5;
        this.x = fromLeft ? 0 : canvas.width;
        this.y = canvas.height * 0.8;
        
        // Shoot upwards and towards the center
        const angle = fromLeft 
          ? (Math.random() * 45 - 60) * Math.PI / 180 // -15 to -60 degrees
          : (Math.random() * 45 - 120) * Math.PI / 180; // -120 to -165 degrees
          
        const speed = Math.random() * 20 + 15;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.r = Math.random() * 6 + 4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Physics details
        this.gravity = 0.4;
        this.drag = 0.97;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() * 6 - 3);
        
        // Visual aspects (3D flip illusion)
        this.width = this.r * 2;
        this.height = this.r * 2;
        this.scaleY = 1.0;
        this.scaleSpeed = Math.random() * 0.1 + 0.05;
        this.opacity = 1.0;
      }

      update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.vy += this.gravity;
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.rotation += this.rotationSpeed;
        this.scaleY = Math.sin(this.rotation * 0.05);
        
        // Start fading after halfway through the duration
        if (this.vy > 2) {
          this.opacity -= 0.008;
        }
      }

      draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(1, this.scaleY);
        
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        // Render rects & circles
        if (Math.random() > 0.5) {
          ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.r, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    // Initialize particles (2 bursts from left and right)
    const particles = [];
    const maxParticles = 180;
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let aliveCount = 0;
      particles.forEach((p) => {
        if (p.opacity > 0 && p.y < canvas.height + 20) {
          p.update();
          p.draw();
          aliveCount++;
        }
      });

      if (isActive && aliveCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    render();

    // Auto cleanup after duration
    const timer = setTimeout(() => {
      isActive = false;
      if (onComplete) onComplete();
    }, duration);

    return () => {
      isActive = false;
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[9999] w-screen h-screen"
    />
  );
}

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const DEFAULT_ITEMS = [
  {
    label: 'home',
    href: '#home',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'about',
    href: '#about',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'projects',
    href: '#certificates',
    ariaLabel: 'Projects',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'certificates',
    href: '#certificates',
    ariaLabel: 'Certificates',
    rotation: 8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#fff',
  menuContentColor = '#111',
  useFixedPosition = true,
  items,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef(null);
  const bubblesRef = useRef([]);
  const labelRefs = useRef([]);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;

  const containerClassName = [
    'bubble-menu',
    useFixedPosition ? 'fixed' : 'absolute',
    'left-0 right-0 top-8',
    'flex items-center justify-between',
    'gap-4 px-8',
    'pointer-events-none',
    'z-[1001]',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: 'power3.out'
            },
            '-=' + animationDuration * 0.9
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in'
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        }
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean);
        const isDesktop = window.innerWidth >= 900;
        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? (item.rotation ?? 0) : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      <style>{`
        .bubble-menu .menu-line {
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: center;
        }
        .bubble-menu-items {
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
        }
        .pill-link:hover {
            background: var(--hover-bg) !important;
            color: var(--hover-color) !important;
            transform: scale(1.05) rotate(var(--item-rot));
        }
        @media (min-width: 900px) {
          .bubble-menu-items .pill-link {
            transform: rotate(var(--item-rot));
          }
        }
        @media (max-width: 899px) {
          .bubble-menu-items {
            padding-top: 120px;
            align-items: flex-start;
          }
          .bubble-menu-items .pill-list {
            row-gap: 16px;
          }
          .bubble-menu-items .pill-list .pill-col {
            flex: 0 0 100% !important;
            margin-left: 0 !important;
          }
          .bubble-menu-items .pill-link {
            font-size: 1.5rem;
            min-height: 80px !important;
          }
        }
      `}</style>

      <nav className={containerClassName} style={style} aria-label="Main navigation">
        <div
          className="bubble logo-bubble inline-flex items-center justify-center rounded-full bg-white shadow-xl pointer-events-auto h-12 md:h-14 px-6 gap-2 border border-white/20"
          aria-label="Logo"
          style={{ background: menuBg }}
        >
          <span className="logo-content inline-flex items-center justify-center font-black text-xl tracking-tighter">
            {logo || "ARRYA"}
          </span>
        </div>

        <button
          type="button"
          className={`bubble toggle-bubble menu-btn ${isMenuOpen ? 'open' : ''} inline-flex flex-col items-center justify-center rounded-full bg-white shadow-xl pointer-events-auto w-12 h-12 md:w-14 md:h-14 border border-white/20 cursor-pointer p-0`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span
            className="menu-line block mx-auto rounded-[2px]"
            style={{
              width: 24,
              height: 2,
              background: menuContentColor,
              transform: isMenuOpen ? 'translateY(4px) rotate(45deg)' : 'none'
            }}
          />
          <span
            className="menu-line block mx-auto rounded-[2px]"
            style={{
              marginTop: '6px',
              width: 24,
              height: 2,
              background: menuContentColor,
              transform: isMenuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none'
            }}
          />
        </button>
      </nav>

      {showOverlay && (
        <div
          ref={overlayRef}
          className={`bubble-menu-items ${useFixedPosition ? 'fixed' : 'absolute'} inset-0 flex items-center justify-center pointer-events-none z-[1000]`}
          aria-hidden={!isMenuOpen}
        >
          <ul className="pill-list list-none m-0 px-6 w-full max-w-[1200px] mx-auto flex flex-wrap gap-4 justify-center pointer-events-auto" role="menu">
            {menuItems.map((item, idx) => (
              <li key={idx} role="none" className="pill-col flex justify-center items-stretch [flex:0_0_calc(100%/3)] md:[flex:0_0_calc(100%/4)] box-border">
                <a
                  role="menuitem"
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="pill-link w-full rounded-full no-underline bg-white text-inherit shadow-lg flex items-center justify-center relative transition-all duration-300 box-border border border-white/10"
                  style={{
                    ['--item-rot']: `${item.rotation ?? 0}deg`,
                    ['--hover-bg']: item.hoverStyles?.bgColor || '#3b82f6',
                    ['--hover-color']: item.hoverStyles?.textColor || '#fff',
                    background: menuBg,
                    color: menuContentColor,
                    minHeight: '140px',
                    padding: '2rem 0',
                    fontSize: '2rem',
                    fontWeight: 700
                  }}
                  ref={el => { if (el) bubblesRef.current[idx] = el; }}
                >
                  <span className="pill-label inline-block uppercase tracking-widest" ref={el => { if (el) labelRefs.current[idx] = el; }}>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

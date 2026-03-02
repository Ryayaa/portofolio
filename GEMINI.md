# GEMINI.md - Project Context

## Project Overview
**Project Name:** `portofolio-saya`  
**Developer:** Arrya Fitriansyah  
**Description:** A modern, high-performance personal portfolio website. The project stands out with its interactive 3D elements (like a physics-based lanyard), smooth animations, and a polished dark-themed aesthetic.

### Core Tech Stack
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4, PostCSS
- **3D Graphics:** 
  - Three.js
  - `@react-three/fiber` (React reconciler for Three.js)
  - `@react-three/drei` (Helper library for R3F)
  - `@react-three/rapier` (Physics engine)
  - `meshline` (Advanced line drawing)
- **Animations:** GSAP, Framer Motion (custom components)
- **Icons:** Lucide React

---

## Architecture & Structure
The project follows a standard Vite-React structure with a heavy emphasis on modular UI components.

- `src/App.jsx`: The central hub managing theme state, layout sections (Hero, About, Portfolio), and data for projects and certificates.
- `src/components/`: Houses all interactive and visual components.
  - `Lanyard/`: A complex 3D interactive ID card component using physics (`rapier`).
  - `GooeyNav.jsx`: Navigation with a "gooey" liquid effect.
  - `SpotlightCard.jsx`: Hover-sensitive cards with dynamic lighting.
  - `DarkVeil.jsx` / `Galaxy.jsx`: Specialized background effect components.
  - `TextType.jsx`: Typewriter effect for the hero section.
- `src/assets/`: Contains images (`foto-profil.jpg`) and 3D assets (`card.glb`, `lanyard.png`).

---

## Building and Running
Common tasks for this project:

- **Start Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Lint Code:** `npm run lint`
- **Preview Production Build:** `npm run preview`

---

## Development Conventions
- **3D Implementation:** Interactive 3D components should be wrapped in `Suspense` and ideally `lazy` loaded to maintain performance.
- **Styling:** Use Tailwind CSS 4 utility classes. Custom CSS is used sparingly for complex effects (e.g., `.css` files in component folders).
- **Theme:** The project defaults to a Dark Mode (`#0a0a0a`). Theme switching is handled by adding/removing the `dark` class on the root element.
- **Physics:** When working with `@react-three/rapier`, ensure `RigidBody` components are correctly configured to avoid "explosions" on spawn (e.g., using `segmentProps`).

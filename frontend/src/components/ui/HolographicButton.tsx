import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HolographicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const HolographicButton: React.FC<HolographicButtonProps> = ({
  children,
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setParticles(prev => {
          const newParticles = [...prev];
          // Add new particle
          if (newParticles.length < 20) {
            newParticles.push({
              id: Date.now(),
              x: Math.random() * 100,
              y: Math.random() * 100,
            });
          }
          // Remove old particles
          return newParticles.filter(particle => {
            const age = Date.now() - particle.id;
            return age < 1000;
          });
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      setParticles([]);
    }
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      style={{
        background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(60, 130, 255, 0.3))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: isHovered
          ? '0 0 20px rgba(60, 130, 255, 0.6), inset 0 0 20px rgba(60, 130, 255, 0.4)'
          : '0 0 10px rgba(60, 130, 255, 0.4)',
      }}
    >
      {/* Particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-400 rounded-full pointer-events-none"
          initial={{
            x: mousePosition.x + '%',
            y: mousePosition.y + '%',
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}

      {/* Holographic effect */}
      <div className="relative z-10 px-6 py-3">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        {children}
      </div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(60, 130, 255, 0.3) 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
    </motion.button>
  );
};

export default HolographicButton; 
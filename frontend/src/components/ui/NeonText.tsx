import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import gsap from 'gsap';

interface NeonTextProps {
  text: string;
  className?: string;
  typingDelay?: number;
}

const NeonText: React.FC<NeonTextProps> = ({ text, className = '', typingDelay = 0 }) => {
  const controls = useAnimation();
  const textRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = React.useState('');

  useEffect(() => {
    const typeText = async () => {
      await new Promise(resolve => setTimeout(resolve, typingDelay));
      let currentText = '';
      for (let i = 0; i < text.length; i++) {
        currentText += text[i];
        setDisplayText(currentText);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    };
    typeText();
  }, [text, typingDelay]);

  useEffect(() => {
    if (textRef.current) {
      const timeline = gsap.timeline({ repeat: -1 });
      timeline.to(textRef.current, {
        filter: 'brightness(1.2) drop-shadow(0 0 15px currentColor)',
        duration: 0.5,
        yoyo: true,
        repeat: 1,
      });
    }
  }, [displayText]);

  return (
    <motion.div
      ref={textRef}
      className={`relative ${className}`}
      whileHover={{
        filter: [
          'brightness(1) drop-shadow(0 0 10px currentColor)',
          'brightness(1.4) drop-shadow(0 0 20px currentColor)',
          'brightness(1) drop-shadow(0 0 10px currentColor)',
        ],
        transition: {
          duration: 0.3,
          times: [0, 0.5, 1],
        },
      }}
      style={{
        textShadow: '0 0 10px currentColor',
      }}
    >
      {displayText}
      <div
        className="absolute inset-0"
        style={{
          filter: 'blur(4px)',
          opacity: 0.7,
          color: 'inherit',
        }}
      >
        {displayText}
      </div>
    </motion.div>
  );
};

export default NeonText; 
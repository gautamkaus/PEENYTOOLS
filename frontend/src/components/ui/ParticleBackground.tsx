import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, Canvas } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';

const ParticleField = ({ count = 5000, mouse }) => {
  const mesh = useRef();
  const { viewport } = useThree();

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      temp[i3] = (Math.random() - 0.5) * 8;
      temp[i3 + 1] = (Math.random() - 0.5) * 8;
      temp[i3 + 2] = (Math.random() - 0.5) * 8;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      mesh.current.geometry.attributes.position.array[i3] += Math.sin(time + i * 0.1) * 0.01;
      mesh.current.geometry.attributes.position.array[i3 + 1] += Math.cos(time + i * 0.1) * 0.01;
    }

    if (mouse.current) {
      const { x, y } = mouse.current;
      mesh.current.rotation.x = y * 0.5;
      mesh.current.rotation.y = x * 0.5;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4F46E5"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

const ParticleBackground = () => {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ParticleField mouse={mouse} />
      </Canvas>
    </div>
  );
};

export default ParticleBackground; 
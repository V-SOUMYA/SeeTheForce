
import React, { useEffect, useRef, useState } from 'react';
import { PhysicsData } from '../types';

interface MotionCanvasProps {
  data: NonNullable<PhysicsData['space_motion']>;
  isPlaying: boolean;
  onComplete?: () => void;
}

const MotionCanvas: React.FC<MotionCanvasProps> = ({ data, isPlaying, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  const { motion, object } = data;
  const duration = motion[motion.length - 1].time;

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = (time - startTimeRef.current) / 1000;

      if (elapsed >= duration) {
        setCurrentStep(motion.length - 1);
        if (onComplete) onComplete();
        return;
      }

      const stepIndex = motion.findIndex(m => m.time > elapsed);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex - 1);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      startTimeRef.current = undefined;
    };
  }, [isPlaying, duration, motion, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = 60;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const xCoords = motion.map(m => m.x);
    const yCoords = motion.map(m => m.y);
    const minX = Math.min(...xCoords, 0);
    const maxX = Math.max(...xCoords, 10);
    const minY = Math.min(...yCoords, 0);
    const maxY = Math.max(...yCoords, 10);

    const rangeX = (maxX - minX) || 1;
    const rangeY = (maxY - minY) || 1;
    const scale = Math.min((w - padding * 2) / rangeX, (h - padding * 2) / rangeY);

    const toX = (val: number) => padding + (val - minX) * scale;
    const toY = (val: number) => h - padding - (val - minY) * scale;

    // Draw Grid
    ctx.strokeStyle = '#54779244';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i = 0; i <= 10; i++) {
        const x = padding + (i * (w - padding * 2) / 10);
        ctx.moveTo(x, padding); ctx.lineTo(x, h - padding);
        const y = padding + (i * (h - padding * 2) / 10);
        ctx.moveTo(padding, y); ctx.lineTo(w - padding, y);
    }
    ctx.stroke();

    // Draw Path (Trail)
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#94B4C1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toX(motion[0].x), toY(motion[0].y));
    for (let i = 1; i <= currentStep; i++) {
      ctx.lineTo(toX(motion[i].x), toY(motion[i].y));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Object
    const p = motion[currentStep];
    ctx.fillStyle = '#EAE0CF';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#94B4C1';
    ctx.beginPath();
    ctx.arc(toX(p.x), toY(p.y), 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label Object
    ctx.fillStyle = '#EAE0CF';
    ctx.font = '500 13px Inter, sans-serif';
    ctx.fillText(`This dot represents: ${object}`, toX(p.x) + 20, toY(p.y) - 25);
    
    ctx.font = '12px JetBrains Mono';
    ctx.fillStyle = '#94B4C1';
    ctx.fillText(`t = ${p.time.toFixed(1)}s`, toX(p.x) + 20, toY(p.y) - 5);
    ctx.fillText(`pos = (${p.x.toFixed(1)}, ${p.y.toFixed(1)})m`, toX(p.x) + 20, toY(p.y) + 12);

  }, [currentStep, motion, object]);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-[#213448] rounded-xl border border-[#547792] overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 bg-[#547792] rounded-full text-xs font-bold text-[#EAE0CF] uppercase tracking-wider">Space View</span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default MotionCanvas;

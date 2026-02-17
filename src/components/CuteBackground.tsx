"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// 🌸 可愛いパーティクルネットワーク背景
function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    // パーティクルの形状タイプ
    type ShapeType = "star" | "heart" | "circle" | "flower";

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      shape: ShapeType;
      rotation: number;
      rotationSpeed: number;
      pulse: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 4 + 3;
        
        // 可愛いパステルカラー
        const colors = [
          "#F472B6", // pink-400
          "#EC4899", // pink-500
          "#F9A8D4", // pink-300
          "#A78BFA", // purple-400
          "#C084FC", // purple-400
          "#FBBF24", // amber-400
          "#F87171", // red-400
          "#FB7185", // rose-400
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // 形状をランダムに選択
        const shapes: ShapeType[] = ["star", "heart", "circle", "flower"];
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.pulse = 0;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.pulse += 0.05;

        // 画面端でバウンス
        if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // パルス効果
        const pulseScale = 1 + Math.sin(this.pulse) * 0.1;
        ctx.scale(pulseScale, pulseScale);
        
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        
        switch (this.shape) {
          case "star":
            this.drawStar(ctx, 0, 0, 5, this.size, this.size / 2);
            break;
          case "heart":
            this.drawHeart(ctx, 0, 0, this.size);
            break;
          case "flower":
            this.drawFlower(ctx, 0, 0, this.size);
            break;
          case "circle":
          default:
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        
        ctx.restore();
      }

      drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerRadius;
          y = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;

          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
      }

      drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
        ctx.beginPath();
        ctx.moveTo(x, y + size / 4);
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
        ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size);
        ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
        ctx.fill();
      }

      drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
        const petals = 6;
        for (let i = 0; i < petals; i++) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((Math.PI * 2 / petals) * i);
          ctx.beginPath();
          ctx.ellipse(0, size / 2, size / 3, size / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // 中心
        ctx.beginPath();
        ctx.arc(x, y, size / 3, 0, Math.PI * 2);
        ctx.fillStyle = "#FEF3C7"; // 黄色の中心
        ctx.fill();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const drawConnections = () => {
      const maxDistance = 180;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.4;
            
            // グラデーション線
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, particles[i].color + Math.floor(opacity * 255).toString(16).padStart(2, "0"));
            gradient.addColorStop(1, particles[j].color + Math.floor(opacity * 255).toString(16).padStart(2, "0"));
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 接続線を先に描画
      drawConnections();

      // パーティクル更新と描画
      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
}

// 💫 きらきら星（装飾用）
function TwinklingStars() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 6 + Math.random() * 6,
            height: 6 + Math.random() * 6,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.9, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" fill="#FCD34D">
            <path d="M12 2L14.09 8.26L20.18 9.27L15.54 13.14L16.82 19.14L12 16.18L7.18 19.14L8.46 13.14L3.82 9.27L9.91 8.26L12 2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// 🎨 ふんわり背景の色塊
function SoftBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-pink-200/30 to-rose-200/20 rounded-full animate-blob"
        style={{ filter: "blur(80px)" }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/30 to-pink-200/20 rounded-full"
        style={{
          filter: "blur(80px)",
          animation: "blob 12s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full"
        style={{
          filter: "blur(80px)",
          animation: "blob 15s ease-in-out infinite 2s",
        }}
      />
    </div>
  );
}

export function CuteBackground() {
  return (
    <>
      <SoftBlobs />
      <ParticleNetwork />
      <TwinklingStars />
    </>
  );
}

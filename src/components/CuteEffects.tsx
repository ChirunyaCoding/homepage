"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// 🌸 ふわふわ浮かぶ絵文字
export function FloatingEmojis() {
  const emojis = [
    { emoji: "🌸", left: "5%", delay: 0, duration: 15 },
    { emoji: "✨", left: "15%", delay: 2, duration: 18 },
    { emoji: "💖", left: "25%", delay: 4, duration: 20 },
    { emoji: "🌺", left: "35%", delay: 1, duration: 16 },
    { emoji: "💕", left: "45%", delay: 3, duration: 19 },
    { emoji: "🎀", left: "55%", delay: 5, duration: 17 },
    { emoji: "⭐", left: "65%", delay: 0.5, duration: 14 },
    { emoji: "🌷", left: "75%", delay: 2.5, duration: 21 },
    { emoji: "💝", left: "85%", delay: 4.5, duration: 16 },
    { emoji: "🦋", left: "95%", delay: 1.5, duration: 22 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {emojis.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl"
          style={{ left: item.left, top: "-50px" }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(index) * 40, 0],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// 💫 キラキラエフェクト
export function SparkleEffect({ children }: { children: ReactNode }) {
  return (
    <div className="relative inline-block">
      {children}
      <motion.div
        className="absolute -top-2 -right-2 text-yellow-400"
        animate={{
          scale: [0, 1, 0],
          rotate: [0, 180, 360],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        ✨
      </motion.div>
    </div>
  );
}

// 🎀 リボン装飾
export function RibbonDecoration({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 5C20 5 25 15 35 15C35 15 25 20 25 30C25 30 20 25 15 30C15 30 15 20 5 15C5 15 15 15 20 5Z"
          fill="url(#ribbon-gradient)"
        />
        <defs>
          <linearGradient id="ribbon-gradient" x1="5" y1="5" x2="35" y2="35">
            <stop stopColor="#F472B6" />
            <stop offset="1" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// 🌈 虹色グラデーションライン
export function RainbowLine() {
  return (
    <motion.div
      className="h-1 w-full rounded-full"
      style={{
        background:
          "linear-gradient(90deg, #F472B6, #A78BFA, #60A5FA, #34D399, #FBBF24, #F472B6)",
        backgroundSize: "200% 100%",
      }}
      animate={{
        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// 💕 ハートビートする要素
export function HeartBeatWrapper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// 🎈 ぷかぷか浮かぶバルーン
export function FloatingBalloons() {
  const balloons = [
    { color: "#F472B6", left: "8%", delay: 0, size: 30 },
    { color: "#A78BFA", left: "22%", delay: 1.5, size: 25 },
    { color: "#60A5FA", left: "38%", delay: 3, size: 35 },
    { color: "#34D399", left: "52%", delay: 0.8, size: 28 },
    { color: "#FBBF24", left: "68%", delay: 2.2, size: 32 },
    { color: "#F472B6", left: "82%", delay: 4, size: 26 },
    { color: "#A78BFA", left: "95%", delay: 1.2, size: 30 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {balloons.map((balloon, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            left: balloon.left,
            bottom: "-50px",
            width: balloon.size,
            height: balloon.size,
            background: `radial-gradient(circle at 30% 30%, white 0%, ${balloon.color} 50%, ${balloon.color}dd 100%)`,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(index) * 50, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            delay: balloon.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* 紐 */}
          <motion.div
            className="absolute top-full left-1/2 w-0.5 h-16 origin-top"
            style={{ background: balloon.color }}
            animate={{
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// 🌟 きらきら星
export function TwinklingStars() {
  const stars = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
    duration: 1 + Math.random() * 2,
    size: 4 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" fill="url(#star-gradient)">
            <path d="M12 2L14.09 8.26L20.18 9.27L15.54 13.14L16.82 19.14L12 16.18L7.18 19.14L8.46 13.14L3.82 9.27L9.91 8.26L12 2Z" />
            <defs>
              <linearGradient id="star-gradient" x1="0" y1="0" x2="24" y2="24">
                <stop stopColor="#FCD34D" />
                <stop offset="1" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// 🎊 紙吹雪エフェクト
export function Confetti() {
  const colors = ["#F472B6", "#A78BFA", "#60A5FA", "#34D399", "#FBBF24"];
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          className="absolute w-2 h-3 rounded-sm"
          style={{
            left: item.left,
            top: "-20px",
            backgroundColor: item.color,
          }}
          animate={{
            y: [0, window.innerHeight + 50],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, 720],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// 🍥 くるくる回るローダー
export function CuteLoader({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center justify-center gap-2 ${className}`}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-purple-400"
          animate={{
            scale: [1, 1.5, 1],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  );
}

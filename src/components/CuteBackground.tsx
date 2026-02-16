"use client";

import { motion } from "framer-motion";

// 💫 きらきら星
function TwinklingStars() {
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

// 🎨 ふんわり背景の色塊
function SoftBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* ピンクの塊 */}
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-pink-200/40 to-rose-200/30 animate-blob"
        style={{ filter: "blur(60px)" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/40 to-pink-200/30"
        style={{
          filter: "blur(60px)",
          borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
          animation: "blob 12s ease-in-out infinite reverse",
        }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-gradient-to-br from-indigo-200/30 to-purple-200/30"
        style={{
          filter: "blur(60px)",
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          animation: "blob 15s ease-in-out infinite 2s",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-rose-200/30 to-pink-200/30"
        style={{
          filter: "blur(50px)",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          animation: "blob 11s ease-in-out infinite 1s",
        }}
      />
      <motion.div
        className="absolute top-20 right-1/3 w-[350px] h-[350px] bg-gradient-to-br from-fuchsia-200/25 to-pink-200/25"
        style={{
          filter: "blur(45px)",
          borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%",
          animation: "blob 13s ease-in-out infinite 3s",
        }}
      />
    </div>
  );
}

// 💫 キラキラ粒子
function Sparkles() {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2,
    size: 4 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full bg-gradient-to-r from-pink-300 to-purple-300"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// 🌸 ふわふわ浮かぶ花びら
function FloatingPetals() {
  const petals = [
    { emoji: "🌸", delay: 0, duration: 15, left: "10%", size: 24 },
    { emoji: "🌺", delay: 2, duration: 18, left: "25%", size: 20 },
    { emoji: "🌷", delay: 4, duration: 20, left: "40%", size: 22 },
    { emoji: "🌸", delay: 1, duration: 16, left: "55%", size: 18 },
    { emoji: "💮", delay: 3, duration: 19, left: "70%", size: 24 },
    { emoji: "🌺", delay: 5, duration: 17, left: "85%", size: 20 },
    { emoji: "✨", delay: 0.5, duration: 12, left: "15%", size: 16 },
    { emoji: "⭐", delay: 2.5, duration: 14, left: "45%", size: 18 },
    { emoji: "✨", delay: 4.5, duration: 13, left: "75%", size: 16 },
    { emoji: "💖", delay: 1.5, duration: 20, left: "30%", size: 20 },
    { emoji: "💝", delay: 3.5, duration: 22, left: "60%", size: 18 },
    { emoji: "💕", delay: 5.5, duration: 18, left: "90%", size: 16 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: petal.left,
            fontSize: petal.size,
            top: "-50px",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(index) * 30, 0],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {petal.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export function CuteBackground() {
  return (
    <>
      <SoftBlobs />
      <Sparkles />
      <FloatingPetals />
      <TwinklingStars />
    </>
  );
}

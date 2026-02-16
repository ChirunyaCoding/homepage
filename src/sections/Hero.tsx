"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, Star, ArrowDown } from "lucide-react";
import { CuteButton } from "@/components/CuteButton";

// テキスト文字アニメーション
function AnimatedText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const letters = text.split("");

  return (
    <motion.span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 30, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: "inline-block" }}
          whileHover={{
            scale: 1.2,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.3 },
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

// 浮遊する装飾
function FloatingDecoration({
  children,
  delay = 0,
  duration = 4,
  x = 0,
  y = 20,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -y, 0],
        x: [0, x, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// ハートパーティクル
function HeartParticles() {
  const hearts = ["💖", "💕", "💗", "💓", "💝"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${10 + i * 12}%`,
            top: "50%",
          }}
          animate={{
            y: [0, -100 - Math.random() * 100],
            x: [0, (Math.random() - 0.5) * 50],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        >
          {hearts[i % hearts.length]}
        </motion.div>
      ))}
    </div>
  );
}

// ソーシャルリンク
function SocialLink({
  href,
  icon: Icon,
  color,
  delay,
}: {
  href: string;
  icon: typeof Heart;
  color: string;
  delay: number;
}) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.8 + delay * 0.1,
        type: "spring",
        stiffness: 500,
        damping: 15,
      }}
      whileHover={{
        scale: 1.2,
        y: -5,
        rotate: [0, -15, 15, 0],
      }}
      whileTap={{ scale: 0.9 }}
      className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg relative overflow-hidden group`}
    >
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: "-100%", skewX: -20 }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="relative z-10"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-6 h-6" />
      </motion.div>
    </motion.a>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeartParticles />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Character Image Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">
              {/* 光の輪 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-300/40 via-purple-300/40 to-indigo-300/40 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* 浮遊装飾 */}
              <FloatingDecoration delay={0} x={10} y={15} duration={5}>
                <div className="absolute -top-4 -right-4 text-4xl">🌸</div>
              </FloatingDecoration>
              <FloatingDecoration delay={1} x={-10} y={20} duration={6}>
                <div className="absolute top-1/4 -left-8 text-3xl">✨</div>
              </FloatingDecoration>
              <FloatingDecoration delay={2} x={15} y={10} duration={4}>
                <div className="absolute bottom-1/3 -right-6 text-3xl">💖</div>
              </FloatingDecoration>
              <FloatingDecoration delay={0.5} x={-15} y={25} duration={5}>
                <div className="absolute bottom-0 -left-4 text-3xl">⭐</div>
              </FloatingDecoration>

              {/* アバター画像 */}
              <motion.div
                className="relative w-full h-full rounded-full overflow-hidden border-4 border-pink-200 shadow-cute"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src="/avatar.png"
                  alt="ちるにゃ"
                  className="w-full h-full object-cover"
                />
                {/* オーバーレイ */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent" />
              </motion.div>

              {/* まわりの星 */}
              <motion.div
                className="absolute -top-2 left-1/2 text-2xl"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🌟
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left max-w-xl"
          >
            {/* Welcome Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-100 border-2 border-pink-200 mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-pink-500" />
              </motion.div>
              <span className="text-sm font-bold text-pink-600">
                ようこそ！
              </span>
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="text-lg"
              >
                🎀
              </motion.span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl lg:text-6xl font-bold mb-6"
            >
              <AnimatedText text="ちるにゃ" className="text-slate-700" delay={0.4} />
              <br />
              <AnimatedText
                text="すたじお"
                className="text-gradient-cute"
                delay={0.7}
              />
              <motion.span
                className="inline-block text-4xl ml-2"
                animate={{
                  rotate: [0, 20, -20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                🐱
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="text-slate-500 text-lg mb-8"
            >
              ゲーム開発・プログラミング・クリエイティブな活動をしている
              <br />
              ちるにゃの個人サイトです 💕
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <CuteButton
                variant="primary"
                size="lg"
                icon={<Heart className="w-5 h-5" />}
              >
                作品を見る
              </CuteButton>
              <CuteButton
                variant="outline"
                size="lg"
                icon={<Star className="w-5 h-5" />}
              >
                YouTube
              </CuteButton>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex gap-4 mt-8 justify-center lg:justify-start"
            >
              <SocialLink
                href="#youtube"
                icon={Sparkles}
                color="bg-gradient-to-br from-red-400 to-pink-400"
                delay={0}
              />
              <SocialLink
                href="#twitter"
                icon={Star}
                color="bg-gradient-to-br from-sky-400 to-blue-400"
                delay={1}
              />
              <SocialLink
                href="#github"
                icon={Heart}
                color="bg-gradient-to-br from-purple-400 to-indigo-400"
                delay={2}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm font-bold text-pink-400">ふむふむ</span>
          <motion.div
            className="w-8 h-12 rounded-full border-3 border-pink-300 flex justify-center pt-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-3 bg-pink-400 rounded-full"
              animate={{
                y: [0, 12, 0],
                opacity: [1, 0.3, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          <ArrowDown className="w-5 h-5 text-pink-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

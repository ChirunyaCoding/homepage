"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Youtube, Twitter, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticlesBackground } from "@/components/ParticlesBackground";

// テキスト文字アニメーション
function AnimatedText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const letters = text.split("");
  
  return (
    <motion.span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.05,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{ display: "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

// 浮遊する装飾
function FloatingDecoration({ children, delay = 0, duration = 4, x = 0, y = 20 }: { 
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

// ソーシャルリンク
function SocialLink({ social, index }: { social: typeof socials[0]; index: number }) {
  return (
    <motion.a
      href={social.href}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: 0.7 + index * 0.1,
        type: "spring",
        stiffness: 500,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.15, 
        y: -5,
        rotate: [0, -10, 10, 0]
      }}
      whileTap={{ scale: 0.9 }}
      className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-100 transition-all relative overflow-hidden group"
    >
      <motion.div
        className="absolute inset-0 bg-cyan-50"
        initial={{ y: "100%" }}
        whileHover={{ y: 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="relative z-10"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <social.icon className="w-5 h-5" />
      </motion.div>
    </motion.a>
  );
}

const socials = [
  { icon: Youtube, label: "YouTube", href: "#youtube" },
  { icon: Twitter, label: "Twitter", href: "#twitter" },
  { icon: Github, label: "GitHub", href: "#github" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-cyan-50/50 via-white to-white">
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Character Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative w-80 h-[450px] lg:w-[450px] lg:h-[600px]">
              {/* Glow Effect Behind Character */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-cyan-200/40 via-transparent to-transparent rounded-full blur-2xl scale-110"
                animate={{
                  scale: [1.1, 1.2, 1.1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* 周囲の浮遊する粒子 */}
              <FloatingDecoration delay={0} x={10} y={15} duration={5}>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-300/30 rounded-full blur-md" />
              </FloatingDecoration>
              <FloatingDecoration delay={1} x={-10} y={20} duration={6}>
                <div className="absolute top-1/4 -left-8 w-6 h-6 bg-sky-300/40 rounded-full blur-sm" />
              </FloatingDecoration>
              <FloatingDecoration delay={2} x={15} y={10} duration={4}>
                <div className="absolute bottom-1/3 -right-6 w-4 h-4 bg-cyan-400/50 rounded-full" />
              </FloatingDecoration>
              
              <motion.img
                src="/character.png"
                alt="Character"
                className="w-full h-full object-contain drop-shadow-xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left max-w-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 border border-cyan-200 mb-6 relative overflow-hidden group"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-cyan-500" />
              </motion.div>
              <span className="text-sm text-cyan-600 font-medium relative z-10">Welcome to my page!</span>
              <motion.div
                className="absolute inset-0 bg-cyan-200/50"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl lg:text-6xl font-bold mb-6"
            >
              <AnimatedText text="Chihalu" className="text-slate-700" delay={0.4} />
              <AnimatedText text="　Studio" className="text-gradient" delay={0.6} />
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyan-300 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-400 relative overflow-hidden group"
                >
                  <motion.span
                    className="absolute inset-0 bg-cyan-100"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Twitter className="w-5 h-5 mr-2" />
                    </motion.div>
                    Twitter
                  </span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 relative overflow-hidden group"
                >
                  <motion.span
                    className="absolute inset-0 bg-slate-100"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <Github className="w-5 h-5 mr-2" />
                    </motion.div>
                    GitHub
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Social Links */}
            <div className="flex gap-4 mt-8 justify-center lg:justify-start">
              {socials.map((social, index) => (
                <SocialLink key={social.label} social={social} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-cyan-300 flex justify-center pt-2 relative"
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            animate={{ 
              y: [0, 12, 0],
              opacity: [1, 0.3, 1]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* 外側のリング */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-200"
            animate={{ 
              scale: [1, 1.5, 1.5],
              opacity: [0.5, 0, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <motion.p 
          className="text-xs text-cyan-400 mt-2 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.p>
      </motion.div>
    </section>
  );
}

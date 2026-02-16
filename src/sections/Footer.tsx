"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowUp } from "lucide-react";
import siteIcon from "../../icon.png";

// アニメーションするハート
function AnimatedHeart() {
  return (
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatDelay: 0.5,
      }}
    >
      <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
    </motion.div>
  );
}

// 浮かぶ絵文字
function FloatingEmoji({
  emoji,
  delay,
  x,
}: {
  emoji: string;
  delay: number;
  x: string;
}) {
  return (
    <motion.div
      className="absolute text-2xl"
      style={{ left: x, bottom: "20%" }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay,
      }}
    >
      {emoji}
    </motion.div>
  );
}

// ソーシャルリンク
function SocialLink({
  href,
  icon,
  label,
  color,
  delay,
}: {
  href: string;
  icon: string;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: 0.3 + delay * 0.1,
        type: "spring",
        stiffness: 500,
        damping: 15,
      }}
      whileHover={{
        scale: 1.2,
        y: -5,
        rotate: [0, -10, 10, 0],
      }}
      whileTap={{ scale: 0.9 }}
      className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-2xl shadow-lg relative overflow-hidden group`}
      title={label}
    >
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: "-100%", skewX: -20 }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      />
      <span className="relative z-10">{icon}</span>
    </motion.a>
  );
}

export function Footer() {
  const baseUrl = import.meta.env.BASE_URL || "/";

  return (
    <footer className="relative pt-24 pb-8 overflow-hidden">
      {/* 装飾的な絵文字 */}
      <FloatingEmoji emoji="🌸" delay={0} x="10%" />
      <FloatingEmoji emoji="✨" delay={1} x="25%" />
      <FloatingEmoji emoji="💖" delay={2} x="40%" />
      <FloatingEmoji emoji="🌟" delay={1.5} x="60%" />
      <FloatingEmoji emoji="💕" delay={0.5} x="75%" />
      <FloatingEmoji emoji="🎀" delay={2.5} x="90%" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Content */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            {/* Logo */}
            <motion.a
              href={baseUrl}
              className="flex flex-col items-center gap-4 mb-8 group"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <img
                  src={siteIcon}
                  alt="ちるにゃすたじお"
                  className="w-20 h-20 rounded-2xl object-cover shadow-lg border-4 border-pink-200"
                />
                <motion.div
                  className="absolute -top-2 -right-2 text-2xl"
                  animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
              </motion.div>
              <div className="text-center">
                <motion.span
                  className="font-bold text-2xl block"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-slate-700">ちるにゃ</span>
                  <motion.span
                    className="text-pink-500"
                    animate={{
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    すたじお
                  </motion.span>
                </motion.span>
                <motion.p
                  className="text-slate-400 text-sm mt-1"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Game Dev & Creative Studio 🎮🎨
                </motion.p>
              </div>
            </motion.a>

            {/* Social Links */}
            <div className="flex gap-4 mb-8">
              <SocialLink
                href="https://www.youtube.com/@%E3%81%A1%E3%81%AF%E3%82%8B_Dev"
                icon="📺"
                label="YouTube"
                color="bg-gradient-to-br from-rose-300 to-pink-300"
                delay={0}
              />
              <SocialLink
                href="https://x.com/ChihaluCoding"
                icon="🐦"
                label="X"
                color="bg-gradient-to-br from-sky-300 to-blue-300"
                delay={1}
              />
              <SocialLink
                href="https://github.com/ChihaluCoding"
                icon="🐙"
                label="GitHub"
                color="bg-gradient-to-br from-purple-300 to-indigo-300"
                delay={2}
              />
            </div>

            {/* Quick Links */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {["ほーむ", "ようつべ", "しょっぷ", "きろく"].map((link, index) => (
                <motion.a
                  key={link}
                  href={`${baseUrl}${link === "ほーむ" ? "" : link + "/"}`}
                  className="text-slate-400 hover:text-pink-500 transition-colors flex items-center gap-1"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                  </motion.span>
                  {link}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent mb-8"
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <motion.p
            className="text-sm text-slate-400 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            © 2024 ちるにゃすたじお. All rights reserved.
          </motion.p>

          <motion.p
            className="text-sm text-slate-400 flex items-center gap-2 font-bold"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <span>Made with</span>
            <AnimatedHeart />
            <span>by ちるにゃ 🐱</span>
          </motion.p>

          {/* Back to top button */}
          <motion.a
            href="#"
            className="mt-4 p-3 rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition-colors"
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </footer>
  );
}

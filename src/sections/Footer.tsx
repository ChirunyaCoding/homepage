"use client";

import { motion } from "framer-motion";
import { Youtube, Twitter, Github } from "lucide-react";
import siteIcon from "../../icon.png";

// SNSリンク - 公式アイコン使用
function SocialLink({
  href,
  icon: Icon,
  label,
  color,
  delay,
}: {
  href: string;
  icon: typeof Youtube;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
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
        scale: 1.15,
        y: -5,
      }}
      whileTap={{ scale: 0.9 }}
      className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg relative overflow-hidden group`}
      title={label}
    >
      {/* ホバー時の光のエフェクト */}
      <motion.div
        className="absolute inset-0 bg-white/30"
        initial={{ x: "-100%", skewX: -20 }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      />
      {/* キラキラ */}
      <motion.div
        className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: delay * 0.5,
        }}
      />
      <Icon className="w-6 h-6 relative z-10" />
    </motion.a>
  );
}

export function Footer() {
  const baseUrl = import.meta.env.BASE_URL || "/";

  return (
    <footer className="relative pt-24 pb-8 overflow-hidden">
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
                  <span className="text-slate-700">ちるにゃ。</span>
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

            {/* SNS Links - 公式アイコン */}
            <div className="flex gap-4">
              <SocialLink
                href="https://www.youtube.com/@%E3%81%A1%E3%81%AF%E3%82%8B_Dev"
                icon={Youtube}
                label="YouTube"
                color="bg-gradient-to-br from-red-400 to-rose-500"
                delay={0}
              />
              <SocialLink
                href="https://x.com/ChirunyaCoding"
                icon={Twitter}
                label="X (Twitter)"
                color="bg-gradient-to-br from-slate-700 to-slate-800"
                delay={1}
              />
              <SocialLink
                href="https://github.com/ChirunyaCoding"
                icon={Github}
                label="GitHub"
                color="bg-gradient-to-br from-purple-500 to-indigo-500"
                delay={2}
              />
            </div>
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
        </motion.div>
      </div>
    </footer>
  );
}

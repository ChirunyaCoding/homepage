"use client";

import { motion } from "framer-motion";
import { Heart, Github, Twitter, Youtube, Sparkles } from "lucide-react";
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
        repeatDelay: 0.5
      }}
    >
      <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
    </motion.div>
  );
}

// ソーシャルリンクアニメーション
function SocialLink({ link, index }: { link: typeof socialLinks[0]; index: number }) {
  return (
    <motion.a
      key={link.name}
      href={link.href}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        delay: 0.3 + index * 0.1,
        type: "spring",
        stiffness: 500,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.2, 
        y: -5,
        rotate: [0, -10, 10, 0]
      }}
      whileTap={{ scale: 0.9 }}
      className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center text-white transition-colors shadow-md relative overflow-hidden group`}
      title={link.name}
    >
      {/* ホバー時の光のエフェクト */}
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
        <link.icon className="w-5 h-5" />
      </motion.div>
    </motion.a>
  );
}

const socialLinks = [
  { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/@%E3%81%A1%E3%81%AF%E3%82%8B_Dev", color: "bg-red-500 hover:bg-red-600" },
  { name: "X", icon: Twitter, href: "https://x.com/ChihaluCoding", color: "bg-sky-500 hover:bg-sky-600" },
  { name: "GitHub", icon: Github, href: "https://github.com/ChihaluCoding", color: "bg-slate-700 hover:bg-slate-800" },
];

export function Footer() {
  const baseUrl = import.meta.env.BASE_URL || "/";

  return (
    <footer className="relative pt-20 pb-8 overflow-hidden bg-gradient-to-t from-cyan-50/50 to-white">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.a 
              href={baseUrl} 
              className="flex items-center gap-3 mb-4 group"
              whileHover={{ x: 5 }}
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={siteIcon}
                  alt="Chihalu Studio"
                  className="w-10 h-10 rounded-xl object-cover shadow-md"
                />
              </motion.div>
              <span className="font-bold text-lg">
                <motion.span 
                  className="text-slate-700"
                  whileHover={{ color: "#0891b2" }}
                >
                  Chihalu
                </motion.span>
                <motion.span 
                  className="text-cyan-500"
                  animate={{ 
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  Studio
                </motion.span>
              </span>
            </motion.a>
            <motion.p 
              className="text-slate-500 text-sm leading-relaxed mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              ゲーム開発者 / プログラマー / YouTuber
              <br />
              自作ゲーム・ツールの配布や活動記録を残しています。
            </motion.p>
            <div className="flex gap-3">
              {socialLinks.map((link, index) => (
                <SocialLink key={link.name} link={link} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-slate-200"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <motion.p 
              className="text-sm text-slate-400 text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              © 2024 Chihalu Studio. All rights reserved.
            </motion.p>
            <motion.p 
              className="text-sm text-slate-400 flex items-center gap-1"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              Made with <AnimatedHeart /> by Chihalu
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

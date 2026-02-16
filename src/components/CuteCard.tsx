"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CuteCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export function CuteCard({
  children,
  className = "",
  hoverEffect = true,
  onClick,
}: CuteCardProps) {
  return (
    <motion.div
      className={`
        relative bg-white/80 backdrop-blur-sm
        border-2 border-pink-200/60
        rounded-3xl p-6
        overflow-hidden
        ${hoverEffect ? "cursor-pointer" : ""}
        ${className}
      `}
      whileHover={
        hoverEffect
          ? {
              scale: 1.02,
              y: -5,
              boxShadow: "0 20px 40px -10px rgba(236, 72, 153, 0.25)",
            }
          : {}
      }
      whileTap={hoverEffect ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {/* キラキラ装飾 */}
      <div className="absolute top-3 right-3 flex gap-1">
        <motion.div
          className="w-2 h-2 rounded-full bg-pink-300"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-purple-300"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
      </div>

      {/* ホバー時のグラデーション */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-pink-50/0 via-purple-50/0 to-indigo-50/0"
        whileHover={{
          background: [
            "linear-gradient(to bottom right, rgba(253, 242, 248, 0), rgba(250, 245, 255, 0), rgba(238, 242, 255, 0))",
            "linear-gradient(to bottom right, rgba(253, 242, 248, 0.8), rgba(250, 245, 255, 0.6), rgba(238, 242, 255, 0.4))",
          ],
        }}
        transition={{ duration: 0.3 }}
      />

      {/* 内容 */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// かわいいバッジコンポーネント
interface CuteBadgeProps {
  children: ReactNode;
  color?: "pink" | "purple" | "indigo" | "rose" | "amber";
  className?: string;
}

const badgeColors = {
  pink: "bg-pink-100 text-pink-600 border-pink-200",
  purple: "bg-purple-100 text-purple-600 border-purple-200",
  indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
  rose: "bg-rose-100 text-rose-600 border-rose-200",
  amber: "bg-amber-100 text-amber-600 border-amber-200",
};

export function CuteBadge({
  children,
  color = "pink",
  className = "",
}: CuteBadgeProps) {
  return (
    <motion.span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5 rounded-full
        text-xs font-bold
        border-2
        ${badgeColors[color]}
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
      >
        ✨
      </motion.span>
      {children}
    </motion.span>
  );
}

// かわいいセクションタイトル
interface CuteSectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: string;
  className?: string;
}

export function CuteSectionTitle({
  title,
  subtitle,
  icon = "🌸",
  className = "",
}: CuteSectionTitleProps) {
  return (
    <motion.div
      className={`text-center mb-12 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* ラベル */}
      <motion.div
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-100 border-2 border-pink-200 mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
      >
        <motion.span
          animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="text-xl"
        >
          {icon}
        </motion.span>
        <span className="text-sm font-bold text-pink-600">{subtitle}</span>
      </motion.div>

      {/* タイトル */}
      <h2 className="text-3xl lg:text-5xl font-bold mb-4">
        <span className="text-slate-700">{title.split(" ")[0]}</span>
        {title.split(" ")[1] && (
          <span className="text-gradient-cute">{title.split(" ")[1]}</span>
        )}
      </h2>

      {/* 装飾ライン */}
      <motion.div
        className="flex items-center justify-center gap-2 mt-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="h-1 w-12 rounded-full bg-gradient-to-r from-pink-300 to-purple-300"
          animate={{ scaleX: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-pink-400">💕</span>
        <motion.div
          className="h-1 w-12 rounded-full bg-gradient-to-r from-purple-300 to-indigo-300"
          animate={{ scaleX: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
}

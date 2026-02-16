"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CuteButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  icon?: ReactNode;
  href?: string;
}

const variantStyles = {
  primary: "bg-gradient-to-r from-pink-400 to-purple-400 text-white border-transparent shadow-cute",
  secondary: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 border-purple-200",
  outline: "bg-white/80 text-pink-500 border-pink-300 hover:bg-pink-50",
  ghost: "bg-transparent text-pink-500 border-transparent hover:bg-pink-50/50",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-2.5",
};

export function CuteButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  icon,
  href,
}: CuteButtonProps) {
  const baseStyles = `
    relative inline-flex items-center justify-center
    font-bold rounded-2xl border-2
    transition-all duration-300
    overflow-hidden
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `;

  const content = (
    <>
      {/* ホバー時の光エフェクト */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
        initial={{ x: "-200%" }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.6 }}
      />
      
      {/* ぷにぷに背景 */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      />
      
      {/* アイコン */}
      {icon && (
        <motion.span
          className="relative z-10"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          {icon}
        </motion.span>
      )}
      
      {/* テキスト */}
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={baseStyles}
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={baseStyles}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {content}
    </motion.button>
  );
}

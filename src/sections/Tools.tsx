"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Wrench,
  Download,
  ExternalLink,
  Check,
} from "lucide-react";
import { CuteCard, CuteBadge, CuteSectionTitle } from "@/components/CuteCard";
import { CuteButton } from "@/components/CuteButton";

// カウントアップアニメーション
function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min(
        (timestamp - startTime) / (duration * 1000),
        1
      );
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

// NEWバッジ
function NewBadge() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
    >
      <CuteBadge color="rose">NEW</CuteBadge>
    </motion.div>
  );
}

const tools = [
  {
    id: 1,
    title: "Image Converter",
    description: "様々な画像フォーマットを簡単に変換 🖼️",
    category: "Utility",
    downloads: 3200,
    emoji: "🖼️",
    features: ["Batch Convert", "20+ Formats"],
    color: "from-emerald-300 to-teal-300",
    isNew: false,
  },
  {
    id: 2,
    title: "Text Editor Pro",
    description: "シンプルかつ高機能なテキストエディタ 📝",
    category: "Productivity",
    downloads: 1850,
    emoji: "📝",
    features: ["Syntax Highlight", "Auto Save"],
    color: "from-blue-300 to-indigo-300",
    isNew: true,
  },
  {
    id: 3,
    title: "File Organizer",
    description: "ファイルを自動で整理・分類 📁",
    category: "Utility",
    downloads: 980,
    emoji: "📁",
    features: ["Auto Sort", "Duplicate Detection"],
    color: "from-amber-300 to-yellow-300",
    isNew: false,
  },
  {
    id: 4,
    title: "Color Picker",
    description: "画面から色を抽出できるツール 🎨",
    category: "Design",
    downloads: 2450,
    emoji: "🎨",
    features: ["Screen Pick", "Palette Export"],
    color: "from-pink-300 to-rose-300",
    isNew: false,
  },
  {
    id: 5,
    title: "Password Manager",
    description: "安全にパスワードを管理 🔐",
    category: "Security",
    downloads: 1120,
    emoji: "🔐",
    features: ["Encryption", "Generator"],
    color: "from-purple-300 to-violet-300",
    isNew: true,
  },
  {
    id: 6,
    title: "System Monitor",
    description: "PCのパフォーマンスをリアルタイム監視 📊",
    category: "System",
    downloads: 780,
    emoji: "📊",
    features: ["CPU/GPU/RAM", "Temperature"],
    color: "from-cyan-300 to-sky-300",
    isNew: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function Tools() {
  return (
    <section id="tools" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <CuteSectionTitle
          title="制作 ツール"
          subtitle="Tools"
          icon="🛠️"
        />

        {/* Tools Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tools.map((tool, index) => (
            <motion.div key={tool.id} variants={itemVariants}>
              <CuteCard className="h-full flex flex-col" hoverEffect={true}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-3xl shadow-lg`}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: index * 0.1,
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -10, 10, 0],
                    }}
                  >
                    <motion.span
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2,
                      }}
                    >
                      {tool.emoji}
                    </motion.span>
                  </motion.div>

                  {/* Badges */}
                  <div className="flex flex-col items-end gap-2">
                    {tool.isNew && <NewBadge />}
                    <CuteBadge color="purple">{tool.category}</CuteBadge>
                  </div>
                </div>

                {/* Title & Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <h3 className="text-xl font-bold text-slate-700 mb-2 hover:text-pink-500 transition-colors">
                    {tool.title}
                  </h3>
                </motion.div>
                <p className="text-slate-500 text-sm mb-4">{tool.description}</p>

                {/* Features */}
                <div className="flex-grow">
                  <motion.div
                    className="space-y-2"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.08,
                          delayChildren: 0.3 + index * 0.1,
                        },
                      },
                    }}
                  >
                    {tool.features.map((feature) => (
                      <motion.div
                        key={feature}
                        className="flex items-center gap-2 text-sm text-slate-500"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        whileHover={{ x: 5, color: "#ec4899" }}
                      >
                        <Check className="w-4 h-4 text-pink-400" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-pink-100">
                  <motion.div
                    className="flex items-center gap-1 text-sm text-slate-500"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.1,
                      }}
                    >
                      <Download className="w-4 h-4 text-pink-400" />
                    </motion.div>
                    <CountUp end={tool.downloads} duration={2} />
                  </motion.div>

                  <CuteButton variant="primary" size="sm">
                    <ExternalLink className="w-4 h-4" />
                    ダウンロード
                  </CuteButton>
                </div>
              </CuteCard>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <CuteButton
            variant="outline"
            size="lg"
            icon={<Wrench className="w-5 h-5" />}
          >
            すべてのツールを見る
          </CuteButton>
        </motion.div>
      </div>
    </section>
  );
}

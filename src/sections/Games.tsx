"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Gamepad2, Download, Star, ExternalLink, Sparkles } from "lucide-react";
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

const games = [
  {
    id: 1,
    title: "Pixel Adventure",
    description: "レトロ風ピクセルアートの2Dアクションゲーム 🎮",
    category: "Action",
    rating: 4.8,
    downloads: 1250,
    emoji: "🎮",
    tags: ["2D", "Pixel Art"],
    color: "from-pink-300 to-rose-300",
    bgColor: "bg-pink-50",
  },
  {
    id: 2,
    title: "Space Shooter X",
    description: "宇宙を舞台にしたシューティングゲーム 🚀",
    category: "Shooter",
    rating: 4.6,
    downloads: 890,
    emoji: "🚀",
    tags: ["Shooting", "Space"],
    color: "from-purple-300 to-indigo-300",
    bgColor: "bg-purple-50",
  },
  {
    id: 3,
    title: "Puzzle Master",
    description: "脳を鍛えるパズルゲーム集 🧩",
    category: "Puzzle",
    rating: 4.9,
    downloads: 2100,
    emoji: "🧩",
    tags: ["Puzzle", "Logic"],
    color: "from-emerald-300 to-teal-300",
    bgColor: "bg-emerald-50",
  },
  {
    id: 4,
    title: "RPG Quest",
    description: "ファンタジー世界を舞台にした王道RPG ⚔️",
    category: "RPG",
    rating: 4.7,
    downloads: 1560,
    emoji: "⚔️",
    tags: ["RPG", "Fantasy"],
    color: "from-amber-300 to-orange-300",
    bgColor: "bg-amber-50",
  },
  {
    id: 5,
    title: "Rhythm Beat",
    description: "音楽に合わせてリズムを刻む音ゲー 🎵",
    category: "Rhythm",
    rating: 4.5,
    downloads: 720,
    emoji: "🎵",
    tags: ["Rhythm", "Music"],
    color: "from-rose-300 to-pink-300",
    bgColor: "bg-rose-50",
  },
  {
    id: 6,
    title: "Tower Defense",
    description: "戦略的なタワーディフェンスゲーム 🏰",
    category: "Strategy",
    rating: 4.4,
    downloads: 980,
    emoji: "🏰",
    tags: ["Strategy", "TD"],
    color: "from-indigo-300 to-violet-300",
    bgColor: "bg-indigo-50",
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

export function Games() {
  return (
    <section id="games" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <CuteSectionTitle title="制作 ゲーム" subtitle="Games" icon="🎮" />

        {/* Games Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {games.map((game, index) => (
            <motion.div key={game.id} variants={itemVariants}>
              <CuteCard className="h-full p-0 overflow-hidden group" hoverEffect={true}>
                {/* Game Image/Icon */}
                <div
                  className={`h-48 bg-gradient-to-br ${game.color} relative overflow-hidden`}
                >
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 3, -3, 0],
                    }}
                    transition={{
                      duration: 3 + index * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="text-7xl drop-shadow-lg filter">
                      {game.emoji}
                    </span>
                  </motion.div>

                  {/* キラキラ */}
                  <motion.div
                    className="absolute top-4 right-4"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-white/70" />
                  </motion.div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, x: -20 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <CuteBadge color="pink">{game.category}</CuteBadge>
                    </motion.div>
                  </div>

                  {/* ホバー時の光 */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                    initial={{ x: "-200%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8 }}
                  />
                </div>

                <div className="p-5">
                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-slate-700 group-hover:text-pink-500 transition-colors mb-2">
                      {game.title}
                    </h3>
                  </motion.div>

                  {/* Description */}
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    {game.description}
                  </p>

                  {/* Tags */}
                  <motion.div
                    className="flex flex-wrap gap-2 mb-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.05 } },
                    }}
                  >
                    {game.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          visible: { opacity: 1, scale: 1 },
                        }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold border border-pink-200"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-pink-100">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {/* Rating */}
                      <motion.div
                        className="flex items-center gap-1"
                        whileHover={{ scale: 1.1 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        </motion.div>
                        <span className="font-bold">{game.rating}</span>
                      </motion.div>

                      {/* Downloads */}
                      <motion.div
                        className="flex items-center gap-1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <motion.div
                          animate={{ y: [0, -2, 0] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: index * 0.1,
                          }}
                        >
                          <Download className="w-4 h-4 text-pink-400" />
                        </motion.div>
                        <CountUp end={game.downloads} duration={2} />
                      </motion.div>
                    </div>

                    <CuteButton variant="primary" size="sm">
                      <ExternalLink className="w-4 h-4" />
                      詳細
                    </CuteButton>
                  </div>
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
            icon={<Gamepad2 className="w-5 h-5" />}
          >
            すべてのゲームを見る
          </CuteButton>
        </motion.div>
      </div>
    </section>
  );
}

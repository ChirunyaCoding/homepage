"use client";

import { motion } from "framer-motion";
import { Play, Eye, ThumbsUp, ExternalLink } from "lucide-react";
import { CuteCard, CuteBadge, CuteSectionTitle } from "@/components/CuteCard";
import { CuteButton } from "@/components/CuteButton";

// 脈動するプレイボタン
function PulsingPlayButton() {
  return (
    <motion.div
      className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shadow-lg relative"
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-pink-400"
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.5, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <Play className="w-7 h-7 text-white ml-1 relative z-10" />
    </motion.div>
  );
}

// アニメーションするチャンネルアイコン
function AnimatedChannelIcon({
  emoji,
  color,
  delay = 0,
}: {
  emoji: string;
  color: string;
  delay?: number;
}) {
  const colorClasses: Record<string, string> = {
    red: "from-rose-300 to-pink-300",
    blue: "from-sky-300 to-cyan-300",
    purple: "from-purple-300 to-indigo-300",
    green: "from-emerald-300 to-teal-300",
    amber: "from-amber-300 to-yellow-300",
  };

  return (
    <motion.div
      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-4xl shadow-lg relative overflow-hidden`}
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay,
      }}
      whileHover={{
        scale: 1.1,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.5 },
      }}
    >
      <motion.span
        animate={{
          y: [0, -5, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        {emoji}
      </motion.span>
    </motion.div>
  );
}

const youtubeChannels = [
  {
    id: 1,
    name: "ちるにゃゲームch",
    description: "ゲーム開発の過程や技術解説を発信しています 🎮",
    subscribers: "1.2K",
    videos: 45,
    url: "#",
    emoji: "🎮",
    color: "red",
  },
  {
    id: 2,
    name: "ちるにゃvlog",
    description: "日常や制作の裏側をお届けします 🌸",
    subscribers: "850",
    videos: 28,
    url: "#",
    emoji: "📹",
    color: "blue",
  },
];

const featuredVideos = [
  {
    id: 1,
    title: "【Unity】初心者向けゲーム制作講座 #1",
    views: "5.2K",
    likes: 320,
    duration: "15:30",
    emoji: "🎓",
    color: "from-pink-200 to-rose-200",
  },
  {
    id: 2,
    title: "新作ゲーム「Pixel Adventure」紹介",
    views: "3.8K",
    likes: 245,
    duration: "8:45",
    emoji: "🎮",
    color: "from-purple-200 to-indigo-200",
  },
  {
    id: 3,
    title: "プログラマーの1日に密着",
    views: "2.1K",
    likes: 180,
    duration: "12:00",
    emoji: "📅",
    color: "from-sky-200 to-cyan-200",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export function YouTube() {
  return (
    <section id="youtube" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <CuteSectionTitle
          title="YouTube チャンネル"
          subtitle="動画"
          icon="📺"
        />

        {/* My Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.h3
            className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-2xl"
            >
              🎬
            </motion.span>
            マイチャンネル
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {youtubeChannels.map((channel, index) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <CuteCard className="h-full group" hoverEffect={true}>
                  <div className="flex items-start gap-4">
                    <AnimatedChannelIcon
                      emoji={channel.emoji}
                      color={channel.color}
                      delay={index * 0.2}
                    />
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <motion.h4
                          className="text-lg font-bold text-slate-700 group-hover:text-pink-500 transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          {channel.name}
                        </motion.h4>
                        <CuteBadge color="rose">YouTube</CuteBadge>
                      </div>
                      <p className="text-slate-500 text-sm mb-3">
                        {channel.description}
                      </p>
                      <motion.div
                        className="flex items-center gap-4 text-sm text-slate-400"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                          hidden: {},
                          visible: {
                            transition: {
                              staggerChildren: 0.1,
                              delayChildren: 0.4 + index * 0.1,
                            },
                          },
                        }}
                      >
                        <motion.span
                          className="flex items-center gap-1"
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 },
                          }}
                          whileHover={{ scale: 1.05, color: "#ec4899" }}
                        >
                          <Eye className="w-4 h-4" />
                          {channel.subscribers} 登録者
                        </motion.span>
                        <motion.span
                          className="flex items-center gap-1"
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 },
                          }}
                          whileHover={{ scale: 1.05, color: "#ec4899" }}
                        >
                          <Play className="w-4 h-4" />
                          {channel.videos} 本の動画
                        </motion.span>
                      </motion.div>
                    </div>
                  </div>
                  <motion.div
                    className="mt-4 pt-4 border-t border-pink-100"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <CuteButton variant="primary" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4" />
                      チャンネルを見る
                    </CuteButton>
                  </motion.div>
                </CuteCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Videos */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              ⭐
            </motion.span>
            おすすめ動画
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVideos.map((video, index) => (
              <motion.div key={video.id} variants={itemVariants}>
                <CuteCard className="h-full p-0 overflow-hidden group">
                  {/* Video Thumbnail */}
                  <div
                    className={`h-44 bg-gradient-to-br ${video.color} relative overflow-hidden flex items-center justify-center`}
                  >
                    <motion.span
                      className="text-6xl"
                      animate={{
                        y: [0, -5, 0],
                        rotate: [0, 2, -2, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3,
                      }}
                    >
                      {video.emoji}
                    </motion.span>
                    <motion.div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <motion.div
                      className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-700 text-sm font-bold rounded-full"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {video.duration}
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PulsingPlayButton />
                    </motion.div>
                  </div>

                  <div className="p-5">
                    <motion.h4
                      className="font-bold text-slate-700 line-clamp-2 mb-3 group-hover:text-pink-500 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {video.title}
                    </motion.h4>
                    <motion.div
                      className="flex items-center gap-4 text-sm text-slate-400"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3 + index * 0.1,
                          },
                        },
                      }}
                    >
                      <motion.span
                        className="flex items-center gap-1"
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        whileHover={{ scale: 1.05, color: "#ec4899" }}
                      >
                        <Eye className="w-4 h-4" />
                        {video.views}
                      </motion.span>
                      <motion.span
                        className="flex items-center gap-1"
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        whileHover={{ scale: 1.05, color: "#ec4899" }}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {video.likes}
                      </motion.span>
                    </motion.div>
                  </div>
                </CuteCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

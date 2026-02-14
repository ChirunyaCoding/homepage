"use client";

import { motion } from "framer-motion";
import { Gamepad2, Download, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const games = [
  {
    id: 1,
    title: "Pixel Adventure",
    description: "レトロ風ピクセルアートの2Dアクションゲーム。様々なステージを冒険しよう！",
    category: "Action",
    rating: 4.8,
    downloads: 1250,
    image: "🎮",
    tags: ["2D", "Pixel Art", "Platformer"],
    color: "from-purple-400 to-pink-400",
  },
  {
    id: 2,
    title: "Space Shooter X",
    description: "宇宙を舞台にしたシューティングゲーム。迫りくる敵を撃ち落とせ！",
    category: "Shooter",
    rating: 4.6,
    downloads: 890,
    image: "🚀",
    tags: ["Shooting", "Space", "Bullet Hell"],
    color: "from-cyan-400 to-blue-400",
  },
  {
    id: 3,
    title: "Puzzle Master",
    description: "脳を鍛えるパズルゲーム集。論理的思考で難問を解き明かせ！",
    category: "Puzzle",
    rating: 4.9,
    downloads: 2100,
    image: "🧩",
    tags: ["Puzzle", "Logic", "Brain Training"],
    color: "from-emerald-400 to-teal-400",
  },
  {
    id: 4,
    title: "RPG Quest",
    description: "ファンタジー世界を舞台にした王道RPG。勇者となって世界を救え！",
    category: "RPG",
    rating: 4.7,
    downloads: 1560,
    image: "⚔️",
    tags: ["RPG", "Fantasy", "Story"],
    color: "from-amber-400 to-orange-400",
  },
  {
    id: 5,
    title: "Rhythm Beat",
    description: "音楽に合わせてリズムを刻む音ゲー。豊富な楽曲で遊ぼう！",
    category: "Rhythm",
    rating: 4.5,
    downloads: 720,
    image: "🎵",
    tags: ["Rhythm", "Music", "Casual"],
    color: "from-rose-400 to-red-400",
  },
  {
    id: 6,
    title: "Tower Defense",
    description: "戦略的なタワーディフェンスゲーム。敵の侵攻を防ぎきれ！",
    category: "Strategy",
    rating: 4.4,
    downloads: 980,
    image: "🏰",
    tags: ["Strategy", "Tower Defense", "Tactical"],
    color: "from-indigo-400 to-violet-400",
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
    <section id="games" className="py-24 relative overflow-hidden bg-gradient-to-b from-white via-cyan-50/30 to-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 border border-cyan-200 mb-6"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-500" />
            <span className="text-sm text-cyan-600 font-medium">Games</span>
          </motion.div>

          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="text-slate-700">制作</span>
            <span className="text-gradient">ゲーム</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            私が制作したゲーム作品です。
            無料でダウンロードして遊べます。
          </p>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {games.map((game) => (
            <motion.div key={game.id} variants={itemVariants}>
              <Card className="group bg-white border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100 overflow-hidden">
                {/* Game Image/Icon */}
                <div className={`h-40 bg-gradient-to-br ${game.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">{game.image}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/80 text-slate-700 backdrop-blur-sm">
                      {game.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-slate-700 group-hover:text-cyan-600 transition-colors">
                    {game.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-slate-500">
                    {game.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-cyan-200 text-cyan-600"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>{game.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4 text-cyan-500" />
                      <span>{game.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-cyan-100 text-cyan-600 hover:bg-cyan-500 hover:text-white transition-all"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    詳細
                  </Button>
                </CardFooter>
              </Card>
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
          <Button
            variant="outline"
            size="lg"
            className="border-cyan-300 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-400"
          >
            <Gamepad2 className="w-5 h-5 mr-2" />
            すべてのゲームを見る
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

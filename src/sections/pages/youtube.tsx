import React from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from "framer-motion";
import { Youtube, Play, Eye, ThumbsUp, ExternalLink, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Footer } from "@/sections/Footer";
import "@/index.css";

const favoriteChannels = [
  {
    id: 1,
    name: "好きなチャンネル1",
    description: "ここにチャンネルの説明を入力してください",
    subscribers: "10万",
    videos: 200,
    url: "#",
    thumbnail: "🎮",
    color: "from-red-500 to-rose-500",
  },
  {
    id: 2,
    name: "好きなチャンネル2",
    description: "ここにチャンネルの説明を入力してください",
    subscribers: "5万",
    videos: 150,
    url: "#",
    thumbnail: "📹",
    color: "from-cyan-500 to-sky-500",
  },
  {
    id: 3,
    name: "好きなチャンネル3",
    description: "ここにチャンネルの説明を入力してください",
    subscribers: "20万",
    videos: 300,
    url: "#",
    thumbnail: "🎨",
    color: "from-purple-500 to-pink-500",
  },
];

const featuredVideos = [
  {
    id: 1,
    title: "【Unity】初心者向けゲーム制作講座 #1",
    views: "5.2K",
    likes: 320,
    duration: "15:30",
    thumbnail: "🎓",
  },
  {
    id: 2,
    title: "新作ゲーム「Pixel Adventure」紹介",
    views: "3.8K",
    likes: 245,
    duration: "8:45",
    thumbnail: "🎮",
  },
  {
    id: 3,
    title: "プログラマーの1日に密着",
    views: "2.1K",
    likes: 180,
    duration: "12:00",
    thumbnail: "📅",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

function YouTubePage() {
  const baseUrl = import.meta.env.BASE_URL || "/";
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-24 relative overflow-hidden bg-white">
        <ParticlesBackground />

        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <a href={baseUrl}>
              <Button variant="ghost" className="text-slate-500 hover:text-cyan-600">
                <ChevronLeft className="w-5 h-5 mr-1" />
                ホームに戻る
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 border border-red-200 mb-6">
              <Youtube className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 font-medium">YouTube</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              <span className="text-slate-700">おすすめ</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-500">チャンネル</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              いつも楽しく見させていただいている、
              おすすめのYouTubeチャンネルを紹介します。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
              <Play className="w-5 h-5 text-red-500" />
              いつも見ているチャンネル
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteChannels.map((channel) => (
                <motion.div
                  key={channel.id}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-white border-slate-200 hover:border-red-300 transition-all duration-300 hover:shadow-xl hover:shadow-red-100 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${channel.color} flex items-center justify-center text-4xl flex-shrink-0 shadow-lg`}>
                          {channel.thumbnail}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-slate-700 group-hover:text-red-500 transition-colors">
                              {channel.name}
                            </h3>
                            <Badge className="bg-red-500 text-white">
                              <Youtube className="w-3 h-3 mr-1" />
                              YouTube
                            </Badge>
                          </div>
                          <p className="text-slate-500 text-sm mb-3">
                            {channel.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {channel.subscribers} 登録者
                            </span>
                            <span className="flex items-center gap-1">
                              <Play className="w-4 h-4" />
                              {channel.videos} 本の動画
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <Button size="sm" className="w-full bg-red-500 hover:bg-red-600 text-white">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          チャンネルを見る
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-cyan-500" />
              おすすめ動画
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredVideos.map((video) => (
                <motion.div key={video.id} variants={itemVariants}>
                  <Card className="group bg-white border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100 overflow-hidden cursor-pointer">
                    <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden flex items-center justify-center">
                      <span className="text-5xl">{video.thumbnail}</span>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-medium text-slate-700 line-clamp-2 mb-2 group-hover:text-cyan-600 transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {video.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {video.likes}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <YouTubePage />
  </React.StrictMode>,
)

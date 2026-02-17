import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from "framer-motion";
import { Sparkles, Youtube, Twitter, Github, ChevronRight, MapPin, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Navigation } from "@/components/Navigation";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Footer } from "@/sections/Footer";
import "@/index.css";

// 文字アニメーションコンポーネント
function AnimatedText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const letters = text.split("");
  
  return (
    <motion.span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.04,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{ display: "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

const baseUrl = import.meta.env.BASE_URL || "/";
const youtubeChannelUrl = "https://www.youtube.com/@%E3%81%A1%E3%81%AF%E3%82%8B_Dev";
const youtubeApiBase = "https://www.googleapis.com/youtube/v3";
const liveStatusPollMs = 120000;
const youtubeChannelHandle = "ちはる_Dev";

type YouTubeChannelLookupResponse = {
  items?: Array<{
    id?: string;
  }>;
};

type YouTubeLiveSearchResponse = {
  items?: Array<{
    id?: {
      videoId?: string;
    };
  }>;
};

function buildYouTubeApiUrl(endpoint: string, params: Record<string, string | number>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    query.set(key, String(value));
  });
  return `${youtubeApiBase}/${endpoint}?${query.toString()}`;
}

const profileSocialLinks = [
  { name: "YouTube", icon: Youtube, href: youtubeChannelUrl, color: "from-red-500 to-rose-500" },
  { name: "X", icon: Twitter, href: "https://x.com/ChihaluCoding", color: "from-sky-400 to-blue-500" },
  { name: "GitHub", icon: Github, href: "https://github.com/ChihaluCoding", color: "from-slate-500 to-slate-700" },
];

function HomePage() {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isYouTubeLive, setIsYouTubeLive] = useState(false);
  const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY?.trim() ?? "";

  useEffect(() => {
    let disposed = false;
    let channelIdCache: string | null = null;

    const updateLiveStatus = async () => {
      if (!youtubeApiKey) {
        if (!disposed) {
          setIsYouTubeLive(false);
        }
        return;
      }

      try {
        if (!channelIdCache) {
          const channelLookupUrl = buildYouTubeApiUrl("channels", {
            part: "id",
            forHandle: youtubeChannelHandle,
            key: youtubeApiKey,
          });

          const channelLookupResponse = await fetch(channelLookupUrl);
          if (!channelLookupResponse.ok) {
            throw new Error(`YouTube API error: ${channelLookupResponse.status}`);
          }

          const channelLookupData = (await channelLookupResponse.json()) as YouTubeChannelLookupResponse;
          channelIdCache = channelLookupData.items?.[0]?.id ?? null;
        }

        if (!channelIdCache) {
          if (!disposed) {
            setIsYouTubeLive(false);
          }
          return;
        }

        const liveSearchUrl = buildYouTubeApiUrl("search", {
          part: "id",
          channelId: channelIdCache,
          eventType: "live",
          type: "video",
          maxResults: 1,
          key: youtubeApiKey,
        });

        const liveSearchResponse = await fetch(liveSearchUrl);
        if (!liveSearchResponse.ok) {
          throw new Error(`YouTube API error: ${liveSearchResponse.status}`);
        }

        const liveSearchData = (await liveSearchResponse.json()) as YouTubeLiveSearchResponse;
        const isLive = (liveSearchData.items?.length ?? 0) > 0;

        if (!disposed) {
          setIsYouTubeLive(isLive);
        }
      } catch {
        if (!disposed) {
          setIsYouTubeLive(false);
        }
      }
    };

    updateLiveStatus();
    const timerId = window.setInterval(updateLiveStatus, liveStatusPollMs);

    return () => {
      disposed = true;
      window.clearInterval(timerId);
    };
  }, [youtubeApiKey]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <ParticlesBackground />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24 lg:py-28">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative w-[22rem] h-[30rem] lg:w-[30rem] lg:h-[42rem]">
                <img
                  src={`${baseUrl}character.png`}
                  alt="Character"
                  className="relative z-10 w-full h-full object-contain"
                />

              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl space-y-6"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-cyan-100/80 bg-white p-6 sm:p-9 lg:p-12 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  className="relative flex items-center justify-center mb-6"
                >
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100 to-sky-100 border border-cyan-200/80 relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4 text-cyan-500" />
                    </motion.div>
                    <span className="text-sm text-cyan-700 font-semibold tracking-wide relative z-10">ようこそっ！</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-200/0 via-cyan-200/50 to-cyan-200/0"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    />
                  </motion.div>
                </motion.div>

                <motion.h1
                  className="relative text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.05] break-words"
                >
                  <AnimatedText text="ちるにゃ" className="text-slate-700" delay={0.4} />
                  <br className="sm:hidden" />
                  <AnimatedText text="すたじお" className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 bg-clip-text text-transparent sm:ml-1" delay={0.6} />
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="relative text-xl text-slate-500 mb-9 leading-relaxed"
                >
                  {["自", "作", "ゲ", "ー", "ム", "・", "ツ", "ー", "ル", "等", "の", "販", "売", "や", "活", "動", "記", "録", "を", "残", "し", "て", "い", "ま", "す", "。"].map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.02 }}
                      style={{ display: "inline-block" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="relative flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a href={`${baseUrl}records/`}>
                      <Button
                        size="lg"
                        className="rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white hover:from-cyan-600 hover:to-sky-600 relative overflow-hidden group"
                      >
                        <motion.span
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: "-100%", skewX: -20 }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                        <span className="relative flex items-center">
                          きろくをみる
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ChevronRight className="w-5 h-5 ml-1" />
                          </motion.div>
                        </span>
                      </Button>
                    </a>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a href={`${baseUrl}works/`}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-xl border-cyan-200 bg-white/80 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 relative overflow-hidden group"
                      >
                        <motion.span
                          className="absolute inset-0 bg-cyan-50"
                          initial={{ y: "100%" }}
                          whileHover={{ y: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        <span className="relative">さくひんをみる</span>
                      </Button>
                    </a>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 100 }}
              >
                <Card className="bg-white border-cyan-100 overflow-hidden rounded-2xl group hover:border-cyan-300 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-100/50">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-6 mb-6">
                      <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <motion.div 
                          className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 p-1"
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(34, 211, 238, 0.4)",
                              "0 0 0 10px rgba(34, 211, 238, 0)",
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <button
                            type="button"
                            onClick={() => setIsAvatarOpen(true)}
                            className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden cursor-zoom-in relative"
                            aria-label="アバターを拡大"
                          >
                            <motion.img 
                              src={`${baseUrl}avatar.png`} 
                              alt="Avatar" 
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                            />
                          </button>
                        </motion.div>
                        <motion.div 
                          className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${isYouTubeLive ? "bg-red-500" : "bg-slate-300"}`}
                          animate={isYouTubeLive ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                          transition={isYouTubeLive ? { duration: 1.2, repeat: Infinity } : { duration: 0 }}
                          title={isYouTubeLive ? "YouTube Live配信中" : "YouTube Liveオフライン"}
                        >
                          <motion.div 
                            className="w-2 h-2 bg-white rounded-full"
                            animate={isYouTubeLive ? { opacity: [1, 0.55, 1] } : { opacity: 0.9 }}
                            transition={isYouTubeLive ? { duration: 1.2, repeat: Infinity } : { duration: 0 }}
                          />
                        </motion.div>
                      </motion.div>
                      <div>
                        <motion.h3 
                          className="text-2xl font-bold text-slate-700"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.3 }}
                        >
                          ちるにゃ
                        </motion.h3>
                        <motion.div 
                          className="flex items-center gap-2 mt-2 text-sm text-slate-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.4 }}
                        >
                          <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <MapPin className="w-4 h-4" />
                          </motion.div>
                          <span>Japan</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center gap-2 mt-1 text-sm text-slate-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5 }}
                        >
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                          >
                            <CalendarDays className="w-4 h-4" />
                          </motion.div>
                          <span>2004年3月14日</span>
                        </motion.div>
                      </div>
                    </div>

                    <motion.p 
                      className="text-slate-500 leading-relaxed mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6 }}
                    >
                      {"こんにちは！ちるにゃです。独学でプログラミング/3Dモデリングを始めました。よろしくお願いします！".split("").map((char, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6 + index * 0.015 }}
                          style={{ display: "inline-block" }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                    </motion.p>

                    <motion.div 
                      className="flex flex-wrap gap-3"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1, delayChildren: 1.8 } }
                      }}
                    >
                      {profileSocialLinks.map((link) => (
                        <motion.a
                          key={link.name}
                          href={link.href}
                          variants={{
                            hidden: { opacity: 0, scale: 0.8, y: 20 },
                            visible: { opacity: 1, scale: 1, y: 0 }
                          }}
                          whileHover={{ 
                            scale: 1.1, 
                            y: -3,
                            rotate: [0, -5, 5, 0],
                            transition: { duration: 0.3 }
                          }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${link.color} text-white text-sm font-medium relative overflow-hidden group`}
                        >
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
                          <span className="relative z-10">{link.name}</span>
                        </motion.a>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
        <DialogContent className="w-fit max-w-[92vw] border-cyan-100 bg-white p-3">
          <DialogTitle className="sr-only">Avatar Preview</DialogTitle>
          <motion.img
            src={`${baseUrl}avatar.png`}
            alt="Avatar enlarged"
            className="max-h-[80vh] w-auto rounded-xl object-contain"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
)

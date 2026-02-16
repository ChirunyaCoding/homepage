import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, Tag, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Navigation } from "@/components/Navigation";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Footer } from "@/sections/Footer";
import "@/index.css";

const ITEMS_PER_PAGE = 15;
const AUTO_SLIDE_INTERVAL_MS = 5000;

type GrowthRecord = {
  id: number;
  title: string;
  description: string;
  images: string[];
  youtubeUrls: string[];
  date?: string;
  tags?: string[];
};

// アニメーションコンポーネント
function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + index * 0.03, duration: 0.3 }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </>
  );
}

function SkeletonCard() {
  return (
    <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg h-full flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200" />
      <motion.div 
        className="aspect-[4/3] bg-slate-100"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <div className="p-6 space-y-4 flex-1">
        <motion.div 
          className="h-7 bg-slate-200 rounded-lg w-3/4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
        />
        <motion.div 
          className="h-4 bg-slate-200 rounded w-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div 
          className="h-4 bg-slate-200 rounded w-2/3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        />
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <motion.div 
            className="h-4 bg-slate-200 rounded w-16"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          />
          <motion.div 
            className="h-4 bg-slate-200 rounded w-20"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

function toText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function uniqueStrings(values: string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
}

function toTextArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => toText(item))
    .filter((item) => item.length > 0);
}

function resolveImageSrc(baseUrl: string, value: string): string {
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) return value;
  return `${baseUrl}${value.replace(/^\/+/, "")}`;
}

function toYouTubeEmbedUrl(value: string): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.replace(/^\/+/, "").split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname.startsWith("/watch")) {
        const id = url.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (url.pathname.startsWith("/embed/")) {
        const id = url.pathname.replace("/embed/", "").split("/")[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (url.pathname.startsWith("/shorts/")) {
        const id = url.pathname.replace("/shorts/", "").split("/")[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function normalizeRecords(data: unknown): GrowthRecord[] {
  if (!Array.isArray(data)) return [];

  return data
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => {
      const legacyImage = toText(item.image);
      const legacyYoutube = toText(item.youtubeUrl);

      const images = uniqueStrings([
        ...toTextArray(item.images),
        ...(legacyImage ? [legacyImage] : []),
      ]);
      const youtubeUrls = uniqueStrings([
        ...toTextArray(item.youtubeUrls),
        ...(legacyYoutube ? [legacyYoutube] : []),
      ]).filter((url) => Boolean(toYouTubeEmbedUrl(url)));

      return {
        id: typeof item.id === "number" ? item.id : 0,
        title: toText(item.title),
        description: toText(item.description),
        images,
        youtubeUrls,
        date: toText(item.date),
        tags: toTextArray(item.tags),
      };
    })
    .filter((item) => {
      if (!(item.id > 0 && item.title && item.description)) return false;
      const hasImage = item.images.length > 0;
      const hasVideo = item.youtubeUrls.length > 0;
      return hasImage || hasVideo;
    });
}

function RecordCardMedia({
  images,
  title,
  baseUrl,
  fallbackVideo,
}: {
  images: string[];
  title: string;
  baseUrl: string;
  fallbackVideo: string | null;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);

    if (images.length <= 1) return;

    const timerId = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, [images]);

  if (images.length > 0) {
    const imageSources = images.map((image) => resolveImageSrc(baseUrl, image));

    return (
      <div className="relative w-full h-full overflow-hidden bg-slate-900">
        <motion.div
          className="flex h-full w-full"
          animate={{ x: `-${activeImageIndex * 100}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {imageSources.map((src, index) => (
            <motion.div 
              key={`${src}-${index}`} 
              className="h-full w-full shrink-0 relative"
            >
              <img 
                src={src} 
                alt={`${title} ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
              {/* グラデーションオーバーレイ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
          ))}
        </motion.div>

        {imageSources.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 backdrop-blur-md">
            {imageSources.map((_, index) => (
              <motion.button
                key={index}
                type="button"
                aria-label={`画像 ${index + 1} に移動`}
                onClick={() => setActiveImageIndex(index)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeImageIndex ? "bg-white w-6" : "bg-white/40 w-2 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
        
        {/* 光の反射エフェクト */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
          initial={{ x: "-200%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 1 }}
        />
      </div>
    );
  }

  if (fallbackVideo) {
    return (
      <iframe
        src={fallbackVideo}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-slate-400" />
        </div>
        <span className="text-slate-500">メディアなし</span>
      </div>
    </div>
  );
}

function RecordsPage() {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === "undefined") return 1;
    const pageParam = Number(new URLSearchParams(window.location.search).get("page") ?? "1");
    if (!Number.isFinite(pageParam) || pageParam < 1) return 1;
    return Math.floor(pageParam);
  });

  const totalPages = Math.max(1, Math.ceil(records.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleRecords = records.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    let isMounted = true;

    const loadRecords = async () => {
      try {
        const response = await fetch(`${baseUrl}records-data.json`);
        if (!response.ok) throw new Error("Failed to load records data");
        const data = await response.json();
        if (!isMounted) return;
        setRecords(normalizeRecords(data));
      } catch {
        if (!isMounted) return;
        setRecords([]);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    loadRecords();

    return () => {
      isMounted = false;
    };
  }, [baseUrl]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (currentPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(currentPage));
    }
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState({}, "", url);
  }, [currentPage]);

  const getVisiblePages = () => {
    const windowSize = 5;
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + windowSize - 1);
    const adjustedStart = Math.max(1, end - windowSize + 1);

    return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white via-cyan-50/30 to-white">
        <ParticlesBackground />

        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <motion.a 
              href={baseUrl}
              whileHover={{ x: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button variant="ghost" className="text-slate-500 hover:text-cyan-600">
                <motion.div
                  animate={{ x: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                </motion.div>
                おうちにもどる
              </Button>
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 border border-cyan-200 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-cyan-500" />
              </motion.div>
              <span className="text-sm text-cyan-600 font-medium">せいちょうろぐ</span>
            </motion.div>

            <motion.h1 
              className="text-3xl lg:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-slate-700">
                <AnimatedText text="せいちょう" delay={0.3} />
              </span>
              <span className="text-gradient">
                <AnimatedText text="きろく" delay={0.5} />
              </span>
            </motion.h1>
            <motion.p 
              className="text-slate-500 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {"つくったものの進みぐあいを、カードでまとめています。".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.02 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          {isLoading ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <SkeletonCard />
                </motion.div>
              ))}
            </motion.div>
          ) : records.length === 0 ? (
            <motion.div 
              className="text-center text-slate-500 py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              まだきろくがないみたい…
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {visibleRecords.map((item) => {
                  const primaryVideo = item.youtubeUrls[0] ? toYouTubeEmbedUrl(item.youtubeUrls[0]) : null;

                  return (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      layout
                      whileHover={{ y: -12, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                      className="group"
                    >
                      <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 h-full flex flex-col">
                        {/* 上部グラデーションライン */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 z-20" />
                        
                        {/* 画像エリア - より大きく */}
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <RecordCardMedia
                            images={item.images}
                            title={item.title}
                            baseUrl={baseUrl}
                            fallbackVideo={primaryVideo}
                          />
                          
                          {/* ホバー時のオーバーレイ */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                          
                          {/* 日付バッジ */}
                          {item.date && (
                            <div className="absolute top-4 left-4 z-10">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
                                <Clock className="w-3.5 h-3.5 text-cyan-600" />
                                <span className="text-xs font-semibold text-slate-700">{item.date}</span>
                              </div>
                            </div>
                          )}
                          
                          {/* 画像数インジケーター */}
                          {item.images.length > 1 && (
                            <div className="absolute top-4 right-4 z-10">
                              <div className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                                {item.images.length}枚
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* コンテンツエリア */}
                        <div className="p-6 flex-1 flex flex-col">
                          {/* タイトル */}
                          <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-cyan-600 transition-colors duration-300 leading-tight line-clamp-2">
                            {item.title}
                          </h3>
                          
                          {/* 説明文 */}
                          <p className="text-slate-500 leading-relaxed text-sm mb-5 line-clamp-3 flex-1">
                            {item.description}
                          </p>
                          
                          {/* タグ */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {item.tags.slice(0, 4).map((tag, idx) => (
                                <span 
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 text-xs font-medium border border-cyan-100"
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 4 && (
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                                  +{item.tags.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* ボトムアクション */}
                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">
                              きろく #{item.id}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05, x: 3 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
                            >
                              くわしくみる
                              <ExternalLink className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && totalPages > 1 && (
            <motion.div 
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="relative overflow-hidden"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  まえへ
                </Button>
              </motion.div>

              {getVisiblePages().map((page) => (
                <motion.div 
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? "bg-cyan-500 hover:bg-cyan-600" : ""}
                  >
                    {page}
                  </Button>
                </motion.div>
              ))}

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  つぎへ
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecordsPage />
  </React.StrictMode>,
)

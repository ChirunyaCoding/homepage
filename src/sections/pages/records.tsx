import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
};

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
      <div className="relative w-full h-full overflow-hidden">
        <motion.div
          className="flex h-full w-full"
          animate={{ x: `-${activeImageIndex * 100}%` }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          {imageSources.map((src, index) => (
            <div key={`${src}-${index}`} className="h-full w-full shrink-0">
              <img src={src} alt={`${title} ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </motion.div>

        {imageSources.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full bg-black/30 px-2 py-1 backdrop-blur-sm">
            {imageSources.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`画像 ${index + 1} に移動`}
                onClick={() => setActiveImageIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === activeImageIndex ? "bg-white" : "bg-white/55"
                }`}
              />
            ))}
          </div>
        )}
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
    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
      メディアなし
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
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 border border-cyan-200 mb-6">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span className="text-sm text-cyan-600 font-medium">Growth Log</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              <span className="text-slate-700">成長</span>
              <span className="text-gradient">記録</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              制作活動の進捗をカード形式でまとめています。
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center text-slate-500 py-12">読み込み中...</div>
          ) : records.length === 0 ? (
            <div className="text-center text-slate-500 py-12">記録データがありません。</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleRecords.map((item, index) => {
                const primaryVideo = item.youtubeUrls[0] ? toYouTubeEmbedUrl(item.youtubeUrls[0]) : null;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.05 }}
                  >
                    <Card className="bg-white border-cyan-100 overflow-hidden h-full">
                      <div className="aspect-[4/3] border-b border-cyan-100 bg-slate-50 overflow-hidden">
                        <RecordCardMedia
                          images={item.images}
                          title={item.title}
                          baseUrl={baseUrl}
                          fallbackVideo={primaryVideo}
                        />
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold text-slate-700 mb-2">{item.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                前へ
              </Button>

              {getVisiblePages().map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={page === currentPage ? "bg-cyan-500 hover:bg-cyan-600" : ""}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                次へ
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
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

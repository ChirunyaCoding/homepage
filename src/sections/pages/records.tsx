import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Footer } from "@/sections/Footer";
import "@/index.css";

const ITEMS_PER_PAGE = 15;

type GrowthRecord = {
  id: number;
  title: string;
  description: string;
  images: string[];
  youtubeUrls: string[];
};

type MediaTab = "images" | "videos";

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

function RecordsPage() {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<GrowthRecord | null>(null);
  const [mediaTab, setMediaTab] = useState<MediaTab>("images");
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

  const openMediaDialog = (record: GrowthRecord, preferredTab?: MediaTab) => {
    const hasImages = record.images.length > 0;
    const hasVideos = record.youtubeUrls.some((url) => Boolean(toYouTubeEmbedUrl(url)));

    if (!hasImages && !hasVideos) return;

    if (preferredTab === "images" && hasImages) {
      setMediaTab("images");
    } else if (preferredTab === "videos" && hasVideos) {
      setMediaTab("videos");
    } else {
      setMediaTab(hasImages ? "images" : "videos");
    }

    setSelectedRecord(record);
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
                const primaryImage = item.images[0] ?? "";
                const primaryVideo = item.youtubeUrls[0] ? toYouTubeEmbedUrl(item.youtubeUrls[0]) : null;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.05 }}
                  >
                    <Card
                      className="group bg-white border-cyan-100 overflow-hidden h-full cursor-pointer"
                      onClick={() => openMediaDialog(item)}
                    >
                      <div className="aspect-[4/3] border-b border-cyan-100 bg-slate-50 overflow-hidden">
                        {primaryImage ? (
                          <img
                            src={resolveImageSrc(baseUrl, primaryImage)}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : primaryVideo ? (
                          <iframe
                            src={primaryVideo}
                            title={item.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                            メディアなし
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold text-slate-700 mb-2">{item.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{item.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.images.length > 0 && (
                            <button
                              type="button"
                              className="px-2 py-1 rounded-md bg-cyan-50 border border-cyan-100 text-xs text-cyan-700 hover:bg-cyan-100"
                              onClick={(event) => {
                                event.stopPropagation();
                                openMediaDialog(item, "images");
                              }}
                            >
                              画像 {item.images.length}件
                            </button>
                          )}
                          {item.youtubeUrls.length > 0 && (
                            <button
                              type="button"
                              className="px-2 py-1 rounded-md bg-red-50 border border-red-100 text-xs text-red-700 hover:bg-red-100"
                              onClick={(event) => {
                                event.stopPropagation();
                                openMediaDialog(item, "videos");
                              }}
                            >
                              動画 {item.youtubeUrls.length}件
                            </button>
                          )}
                        </div>
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

      <Dialog open={Boolean(selectedRecord)} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedRecord && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRecord.title}</DialogTitle>
                <DialogDescription>{selectedRecord.description}</DialogDescription>
              </DialogHeader>

              <Tabs value={mediaTab} onValueChange={(value) => setMediaTab(value as MediaTab)} className="mt-2">
                <TabsList className="grid grid-cols-2 w-full sm:w-72">
                  <TabsTrigger value="images" disabled={selectedRecord.images.length === 0}>
                    画像 ({selectedRecord.images.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    disabled={selectedRecord.youtubeUrls.filter((url) => Boolean(toYouTubeEmbedUrl(url))).length === 0}
                  >
                    動画 ({selectedRecord.youtubeUrls.filter((url) => Boolean(toYouTubeEmbedUrl(url))).length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="images" className="mt-4">
                  {selectedRecord.images.length === 0 ? (
                    <p className="text-slate-500 text-sm">画像はありません。</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedRecord.images.map((image, index) => (
                        <div key={`${image}-${index}`} className="rounded-lg overflow-hidden border border-cyan-100 bg-slate-50">
                          <div className="aspect-video">
                            <img
                              src={resolveImageSrc(baseUrl, image)}
                              alt={`${selectedRecord.title} image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="px-3 py-2 text-xs text-slate-500">画像 {index + 1}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="videos" className="mt-4">
                  {selectedRecord.youtubeUrls.filter((url) => Boolean(toYouTubeEmbedUrl(url))).length === 0 ? (
                    <p className="text-slate-500 text-sm">動画はありません。</p>
                  ) : (
                    <div className="space-y-4">
                      {selectedRecord.youtubeUrls
                        .map((url) => toYouTubeEmbedUrl(url))
                        .filter((url): url is string => Boolean(url))
                        .map((embedUrl, index) => (
                          <div key={`${embedUrl}-${index}`} className="rounded-lg overflow-hidden border border-red-100 bg-slate-50">
                            <div className="aspect-video">
                              <iframe
                                src={embedUrl}
                                title={`${selectedRecord.title} video ${index + 1}`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                            <div className="px-3 py-2 text-xs text-slate-500">動画 {index + 1}</div>
                          </div>
                        ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecordsPage />
  </React.StrictMode>,
)

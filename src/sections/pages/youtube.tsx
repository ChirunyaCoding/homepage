import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const AUTO_SLIDE_INTERVAL_MS = 5000;

type VideoMode = "streams" | "videos";

type ChannelSeed = {
  id: number;
  handle: string;
  fallbackName: string;
  url: string;
  color: string;
  fallbackEmoji: string;
  videoMode: VideoMode;
};

type ChannelProfile = {
  id: number;
  handle: string;
  title: string;
  url: string;
  color: string;
  fallbackEmoji: string;
  videoMode: VideoMode;
  channelId: string;
  uploadsPlaylistId: string;
  subscriberCount: number | null;
  videoCount: number | null;
  thumbnailUrl: string;
};

type ChannelVideo = {
  id: string;
  title: string;
  durationIso: string;
  views: number | null;
  likes: number | null;
  thumbnailUrl: string;
  publishedAt: string;
};

type YouTubeThumbnailSet = {
  default?: { url?: string };
  medium?: { url?: string };
  high?: { url?: string };
  standard?: { url?: string };
  maxres?: { url?: string };
};

type YouTubeChannelItem = {
  id?: string;
  snippet?: {
    title?: string;
    thumbnails?: YouTubeThumbnailSet;
  };
  statistics?: {
    subscriberCount?: string;
    videoCount?: string;
  };
  contentDetails?: {
    relatedPlaylists?: {
      uploads?: string;
    };
  };
};

type YouTubeChannelListResponse = {
  items?: YouTubeChannelItem[];
};

type YouTubeSearchResponse = {
  items?: Array<{
    id?: {
      channelId?: string;
      videoId?: string;
    };
    snippet?: {
      liveBroadcastContent?: string;
    };
  }>;
};

type YouTubePlaylistItemsResponse = {
  items?: Array<{
    contentDetails?: {
      videoId?: string;
    };
    snippet?: {
      title?: string;
    };
  }>;
};

type YouTubeVideosResponse = {
  items?: Array<{
    id?: string;
    snippet?: {
      title?: string;
      publishedAt?: string;
      thumbnails?: YouTubeThumbnailSet;
    };
    statistics?: {
      viewCount?: string;
      likeCount?: string;
    };
    contentDetails?: {
      duration?: string;
    };
  }>;
};

type YouTubePlayerState = -1 | 0 | 1 | 2 | 3 | 5;

type YouTubePlayerInstance = {
  destroy: () => void;
  pauseVideo?: () => void;
  stopVideo?: () => void;
};

type YouTubePlayerNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onStateChange?: (event: { data: YouTubePlayerState }) => void;
      };
    }
  ) => YouTubePlayerInstance;
  PlayerState: {
    PLAYING: number;
  };
};

type WindowWithYouTube = Window & {
  YT?: YouTubePlayerNamespace;
  onYouTubeIframeAPIReady?: () => void;
};

const channelSeeds: ChannelSeed[] = [
  {
    id: 1,
    handle: "MinaAudrey",
    fallbackName: "Mina Audrey",
    url: "https://www.youtube.com/@MinaAudrey",
    color: "from-red-500 to-rose-500",
    fallbackEmoji: "🎤",
    videoMode: "streams",
  },
  {
    id: 2,
    handle: "jarujaruisland8111",
    fallbackName: "ジャルジャルアイランド",
    url: "https://www.youtube.com/@jarujaruisland8111",
    color: "from-cyan-500 to-sky-500",
    fallbackEmoji: "🤣",
    videoMode: "videos",
  },
  {
    id: 3,
    handle: "jarujarutower365",
    fallbackName: "ジャルジャルタワー",
    url: "https://www.youtube.com/@jarujarutower365",
    color: "from-purple-500 to-pink-500",
    fallbackEmoji: "🏙️",
    videoMode: "videos",
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

let youtubeIframeApiPromise: Promise<YouTubePlayerNamespace> | null = null;

function normalizeHandle(handle: string): string {
  return handle.replace(/^@/, "").trim();
}

function buildApiUrl(endpoint: string, params: Record<string, string | number>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    query.set(key, String(value));
  });
  return `${YOUTUBE_API_BASE}/${endpoint}?${query.toString()}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }
  return (await response.json()) as T;
}

function toNullableNumber(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function pickThumbnailUrl(thumbnails: YouTubeThumbnailSet | undefined): string {
  return (
    thumbnails?.high?.url ??
    thumbnails?.medium?.url ??
    thumbnails?.default?.url ??
    thumbnails?.standard?.url ??
    thumbnails?.maxres?.url ??
    ""
  );
}

function formatCount(value: number | null): string {
  if (value === null) return "-";
  return new Intl.NumberFormat("ja-JP", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatDuration(value: string): string {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(value);
  if (!match) return "--:--";

  const hours = Number(match[1] ?? "0");
  const minutes = Number(match[2] ?? "0");
  const seconds = Number(match[3] ?? "0");

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function fallbackProfile(seed: ChannelSeed): ChannelProfile {
  return {
    id: seed.id,
    handle: seed.handle,
    title: seed.fallbackName,
    url: seed.url,
    color: seed.color,
    fallbackEmoji: seed.fallbackEmoji,
    videoMode: seed.videoMode,
    channelId: "",
    uploadsPlaylistId: "",
    subscriberCount: null,
    videoCount: null,
    thumbnailUrl: "",
  };
}

async function fetchChannelProfile(seed: ChannelSeed, apiKey: string): Promise<ChannelProfile | null> {
  const handle = normalizeHandle(seed.handle);
  const byHandleUrl = buildApiUrl("channels", {
    part: "snippet,statistics,contentDetails",
    forHandle: handle,
    key: apiKey,
  });

  const byHandle = await fetchJson<YouTubeChannelListResponse>(byHandleUrl);
  let channelItem = byHandle.items?.[0];

  if (!channelItem) {
    const searchUrl = buildApiUrl("search", {
      part: "snippet",
      type: "channel",
      q: `@${handle}`,
      maxResults: 1,
      key: apiKey,
    });
    const searchResult = await fetchJson<YouTubeSearchResponse>(searchUrl);
    const channelIdFromSearch = searchResult.items?.[0]?.id?.channelId ?? "";
    if (!channelIdFromSearch) return null;

    const byIdUrl = buildApiUrl("channels", {
      part: "snippet,statistics,contentDetails",
      id: channelIdFromSearch,
      key: apiKey,
    });
    const byIdResult = await fetchJson<YouTubeChannelListResponse>(byIdUrl);
    channelItem = byIdResult.items?.[0];
  }

  if (!channelItem) return null;

  return {
    id: seed.id,
    handle,
    title: channelItem.snippet?.title ?? seed.fallbackName,
    url: seed.url,
    color: seed.color,
    fallbackEmoji: seed.fallbackEmoji,
    videoMode: seed.videoMode,
    channelId: channelItem.id ?? "",
    uploadsPlaylistId: channelItem.contentDetails?.relatedPlaylists?.uploads ?? "",
    subscriberCount: toNullableNumber(channelItem.statistics?.subscriberCount),
    videoCount: toNullableNumber(channelItem.statistics?.videoCount),
    thumbnailUrl: pickThumbnailUrl(channelItem.snippet?.thumbnails),
  };
}

async function fetchLatestStreamVideoIds(channelId: string, apiKey: string): Promise<string[]> {
  const url = buildApiUrl("search", {
    part: "snippet",
    channelId,
    type: "video",
    eventType: "completed",
    order: "date",
    maxResults: 5,
    key: apiKey,
  });
  const data = await fetchJson<YouTubeSearchResponse>(url);
  const uniqueIds = new Set<string>();
  for (const item of data.items ?? []) {
    const videoId = item.id?.videoId ?? "";
    if (!videoId) continue;
    uniqueIds.add(videoId);
  }
  return Array.from(uniqueIds).slice(0, 5);
}

async function fetchLatestUploadVideoIds(uploadsPlaylistId: string, apiKey: string): Promise<string[]> {
  if (!uploadsPlaylistId) return [];

  const url = buildApiUrl("playlistItems", {
    part: "contentDetails,snippet",
    playlistId: uploadsPlaylistId,
    maxResults: 10,
    key: apiKey,
  });
  const data = await fetchJson<YouTubePlaylistItemsResponse>(url);
  const uniqueIds = new Set<string>();

  for (const item of data.items ?? []) {
    const title = item.snippet?.title ?? "";
    if (title === "Private video" || title === "Deleted video") continue;
    const videoId = item.contentDetails?.videoId ?? "";
    if (!videoId) continue;
    uniqueIds.add(videoId);
    if (uniqueIds.size >= 5) break;
  }

  return Array.from(uniqueIds);
}

async function fetchLatestVideoIdsBySearch(channelId: string, apiKey: string): Promise<string[]> {
  const url = buildApiUrl("search", {
    part: "snippet",
    channelId,
    type: "video",
    order: "date",
    maxResults: 10,
    key: apiKey,
  });
  const data = await fetchJson<YouTubeSearchResponse>(url);

  const nonLive = (data.items ?? []).filter((item) => item.snippet?.liveBroadcastContent === "none");
  const source = nonLive.length >= 5 ? nonLive : (data.items ?? []);

  const uniqueIds = new Set<string>();
  for (const item of source) {
    const videoId = item.id?.videoId ?? "";
    if (!videoId) continue;
    uniqueIds.add(videoId);
    if (uniqueIds.size >= 5) break;
  }
  return Array.from(uniqueIds);
}

async function fetchVideoDetails(videoIds: string[], apiKey: string): Promise<ChannelVideo[]> {
  if (videoIds.length === 0) return [];

  const url = buildApiUrl("videos", {
    part: "snippet,statistics,contentDetails",
    id: videoIds.join(","),
    key: apiKey,
  });
  const data = await fetchJson<YouTubeVideosResponse>(url);

  const byId = new Map<string, NonNullable<YouTubeVideosResponse["items"]>[number]>();
  for (const item of data.items ?? []) {
    if (!item.id) continue;
    byId.set(item.id, item);
  }

  const ordered: ChannelVideo[] = [];
  for (const id of videoIds) {
    const item = byId.get(id);
    if (!item) continue;

    ordered.push({
      id,
      title: item.snippet?.title ?? "タイトルなし",
      durationIso: item.contentDetails?.duration ?? "",
      views: toNullableNumber(item.statistics?.viewCount),
      likes: toNullableNumber(item.statistics?.likeCount),
      thumbnailUrl: pickThumbnailUrl(item.snippet?.thumbnails),
      publishedAt: item.snippet?.publishedAt ?? "",
    });
  }

  return ordered;
}

async function fetchChannelVideos(channel: ChannelProfile, apiKey: string): Promise<ChannelVideo[]> {
  if (!channel.channelId) return [];

  let videoIds: string[] = [];

  if (channel.videoMode === "streams") {
    videoIds = await fetchLatestStreamVideoIds(channel.channelId, apiKey);
  } else {
    videoIds = await fetchLatestUploadVideoIds(channel.uploadsPlaylistId, apiKey);
    if (videoIds.length < 5) {
      const fallbackIds = await fetchLatestVideoIdsBySearch(channel.channelId, apiKey);
      if (fallbackIds.length > videoIds.length) {
        videoIds = fallbackIds;
      }
    }
  }

  return fetchVideoDetails(videoIds.slice(0, 5), apiKey);
}

function loadYouTubeIframeApi(): Promise<YouTubePlayerNamespace> {
  const win = window as WindowWithYouTube;
  if (win.YT?.Player) return Promise.resolve(win.YT);
  if (youtubeIframeApiPromise) return youtubeIframeApiPromise;

  youtubeIframeApiPromise = new Promise<YouTubePlayerNamespace>((resolve, reject) => {
    const existingHandler = win.onYouTubeIframeAPIReady;
    const timeoutId = window.setTimeout(() => {
      reject(new Error("YouTube iframe API load timeout"));
    }, 15000);

    win.onYouTubeIframeAPIReady = () => {
      existingHandler?.();
      if (win.YT?.Player) {
        window.clearTimeout(timeoutId);
        resolve(win.YT);
      }
    };

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        window.clearTimeout(timeoutId);
        reject(new Error("Failed to load YouTube iframe API"));
      };
      document.head.appendChild(script);
    }
  }).catch((error: unknown) => {
    youtubeIframeApiPromise = null;
    throw error;
  });

  return youtubeIframeApiPromise;
}

function ChannelVideoCarousel({
  channel,
  videos,
  isLoading,
}: {
  channel: ChannelProfile;
  videos: ChannelVideo[];
  isLoading: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const playerMountRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const playerRefs = useRef<Record<string, YouTubePlayerInstance>>({});
  const playingVideoIdRef = useRef<string | null>(null);

  const videosKey = useMemo(() => videos.map((video) => video.id).join(","), [videos]);

  const handlePlayingChange = useCallback((value: boolean) => {
    setIsPlaying(value);
  }, []);

  useEffect(() => {
    if (videos.length <= 1 || isPlaying) return;
    const timerId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % videos.length);
    }, AUTO_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timerId);
  }, [isPlaying, videos.length]);

  const resolvedActiveIndex = activeIndex < videos.length ? activeIndex : 0;
  const playingIndex = playingVideoId ? videos.findIndex((video) => video.id === playingVideoId) : -1;
  const displayIndex = playingIndex >= 0 ? playingIndex : resolvedActiveIndex;
  const activeVideo = videos[displayIndex] ?? null;

  useEffect(() => {
    let disposed = false;
    handlePlayingChange(false);
    setPlayingVideoId(null);
    playingVideoIdRef.current = null;

    const setupPlayers = async () => {
      Object.values(playerRefs.current).forEach((player) => {
        player.destroy();
      });
      playerRefs.current = {};

      if (videos.length === 0) return;

      const yt = await loadYouTubeIframeApi();
      if (disposed) return;

      for (const [index, video] of videos.entries()) {
        const mount = playerMountRefs.current[video.id];
        if (!mount) continue;

        playerRefs.current[video.id] = new yt.Player(mount, {
          videoId: video.id,
          playerVars: {
            rel: 0,
            playsinline: 1,
          },
          events: {
            onStateChange: (event) => {
              if (event.data === yt.PlayerState.PLAYING) {
                playingVideoIdRef.current = video.id;
                setPlayingVideoId(video.id);
                setActiveIndex(index);
                handlePlayingChange(true);
                return;
              }

              if (playingVideoIdRef.current === video.id) {
                playingVideoIdRef.current = null;
                setPlayingVideoId(null);
                handlePlayingChange(false);
              }
            },
          },
        });
      }
    };

    setupPlayers().catch(() => {
      handlePlayingChange(false);
      setPlayingVideoId(null);
      playingVideoIdRef.current = null;
    });

    return () => {
      disposed = true;
      handlePlayingChange(false);
      setPlayingVideoId(null);
      playingVideoIdRef.current = null;
      Object.values(playerRefs.current).forEach((player) => {
        player.destroy();
      });
      playerRefs.current = {};
    };
  }, [handlePlayingChange, videos, videosKey]);

  return (
    <Card className="bg-white border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100 overflow-hidden">
      <div className="aspect-video bg-slate-100 relative overflow-hidden">
        {videos.length > 0 ? (
          <motion.div
            className="flex h-full w-full"
            animate={{ x: `-${displayIndex * 100}%` }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            {videos.map((video) => (
              <div key={video.id} className="h-full w-full shrink-0 relative">
                <div
                  ref={(element) => {
                    if (element) {
                      playerMountRefs.current[video.id] = element;
                    } else {
                      delete playerMountRefs.current[video.id];
                    }
                  }}
                  className="h-full w-full"
                />
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  {formatDuration(video.durationIso)}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
            {isLoading ? "動画を取得中..." : "動画が見つかりません"}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <p className="text-xs text-slate-400 mb-2">{channel.title}</p>
        <h3 className="font-medium text-slate-700 line-clamp-2 mb-2 min-h-[3.2rem]">
          {activeVideo?.title ?? "動画の取得待機中"}
        </h3>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {formatCount(activeVideo?.views ?? null)}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            {formatCount(activeVideo?.likes ?? null)}
          </span>
        </div>

        {videos.length > 1 && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {videos.map((video, index) => (
                <button
                  key={video.id}
                  type="button"
                  aria-label={`${channel.title} ${index + 1}件目`}
                  onClick={() => {
                    if (isPlaying) return;
                    setActiveIndex(index);
                  }}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === displayIndex ? "bg-cyan-500" : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-400 whitespace-nowrap">
              {isPlaying ? "再生中: スライド停止" : "自動スライド中"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function YouTubePage() {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY?.trim() ?? "";

  const [channels, setChannels] = useState<ChannelProfile[]>(() => channelSeeds.map((seed) => fallbackProfile(seed)));
  const [videosByHandle, setVideosByHandle] = useState<Record<string, ChannelVideo[]>>(() =>
    Object.fromEntries(channelSeeds.map((seed) => [normalizeHandle(seed.handle), []]))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;

    const loadData = async () => {
      setIsLoading(true);
      setApiError(null);

      if (!apiKey) {
        setChannels(channelSeeds.map((seed) => fallbackProfile(seed)));
        setVideosByHandle(Object.fromEntries(channelSeeds.map((seed) => [normalizeHandle(seed.handle), []])));
        setApiError("YouTube APIキーが未設定です。.env.local に VITE_YOUTUBE_API_KEY を追加してください。");
        setIsLoading(false);
        return;
      }

      try {
        const fetchedProfiles = await Promise.all(
          channelSeeds.map(async (seed) => {
            try {
              return await fetchChannelProfile(seed, apiKey);
            } catch {
              return null;
            }
          })
        );

        const resolvedProfiles = channelSeeds.map((seed, index) => fetchedProfiles[index] ?? fallbackProfile(seed));

        const fetchedVideos = await Promise.all(
          resolvedProfiles.map(async (channel) => {
            try {
              return await fetchChannelVideos(channel, apiKey);
            } catch {
              return [];
            }
          })
        );

        if (disposed) return;

        const nextVideosByHandle: Record<string, ChannelVideo[]> = {};
        resolvedProfiles.forEach((channel, index) => {
          nextVideosByHandle[normalizeHandle(channel.handle)] = fetchedVideos[index] ?? [];
        });

        setChannels(resolvedProfiles);
        setVideosByHandle(nextVideosByHandle);
      } catch {
        if (disposed) return;
        setApiError("YouTubeデータの取得に失敗しました。時間を置いて再読み込みしてください。");
      } finally {
        if (!disposed) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      disposed = true;
    };
  }, [apiKey]);
  
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
            {apiError && (
              <p className="text-sm text-rose-500 mt-4">{apiError}</p>
            )}
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
              {channels.map((channel) => (
                <motion.div
                  key={channel.id}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-white border-slate-200 hover:border-red-300 transition-all duration-300 hover:shadow-xl hover:shadow-red-100 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-lg bg-slate-100">
                          {channel.thumbnailUrl ? (
                            <img
                              src={channel.thumbnailUrl}
                              alt={channel.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${channel.color} flex items-center justify-center text-4xl`}>
                              {channel.fallbackEmoji}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-slate-700 group-hover:text-red-500 transition-colors">
                              {channel.title}
                            </h3>
                            <Badge className="bg-red-500 text-white">
                              <Youtube className="w-3 h-3 mr-1" />
                              YouTube
                            </Badge>
                          </div>
                          <p className="text-slate-500 text-sm mb-3">
                            @{normalizeHandle(channel.handle)}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {channel.subscriberCount !== null ? `${formatCount(channel.subscriberCount)} 登録者` : "登録者 -"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Play className="w-4 h-4" />
                              {channel.videoCount !== null ? `${formatCount(channel.videoCount)} 本の動画` : "動画数 -"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <a href={channel.url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="w-full bg-red-500 hover:bg-red-600 text-white">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            チャンネルを見る
                          </Button>
                        </a>
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
              チャンネル別の最新動画
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {channels.map((channel) => (
                <motion.div key={channel.id} variants={itemVariants}>
                  <ChannelVideoCarousel
                    channel={channel}
                    videos={videosByHandle[normalizeHandle(channel.handle)] ?? []}
                    isLoading={isLoading}
                  />
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

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from "framer-motion";
import { Package, ExternalLink, Play, ChevronLeft, Gamepad2, Wrench, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Footer } from "@/sections/Footer";
import "@/index.css";

type GameWork = {
  id: number;
  title: string;
  description: string;
  category: string;
  rating: number;
  price: number;
  image: string;
  tags: string[];
  color: string;
  boothUrl: string;
  trailerUrls: string[];
  screenshots: string[];
  inDevelopment: boolean;
};

type ToolLikeWork = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  icon: string;
  features: string[];
  color: string;
  boothUrl: string;
  trailerUrls: string[];
  screenshots: string[];
  isNew: boolean;
  inDevelopment: boolean;
};

type WorksData = {
  games: GameWork[];
  tools: ToolLikeWork[];
  modelAssets: ToolLikeWork[];
  blenderAddons: ToolLikeWork[];
};

const EMPTY_DATA: WorksData = {
  games: [],
  tools: [],
  modelAssets: [],
  blenderAddons: [],
};

type SortType = 'default' | 'price-asc' | 'price-desc';

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

const IMAGE_PATTERN = /\.(png|jpe?g|webp|gif|bmp|svg|avif)(\?.*)?$/i;

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return fallback;
}

function toString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return [] as string[];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function toBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function toTrailerUrls(item: Record<string, unknown>) {
  const urls = toStringArray(item.trailerUrls);
  if (urls.length > 0) return urls;

  const single = toString(item.trailerUrl);
  if (!single) return [] as string[];
  return [single];
}

function normalizeGame(item: unknown): GameWork | null {
  if (typeof item !== "object" || item === null) return null;
  const row = item as Record<string, unknown>;
  const id = toNumber(row.id);
  if (id <= 0) return null;

  return {
    id,
    title: toString(row.title),
    description: toString(row.description),
    category: toString(row.category),
    rating: toNumber(row.rating),
    price: toNumber(row.price),
    image: toString(row.image),
    tags: toStringArray(row.tags),
    color: toString(row.color, "from-cyan-400 to-blue-400"),
    boothUrl: toString(row.boothUrl, "https://booth.pm/"),
    trailerUrls: toTrailerUrls(row),
    screenshots: toStringArray(row.screenshots),
    inDevelopment: toBoolean(row.inDevelopment),
  };
}

function normalizeToolLike(item: unknown): ToolLikeWork | null {
  if (typeof item !== "object" || item === null) return null;
  const row = item as Record<string, unknown>;
  const id = toNumber(row.id);
  if (id <= 0) return null;

  return {
    id,
    title: toString(row.title),
    description: toString(row.description),
    category: toString(row.category),
    price: toNumber(row.price),
    icon: toString(row.icon),
    features: toStringArray(row.features),
    color: toString(row.color, "from-cyan-400 to-blue-400"),
    boothUrl: toString(row.boothUrl, "https://booth.pm/"),
    trailerUrls: toTrailerUrls(row),
    screenshots: toStringArray(row.screenshots),
    isNew: toBoolean(row.isNew),
    inDevelopment: toBoolean(row.inDevelopment),
  };
}

function normalizeWorksData(data: unknown): WorksData {
  if (typeof data !== "object" || data === null) return EMPTY_DATA;
  const row = data as Record<string, unknown>;

  return {
    games: Array.isArray(row.games) ? row.games.map(normalizeGame).filter((item): item is GameWork => item !== null) : [],
    tools: Array.isArray(row.tools) ? row.tools.map(normalizeToolLike).filter((item): item is ToolLikeWork => item !== null) : [],
    modelAssets: Array.isArray(row.modelAssets) ? row.modelAssets.map(normalizeToolLike).filter((item): item is ToolLikeWork => item !== null) : [],
    blenderAddons: Array.isArray(row.blenderAddons) ? row.blenderAddons.map(normalizeToolLike).filter((item): item is ToolLikeWork => item !== null) : [],
  };
}

function resolveMediaSrc(baseUrl: string, value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return `${baseUrl}${value.replace(/^\/+/, "")}`;
}

function isImageValue(value: string) {
  if (/^https?:\/\//i.test(value)) return IMAGE_PATTERN.test(value);
  return IMAGE_PATTERN.test(value);
}

type DetailWork = GameWork | ToolLikeWork;

function WorkDetailDialog({
  isOpen,
  onClose,
  work,
  type,
  baseUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  work: DetailWork | null;
  type: 'game' | 'tool';
  baseUrl: string;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!work) return null;

  const trailerUrls = work.trailerUrls ?? [];
  const screenshots = work.screenshots ?? [];
  const isInDevelopment = work.inDevelopment;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${work.color} flex items-center justify-center text-2xl`}>
              {type === 'game' ? (work as GameWork).image : (work as ToolLikeWork).icon}
            </div>
            <div>
              <DialogTitle className="text-2xl">{work.title}</DialogTitle>
              <DialogDescription>{work.category}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="media">メディア</TabsTrigger>
            <TabsTrigger value="download">ダウンロード</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <p className="text-slate-600 leading-relaxed">{work.description}</p>

            {type === 'game' && (
              <div className="flex flex-wrap gap-2">
                {(work as GameWork).tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-cyan-200 text-cyan-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {type === 'tool' && (
              <div className="space-y-2">
                <h4 className="font-medium text-slate-700">主な機能</h4>
                {(work as ToolLikeWork).features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    {feature}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t">
              <span className="font-bold text-cyan-600 text-base">
                {work.price === 0 ? "無料" : `¥${work.price.toLocaleString()}`}
              </span>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            {trailerUrls.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700">YouTube動画</h4>
                <div className="space-y-4">
                  {trailerUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                      <iframe
                        src={url}
                        title={`${work.title} Trailer ${index + 1}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {screenshots.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-slate-700">スクリーンショット</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {screenshots.map((shot, index) => (
                    <div key={`${shot}-${index}`} className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {isImageValue(shot) ? (
                        <img
                          src={resolveMediaSrc(baseUrl, shot)}
                          alt={`${work.title} screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">{shot}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {trailerUrls.length === 0 && screenshots.length === 0 && (
              <p className="text-sm text-slate-400">メディアが登録されていません。</p>
            )}
          </TabsContent>

          <TabsContent value="download" className="space-y-4">
            <div className="bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-200 rounded-lg p-6 text-center">
              {isInDevelopment ? (
                <>
                  <h4 className="text-lg font-bold text-slate-700 mb-2">{work.title}</h4>
                  <p className="text-slate-500">開発中です</p>
                </>
              ) : (
                <>
                  <h4 className="text-lg font-bold text-slate-700 mb-2">
                    {work.title} をダウンロード
                  </h4>
                  <p className="text-slate-500 mb-4">
                    BOOTHにて配布しています。下のボタンからダウンロードページへ移動できます。
                  </p>
                  <a href={work.boothUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      BOOTHでダウンロード
                    </Button>
                  </a>
                </>
              )}
            </div>
            {!isInDevelopment && (
              <p className="text-xs text-slate-400 text-center">
                ※BOOTHのアカウントが必要な場合があります
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function EmptyProductsState() {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-cyan-200 bg-white/70 text-slate-500">
      商品がありません
    </div>
  );
}

function WorksPage() {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const [worksData, setWorksData] = useState<WorksData>(EMPTY_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedGame, setSelectedGame] = useState<GameWork | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolLikeWork | null>(null);
  const [selectedModelAsset, setSelectedModelAsset] = useState<ToolLikeWork | null>(null);
  const [selectedBlenderAddon, setSelectedBlenderAddon] = useState<ToolLikeWork | null>(null);

  const [gameSort, setGameSort] = useState<SortType>('default');
  const [assetSort, setAssetSort] = useState<SortType>('default');

  useEffect(() => {
    let mounted = true;

    const loadWorksData = async () => {
      try {
        const response = await fetch(`${baseUrl}works-data.json`);
        if (!response.ok) throw new Error("Failed to load works data");
        const data = await response.json();
        if (!mounted) return;
        setWorksData(normalizeWorksData(data));
      } catch {
        if (!mounted) return;
        setWorksData(EMPTY_DATA);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    loadWorksData();

    return () => {
      mounted = false;
    };
  }, [baseUrl]);

  const sortGames = (items: GameWork[]) => {
    switch (gameSort) {
      case 'price-asc':
        return [...items].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...items].sort((a, b) => b.price - a.price);
      default:
        return items;
    }
  };

  const sortToolLikeWorks = (items: ToolLikeWork[]) => {
    switch (assetSort) {
      case 'price-asc':
        return [...items].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...items].sort((a, b) => b.price - a.price);
      default:
        return items;
    }
  };

  const renderAssetSortButtons = () => (
    <div className="flex justify-end mb-4">
      <div className="flex gap-2">
        <Button
          variant={assetSort === 'price-asc' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setAssetSort(assetSort === 'price-asc' ? 'default' : 'price-asc')}
          className={assetSort === 'price-asc' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
        >
          <ArrowUpDown className="w-4 h-4 mr-1" />
          安い順
        </Button>
        <Button
          variant={assetSort === 'price-desc' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setAssetSort(assetSort === 'price-desc' ? 'default' : 'price-desc')}
          className={assetSort === 'price-desc' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
        >
          <ArrowUpDown className="w-4 h-4 mr-1" />
          高い順
        </Button>
      </div>
    </div>
  );

  const renderToolLikeGrid = (items: ToolLikeWork[], onSelect: (item: ToolLikeWork) => void) => (
    (() => {
      const sortedItems = sortToolLikeWorks(items);
      if (sortedItems.length === 0) return <EmptyProductsState />;

      return (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedItems.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Card
                className="group bg-white border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100 h-full flex flex-col cursor-pointer"
                onClick={() => onSelect(item)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl shadow-lg`}>
                      {item.icon}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {item.isNew && (
                        <Badge className="bg-cyan-500 text-white">
                          NEW
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-slate-200 text-slate-500">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-slate-700 group-hover:text-cyan-600 transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-slate-500">{item.description}</CardDescription>
                </CardHeader>

                <CardContent className="pb-3 flex-grow">
                  <div className="space-y-2">
                    {item.features.slice(0, 3).map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                  <span className="text-sm font-bold text-cyan-600">
                    {item.price === 0 ? "無料" : `¥${item.price.toLocaleString()}`}
                  </span>
                  <Button size="sm" className="bg-cyan-100 text-cyan-600 hover:bg-cyan-500 hover:text-white transition-all">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    詳細
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      );
    })()
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white via-cyan-50/30 to-white flex-1">
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
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 border border-cyan-200 mb-6">
              <Package className="w-4 h-4 text-cyan-500" />
              <span className="text-sm text-cyan-600 font-medium">SHOP</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              <span className="text-slate-700">BOOTH</span>
              <span className="text-gradient ml-2">SHOP</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              制作したゲームやツールをBOOTHにて販売しています。
              各作品の詳細ページでトレーラーやスクリーンショットをご覧いただけます。
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center text-slate-500 py-12">読み込み中...</div>
          ) : (
            <Tabs defaultValue="games" className="w-full">
              <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 mb-8">
                <TabsTrigger value="games" className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  ゲーム
                </TabsTrigger>
                <TabsTrigger value="tools" className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  ツール
                </TabsTrigger>
                <TabsTrigger value="model-assets" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Package className="w-4 h-4" />
                  <span className="hidden md:inline">3Dアセット</span>
                  <span className="md:hidden">3D Asset</span>
                </TabsTrigger>
                <TabsTrigger value="blender-addons" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Wrench className="w-4 h-4" />
                  <span className="hidden md:inline">Blenderアドオン</span>
                  <span className="md:hidden">Addon</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="games">
                {worksData.games.length === 0 ? (
                  <EmptyProductsState />
                ) : (
                  <>
                    <div className="flex justify-end mb-4">
                      <div className="flex gap-2">
                        <Button
                          variant={gameSort === 'price-asc' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setGameSort(gameSort === 'price-asc' ? 'default' : 'price-asc')}
                          className={gameSort === 'price-asc' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
                        >
                          <ArrowUpDown className="w-4 h-4 mr-1" />
                          安い順
                        </Button>
                        <Button
                          variant={gameSort === 'price-desc' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setGameSort(gameSort === 'price-desc' ? 'default' : 'price-desc')}
                          className={gameSort === 'price-desc' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
                        >
                          <ArrowUpDown className="w-4 h-4 mr-1" />
                          高い順
                        </Button>
                      </div>
                    </div>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {sortGames(worksData.games).map((game) => (
                        <motion.div key={game.id} variants={itemVariants}>
                          <Card
                            className="group bg-white border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100 overflow-hidden cursor-pointer h-full flex flex-col"
                            onClick={() => setSelectedGame(game)}
                          >
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
                              {game.trailerUrls.length > 0 && (
                                <div className="absolute bottom-3 left-3">
                                  <Badge className="bg-red-500/90 text-white backdrop-blur-sm">
                                    <Play className="w-3 h-3 mr-1" />
                                    動画あり
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <CardHeader className="pb-3">
                              <CardTitle className="text-xl text-slate-700 group-hover:text-cyan-600 transition-colors">
                                {game.title}
                              </CardTitle>
                              <CardDescription className="line-clamp-2 text-slate-500">
                                {game.description}
                              </CardDescription>
                            </CardHeader>

                            <CardContent className="pb-3 flex-grow">
                              <div className="flex flex-wrap gap-2">
                                {game.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs border-cyan-200 text-cyan-600">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>

                            <CardFooter className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                              <span className="text-sm font-bold text-cyan-600">
                                {game.price === 0 ? "無料" : `¥${game.price.toLocaleString()}`}
                              </span>
                              <Button size="sm" className="bg-cyan-100 text-cyan-600 hover:bg-cyan-500 hover:text-white transition-all">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                詳細
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="tools">
                {worksData.tools.length > 0 && renderAssetSortButtons()}
                {renderToolLikeGrid(worksData.tools, setSelectedTool)}
              </TabsContent>

              <TabsContent value="model-assets">
                {worksData.modelAssets.length > 0 && renderAssetSortButtons()}
                {renderToolLikeGrid(worksData.modelAssets, setSelectedModelAsset)}
              </TabsContent>

              <TabsContent value="blender-addons">
                {worksData.blenderAddons.length > 0 && renderAssetSortButtons()}
                {renderToolLikeGrid(worksData.blenderAddons, setSelectedBlenderAddon)}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      <WorkDetailDialog
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
        work={selectedGame}
        type="game"
        baseUrl={baseUrl}
      />
      <WorkDetailDialog
        isOpen={!!selectedTool}
        onClose={() => setSelectedTool(null)}
        work={selectedTool}
        type="tool"
        baseUrl={baseUrl}
      />
      <WorkDetailDialog
        isOpen={!!selectedModelAsset}
        onClose={() => setSelectedModelAsset(null)}
        work={selectedModelAsset}
        type="tool"
        baseUrl={baseUrl}
      />
      <WorkDetailDialog
        isOpen={!!selectedBlenderAddon}
        onClose={() => setSelectedBlenderAddon(null)}
        work={selectedBlenderAddon}
        type="tool"
        baseUrl={baseUrl}
      />

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WorksPage />
  </React.StrictMode>,
)

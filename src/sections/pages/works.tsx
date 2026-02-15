import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { motion, AnimatePresence } from "framer-motion";
import { Package, ExternalLink, Play, X, ChevronLeft, Gamepad2, Wrench, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Footer } from "@/sections/Footer";
import "@/index.css";

// ゲームデータ
const games = [
  {
    id: 1,
    title: "Pixel Adventure",
    description: "レトロ風ピクセルアートの2Dアクションゲーム。様々なステージを冒険しよう！",
    category: "Action",
    rating: 4.8,
    price: 500,
    image: "🎮",
    tags: ["2D", "Pixel Art", "Platformer"],
    color: "from-purple-400 to-pink-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    screenshots: ["🎮", "🏃", "⭐"],
  },
  {
    id: 2,
    title: "Space Shooter X",
    description: "宇宙を舞台にしたシューティングゲーム。迫りくる敵を撃ち落とせ！",
    category: "Shooter",
    rating: 4.6,
    price: 300,
    image: "🚀",
    tags: ["Shooting", "Space", "Bullet Hell"],
    color: "from-cyan-400 to-blue-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["🚀", "💥", "🌌"],
  },
  {
    id: 3,
    title: "Puzzle Master",
    description: "脳を鍛えるパズルゲーム集。論理的思考で難問を解き明かせ！",
    category: "Puzzle",
    rating: 4.9,
    price: 0,
    image: "🧩",
    tags: ["Puzzle", "Logic", "Brain Training"],
    color: "from-emerald-400 to-teal-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    screenshots: ["🧩", "🤔", "💡"],
  },
  {
    id: 4,
    title: "RPG Quest",
    description: "ファンタジー世界を舞台にした王道RPG。勇者となって世界を救え！",
    category: "RPG",
    rating: 4.7,
    price: 800,
    image: "⚔️",
    tags: ["RPG", "Fantasy", "Story"],
    color: "from-amber-400 to-orange-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["⚔️", "🛡️", "🏰"],
  },
  {
    id: 5,
    title: "Rhythm Beat",
    description: "音楽に合わせてリズムを刻む音ゲー。豊富な楽曲で遊ぼう！",
    category: "Rhythm",
    rating: 4.5,
    price: 600,
    image: "🎵",
    tags: ["Rhythm", "Music", "Casual"],
    color: "from-rose-400 to-red-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    screenshots: ["🎵", "🎹", "🎤"],
  },
  {
    id: 6,
    title: "Tower Defense",
    description: "戦略的なタワーディフェンスゲーム。敵の侵攻を防ぎきれ！",
    category: "Strategy",
    rating: 4.4,
    price: 400,
    image: "🏰",
    tags: ["Strategy", "Tower Defense", "Tactical"],
    color: "from-indigo-400 to-violet-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["🏰", "⚔️", "🛡️"],
  },
];

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
  trailerUrl: string | null;
  screenshots: string[];
  isNew: boolean;
};

// ツールデータ
const tools: ToolLikeWork[] = [
  {
    id: 1,
    title: "Image Converter",
    description: "様々な画像フォーマットを簡単に変換できるツール。バッチ処理にも対応。",
    category: "Utility",
    price: 0,
    icon: "🖼️",
    features: ["Batch Convert", "20+ Formats", "Resize"],
    color: "from-emerald-400 to-teal-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["🖼️", "🔄", "✨"],
    isNew: false,
  },
  {
    id: 2,
    title: "Text Editor Pro",
    description: "シンプルかつ高機能なテキストエディタ。プログラミングにも最適。",
    category: "Productivity",
    price: 500,
    icon: "📝",
    features: ["Syntax Highlight", "Auto Save", "Plugins"],
    color: "from-blue-400 to-indigo-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    screenshots: ["📝", "💻", "⚡"],
    isNew: true,
  },
  {
    id: 3,
    title: "File Organizer",
    description: "ファイルを自動で整理・分類してくれる便利ツール。",
    category: "Utility",
    price: 300,
    icon: "📁",
    features: ["Auto Sort", "Duplicate Detection", "Rules"],
    color: "from-amber-400 to-yellow-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["📁", "📂", "🗂️"],
    isNew: false,
  },
  {
    id: 4,
    title: "Color Picker",
    description: "画面から色を抽出し、パレットを作成できるデザイナー向けツール。",
    category: "Design",
    price: 0,
    icon: "🎨",
    features: ["Screen Pick", "Palette Export", "Harmony"],
    color: "from-pink-400 to-rose-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["🎨", "🖌️", "🌈"],
    isNew: false,
  },
  {
    id: 5,
    title: "Password Manager",
    description: "安全にパスワードを管理できるローカル型パスワードマネージャー。",
    category: "Security",
    price: 800,
    icon: "🔐",
    features: ["Encryption", "Generator", "Auto Fill"],
    color: "from-violet-400 to-purple-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["🔐", "🔑", "🛡️"],
    isNew: true,
  },
  {
    id: 6,
    title: "System Monitor",
    description: "PCのパフォーマンスをリアルタイムで監視できるツール。",
    category: "System",
    price: 200,
    icon: "📊",
    features: ["CPU/GPU/RAM", "Temperature", "Alerts"],
    color: "from-cyan-400 to-sky-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["📊", "📈", "💻"],
    isNew: false,
  },
];

// 3Dモデルデータ
const modelAssets: ToolLikeWork[] = [
  {
    id: 1,
    title: "Stylized Tree Pack",
    description: "ローポリで扱いやすい樹木アセット集。ゲーム背景やシーン制作に最適。",
    category: "Environment",
    price: 700,
    icon: "🌲",
    features: ["FBX/GLB同梱", "PBRテクスチャ", "LOD対応"],
    color: "from-green-400 to-emerald-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["🌲", "🏞️", "🌿"],
    isNew: true,
  },
  {
    id: 2,
    title: "Sci-Fi Crate Set",
    description: "SFマップに使えるコンテナ・小物モデルセット。軽量で組み合わせやすい構成。",
    category: "Props",
    price: 500,
    icon: "📦",
    features: ["Modular", "Game Ready", "UV展開済み"],
    color: "from-cyan-400 to-blue-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["📦", "🤖", "🛰️"],
    isNew: false,
  },
  {
    id: 3,
    title: "Anime Room Kit",
    description: "室内シーンを素早く作れる家具・小物の3Dモデルキット。",
    category: "Interior",
    price: 900,
    icon: "🛋️",
    features: ["Blender対応", "Unity対応", "Texture付き"],
    color: "from-rose-400 to-pink-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["🛋️", "🪟", "💡"],
    isNew: false,
  },
];

// Blenderアドオンデータ
const blenderAddons: ToolLikeWork[] = [
  {
    id: 1,
    title: "Quick Retopo Assist",
    description: "リトポロジー作業を効率化する補助アドオン。面貼りやスナップ操作を高速化。",
    category: "Modeling",
    price: 1200,
    icon: "🧊",
    features: ["ショートカット強化", "スナップ補助", "UI最適化"],
    color: "from-indigo-400 to-violet-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["🧊", "🛠️", "⚡"],
    isNew: true,
  },
  {
    id: 2,
    title: "Auto Rig Helper",
    description: "ボーンセットアップと命名を半自動化し、リギング初期工程を短縮。",
    category: "Rigging",
    price: 1500,
    icon: "🦴",
    features: ["自動命名", "ミラー対応", "テンプレート保存"],
    color: "from-amber-400 to-orange-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["🦴", "🤖", "🎛️"],
    isNew: false,
  },
  {
    id: 3,
    title: "Batch Export Wizard",
    description: "複数オブジェクトを一括エクスポート。ゲーム向け書き出し設定をプリセット化。",
    category: "Pipeline",
    price: 800,
    icon: "📤",
    features: ["FBX/GLTF対応", "命名ルール", "一括処理"],
    color: "from-teal-400 to-cyan-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["📤", "📁", "✅"],
    isNew: false,
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

// 作品詳細ダイアログコンポーネント
function WorkDetailDialog({ 
  isOpen, 
  onClose, 
  work, 
  type 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  work: any; 
  type: 'game' | 'tool';
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!work) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${work.color} flex items-center justify-center text-2xl`}>
              {type === 'game' ? work.image : work.icon}
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
                {work.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="border-cyan-200 text-cyan-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {type === 'tool' && (
              <div className="space-y-2">
                <h4 className="font-medium text-slate-700">主な機能</h4>
                {work.features.map((feature: string) => (
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
              {work.rating && <span>評価: ★ {work.rating}</span>}
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            {/* トレーラー動画 */}
            {work.trailerUrl && (
              <div className="space-y-2">
                <h4 className="font-medium text-slate-700">トレーラー</h4>
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                  <iframe
                    src={work.trailerUrl}
                    title={`${work.title} Trailer`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* スクリーンショット */}
            <div className="space-y-2">
              <h4 className="font-medium text-slate-700">スクリーンショット</h4>
              <div className="grid grid-cols-3 gap-3">
                {work.screenshots.map((screenshot: string, index: number) => (
                  <div 
                    key={index}
                    className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-4xl"
                  >
                    {screenshot}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400">
                ※実際のスクリーンショット画像に差し替えてください
              </p>
            </div>
          </TabsContent>

          <TabsContent value="download" className="space-y-4">
            <div className="bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-200 rounded-lg p-6 text-center">
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
            </div>
            <p className="text-xs text-slate-400 text-center">
              ※BOOTHのアカウントが必要な場合があります
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

type SortType = 'default' | 'price-asc' | 'price-desc';

function WorksPage() {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const [selectedGame, setSelectedGame] = useState<typeof games[0] | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolLikeWork | null>(null);
  const [selectedModelAsset, setSelectedModelAsset] = useState<ToolLikeWork | null>(null);
  const [selectedBlenderAddon, setSelectedBlenderAddon] = useState<ToolLikeWork | null>(null);
  const [gameSort, setGameSort] = useState<SortType>('default');
  const [assetSort, setAssetSort] = useState<SortType>('default');

  const sortGames = (games: typeof games) => {
    switch (gameSort) {
      case 'price-asc':
        return [...games].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...games].sort((a, b) => b.price - a.price);
      default:
        return games;
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {sortToolLikeWorks(items).map((item) => (
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
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 border border-cyan-200 mb-6">
              <Package className="w-4 h-4 text-cyan-500" />
              <span className="text-sm text-cyan-600 font-medium">SHOP</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              <span className="text-slate-700">BOOTH</span>
              <span className="text-gradient">SHOP</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              制作したゲームやツールをBOOTHにて販売しています。
              各作品の詳細ページでトレーラーやスクリーンショットをご覧いただけます。
            </p>
          </motion.div>

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

            {/* ゲームタブ */}
            <TabsContent value="games">
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
                {sortGames(games).map((game) => (
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
                        {game.trailerUrl && (
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
            </TabsContent>

            {/* ツールタブ */}
            <TabsContent value="tools">
              {renderAssetSortButtons()}
              {renderToolLikeGrid(tools, setSelectedTool)}
            </TabsContent>

            {/* 3Dモデルタブ */}
            <TabsContent value="model-assets">
              {renderAssetSortButtons()}
              {renderToolLikeGrid(modelAssets, setSelectedModelAsset)}
            </TabsContent>

            {/* Blenderアドオンタブ */}
            <TabsContent value="blender-addons">
              {renderAssetSortButtons()}
              {renderToolLikeGrid(blenderAddons, setSelectedBlenderAddon)}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* 作品詳細ダイアログ */}
      <WorkDetailDialog 
        isOpen={!!selectedGame} 
        onClose={() => setSelectedGame(null)} 
        work={selectedGame} 
        type="game"
      />
      <WorkDetailDialog 
        isOpen={!!selectedTool} 
        onClose={() => setSelectedTool(null)} 
        work={selectedTool} 
        type="tool"
      />
      <WorkDetailDialog 
        isOpen={!!selectedModelAsset} 
        onClose={() => setSelectedModelAsset(null)} 
        work={selectedModelAsset} 
        type="tool"
      />
      <WorkDetailDialog 
        isOpen={!!selectedBlenderAddon} 
        onClose={() => setSelectedBlenderAddon(null)} 
        work={selectedBlenderAddon} 
        type="tool"
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

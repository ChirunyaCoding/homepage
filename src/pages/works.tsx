import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { motion, AnimatePresence } from "framer-motion";
import { Package, ExternalLink, Play, X, ChevronLeft, Gamepad2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
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
    downloads: 1250,
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
    downloads: 890,
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
    downloads: 2100,
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
    downloads: 1560,
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
    downloads: 720,
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
    downloads: 980,
    image: "🏰",
    tags: ["Strategy", "Tower Defense", "Tactical"],
    color: "from-indigo-400 to-violet-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["🏰", "⚔️", "🛡️"],
  },
];

// ツールデータ
const tools = [
  {
    id: 1,
    title: "Image Converter",
    description: "様々な画像フォーマットを簡単に変換できるツール。バッチ処理にも対応。",
    category: "Utility",
    downloads: 3200,
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
    downloads: 1850,
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
    downloads: 980,
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
    downloads: 2450,
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
    downloads: 1120,
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
    downloads: 780,
    icon: "📊",
    features: ["CPU/GPU/RAM", "Temperature", "Alerts"],
    color: "from-cyan-400 to-sky-400",
    boothUrl: "https://booth.pm/",
    trailerUrl: null,
    screenshots: ["📊", "📈", "💻"],
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-0 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-0 data-[state=closed]:duration-200">
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
              <span>ダウンロード数: {work.downloads.toLocaleString()}</span>
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

function WorksPage() {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const [selectedGame, setSelectedGame] = useState<typeof games[0] | null>(null);
  const [selectedTool, setSelectedTool] = useState<typeof tools[0] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white via-cyan-50/30 to-white">
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
              <span className="text-sm text-cyan-600 font-medium">Works</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              <span className="text-slate-700">配布</span>
              <span className="text-gradient">作品</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              制作したゲームやツールをBOOTHにて配布しています。
              各作品の詳細ページでトレーラーやスクリーンショットをご覧いただけます。
            </p>
          </motion.div>

          <Tabs defaultValue="games" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="games" className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                ゲーム
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                ツール
              </TabsTrigger>
            </TabsList>

            {/* ゲームタブ */}
            <TabsContent value="games">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {games.map((game) => (
                  <motion.div key={game.id} variants={itemVariants}>
                    <Card 
                      className="group bg-white border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100 overflow-hidden cursor-pointer"
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

                      <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-2">
                          {game.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-cyan-200 text-cyan-600">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-sm text-slate-500">
                          DL: {game.downloads.toLocaleString()}
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
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {tools.map((tool) => (
                  <motion.div key={tool.id} variants={itemVariants}>
                    <Card 
                      className="group bg-white border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100 h-full flex flex-col cursor-pointer"
                      onClick={() => setSelectedTool(tool)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-3xl shadow-lg`}>
                            {tool.icon}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {tool.isNew && (
                              <Badge className="bg-cyan-500 text-white">
                                NEW
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-slate-200 text-slate-500">
                              {tool.category}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl text-slate-700 group-hover:text-cyan-600 transition-colors">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="text-slate-500">{tool.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="pb-3 flex-grow">
                        <div className="space-y-2">
                          {tool.features.slice(0, 3).map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-sm text-slate-500">
                          DL: {tool.downloads.toLocaleString()}
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

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WorksPage />
  </React.StrictMode>,
)

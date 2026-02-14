import React from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from "framer-motion";
import { Wrench, Download, ExternalLink, Zap, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/sections/Footer";
import "@/index.css";

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

function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <a href="/">
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
              <Wrench className="w-4 h-4 text-cyan-500" />
              <span className="text-sm text-cyan-600 font-medium">Tools</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              <span className="text-slate-700">制作</span>
              <span className="text-gradient">ツール</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              日常の作業を効率化するツールを制作・配布しています。
              すべて無料でご利用いただけます。
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {tools.map((tool) => (
              <motion.div key={tool.id} variants={itemVariants}>
                <Card className="group bg-white border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100 h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-3xl shadow-lg`}>
                        {tool.icon}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {tool.isNew && (
                          <Badge className="bg-cyan-500 text-white">
                            <Zap className="w-3 h-3 mr-1" />
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
                      {tool.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                          <Check className="w-4 h-4 text-cyan-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Download className="w-4 h-4 text-cyan-500" />
                      <span>{tool.downloads.toLocaleString()}</span>
                    </div>
                    <Button size="sm" className="bg-cyan-100 text-cyan-600 hover:bg-cyan-500 hover:text-white transition-all">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      ダウンロード
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToolsPage />
  </React.StrictMode>,
)

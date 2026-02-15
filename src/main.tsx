import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from "framer-motion";
import { Sparkles, Youtube, Twitter, Github, Gamepad2, Wrench, ChevronRight, MapPin, Mail, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Navigation } from "@/components/Navigation";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Footer } from "@/sections/Footer";
import "@/index.css";

const baseUrl = import.meta.env.BASE_URL || "/";

const features = [
  {
    icon: Gamepad2,
    title: "ゲーム",
    description: "自作ゲームの配布",
    href: `${baseUrl}games/`,
    color: "from-purple-400 to-pink-400",
  },
  {
    icon: Wrench,
    title: "ツール",
    description: "便利ツールの配布",
    href: `${baseUrl}tools/`,
    color: "from-cyan-400 to-sky-400",
  },
  {
    icon: Youtube,
    title: "YouTube",
    description: "動画チャンネル",
    href: `${baseUrl}youtube/`,
    color: "from-red-400 to-rose-400",
  },
  {
    icon: BookOpen,
    title: "記録",
    description: "成長記録ページ",
    href: `${baseUrl}records/`,
    color: "from-indigo-400 to-cyan-400",
  },
];

const profileSocialLinks = [
  { name: "YouTube", icon: Youtube, href: `${baseUrl}youtube/`, color: "from-red-500 to-rose-500" },
  { name: "Twitter", icon: Twitter, href: "#", color: "from-sky-400 to-blue-500" },
  { name: "GitHub", icon: Github, href: "#", color: "from-slate-500 to-slate-700" },
  { name: "Email", icon: Mail, href: "#", color: "from-cyan-400 to-sky-500" },
];

function HomePage() {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <ParticlesBackground />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-24">
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

                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute z-0 w-2 h-2 bg-cyan-400 rounded-full"
                    style={{ left: `${20 + i * 15}%`, top: `${30 + i * 10}%` }}
                    animate={{
                      y: [-20, -40, -20],
                      opacity: [0.4, 0.9, 0.4],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-cyan-100/80 bg-white p-9 lg:p-12 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100 to-sky-100 border border-cyan-200/80 mb-6"
                >
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm text-cyan-700 font-semibold tracking-wide">Welcome to my page!</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative text-6xl lg:text-7xl font-black mb-6 tracking-tight"
                >
                  <span className="text-slate-700">Chihalu</span>
                  <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 bg-clip-text text-transparent ml-1">
                    Studio
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative text-xl text-slate-500 mb-9 leading-relaxed"
                >
                  自作ゲーム・ツール等の販売や活動記録を残しています。
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                >
                  <a href={`${baseUrl}records/`}>
                    <Button
                      size="lg"
                      className="rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white hover:from-cyan-600 hover:to-sky-600"
                    >
                      記録を見る
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                  </a>
                  <a href={`${baseUrl}works/`}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-xl border-cyan-200 bg-white/80 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300"
                    >
                      作品を見る
                    </Button>
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative flex gap-3 mt-7 justify-center lg:justify-start"
                >
                  {[
                    { icon: Youtube, href: `${baseUrl}youtube/`, accent: "hover:border-red-300 hover:bg-red-50 hover:text-red-500" },
                    { icon: Twitter, href: "#", accent: "hover:border-sky-300 hover:bg-sky-50 hover:text-sky-500" },
                    { icon: Github, href: "#", accent: "hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700" },
                  ].map((social) => (
                    <motion.a
                      key={social.icon.name}
                      href={social.href}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className={`group w-12 h-12 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur flex items-center justify-center text-slate-400 transition-all duration-300 hover:-translate-y-1 ${social.accent}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white border-cyan-100 overflow-hidden rounded-2xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 p-1">
                      <button
                        type="button"
                        onClick={() => setIsAvatarOpen(true)}
                        className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden cursor-zoom-in"
                        aria-label="アバターを拡大"
                      >
                        <img src={`${baseUrl}avatar.png`} alt="Avatar" className="w-full h-full object-cover" />
                      </button>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-700">Chihalu</h3>
                    <p className="text-slate-500">Indie Game Developer</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>Japan</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-500 leading-relaxed mb-6">
                  こんにちは！Chihaluです。独学でプログラミング/3Dモデリングを始めました。 よろしくお願いします！
                </p>

                <div className="flex flex-wrap gap-3">
                  {profileSocialLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${link.color} text-white text-sm font-medium`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
        <DialogContent className="w-fit max-w-[92vw] border-cyan-100 bg-white p-3">
          <DialogTitle className="sr-only">Avatar Preview</DialogTitle>
          <img
            src={`${baseUrl}avatar.png`}
            alt="Avatar enlarged"
            className="max-h-[80vh] w-auto rounded-xl object-contain"
          />
        </DialogContent>
      </Dialog>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-slate-700">コンテンツ</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              以下のコンテンツをご覧ください
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <a href={feature.href}>
                  <Card className="group bg-white border-slate-200 hover:border-cyan-300 transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-700 mb-2 group-hover:text-cyan-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-500">{feature.description}</p>
                      <div className="mt-4 flex items-center justify-center text-cyan-600 text-sm font-medium">
                        詳しく見る
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
)

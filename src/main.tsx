import React from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from "framer-motion";
import { Sparkles, Youtube, Twitter, Github, Gamepad2, Wrench, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-cyan-50/50 via-white to-white">
        <ParticlesBackground />

        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative w-72 h-96 lg:w-80 lg:h-[450px]">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-200/40 via-transparent to-transparent rounded-full blur-2xl scale-110" />
                
                <motion.img
                  src={`${baseUrl}character.png`}
                  alt="Character"
                  className="w-full h-full object-contain drop-shadow-xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full"
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
              className="text-center lg:text-left max-w-xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 border border-cyan-200 mb-6"
              >
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span className="text-sm text-cyan-600 font-medium">Welcome to my page!</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl lg:text-6xl font-bold mb-6"
              >
                <span className="text-slate-700">Chihalu</span>
                <span className="text-gradient">Studio</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-slate-500 mb-8 leading-relaxed"
              >
                ゲーム開発者 / プログラマー / YouTuber
                <br />
                自作ゲーム・ツールの配布や活動記録を残しています。
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >

                <a href={`${baseUrl}about/`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-cyan-300 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-400"
                  >
                    プロフィール
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex gap-4 mt-8 justify-center lg:justify-start"
              >
                {[
                  { icon: Youtube, href: `${baseUrl}youtube/` },
                  { icon: Twitter, href: "#" },
                  { icon: Github, href: "#" },
                ].map((social) => (
                  <motion.a
                    key={social.icon.name}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-100 transition-all"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <a href={feature.href}>
                  <Card className="group bg-white border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100 cursor-pointer h-full">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
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

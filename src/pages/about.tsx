import React from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from "framer-motion";
import { User, Heart, Code2, Coffee, Mail, Twitter, Github, Youtube, MapPin, Gamepad2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/sections/Footer";
import "@/index.css";

const skills = [
  { name: "Unity", level: 90 },
  { name: "C#", level: 85 },
  { name: "Python", level: 80 },
  { name: "JavaScript/TypeScript", level: 75 },
  { name: "React", level: 70 },
];

const socialLinks = [
  { name: "YouTube", icon: Youtube, href: "/youtube/", color: "from-red-500 to-rose-500" },
  { name: "Twitter", icon: Twitter, href: "#", color: "from-sky-400 to-blue-500" },
  { name: "GitHub", icon: Github, href: "#", color: "from-slate-500 to-slate-700" },
  { name: "Email", icon: Mail, href: "#", color: "from-cyan-400 to-sky-500" },
];

const activities = [
  { icon: Gamepad2, label: "ゲーム開発", description: "Unityで2D/3Dゲームを制作" },
  { icon: Code2, label: "プログラミング", description: "ツールやアプリの開発" },
  { icon: Youtube, label: "YouTube", description: "ゲーム開発動画の投稿" },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
          <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-cyan-100/50 rounded-full blur-3xl" />
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
              <User className="w-4 h-4 text-cyan-500" />
              <span className="text-sm text-cyan-600 font-medium">About</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              <span className="text-slate-700">About</span>
              <span className="text-gradient"> Me</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              ゲーム開発者 / プログラマー / YouTuber
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card className="bg-white border-slate-200 shadow-lg shadow-slate-100 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 p-1">
                        <div className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden">
                          <img src="/character.png" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
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
                    こんにちは！Chihaluです。
                    小さい頃からゲームが大好きで、中学生の頃から独学でプログラミングを始めました。
                    現在はUnityをメインに使用し、様々なジャンルのゲームを制作・配布しています。
                    YouTubeではゲーム開発の過程や技術解説を発信しています。
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {activities.map((activity, index) => (
                      <div key={index} className="text-center p-3 rounded-xl bg-cyan-50 border border-cyan-100">
                        <activity.icon className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                        <div className="text-xs font-medium text-slate-700">{activity.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((link) => (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${link.color} text-white text-sm font-medium shadow-md`}
                      >
                        <link.icon className="w-4 h-4" />
                        {link.name}
                      </motion.a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "5+", label: "Years", sublabel: "Experience" },
                  { value: "20+", label: "Projects", sublabel: "Completed" },
                  { value: "10K+", label: "Users", sublabel: "Worldwide" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-4 rounded-xl bg-white border border-slate-200 shadow-sm"
                  >
                    <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                    <div className="text-sm text-slate-700 font-medium">{stat.label}</div>
                    <div className="text-xs text-slate-400">{stat.sublabel}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card className="bg-white border-slate-200 shadow-lg shadow-slate-100">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Code2 className="w-6 h-6 text-cyan-500" />
                    <h3 className="text-xl font-bold text-slate-700">スキル</h3>
                  </div>

                  <div className="space-y-5">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                          <span className="text-sm text-cyan-600 font-medium">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                            className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-50 to-sky-50 border-cyan-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
                      <Coffee className="w-6 h-6 text-cyan-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-700 mb-2">サポートする</h4>
                      <p className="text-sm text-slate-500 mb-4">
                        作品が気に入ったら、サポートしていただけると嬉しいです。
                        今後の制作活動の励みになります。
                      </p>
                      <Button size="sm" className="bg-gradient-to-r from-cyan-400 to-sky-500 text-white shadow-md">
                        <Heart className="w-4 h-4 mr-2" />
                        サポートする
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-lg shadow-slate-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-5 h-5 text-cyan-500" />
                    <h3 className="font-bold text-slate-700">お問い合わせ</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">
                    ご質問やお仕事のご依頼などがあれば、お気軽にご連絡ください。
                  </p>
                  <Button variant="outline" className="w-full border-cyan-300 text-cyan-600 hover:bg-cyan-50">
                    <Mail className="w-4 h-4 mr-2" />
                    メールを送る
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AboutPage />
  </React.StrictMode>,
)

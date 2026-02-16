"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import siteIcon from "../../icon.png";

const baseUrl = import.meta.env.BASE_URL || "/";

const navItems = [
  { name: "ほーむ", href: baseUrl, icon: "🏠", color: "hover:bg-pink-50" },
  { name: "ようつべ", href: `${baseUrl}youtube/`, icon: "📺", color: "hover:bg-rose-50" },
  { name: "しょっぷ", href: `${baseUrl}works/`, icon: "🛍️", color: "hover:bg-purple-50" },
  { name: "きろく", href: `${baseUrl}records/`, icon: "📚", color: "hover:bg-indigo-50" },
];

// ナビゲーションリンク
function NavLink({
  item,
  index,
}: {
  item: typeof navItems[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={item.href}
      className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl text-slate-500 transition-all overflow-hidden ${item.color}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 背景のアニメーション */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-pink-200"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* アイコン */}
      <motion.span
        className="relative z-10 text-xl"
        animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.2 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {item.icon}
      </motion.span>

      <span className="relative z-10 text-base font-bold">{item.name}</span>

      {/* アンダーライン */}
      <motion.div
        className="absolute bottom-1 left-5 right-5 h-0.5 bg-pink-400 rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
  );
}

// ロゴアニメーション
function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={baseUrl}
      className="flex items-center gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="relative"
        animate={{
          rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
          scale: isHovered ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={siteIcon}
          alt="ちるにゃすたじお"
          className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl object-cover shadow-lg border-2 border-pink-200"
        />
        <motion.div
          className="absolute -top-1 -right-1 text-lg"
          animate={{
            rotate: [0, 20, -20, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          ✨
        </motion.div>
      </motion.div>
      <span className="font-bold text-xl lg:text-2xl hidden sm:block">
        <motion.span
          className="text-slate-700"
          animate={{ opacity: isHovered ? [1, 0.7, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          ちるにゃ
        </motion.span>
        <motion.span
          className="text-pink-500"
          animate={{
            opacity: isHovered ? [1, 0.7, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          すたじお
        </motion.span>
      </span>
    </motion.a>
  );
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // スクロールプログレス
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b-2 border-pink-100 shadow-lg shadow-pink-100/50"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 lg:h-24">
            <AnimatedLogo />

            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item, index) => (
                <NavLink key={item.name} item={item} index={index} />
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-2xl bg-pink-100 text-pink-600 border-2 border-pink-200 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-7 h-7" />
                ) : (
                  <Menu className="w-7 h-7" />
                )}
              </motion.div>
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    className="absolute inset-0 bg-pink-200 rounded-2xl"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* スクロールプログレスバー */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 origin-left"
          style={{ scaleX }}
        />
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              className="absolute inset-0 bg-white/98 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <nav className="relative flex flex-col items-center justify-center h-full gap-6">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.8 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-2xl font-bold text-slate-500 hover:text-pink-500 transition-colors group"
                  whileHover={{ scale: 1.1, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="p-4 rounded-2xl bg-pink-100 group-hover:bg-pink-200 transition-colors"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-3xl">{item.icon}</span>
                  </motion.div>
                  <span className="relative">
                    {item.name}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-1 bg-pink-400 rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                </motion.a>
              ))}

              {/* 装飾 */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="mt-8 flex gap-4"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="text-2xl"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  >
                    {["🌸", "✨", "💖", "🎀", "⭐"][i]}
                  </motion.div>
                ))}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Package, Home, Youtube, BookOpen } from "lucide-react";
import siteIcon from "../../icon.png";

const baseUrl = import.meta.env.BASE_URL || "/";

const navItems = [
  { name: "ホーム", href: baseUrl, icon: Home },
  { name: "YouTube", href: `${baseUrl}youtube/`, icon: Youtube },
  { name: "SHOP", href: `${baseUrl}works/`, icon: Package },
  { name: "記録", href: `${baseUrl}records/`, icon: BookOpen },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            ? "bg-white/80 backdrop-blur-xl border-b border-cyan-200/50"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 lg:h-24">
            <motion.a
              href={baseUrl}
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img 
                src={siteIcon} 
                alt="Chihalu Studio" 
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl object-cover"
              />
              <span className="font-bold text-xl lg:text-2xl hidden sm:block">
                <span className="text-slate-700">Chihalu</span>
                <span className="text-cyan-500">Studio</span>
              </span>
            </motion.a>

            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-base font-medium">{item.name}</span>
                </motion.a>
              ))}
            </nav>



            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-cyan-100 text-cyan-600"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-white/98 backdrop-blur-xl" />
            <nav className="relative flex flex-col items-center justify-center h-full gap-6">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-2xl font-medium text-slate-500 hover:text-cyan-600 transition-colors"
                >
                  <item.icon className="w-6 h-6 text-cyan-500" />
                  {item.name}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

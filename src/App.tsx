import { Navigation } from "./components/Navigation";
import { Hero } from "./sections/Hero";
import { YouTube } from "./sections/YouTube";
import { Games } from "./sections/Games";
import { Tools } from "./sections/Tools";
import { Footer } from "./sections/Footer";
import { CuteBackground } from "./components/CuteBackground";

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🌸 可愛い背景 */}
      <CuteBackground />
      
      {/* ナビゲーション */}
      <Navigation />
      
      {/* メインコンテンツ */}
      <main className="relative z-10">
        <Hero />
        <YouTube />
        <Games />
        <Tools />
      </main>
      
      {/* フッター */}
      <Footer />
    </div>
  );
}

export default App;

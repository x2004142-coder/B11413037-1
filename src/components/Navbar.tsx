import React from 'react';

interface NavbarProps {
  onStartPractice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartPractice }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-3.5">
        <a
          href="#overview"
          className="font-display text-xl font-bold tracking-tight text-[#2B7BBB] whitespace-nowrap shrink-0"
        >
          AI融入課程
        </a>

        <nav
          aria-label="主要導覽"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <a
            href="#overview"
            className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            課程總覽
          </a>
          <a
            href="#oop-sandbox"
            className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            物件沙盒
          </a>
          <a
            href="#github-deploy"
            className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            上傳 GitHub
          </a>
          <a
            href="#netlify-deploy"
            className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            佈署 Netlify
          </a>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onStartPractice}
            className="rounded-lg bg-[#2B7BBB] px-4 py-2 text-sm font-medium text-white hover:bg-[#23659B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            開始實作模擬
          </button>
        </div>
      </div>
    </header>
  );
};

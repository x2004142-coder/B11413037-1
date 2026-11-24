import React, { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Circle, CloudUpload, GitBranch } from 'lucide-react';
import { COURSE_CHECKLIST, ChecklistTask } from '../data/courseData';

interface HeroSectionProps {
  completedTasks: Record<ChecklistTask['id'], boolean>;
  onToggleTask: (id: ChecklistTask['id']) => void;
  onJumpToSection: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  completedTasks,
  onToggleTask,
  onJumpToSection,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const completedCount = Object.values(completedTasks).filter(Boolean).length;

  const taskIcons: Record<ChecklistTask['id'], React.ReactNode> = {
    'python-oop': <BookOpen className="h-4 w-4 text-[#2B7BBB]" aria-hidden="true" />,
    'github-upload': <GitBranch className="h-4 w-4 text-[#2E7D5B]" aria-hidden="true" />,
    'netlify-deploy': <CloudUpload className="h-4 w-4 text-[#2B7BBB]" aria-hidden="true" />,
  };

  const taskTargets: Record<ChecklistTask['id'], string> = {
    'python-oop': 'oop-sandbox',
    'github-upload': 'github-deploy',
    'netlify-deploy': 'netlify-deploy',
  };

  return (
    <section id="overview" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <p className="text-xs font-medium tracking-wide text-slate-500">
                Python 物件導向 <span aria-hidden="true">·</span> GitHub 版本控制{' '}
                <span aria-hidden="true">·</span> Netlify 雲端佈署
              </p>

              <h1
                className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
                style={{ textWrap: 'balance' }}
              >
                從 Python 類別與物件出發，將學習網頁帶上雲端
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
                這份互動課程將抽象的程式概念轉化為可視化實驗室。你將先在沙盒中拆解{' '}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-800">class</code>{' '}
                藍圖與記憶體物件實例，再透過模擬終端機演練 GitHub 推送與 Netlify 自動佈署，完成屬於自己的線上學習網站。
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onJumpToSection('oop-sandbox')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2B7BBB] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#23659B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>進入類別與物件模擬</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onJumpToSection('github-deploy')}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>檢視 GitHub 與 Netlify 步驟</span>
                </button>
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-800">課程學習目標一覽</span>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  已完成 {completedCount} / {COURSE_CHECKLIST.length} 項實作階段
                </span>
              </div>
              <ol className="mt-3 space-y-2 text-sm text-slate-600">
                <li>01. 建立 Python 類別與物件學習網頁（理解藍圖、self 與繼承）</li>
                <li>02. 上傳專案原始碼到 GitHub（初始化版本控制並推送遠端）</li>
                <li>03. 佈署到 Netlify（綁定儲存庫並發布全球可訪問的網頁）</li>
              </ol>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-[#F8FAFC]">
              {!imageFailed ? (
                <div className="relative flex-1 overflow-hidden bg-[#FDF8EC]">
                  <img
                    src="/assets/aistudio/image_ec5230b9.png"
                    alt="AI融入課程海報：1. 建立python類別與物件學習網頁、2. 上傳到github、3. 佈署到netlify"
                    referrerPolicy="no-referrer"
                    onError={() => setImageFailed(true)}
                    className="h-full w-full object-cover object-center lg:max-h-[470px]"
                  />
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                  <BookOpen className="h-10 w-10 text-[#2B7BBB]" aria-hidden="true" />
                  <p className="mt-3 font-display text-lg font-semibold text-slate-800">
                    AI融入課程：三步驟實作指南
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Python 類別與物件 · GitHub 上傳 · Netlify 佈署
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500">
                <span>課程視覺導覽海報</span>
                <span className="font-mono">3 Core Milestones</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 border-t border-slate-200 pt-8 md:grid-cols-3">
          {COURSE_CHECKLIST.map((task) => {
            const isDone = completedTasks[task.id];
            return (
              <div
                key={task.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 transition-colors hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      {taskIcons[task.id]}
                      <span>{task.step}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      aria-pressed={isDone}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isDone
                          ? 'bg-[#2E7D5B]/10 text-[#2E7D5B]'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>已完成</span>
                        </>
                      ) : (
                        <>
                          <Circle className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>標記完成</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h2 className="mt-3 font-display text-base font-semibold text-slate-900">
                    {task.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {task.description}
                  </p>
                </div>

                <div className="mt-4 pt-2">
                  <button
                    type="button"
                    onClick={() => onJumpToSection(taskTargets[task.id])}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2B7BBB] hover:underline underline-offset-4 cursor-pointer"
                  >
                    <span>前往此單元實作</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

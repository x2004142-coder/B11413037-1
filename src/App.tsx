/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { DeployWorkflowLab } from './components/DeployWorkflowLab';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { PythonOopSandbox } from './components/PythonOopSandbox';
import { ChecklistTask } from './data/courseData';

const STORAGE_KEY = 'ai_course_python_oop_progress_v1';

const DEFAULT_PROGRESS: Record<ChecklistTask['id'], boolean> = {
  'python-oop': false,
  'github-upload': false,
  'netlify-deploy': false,
};

export default function App() {
  const [completedTasks, setCompletedTasks] = useState<Record<ChecklistTask['id'], boolean>>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore storage unavailability
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
    } catch {
      // Ignore storage unavailability
    }
  }, [completedTasks]);

  const markTaskDone = (id: ChecklistTask['id']) => {
    setCompletedTasks((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const toggleTask = (id: ChecklistTask['id']) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <Navbar onStartPractice={() => scrollToSection('oop-sandbox')} />

      <main>
        <HeroSection
          completedTasks={completedTasks}
          onToggleTask={toggleTask}
          onJumpToSection={scrollToSection}
        />

        <PythonOopSandbox onCompleteModule={() => markTaskDone('python-oop')} />

        <DeployWorkflowLab
          onCompleteGitHub={() => markTaskDone('github-upload')}
          onCompleteNetlify={() => markTaskDone('netlify-deploy')}
        />
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <div>
            AI融入課程 <span aria-hidden="true">·</span> Python 類別與物件學習工坊
          </div>
          <div className="flex items-center gap-6">
            <a href="#overview" className="hover:text-slate-900 transition-colors">
              回到頂部
            </a>
            <a href="#oop-sandbox" className="hover:text-slate-900 transition-colors">
              物件沙盒
            </a>
            <a href="#github-deploy" className="hover:text-slate-900 transition-colors">
              GitHub 上傳
            </a>
            <a href="#netlify-deploy" className="hover:text-slate-900 transition-colors">
              Netlify 佈署
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

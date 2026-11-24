import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  CloudUpload,
  Copy,
  Download,
  ExternalLink,
  FileCode2,
  FolderGit2,
  GitBranch,
  Globe,
  Play,
  RotateCcw,
} from 'lucide-react';
import { generateStudentStarterHtml } from '../data/courseData';

interface DeployWorkflowLabProps {
  onCompleteGitHub: () => void;
  onCompleteNetlify: () => void;
}

type GitStage = 0 | 1 | 2 | 3 | 4;
type ProjectType = 'static-html' | 'vite-react';

export const DeployWorkflowLab: React.FC<DeployWorkflowLabProps> = ({
  onCompleteGitHub,
  onCompleteNetlify,
}) => {
  const [githubUser, setGithubUser] = useState<string>('student-dev');
  const [repoName, setRepoName] = useState<string>('python-oop-study');

  const [gitStage, setGitStage] = useState<GitStage>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [gitLogLines, setGitLogLines] = useState<string[]>([
    '專案資料夾已準備完成：index.html (待初始化 Git 版本控制)',
  ]);

  const [projectType, setProjectType] = useState<ProjectType>('static-html');
  const [netlifyStep, setNetlifyStep] = useState<number>(0);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  const cleanUser = githubUser.trim() || 'student-dev';
  const cleanRepo = repoName.trim().replace(/\s+/g, '-') || 'python-oop-study';
  const remoteUrl = `https://github.com/${cleanUser}/${cleanRepo}.git`;
  const netlifySiteUrl = `https://${cleanRepo}.netlify.app`;

  const gitCommands = [
    {
      step: 1 as GitStage,
      cmd: 'git init',
      label: '1. 初始化 Git 儲存庫',
      output: 'Initialized empty Git repository in ./python-oop-study/.git/',
    },
    {
      step: 2 as GitStage,
      cmd: 'git add .',
      label: '2. 將學習網頁加入暫存區',
      output: 'Staged: index.html (已納入追蹤並準備提交)',
    },
    {
      step: 3 as GitStage,
      cmd: 'git commit -m "feat: 建立 Python 類別與物件學習網頁"',
      label: '3. 建立本地版本紀錄',
      output: '[main (root-commit) a41c89e] feat: 建立 Python 類別與物件學習網頁 (1 file changed)',
    },
    {
      step: 4 as GitStage,
      cmd: `git remote add origin ${remoteUrl} && git branch -M main && git push -u origin main`,
      label: '4. 推送至 GitHub 遠端',
      output: `To ${remoteUrl} * [new branch] main -> main (上傳成功)`,
    },
  ];

  const handleRunGitStep = (targetStep: GitStage, cmd: string, output: string) => {
    setGitStage(targetStep);
    setGitLogLines((prev) => [...prev.slice(-4), `$ ${cmd}`, output]);
    if (targetStep === 4) {
      onCompleteGitHub();
    }
  };

  const handleResetGit = () => {
    setGitStage(0);
    setGitLogLines(['已重設模擬狀態：專案資料夾準備完成，請依序執行下方指令。']);
  };

  const handleCopyCommand = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Ignore clipboard permission errors in restricted contexts
    }
  };

  const handleDownloadTemplate = () => {
    const html = generateStudentStarterHtml(cleanRepo, cleanUser);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!isDeploying) return;
    const timer = window.setInterval(() => {
      setNetlifyStep((prev) => {
        if (prev >= 4) {
          setIsDeploying(false);
          onCompleteNetlify();
          return 4;
        }
        return prev + 1;
      });
    }, 800);
    return () => window.clearInterval(timer);
  }, [isDeploying, onCompleteNetlify]);

  const startNetlifyDeploy = () => {
    setNetlifyStep(1);
    setIsDeploying(true);
  };

  const netlifyPipelineSteps = [
    {
      id: 1,
      title: '1. 連結並複製 GitHub Repository',
      detail: `Fetching ${cleanUser}/${cleanRepo} (branch: main)...`,
    },
    {
      id: 2,
      title: '2. 執行建置設定 (Build Command)',
      detail:
        projectType === 'static-html'
          ? '偵測為純靜態 HTML 網頁，略過編譯步驟直接準備發佈。'
          : '執行 npm install && npm run build，打包 Vite 資源至 dist/。',
    },
    {
      id: 3,
      title: '3. 發佈檔案至全球 Edge CDN',
      detail: `Uploading directory "${projectType === 'static-html' ? '.' : 'dist'}" to Netlify CDN...`,
    },
    {
      id: 4,
      title: '4. 啟用 HTTPS 並正式上線',
      detail: `網站已於 ${netlifySiteUrl} 成功發布！`,
    },
  ];

  const gitZoneNodes = [
    { stage: 1, name: '工作目錄', sub: 'index.html' },
    { stage: 2, name: '暫存區 (Staging)', sub: 'git add .' },
    { stage: 3, name: '本地 Commit', sub: 'a41c89e' },
    { stage: 4, name: 'GitHub 雲端', sub: `${cleanUser}/${cleanRepo}` },
  ];

  return (
    <div className="bg-white">
      {/* Module 2: GitHub Upload Interactive Simulator */}
      <section id="github-deploy" className="border-b border-slate-200 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-medium tracking-wide text-slate-500">
                步驟 02 <span aria-hidden="true">·</span> 上傳到 GitHub 版本控制
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">
                Git 與 GitHub 上傳實戰模擬器
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                輸入你的 GitHub 帳號與專案名稱，系統會自動生成專屬終端機指令。你可以先下載{' '}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">index.html</code>{' '}
                範本，並在下方逐步演練檔案如何從電腦推送到 GitHub。
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors self-start whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="h-4 w-4 text-[#2B7BBB]" aria-hidden="true" />
              <span>下載 Python 學習網頁範本 (index.html)</span>
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Interactive Config & Git Pipeline Visual */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5">
                <h3 className="font-display text-base font-semibold text-slate-900">
                  設定你的 GitHub Repository 資訊
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div>
                    <label
                      htmlFor="gh-user-input"
                      className="block text-xs font-medium text-slate-700"
                    >
                      GitHub 使用者帳號 (Username)
                    </label>
                    <input
                      id="gh-user-input"
                      type="text"
                      value={githubUser}
                      onChange={(e) => setGithubUser(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-[#2B7BBB] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="gh-repo-input"
                      className="block text-xs font-medium text-slate-700"
                    >
                      專案儲存庫名稱 (Repository Name)
                    </label>
                    <input
                      id="gh-repo-input"
                      type="text"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-[#2B7BBB] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-xs text-slate-600 break-all">
                  <span className="text-slate-400">遠端網址：</span>
                  <span className="text-slate-900">{remoteUrl}</span>
                </div>
              </div>

              {/* Project Directory Preview */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    專案資料夾結構
                  </h3>
                  <span className="font-mono text-xs text-slate-500">{cleanRepo}/</span>
                </div>
                <ul className="mt-3 space-y-2 font-mono text-xs text-slate-700">
                  <li className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                    <span className="flex items-center gap-2">
                      <FileCode2 className="h-4 w-4 text-[#2B7BBB]" aria-hidden="true" />
                      <span>index.html</span>
                    </span>
                    <span className="text-slate-500">Python 學習網頁主檔</span>
                  </li>
                  <li className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                    <span className="flex items-center gap-2">
                      <FolderGit2 className="h-4 w-4 text-[#2E7D5B]" aria-hidden="true" />
                      <span>.git/</span>
                    </span>
                    <span className="text-slate-500">
                      {gitStage >= 1 ? '已初始化版本庫' : '尚未建立 (需 git init)'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Interactive Git Execution & State Flow */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-[#2E7D5B]" aria-hidden="true" />
                    <h3 className="font-display text-base font-semibold text-slate-900">
                      Git 上傳四階段狀態流轉
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetGit}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>重設模擬</span>
                  </button>
                </div>

                {/* 4-Node Pipeline */}
                <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {gitZoneNodes.map((node) => {
                    const reached = gitStage >= node.stage;
                    return (
                      <div
                        key={node.stage}
                        className={`rounded-lg border p-3 transition-colors ${
                          reached
                            ? 'border-[#2E7D5B] bg-[#2E7D5B]/5'
                            : 'border-slate-200 bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                            0{node.stage}
                          </span>
                          {reached && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#2E7D5B]" aria-hidden="true" />
                          )}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-slate-900">{node.name}</div>
                        <div className="mt-0.5 truncate font-mono text-[11px] text-slate-500">
                          {node.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive Command Steps */}
                <div className="mt-5 space-y-2.5">
                  {gitCommands.map((item) => {
                    const isDone = gitStage >= item.step;
                    const isNext = gitStage === item.step - 1;
                    return (
                      <div
                        key={item.step}
                        className={`flex flex-col justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:items-center ${
                          isDone
                            ? 'border-[#2E7D5B]/40 bg-[#2E7D5B]/5'
                            : isNext
                              ? 'border-[#2B7BBB] bg-white'
                              : 'border-slate-200 bg-slate-50/60'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800">{item.label}</div>
                          <code className="mt-1 block truncate font-mono text-xs text-slate-600">
                            $ {item.cmd}
                          </code>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyCommand(`git-${item.step}`, item.cmd)}
                            aria-label={`複製指令 ${item.cmd}`}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            {copiedId === `git-${item.step}` ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-[#2E7D5B]" aria-hidden="true" />
                                <span>已複製</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>複製</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRunGitStep(item.step, item.cmd, item.output)}
                            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                              isDone
                                ? 'bg-[#2E7D5B] text-white'
                                : 'bg-[#2B7BBB] text-white hover:bg-[#23659B]'
                            }`}
                          >
                            <Play className="h-3 w-3" aria-hidden="true" />
                            <span>{isDone ? '已執行' : '模擬執行'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Terminal Log */}
                <div className="mt-4 rounded-lg border border-slate-800 bg-[#0F172A] p-3.5 font-mono text-xs leading-relaxed text-slate-300">
                  {gitLogLines.map((line, i) => (
                    <div
                      key={i}
                      className={line.startsWith('$') ? 'text-sky-300' : 'text-slate-300'}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 3: Netlify Automated Deployment Workbench */}
      <section id="netlify-deploy" className="bg-[#F8FAFC] py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-slate-500">
              步驟 03 <span aria-hidden="true">·</span> 佈署到 Netlify 雲端平台
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">
              Netlify 自動建置與發佈導覽
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              在 Netlify 登入後選擇「Add new site」→「Import an existing project」，連結剛才上傳的 GitHub 儲存庫。依你的網頁類型設定建置參數，每次{' '}
              <code className="rounded bg-slate-200/70 px-1.5 py-0.5 text-xs text-slate-800">git push</code>{' '}
              都會自動更新線上網站。
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Netlify Build Settings Configurator */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5">
              <div className="flex items-center gap-2">
                <CloudUpload className="h-4 w-4 text-[#2B7BBB]" aria-hidden="true" />
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Netlify 專案建置設定 (Site Configuration)
                </h3>
              </div>

              <div className="mt-4">
                <span className="block text-xs font-medium text-slate-700">選擇你的網頁架構類型</span>
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setProjectType('static-html')}
                    className={`rounded-md px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      projectType === 'static-html'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    純 HTML 單檔範本
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectType('vite-react')}
                    className={`rounded-md px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      projectType === 'vite-react'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Vite / React 專案
                  </button>
                </div>
              </div>

              <dl className="mt-5 space-y-3 rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 font-mono text-xs">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2.5">
                  <dt className="text-slate-500">Repository</dt>
                  <dd className="font-medium text-slate-900">
                    {cleanUser}/{cleanRepo}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2.5">
                  <dt className="text-slate-500">Branch to deploy</dt>
                  <dd className="font-medium text-slate-900">main</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2.5">
                  <dt className="text-slate-500">Build command</dt>
                  <dd className="font-medium text-slate-900">
                    {projectType === 'static-html' ? '(留空不需編譯)' : 'npm run build'}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">Publish directory</dt>
                  <dd className="font-medium text-[#2B7BBB]">
                    {projectType === 'static-html' ? '.' : 'dist'}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={startNetlifyDeploy}
                disabled={isDeploying}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2B7BBB] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#23659B] disabled:opacity-60 transition-colors cursor-pointer"
              >
                <CloudUpload className="h-4 w-4" aria-hidden="true" />
                <span>
                  {isDeploying ? '正在模擬 Netlify 建置中...' : '觸發 Netlify 自動佈署模擬'}
                </span>
              </button>
            </div>

            {/* Right: Netlify Build Pipeline & Live URL Card */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    雲端建置與佈署進度 (Deploy Log)
                  </h3>
                  <span className="font-mono text-xs text-slate-500 tabular-nums">
                    步驟 {netlifyStep} / 4
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {netlifyPipelineSteps.map((step) => {
                    const isCompleted = netlifyStep >= step.id;
                    const isCurrent = netlifyStep === step.id && isDeploying;
                    return (
                      <div
                        key={step.id}
                        className={`flex items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                          isCompleted
                            ? 'border-[#2E7D5B]/40 bg-[#2E7D5B]/5'
                            : 'border-slate-200 bg-slate-50/50'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-[#2E7D5B]" aria-hidden="true" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-slate-300 bg-white" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900">
                              {step.title}
                            </span>
                            {isCurrent && (
                              <span className="font-mono text-[11px] text-[#2B7BBB]">
                                執行中...
                              </span>
                            )}
                          </div>
                          <p className="mt-1 font-mono text-xs text-slate-600">{step.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Published Result Banner */}
              <div className="mt-6 rounded-lg border border-slate-200 bg-[#F8FAFC] p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2.5">
                    <Globe
                      className={`h-5 w-5 shrink-0 ${
                        netlifyStep === 4 ? 'text-[#2E7D5B]' : 'text-slate-400'
                      }`}
                      aria-hidden="true"
                    />
                    <div>
                      <div className="text-xs font-medium text-slate-500">
                        {netlifyStep === 4
                          ? '佈署完成 · 預覽公開網站網址'
                          : '完成模擬佈署後將顯示你的專屬 HTTPS 網址'}
                      </div>
                      <div className="font-mono text-sm font-semibold text-slate-900">
                        {netlifySiteUrl}
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://app.netlify.com/start"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>前往 Netlify 控制台</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

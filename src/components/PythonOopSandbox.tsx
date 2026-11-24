import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  Play,
  Plus,
  RotateCcw,
  Terminal,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  BLUEPRINT_TEMPLATES,
  BlueprintKey,
  CREATION_TRACE_STEPS,
  OOP_STAGES,
  OopStageId,
  PythonInstance,
} from '../data/courseData';

interface PythonOopSandboxProps {
  onCompleteModule: () => void;
}

interface ConsoleEntry {
  id: string;
  command: string;
  output: string;
}

function generateHexAddress(seed: number): string {
  const hex = (0x7f2a1000 + seed * 0x148).toString(16);
  return `0x${hex}`;
}

export const PythonOopSandbox: React.FC<PythonOopSandboxProps> = ({ onCompleteModule }) => {
  const [activeStageId, setActiveStageId] = useState<OopStageId>('blueprint');
  const [blueprintKey, setBlueprintKey] = useState<BlueprintKey>('ForestSpirit');

  const template = BLUEPRINT_TEMPLATES[blueprintKey];

  const [instanceName, setInstanceName] = useState<string>(template.defaultNames[0]);
  const [initialEnergy, setInitialEnergy] = useState<number>(85);
  const [initialLevel, setInitialLevel] = useState<number>(1);
  const [createAsSubclass, setCreateAsSubclass] = useState<boolean>(false);

  const [instances, setInstances] = useState<PythonInstance[]>([
    {
      uid: 'init-1',
      varName: 'obj_1',
      memoryAddress: generateHexAddress(1),
      blueprintKey: 'ForestSpirit',
      isSubclass: false,
      name: '小芽',
      energy: 85,
      level: 1,
      lastAction: '初始化完成 (__init__)',
    },
  ]);

  const [instanceCounter, setInstanceCounter] = useState<number>(2);
  const [activeInstanceId, setActiveInstanceId] = useState<string>('init-1');
  const [traceStep, setTraceStep] = useState<number>(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([
    {
      id: 'log-0',
      command: 'obj_1 = ForestSpirit("小芽", energy=85, level=1)',
      output: '<ForestSpirit object at 0x7f2a1148> 已建立',
    },
  ]);

  const [selectedQuizOption, setSelectedQuizOption] = useState<Record<OopStageId, number | null>>({
    blueprint: null,
    instantiate: null,
    methods: null,
    inheritance: null,
  });

  const activeStage = useMemo(
    () => OOP_STAGES.find((stage) => stage.id === activeStageId) ?? OOP_STAGES[0],
    [activeStageId],
  );

  // Sync default name when switching blueprint
  const handleSelectBlueprint = (key: BlueprintKey) => {
    const nextTemplate = BLUEPRINT_TEMPLATES[key];
    setBlueprintKey(key);
    setInstanceName(nextTemplate.defaultNames[0]);
    setCreateAsSubclass(activeStageId === 'inheritance');
    const newUid = `bp-${Date.now()}`;
    const addr = generateHexAddress(instanceCounter);
    setInstances([
      {
        uid: newUid,
        varName: 'obj_1',
        memoryAddress: addr,
        blueprintKey: key,
        isSubclass: activeStageId === 'inheritance',
        name: nextTemplate.defaultNames[0],
        energy: 85,
        level: 1,
        specialTrait:
          activeStageId === 'inheritance' ? nextTemplate.subclassMethod.specialTrait : undefined,
        lastAction: '切換類別藍圖並建立初始範例',
      },
    ]);
    setInstanceCounter((c) => c + 1);
    setActiveInstanceId(newUid);
    setTraceStep(3);
    const clsName =
      activeStageId === 'inheritance' ? nextTemplate.subclassName : nextTemplate.className;
    setConsoleLogs((prev) => [
      ...prev.slice(-5),
      {
        id: `log-${Date.now()}`,
        command: `obj_1 = ${clsName}("${nextTemplate.defaultNames[0]}", energy=85, level=1)`,
        output: `<${clsName} object at ${addr}> 已建立`,
      },
    ]);
  };

  const handleStageChange = (stageId: OopStageId) => {
    setActiveStageId(stageId);
    if (stageId === 'inheritance') {
      setCreateAsSubclass(true);
    } else {
      setCreateAsSubclass(false);
    }
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = window.setInterval(() => {
      setTraceStep((prev) => {
        if (prev >= CREATION_TRACE_STEPS.length - 1) {
          setIsAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying]);

  const handleInstantiate = () => {
    const cleanName =
      instanceName.trim() ||
      template.defaultNames[(instanceCounter - 1) % template.defaultNames.length];
    const useSubclass = activeStageId === 'inheritance' && createAsSubclass;
    const varName = `obj_${instanceCounter}`;
    const addr = generateHexAddress(instanceCounter + 3);
    const newUid = `inst-${Date.now()}`;

    const newObj: PythonInstance = {
      uid: newUid,
      varName,
      memoryAddress: addr,
      blueprintKey,
      isSubclass: useSubclass,
      name: cleanName,
      energy: initialEnergy,
      level: initialLevel,
      specialTrait: useSubclass ? template.subclassMethod.specialTrait : undefined,
      lastAction: '呼叫 __init__ 完成初始化',
    };

    setInstances((prev) => [...prev.slice(-3), newObj]);
    setActiveInstanceId(newUid);
    setInstanceCounter((c) => c + 1);

    // Trigger trace playback from step 0
    setTraceStep(0);
    setIsAutoPlaying(true);

    const clsName = useSubclass ? template.subclassName : template.className;
    setConsoleLogs((prev) => [
      ...prev.slice(-5),
      {
        id: `log-${Date.now()}`,
        command: `${varName} = ${clsName}("${cleanName}", energy=${initialEnergy}, level=${initialLevel})`,
        output: `<${clsName} object at ${addr}> 已寫入 __dict__`,
      },
    ]);

    // Suggest next preset name for convenience
    const nextDefault = template.defaultNames[instanceCounter % template.defaultNames.length];
    setInstanceName(nextDefault);
    onCompleteModule();
  };

  const handleInvokeMethod = (
    uid: string,
    methodType: 'primary' | 'secondary' | 'subclass',
  ) => {
    setActiveInstanceId(uid);
    setInstances((prev) =>
      prev.map((item) => {
        if (item.uid !== uid) return item;
        const tpl = BLUEPRINT_TEMPLATES[item.blueprintKey];

        if (methodType === 'primary') {
          const nextEnergy = Math.max(0, Math.min(100, item.energy + tpl.primaryMethod.energyDelta));
          const nextLevel = item.level + tpl.primaryMethod.levelDelta;
          const msg = tpl.primaryMethod.logTemplate(item.name, nextEnergy, nextLevel);
          setConsoleLogs((logs) => [
            ...logs.slice(-5),
            {
              id: `log-${Date.now()}`,
              command: `${item.varName}.${tpl.primaryMethod.name}()  # self -> ${item.memoryAddress}`,
              output: msg,
            },
          ]);
          return {
            ...item,
            energy: nextEnergy,
            level: nextLevel,
            lastAction: msg,
          };
        }

        if (methodType === 'secondary') {
          const nextEnergy = Math.max(
            0,
            Math.min(100, item.energy + tpl.secondaryMethod.energyDelta),
          );
          const nextLevel = item.level + tpl.secondaryMethod.levelDelta;
          const msg = tpl.secondaryMethod.logTemplate(item.name, nextEnergy, nextLevel);
          setConsoleLogs((logs) => [
            ...logs.slice(-5),
            {
              id: `log-${Date.now()}`,
              command: `${item.varName}.${tpl.secondaryMethod.name}()  # self -> ${item.memoryAddress}`,
              output: msg,
            },
          ]);
          return {
            ...item,
            energy: nextEnergy,
            level: nextLevel,
            lastAction: msg,
          };
        }

        const trait = item.specialTrait ?? tpl.subclassMethod.specialTrait;
        const msg = tpl.subclassMethod.logTemplate(item.name, trait);
        setConsoleLogs((logs) => [
          ...logs.slice(-5),
          {
            id: `log-${Date.now()}`,
            command: `${item.varName}.${tpl.subclassMethod.name}()  # 繼承擴充方法`,
            output: msg,
          },
        ]);
        return {
          ...item,
          lastAction: msg,
        };
      }),
    );
    onCompleteModule();
  };

  const handleRemoveInstance = (uid: string) => {
    setInstances((prev) => prev.filter((item) => item.uid !== uid));
  };

  const handleResetTrace = () => {
    setIsAutoPlaying(false);
    setTraceStep(0);
  };

  const handleAnswerQuiz = (optionIndex: number) => {
    setSelectedQuizOption((prev) => ({ ...prev, [activeStageId]: optionIndex }));
    if (optionIndex === activeStage.quiz.correctIndex) {
      onCompleteModule();
    }
  };

  // Code lines with trace highlight mapping
  const codeLines = useMemo(() => {
    const baseLines = [
      { text: `class ${template.className}:`, highlightSteps: [0] },
      { text: `    def __init__(self, name, energy=100, level=1):`, highlightSteps: [1, 2] },
      { text: `        self.name = name`, highlightSteps: [2, 3] },
      { text: `        self.energy = energy`, highlightSteps: [2, 3] },
      { text: `        self.level = level`, highlightSteps: [2, 3] },
      { text: ``, highlightSteps: [] },
      { text: `    def ${template.primaryMethod.name}(self):`, highlightSteps: [] },
      {
        text: `        self.energy = max(0, self.energy ${template.primaryMethod.energyDelta})`,
        highlightSteps: [],
      },
      {
        text: `        self.level += ${template.primaryMethod.levelDelta}`,
        highlightSteps: [],
      },
      { text: ``, highlightSteps: [] },
      { text: `    def ${template.secondaryMethod.name}(self):`, highlightSteps: [] },
      {
        text: `        self.energy = min(100, self.energy + ${template.secondaryMethod.energyDelta})`,
        highlightSteps: [],
      },
    ];

    if (activeStageId === 'inheritance') {
      baseLines.push(
        { text: ``, highlightSteps: [] },
        {
          text: `class ${template.subclassName}(${template.className}):`,
          highlightSteps: [0],
        },
        {
          text: `    def __init__(self, name, energy=100, level=1):`,
          highlightSteps: [1, 2],
        },
        {
          text: `        super().__init__(name, energy, level)`,
          highlightSteps: [2, 3],
        },
        {
          text: `        self.trait = "${template.subclassMethod.specialTrait}"`,
          highlightSteps: [3],
        },
        { text: `    def ${template.subclassMethod.name}(self):`, highlightSteps: [] },
        {
          text: `        return f"{self.name} 啟動 {self.trait}"`,
          highlightSteps: [],
        },
      );
    }

    return baseLines;
  }, [template, activeStageId]);

  const currentQuizChoice = selectedQuizOption[activeStageId];

  return (
    <section id="oop-sandbox" className="border-b border-slate-200 bg-[#F8FAFC] py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-slate-500">
              步驟 01 <span aria-hidden="true">·</span> 互動式 Python 類別與物件學習沙盒
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">
              類別藍圖與記憶體物件模擬實驗室
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              切換四個漸進式學習階段，挑選類別範本並建立多個物件實例，即時觀察{' '}
              <code className="rounded bg-slate-200/70 px-1.5 py-0.5 text-xs text-slate-800">self</code>{' '}
              如何精準綁定到獨立的記憶體位址。
            </p>
          </div>

          <div
            role="tablist"
            aria-label="選擇 Python 類別範本"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 self-start"
          >
            {(Object.keys(BLUEPRINT_TEMPLATES) as BlueprintKey[]).map((key) => {
              const tpl = BLUEPRINT_TEMPLATES[key];
              const isSelected = blueprintKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectBlueprint(key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2B7BBB] text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tpl.chineseName} ({tpl.className})
                </button>
              );
            })}
          </div>
        </div>

        {/* Progressive Stage Selector */}
        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {OOP_STAGES.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => handleStageChange(stage.id)}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#2B7BBB] bg-white ring-1 ring-[#2B7BBB]'
                    : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <span
                  className={`font-mono text-xs font-medium tabular-nums ${
                    isActive ? 'text-[#2B7BBB]' : 'text-slate-400'
                  }`}
                >
                  階段 {stage.stepNumber}
                </span>
                <span className="mt-1 text-sm font-semibold text-slate-900 whitespace-nowrap">
                  {stage.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Two-Zone Sandbox Layout: Left Interactive Stage (8 cols) + Right Control & Concept Deck (4 cols) */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left / Top Zone: Interactive Stage */}
          <div className="space-y-6 lg:col-span-8">
            {/* Stage Info & Step Trace Playback */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-900">
                    {activeStage.stepNumber}. {activeStage.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{activeStage.summary}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setTraceStep((s) => Math.max(0, s - 1));
                    }}
                    disabled={traceStep === 0}
                    aria-label="上一步執行追蹤"
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>上一步</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setTraceStep((s) => Math.min(CREATION_TRACE_STEPS.length - 1, s + 1));
                    }}
                    disabled={traceStep === CREATION_TRACE_STEPS.length - 1}
                    aria-label="下一步執行追蹤"
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    <span>下一步</span>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTraceStep(0);
                      setIsAutoPlaying(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <Play className="h-3 w-3" aria-hidden="true" />
                    <span>動態追蹤</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetTrace}
                    aria-label="重設步驟"
                    className="inline-flex items-center rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Execution Trace Timeline */}
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-4">
                {CREATION_TRACE_STEPS.map((step, index) => {
                  const isCurrent = index === traceStep;
                  const isPassed = index < traceStep;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setTraceStep(index);
                      }}
                      className={`rounded-lg border px-3 py-2 text-left transition-colors cursor-pointer ${
                        isCurrent
                          ? 'border-[#2B7BBB] bg-[#2B7BBB]/5 text-slate-900'
                          : isPassed
                            ? 'border-slate-200 bg-slate-50 text-slate-700'
                            : 'border-slate-100 bg-white text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-semibold">{step.label}</div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2.5 text-xs text-slate-600">
                <span className="font-semibold text-[#2B7BBB]">執行解說：</span>
                {CREATION_TRACE_STEPS[traceStep].detail}
              </p>

              {/* Split View inside Stage: Python Class Code + Live Heap Memory Pool */}
              <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
                {/* Python Class Blueprint */}
                <div className="xl:col-span-6">
                  <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-300">
                    <span className="font-mono">blueprint.py</span>
                    <span className="text-slate-400">類別設計圖</span>
                  </div>
                  <div className="overflow-x-auto rounded-b-lg border border-slate-800 bg-[#0F172A] p-3 font-mono text-xs leading-6 text-slate-200">
                    {codeLines.map((line, idx) => {
                      const isHighlighted = line.highlightSteps.includes(traceStep);
                      return (
                        <div
                          key={idx}
                          className={`flex rounded px-2 transition-colors ${
                            isHighlighted ? 'bg-[#2B7BBB]/30 text-white' : ''
                          }`}
                        >
                          <span className="mr-3 w-5 select-none text-right text-slate-500 tabular-nums">
                            {idx + 1}
                          </span>
                          <pre className="whitespace-pre font-mono">{line.text || ' '}</pre>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Heap Memory Pool */}
                <div className="flex flex-col xl:col-span-6">
                  <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-slate-200 bg-slate-100 px-4 py-2 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Cpu className="h-3.5 w-3.5 text-[#2B7BBB]" aria-hidden="true" />
                      <span>記憶體物件池 (Heap Memory)</span>
                    </div>
                    <span className="font-mono text-slate-500 tabular-nums">
                      共 {instances.length} 個實例
                    </span>
                  </div>

                  <div className="flex-1 space-y-3 rounded-b-lg border border-slate-200 bg-[#F8FAFC] p-3">
                    {instances.length === 0 ? (
                      <div className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
                        <Layers className="h-8 w-8 text-slate-300" aria-hidden="true" />
                        <p className="mt-2 text-sm font-medium text-slate-700">
                          記憶體中尚無任何物件實例
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          請在右側控制面板點擊「建立新物件實例」，從類別藍圖產生實體物件。
                        </p>
                      </div>
                    ) : (
                      instances.map((inst) => {
                        const tpl = BLUEPRINT_TEMPLATES[inst.blueprintKey];
                        const isSelected = inst.uid === activeInstanceId;
                        const classDisplay = inst.isSubclass ? tpl.subclassName : tpl.className;

                        return (
                          <div
                            key={inst.uid}
                            onClick={() => setActiveInstanceId(inst.uid)}
                            className={`rounded-lg border bg-white p-3.5 transition-colors cursor-pointer ${
                              isSelected
                                ? 'border-[#2B7BBB] ring-1 ring-[#2B7BBB]/40'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 font-mono text-xs">
                                <span className="font-semibold text-slate-900">{inst.varName}</span>
                                <span className="text-slate-400">·</span>
                                <span className="text-[#2B7BBB]">{classDisplay}</span>
                                <span className="text-slate-400">·</span>
                                <span className="text-slate-500 tabular-nums">
                                  id={inst.memoryAddress}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveInstance(inst.uid);
                                }}
                                aria-label={`移除物件 ${inst.varName}`}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            </div>

                            <div className="mt-2.5 grid grid-cols-2 gap-3 rounded-md bg-slate-50 px-3 py-2 font-mono text-xs">
                              <div>
                                <span className="text-slate-500">self.name = </span>
                                <span className="font-medium text-slate-900">"{inst.name}"</span>
                              </div>
                              <div>
                                <span className="text-slate-500">self.level = </span>
                                <span className="font-medium text-slate-900 tabular-nums">
                                  Lv.{inst.level}
                                </span>
                              </div>
                              <div className="col-span-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500">
                                    self.energy ({tpl.attributeLabel})
                                  </span>
                                  <span className="font-medium text-slate-900 tabular-nums">
                                    {inst.energy} / 100 {tpl.attributeUnit}
                                  </span>
                                </div>
                                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                  <div
                                    className={`h-full transition-all duration-200 ${
                                      inst.energy >= 40 ? 'bg-[#2E7D5B]' : 'bg-amber-600'
                                    }`}
                                    style={{ width: `${inst.energy}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {inst.lastAction && (
                              <p className="mt-2 text-xs text-slate-600">{inst.lastAction}</p>
                            )}

                            <div className="mt-3 flex flex-wrap gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInvokeMethod(inst.uid, 'primary');
                                }}
                                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-[#2B7BBB] hover:text-[#2B7BBB] transition-colors cursor-pointer"
                              >
                                {tpl.primaryMethod.label}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInvokeMethod(inst.uid, 'secondary');
                                }}
                                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-[#2E7D5B] hover:text-[#2E7D5B] transition-colors cursor-pointer"
                              >
                                {tpl.secondaryMethod.label}
                              </button>
                              {inst.isSubclass && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInvokeMethod(inst.uid, 'subclass');
                                  }}
                                  className="rounded-md bg-[#2B7BBB]/10 px-2.5 py-1 text-xs font-medium text-[#2B7BBB] hover:bg-[#2B7BBB]/20 transition-colors cursor-pointer"
                                >
                                  {tpl.subclassMethod.label}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Python Interactive Console Output */}
              <div className="mt-5 rounded-lg border border-slate-800 bg-[#0F172A] p-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2 font-mono">
                    <Terminal className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    <span>Python 互動執行紀錄 (REPL Console)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConsoleLogs([])}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    清除紀錄
                  </button>
                </div>
                <div className="mt-2.5 space-y-2 font-mono text-xs">
                  {consoleLogs.length === 0 ? (
                    <p className="text-slate-500">尚無執行紀錄，試著建立物件或呼叫物件方法。</p>
                  ) : (
                    consoleLogs.map((entry) => (
                      <div key={entry.id} className="space-y-0.5">
                        <div className="text-sky-300">&gt;&gt;&gt; {entry.command}</div>
                        <div className="text-slate-300 pl-4">{entry.output}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right / Bottom Zone: Control & Concept Deck */}
          <div className="space-y-6 lg:col-span-4">
            {/* Object Instantiation Controls */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-display text-base font-semibold text-slate-900">
                實例化工廠：建立新物件
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                設定傳入 <code className="font-mono">__init__</code> 的初始參數，在記憶體中生成物件。
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="instance-name-input"
                    className="block text-xs font-medium text-slate-700"
                  >
                    物件名稱 (name)
                  </label>
                  <input
                    id="instance-name-input"
                    type="text"
                    value={instanceName}
                    onChange={(e) => setInstanceName(e.target.value)}
                    placeholder={template.defaultNames[0]}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#2B7BBB] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="energy-slider" className="font-medium text-slate-700">
                      {template.attributeLabel} (energy)
                    </label>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {initialEnergy} {template.attributeUnit}
                    </span>
                  </div>
                  <input
                    id="energy-slider"
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={initialEnergy}
                    onChange={(e) => setInitialEnergy(Number(e.target.value))}
                    className="mt-2 w-full accent-[#2B7BBB] cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-400 tabular-nums">
                    <span>10 {template.attributeUnit}</span>
                    <span>55 {template.attributeUnit}</span>
                    <span>100 {template.attributeUnit}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="level-slider" className="font-medium text-slate-700">
                      初始等級 (level)
                    </label>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      Lv. {initialLevel}
                    </span>
                  </div>
                  <input
                    id="level-slider"
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={initialLevel}
                    onChange={(e) => setInitialLevel(Number(e.target.value))}
                    className="mt-2 w-full accent-[#2B7BBB] cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-400 tabular-nums">
                    <span>Lv. 1</span>
                    <span>Lv. 5</span>
                    <span>Lv. 10</span>
                  </div>
                </div>

                {activeStageId === 'inheritance' && (
                  <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-800 cursor-pointer">
                    <span>使用子類別 {template.subclassName} 建立</span>
                    <input
                      type="checkbox"
                      checked={createAsSubclass}
                      onChange={(e) => setCreateAsSubclass(e.target.checked)}
                      className="h-4 w-4 accent-[#2B7BBB] cursor-pointer"
                    />
                  </label>
                )}

                <button
                  type="button"
                  onClick={handleInstantiate}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2B7BBB] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#23659B] transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>建立新物件實例</span>
                </button>
              </div>
            </div>

            {/* Bite-sized Concept Note */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-medium text-[#2B7BBB]">核心觀念解析</div>
              <h4 className="mt-1.5 font-display text-base font-semibold text-slate-900">
                {activeStage.conceptTitle}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {activeStage.conceptBody}
              </p>
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-700">
                <span className="font-semibold text-slate-900">重點提示：</span>
                {activeStage.keyPoint}
              </div>
            </div>

            {/* Stage Mini Quiz */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-medium text-slate-500">
                隨堂測驗 <span aria-hidden="true">·</span> 階段 {activeStage.stepNumber}
              </div>
              <p className="mt-2 text-sm font-semibold leading-snug text-slate-900">
                {activeStage.quiz.question}
              </p>

              <div className="mt-3 space-y-2">
                {activeStage.quiz.options.map((opt, idx) => {
                  const isChosen = currentQuizChoice === idx;
                  const isCorrectOption = idx === activeStage.quiz.correctIndex;
                  const showResult = currentQuizChoice !== null;

                  let btnStyle =
                    'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';
                  if (showResult && isCorrectOption) {
                    btnStyle = 'border-[#2E7D5B] bg-[#2E7D5B]/10 text-[#1F5940] font-medium';
                  } else if (showResult && isChosen && !isCorrectOption) {
                    btnStyle = 'border-red-500 bg-red-50 text-red-800';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAnswerQuiz(idx)}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showResult && isCorrectOption && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2E7D5B]" aria-hidden="true" />
                      )}
                      {showResult && isChosen && !isCorrectOption && (
                        <XCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>

              {currentQuizChoice !== null && (
                <div
                  className={`mt-3 rounded-lg border p-3 text-xs leading-relaxed ${
                    currentQuizChoice === activeStage.quiz.correctIndex
                      ? 'border-[#2E7D5B]/30 bg-[#2E7D5B]/5 text-slate-800'
                      : 'border-red-200 bg-red-50/70 text-red-900'
                  }`}
                >
                  <div className="font-semibold">
                    {currentQuizChoice === activeStage.quiz.correctIndex
                      ? '回答正確'
                      : '再試一次看看'}
                  </div>
                  <p className="mt-1">{activeStage.quiz.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

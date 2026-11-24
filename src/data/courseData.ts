export type OopStageId = 'blueprint' | 'instantiate' | 'methods' | 'inheritance';

export type BlueprintKey = 'ForestSpirit' | 'StudyBook' | 'SmartLamp';

export interface OopStageInfo {
  id: OopStageId;
  stepNumber: string;
  shortLabel: string;
  title: string;
  summary: string;
  conceptTitle: string;
  conceptBody: string;
  keyPoint: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface BlueprintTemplate {
  key: BlueprintKey;
  chineseName: string;
  className: string;
  subclassName: string;
  defaultNames: string[];
  attributeLabel: string;
  attributeUnit: string;
  primaryMethod: {
    name: string;
    label: string;
    energyDelta: number;
    levelDelta: number;
    logTemplate: (name: string, energy: number, level: number) => string;
  };
  secondaryMethod: {
    name: string;
    label: string;
    energyDelta: number;
    levelDelta: number;
    logTemplate: (name: string, energy: number, level: number) => string;
  };
  subclassMethod: {
    name: string;
    label: string;
    specialTrait: string;
    logTemplate: (name: string, trait: string) => string;
  };
}

export interface PythonInstance {
  uid: string;
  varName: string;
  memoryAddress: string;
  blueprintKey: BlueprintKey;
  isSubclass: boolean;
  name: string;
  energy: number;
  level: number;
  specialTrait?: string;
  lastAction?: string;
}

export const OOP_STAGES: OopStageInfo[] = [
  {
    id: 'blueprint',
    stepNumber: '01',
    shortLabel: '類別藍圖',
    title: '定義類別藍圖 (Class)',
    summary: '類別就像建築設計圖，先定義未來物件應該具備哪些屬性與行為，但尚未佔用實際記憶體。',
    conceptTitle: '為什麼需要 __init__ 與 self？',
    conceptBody:
      '__init__ 是建構子方法，每次建立新物件時會自動執行；self 則代表「正在被建立或呼叫的那一個物件本身」，讓每個物件都能保有自己獨立的資料。',
    keyPoint: 'class 關鍵字只建立設計圖，必須呼叫類別名稱()才會產生實體物件。',
    quiz: {
      question: '在 Python 類別定義中，哪一個特殊方法會在建立新物件時自動執行初始化？',
      options: ['__start__(self)', '__init__(self)', '__create__(self)', 'main(self)'],
      correctIndex: 1,
      explanation: '__init__(self, ...) 是 Python 的初始化建構方法，負責為新建立的物件設定初始屬性值。',
    },
  },
  {
    id: 'instantiate',
    stepNumber: '02',
    shortLabel: '實例化物件',
    title: '從類別建立多個物件 (Object)',
    summary: '同一份類別藍圖可以重複實例化出多個物件，每個物件在記憶體中都有獨立位址與狀態。',
    conceptTitle: '類別是設計圖，物件是真正的實體',
    conceptBody:
      '當你寫下 spirit_a = ForestSpirit("小芽", 85) 與 spirit_b = ForestSpirit("露露", 60) 時，Python 會在記憶體配置兩個互不干擾的空間，修改其中一個不會影響另一個。',
    keyPoint: '使用 id(物件) 可以查看每個物件在記憶體中獨一無二的編號。',
    quiz: {
      question: '若從同一個 Student 類別建立 s1 與 s2 兩個物件，改變 s1.score 會發生什麼事？',
      options: [
        's2.score 也會一起變成相同數值',
        '只有 s1.score 會改變，s2.score 維持不變',
        'Python 會拋出語法錯誤',
        'Student 類別本身的預設值會被永久修改',
      ],
      correctIndex: 1,
      explanation: '實例屬性（Instance Attribute）儲存在個別物件自己的 __dict__ 空間內，彼此完全獨立。',
    },
  },
  {
    id: 'methods',
    stepNumber: '03',
    shortLabel: '方法與行為',
    title: '呼叫物件方法改變狀態 (Method)',
    summary: '方法是寫在類別裡的函式，透過 self 存取並更新該物件內部的屬性數值。',
    conceptTitle: 'self 如何知道要修改哪一個物件？',
    conceptBody:
      '當我們執行 spirit_a.study() 時，Python 會自動把 spirit_a 作為第一個參數傳進 self。因此方法內的 self.energy -= 15 只會扣減 spirit_a 的能量。',
    keyPoint: '屬性記錄「物件是什麼（名詞）」，方法定義「物件能做什麼（動詞）」。',
    quiz: {
      question: '呼叫物件方法 hero.level_up() 時，為何定義時要寫 def level_up(self): 卻不用手動傳入參數？',
      options: [
        'Python 會自動將呼叫者 hero 綁定為第一個參數 self',
        'self 是全域變數，所有函式都能共用',
        'Python 會忽略括號內的所有參數',
        '因為 level_up 沒有回傳值',
      ],
      correctIndex: 0,
      explanation: '透過點記法 obj.method() 呼叫實例方法時，Python 會隱式地把 obj 當作第一個參數 self 傳入。',
    },
  },
  {
    id: 'inheritance',
    stepNumber: '04',
    shortLabel: '繼承與擴充',
    title: '類別繼承與子類別擴充 (Inheritance)',
    summary: '子類別可以直接繼承父類別的屬性與方法，並透過 super() 保留既有邏輯再加入新功能。',
    conceptTitle: '避免重複寫相同程式碼的最佳方式',
    conceptBody:
      '當需要進階版本（例如會發光的 ElderSpirit）時，只需寫 class ElderSpirit(ForestSpirit):，就能直接沿用原有的 study() 與 rest()，並新增專屬技能。',
    keyPoint: '子類別 is-a 父類別：繼承能讓程式結構更清晰、易於維護與擴展。',
    quiz: {
      question: '在子類別中呼叫 super().__init__(name, energy) 的主要目的為何？',
      options: [
        '刪除父類別的所有方法',
        '重複使用父類別的初始化邏輯來設定共有屬性',
        '強制將物件轉換成字串',
        '加快網頁佈署的速度',
      ],
      correctIndex: 1,
      explanation: 'super() 代表父類別，呼叫 super().__init__() 可以避免重寫相同的屬性初始化程式碼。',
    },
  },
];

export const BLUEPRINT_TEMPLATES: Record<BlueprintKey, BlueprintTemplate> = {
  ForestSpirit: {
    key: 'ForestSpirit',
    chineseName: '森林小精靈',
    className: 'ForestSpirit',
    subclassName: 'ElderSpirit',
    defaultNames: ['小芽', '露露', '橡果君', '苔苔'],
    attributeLabel: '元氣能量',
    attributeUnit: 'pts',
    primaryMethod: {
      name: 'study',
      label: '專注學習 study()',
      energyDelta: -15,
      levelDelta: 1,
      logTemplate: (name, energy, level) =>
        `${name} 翻開筆記本學習！等級提升至 Lv.${level}，剩餘能量 ${energy} pts`,
    },
    secondaryMethod: {
      name: 'rest',
      label: '喝茶休息 rest()',
      energyDelta: 25,
      levelDelta: 0,
      logTemplate: (name, energy) => `${name} 在桌燈旁休息片刻，元氣回復至 ${energy} pts`,
    },
    subclassMethod: {
      name: 'cast_bloom',
      label: '施展綻放 cast_bloom()',
      specialTrait: '螢光葉脈',
      logTemplate: (name, trait) =>
        `[子類別專屬] ${name} 啟動「${trait}」，照亮整張書桌並激發學習靈感！`,
    },
  },
  StudyBook: {
    key: 'StudyBook',
    chineseName: '魔法筆記書',
    className: 'StudyBook',
    subclassName: 'InteractiveBook',
    defaultNames: ['Python入門', '物件導向手冊', 'Git實戰指南', '演算法筆記'],
    attributeLabel: '書頁耐久',
    attributeUnit: '%',
    primaryMethod: {
      name: 'read_chapter',
      label: '研讀章節 read_chapter()',
      energyDelta: -10,
      levelDelta: 1,
      logTemplate: (name, energy, level) =>
        `已讀完《${name}》第 ${level} 章節，筆記熟練度提升（耐久 ${energy}%）`,
    },
    secondaryMethod: {
      name: 'bookmark',
      label: '整理書籤 bookmark()',
      energyDelta: 20,
      levelDelta: 0,
      logTemplate: (name, energy) => `已替《${name}》補上索引標籤，整潔度回復至 ${energy}%`,
    },
    subclassMethod: {
      name: 'run_snippet',
      label: '執行範例 run_snippet()',
      specialTrait: '即時互動範例',
      logTemplate: (name, trait) =>
        `[子類別專屬] 《${name}》透過「${trait}」在瀏覽器沙盒中直接驗證程式輸出！`,
    },
  },
  SmartLamp: {
    key: 'SmartLamp',
    chineseName: '暖光書桌燈',
    className: 'SmartLamp',
    subclassName: 'SolarLamp',
    defaultNames: ['琥珀桌燈', '森林夜燈', '星光提燈', '晨曦檯燈'],
    attributeLabel: '電量儲備',
    attributeUnit: '%',
    primaryMethod: {
      name: 'illuminate',
      label: '開啟照明 illuminate()',
      energyDelta: -15,
      levelDelta: 1,
      logTemplate: (name, energy, level) =>
        `${name} 切換至第 ${level} 段暖光照明，目前剩餘電量 ${energy}%`,
    },
    secondaryMethod: {
      name: 'recharge',
      label: '蓄電補充 recharge()',
      energyDelta: 30,
      levelDelta: 0,
      logTemplate: (name, energy) => `${name} 接上電源進行充電，電量已回升至 ${energy}%`,
    },
    subclassMethod: {
      name: 'auto_dimming',
      label: '智慧調光 auto_dimming()',
      specialTrait: '日光感測器',
      logTemplate: (name, trait) =>
        `[子類別專屬] ${name} 透過「${trait}」自動平衡環境色溫，保護視力！`,
    },
  },
};

export const CREATION_TRACE_STEPS = [
  {
    id: 0,
    label: '1. 讀取呼叫指令',
    detail: 'Python 解析器收到建立實例的請求，準備尋找對應的類別藍圖。',
  },
  {
    id: 1,
    label: '2. 配置記憶體空間',
    detail: '向系統申請一塊全新且獨立的 Heap 記憶體位址，避免與其他物件衝突。',
  },
  {
    id: 2,
    label: '3. 執行 __init__ 綁定 self',
    detail: '自動呼叫 __init__(self, ...)，將剛分配的記憶體參考綁定到 self 變數。',
  },
  {
    id: 3,
    label: '4. 寫入屬性並回傳實例',
    detail: '將參數寫入 self.__dict__ 後，把完整的物件參考交給左側變數名稱。',
  },
];

export interface ChecklistTask {
  id: 'python-oop' | 'github-upload' | 'netlify-deploy';
  step: string;
  title: string;
  description: string;
}

export const COURSE_CHECKLIST: ChecklistTask[] = [
  {
    id: 'python-oop',
    step: '階段 01',
    title: '建立 Python 類別與物件學習網頁',
    description: '理解 class、__init__、self 與繼承概念，並完成互動沙盒測驗或下載網頁範本。',
  },
  {
    id: 'github-upload',
    step: '階段 02',
    title: '上傳專案程式碼至 GitHub',
    description: '建立 Repository，透過 git init、add、commit 與 push 將網頁推上遠端雲端。',
  },
  {
    id: 'netlify-deploy',
    step: '階段 03',
    title: '連結 GitHub 並佈署至 Netlify',
    description: '匯入 GitHub 儲存庫並設定發佈目錄，取得全球可存取的 HTTPS 線上學習網址。',
  },
];

export function generateStudentStarterHtml(repoName: string, username: string): string {
  const safeRepo = repoName.trim() || 'python-oop-study';
  const safeUser = username.trim() || 'student';
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Python 類別與物件學習筆記 | ${safeRepo}</title>
  <style>
    :root {
      --bg: #f8fafc;
      --card: #ffffff;
      --text: #1e293b;
      --muted: #64748b;
      --accent: #2b7bbb;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Noto Sans TC", system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.65;
    }
    .container {
      max-width: 920px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 20px;
      margin-bottom: 32px;
    }
    h1 {
      margin: 0 0 8px 0;
      color: var(--accent);
      font-size: 2rem;
    }
    .meta {
      color: var(--muted);
      font-size: 0.9rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
    }
    pre {
      background: #0f172a;
      color: #e2e8f0;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.875rem;
    }
    button {
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 0.95rem;
      cursor: pointer;
    }
    button:hover { opacity: 0.92; }
    #output {
      margin-top: 16px;
      padding: 14px;
      background: #f1f5f9;
      border-radius: 8px;
      font-family: ui-monospace, monospace;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Python 類別與物件學習網頁</h1>
      <div class="meta">作者：${safeUser} · 專案：${safeRepo} · AI融入課程實作成果</div>
    </header>

    <section class="grid">
      <div class="card">
        <h2>1. 類別藍圖 (Class)</h2>
        <p>使用 <code>class</code> 定義物件的屬性與方法，透過 <code>__init__</code> 初始化資料。</p>
        <pre>class ForestSpirit:
    def __init__(self, name, energy=100):
        self.name = name
        self.energy = energy

    def study(self):
        self.energy -= 15
        return f"{self.name} 學習中，剩餘能量 {self.energy}"</pre>
      </div>

      <div class="card">
        <h2>2. 互動物件實例測試</h2>
        <p>點擊下方按鈕模擬 Python 建立物件並呼叫 <code>study()</code> 方法。</p>
        <button onclick="runSimulation()">建立物件並呼叫 study()</button>
        <div id="output">等待執行實例化...</div>
      </div>
    </section>
  </div>

  <script>
    class ForestSpirit {
      constructor(name, energy = 100) {
        this.name = name;
        this.energy = energy;
      }
      study() {
        this.energy = Math.max(0, this.energy - 15);
        return \`\${this.name} 學習中，剩餘能量：\${this.energy} pts\`;
      }
    }
    const spirit = new ForestSpirit("小芽", 100);
    function runSimulation() {
      document.getElementById("output").textContent = spirit.study();
    }
  </script>
</body>
</html>
`;
}

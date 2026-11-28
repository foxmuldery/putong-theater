/* ==========================================================================
   《便便日记》V8.2 — Interactive Needle-Felted Wool Toy Theater App
   Red-Team Hardened · Zero Dependencies · 100% LocalStorage
   ========================================================================== */

(() => {
  'use strict';

  const STORAGE_KEY = 'bb_diary_state_v8_2';
  const GATE_SESSION_KEY = 'bb_diary_gate_unlocked_v8';
  const GATE_EXPECTED_HASH = 0x95d40b46; // passcode: tiger

  // --------------------------------------------------------------------------
  // 1. Core Clinical & Wool-Felt Constants (Non-Food, Factual Physical Descriptors)
  // --------------------------------------------------------------------------
  const BRISTOL_TOYS = [
    {
      type: 1,
      name: '硬球小团',
      shortName: '1型 硬颗粒',
      physicalDesc: '分离硬球或颗粒状，难以排出',
      img: 'assets/felt/bristol_1.jpg',
      advice: '形态偏干硬，可留意饮水与膳食纤维摄入',
      clinicalLabel: '1型（分离硬颗粒）',
      statusText: '偏干硬',
      statusClass: 'status-dry'
    },
    {
      type: 2,
      name: '疙瘩小团',
      shortName: '2型 凹凸块',
      physicalDesc: '香肠状但表面凹凸不平、呈团块粘连',
      img: 'assets/felt/bristol_2.jpg',
      advice: '形态略干结，建议循序补水并温和活动',
      clinicalLabel: '2型（凹凸团块状）',
      statusText: '略偏干',
      statusClass: 'status-dry'
    },
    {
      type: 3,
      name: '微裂小团',
      shortName: '3型 表面微裂',
      physicalDesc: '条状成型，表面带有细小裂纹',
      img: 'assets/felt/bristol_3.jpg',
      advice: '常见成型范围，保持日常饮水节律即可',
      clinicalLabel: '3型（表面微裂条状）',
      statusText: '常见成型',
      statusClass: 'status-good'
    },
    {
      type: 4,
      name: '丝滑金冠团',
      shortName: '4型 光滑柔软',
      physicalDesc: '光滑柔软的条状，易于排出',
      img: 'assets/felt/bristol_4.jpg',
      advice: '常见理想成型状态，继续保持温和作息',
      clinicalLabel: '4型（光滑柔软条状）',
      statusText: '光滑成型',
      statusClass: 'status-good'
    },
    {
      type: 5,
      name: '软绵小绒团',
      shortName: '5型 柔软块状',
      physicalDesc: '边缘清晰的柔软团块，排出较轻松',
      img: 'assets/felt/bristol_5.jpg',
      advice: '形态略偏软，留意饮食规律与纤维平衡',
      clinicalLabel: '5型（边缘清晰软块）',
      statusText: '略偏软',
      statusClass: 'status-soft'
    },
    {
      type: 6,
      name: '松散绒团',
      shortName: '6型 糊状松散',
      physicalDesc: '边缘蓬松不规则的糊状软便',
      img: 'assets/felt/bristol_6.jpg',
      advice: '形态偏稀松，注意清淡饮食、补水与休息',
      clinicalLabel: '6型（糊状松散）',
      statusText: '糊状偏稀',
      statusClass: 'status-soft'
    },
    {
      type: 7,
      name: '小水洼团',
      shortName: '7型 水样无固体',
      physicalDesc: '完全水样，不含固体块',
      img: 'assets/felt/bristol_7.jpg',
      advice: '水样稀便注意及时补液，若持续或伴发热腹痛请及时就医',
      clinicalLabel: '7型（完全水样）',
      statusText: '水样稀便',
      statusClass: 'status-soft'
    }
  ];

  const COLOR_OPTIONS = [
    { id: 'golden', name: '黄棕/金黄', sub: '常见', swatch: '#C99638', redFlag: false },
    { id: 'brown', name: '黄褐/深棕', sub: '常见', swatch: '#8B5E34', redFlag: false },
    { id: 'green', name: '偏绿', sub: '绿叶菜/偏快', swatch: '#6B8450', redFlag: false },
    { id: 'black', name: '柏油黑', sub: '需留意', swatch: '#282524', redFlag: true },
    { id: 'red', name: '鲜红/暗红', sub: '需留意', swatch: '#9E342E', redFlag: true },
    { id: 'clay', name: '陶土灰白', sub: '需留意', swatch: '#B8B0A0', redFlag: true }
  ];

  const EASE_OPTIONS = ['顺畅', '费力', '急促'];
  const TRIGGER_TAGS = ['咖啡', '辛辣', '乳制品', '饮酒', '熬夜', '压力大', '饮水少', '久坐', '服药/补剂'];
  const DURATION_CYCLE = [null, 120, 240, 360, 480]; // null = 未记录

  const HERO_POSES = {
    default: 'assets/felt/stage_hero_felt.jpg',
    sitting: 'assets/felt/stage_hero_sitting.jpg',
    effort: 'assets/felt/stage_hero_effort.jpg',
    overtime: 'assets/felt/stage_hero_overtime.jpg',
    victory: 'assets/felt/stage_hero_victory.jpg'
  };

  const DOCTOR_POSES = {
    default: 'assets/felt/stage_doctor_bear.jpg',
    checkup: 'assets/felt/doctor_orange_checkup.jpg',
    diet: 'assets/felt/doctor_orange_diet.jpg',
    earnest: 'assets/felt/doctor_orange_earnest.jpg',
    relieved: 'assets/felt/doctor_orange_relieved.jpg'
  };

  const CAMOUFLAGE_SKINS = [
    { id: 'default', name: '便便日记', desc: '原始手工毛毡剧场外观（可在下方一键换皮）', badge: '日记' },
    { id: 'notes', name: '随手备忘', desc: '伪装为极简日常备忘录标题与图标', badge: '备忘' },
    { id: 'weather', name: '晴雨笔记', desc: '伪装为轻柔天气手账外观', badge: '晴雨' },
    { id: 'water', name: '饮水时钟', desc: '伪装为日常喝水与作息记录', badge: '饮水' }
  ];

  // Decoupled Aesthetic Poster Quotes (Zero Bristol / Zero Score / Zero Timestamp / Unified Brand)
  const POSTER_QUOTES = [
    '今天也有好好照顾自己。',
    '慢一点也没关系，给身体留五分钟。',
    '多喝一杯温水，保持温柔节律。',
    '在手工毛毡的小剧场里，接住今天的自己。'
  ];

  // 1v1 Zero-Privacy Wool-Felt Care Stickers
  const CARE_STICKERS = {
    tissue: {
      id: 'tissue',
      img: 'assets/felt/bristol_4.jpg',
      title: '递一张毛毡纸巾',
      body: '今天也辛苦啦，慢慢来别着急，照顾好自己的小肚子。',
      caption: '《便便日记》递给你一张软乎乎的毛毡纸巾：今天也辛苦啦，慢慢来，别忘了多喝温水照顾自己。'
    },
    water: {
      id: 'water',
      img: 'assets/felt/bristol_3.jpg',
      title: '投喂一杯温水',
      body: '忙碌间隙记得喝几口温水，给肠胃一点温和的缓冲时间。',
      caption: '《便便日记》给你递来一杯温水：忙完手头的事记得歇一歇，照顾好身体节律呀。'
    },
    hug: {
      id: 'hug',
      img: 'assets/felt/bristol_5.jpg',
      title: '抱抱暖心毛毡团',
      body: '状态有起伏很正常，不用给身体打分，今晚早点休息。',
      caption: '《便便日记》送你一只软绵绵的毛毡拥抱：状态起起伏伏都很正常，今晚好好休息。'
    }
  };

  // Immediate Emergency Red-Flag Notice (Always visible BEFORE any triage questions)
  const EMERGENCY_BANNER_COPY = {
    blood: '若出现大量便血、暗红血块、头晕心慌、出冷汗、剧烈腹痛或晕厥感，请跳过问卷立即前往急诊。',
    black: '若出现柏油样发亮黑便伴头晕黑矇、心慌出冷汗、呕血或咖啡样呕吐物，请跳过问卷立即前往急诊。',
    pale: '若伴随皮肤/眼白发黄（黄疸）、寒战高热、右上腹剧痛或剧烈恶心呕吐，请跳过问卷立即前往急诊。',
    alarm: '若出现频繁水样泻伴明显口干少尿（脱水）、持续高热（≥38.5℃）、剧烈腹痛或意识淡漠，请立即就医/急诊。'
  };

  // Strictly Isolated Per-Reason Triage Questions (Zero Cross-Wiring!)
  const CARE_TRIAGE_QUESTIONS = {
    blood: [
      {
        key: 'dye',
        q: '最近 48 小时内，是否食用过红心火龙果、甜菜根、大量番茄酱或红色素食物？',
        options: [
          { value: 'yes', label: '有明确食用过' },
          { value: 'no', label: '没有吃过这类食物' },
          { value: 'unsure', label: '不确定 / 记不清了' }
        ]
      },
      {
        key: 'pattern',
        q: '红色在本次排便中主要呈现为哪种情况？',
        options: [
          { value: 'mild', label: '仅厕纸少量鲜红擦拭感，或排便后短暂滴血' },
          { value: 'high', label: '混在粪便内部 / 暗红血块 / 多次反复出现' }
        ]
      },
      {
        key: 'systemic',
        q: '目前是否伴随以下身体不适？',
        options: [
          { value: 'none', label: '无明显全身不适，精神如常' },
          { value: 'moderate', label: '肛周疼痛、里急后重或轻中度腹痛' },
          { value: 'severe', label: '大量出血、头晕心慌、出冷汗、剧烈腹痛或发热' }
        ]
      }
    ],
    black: [
      {
        key: 'dye',
        q: '最近 48 小时内，是否食用动物血/猪肝，或服用铁剂、铋剂（如枸橼酸铋钾）、活性炭？',
        options: [
          { value: 'yes', label: '有食用动物血或服用铁剂/铋剂' },
          { value: 'no', label: '没有上述饮食或药物史' },
          { value: 'unsure', label: '不确定 / 记不清了' }
        ]
      },
      {
        key: 'pattern',
        q: '本次发黑粪便的质地与持续时间更接近哪一项？',
        options: [
          { value: 'mild', label: '成型偏黑、无明显腥臭，且为首次出现' },
          { value: 'high', label: '柏油样发亮黏腻、有腥臭味，或连续 ≥2 天发黑' }
        ]
      },
      {
        key: 'systemic',
        q: '目前是否伴随以下身体不适？',
        options: [
          { value: 'none', label: '无明显全身不适，精神如常' },
          { value: 'moderate', label: '上腹隐痛、反酸烧心或轻度恶心' },
          { value: 'severe', label: '头晕黑矇、心慌出冷汗、呕血或咖啡样呕吐物' }
        ]
      }
    ],
    pale: [
      {
        key: 'dye',
        q: '近期是否做过消化道钡餐造影，或服用较大剂量的含铝/含钙抗酸药物？',
        options: [
          { value: 'yes', label: '近期做过钡餐或服过相关抗酸药' },
          { value: 'no', label: '没有上述检查或用药' },
          { value: 'unsure', label: '不确定 / 记不清了' }
        ]
      },
      {
        key: 'pattern',
        q: '灰白色变化与小便颜色情况如何？',
        options: [
          { value: 'mild', label: '仅单次颜色略浅，小便颜色正常' },
          { value: 'high', label: '明显陶土灰白 / 连续 ≥2 次 / 或小便呈浓茶色' }
        ]
      },
      {
        key: 'systemic',
        q: '目前是否伴随以下症状？',
        options: [
          { value: 'none', label: '无明显不适，无皮肤发黄' },
          { value: 'moderate', label: '食欲明显下降、厌油腻或右上腹闷胀' },
          { value: 'severe', label: '皮肤或眼白发黄（黄疸）、寒战高热或右上腹剧痛' }
        ]
      }
    ],
    alarm: [
      {
        key: 'dye',
        q: '最近 48 小时内，是否有明确外出就餐、生冷食物或旅行饮食变化？',
        options: [
          { value: 'yes', label: '有明确饮食变化或生冷进食' },
          { value: 'no', label: '无明显饮食诱因' },
          { value: 'unsure', label: '不确定' }
        ]
      },
      {
        key: 'pattern',
        q: '过去 24 小时内水样稀便的频率如何？',
        options: [
          { value: 'mild', label: '1–2 次，能正常少量多次喝水' },
          { value: 'high', label: '≥3 次、夜间痛醒，或夹带黏液/脓血' }
        ]
      },
      {
        key: 'systemic',
        q: '目前是否伴随脱水或全身警示症状？',
        options: [
          { value: 'none', label: '精神尚可，小便量正常' },
          { value: 'moderate', label: '明显口渴乏力、阵发腹痛或低热' },
          { value: 'severe', label: '口干少尿/无尿、高热 ≥38.5℃、剧烈腹痛或意识淡漠' }
        ]
      }
    ]
  };

  // --------------------------------------------------------------------------
  // 2. WebAudio Gentle Tactile Engine (Respects Global & Cutscene Mute)
  // --------------------------------------------------------------------------
  const FeltAudio = (() => {
    let ctx = null;
    function ensureCtx() {
      if (!state?.settings?.soundEnabled) return null;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      if (!ctx) ctx = new Ctx();
      if (ctx.state === 'suspended') {
        try { ctx.resume(); } catch (_) {}
      }
      return ctx;
    }

    function playTone(freq, dur = 0.08, type = 'sine', gainVal = 0.06, slideTo = null) {
      const c = ensureCtx();
      if (!c) return;
      try {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, c.currentTime);
        if (slideTo) {
          osc.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
        }
        gain.gain.setValueAtTime(0.0001, c.currentTime);
        gain.gain.linearRampToValueAtTime(gainVal, c.currentTime + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + dur + 0.02);
      } catch (_) {}
    }

    return {
      softTap() { playTone(420, 0.055, 'triangle', 0.045, 340); },
      toyBounce() { playTone(320, 0.09, 'sine', 0.055, 520); },
      gentleSave() {
        playTone(440, 0.11, 'sine', 0.05, 523);
        setTimeout(() => playTone(659, 0.16, 'sine', 0.045), 90);
      },
      careBell() { playTone(392, 0.18, 'sine', 0.045, 330); }
    };
  })();

  // --------------------------------------------------------------------------
  // 3. State & Seed Helpers (Strict Demo vs Personal Isolation)
  // --------------------------------------------------------------------------
  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function toDateKey(ts) {
    const d = new Date(ts);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function toLocalDateTimeInputValue(ts) {
    const d = new Date(ts);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }

  function formatDuration(sec) {
    if (sec === null || sec === undefined || Number.isNaN(Number(sec))) return '未记录';
    const s = Math.max(0, Math.floor(Number(sec)));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    if (m === 0) return `${rem} 秒`;
    return `${m} 分 ${pad2(rem)} 秒`;
  }

  function formatMMSS(sec) {
    const s = Math.max(0, Math.floor(Number(sec) || 0));
    return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
  }

  function formatShortTime(ts) {
    const d = new Date(ts);
    const todayKey = toDateKey(Date.now());
    const yestKey = toDateKey(Date.now() - 86400000);
    const k = toDateKey(ts);
    const hm = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    if (k === todayKey) return `今天 ${hm}`;
    if (k === yestKey) return `昨天 ${hm}`;
    return `${d.getMonth() + 1}月${d.getDate()}日 ${hm}`;
  }

  function formatFullDate(ts) {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }

  function getToy(type) {
    return BRISTOL_TOYS.find((t) => t.type === Number(type)) || null;
  }

  function getColor(id) {
    return COLOR_OPTIONS.find((c) => c.id === id) || null;
  }

  function normalizeCareReason(raw) {
    if (raw === 'red' || raw === 'blood') return 'blood';
    if (raw === 'black') return 'black';
    if (raw === 'clay' || raw === 'pale') return 'pale';
    if (raw === 'alarm' || raw === 'bristol7_streak') return 'alarm';
    return 'alarm';
  }

  function buildSeedToilets() {
    return [
      {
        id: 't_home',
        name: '家里主卫',
        area: '私人日常',
        scope: 'private',
        air: 5,
        clean: 5,
        tags: ['有纸', '温水马桶', '安静'],
        note: '最放松的主场，脚踏凳高度正好'
      },
      {
        id: 't_office',
        name: '公司 12F 东侧单间',
        area: '办公楼',
        scope: 'private',
        air: 4,
        clean: 4,
        tags: ['通风好', '有信号', '人少'],
        note: '午休前后较空，隔音比西侧好'
      },
      {
        id: 't_mall',
        name: '商圈 B1 静音隔间',
        area: '公共备选',
        scope: 'public',
        air: 4,
        clean: 5,
        tags: ['保洁勤', '有挂钩', '有纸'],
        note: '外出应急优选，洗手池干净'
      }
    ];
  }

  function buildSeedDemoLogs() {
    const now = Date.now();
    const day = 86400000;
    const mk = (daysAgo, hour, min, bristol, color, ease, durationSec, triggers, memo, toiletId, entryType = 'bm') => {
      const d = new Date(now - daysAgo * day);
      d.setHours(hour, min, 0, 0);
      return {
        id: `demo_${daysAgo}_${hour}_${min}`,
        ts: d.getTime(),
        isDemo: true,
        entryType,
        bristol,
        color,
        ease,
        durationSec,
        triggers: triggers || [],
        memo: memo || '',
        toiletId: toiletId || 't_home',
        careTriage: null
      };
    };

    // 14-day realistic demo logs (clearly tagged isDemo: true, includes 1 explicit no_bm day & varied missingness)
    return [
      mk(0, 8, 22, 4, 'golden', '顺畅', 248, ['咖啡'], '晨起温水后很轻松', 't_home'),
      mk(1, 9, 10, 3, 'brown', '顺畅', 310, ['久坐'], '', 't_office'),
      mk(2, 21, 15, null, null, null, null, ['熬夜'], '出门在外未排便', null, 'no_bm'),
      mk(3, 8, 45, 4, 'golden', '顺畅', 225, [], '', 't_home'),
      mk(4, 14, 18, 6, 'brown', '急促', 190, ['辛辣', '乳制品'], '中午吃了偏辣外食', 't_office'),
      mk(5, 8, 30, 4, 'golden', '顺畅', 260, ['咖啡'], '', 't_home'),
      mk(7, 10, 5, 2, 'brown', '费力', 440, ['饮水少', '熬夜'], '前一天喝水偏少', 't_home'),
      mk(8, 8, 40, 3, 'brown', '顺畅', 295, [], '', 't_home'),
      mk(9, 19, 25, 5, 'green', '顺畅', 210, [], '吃了很多绿叶菜', 't_home'),
      mk(11, 8, 50, 4, 'golden', '顺畅', 240, ['咖啡'], '', 't_office'),
      mk(12, 13, 12, 6, 'brown', '急促', 180, ['辛辣'], '', 't_mall'),
      mk(13, 8, 35, 4, 'brown', '顺畅', 270, [], '', 't_home')
    ].sort((a, b) => b.ts - a.ts);
  }

  function createDefaultState() {
    return {
      version: '8.2',
      logs: buildSeedDemoLogs(),
      toilets: buildSeedToilets(),
      activeSession: null,
      settings: {
        soundEnabled: true,
        cutsceneEnabled: true,
        reminderMin: 8,
        faceIdBlur: false,
        camouflage: 'default'
      },
      ui: {
        dataScope: 'demo',
        activeShareTab: 'single',
        posterActor: 4,
        posterQuoteIdx: 0,
        activeSticker: 'tissue',
        selectedTrendDate: null,
        selectedArchiveId: null
      }
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      const def = createDefaultState();
      const merged = {
        ...def,
        ...parsed,
        settings: { ...def.settings, ...(parsed.settings || {}) },
        ui: { ...def.ui, ...(parsed.ui || {}) },
        logs: Array.isArray(parsed.logs) ? parsed.logs : def.logs,
        toilets: Array.isArray(parsed.toilets) && parsed.toilets.length ? parsed.toilets : def.toilets,
        activeSession: parsed.activeSession || null
      };
      // Enforce valid dataScope
      if (merged.ui.dataScope !== 'personal' && merged.ui.dataScope !== 'demo') {
        merged.ui.dataScope = merged.logs.some((l) => !l.isDemo) ? 'personal' : 'demo';
      }
      return merged;
    } catch (_) {
      return createDefaultState();
    }
  }

  let state = loadState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  // --------------------------------------------------------------------------
  // 4. Red-Flag & Clinical Fact Logic
  // --------------------------------------------------------------------------
  function isBristol7Streak(targetEntry, allLogs) {
    if (!targetEntry || targetEntry.entryType !== 'bm' || targetEntry.bristol !== 7) return false;
    const pool = (allLogs || state.logs).filter(
      (l) => l.isDemo === targetEntry.isDemo && l.entryType === 'bm' && l.bristol === 7
    );
    const windowMs = 48 * 3600 * 1000;
    const nearby = pool.filter((l) => Math.abs(l.ts - targetEntry.ts) <= windowMs);
    const distinctDays = new Set(nearby.map((l) => toDateKey(l.ts)));
    return nearby.length >= 3 || distinctDays.size >= 2;
  }

  function getEntryRedFlagReason(entry, allLogs) {
    if (!entry || entry.entryType !== 'bm') return null;
    if (entry.color === 'red') return 'blood';
    if (entry.color === 'black') return 'black';
    if (entry.color === 'clay') return 'pale';
    if (entry.careTriage && entry.careTriage.reason) return normalizeCareReason(entry.careTriage.reason);
    if (isBristol7Streak(entry, allLogs)) return 'alarm';
    return null;
  }

  function isEntryRedFlag(entry, allLogs) {
    return Boolean(getEntryRedFlagReason(entry, allLogs));
  }

  function evaluateCareTriage(rawReason, ans) {
    const reason = normalizeCareReason(rawReason);
    const dye = ans?.dye || 'unsure';
    const pattern = ans?.pattern || 'mild';
    const systemic = ans?.systemic || 'none';

    // 1. Severe systemic warning -> IMMEDIATE EMERGENCY (explicitly separate from outpatient clinic)
    if (systemic === 'severe') {
      const severeMap = {
        blood: '你勾选了大量出血、头晕心慌、剧烈腹痛或发热等危险信号。请立即前往急诊科评估，避免独自久等。',
        black: '发黑/柏油样便伴随头晕黑矇、心慌出冷汗或呕血迹象，属于需紧急排查的上消化道出血警示，请立即前往急诊。',
        pale: '灰白便伴随皮肤/眼白发黄（黄疸）、寒战高热或右上腹剧痛，提示胆道梗阻或急性炎症风险，请立即前往急诊。',
        alarm: '频繁水样泻伴随明显脱水少尿、持续高热或剧烈腹痛，存在电解质紊乱与重症风险，请立即前往急诊。'
      };
      return {
        reason,
        level: 'emergency',
        badge: '立即急诊评估',
        department: '急诊科（优先）',
        title: '请跳过观察，立即前往急诊',
        explanation: severeMap[reason],
        pose: 'earnest'
      };
    }

    // 2. Tarry/persistent black stool -> ALWAYS urgent regardless of diet/iron history (ZERO contradiction!)
    if (reason === 'black' && pattern === 'high') {
      const exp =
        dye === 'yes'
          ? '虽然近期有食用动物血或服用铁剂/铋剂的记录，但“柏油样发亮黏腻 / 腥臭或连续 ≥2 天发黑”不能仅凭饮食或用药排除上消化道出血。建议尽快前往消化内科完成粪便潜血等检查。'
          : '未明确食用动物血或服用铁剂/铋剂，且呈现柏油样黏腻或连续发黑，需警惕上消化道出血可能，建议尽快前往消化内科检查。';
      return {
        reason,
        level: 'urgent',
        badge: '建议尽快就医',
        department: '建议科室：消化内科',
        title: '建议尽快安排消化内科检查',
        explanation: exp,
        pose: 'earnest'
      };
    }

    // 3. Other high-risk pattern or moderate systemic symptom -> Urgent outpatient
    if (pattern === 'high' || systemic === 'moderate') {
      const deptMap = {
        blood: '建议科室：消化内科 / 肛肠科',
        black: '建议科室：消化内科',
        pale: '建议科室：消化内科 / 肝胆外科',
        alarm: '建议科室：消化内科 / 肠道门诊'
      };
      const expMap = {
        blood:
          dye === 'yes'
            ? '尽管近期食用过红色素食物，但你反馈存在混入粪便内部、暗红血块、反复出现或伴腹痛/肛周不适，仅靠饮食无法排除出血，建议尽快就医化验大便隐血。'
            : '未明确食用红色素食物，且存在混入便中、暗红血块、反复出现或伴腹痛/肛周不适，建议尽快前往消化内科或肛肠科评估。',
        black:
          dye === 'yes'
            ? '虽然近期有食用动物血或铁剂/铋剂史，但同时伴有上腹隐痛、反酸或恶心，建议尽快前往消化内科检查以稳妥排除出血。'
            : '未明确食用动物血或铁剂/铋剂且伴有上腹不适，建议尽快前往消化内科检查粪便隐血。',
        pale:
          dye === 'yes'
            ? '尽管近期做过钡餐或服过抗酸药，但若出现明显陶土灰白、连续 ≥2 次、小便浓茶色或右上腹闷胀，仍建议尽快前往消化内科/肝胆外科评估肝胆功能。'
            : '无明确钡餐或抗酸药史，且出现明显陶土灰白、持续变浅、小便浓茶色或右上腹不适，建议尽快前往消化内科或肝胆外科检查肝功能与胆道超声。',
        alarm:
          '24 小时内水样泻频次偏高或已伴随口渴乏力、腹痛/低热，请注意补充口服补液盐并尽快就医明确病因。'
      };
      return {
        reason,
        level: 'urgent',
        badge: '建议尽快就医',
        department: deptMap[reason],
        title: '建议尽快预约门诊评估',
        explanation: expMap[reason],
        pose: 'earnest'
      };
    }

    // 4. Plausible diet/medication + mild pattern + zero systemic -> Observe 24-48h
    if (dye === 'yes' && pattern === 'mild' && systemic === 'none') {
      const obsDietMap = {
        blood: '结合近期食用红心火龙果/甜菜根等红色素食物，且无全身不适，目前饮食染色可能性较高。可先观察 24–48 小时，若停食后仍发红或出现腹痛请及时就医。',
        black: '结合近期食用动物血或服用铁剂/铋剂，且本次为首次成型偏黑、无全身不适，目前食物/药物染色可能性较高。可继续观察 24–48 小时，若转为柏油黏腻或停用后持续发黑请及时就医。',
        pale: '结合近期钡餐造影或抗酸药史，且仅单次略浅、小便正常无不适，可先观察 24–48 小时。若颜色持续灰白或出现小便加深、皮肤发黄请立即就医。',
        alarm: '结合近期饮食变化且目前水样便次数较少、可正常饮水，可先清淡饮食并少量多次补液观察 24 小时；若次数增多或发热请及时就医。'
      };
      return {
        reason,
        level: 'observe',
        badge: '先观察 24–48 小时',
        department: '暂居家观察',
        title: '可先居家观察，留意下一次变化',
        explanation: obsDietMap[reason],
        pose: 'relieved'
      };
    }

    // 5. No clear diet cause but mild + no systemic -> Close observation
    const mildUnknownMap = {
      blood: '未明确红色食物史，虽目前仅少量擦拭感且无全身不适，仍建议记录下 1–2 次变化；若再次见红或持续超过 48 小时，请前往肛肠科或消化内科排查。',
      black: '未明确动物血或铁剂/铋剂史，虽目前成型且无全身不适，仍建议密切观察下 1–2 次排便颜色；若继续发黑，请尽快前往消化内科做粪便潜血检查。',
      pale: '无明确钡餐或抗酸药史，虽仅单次偏浅且小便正常，仍请留意随后 24–48 小时大便与小便颜色；若仍偏灰白请前往消化内科检查。',
      alarm: '目前频率尚可且无脱水表现，建议清淡饮食、及时补液并观察 24 小时；若持续未缓解或出现发热、腹痛请及时就医。'
    };
    const fallbackDept = {
      blood: '观察 · 必要时肛肠/消化科',
      black: '观察 · 必要时消化内科',
      pale: '观察 · 必要时消化/肝胆科',
      alarm: '观察 · 必要时消化内科'
    };
    return {
      reason,
      level: 'observe',
      badge: '密切观察 · 必要时就医',
      department: fallbackDept[reason],
      title: '建议记录后续变化，持续则就医',
      explanation: mildUnknownMap[reason],
      pose: 'diet'
    };
  }

  // --------------------------------------------------------------------------
  // 5. Scoped Factual Statistics (ZERO Fabricated Offsets, 100% Reconciled Math)
  // --------------------------------------------------------------------------
  function getScopedLogs(scope) {
    const s = scope || state.ui.dataScope;
    const isDemoTarget = s === 'demo';
    return state.logs
      .filter((l) => Boolean(l.isDemo) === isDemoTarget)
      .slice()
      .sort((a, b) => b.ts - a.ts);
  }

  function getPersonalLogs() {
    return state.logs
      .filter((l) => !l.isDemo)
      .slice()
      .sort((a, b) => b.ts - a.ts);
  }

  function getDisplayLatestLog() {
    const scoped = getScopedLogs(state.ui.dataScope);
    if (scoped.length) return scoped[0];
    return state.logs[0] || null;
  }

  function compute7DayStats(logs) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = toDateKey(d.getTime());
      const entries = logs.filter((l) => toDateKey(l.ts) === key);
      const bmEntries = entries.filter((l) => l.entryType === 'bm');
      const noBmEntries = entries.filter((l) => l.entryType === 'no_bm');
      const hasRedFlag = bmEntries.some((e) => isEntryRedFlag(e, logs));
      let status = 'nodata';
      if (bmEntries.length > 0) status = 'bm';
      else if (noBmEntries.length > 0) status = 'no_bm';
      days.push({
        dateKey: key,
        weekday: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        entries,
        bmEntries,
        noBmEntries,
        hasRedFlag,
        status,
        latestBm: bmEntries[0] || null
      });
    }

    const weekBm = days.flatMap((d) => d.bmEntries);
    const bmDaysCount = days.filter((d) => d.status === 'bm').length;
    const noBmDaysCount = days.filter((d) => d.status === 'no_bm').length;
    const noDataDaysCount = days.filter((d) => d.status === 'nodata').length;
    const colorFilled = weekBm.filter((e) => Boolean(e.color)).length;
    const easeFilled = weekBm.filter((e) => Boolean(e.ease)).length;
    const durationFilled = weekBm.filter((e) => e.durationSec !== null && e.durationSec !== undefined).length;
    const redFlagCount = weekBm.filter((e) => isEntryRedFlag(e, logs)).length;

    return {
      days,
      weekBm,
      totalBm: weekBm.length,
      bmDaysCount,
      noBmDaysCount,
      noDataDaysCount,
      colorFilled,
      easeFilled,
      durationFilled,
      redFlagCount
    };
  }

  function compute30DayStats(logs) {
    const cutoff = Date.now() - 30 * 86400000;
    const recent = logs.filter((l) => l.ts >= cutoff);
    const bmLogs = recent.filter((l) => l.entryType === 'bm');
    const noBmLogs = recent.filter((l) => l.entryType === 'no_bm');

    // Exact Bristol 1..7 counts + unknownBristol -> sum ALWAYS === bmLogs.length
    const bristolCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    let unknownBristol = 0;
    bmLogs.forEach((l) => {
      if (l.bristol >= 1 && l.bristol <= 7) bristolCounts[l.bristol] += 1;
      else unknownBristol += 1;
    });

    const idealCount = bristolCounts[3] + bristolCounts[4];
    const knownBristolTotal = bmLogs.length - unknownBristol;
    const idealRate = knownBristolTotal > 0 ? Math.round((idealCount / knownBristolTotal) * 100) : null;

    const durations = bmLogs.map((l) => l.durationSec).filter((v) => v !== null && v !== undefined && v > 0);
    const avgDurationSec = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null;

    const redFlagLogs = bmLogs.filter((l) => isEntryRedFlag(l, logs));
    const colorKnown = bmLogs.filter((l) => Boolean(l.color)).length;
    const easeKnown = bmLogs.filter((l) => Boolean(l.ease)).length;

    // Distinct active calendar days in past 30 days
    const bmDayKeys = new Set(bmLogs.map((l) => toDateKey(l.ts)));
    const noBmDayKeys = new Set(noBmLogs.map((l) => toDateKey(l.ts)).filter((k) => !bmDayKeys.has(k)));
    const recordedDays = bmDayKeys.size + noBmDayKeys.size;
    const unrecordedDays = Math.max(0, 30 - recordedDays);

    // Honest tag co-occurrence (frequency n only — NO fake causal percentages!)
    const tagMap = {};
    bmLogs.forEach((l) => {
      (l.triggers || []).forEach((tag) => {
        if (!tagMap[tag]) tagMap[tag] = { tag, total: 0, loose: 0, dry: 0, normal: 0 };
        tagMap[tag].total += 1;
        if (l.bristol === 6 || l.bristol === 7) tagMap[tag].loose += 1;
        else if (l.bristol === 1 || l.bristol === 2) tagMap[tag].dry += 1;
        else if (l.bristol === 3 || l.bristol === 4 || l.bristol === 5) tagMap[tag].normal += 1;
      });
    });
    const tagSummary = Object.values(tagMap).sort((a, b) => b.total - a.total);

    return {
      recent,
      bmLogs,
      noBmLogs,
      totalBm: bmLogs.length,
      totalNoBm: noBmLogs.length,
      bristolCounts,
      unknownBristol,
      knownBristolTotal,
      idealCount,
      idealRate,
      avgDurationSec,
      durationKnown: durations.length,
      colorKnown,
      easeKnown,
      redFlagLogs,
      bmDays: bmDayKeys.size,
      noBmDays: noBmDayKeys.size,
      unrecordedDays,
      tagSummary
    };
  }

  // --------------------------------------------------------------------------
  // 6. DOM Cache & UI Runtime State
  // --------------------------------------------------------------------------
  const $ = (id) => document.getElementById(id);

  let timerInterval = null;
  let activeSheetId = null;
  let cutsceneTimer = null;
  let stampHideTimer = null;

  let draft = {
    mode: 'backfill', // 'backfill' | 'session'
    ts: Date.now(),
    bristol: 4,
    color: null,
    ease: null,
    durationSec: null,
    triggers: [],
    memo: '',
    toiletId: null
  };

  let triageState = {
    active: false,
    reason: 'blood',
    step: 0,
    answers: {},
    entryId: null,
    result: null
  };

  let spotFormState = {
    scope: 'private',
    air: 4,
    clean: 4,
    tags: []
  };

  // --------------------------------------------------------------------------
  // 7. Stage, Poses, Toast Feedback & Camouflage
  // --------------------------------------------------------------------------
  function setHeroPose(poseKey) {
    const img = $('stageHeroImg');
    if (!img) return;
    const key = HERO_POSES[poseKey] ? poseKey : 'default';
    img.dataset.heroPose = key;
    if (img.getAttribute('src') !== HERO_POSES[key]) {
      img.setAttribute('src', HERO_POSES[key]);
    }
  }

  function setDoctorPose(poseKey) {
    const img = $('stageDoctorImg');
    if (!img) return;
    const key = DOCTOR_POSES[poseKey] ? poseKey : 'default';
    img.dataset.doctorPose = key;
    if (img.getAttribute('src') !== DOCTOR_POSES[key]) {
      img.setAttribute('src', DOCTOR_POSES[key]);
    }
  }

  function setAppMode(mode) {
    const shell = $('appShell');
    if (shell) shell.dataset.mode = mode === 'care' ? 'care' : 'theater';
  }

  function showStampFeedback(text, imgSrc) {
    const wrap = $('stampFeedback');
    const txt = $('stampFeedbackText');
    const img = $('stampFeedbackImg');
    if (!wrap || !txt) return;
    txt.textContent = text;
    if (img) {
      if (imgSrc) {
        img.src = imgSrc;
        img.hidden = false;
      } else {
        img.hidden = true;
      }
    }
    wrap.hidden = false;
    wrap.classList.remove('is-visible');
    void wrap.offsetWidth;
    wrap.classList.add('is-visible');
    clearTimeout(stampHideTimer);
    stampHideTimer = setTimeout(() => {
      wrap.classList.remove('is-visible');
      setTimeout(() => {
        wrap.hidden = true;
      }, 220);
    }, 2400);
  }

  function applyCamouflage() {
    const skin = CAMOUFLAGE_SKINS.find((s) => s.id === state.settings.camouflage) || CAMOUFLAGE_SKINS[0];
    document.body.dataset.camouflage = skin.id;
    const brandTitle = $('brandTitle');
    const brandSub = $('brandSubtitle');
    if (brandTitle) brandTitle.textContent = skin.name;
    if (brandSub) {
      brandSub.textContent = skin.id === 'default' ? '手工毛毡剧场' : '日常轻记录';
    }
    const prevIcon = $('camouflagePreviewIcon');
    const prevName = $('camouflagePreviewName');
    const prevDesc = $('camouflagePreviewDesc');
    if (prevIcon) prevIcon.dataset.skin = skin.id;
    if (prevName) prevName.textContent = skin.name;
    if (prevDesc) prevDesc.textContent = skin.desc;

    document.body.classList.toggle('is-privacy-blur', Boolean(state.settings.faceIdBlur));
    const faceBtn = $('faceIdToggleBtn');
    if (faceBtn) faceBtn.setAttribute('aria-pressed', String(Boolean(state.settings.faceIdBlur)));
    const privLbl = $('privacyPillLabel');
    if (privLbl) privLbl.textContent = state.settings.faceIdBlur ? '伪装隐私：已遮罩' : '伪装隐私';
  }

  function syncSettingsUI() {
    const soundBtn = $('soundToggleBtn');
    if (soundBtn) {
      soundBtn.setAttribute('aria-pressed', String(Boolean(state.settings.soundEnabled)));
      soundBtn.textContent = state.settings.soundEnabled ? '🔊 音效：开' : '🔇 音效：关';
    }
    const cutBtn = $('cutscenePrefToggleBtn');
    const cutLbl = $('cutscenePrefLabel');
    if (cutBtn) cutBtn.setAttribute('aria-pressed', String(Boolean(state.settings.cutsceneEnabled)));
    if (cutLbl) cutLbl.textContent = state.settings.cutsceneEnabled ? '过场动画：开' : '过场动画：关';

    const muteBtn = $('cutsceneMuteBtn');
    if (muteBtn) muteBtn.textContent = state.settings.soundEnabled ? '🔊 静音' : '🔇 已静音';

    document.querySelectorAll('[data-reminder-min]').forEach((btn) => {
      const m = Number(btn.getAttribute('data-reminder-min'));
      const active = m === Number(state.settings.reminderMin || 8);
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  // --------------------------------------------------------------------------
  // 8. Persistent Active Sitting Timer (Survives Reload + Non-Destructive Snooze)
  // --------------------------------------------------------------------------
  function getSessionElapsedSec() {
    if (!state.activeSession || !state.activeSession.startedAt) return 0;
    return Math.max(0, Math.floor((Date.now() - state.activeSession.startedAt) / 1000));
  }

  function showSittingReminderToast(reminderMin) {
    const toast = $('eightMinToast');
    if (!toast) return;
    const tag = $('toastReminderTag');
    const quote = $('toastReminderQuote');
    if (tag) tag.textContent = `坐姿已满 ${reminderMin} 分钟`;
    if (quote) {
      quote.textContent = `你已静坐满 ${reminderMin} 分钟。若暂无便意，建议先起身活动放松，避免久坐增加肛周压力。`;
    }
    toast.hidden = false;
    FeltAudio.careBell();
  }

  function hideSittingReminderToast() {
    const toast = $('eightMinToast');
    if (toast) toast.hidden = true;
  }

  function updateSessionTick() {
    const timerDisplay = $('timerDisplay');
    const timerBig = $('sessionTimerBig');
    const timerHint = $('sessionTimerHint');
    const timerPill = $('timerPillBtn');

    if (!state.activeSession || !state.activeSession.running) {
      if (timerDisplay) timerDisplay.textContent = '00:00';
      if (timerPill) timerPill.classList.remove('is-running');
      return;
    }

    const sec = getSessionElapsedSec();
    const mmss = formatMMSS(sec);
    if (timerDisplay) timerDisplay.textContent = mmss;
    if (timerBig) timerBig.textContent = mmss;
    if (timerPill) timerPill.classList.add('is-running');

    const remMin = Number(state.activeSession.reminderMin || state.settings.reminderMin || 8);
    const remSec = remMin * 60;
    const snoozedUntil = Number(state.activeSession.snoozedUntilSec || 0);

    if (sec >= remSec) {
      setHeroPose('overtime');
      if (timerHint) timerHint.textContent = `已超过 ${remMin} 分钟提醒线，留意放松起身`;
    } else if (sec >= Math.floor(remSec * 0.6)) {
      setHeroPose('effort');
      if (timerHint) timerHint.textContent = `慢慢来，满 ${remMin} 分钟时会轻声提醒你`;
    } else {
      setHeroPose('sitting');
      if (timerHint) timerHint.textContent = `安心进行中 · ${remMin} 分钟时温和提醒`;
    }

    if (sec >= remSec && sec >= snoozedUntil) {
      const toast = $('eightMinToast');
      if (toast && toast.hidden) {
        showSittingReminderToast(remMin);
        // Prevent re-firing every second until snoozed or dismissed
        state.activeSession.snoozedUntilSec = sec + 3600;
        saveState();
      }
    }
  }

  function ensureTimerLoop() {
    if (timerInterval) clearInterval(timerInterval);
    if (state.activeSession && state.activeSession.running) {
      updateSessionTick();
      timerInterval = setInterval(updateSessionTick, 1000);
    }
  }

  function startPoopSession() {
    const defaultSpot = state.toilets[0] ? state.toilets[0].id : null;
    state.activeSession = {
      startedAt: Date.now(),
      running: true,
      reminderMin: Number(state.settings.reminderMin || 8),
      snoozedUntilSec: 0,
      toiletId: defaultSpot
    };
    saveState();
    hideSittingReminderToast();
    FeltAudio.toyBounce();
    renderHomeTheater();
    ensureTimerLoop();
  }

  function cancelPoopSession() {
    state.activeSession = null;
    saveState();
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    hideSittingReminderToast();
    setHeroPose('default');
    renderHomeTheater();
    showStampFeedback('已取消本次计时');
  }

  function snoozeSittingReminder() {
    if (!state.activeSession) {
      hideSittingReminderToast();
      return;
    }
    const elapsed = getSessionElapsedSec();
    // CRITICAL RED-TEAM FIX: Do NOT reset startedAt or timer seconds! Only defer next reminder by 5 minutes.
    state.activeSession.snoozedUntilSec = elapsed + 300;
    saveState();
    hideSittingReminderToast();
    FeltAudio.softTap();
    showStampFeedback('已延后 5 分钟提醒（保留总时长）');
  }

  function finishSessionAndOpenLog() {
    const elapsed = Math.max(1, getSessionElapsedSec());
    const toiletId = state.activeSession?.toiletId || null;
    state.activeSession = null;
    saveState();
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    hideSittingReminderToast();
    renderHomeTheater();
    openLogDrawer({ mode: 'session', durationSec: elapsed, toiletId });
  }

  // --------------------------------------------------------------------------
  // 9. Home Theater Rendering
  // --------------------------------------------------------------------------
  function renderHomeTheater() {
    const idleView = $('homeIdleView');
    const sessionView = $('homeSessionView');
    const redFlagCard = $('redFlagCard');
    const theaterCard = $('theaterCard');

    if (triageState.active) {
      setAppMode('care');
      if (theaterCard) theaterCard.hidden = true;
      if (redFlagCard) redFlagCard.hidden = false;
      return;
    }

    setAppMode('theater');
    if (redFlagCard) redFlagCard.hidden = true;
    if (theaterCard) theaterCard.hidden = false;

    const isRunning = Boolean(state.activeSession && state.activeSession.running);
    if (idleView) idleView.hidden = isRunning;
    if (sessionView) sessionView.hidden = !isRunning;

    if (isRunning) {
      const spot = state.toilets.find((t) => t.id === state.activeSession.toiletId) || state.toilets[0];
      const spotNameEl = $('sessionToiletName');
      if (spotNameEl) spotNameEl.textContent = spot ? spot.name : '未选坑位';
      updateSessionTick();
      return;
    }

    const latest = getDisplayLatestLog();
    const demoBadge = $('homeDemoBadge');
    const tagEl = $('latestBristolTag');
    const timeEl = $('latestTimeLabel');
    const headlineEl = $('comedyHeadline');
    const playbillText = $('playbillText');
    const thumbEl = $('latestToyThumb');
    const stampEl = $('stageStampBadge');

    if (!latest) {
      if (demoBadge) demoBadge.hidden = true;
      if (tagEl) tagEl.textContent = '尚无记录';
      if (timeEl) timeEl.textContent = '随时开始';
      if (headlineEl) headlineEl.textContent = '点击“开始大便”或“刚拉完 · 补记一笔”，留下你的第一条个人记录。';
      if (playbillText) playbillText.textContent = '记录仅保存在本地设备';
      if (stampEl) stampEl.textContent = '待记录';
      setHeroPose('default');
      return;
    }

    if (demoBadge) demoBadge.hidden = !latest.isDemo;
    if (timeEl) timeEl.textContent = formatShortTime(latest.ts);

    const isAbnormal = isEntryRedFlag(latest);
    if (latest.entryType === 'no_bm') {
      if (tagEl) tagEl.textContent = '今日未排便';
      if (headlineEl) headlineEl.textContent = '已明确记录为“今日未排便”，与漏记天数分开统计。';
      if (playbillText) playbillText.textContent = '无排便记录已存档';
      if (stampEl) stampEl.textContent = '无排便';
      setHeroPose('default');
    } else if (isAbnormal) {
      const col = getColor(latest.color);
      if (tagEl) tagEl.textContent = col ? `需留意 · ${col.name}` : '需留意 · 水样稀便';
      if (headlineEl) {
        headlineEl.textContent = '最近一条记录含异常提示，已切换为冷静档案展示，可在“档案”或“近30天摘要”中查看详情。';
      }
      if (playbillText) playbillText.textContent = '异常提示已静默归档';
      if (stampEl) stampEl.textContent = '需留意';
      setHeroPose('default');
    } else {
      const toy = getToy(latest.bristol);
      if (tagEl) tagEl.textContent = toy ? `${toy.type}型 · ${toy.name}` : '形态未选';
      if (thumbEl && toy) thumbEl.src = toy.img;
      if (headlineEl) {
        headlineEl.textContent = toy
          ? `${toy.physicalDesc}。${toy.advice}。`
          : '已按你的选择跳过形态，仅记录时间与个人备注。';
      }
      if (playbillText) {
        playbillText.textContent = latest.isDemo
          ? '当前展示示例预览 · 新增记录后自动切换个人模式'
          : `最近记录：${formatDuration(latest.durationSec)}`;
      }
      if (stampEl) stampEl.textContent = toy ? toy.statusText : '已存档';
      setHeroPose('default');
    }
  }

  // --------------------------------------------------------------------------
  // 10. Sheet Navigation Manager
  // --------------------------------------------------------------------------
  function openSheet(sheetId) {
    closeAllSheets(true);
    const sheet = $(sheetId);
    const scrim = $('sheetScrim');
    if (!sheet) return;
    activeSheetId = sheetId;
    if (scrim) scrim.hidden = false;
    sheet.hidden = false;
    const popover = $('moreMenuPopover');
    if (popover) popover.hidden = true;
    const moreBtn = $('moreMenuBtn');
    if (moreBtn) moreBtn.setAttribute('aria-expanded', 'false');
    FeltAudio.softTap();
  }

  function closeAllSheets(silent) {
    document.querySelectorAll('.felt-sheet').forEach((el) => {
      el.hidden = true;
    });
    const scrim = $('sheetScrim');
    if (scrim) scrim.hidden = true;
    activeSheetId = null;
    if (!silent) FeltAudio.softTap();
  }

  // --------------------------------------------------------------------------
  // 11. Sheet 1: Log Drawer (Backfill & Session Finish, Uncertain Options)
  // --------------------------------------------------------------------------
  function openLogDrawer(opts = {}) {
    const mode = opts.mode === 'session' ? 'session' : 'backfill';
    draft = {
      mode,
      ts: opts.ts || Date.now(),
      bristol: opts.bristol !== undefined ? opts.bristol : 4,
      color: opts.color !== undefined ? opts.color : null, // NEVER silent default brown!
      ease: opts.ease !== undefined ? opts.ease : null, // NEVER silent default!
      durationSec: mode === 'session' ? Math.max(1, Number(opts.durationSec || 1)) : null,
      triggers: Array.isArray(opts.triggers) ? opts.triggers.slice() : [],
      memo: opts.memo || '',
      toiletId: opts.toiletId || null
    };

    const titleEl = $('logDrawerTitle');
    if (titleEl) titleEl.textContent = mode === 'session' ? '记录本次排便' : '刚拉完 · 快速补记';

    const dtInput = $('logDateTimeInput');
    if (dtInput) dtInput.value = toLocalDateTimeInputValue(draft.ts);

    const memoInput = $('logMemoInput');
    if (memoInput) memoInput.value = draft.memo;

    renderLogDrawer();
    openSheet('logDrawer');
  }

  function renderLogDrawer() {
    // Duration pill
    const durLbl = $('logDurationLabel');
    if (durLbl) durLbl.textContent = formatDuration(draft.durationSec);

    // Bristol Rail with clear physical descriptor right inside each wool-felt card
    const rail = $('bristolRail');
    if (rail) {
      rail.innerHTML = BRISTOL_TOYS.map((toy) => {
        const isSel = draft.bristol === toy.type;
        return `
          <button
            class="bristol-card ${isSel ? 'is-selected' : ''}"
            type="button"
            data-bristol-type="${toy.type}"
            aria-pressed="${isSel}"
          >
            <div class="bristol-card-img-wrap">
              <img class="bristol-card-img" src="${toy.img}" alt="${toy.clinicalLabel}" />
            </div>
            <span class="bristol-card-num">${toy.type} 型</span>
            <strong class="bristol-card-name">${toy.name}</strong>
            <span class="v82-bristol-desc">${toy.physicalDesc}</span>
          </button>
        `;
      }).join('');
      const selCard = rail.querySelector('.bristol-card.is-selected');
      if (selCard && selCard.scrollIntoView) {
        try {
          selCard.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
        } catch (_) {}
      }
    }

    const uncBristolBtn = $('bristolUncertainBtn');
    if (uncBristolBtn) {
      const isNull = draft.bristol === null;
      uncBristolBtn.classList.toggle('is-active', isNull);
      uncBristolBtn.setAttribute('aria-pressed', String(isNull));
    }

    const selToy = getToy(draft.bristol);
    const nameEl = $('selectedBristolName');
    const statEl = $('selectedBristolStatus');
    const advEl = $('selectedBristolAdvice');
    if (selToy) {
      if (nameEl) nameEl.textContent = `${selToy.type}型 · ${selToy.name}`;
      if (statEl) {
        statEl.textContent = selToy.statusText;
        statEl.className = `bristol-status-pill ${selToy.statusClass}`;
      }
      if (advEl) advEl.textContent = `${selToy.physicalDesc} · ${selToy.advice}`;
    } else {
      if (nameEl) nameEl.textContent = '形态：不确定 / 已跳过';
      if (statEl) {
        statEl.textContent = '可不填';
        statEl.className = 'bristol-status-pill';
      }
      if (advEl) advEl.textContent = '不会强行归类为 4 型，档案与摘要将如实标为“未选形态”。';
    }

    // Color Grid + Uncertain button
    const colorGrid = $('colorGrid');
    if (colorGrid) {
      colorGrid.innerHTML = COLOR_OPTIONS.map((c) => {
        const isSel = draft.color === c.id;
        return `
          <button
            class="color-swatch-btn ${isSel ? 'is-selected' : ''} ${c.redFlag ? 'is-redflag' : ''}"
            type="button"
            data-color-id="${c.id}"
            aria-pressed="${isSel}"
          >
            <span class="color-swatch-dot" style="background:${c.swatch}"></span>
            <span class="color-swatch-copy">
              <strong>${c.name}</strong>
              <small>${c.sub}</small>
            </span>
          </button>
        `;
      }).join('');
    }

    const uncColorBtn = $('colorUncertainBtn');
    if (uncColorBtn) {
      const isNull = draft.color === null;
      uncColorBtn.classList.toggle('is-active', isNull);
      uncColorBtn.setAttribute('aria-pressed', String(isNull));
    }

    const selColor = getColor(draft.color);
    const rfHint = $('colorRedFlagHint');
    if (rfHint) {
      if (selColor && selColor.redFlag) {
        rfHint.hidden = false;
        rfHint.textContent = `已选“${selColor.name}”：保存后将跳过趣味过场，直接进入冷静自查与就医指引。`;
      } else {
        rfHint.hidden = true;
      }
    }

    // Ease buttons (toggleable, optional)
    const easeGroup = $('easeGroup');
    if (easeGroup) {
      easeGroup.innerHTML = EASE_OPTIONS.map((e) => {
        const isSel = draft.ease === e;
        return `
          <button class="ease-pill ${isSel ? 'is-active' : ''}" type="button" data-ease-val="${e}" aria-pressed="${isSel}">
            ${e}
          </button>
        `;
      }).join('');
    }

    // Triggers
    const trigWrap = $('triggerChips');
    if (trigWrap) {
      trigWrap.innerHTML = TRIGGER_TAGS.map((t) => {
        const isSel = draft.triggers.includes(t);
        return `
          <button class="trigger-chip ${isSel ? 'is-active' : ''}" type="button" data-trigger-val="${t}" aria-pressed="${isSel}">
            ${t}
          </button>
        `;
      }).join('');
    }

    // Toilet chips
    const toiletWrap = $('logToiletChips');
    if (toiletWrap) {
      toiletWrap.innerHTML = state.toilets
        .map((sp) => {
          const isSel = draft.toiletId === sp.id;
          const scopeLbl = sp.scope === 'public' ? '公共' : '私人';
          return `
            <button class="trigger-chip ${isSel ? 'is-active' : ''}" type="button" data-log-toilet="${sp.id}" aria-pressed="${isSel}">
              [${scopeLbl}] ${sp.name}
            </button>
          `;
        })
        .join('');
    }
  }

  function publishCurrentDraft() {
    const dtInput = $('logDateTimeInput');
    if (dtInput && dtInput.value) {
      const parsedTs = new Date(dtInput.value).getTime();
      if (!Number.isNaN(parsedTs)) draft.ts = parsedTs;
    }
    const memoInput = $('logMemoInput');
    draft.memo = memoInput ? memoInput.value.trim() : '';

    const entry = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ts: draft.ts,
      isDemo: false,
      entryType: 'bm',
      bristol: draft.bristol,
      color: draft.color,
      ease: draft.ease,
      durationSec: draft.durationSec,
      triggers: draft.triggers.slice(),
      memo: draft.memo,
      toiletId: draft.toiletId,
      careTriage: null
    };

    // SAVE-FIRST GUARANTEE: persist before any animation or triage!
    state.logs.unshift(entry);
    state.logs.sort((a, b) => b.ts - a.ts);
    state.ui.dataScope = 'personal';
    state.ui.selectedArchiveId = entry.id;
    saveState();

    closeAllSheets(true);
    renderHomeTheater();

    // Check red-flag trigger
    const rfReason = getEntryRedFlagReason(entry, state.logs);
    if (rfReason) {
      startCareTriage(rfReason, entry.id);
      return;
    }

    // Normal entry: cutscene (if enabled) -> Single Archive
    if (state.settings.cutsceneEnabled) {
      playFeltCutscene(entry, () => {
        openReportHub('single', entry.id);
      });
    } else {
      FeltAudio.gentleSave();
      showStampFeedback('已保存至个人档案');
      openReportHub('single', entry.id);
    }
  }

  function markNoBmToday() {
    const todayKey = toDateKey(Date.now());
    const existing = state.logs.find(
      (l) => !l.isDemo && l.entryType === 'no_bm' && toDateKey(l.ts) === todayKey
    );
    if (existing) {
      existing.ts = Date.now();
    } else {
      state.logs.unshift({
        id: `nobm_${Date.now()}`,
        ts: Date.now(),
        isDemo: false,
        entryType: 'no_bm',
        bristol: null,
        color: null,
        ease: null,
        durationSec: null,
        triggers: [],
        memo: '主动标记：今日未排便',
        toiletId: null,
        careTriage: null
      });
    }
    state.logs.sort((a, b) => b.ts - a.ts);
    state.ui.dataScope = 'personal';
    saveState();
    FeltAudio.gentleSave();
    renderHomeTheater();
    showStampFeedback('已记录：今日未排便（与未记录区分）');
  }

  // --------------------------------------------------------------------------
  // 12. Save-First Cutscene Overlay (With Working Mute & Skip, Non-Judgmental Seal)
  // --------------------------------------------------------------------------
  function playFeltCutscene(entry, onComplete) {
    const overlay = $('feltCutsceneOverlay');
    if (!overlay) {
      if (onComplete) onComplete();
      return;
    }
    const toy = getToy(entry.bristol);
    const epTag = $('cutsceneEpisodeTag');
    const mascot = $('cutsceneMascotImg');
    const title = $('cutscenePersonaTitle');
    const sub = $('cutscenePersonaSub');
    const sealGrade = $('cutsceneSealGrade');

    if (epTag) epTag.textContent = `《便便日记》· ${formatShortTime(entry.ts)}`;
    if (mascot) mascot.src = toy ? toy.img : 'assets/felt/bristol_4.jpg';
    if (title) title.textContent = toy ? `${toy.type}型 · ${toy.name}` : '本次记录已存档';
    if (sub) sub.textContent = toy ? toy.physicalDesc : '已按你的选择跳过形态，数据已安全保存';
    if (sealGrade) sealGrade.textContent = '已入档';

    syncSettingsUI();
    overlay.hidden = false;
    FeltAudio.gentleSave();

    const finish = () => {
      clearTimeout(cutsceneTimer);
      cutsceneTimer = null;
      overlay.hidden = true;
      overlay.dataset.onDone = '';
      if (onComplete) {
        const cb = onComplete;
        onComplete = null;
        cb();
      }
    };

    const skipBtn = $('cutsceneSkipBtn');
    if (skipBtn) {
      skipBtn.onclick = () => {
        FeltAudio.softTap();
        finish();
      };
    }

    clearTimeout(cutsceneTimer);
    cutsceneTimer = setTimeout(finish, 1850);
  }

  // --------------------------------------------------------------------------
  // 13. Red-Flag Safety Triage Flow (`redFlagCard`)
  // --------------------------------------------------------------------------
  function startCareTriage(rawReason, entryId = null) {
    const reason = normalizeCareReason(rawReason);
    triageState = {
      active: true,
      reason,
      step: 0,
      answers: {},
      entryId,
      result: null
    };
    closeAllSheets(true);
    setAppMode('care');
    setDoctorPose('checkup');
    renderHomeTheater();
    renderCareTriage();
    FeltAudio.careBell();
  }

  function exitCareTriage() {
    triageState.active = false;
    setAppMode('theater');
    setHeroPose('default');
    renderHomeTheater();
  }

  function renderCareTriage() {
    const card = $('redFlagCard');
    if (!card || !triageState.active) return;
    card.hidden = false;

    const banner = $('careEmergencyBanner');
    const bannerTxt = $('careEmergencyText');
    if (banner) banner.hidden = false;
    if (bannerTxt) {
      bannerTxt.textContent =
        EMERGENCY_BANNER_COPY[triageState.reason] || EMERGENCY_BANNER_COPY.alarm;
    }

    const triageView = $('careTriageView');
    const resultView = $('careResultView');

    if (triageState.result) {
      if (triageView) triageView.hidden = true;
      if (resultView) resultView.hidden = false;

      const res = triageState.result;
      setDoctorPose(res.pose || 'earnest');
      const badge = $('careResultBadge');
      const dept = $('careDepartmentBadge');
      const title = $('careResultTitle');
      const exp = $('careExplanation');

      if (badge) {
        badge.textContent = res.badge;
        badge.dataset.level = res.level;
      }
      if (dept) dept.textContent = res.department;
      if (title) title.textContent = res.title;
      if (exp) exp.textContent = res.explanation;
      return;
    }

    // Question view
    if (triageView) triageView.hidden = false;
    if (resultView) resultView.hidden = true;

    const qList = CARE_TRIAGE_QUESTIONS[triageState.reason] || CARE_TRIAGE_QUESTIONS.alarm;
    const current = qList[triageState.step] || qList[0];

    const reasonTitleMap = {
      blood: '鲜红/暗红便 · 快速分流',
      black: '柏油黑便 · 快速分流',
      pale: '陶土灰白便 · 快速分流',
      alarm: '连续水样稀便 · 快速分流'
    };

    const stepBadge = $('careStepBadge');
    if (stepBadge) {
      stepBadge.textContent = `${reasonTitleMap[triageState.reason]}（${triageState.step + 1}/${qList.length}）`;
    }

    document.querySelectorAll('[data-care-dot]').forEach((dot) => {
      const idx = Number(dot.getAttribute('data-care-dot'));
      dot.classList.toggle('is-active', idx <= triageState.step);
    });

    const qEl = $('careQuestionText');
    if (qEl) qEl.textContent = current.q;

    const optWrap = $('careOptionsList');
    if (optWrap) {
      optWrap.innerHTML = current.options
        .map(
          (opt) => `
          <button class="care-option-btn" type="button" data-care-answer="${opt.value}">
            ${opt.label}
          </button>
        `
        )
        .join('');
    }
  }

  function handleCareAnswer(val) {
    const qList = CARE_TRIAGE_QUESTIONS[triageState.reason] || CARE_TRIAGE_QUESTIONS.alarm;
    const current = qList[triageState.step];
    if (!current) return;

    triageState.answers[current.key] = val;
    FeltAudio.softTap();

    if (triageState.step + 1 < qList.length) {
      triageState.step += 1;
      renderCareTriage();
    } else {
      const result = evaluateCareTriage(triageState.reason, triageState.answers);
      triageState.result = result;

      if (triageState.entryId) {
        const entry = state.logs.find((l) => l.id === triageState.entryId);
        if (entry) {
          entry.careTriage = {
            reason: triageState.reason,
            answers: { ...triageState.answers },
            result
          };
          saveState();
        }
      }
      renderCareTriage();
    }
  }

  // --------------------------------------------------------------------------
  // 14. Sheet 2: Insights & History (`insightsSheet`)
  // --------------------------------------------------------------------------
  function renderScopeBars() {
    const isDemo = state.ui.dataScope === 'demo';
    const personalCount = getPersonalLogs().length;
    const demoCount = state.logs.filter((l) => l.isDemo).length;

    const text = isDemo
      ? `演示示例模式（${demoCount} 条示例 · 仅用于预览，不计入就诊摘要）`
      : `个人真实记录（${personalCount} 条）`;
    const toggleLabel = isDemo ? `切换个人记录 (${personalCount})` : `预览演示数据 (${demoCount})`;

    [
      ['insightsScopeBar', 'insightsScopeText', 'insightsScopeToggleBtn'],
      ['reportScopeBar', 'reportScopeText', 'reportScopeToggleBtn']
    ].forEach(([barId, txtId, btnId]) => {
      const bar = $(barId);
      const txt = $(txtId);
      const btn = $(btnId);
      if (bar) bar.classList.toggle('is-demo-scope', isDemo);
      if (txt) txt.textContent = text;
      if (btn) btn.textContent = toggleLabel;
    });
  }

  function openInsightsSheet() {
    renderInsightsSheet();
    openSheet('insightsSheet');
  }

  function renderInsightsSheet() {
    renderScopeBars();
    const logs = getScopedLogs(state.ui.dataScope);
    const s30 = compute30DayStats(logs);
    const s7 = compute7DayStats(logs);

    const kpi = $('insightsKpiStrip');
    if (kpi) {
      kpi.innerHTML = `
        <div class="kpi-tile">
          <span class="kpi-label">近30天排便</span>
          <strong>${s30.totalBm} 次</strong>
          <small>无排便标记 ${s30.totalNoBm} 天</small>
        </div>
        <div class="kpi-tile">
          <span class="kpi-label">3-4型占比</span>
          <strong>${s30.idealRate !== null ? s30.idealRate + '%' : '—'}</strong>
          <small>已选形态 ${s30.knownBristolTotal} 次</small>
        </div>
        <div class="kpi-tile">
          <span class="kpi-label">平均耗时</span>
          <strong>${s30.avgDurationSec !== null ? formatDuration(s30.avgDurationSec) : '未记录'}</strong>
          <small>已计时 ${s30.durationKnown} 次</small>
        </div>
      `;
    }

    // 7-day trend track
    const chart = $('trendChart');
    if (chart) {
      chart.innerHTML = s7.days
        .map((d) => {
          const isSel = state.ui.selectedTrendDate === d.dateKey;
          let badge = '未记';
          let cls = 'day-token-nodata';
          if (d.status === 'bm') {
            badge = d.latestBm && d.latestBm.bristol ? `${d.latestBm.bristol}型` : '已记';
            cls = d.hasRedFlag ? 'day-token-alert' : '';
          } else if (d.status === 'no_bm') {
            badge = '无便';
            cls = 'day-token-nobm';
          }
          return `
            <button class="trend-bar-col ${cls} ${isSel ? 'is-selected' : ''}" type="button" data-trend-day="${d.dateKey}">
              <span class="trend-pill">${badge}</span>
              <small>周${d.weekday}</small>
            </button>
          `;
        })
        .join('');
    }

    const detailEl = $('trendSelectedDetail');
    if (detailEl) {
      const targetDay =
        s7.days.find((d) => d.dateKey === state.ui.selectedTrendDate) || s7.days[s7.days.length - 1];
      if (!targetDay || targetDay.status === 'nodata') {
        detailEl.textContent = `${targetDay ? targetDay.label : '今日'}：未记录（与“无排便”区分）`;
      } else if (targetDay.status === 'no_bm') {
        detailEl.textContent = `${targetDay.label}：已主动标记为“当日未排便”`;
      } else {
        const desc = targetDay.bmEntries
          .map((e) => {
            const b = e.bristol ? `${e.bristol}型` : '形态未选';
            const c = getColor(e.color)?.name || '颜色未选';
            return `${formatFullDate(e.ts)}（${b} / ${c}）`;
          })
          .join('；');
        detailEl.textContent = `${targetDay.label}：${desc}`;
      }
    }

    // Honest personal tag co-occurrence (n counts ONLY)
    const corr = $('correlationList');
    if (corr) {
      if (!s30.tagSummary.length) {
        corr.innerHTML = `<p class="empty-note">暂无带标签记录。勾选“咖啡 / 辛辣 / 熬夜”等标签后，这里将如实展示共同出现次数（不做因果推断）。</p>`;
      } else {
        corr.innerHTML = s30.tagSummary
          .slice(0, 5)
          .map(
            (item) => `
            <div class="corr-row">
              <strong>${item.tag}</strong>
              <span>共出现 n=${item.total} 次（偏稀 ${item.loose} · 偏干 ${item.dry} · 成型 ${item.normal}）</span>
            </div>
          `
          )
          .join('');
      }
    }

    // History list
    const hist = $('historyList');
    if (hist) {
      if (!logs.length) {
        hist.innerHTML = `<p class="empty-note">当前范围尚无记录。点击首页“开始大便”或“刚拉完 · 补记一笔”即可创建个人档案。</p>`;
      } else {
        hist.innerHTML = logs
          .slice(0, 20)
          .map((l) => {
            const rf = isEntryRedFlag(l, logs);
            if (l.entryType === 'no_bm') {
              return `
                <button class="history-row" type="button" data-open-archive="${l.id}">
                  <div>
                    <strong>无排便日</strong>
                    <small>${formatFullDate(l.ts)}${l.isDemo ? ' · 示例' : ''}</small>
                  </div>
                  <span>主动标记</span>
                </button>
              `;
            }
            const toy = getToy(l.bristol);
            const col = getColor(l.color);
            const title = rf
              ? `需留意 · ${col ? col.name : '水样稀便'}`
              : toy
                ? `${toy.type}型 ${toy.name}`
                : '形态未选';
            const sub = `${formatFullDate(l.ts)} · ${col ? col.name : '颜色未选'} · ${formatDuration(l.durationSec)}${l.isDemo ? ' · 示例' : ''}`;
            return `
              <button class="history-row ${rf ? 'is-redflag-entry' : ''}" type="button" data-open-archive="${l.id}">
                <div>
                  <strong>${title}</strong>
                  <small>${sub}</small>
                </div>
                <span>${l.ease || '未选顺畅度'}</span>
              </button>
            `;
          })
          .join('');
      }
    }
  }

  // --------------------------------------------------------------------------
  // 15. Sheet 3: 30-Day Personal Clinical Summary (`doctorSheet`) — 0% Demo Leakage!
  // --------------------------------------------------------------------------
  function openDoctorSummarySheet() {
    renderDoctorSummarySheet();
    openSheet('doctorSheet');
  }

  function renderDoctorSummarySheet() {
    // HARD CLINICAL ISOLATION: NEVER mix isDemo: true into 30-Day Personal Summary!
    const personalLogs = getPersonalLogs();
    const s30 = compute30DayStats(personalLogs);

    const end = new Date();
    const start = new Date(Date.now() - 29 * 86400000);
    const rangeEl = $('doctorDateRange');
    if (rangeEl) {
      rangeEl.textContent = `${start.getFullYear()}.${pad2(start.getMonth() + 1)}.${pad2(start.getDate())} — ${end.getFullYear()}.${pad2(end.getMonth() + 1)}.${pad2(end.getDate())} · 仅个人真实记录（已排除全部演示数据）`;
    }

    const alertEl = $('clinicalAlertBanner');
    if (alertEl) {
      if (s30.redFlagLogs.length > 0) {
        alertEl.hidden = false;
        const details = s30.redFlagLogs
          .slice(0, 3)
          .map((e) => {
            const col = getColor(e.color)?.name || '连续7型水样便';
            const lvl = e.careTriage?.result?.badge ? `（自查：${e.careTriage.result.badge}）` : '';
            return `${formatFullDate(e.ts)} ${col}${lvl}`;
          })
          .join('；');
        alertEl.textContent = `近 30 天含 ${s30.redFlagLogs.length} 条异常警示记录：${details}。本摘要仅供就诊沟通参考，不替代医生面诊。`;
      } else {
        alertEl.hidden = true;
      }
    }

    const metricsEl = $('doctorMetricsGrid');
    if (metricsEl) {
      const sumCheck =
        Object.values(s30.bristolCounts).reduce((a, b) => a + b, 0) + s30.unknownBristol;
      metricsEl.innerHTML = `
        <div class="doc-metric"><span>排便记录总次</span><strong>${s30.totalBm} 次</strong></div>
        <div class="doc-metric"><span>主动标记无排便</span><strong>${s30.noBmDays} 天</strong></div>
        <div class="doc-metric"><span>未记录天数</span><strong>${s30.unrecordedDays} 天</strong></div>
        <div class="doc-metric"><span>形态已选 / 未选</span><strong>${s30.knownBristolTotal} / ${s30.unknownBristol}（核对 ${sumCheck}）</strong></div>
        <div class="doc-metric"><span>颜色已选 / 未选</span><strong>${s30.colorKnown} / ${Math.max(0, s30.totalBm - s30.colorKnown)}</strong></div>
        <div class="doc-metric"><span>平均记录耗时</span><strong>${s30.avgDurationSec !== null ? formatDuration(s30.avgDurationSec) : '未记录'}</strong></div>
      `;
    }

    const tbody = $('doctorTableBody');
    if (tbody) {
      if (!s30.recent.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center;padding:18px 8px;color:#6E5847;">
              暂无个人真实排便记录（全部演示示例已自动排除）。完成一次真实记录或补记后，这里将按时间生成事实明细表。
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = s30.recent
          .map((l) => {
            if (l.entryType === 'no_bm') {
              return `
                <tr>
                  <td>${formatFullDate(l.ts)}</td>
                  <td>当日无排便</td>
                  <td>—</td>
                  <td>—</td>
                  <td>${l.memo || '主动标记无排便'}</td>
                </tr>
              `;
            }
            const toy = getToy(l.bristol);
            const col = getColor(l.color);
            const rf = isEntryRedFlag(l, personalLogs);
            const extra = [
              l.ease ? `顺畅度:${l.ease}` : '',
              l.triggers?.length ? `标签:${l.triggers.join('/')}` : '',
              l.memo || '',
              l.careTriage?.result?.badge ? `自查:${l.careTriage.result.badge}` : ''
            ]
              .filter(Boolean)
              .join('；');
            return `
              <tr class="${rf ? 'is-clinical-alert-row' : ''}">
                <td>${formatFullDate(l.ts)}</td>
                <td>${toy ? toy.clinicalLabel : '未选形态'}</td>
                <td>${col ? col.name : '未选颜色'}</td>
                <td>${formatDuration(l.durationSec)}</td>
                <td>${extra || '—'}</td>
              </tr>
            `;
          })
          .join('');
      }
    }
  }

  // --------------------------------------------------------------------------
  // 16. Sheet 6: Archive, Factual 7D/30D Trends & Desensitive Aesthetic Poster Hub
  // --------------------------------------------------------------------------
  function openReportHub(tab = 'single', archiveEntryId = null) {
    state.ui.activeShareTab = ['single', 'weekly', 'monthly', 'poster'].includes(tab) ? tab : 'single';
    if (archiveEntryId) state.ui.selectedArchiveId = archiveEntryId;
    saveState();
    renderReportHub();
    openSheet('postcardSheet');
  }

  function renderReportHub() {
    renderScopeBars();
    const tab = state.ui.activeShareTab || 'single';

    document.querySelectorAll('[data-share-tab]').forEach((btn) => {
      const isAct = btn.getAttribute('data-share-tab') === tab;
      btn.classList.toggle('is-active', isAct);
      btn.setAttribute('aria-selected', String(isAct));
    });

    const panes = {
      single: $('shareCardSingle'),
      weekly: $('shareCardWeekly'),
      monthly: $('shareCardMonthly'),
      poster: $('shareCardPk')
    };
    Object.entries(panes).forEach(([k, el]) => {
      if (el) el.hidden = k !== tab;
    });

    // Strict footer separation: Archive footer on single/weekly/monthly; Export footer ONLY on decoupled Poster tab!
    const archFooter = $('reportArchiveFooter');
    const postFooter = $('reportPosterFooter');
    if (archFooter) archFooter.hidden = tab === 'poster';
    if (postFooter) postFooter.hidden = tab !== 'poster';

    const replayBtn = $('replayCutsceneBtn');
    const logs = getScopedLogs(state.ui.dataScope);
    const activeEntry =
      logs.find((l) => l.id === state.ui.selectedArchiveId) || logs[0] || null;
    if (replayBtn) {
      replayBtn.hidden =
        tab !== 'single' ||
        !activeEntry ||
        activeEntry.entryType !== 'bm' ||
        isEntryRedFlag(activeEntry, logs);
    }

    if (tab === 'single') renderSingleArchive(activeEntry, logs);
    else if (tab === 'weekly') renderWeeklyArchive(logs);
    else if (tab === 'monthly') renderMonthlyArchive(logs);
    else if (tab === 'poster') renderPosterStudio();
  }

  function renderSingleArchive(entry, logs) {
    const kicker = $('singleStageKicker');
    const moodLbl = $('singleMoodLabel');
    const normalStage = $('singleNormalStage');
    const careStage = $('singleCareStage');
    const normalDetails = $('singleNormalDetails');

    if (!entry) {
      if (kicker) kicker.textContent = '单次个人档案';
      if (moodLbl) moodLbl.textContent = '暂无记录';
      if (normalStage) normalStage.hidden = true;
      if (normalDetails) normalDetails.hidden = true;
      if (careStage) careStage.hidden = false;
      const cTitle = $('singleCareTitle');
      const cEmer = $('singleCareEmergency');
      const cNote = $('singleCareNote');
      if (cTitle) cTitle.textContent = '当前范围暂无单次记录';
      if (cEmer) cEmer.hidden = true;
      if (cNote) cNote.textContent = '你可以点击首页“开始大便”或“刚拉完 · 补记一笔”创建第一条个人档案，或切换查看演示示例。';
      return;
    }

    const rfReason = getEntryRedFlagReason(entry, logs);
    if (kicker) {
      kicker.textContent = `${formatFullDate(entry.ts)}${entry.isDemo ? ' · 演示示例' : ' · 个人存档'}`;
    }

    // HARD RED-FLAG GUARD: ZERO jokes, ZERO SSS/scores, ZERO normal stage visible!
    const motionBtn = $('toggleStageMotionBtn');
    if (motionBtn) motionBtn.hidden = Boolean(rfReason) || entry.entryType === 'no_bm';

    if (rfReason) {
      if (moodLbl) moodLbl.textContent = '健康提醒模式';
      if (normalStage) normalStage.hidden = true;
      if (normalDetails) normalDetails.hidden = true;
      if (careStage) careStage.hidden = false;

      const col = getColor(entry.color);
      const cTitle = $('singleCareTitle');
      const cEmer = $('singleCareEmergency');
      const cNote = $('singleCareNote');
      if (cTitle) {
        cTitle.textContent = `本次记录含异常提示：${col ? col.name : '连续水样稀便'}`;
      }
      if (cEmer) {
        cEmer.hidden = false;
        cEmer.textContent = EMERGENCY_BANNER_COPY[rfReason] || EMERGENCY_BANNER_COPY.alarm;
      }
      if (cNote) {
        const tri = entry.careTriage?.result;
        cNote.textContent = tri
          ? `分流建议：${tri.badge}（${tri.department}）。${tri.explanation}`
          : '该记录已自动屏蔽趣味动画与对外分享，请结合身体感受留意变化，必要时前往消化内科评估。';
      }
      return;
    }

    // No-BM record
    if (entry.entryType === 'no_bm') {
      if (moodLbl) moodLbl.textContent = '无排便日';
      if (normalStage) normalStage.hidden = true;
      if (normalDetails) normalDetails.hidden = false;
      if (careStage) careStage.hidden = true;
      if ($('shareDailyHeadline')) $('shareDailyHeadline').textContent = '已明确标记：当日无排便';
      if ($('hudToyLabel')) $('hudToyLabel').textContent = '当日无排便';
      if ($('hudTimeLabel')) $('hudTimeLabel').textContent = '—';
      if ($('hudEaseLabel')) $('hudEaseLabel').textContent = '已与漏记天数区分';
      if ($('shareDailyConf')) $('shareDailyConf').textContent = '事实存档';
      if ($('shareDailyDeduction')) $('shareDailyDeduction').textContent = entry.memo || '主动标记无排便。';
      if ($('singleNextSupply')) $('singleNextSupply').textContent = '保持温和饮水与日常活动，无需焦虑。';
      return;
    }

    // Normal BM record (100% non-judgmental, zero SSS/96 score!)
    if (normalStage) normalStage.hidden = false;
    if (normalDetails) normalDetails.hidden = false;
    if (careStage) careStage.hidden = true;

    const toy = getToy(entry.bristol);
    const col = getColor(entry.color);
    if (moodLbl) moodLbl.textContent = toy ? toy.statusText : '已存档';

    const img = $('shareDailyImg');
    if (img) img.src = toy ? toy.img : 'assets/felt/bristol_4.jpg';

    if ($('singleRankGrade')) $('singleRankGrade').textContent = toy ? `${toy.type}型` : '未选';
    if ($('singleRankTitle')) $('singleRankTitle').textContent = toy ? toy.name : '跳过形态';
    if ($('singleRankScore')) $('singleRankScore').textContent = formatDuration(entry.durationSec);

    if ($('shareDailyHeadline')) {
      $('shareDailyHeadline').textContent = toy
        ? `${toy.type}型 · ${toy.physicalDesc}`
        : '本次已跳过形态选择，仅保留时间与客观备注。';
    }
    if ($('hudToyLabel')) $('hudToyLabel').textContent = toy ? toy.clinicalLabel : '形态未选';
    if ($('hudTimeLabel')) $('hudTimeLabel').textContent = formatDuration(entry.durationSec);
    if ($('hudEaseLabel')) {
      $('hudEaseLabel').textContent = `${col ? col.name : '颜色未选'} · ${entry.ease || '顺畅度未选'}`;
    }
    if ($('shareDailyConf')) {
      $('shareDailyConf').textContent = entry.triggers?.length ? `标签 ${entry.triggers.length} 项` : '无附加标签';
    }
    if ($('shareDailyDeduction')) {
      const parts = [];
      if (entry.triggers?.length) parts.push(`记录标签：${entry.triggers.join('、')}`);
      if (entry.memo) parts.push(`个人备注：${entry.memo}`);
      $('shareDailyDeduction').textContent =
        parts.length > 0 ? parts.join('；') : '未填写附加标签与备注（不会脑补或推断饮食诱因）。';
    }
    if ($('singleNextSupply')) {
      $('singleNextSupply').textContent = toy ? toy.advice : '如需就诊沟通，可在近 30 天摘要中查看完整记录。';
    }
  }

  function renderWeeklyArchive(logs) {
    const s7 = compute7DayStats(logs);
    if ($('weeklyKicker')) $('weeklyKicker').textContent = `近 7 天客观记录（${s7.days[0].label}–${s7.days[6].label}）`;
    if ($('weeklyMoodTitle')) $('weeklyMoodTitle').textContent = `排便 ${s7.totalBm} 次 · 无排便 ${s7.noBmDaysCount} 天 · 未记录 ${s7.noDataDaysCount} 天`;
    if ($('weeklyPowerPill')) {
      $('weeklyPowerPill').textContent =
        s7.redFlagCount > 0 ? `含 ${s7.redFlagCount} 条异常提醒` : `已记 ${s7.bmDaysCount + s7.noBmDaysCount}/7 天`;
    }
    if ($('weeklyAttendanceSummary')) {
      $('weeklyAttendanceSummary').textContent = `排便天数 ${s7.bmDaysCount} · 无排便 ${s7.noBmDaysCount} · 未记录 ${s7.noDataDaysCount}`;
    }

    const track = $('weeklySevenDayTrack');
    if (track) {
      track.innerHTML = s7.days
        .map((d) => {
          let label = '未记';
          let circleCls = 'day-token-nodata';
          if (d.status === 'bm') {
            const b = d.latestBm?.bristol;
            label = b ? `${b}型` : '未选';
            if (d.bmEntries.length > 1) label += `×${d.bmEntries.length}`;
            if (d.hasRedFlag) circleCls = 'day-token-alert';
            else if (b === 3 || b === 4) circleCls = 'day-token-gold';
            else if (b === 1 || b === 2) circleCls = 'day-token-desert';
            else circleCls = 'day-token-storm';
          } else if (d.status === 'no_bm') {
            label = '无便';
            circleCls = 'day-token-nobm';
          }
          return `
            <div class="day-token-col">
              <div class="day-token-circle ${circleCls}">${label}</div>
              <span class="day-token-label">周${d.weekday}</span>
            </div>
          `;
        })
        .join('');
    }

    const pills = $('weeklyScorePills');
    if (pills) {
      pills.innerHTML = `
        <div class="weekly-score-pill"><span>颜色已填</span><strong>${s7.colorFilled}/${s7.totalBm}</strong></div>
        <div class="weekly-score-pill"><span>顺畅已填</span><strong>${s7.easeFilled}/${s7.totalBm}</strong></div>
        <div class="weekly-score-pill"><span>时长已记</span><strong>${s7.durationFilled}/${s7.totalBm}</strong></div>
      `;
    }

    if ($('weeklyTopCulprit')) {
      $('weeklyTopCulprit').textContent =
        s7.noDataDaysCount > 0
          ? `本周有 ${s7.noDataDaysCount} 天未记录（不会按便秘计算）`
          : '本周 7 天均有明确记录';
    }
    if ($('weeklyTrendVerdict')) {
      $('weeklyTrendVerdict').textContent =
        s7.totalBm === 0
          ? '近 7 天尚无排便记录，完成一次真实记录或补记即可在此生成客观周视图。'
          : `共记录 ${s7.totalBm} 次排便，其中颜色明确填写 ${s7.colorFilled} 次，顺畅度明确填写 ${s7.easeFilled} 次；未填写项保持“未选”而不自动补默认值。`;
    }
  }

  function renderMonthlyArchive(logs) {
    const s30 = compute30DayStats(logs);
    const now = new Date();
    if ($('postcardMonthLabel')) {
      $('postcardMonthLabel').textContent = `${now.getFullYear()}年${now.getMonth() + 1}月 · 近 30 天核对`;
    }
    if ($('monthlyTitleBadge')) {
      $('monthlyTitleBadge').textContent =
        s30.totalBm > 0 ? `总计 ${s30.totalBm} 次排便` : '暂无排便记录';
    }
    if ($('postcardAwardQuote')) {
      $('postcardAwardQuote').textContent =
        s30.totalBm > 0
          ? `近 30 天内共记录 ${s30.totalBm} 次排便（含形态未选 ${s30.unknownBristol} 次）、主动标记无排便 ${s30.noBmDays} 天、未记录 ${s30.unrecordedDays} 天。柱状图总和与总次数 100% 一致。`
          : '当前范围近 30 天尚无记录。';
    }
    if ($('monthlyTopTriggerText')) {
      if (s30.tagSummary.length) {
        const top = s30.tagSummary[0];
        $('monthlyTopTriggerText').textContent = `最常出现标签：${top.tag}（共同出现 n=${top.total} 次，仅作频次记录）`;
      } else {
        $('monthlyTopTriggerText').textContent = '近 30 天暂无标签记录';
      }
    }

    // Exact Bristol 1-7 Wool Bars + Unknown col (sum === s30.totalBm, ZERO fabrication!)
    const bars = $('monthlyBristolBars');
    if (bars) {
      const maxVal = Math.max(1, ...Object.values(s30.bristolCounts), s30.unknownBristol);
      const rows = [1, 2, 3, 4, 5, 6, 7].map((t) => {
        const cnt = s30.bristolCounts[t];
        const px = cnt > 0 ? Math.max(10, Math.round((cnt / maxVal) * 76)) : 4;
        const tone = t <= 2 ? 'bar-desert' : t <= 4 ? 'bar-gold' : 'bar-storm';
        return `
          <div class="wool-bar-col">
            <span class="wool-bar-count">${cnt}</span>
            <div class="wool-bar-fill ${tone}" style="height:${px}px"></div>
            <span class="wool-bar-label">${t}型</span>
          </div>
        `;
      });
      if (s30.unknownBristol > 0) {
        const px = Math.max(10, Math.round((s30.unknownBristol / maxVal) * 76));
        rows.push(`
          <div class="wool-bar-col">
            <span class="wool-bar-count">${s30.unknownBristol}</span>
            <div class="wool-bar-fill bar-storm" style="height:${px}px;opacity:0.55"></div>
            <span class="wool-bar-label">未选</span>
          </div>
        `);
      }
      bars.innerHTML = rows.join('');
    }

    if ($('pcTotalCheckins')) $('pcTotalCheckins').textContent = `${s30.totalBm} 次`;
    if ($('pcIdealRate')) $('pcIdealRate').textContent = s30.idealRate !== null ? `${s30.idealRate}%` : '—';
    if ($('pcBestStreak')) $('pcBestStreak').textContent = `${s30.noBmDays} 天`;
  }

  // --------------------------------------------------------------------------
  // 17. Decoupled Desensitive Aesthetic Poster Studio (`poster` tab)
  // --------------------------------------------------------------------------
  function getPosterCaptionText() {
    const quote = POSTER_QUOTES[state.ui.posterQuoteIdx] || POSTER_QUOTES[0];
    return `《便便日记》手工毛毡小剧场：${quote}`;
  }

  function renderPosterStudio() {
    const actor = getToy(state.ui.posterActor) || BRISTOL_TOYS[3];
    const quote = POSTER_QUOTES[state.ui.posterQuoteIdx] || POSTER_QUOTES[0];

    if ($('posterHeroImg')) $('posterHeroImg').src = actor.img;
    if ($('posterActorLabel')) $('posterActorLabel').textContent = `自选毛毡团子 · ${actor.name}`;
    if ($('posterQuotePreview')) $('posterQuotePreview').textContent = quote;
    if ($('posterCaptionPreview')) $('posterCaptionPreview').textContent = getPosterCaptionText();

    const picker = $('posterActorPicker');
    if (picker) {
      picker.innerHTML = BRISTOL_TOYS.map((t) => {
        const act = t.type === actor.type;
        return `
          <button class="v82-actor-chip ${act ? 'is-active' : ''}" type="button" data-poster-actor="${t.type}" aria-pressed="${act}">
            <img src="${t.img}" alt="${t.name}" />
            <span>${t.name}</span>
          </button>
        `;
      }).join('');
    }

    const qWrap = $('posterQuoteChips');
    if (qWrap) {
      qWrap.innerHTML = POSTER_QUOTES.map((q, idx) => {
        const act = idx === state.ui.posterQuoteIdx;
        return `
          <button class="trigger-chip ${act ? 'is-active' : ''}" type="button" data-poster-quote="${idx}" aria-pressed="${act}">
            ${q}
          </button>
        `;
      }).join('');
    }
  }

  async function copyTextSafe(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      return true;
    } catch (_) {
      return false;
    }
  }

  async function copyShareCaption() {
    // HARD GUARD: Only ever copies the decoupled desensitive aesthetic poster caption!
    if (state.ui.activeShareTab !== 'poster') {
      showStampFeedback('为保护隐私，请先切换到“脱敏海报”页复制');
      return { ok: false, blocked: true };
    }
    const text = getPosterCaptionText();
    await copyTextSafe(text);
    FeltAudio.gentleSave();
    showStampFeedback('已复制脱敏美学海报文案');
    return { ok: true, text };
  }

  async function exportShareCardPng() {
    // HARD GUARD: Only ever exports the decoupled desensitive aesthetic poster!
    if (state.ui.activeShareTab !== 'poster') {
      showStampFeedback('健康档案不可直接晒图，请使用“脱敏海报”');
      return { ok: false, blocked: true };
    }

    const actor = getToy(state.ui.posterActor) || BRISTOL_TOYS[3];
    const quote = POSTER_QUOTES[state.ui.posterQuoteIdx] || POSTER_QUOTES[0];

    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');

    // Warm wool-felt canvas background
    ctx.fillStyle = '#FBF4E7';
    ctx.fillRect(0, 0, 900, 1200);

    // Subtle stitched inner frame
    ctx.strokeStyle = '#C99B6B';
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 10]);
    ctx.strokeRect(46, 46, 808, 1108);
    ctx.setLineDash([]);

    // Brand Header (Unified 《便便日记》, ZERO Bristol number, ZERO score, ZERO timestamp!)
    ctx.fillStyle = '#4A3728';
    ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('《便便日记》', 450, 138);

    ctx.fillStyle = '#8C6B4E';
    ctx.font = '26px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    ctx.fillText('手工毛毡小剧场 · 脱敏美学卡片', 450, 186);

    // Load plushie actor image
    await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(450, 500, 225, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 225, 275, 450, 450);
        ctx.restore();
        ctx.strokeStyle = '#E2C9A6';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(450, 500, 225, 0, Math.PI * 2);
        ctx.stroke();
        resolve();
      };
      img.onerror = resolve;
      img.src = actor.img;
    });

    // Actor plushie title (no Bristol type number!)
    ctx.fillStyle = '#5A3E2B';
    ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    ctx.fillText(`今日毛毡团子 · ${actor.name}`, 450, 815);

    // Aesthetic quote
    ctx.fillStyle = '#3B2C22';
    ctx.font = '32px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    ctx.fillText(`「${quote}」`, 450, 910);

    // Footer zero-privacy note
    ctx.fillStyle = '#9A826D';
    ctx.font = '22px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    ctx.fillText('不含任何排便形态、颜色、时间或健康评分', 450, 1085);

    try {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `便便日记_脱敏海报_${actor.name}.png`;
      a.click();
    } catch (_) {}

    FeltAudio.gentleSave();
    showStampFeedback('脱敏美学海报 PNG 已生成');
    return { ok: true };
  }

  // --------------------------------------------------------------------------
  // 18. Sheet 5: 1v1 Zero-Privacy Wool-Felt Care Stickers (`pkSheet`)
  // --------------------------------------------------------------------------
  function openCareStickerSheet() {
    renderCareStickerSheet();
    openSheet('pkSheet');
  }

  function renderCareStickerSheet() {
    const key = CARE_STICKERS[state.ui.activeSticker] ? state.ui.activeSticker : 'tissue';
    const st = CARE_STICKERS[key];
    if ($('careStickerImg')) $('careStickerImg').src = st.img;
    if ($('careStickerTitle')) $('careStickerTitle').textContent = st.title;
    if ($('careStickerBody')) $('careStickerBody').textContent = st.body;
    if ($('careStickerCaptionPreview')) $('careStickerCaptionPreview').textContent = st.caption;

    document.querySelectorAll('[data-sticker]').forEach((btn) => {
      const act = btn.getAttribute('data-sticker') === key;
      btn.classList.toggle('is-active', act);
      btn.setAttribute('aria-pressed', String(act));
    });
  }

  // --------------------------------------------------------------------------
  // 19. Sheet 7: Private & Public Toilet Spots (`toiletSheet`)
  // --------------------------------------------------------------------------
  const SPOT_TAGS = ['有纸', '通风好', '温水马桶', '安静', '有信号', '保洁勤', '有挂钩'];

  function openToiletSheet(tab = 'rank') {
    switchToiletTab(tab);
    renderToiletSheet();
    openSheet('toiletSheet');
  }

  function switchToiletTab(tab) {
    const isAdd = tab === 'add';
    const rankBtn = $('toiletTabRankBtn');
    const addBtn = $('toiletTabAddBtn');
    const rankPane = $('toiletRankPane');
    const addForm = $('toiletCheckinForm');
    if (rankBtn) rankBtn.classList.toggle('is-active', !isAdd);
    if (addBtn) addBtn.classList.toggle('is-active', isAdd);
    if (rankPane) rankPane.hidden = isAdd;
    if (addForm) addForm.hidden = !isAdd;
  }

  function renderToiletSheet() {
    const list = $('toiletMustGoList');
    if (list) {
      list.innerHTML = state.toilets
        .map((sp, idx) => {
          const scopeLbl = sp.scope === 'public' ? '公共备选' : '私人备忘';
          return `
            <div class="toilet-card">
              <div class="toilet-card-top">
                <div class="toilet-rank-wrap">
                  <span class="toilet-rank-badge ${idx === 0 ? 'is-top1' : idx === 1 ? 'is-top2' : 'is-top3'}">${idx + 1}</span>
                  <div class="toilet-title-col">
                    <strong class="toilet-name">${sp.name}</strong>
                    <span class="toilet-area">${sp.area || '日常'}</span>
                  </div>
                </div>
                <span class="v82-spot-scope-tag ${sp.scope === 'public' ? 'is-public' : ''}">${scopeLbl}</span>
              </div>
              <div class="toilet-metrics-row">
                <span>空气 <strong>${'★'.repeat(sp.air)}</strong></span>
                <span>整洁 <strong>${'★'.repeat(sp.clean)}</strong></span>
              </div>
              <div class="toilet-tags-row">${(sp.tags || []).map((t) => `<span class="toilet-tag">${t}</span>`).join('')}</div>
              ${sp.note ? `<p class="toilet-note">${sp.note}</p>` : ''}
            </div>
          `;
        })
        .join('');
    }

    // Scope picker
    document.querySelectorAll('[data-spot-scope]').forEach((btn) => {
      const act = btn.getAttribute('data-spot-scope') === spotFormState.scope;
      btn.classList.toggle('is-active', act);
      btn.setAttribute('aria-pressed', String(act));
    });

    // Stars
    renderStarPicker('toiletAirStars', 'toiletAirLabel', spotFormState.air, 'air');
    renderStarPicker('toiletCleanStars', 'toiletCleanLabel', spotFormState.clean, 'clean');

    // Tags
    const tagWrap = $('toiletTagPicker');
    if (tagWrap) {
      tagWrap.innerHTML = SPOT_TAGS.map((t) => {
        const act = spotFormState.tags.includes(t);
        return `<button class="trigger-chip ${act ? 'is-active' : ''}" type="button" data-spot-tag="${t}">${t}</button>`;
      }).join('');
    }
  }

  function renderStarPicker(wrapId, labelId, value, field) {
    const wrap = $(wrapId);
    const lbl = $(labelId);
    if (lbl) lbl.textContent = `${value} / 5`;
    if (!wrap) return;
    wrap.innerHTML = [1, 2, 3, 4, 5]
      .map(
        (n) => `
        <button class="star-btn ${n <= value ? 'is-on' : ''}" type="button" data-star-field="${field}" data-star-val="${n}" aria-label="${n}分">★</button>
      `
      )
      .join('');
  }

  // --------------------------------------------------------------------------
  // 20. Sheet 4: Privacy & Demo Data Controls (`privacySheet`)
  // --------------------------------------------------------------------------
  function renderPrivacySheet() {
    applyCamouflage();
    const grid = $('camouflageGrid');
    if (grid) {
      grid.innerHTML = CAMOUFLAGE_SKINS.map((sk) => {
        const act = state.settings.camouflage === sk.id;
        return `
          <button class="camo-option-btn ${act ? 'is-active' : ''}" type="button" data-camo-id="${sk.id}" aria-pressed="${act}">
            <strong>${sk.name}</strong>
            <small>${sk.badge}</small>
          </button>
        `;
      }).join('');
    }
  }

  // --------------------------------------------------------------------------
  // 21. Access Gate (`tiger` -> FNV-1a `0x95d40b46`)
  // --------------------------------------------------------------------------
  function fnv1aHash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function initAccessGate() {
    const overlay = $('accessGateOverlay');
    const form = $('accessGateForm');
    const input = $('gatePasswordInput');
    const errEl = $('gateErrorText');
    if (!overlay || !form || !input) return;

    try {
      if (sessionStorage.getItem(GATE_SESSION_KEY) === '1') {
        overlay.hidden = true;
        return;
      }
    } catch (_) {}

    overlay.hidden = false;
    setTimeout(() => {
      try { input.focus(); } catch (_) {}
    }, 100);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (fnv1aHash(`bb_diary::${val}::v8`) === GATE_EXPECTED_HASH) {
        try { sessionStorage.setItem(GATE_SESSION_KEY, '1'); } catch (_) {}
        if (errEl) errEl.hidden = true;
        FeltAudio.toyBounce();
        overlay.classList.add('is-unlocked');
        setTimeout(() => {
          overlay.hidden = true;
        }, 240);
      } else {
        if (errEl) errEl.hidden = false;
        FeltAudio.softTap();
        form.classList.remove('is-shake');
        void form.offsetWidth;
        form.classList.add('is-shake');
        input.select();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 22. Event Bindings
  // --------------------------------------------------------------------------
  function bindEvents() {
    // Global close-sheet delegation
    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-close-sheet]');
      if (closeBtn) {
        closeAllSheets();
        return;
      }

      // Bristol rail card
      const bCard = e.target.closest('[data-bristol-type]');
      if (bCard) {
        draft.bristol = Number(bCard.getAttribute('data-bristol-type'));
        FeltAudio.toyBounce();
        renderLogDrawer();
        return;
      }

      // Color chip
      const cChip = e.target.closest('[data-color-id]');
      if (cChip) {
        const cid = cChip.getAttribute('data-color-id');
        draft.color = draft.color === cid ? null : cid;
        FeltAudio.softTap();
        renderLogDrawer();
        return;
      }

      // Ease pill (toggleable)
      const eBtn = e.target.closest('[data-ease-val]');
      if (eBtn) {
        const val = eBtn.getAttribute('data-ease-val');
        draft.ease = draft.ease === val ? null : val;
        FeltAudio.softTap();
        renderLogDrawer();
        return;
      }

      // Trigger chip
      const tChip = e.target.closest('[data-trigger-val]');
      if (tChip) {
        const val = tChip.getAttribute('data-trigger-val');
        const idx = draft.triggers.indexOf(val);
        if (idx >= 0) draft.triggers.splice(idx, 1);
        else draft.triggers.push(val);
        FeltAudio.softTap();
        renderLogDrawer();
        return;
      }

      // Log toilet chip
      const ltChip = e.target.closest('[data-log-toilet]');
      if (ltChip) {
        const tid = ltChip.getAttribute('data-log-toilet');
        draft.toiletId = draft.toiletId === tid ? null : tid;
        FeltAudio.softTap();
        renderLogDrawer();
        return;
      }

      // Reminder threshold pills
      const remBtn = e.target.closest('[data-reminder-min]');
      if (remBtn) {
        const m = Number(remBtn.getAttribute('data-reminder-min'));
        state.settings.reminderMin = m;
        if (state.activeSession) {
          state.activeSession.reminderMin = m;
        }
        saveState();
        syncSettingsUI();
        FeltAudio.softTap();
        showStampFeedback(`已设提醒阈值：${m} 分钟`);
        return;
      }

      // Care triage answer
      const careAns = e.target.closest('[data-care-answer]');
      if (careAns) {
        handleCareAnswer(careAns.getAttribute('data-care-answer'));
        return;
      }

      // Trend day click
      const trendDay = e.target.closest('[data-trend-day]');
      if (trendDay) {
        state.ui.selectedTrendDate = trendDay.getAttribute('data-trend-day');
        renderInsightsSheet();
        return;
      }

      // Open archive entry from history
      const archBtn = e.target.closest('[data-open-archive]');
      if (archBtn) {
        openReportHub('single', archBtn.getAttribute('data-open-archive'));
        return;
      }

      // Report tabs
      const shareTab = e.target.closest('[data-share-tab]');
      if (shareTab) {
        state.ui.activeShareTab = shareTab.getAttribute('data-share-tab');
        saveState();
        renderReportHub();
        FeltAudio.softTap();
        return;
      }

      // Poster actor & quote chips
      const pActor = e.target.closest('[data-poster-actor]');
      if (pActor) {
        state.ui.posterActor = Number(pActor.getAttribute('data-poster-actor'));
        saveState();
        renderPosterStudio();
        FeltAudio.toyBounce();
        return;
      }
      const pQuote = e.target.closest('[data-poster-quote]');
      if (pQuote) {
        state.ui.posterQuoteIdx = Number(pQuote.getAttribute('data-poster-quote'));
        saveState();
        renderPosterStudio();
        FeltAudio.softTap();
        return;
      }

      // 1v1 Care Sticker choices
      const stBtn = e.target.closest('[data-sticker]');
      if (stBtn) {
        state.ui.activeSticker = stBtn.getAttribute('data-sticker');
        saveState();
        renderCareStickerSheet();
        FeltAudio.toyBounce();
        return;
      }

      // Camouflage skin
      const camoBtn = e.target.closest('[data-camo-id]');
      if (camoBtn) {
        state.settings.camouflage = camoBtn.getAttribute('data-camo-id');
        saveState();
        renderPrivacySheet();
        FeltAudio.softTap();
        return;
      }

      // Toilet tab & form controls
      const tTab = e.target.closest('[data-toilet-tab]');
      if (tTab) {
        switchToiletTab(tTab.getAttribute('data-toilet-tab'));
        return;
      }
      const spScope = e.target.closest('[data-spot-scope]');
      if (spScope) {
        spotFormState.scope = spScope.getAttribute('data-spot-scope');
        renderToiletSheet();
        return;
      }
      const starBtn = e.target.closest('[data-star-field]');
      if (starBtn) {
        const f = starBtn.getAttribute('data-star-field');
        spotFormState[f] = Number(starBtn.getAttribute('data-star-val'));
        renderToiletSheet();
        return;
      }
      const spTag = e.target.closest('[data-spot-tag]');
      if (spTag) {
        const tg = spTag.getAttribute('data-spot-tag');
        const idx = spotFormState.tags.indexOf(tg);
        if (idx >= 0) spotFormState.tags.splice(idx, 1);
        else spotFormState.tags.push(tg);
        renderToiletSheet();
        return;
      }

      // Director rail quick jumps (QA / Demo)
      const demoBtn = e.target.closest('[data-demo-action]');
      if (demoBtn) {
        runDemoAction(demoBtn.getAttribute('data-demo-action'));
      }
    });

    // Scrim click closes sheet
    $('sheetScrim')?.addEventListener('click', () => closeAllSheets());

    // Top bar & More menu
    $('moreMenuBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const pop = $('moreMenuPopover');
      if (!pop) return;
      const willOpen = pop.hidden;
      pop.hidden = !willOpen;
      $('moreMenuBtn')?.setAttribute('aria-expanded', String(willOpen));
    });

    document.addEventListener('click', (e) => {
      const pop = $('moreMenuPopover');
      if (pop && !pop.hidden && !e.target.closest('#moreMenuPopover') && !e.target.closest('#moreMenuBtn')) {
        pop.hidden = true;
        $('moreMenuBtn')?.setAttribute('aria-expanded', 'false');
      }
    });

    $('soundToggleBtn')?.addEventListener('click', () => {
      state.settings.soundEnabled = !state.settings.soundEnabled;
      saveState();
      syncSettingsUI();
      showStampFeedback(state.settings.soundEnabled ? '已开启音效' : '已静音');
    });

    $('cutsceneMuteBtn')?.addEventListener('click', () => {
      state.settings.soundEnabled = !state.settings.soundEnabled;
      saveState();
      syncSettingsUI();
    });

    $('cutscenePrefToggleBtn')?.addEventListener('click', () => {
      state.settings.cutsceneEnabled = !state.settings.cutsceneEnabled;
      saveState();
      syncSettingsUI();
      showStampFeedback(state.settings.cutsceneEnabled ? '保存后播放毛毡过场' : '已设为保存后直达档案');
    });

    $('privacyBtn')?.addEventListener('click', () => {
      renderPrivacySheet();
      openSheet('privacySheet');
    });
    $('openDoctorQuickBtn')?.addEventListener('click', openDoctorSummarySheet);
    $('openInsightsBtn')?.addEventListener('click', openInsightsSheet);
    $('demoEightMinBtn')?.addEventListener('click', () => {
      const pop = $('moreMenuPopover');
      if (pop) pop.hidden = true;
      if (!state.activeSession) startPoopSession();
      showSittingReminderToast(state.settings.reminderMin || 8);
    });
    $('openRedFlagDemoBtn')?.addEventListener('click', () => {
      const pop = $('moreMenuPopover');
      if (pop) pop.hidden = true;
      startCareTriage('blood', null);
    });

    // Home whisper popover toggle
    $('homeQuoteToggleBtn')?.addEventListener('click', () => {
      const pop = $('homeQuotePopover');
      if (!pop) return;
      const open = pop.hidden;
      pop.hidden = !open;
      $('homeQuoteToggleBtn')?.setAttribute('aria-expanded', String(open));
    });

    // Primary Home Dock actions
    $('openLogBtn')?.addEventListener('click', startPoopSession);
    $('quickBackfillBtn')?.addEventListener('click', () => openLogDrawer({ mode: 'backfill' }));
    $('markNoBmTodayBtn')?.addEventListener('click', markNoBmToday);
    $('openShareDailyBtn')?.addEventListener('click', () => openReportHub('single'));
    $('openPkBtn')?.addEventListener('click', openCareStickerSheet);
    $('openToiletBtn')?.addEventListener('click', () => openToiletSheet('rank'));
    $('timerPillBtn')?.addEventListener('click', () => {
      if (state.activeSession && state.activeSession.running) {
        finishSessionAndOpenLog();
      } else {
        startPoopSession();
      }
    });

    // Active session controls
    $('finishPoopBtn')?.addEventListener('click', finishSessionAndOpenLog);
    $('sessionDirectLogBtn')?.addEventListener('click', finishSessionAndOpenLog);
    $('cancelPoopBtn')?.addEventListener('click', cancelPoopSession);
    $('sessionToiletChip')?.addEventListener('click', () => openToiletSheet('rank'));

    // Sitting reminder toast
    $('closeToastBtn')?.addEventListener('click', snoozeSittingReminder);
    $('toastResetTimerBtn')?.addEventListener('click', snoozeSittingReminder);
    $('toastLogNowBtn')?.addEventListener('click', finishSessionAndOpenLog);

    // Red-flag triage buttons
    $('careSkipExitBtn')?.addEventListener('click', exitCareTriage);
    $('careExitBtn')?.addEventListener('click', exitCareTriage);
    $('careQuickSummaryBtn')?.addEventListener('click', () => {
      exitCareTriage();
      openDoctorSummarySheet();
    });
    $('careOpenReportBtn')?.addEventListener('click', () => {
      exitCareTriage();
      openDoctorSummarySheet();
    });
    $('careRetakeBtn')?.addEventListener('click', () => {
      triageState.step = 0;
      triageState.answers = {};
      triageState.result = null;
      renderCareTriage();
    });

    // Log Drawer controls
    $('cycleDurationBtn')?.addEventListener('click', () => {
      const curIdx = DURATION_CYCLE.indexOf(draft.durationSec);
      draft.durationSec = DURATION_CYCLE[(curIdx + 1) % DURATION_CYCLE.length];
      FeltAudio.softTap();
      renderLogDrawer();
    });
    $('bristolUncertainBtn')?.addEventListener('click', () => {
      draft.bristol = draft.bristol === null ? 4 : null;
      FeltAudio.softTap();
      renderLogDrawer();
    });
    $('colorUncertainBtn')?.addEventListener('click', () => {
      draft.color = null;
      FeltAudio.softTap();
      renderLogDrawer();
    });
    $('bristolPrevBtn')?.addEventListener('click', () => {
      draft.bristol = draft.bristol ? Math.max(1, draft.bristol - 1) : 4;
      FeltAudio.toyBounce();
      renderLogDrawer();
    });
    $('bristolNextBtn')?.addEventListener('click', () => {
      draft.bristol = draft.bristol ? Math.min(7, draft.bristol + 1) : 4;
      FeltAudio.toyBounce();
      renderLogDrawer();
    });
    $('logOpenToiletBtn')?.addEventListener('click', () => openToiletSheet('rank'));
    $('publishLogBtn')?.addEventListener('click', publishCurrentDraft);

    // Scope toggle buttons
    const toggleScope = () => {
      state.ui.dataScope = state.ui.dataScope === 'demo' ? 'personal' : 'demo';
      saveState();
      renderHomeTheater();
      if (activeSheetId === 'insightsSheet') renderInsightsSheet();
      if (activeSheetId === 'postcardSheet') renderReportHub();
      FeltAudio.softTap();
    };
    $('insightsScopeToggleBtn')?.addEventListener('click', toggleScope);
    $('reportScopeToggleBtn')?.addEventListener('click', toggleScope);

    // Insights sheet footer links
    $('insightsToPkBtn')?.addEventListener('click', openCareStickerSheet);
    $('insightsToPostcardBtn')?.addEventListener('click', () => openReportHub('weekly'));
    $('insightsToDoctorBtn')?.addEventListener('click', openDoctorSummarySheet);
    $('insightsToLogBtn')?.addEventListener('click', () => openLogDrawer({ mode: 'backfill' }));

    // Doctor summary controls
    $('printReportBtn')?.addEventListener('click', () => window.print());
    $('doctorBackBtn')?.addEventListener('click', () => closeAllSheets());

    // Privacy sheet controls
    $('faceIdToggleBtn')?.addEventListener('click', () => {
      state.settings.faceIdBlur = !state.settings.faceIdBlur;
      saveState();
      applyCamouflage();
      FeltAudio.softTap();
    });
    $('clearDemoOnlyBtn')?.addEventListener('click', () => {
      state.logs = state.logs.filter((l) => !l.isDemo);
      state.ui.dataScope = 'personal';
      saveState();
      renderHomeTheater();
      closeAllSheets(true);
      showStampFeedback('已清空演示数据，保留你的个人记录');
    });
    $('resetDemoDataBtn')?.addEventListener('click', () => {
      const personal = state.logs.filter((l) => !l.isDemo);
      state.logs = [...personal, ...buildSeedDemoLogs()].sort((a, b) => b.ts - a.ts);
      state.ui.dataScope = 'demo';
      saveState();
      renderHomeTheater();
      closeAllSheets(true);
      showStampFeedback('已恢复 14 天演示示例数据');
    });

    // 1v1 Care Stickers sheet
    $('copyCareStickerBtn')?.addEventListener('click', async () => {
      const st = CARE_STICKERS[state.ui.activeSticker] || CARE_STICKERS.tissue;
      await copyTextSafe(st.caption);
      FeltAudio.gentleSave();
      showStampFeedback('已复制零隐私轻关心文案');
    });
    $('openPosterFromStickerBtn')?.addEventListener('click', () => openReportHub('poster'));

    // Report Hub controls
    $('singleCareOpenDoctorBtn')?.addEventListener('click', openDoctorSummarySheet);
    $('reportOpenSummaryBtn')?.addEventListener('click', openDoctorSummarySheet);
    $('reportSwitchPosterBtn')?.addEventListener('click', () => openReportHub('poster'));
    $('savePostcardImgBtn')?.addEventListener('click', exportShareCardPng);
    $('copyPostcardTextBtn')?.addEventListener('click', copyShareCaption);
    $('replayCutsceneBtn')?.addEventListener('click', () => {
      const logs = getScopedLogs(state.ui.dataScope);
      const entry = logs.find((l) => l.id === state.ui.selectedArchiveId) || logs[0];
      if (entry && entry.entryType === 'bm' && !isEntryRedFlag(entry, logs)) {
        closeAllSheets(true);
        playFeltCutscene(entry, () => openReportHub('single', entry.id));
      }
    });

    // Toilet add form
    $('toiletQuickAddFooterBtn')?.addEventListener('click', () => switchToiletTab('add'));
    $('toiletSubmitBtn')?.addEventListener('click', () => {
      const name = ($('toiletNameInput')?.value || '').trim();
      if (!name) {
        showStampFeedback('请先填写坑位名称');
        return;
      }
      const area = ($('toiletAreaInput')?.value || '').trim() || (spotFormState.scope === 'public' ? '公共备选' : '私人备忘');
      const note = ($('toiletNoteInput')?.value || '').trim();
      state.toilets.unshift({
        id: `spot_${Date.now()}`,
        name,
        area,
        scope: spotFormState.scope,
        air: spotFormState.air,
        clean: spotFormState.clean,
        tags: spotFormState.tags.slice(),
        note
      });
      saveState();
      if ($('toiletNameInput')) $('toiletNameInput').value = '';
      if ($('toiletAreaInput')) $('toiletAreaInput').value = '';
      if ($('toiletNoteInput')) $('toiletNoteInput').value = '';
      spotFormState = { scope: 'private', air: 4, clean: 4, tags: [] };
      switchToiletTab('rank');
      renderToiletSheet();
      FeltAudio.gentleSave();
      showStampFeedback('已添加坑位备忘');
    });

    // Director Rail (Desktop QA Panel)
    $('directorToggleBtn')?.addEventListener('click', () => {
      const rail = $('directorRail');
      if (rail) rail.hidden = !rail.hidden;
    });
    $('directorCloseBtn')?.addEventListener('click', () => {
      const rail = $('directorRail');
      if (rail) rail.hidden = true;
    });
    $('directorResetBtn')?.addEventListener('click', () => runDemoAction('reset'));
  }

  function runDemoAction(action) {
    switch (action) {
      case 'home':
        exitCareTriage();
        closeAllSheets(true);
        renderHomeTheater();
        break;
      case 'log':
        openLogDrawer({ mode: 'backfill' });
        break;
      case 'eightmin':
        if (!state.activeSession) startPoopSession();
        showSittingReminderToast(state.settings.reminderMin || 8);
        break;
      case 'redflag_clay':
        startCareTriage('clay', null);
        break;
      case 'redflag_black':
        startCareTriage('black', null);
        break;
      case 'redflag_red':
        startCareTriage('red', null);
        break;
      case 'settle_weekly':
        openReportHub('weekly');
        break;
      case 'settle_monthly':
        openReportHub('monthly');
        break;
      case 'poster':
        openReportHub('poster');
        break;
      case 'pk':
        openCareStickerSheet();
        break;
      case 'summary':
        openDoctorSummarySheet();
        break;
      case 'reset':
        localStorage.removeItem(STORAGE_KEY);
        state = createDefaultState();
        saveState();
        exitCareTriage();
        closeAllSheets(true);
        applyCamouflage();
        syncSettingsUI();
        renderHomeTheater();
        showStampFeedback('已重置为干净初始演示状态');
        break;
      default:
        break;
    }
  }

  // --------------------------------------------------------------------------
  // 23. QA & Automated Red-Team Verification Hooks (`window.__poopApp`)
  // --------------------------------------------------------------------------
  window.__poopApp = {
    version: '8.2',
    getState: () => state,
    normalizeCareReason,
    evaluateCareTriage,
    compute7DayStats: (scope) => compute7DayStats(getScopedLogs(scope)),
    compute30DayStats: (scope) => compute30DayStats(getScopedLogs(scope)),
    getPersonal30DayStats: () => compute30DayStats(getPersonalLogs()),
    startPoopSession,
    snoozeSittingReminder,
    finishSessionAndOpenLog,
    openLogDrawer,
    markNoBmToday,
    startCareTriage,
    openReportHub,
    openDoctorSummarySheet,
    openCareStickerSheet,
    copyShareCaption,
    exportShareCardPng,
    setSessionElapsedForTest(sec) {
      if (!state.activeSession) startPoopSession();
      state.activeSession.startedAt = Date.now() - sec * 1000;
      saveState();
      updateSessionTick();
    }
  };

  // --------------------------------------------------------------------------
  // 24. Boot
  // --------------------------------------------------------------------------
  function boot() {
    initAccessGate();
    applyCamouflage();
    syncSettingsUI();
    bindEvents();
    renderHomeTheater();
    ensureTimerLoop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

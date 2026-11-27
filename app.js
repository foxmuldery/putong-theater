/* ==========================================================================
   《噗通剧场》— Interactive Needle-Felted Wool Toy Theater App Logic
   Zero dependencies · 100% localStorage · Zero food metaphors for stool shapes
   ========================================================================== */

(() => {
  'use strict';

  const STORAGE_KEY = 'putong_theater_state_v3';

  // 100% Non-Food Adorable Wool-Felt Nature & Plush Bristol 1-7 Roster
  const BRISTOL_TOYS = [
    {
      type: 1,
      name: '硬球小团',
      shortName: '硬球团',
      img: 'assets/felt/bristol_1.jpg',
      advice: '偏干偏硬，多喝温水',
      clinicalLabel: '1型（硬球状/干结）',
      statusText: '偏干警戒',
      statusClass: 'status-dry',
      stamp: '缺水警戒',
      stampTone: 'dry'
    },
    {
      type: 2,
      name: '疙瘩憋劲团',
      shortName: '疙瘩团',
      img: 'assets/felt/bristol_2.jpg',
      advice: '凹凸偏干，补充膳食纤维',
      clinicalLabel: '2型（团块凹凸状）',
      statusText: '略偏干',
      statusClass: 'status-dry',
      stamp: '纤维急召',
      stampTone: 'dry'
    },
    {
      type: 3,
      name: '缝线微裂团',
      shortName: '微裂团',
      img: 'assets/felt/bristol_3.jpg',
      advice: '轻微裂纹，再多喝半杯水',
      clinicalLabel: '3型（表面微裂条状）',
      statusText: '稳健及格',
      statusClass: 'status-good',
      stamp: '稳健及格',
      stampTone: 'gold'
    },
    {
      type: 4,
      name: '丝滑金冠团',
      shortName: '金冠团',
      img: 'assets/felt/bristol_4.jpg',
      advice: '丝滑完美！佩戴金色小皇冠的五星冠军',
      clinicalLabel: '4型（光滑柔软条状·理想）',
      statusText: '五星冠军',
      statusClass: 'status-good',
      stamp: '五星金绒',
      stampTone: 'gold'
    },
    {
      type: 5,
      name: '软绵小绒团',
      shortName: '小绒团',
      img: 'assets/felt/bristol_5.jpg',
      advice: '略软偏快，规律饮食',
      clinicalLabel: '5型（边缘清晰软团）',
      statusText: '略软偏快',
      statusClass: 'status-soft',
      stamp: '轻柔偏软',
      stampTone: 'soft'
    },
    {
      type: 6,
      name: '炸毛摊软团',
      shortName: '摊软团',
      img: 'assets/felt/bristol_6.jpg',
      advice: '偏稀，注意休息与清淡',
      clinicalLabel: '6型（糊状松散/轻度腹泻）',
      statusText: '轻度偏稀',
      statusClass: 'status-soft',
      stamp: '绒浪预警',
      stampTone: 'soft'
    },
    {
      type: 7,
      name: '委屈小水洼',
      shortName: '小水洼',
      img: 'assets/felt/bristol_7.jpg',
      advice: '水样腹泻，及时补液休息',
      clinicalLabel: '7型（水样无固体/腹泻）',
      statusText: '水样警报',
      statusClass: 'status-soft',
      stamp: '雨云急报',
      stampTone: 'soft'
    }
  ];

  // 6-Color Health Radar
  const COLOR_OPTIONS = [
    { id: 'golden', name: '黄金', sub: '正常', swatch: '#C99638', redFlag: false },
    { id: 'brown', name: '黄褐', sub: '正常', swatch: '#8B5E34', redFlag: false },
    { id: 'green', name: '偏绿', sub: '蔬菜/稍快', swatch: '#6B8450', redFlag: false },
    { id: 'black', name: '柏油黑', sub: '警报', swatch: '#282524', redFlag: true },
    { id: 'red', name: '鲜红/暗红', sub: '警报', swatch: '#9E342E', redFlag: true },
    { id: 'clay', name: '陶土灰白', sub: '警报', swatch: '#B8B0A0', redFlag: true }
  ];

  // Dietary & Lifestyle Trigger Tags
  const TRIGGER_TAGS = [
    '冰美式',
    '重辣火锅',
    '奶茶乳糖',
    '熬夜',
    '压力大',
    '喝水少',
    '久坐'
  ];

  const EASE_OPTIONS = ['顺畅', '费力', '急促'];
  const DURATION_PRESETS = [150, 258, 375, 520]; // 2:30, 4:18, 6:15, 8:40

  // Calm Medical Red-Flag Guidance (Orange Tabby Cat Doctor on Duty)
  const RED_FLAG_GUIDE = {
    black: {
      dept: '建议挂号：消化内科',
      explanation:
        '大橘猫猫医生注意到本次记录为“柏油黑”。若近期未食用动物血制品、黑芝麻，也未服用铁剂或铋剂，黑便可能提示上消化道出血，建议尽早前往消化内科做粪便潜血等检查。'
    },
    red: {
      dept: '建议挂号：肛肠科 / 消化内科',
      explanation:
        '大橘猫猫医生注意到本次记录为“鲜红/暗红”。在排除火龙果、甜菜根等饮食染色后，便中带血常见于痔疮、肛裂或下消化道出血，建议及时前往肛肠科或消化内科明确原因。'
    },
    clay: {
      dept: '建议挂号：消化内科 / 肝胆外科',
      explanation:
        '大橘猫猫医生注意到本次记录为“陶土灰白”。粪便颜色明显变浅可能提示胆汁排泄受阻或肝胆胰通路异常，建议尽快前往消化内科做进一步检查。'
    },
    bristol7_streak: {
      dept: '建议挂号：消化内科',
      explanation:
        '大橘猫猫医生注意到你已连续 2 次记录“7型水样腹泻”。频繁水样便容易引发脱水与电解质紊乱，请先少量多次补充电解质水；若伴随发热、腹痛或持续超过 24 小时，建议及时就医。'
    }
  };

  // Discreet Home Screen Camouflage Skins (Bespoke Felt SVG Icons)
  const CAMOUFLAGE_SKINS = [
    {
      id: 'default',
      name: '便便日记',
      subtitle: '手工毛毡肠道手账',
      pillLabel: '伪装外观',
      desc: '原始手工毛毡剧场外观（可在下方一键换皮）',
      bg: 'linear-gradient(145deg, #F3DEAF, #E2B76A)',
      svg: `<svg viewBox="0 0 36 36" fill="none"><path d="M10 23C10 17.5 13.5 13 18 13C22.5 13 26 17.5 26 23C26 25.5 23 27 18 27C13 27 10 25.5 10 23Z" fill="#FFF8E8" stroke="#6E4D2B" stroke-width="1.8"/><path d="M13 12L15.2 8.5L18 11.2L20.8 8.5L23 12H13Z" fill="#D99B38" stroke="#6E4D2B" stroke-width="1.5" stroke-linejoin="round"/><circle cx="15.4" cy="20" r="1.4" fill="#3E2D20"/><circle cx="20.6" cy="20" r="1.4" fill="#3E2D20"/><path d="M16.5 22.8C17.4 23.7 18.6 23.7 19.5 22.8" stroke="#3E2D20" stroke-width="1.5" stroke-linecap="round"/></svg>`
    },
    {
      id: 'weather',
      name: '毛毡天气',
      subtitle: '今日晴 · 23°C',
      pillLabel: '天气皮',
      desc: '桌面显示为温柔毛毡云朵天气图标，借手机零尴尬',
      bg: 'linear-gradient(145deg, #CADBE3, #96B5C6)',
      svg: `<svg viewBox="0 0 36 36" fill="none"><circle cx="22.5" cy="13.5" r="4.8" fill="#F6C86B" stroke="#6E5228" stroke-width="1.5"/><path d="M10.5 24.5H23.5C25.9 24.5 27.5 22.8 27.5 20.6C27.5 18.5 25.9 16.9 23.8 16.8C23.1 14 20.7 12.2 17.8 12.2C14.3 12.2 11.6 14.9 11.6 18.3C9.6 18.7 8.3 20.2 8.3 22C8.3 23.5 9.3 24.5 10.5 24.5Z" fill="#FAF6EC" stroke="#536A78" stroke-width="1.6" stroke-linejoin="round"/></svg>`
    },
    {
      id: 'journal',
      name: '手帐笔记',
      subtitle: '日常拼贴本',
      pillLabel: '手帐皮',
      desc: '桌面伪装为淡奶油线装手帐本，标题与顶栏同步低调',
      bg: 'linear-gradient(145deg, #EADAC3, #CFAF88)',
      svg: `<svg viewBox="0 0 36 36" fill="none"><rect x="9.5" y="7.5" width="17" height="21" rx="3.5" fill="#FFF9EE" stroke="#6D5037" stroke-width="1.7"/><path d="M14 13.5H22M14 18H22M14 22.5H19" stroke="#9B7553" stroke-width="1.6" stroke-linecap="round"/><path d="M7.8 12.5H11M7.8 18H11M7.8 23.5H11" stroke="#6D5037" stroke-width="1.6" stroke-linecap="round"/></svg>`
    },
    {
      id: 'plant',
      name: '绿植日志',
      subtitle: '盆栽浇水志',
      pillLabel: '绿植皮',
      desc: '桌面伪装为软萌毛毡龟背竹养护记录，自然又治愈',
      bg: 'linear-gradient(145deg, #CFE0C8, #97B38D)',
      svg: `<svg viewBox="0 0 36 36" fill="none"><path d="M13 22H23L21.5 28.5H14.5L13 22Z" fill="#D58258" stroke="#63402D" stroke-width="1.6" stroke-linejoin="round"/><path d="M18 22V14" stroke="#4D6E48" stroke-width="1.8" stroke-linecap="round"/><path d="M18 17C14 17 11.2 14.5 11.5 10.8C15.2 10.6 18 13.2 18 17Z" fill="#7FA676" stroke="#466341" stroke-width="1.5"/><path d="M18 15.5C22 15.5 24.8 13 24.5 9.3C20.8 9.1 18 11.7 18 15.5Z" fill="#8FB584" stroke="#466341" stroke-width="1.5"/></svg>`
    }
  ];

  // =========================================================================
  // WebAudio Soft Felt Tactile Synthesizer (Zero External Files)
  // =========================================================================
  const FeltAudio = (() => {
    let ctx = null;
    let enabled = true;

    function getCtx() {
      if (!enabled) return null;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      if (!ctx) ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    }

    function playTone(freqStart, freqEnd, duration, volume, type = 'sine', delay = 0) {
      const ac = getCtx();
      if (!ac) return;
      const now = ac.currentTime + delay;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const filter = ac.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), now + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(980, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.014);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    return {
      setEnabled(val) {
        enabled = Boolean(val);
      },
      isEnabled() {
        return enabled;
      },
      softTap() {
        playTone(230, 145, 0.085, 0.08, 'triangle');
      },
      toyBounce() {
        playTone(300, 440, 0.09, 0.085, 'sine');
        playTone(440, 360, 0.08, 0.055, 'triangle', 0.05);
      },
      stampPublish() {
        playTone(260, 180, 0.09, 0.1, 'triangle');
        playTone(392, 523.25, 0.16, 0.07, 'sine', 0.06);
        playTone(523.25, 659.25, 0.2, 0.055, 'sine', 0.14);
      },
      victoryFanfare() {
        playTone(523.25, 523.25, 0.11, 0.075, 'triangle', 0);
        playTone(659.25, 659.25, 0.12, 0.075, 'triangle', 0.09);
        playTone(783.99, 783.99, 0.16, 0.08, 'sine', 0.18);
        playTone(1046.5, 1046.5, 0.28, 0.065, 'sine', 0.28);
      },
      desertDrum() {
        playTone(190, 120, 0.12, 0.09, 'triangle', 0);
        playTone(260, 210, 0.14, 0.075, 'triangle', 0.12);
      },
      stormPlop() {
        playTone(320, 520, 0.1, 0.075, 'sine', 0);
        playTone(280, 460, 0.12, 0.07, 'sine', 0.11);
      },
      redFlagChime() {
        playTone(329.63, 329.63, 0.34, 0.065, 'sine');
        playTone(261.63, 261.63, 0.42, 0.055, 'sine', 0.16);
      },
      alertToast() {
        playTone(360, 290, 0.1, 0.08, 'triangle');
        playTone(360, 290, 0.1, 0.08, 'triangle', 0.14);
      }
    };
  })();

  // =========================================================================
  // Dynamic CARROT-Style Deadpan Comedy Engine (100% Zero Food Metaphors!)
  // =========================================================================
  function generateComedyBulletin({ bristol, triggers, durationSec, ease, color }) {
    const toy = BRISTOL_TOYS.find((t) => t.type === bristol) || BRISTOL_TOYS[3];
    const has = (tag) => triggers.includes(tag);
    const overEight = durationSec >= 480;

    if (color === 'green') {
      return {
        headline: '“绿意盎然的毛毡特快已进站，不是蔬菜吃多了，就是肠道刚踩了一脚地板油。”',
        stamp: toy.stamp,
        stampTone: toy.stampTone
      };
    }

    if (overEight && bristol <= 2) {
      return {
        headline: `“蹲满 ${Math.floor(durationSec / 60)} 分钟才请出${toy.name}，手机电量比肠道还努力，赶紧喝杯温水吧！”`,
        stamp: '久蹲警戒',
        stampTone: 'dry'
      };
    }

    if (bristol === 4) {
      if (has('重辣火锅')) {
        return {
          headline: '“昨夜重辣火锅企图搞事，被四号金冠团优雅镇压！”',
          stamp: '五星金绒',
          stampTone: 'gold'
        };
      }
      if (has('冰美式')) {
        return {
          headline: '“冰美式刚递上战书，丝滑金冠团淡定戴上皇冠：就这？”',
          stamp: '五星金绒',
          stampTone: 'gold'
        };
      }
      if (has('熬夜') || has('压力大')) {
        return {
          headline: '“哪怕昨晚熬夜承压，四号金冠团依然交出了教科书级丝滑答卷。”',
          stamp: '铁血金绒',
          stampTone: 'gold'
        };
      }
      return {
        headline: '“丝滑金冠团准时登台，今天你的肠道配得上全体毛毡起立鼓掌。”',
        stamp: '五星金绒',
        stampTone: 'gold'
      };
    }

    if (bristol === 3) {
      if (has('喝水少') || has('久坐')) {
        return {
          headline: '“缝线微裂团带着轻微干纹报到：再多喝半杯温水，明天就能冲冠四号金绒！”',
          stamp: '稳健及格',
          stampTone: 'gold'
        };
      }
      return {
        headline: '“缝线微裂团稳健落地，距离五星金冠团只差半杯温水的距离。”',
        stamp: '稳健及格',
        stampTone: 'gold'
      };
    }

    if (bristol === 1) {
      if (has('喝水少')) {
        return {
          headline: '“硬球小团拒绝配合演出，肠道联名发函：饮水机就在三米外！”',
          stamp: '缺水警戒',
          stampTone: 'dry'
        };
      }
      return {
        headline: '“硬球小团叮咚报到，今日份水分预算严重赤字，立刻续杯温水。”',
        stamp: '缺水警戒',
        stampTone: 'dry'
      };
    }

    if (bristol === 2) {
      if (has('久坐') || has('压力大')) {
        return {
          headline: '“工位久坐把疙瘩憋劲团憋出了倔强脾气，今晚请务必给肠道批点膳食纤维。”',
          stamp: '纤维急召',
          stampTone: 'dry'
        };
      }
      return {
        headline: '“疙瘩憋劲团自带棱角登场，顺畅指数告急，蔬菜和温水请火速驰援。”',
        stamp: '纤维急召',
        stampTone: 'dry'
      };
    }

    if (bristol === 5) {
      if (has('奶茶乳糖')) {
        return {
          headline: '“奶茶乳糖轻推了一把，软绵小绒团提早交卷，今天饮食清淡点就好。”',
          stamp: '轻柔偏软',
          stampTone: 'soft'
        };
      }
      return {
        headline: '“软绵小绒团抢跑亮相，肠道节拍稍快半拍，规律三餐就能稳住阵脚。”',
        stamp: '轻柔偏软',
        stampTone: 'soft'
      };
    }

    if (bristol === 6) {
      if (has('冰美式') && has('熬夜')) {
        return {
          headline: '“冰美式联手熬夜发动突袭，炸毛摊软团当场接管戏台——早睡能救命！”',
          stamp: '绒浪预警',
          stampTone: 'soft'
        };
      }
      if (has('重辣火锅')) {
        return {
          headline: '“昨夜重辣火锅的账单今早到账，炸毛摊软团提醒你：今天喝点温粥歇一歇。”',
          stamp: '绒浪预警',
          stampTone: 'soft'
        };
      }
      if (has('冰美式') || has('奶茶乳糖')) {
        return {
          headline: '“冰饮刺客精准命中肠道防线，炸毛摊软团举牌抗议：下回换热饮吧！”',
          stamp: '绒浪预警',
          stampTone: 'soft'
        };
      }
      return {
        headline: '“炸毛摊软团临时加演一场，别慌，今天少油少辣多喝温水稳住节奏。”',
        stamp: '绒浪预警',
        stampTone: 'soft'
      };
    }

    // Bristol 7 (single occurrence; 2 in a row triggers Red-Flag Calm Care)
    if (ease === '急促' || has('重辣火锅') || has('冰美式')) {
      return {
        headline: '“委屈小水洼拉响一级水帘警报，立刻补充电解质水，今晚让肠胃彻底休假。”',
        stamp: '雨云急报',
        stampTone: 'soft'
      };
    }
    return {
      headline: '“委屈小水洼飘过剧场，注意保暖与补液；若连续出现请认真关注身体信号。”',
      stamp: '雨云急报',
      stampTone: 'soft'
    };
  }

  // =========================================================================
  // Seed Realistic 14-Day History (Zero Food Metaphors)
  // =========================================================================
  function createSeedState() {
    const now = new Date();
    function daysAgoISO(daysAgo, hour, minute) {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      d.setHours(hour, minute, 0, 0);
      return d.toISOString();
    }

    const seedLogs = [
      {
        id: 'log-14',
        timestamp: daysAgoISO(0, 8, 42),
        bristol: 4,
        color: 'golden',
        triggers: ['重辣火锅'],
        durationSec: 258,
        ease: '顺畅',
        headline: '“昨夜重辣火锅企图搞事，被四号金冠团优雅镇压！”',
        stamp: '五星金绒',
        stampTone: 'gold'
      },
      {
        id: 'log-13',
        timestamp: daysAgoISO(1, 9, 10),
        bristol: 4,
        color: 'brown',
        triggers: [],
        durationSec: 215,
        ease: '顺畅',
        headline: '“丝滑金冠团准时登台，今天你的肠道配得上全体毛毡起立鼓掌。”',
        stamp: '五星金绒',
        stampTone: 'gold'
      },
      {
        id: 'log-12',
        timestamp: daysAgoISO(2, 8, 25),
        bristol: 3,
        color: 'brown',
        triggers: ['久坐'],
        durationSec: 270,
        ease: '顺畅',
        headline: '“缝线微裂团带着轻微干纹报到：再多喝半杯温水，明天就能冲冠四号金绒！”',
        stamp: '稳健及格',
        stampTone: 'gold'
      },
      {
        id: 'log-11',
        timestamp: daysAgoISO(3, 10, 5),
        bristol: 4,
        color: 'golden',
        triggers: [],
        durationSec: 195,
        ease: '顺畅',
        headline: '“丝滑金冠团稳坐头牌，肠道秩序井然。”',
        stamp: '五星金绒',
        stampTone: 'gold'
      },
      {
        id: 'log-10',
        timestamp: daysAgoISO(4, 8, 50),
        bristol: 4,
        color: 'golden',
        triggers: [],
        durationSec: 240,
        ease: '顺畅',
        headline: '“四号金冠团佩戴小皇冠谢幕，状态稳如老狗。”',
        stamp: '五星金绒',
        stampTone: 'gold'
      },
      {
        id: 'log-9',
        timestamp: daysAgoISO(5, 9, 32),
        bristol: 3,
        color: 'brown',
        triggers: ['喝水少'],
        durationSec: 310,
        ease: '顺畅',
        headline: '“缝线微裂团稳健落地，再补半杯温水就是满分。”',
        stamp: '稳健及格',
        stampTone: 'gold'
      },
      {
        id: 'log-8',
        timestamp: daysAgoISO(6, 11, 18),
        bristol: 6,
        color: 'brown',
        triggers: ['冰美式', '熬夜'],
        durationSec: 280,
        ease: '急促',
        headline: '“冰美式联手熬夜发动突袭，炸毛摊软团当场接管戏台——早睡能救命！”',
        stamp: '绒浪预警',
        stampTone: 'soft'
      },
      {
        id: 'log-7',
        timestamp: daysAgoISO(7, 8, 40),
        bristol: 4,
        color: 'golden',
        triggers: [],
        durationSec: 210,
        ease: '顺畅',
        headline: '“丝滑金冠团丝滑登场，肠道五星好评。”',
        stamp: '五星金绒',
        stampTone: 'gold'
      },
      {
        id: 'log-6',
        timestamp: daysAgoISO(8, 21, 15),
        bristol: 2,
        color: 'brown',
        triggers: ['喝水少', '久坐'],
        durationSec: 440,
        ease: '费力',
        headline: '“工位久坐把疙瘩憋劲团憋出了倔强脾气，今晚请务必给肠道批点膳食纤维。”',
        stamp: '纤维急召',
        stampTone: 'dry'
      },
      {
        id: 'log-5',
        timestamp: daysAgoISO(9, 9, 12),
        bristol: 4,
        color: 'golden',
        triggers: [],
        durationSec: 225,
        ease: '顺畅',
        headline: '“丝滑金冠团准时营业。”',
        stamp: '五星金绒',
        stampTone: 'gold'
      },
      {
        id: 'log-4',
        timestamp: daysAgoISO(10, 14, 20),
        bristol: 6,
        color: 'green',
        triggers: ['重辣火锅', '冰美式'],
        durationSec: 330,
        ease: '急促',
        headline: '“冰美式加辣锅双重暴击，炸毛摊软团火速登场。”',
        stamp: '绒浪预警',
        stampTone: 'soft'
      },
      {
        id: 'log-3',
        timestamp: daysAgoISO(11, 8, 55),
        bristol: 5,
        color: 'brown',
        triggers: ['奶茶乳糖'],
        durationSec: 245,
        ease: '顺畅',
        headline: '“奶茶乳糖轻推了一把，软绵小绒团提早交卷。”',
        stamp: '轻柔偏软',
        stampTone: 'soft'
      },
      {
        id: 'log-2',
        timestamp: daysAgoISO(12, 9, 4),
        bristol: 4,
        color: 'golden',
        triggers: [],
        durationSec: 200,
        ease: '顺畅',
        headline: '“四号金冠团五星收官。”',
        stamp: '五星金绒',
        stampTone: 'gold'
      },
      {
        id: 'log-1',
        timestamp: daysAgoISO(13, 20, 48),
        bristol: 1,
        color: 'brown',
        triggers: ['喝水少', '熬夜'],
        durationSec: 495,
        ease: '费力',
        headline: '“硬球小团拒绝配合演出，饮水机就在三米外！”',
        stamp: '缺水警戒',
        stampTone: 'dry'
      }
    ];

    return {
      episode: 42,
      logs: seedLogs,
      settings: {
        soundEnabled: true,
        faceIdEnabled: true,
        camouflage: 'default'
      }
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createSeedState();
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.logs) || parsed.logs.length === 0) {
        return createSeedState();
      }
      return parsed;
    } catch (_err) {
      return createSeedState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_err) {
      // Ignore storage quota errors in sandboxed iframes
    }
  }

  // Preset Fun Rivals for Privacy-Safe Wool-Felt Arena PK
  const PK_RIVALS = [
    {
      id: 'azhe',
      label: '摸鱼搭子 · 阿哲',
      shortName: '阿哲',
      role: '摸鱼搭子',
      bristol: 6,
      triggerStory: '昨夜火锅',
      avgMin: '6分12秒',
      streak: 2,
      breakdown: { ideal: 24, speed: 16, streak: 8, resilience: 10 },
      score: 58
    },
    {
      id: 'xiaolin',
      label: '家里那位 · 小林',
      shortName: '小林',
      role: '家里那位',
      bristol: 4,
      triggerStory: '温水早睡',
      avgMin: '3分40秒',
      streak: 7,
      breakdown: { ideal: 36, speed: 24, streak: 16, resilience: 13 },
      score: 89
    },
    {
      id: 'ami',
      label: '冰美式战友 · 阿米',
      shortName: '阿米',
      role: '冰美式战友',
      bristol: 2,
      triggerStory: '冰美式少水',
      avgMin: '7分20秒',
      streak: 3,
      breakdown: { ideal: 22, speed: 13, streak: 10, resilience: 11 },
      score: 56
    }
  ];

  // =========================================================================
  // Viral Feature 1: Felt Detective GI Strategy Diet Deduction Engine
  // Deduces likely 12-24h diet/habits from stool form + color + effort + history
  // =========================================================================
  function inferLikelyDiet(entry, history = []) {
    const bristol = Number(entry && entry.bristol) || 4;
    const color = (entry && entry.color) || 'golden';
    const durationSec = Number(entry && entry.durationSec) || 240;
    const ease = (entry && entry.ease) || '顺畅';
    const triggers = Array.isArray(entry && entry.triggers) ? entry.triggers : [];
    const colObj = getColorObj(color);

    // Safety Red Line: NEVER run playful diet guesses on red-flag signals
    if (colObj.redFlag) {
      return {
        redFlagBlocked: true,
        confidence: 0,
        shortGuess: '红灯关注中，暂停饮食反推',
        fullReason: '该颜色触发医学红灯关注，已交由大橘猫猫医生安心关护模式处理。',
        suggestedTags: []
      };
    }

    // Personal historical trigger mining for same Bristol bucket
    const sameBucketLogs = (Array.isArray(history) ? history : []).filter((h) => {
      if (bristol <= 2) return h.bristol <= 2;
      if (bristol >= 5) return h.bristol >= 5;
      return h.bristol === bristol;
    });
    const histCounts = {};
    sameBucketLogs.forEach((h) => {
      (h.triggers || []).forEach((t) => {
        histCounts[t] = (histCounts[t] || 0) + 1;
      });
    });
    const topHistTrigger = Object.keys(histCounts).sort((a, b) => histCounts[b] - histCounts[a])[0];

    const hour = entry && entry.timestamp ? new Date(entry.timestamp).getHours() : new Date().getHours();
    const isMorning = hour >= 5 && hour <= 11;

    if (color === 'green' && bristol <= 5) {
      return {
        redFlagBlocked: false,
        confidence: 86,
        shortGuess: '大量深绿叶菜 + 肠道快速通行',
        fullReason: '反推近 12–24h：可能摄入较多深色绿叶菜，或肠道蠕动偏快导致胆绿素来不及完全转化。',
        suggestedTags: ['冰美式']
      };
    }

    if (bristol <= 2) {
      const conf = durationSec >= 360 || ease === '费力' ? 91 : 85;
      const histHint = topHistTrigger ? `（历史命中：${topHistTrigger}）` : '';
      return {
        redFlagBlocked: false,
        confidence: conf,
        shortGuess: `饮水不足 + 精制碳水/低纤维 + 久坐${histHint}`,
        fullReason: `反推近 12–24h：大概率喝水偏少、外卖精制主食占比高且久坐偏多${topHistTrigger ? `；结合你的历史档案，「${topHistTrigger}」高频伴随干硬团子` : ''}。`,
        suggestedTags: ['喝水少', '久坐']
      };
    }

    if (bristol === 3) {
      return {
        redFlagBlocked: false,
        confidence: 84,
        shortGuess: '膳食纤维达标，但下午少喝了约 400ml 温水',
        fullReason: '反推近 12–24h：蔬菜纤维底子不错，只是午后忙于工作少喝了一大杯温水，补上温水明天直冲四号金冠团。',
        suggestedTags: ['喝水少']
      };
    }

    if (bristol === 4) {
      if (triggers.includes('重辣火锅') || triggers.includes('冰美式')) {
        const challenger = triggers.includes('重辣火锅') ? '重辣火锅' : '冰美式';
        return {
          redFlagBlocked: false,
          confidence: 89,
          shortGuess: `${challenger}突袭，但温水与蔬果打底稳如泰山`,
          fullReason: `反推近 12–24h：虽然经历了「${challenger}」考验，但你用充足温水、蔬果纤维和规律作息稳稳扛住了暴击！`,
          suggestedTags: [challenger]
        };
      }
      return {
        redFlagBlocked: false,
        confidence: 91,
        shortGuess: '温热均衡正餐 + 蔬果纤维 + 饮水充足',
        fullReason: '反推近 12–24h：大概率吃得温热规律、蔬菜纤维在线且饮水充沛，属于肠道五星模范作息。',
        suggestedTags: []
      };
    }

    if (bristol === 5 || bristol === 6) {
      const conf = ease === '急促' ? 92 : 87;
      if (topHistTrigger === '冰美式' || isMorning) {
        return {
          redFlagBlocked: false,
          confidence: conf,
          shortGuess: `冰美式 / 熬夜（或昨夜重辣火锅）`,
          fullReason: `反推近 12–24h：结合你的历史背刺数据，「${topHistTrigger || '冰美式'}」联手熬夜或重口宵夜极易在次日召唤偏软团子。`,
          suggestedTags: ['冰美式', '熬夜']
        };
      }
      if (topHistTrigger === '重辣火锅') {
        return {
          redFlagBlocked: false,
          confidence: conf,
          shortGuess: '重辣火锅 / 烧烤油腻 + 冰饮刺激',
          fullReason: '反推近 12–24h：高度疑似昨夜重油重辣或冰饮双重夹击，肠道连夜加速清场。',
          suggestedTags: ['重辣火锅', '冰美式']
        };
      }
      return {
        redFlagBlocked: false,
        confidence: conf,
        shortGuess: '奶茶乳糖 / 冰美式或晚睡压力',
        fullReason: '反推近 12–24h：可能喝了冰饮、含乳糖奶茶或近期压力晚睡导致肠道节拍偏快。',
        suggestedTags: ['奶茶乳糖', '熬夜']
      };
    }

    // Bristol 7 (single event)
    return {
      redFlagBlocked: false,
      confidence: 88,
      shortGuess: '冰冷生食 / 重辣超载 · 建议少量多次补温水',
      fullReason: '反推近 12–24h：高度疑似生冷刺激、重辣过载或受凉引起肠道快速通行；请先温和补充电解质水并注意休息。',
      suggestedTags: ['重辣火锅', '冰美式']
    };
  }

  // =========================================================================
  // Dynamic Settlement Mini-Theater Mood Helper (`gold` | `desert` | `storm` | `care`)
  // =========================================================================
  function getSettlementMoodTheme(type, isRedFlag = false) {
    if (isRedFlag) {
      return {
        mood: 'care',
        stageName: '大橘猫猫医生静音诊室',
        bgTop: '#2D2520',
        bgBottom: '#3A312A',
        curtainColor: '#4A3C31',
        stampBg: '#FBF4E4',
        stampInk: '#2C3830',
        accentColor: '#B47B34'
      };
    }
    const t = Number(type) || 4;
    if (t === 3 || t === 4) {
      return {
        mood: 'gold',
        stageName: '金绒凯旋剧场',
        bgTop: '#FDF4DC',
        bgBottom: '#F7E3B5',
        curtainColor: '#B5423A',
        stampBg: '#FFF4CE',
        stampInk: '#8E580B',
        accentColor: '#C7821F'
      };
    }
    if (t === 1 || t === 2) {
      return {
        mood: 'desert',
        stageName: '荒漠攻坚剧场',
        bgTop: '#F8E6D3',
        bgBottom: '#ECCBA9',
        curtainColor: '#B56B3A',
        stampBg: '#FDE8D6',
        stampInk: '#8E441A',
        accentColor: '#B85C2B'
      };
    }
    return {
      mood: 'storm',
      stageName: '暴风急行剧场',
      bgTop: '#E4EDF1',
      bgBottom: '#C9DCE5',
      curtainColor: '#3B5268',
      stampBg: '#EBF1F6',
      stampInk: '#324C66',
      accentColor: '#3D5F7D'
    };
  }

  // =========================================================================
  // Application State
  // =========================================================================
  let state = loadState();
  let currentMode = 'theater'; // 'theater' | 'redflag'
  let activeRedFlagReason = 'black';
  let activeSheet = null; // 'log' | 'insights' | 'doctor' | 'privacy' | 'pk' | 'postcard' | null
  let activeRivalId = 'azhe';
  let pkBanterCount = 0;
  let activeShareTab = 'single'; // 'single' | 'weekly' | 'monthly' | 'pk'
  let pkInviteCode = 'PUTONG-PK-842';
  let includePkRibbon = true;
  let stageStaticMode = false;
  let settlementPreviewEntry = null;
  let directorActiveHint = '';

  // Draft state for 5-second logging drawer
  const draft = {
    bristol: 4,
    color: 'golden',
    triggers: [],
    ease: '顺畅',
    durationPresetIdx: 1,
    durationSec: 258
  };

  // Squat Timer state
  const timer = {
    running: false,
    seconds: 0,
    intervalId: null,
    eightMinTriggered: false
  };

  // =========================================================================
  // DOM References
  // =========================================================================
  const el = {
    appShell: document.getElementById('appShell'),
    stageHeroImg: document.getElementById('stageHeroImg'),
    stageDoctorImg: document.getElementById('stageDoctorImg'),
    brandButton: document.getElementById('brandButton'),
    brandTitle: document.getElementById('brandTitle'),
    brandSubtitle: document.getElementById('brandSubtitle'),
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    privacyBtn: document.getElementById('privacyBtn'),
    privacyPillLabel: document.getElementById('privacyPillLabel'),
    timerPillBtn: document.getElementById('timerPillBtn'),
    timerDisplay: document.getElementById('timerDisplay'),
    playbillBadge: document.getElementById('playbillBadge'),
    playbillText: document.getElementById('playbillText'),
    demoEightMinBtn: document.getElementById('demoEightMinBtn'),

    eightMinToast: document.getElementById('eightMinToast'),
    closeToastBtn: document.getElementById('closeToastBtn'),
    toastLogNowBtn: document.getElementById('toastLogNowBtn'),
    toastResetTimerBtn: document.getElementById('toastResetTimerBtn'),

    theaterCard: document.getElementById('theaterCard'),
    latestToyThumb: document.getElementById('latestToyThumb'),
    latestTimeLabel: document.getElementById('latestTimeLabel'),
    latestBristolTag: document.getElementById('latestBristolTag'),
    stageStampBadge: document.getElementById('stageStampBadge'),
    comedyHeadline: document.getElementById('comedyHeadline'),
    detectiveStrip: document.getElementById('detectiveStrip'),
    detectiveConfBadge: document.getElementById('detectiveConfBadge'),
    detectiveGuessText: document.getElementById('detectiveGuessText'),
    detectiveFeedbackBtns: document.getElementById('detectiveFeedbackBtns'),
    detectiveHitBtn: document.getElementById('detectiveHitBtn'),
    detectiveMissBtn: document.getElementById('detectiveMissBtn'),
    detectiveOverrideRow: document.getElementById('detectiveOverrideRow'),
    detectiveOverrideChips: document.getElementById('detectiveOverrideChips'),
    bulletinStats: document.getElementById('bulletinStats'),
    openLogBtn: document.getElementById('openLogBtn'),
    openPkBtn: document.getElementById('openPkBtn'),
    openInsightsBtn: document.getElementById('openInsightsBtn'),
    openShareDailyBtn: document.getElementById('openShareDailyBtn'),
    openRedFlagDemoBtn: document.getElementById('openRedFlagDemoBtn'),

    redFlagCard: document.getElementById('redFlagCard'),
    careDepartmentBadge: document.getElementById('careDepartmentBadge'),
    careExplanation: document.getElementById('careExplanation'),
    careOpenReportBtn: document.getElementById('careOpenReportBtn'),
    careExitBtn: document.getElementById('careExitBtn'),

    sheetScrim: document.getElementById('sheetScrim'),
    logDrawer: document.getElementById('logDrawer'),
    insightsSheet: document.getElementById('insightsSheet'),
    doctorSheet: document.getElementById('doctorSheet'),
    privacySheet: document.getElementById('privacySheet'),
    pkSheet: document.getElementById('pkSheet'),
    postcardSheet: document.getElementById('postcardSheet'),

    cycleDurationBtn: document.getElementById('cycleDurationBtn'),
    logDurationLabel: document.getElementById('logDurationLabel'),
    bristolPrevBtn: document.getElementById('bristolPrevBtn'),
    bristolNextBtn: document.getElementById('bristolNextBtn'),
    bristolRail: document.getElementById('bristolRail'),
    bristolDotNav: document.getElementById('bristolDotNav'),
    selectedBristolName: document.getElementById('selectedBristolName'),
    selectedBristolStatus: document.getElementById('selectedBristolStatus'),
    selectedBristolAdvice: document.getElementById('selectedBristolAdvice'),
    colorGrid: document.getElementById('colorGrid'),
    colorRedFlagHint: document.getElementById('colorRedFlagHint'),
    draftDetectiveBox: document.getElementById('draftDetectiveBox'),
    draftDetectiveConf: document.getElementById('draftDetectiveConf'),
    draftDetectiveText: document.getElementById('draftDetectiveText'),
    adoptDetectiveTagsBtn: document.getElementById('adoptDetectiveTagsBtn'),
    triggerChips: document.getElementById('triggerChips'),
    easeGroup: document.getElementById('easeGroup'),
    publishLogBtn: document.getElementById('publishLogBtn'),

    insightsKpiStrip: document.getElementById('insightsKpiStrip'),
    trendChart: document.getElementById('trendChart'),
    trendSelectedDetail: document.getElementById('trendSelectedDetail'),
    historyList: document.getElementById('historyList'),
    correlationList: document.getElementById('correlationList'),
    insightsToPkBtn: document.getElementById('insightsToPkBtn'),
    insightsToPostcardBtn: document.getElementById('insightsToPostcardBtn'),
    easterEggToggleBtn: document.getElementById('easterEggToggleBtn'),
    easterEggChevron: document.getElementById('easterEggChevron'),
    easterEggBody: document.getElementById('easterEggBody'),
    eggCurrencyValue: document.getElementById('eggCurrencyValue'),
    eggSubNote: document.getElementById('eggSubNote'),
    insightsToDoctorBtn: document.getElementById('insightsToDoctorBtn'),
    insightsToLogBtn: document.getElementById('insightsToLogBtn'),

    doctorDateRange: document.getElementById('doctorDateRange'),
    clinicalAlertBanner: document.getElementById('clinicalAlertBanner'),
    doctorMetricsGrid: document.getElementById('doctorMetricsGrid'),
    doctorTableBody: document.getElementById('doctorTableBody'),
    printReportBtn: document.getElementById('printReportBtn'),
    doctorBackBtn: document.getElementById('doctorBackBtn'),

    faceIdToggleBtn: document.getElementById('faceIdToggleBtn'),
    camouflagePreviewIcon: document.getElementById('camouflagePreviewIcon'),
    camouflagePreviewName: document.getElementById('camouflagePreviewName'),
    camouflagePreviewDesc: document.getElementById('camouflagePreviewDesc'),
    camouflageGrid: document.getElementById('camouflageGrid'),
    resetDemoDataBtn: document.getElementById('resetDemoDataBtn'),

    pkRivalTabs: document.getElementById('pkRivalTabs'),
    pkInviteCodePill: document.getElementById('pkInviteCodePill'),
    pkMyImg: document.getElementById('pkMyImg'),
    pkMyToyName: document.getElementById('pkMyToyName'),
    pkMyScore: document.getElementById('pkMyScore'),
    pkRivalImg: document.getElementById('pkRivalImg'),
    pkRivalName: document.getElementById('pkRivalName'),
    pkRivalToyName: document.getElementById('pkRivalToyName'),
    pkRivalScore: document.getElementById('pkRivalScore'),
    pkVerdictBanner: document.getElementById('pkVerdictBanner'),
    pkBarsGrid: document.getElementById('pkBarsGrid'),
    pkBanterCounter: document.getElementById('pkBanterCounter'),
    pkSendTissueBtn: document.getElementById('pkSendTissueBtn'),
    pkSendWaterBtn: document.getElementById('pkSendWaterBtn'),
    pkCopyInviteBtn: document.getElementById('pkCopyInviteBtn'),
    pkToShareBtn: document.getElementById('pkToShareBtn'),

    shareCardSingle: document.getElementById('shareCardSingle'),
    shareCardWeekly: document.getElementById('shareCardWeekly'),
    shareCardMonthly: document.getElementById('shareCardMonthly'),
    shareCardPk: document.getElementById('shareCardPk'),

    singleStageKicker: document.getElementById('singleStageKicker'),
    singleMoodLabel: document.getElementById('singleMoodLabel'),
    toggleStageMotionBtn: document.getElementById('toggleStageMotionBtn'),
    singleNormalStage: document.getElementById('singleNormalStage'),
    singleCareStage: document.getElementById('singleCareStage'),
    singleCareNote: document.getElementById('singleCareNote'),
    singleCareOpenDoctorBtn: document.getElementById('singleCareOpenDoctorBtn'),
    singleNormalDetails: document.getElementById('singleNormalDetails'),
    shareDailyImg: document.getElementById('shareDailyImg'),
    singleRankStamp: document.getElementById('singleRankStamp'),
    singleRankGrade: document.getElementById('singleRankGrade'),
    singleRankTitle: document.getElementById('singleRankTitle'),
    singleRankScore: document.getElementById('singleRankScore'),
    shareDailyHeadline: document.getElementById('shareDailyHeadline'),
    hudToyLabel: document.getElementById('hudToyLabel'),
    hudTimeLabel: document.getElementById('hudTimeLabel'),
    hudEaseLabel: document.getElementById('hudEaseLabel'),
    shareDailyConf: document.getElementById('shareDailyConf'),
    shareDailyDeduction: document.getElementById('shareDailyDeduction'),
    singleNextSupply: document.getElementById('singleNextSupply'),
    singlePkRibbon: document.getElementById('singlePkRibbon'),
    singlePkRibbonText: document.getElementById('singlePkRibbonText'),

    weeklyKicker: document.getElementById('weeklyKicker'),
    weeklyMoodTitle: document.getElementById('weeklyMoodTitle'),
    weeklyPowerPill: document.getElementById('weeklyPowerPill'),
    weeklyHeroImg: document.getElementById('weeklyHeroImg'),
    weeklyRankGrade: document.getElementById('weeklyRankGrade'),
    weeklyRankLabel: document.getElementById('weeklyRankLabel'),
    weeklyAttendanceSummary: document.getElementById('weeklyAttendanceSummary'),
    weeklySevenDayTrack: document.getElementById('weeklySevenDayTrack'),
    weeklyScorePills: document.getElementById('weeklyScorePills'),
    weeklyTopCulprit: document.getElementById('weeklyTopCulprit'),
    weeklyTrendVerdict: document.getElementById('weeklyTrendVerdict'),
    weeklyPkRibbon: document.getElementById('weeklyPkRibbon'),
    weeklyPkRibbonText: document.getElementById('weeklyPkRibbonText'),

    postcardMonthLabel: document.getElementById('postcardMonthLabel'),
    monthlyTitleBadge: document.getElementById('monthlyTitleBadge'),
    postcardSignatureImg: document.getElementById('postcardSignatureImg'),
    monthlyRankGrade: document.getElementById('monthlyRankGrade'),
    postcardRankPill: document.getElementById('postcardRankPill'),
    postcardAwardQuote: document.getElementById('postcardAwardQuote'),
    monthlyTopTriggerText: document.getElementById('monthlyTopTriggerText'),
    monthlyBristolBars: document.getElementById('monthlyBristolBars'),
    pcTotalCheckins: document.getElementById('pcTotalCheckins'),
    pcIdealRate: document.getElementById('pcIdealRate'),
    pcBestStreak: document.getElementById('pcBestStreak'),
    monthlyPkRibbon: document.getElementById('monthlyPkRibbon'),
    monthlyPkRibbonText: document.getElementById('monthlyPkRibbonText'),

    sharePkTitle: document.getElementById('sharePkTitle'),
    sharePkOutcomeStamp: document.getElementById('sharePkOutcomeStamp'),
    sharePkMyImg: document.getElementById('sharePkMyImg'),
    sharePkMyScore: document.getElementById('sharePkMyScore'),
    sharePkMyToy: document.getElementById('sharePkMyToy'),
    sharePkRivalImg: document.getElementById('sharePkRivalImg'),
    sharePkRivalName: document.getElementById('sharePkRivalName'),
    sharePkRivalScore: document.getElementById('sharePkRivalScore'),
    sharePkRivalToy: document.getElementById('sharePkRivalToy'),
    sharePkVerdict: document.getElementById('sharePkVerdict'),
    sharePkCodeNote: document.getElementById('sharePkCodeNote'),

    pkRibbonToggleRow: document.getElementById('pkRibbonToggleRow'),
    includePkRibbonToggle: document.getElementById('includePkRibbonToggle'),
    savePostcardImgBtn: document.getElementById('savePostcardImgBtn'),
    copyPostcardTextBtn: document.getElementById('copyPostcardTextBtn'),

    stampFeedback: document.getElementById('stampFeedback'),
    stampFeedbackImg: document.getElementById('stampFeedbackImg'),
    stampFeedbackText: document.getElementById('stampFeedbackText'),
    directorRail: document.getElementById('directorRail')
  };

  // =========================================================================
  // Formatting Utilities
  // =========================================================================
  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function formatMMSS(sec) {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${pad2(mins)}:${pad2(rem)}`;
  }

  function formatDurationCN(sec) {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    if (mins === 0) return `${rem} 秒`;
    if (rem === 0) return `${mins} 分钟`;
    return `${mins} 分 ${pad2(rem)} 秒`;
  }

  function formatLogTimeLabel(isoStr) {
    const d = new Date(isoStr);
    const now = new Date();
    const isToday =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    const timePart = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    if (isToday) return `今日剧报 · ${timePart}`;
    return `${d.getMonth() + 1}月${d.getDate()}日 · ${timePart}`;
  }

  function formatShortDate(isoStr) {
    const d = new Date(isoStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  function formatClinicalDateTime(isoStr) {
    const d = new Date(isoStr);
    return `${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }

  function getToy(type) {
    return BRISTOL_TOYS.find((t) => t.type === type) || BRISTOL_TOYS[3];
  }

  function getColorObj(id) {
    return COLOR_OPTIONS.find((c) => c.id === id) || COLOR_OPTIONS[0];
  }

  function computeCalmStreak() {
    let streak = 0;
    for (const item of state.logs) {
      const col = getColorObj(item.color);
      if (!col.redFlag && item.bristol >= 3 && item.bristol <= 5) {
        streak += 1;
      } else {
        break;
      }
    }
    return Math.max(streak, 1);
  }

  let feedbackTimerId = null;
  function showStampFeedback(text, toyImgSrc = '') {
    el.stampFeedbackText.textContent = text;
    if (toyImgSrc && el.stampFeedbackImg) {
      el.stampFeedbackImg.src = toyImgSrc;
      el.stampFeedbackImg.hidden = false;
    } else if (el.stampFeedbackImg) {
      el.stampFeedbackImg.hidden = true;
    }
    el.stampFeedback.hidden = true;
    void el.stampFeedback.offsetWidth;
    el.stampFeedback.hidden = false;
    clearTimeout(feedbackTimerId);
    feedbackTimerId = setTimeout(() => {
      el.stampFeedback.hidden = true;
    }, toyImgSrc ? 2100 : 1550);
  }

  function syncDirectorRailActive() {
    if (!el.directorRail) return;
    let activeKey = 'home';
    if (activeSheet === 'log') activeKey = 'log';
    else if (activeSheet === 'pk') activeKey = 'pk';
    else if (activeSheet === 'postcard') {
      if (directorActiveHint) {
        activeKey = directorActiveHint;
      } else if (activeShareTab === 'weekly') {
        activeKey = 'settle_weekly';
      } else if (activeShareTab === 'monthly') {
        activeKey = 'settle_monthly';
      } else if (activeShareTab === 'pk') {
        activeKey = 'pk';
      } else {
        const entry = settlementPreviewEntry || state.logs[0];
        const m = getSettlementMoodTheme(entry ? entry.bristol : 4, false).mood;
        activeKey = m === 'desert' ? 'settle_desert' : m === 'storm' ? 'settle_storm' : 'settle_gold';
      }
    } else if (currentMode === 'redflag') {
      activeKey = 'redflag';
    } else if (!el.eightMinToast.hidden) {
      activeKey = 'eightmin';
    }

    el.directorRail.querySelectorAll('.director-jump-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.demoAction === activeKey);
    });
  }

  function renderHomeDetectiveStrip() {
    if (!el.detectiveStrip) return;
    const latest = state.logs[0];
    if (!latest) return;

    const deduction = inferLikelyDiet(latest, state.logs.slice(1));
    if (deduction.redFlagBlocked) {
      el.detectiveStrip.hidden = true;
      return;
    }

    el.detectiveStrip.hidden = false;
    el.detectiveOverrideRow.hidden = true;

    if (latest.detectiveConfirmed) {
      el.detectiveConfBadge.textContent = '已破案入档';
      el.detectiveConfBadge.classList.add('is-confirmed');
      const confirmedTags = latest.triggers && latest.triggers.length
        ? latest.triggers.join(' + ')
        : deduction.shortGuess;
      el.detectiveGuessText.textContent = `实锤线索：${confirmedTags}（已同步背刺榜）`;
      el.detectiveFeedbackBtns.hidden = true;
    } else {
      el.detectiveConfBadge.textContent = `侦探反推 ${deduction.confidence}%`;
      el.detectiveConfBadge.classList.remove('is-confirmed');
      el.detectiveGuessText.textContent = `猜你吃了：${deduction.shortGuess}`;
      el.detectiveFeedbackBtns.hidden = false;
    }
  }

  // =========================================================================
  // Home Theater & Red-Flag Calm Care Rendering
  // =========================================================================
  function renderTopBarAndSkin() {
    const skin =
      CAMOUFLAGE_SKINS.find((s) => s.id === state.settings.camouflage) || CAMOUFLAGE_SKINS[0];

    el.appShell.dataset.camouflage = skin.id;
    el.brandTitle.textContent = skin.name;
    el.brandSubtitle.textContent =
      currentMode === 'redflag' ? '大橘猫猫医生值班' : skin.subtitle;
    el.privacyPillLabel.textContent = skin.pillLabel;
    document.title = `${skin.name} · ${skin.subtitle}`;

    el.soundToggleBtn.setAttribute('aria-pressed', String(state.settings.soundEnabled));
    FeltAudio.setEnabled(state.settings.soundEnabled);
  }

  function renderHomeStage(animatePop = false) {
    const latest = state.logs[0];
    const toy = getToy(latest.bristol);
    const streak = computeCalmStreak();

    el.appShell.dataset.mode = currentMode;

    if (currentMode === 'redflag') {
      el.stageHeroImg.classList.remove('is-visible');
      el.theaterCard.hidden = true;
      el.redFlagCard.hidden = false;
      el.playbillText.textContent = '大橘猫猫医生 · 安心问诊中';
      renderCareTriageView();
    } else {
      setDoctorPose(null);
      el.stageHeroImg.classList.add('is-visible');
      el.redFlagCard.hidden = true;
      el.theaterCard.hidden = false;

      el.playbillText.textContent = `第 ${state.episode} 场 · ${toy.name}`;
      el.latestToyThumb.src = toy.img;
      el.latestToyThumb.alt = toy.name;
      el.latestTimeLabel.textContent = formatLogTimeLabel(latest.timestamp);
      el.latestBristolTag.textContent = `${toy.type}型 · ${toy.name}`;
      el.stageStampBadge.textContent = latest.stamp || toy.stamp;
      el.stageStampBadge.dataset.tone = latest.stampTone || toy.stampTone;
      el.comedyHeadline.textContent = latest.headline;
      el.bulletinStats.textContent = `耗时 ${formatDurationCN(latest.durationSec)} · ${latest.ease} · 连续 ${streak} 日安泰`;
      renderHomeDetectiveStrip();

      if (animatePop) {
        el.theaterCard.classList.remove('is-fresh-pop');
        el.latestToyThumb.classList.remove('is-spring-bounce');
        if (el.playbillBadge) el.playbillBadge.classList.remove('is-fresh-pop');
        void el.theaterCard.offsetWidth;
        el.theaterCard.classList.add('is-fresh-pop');
        el.latestToyThumb.classList.add('is-spring-bounce');
        if (el.playbillBadge) el.playbillBadge.classList.add('is-fresh-pop');
      }
    }

    renderTopBarAndSkin();
    syncDirectorRailActive();
  }

  // =========================================================================
  // Big Orange Cat 3-Step Sequential Triage Questionnaire
  // =========================================================================
  const careTriageState = {
    reason: 'blood',
    step: 0,
    answers: {}
  };

  const CARE_TRIAGE_QUESTIONS = {
    blood: [
      {
        key: 'dye',
        question: '先别慌，大橘猫先排查饮食染色：近 24–48 小时吃过红心火龙果、甜菜根、大量番茄或辣椒吗？',
        options: [
          { label: '吃过红心火龙果 / 甜菜根等', value: 'yes' },
          { label: '完全没吃过', value: 'no' },
          { label: '不太确定', value: 'unsure' }
        ]
      },
      {
        key: 'pattern',
        question: '这次见红具体是什么情况？最近持续多久了？',
        options: [
          { label: '仅厕纸擦拭见鲜红，或轻微刺痛', value: 'mild' },
          { label: '混在大便里，或偏暗红色', value: 'moderate' },
          { label: '已经连续出现 2 天以上', value: 'high' }
        ]
      },
      {
        key: 'systemic',
        question: '最后问一下，最近身体整体感觉怎么样？',
        options: [
          { label: '没有任何不舒服，精神很好', value: 'none' },
          { label: '轻微腹胀、隐痛或没胃口', value: 'mild' },
          { label: '头晕乏力 / 发烧 / 剧烈腹痛 / 近期消瘦', value: 'severe' }
        ]
      }
    ],
    black: [
      {
        key: 'dye',
        question: '先别慌，大橘猫先排查饮食和药物：近 24–48 小时吃过鸭血/猪血、黑芝麻，或铁剂/胃药铋剂吗？',
        options: [
          { label: '吃过动物血 / 铁剂 / 铋剂胃药', value: 'yes' },
          { label: '完全没吃过', value: 'no' },
          { label: '不太确定', value: 'unsure' }
        ]
      },
      {
        key: 'pattern',
        question: '这次黑便的质地和持续时间怎么样？',
        options: [
          { label: '偶发一次，成形和气味和平时一样', value: 'mild' },
          { label: '发亮粘稠像柏油，气味偏腥臭', value: 'high' },
          { label: '已经连续出现 2 天以上', value: 'high' }
        ]
      },
      {
        key: 'systemic',
        question: '最后问一下，最近身体整体感觉怎么样？',
        options: [
          { label: '没有任何不舒服，精神很好', value: 'none' },
          { label: '轻微胃部隐痛、反酸或胀气', value: 'mild' },
          { label: '头晕心慌 / 乏力 / 剧烈胃痛或黑便加重', value: 'severe' }
        ]
      }
    ],
    pale: [
      {
        key: 'dye',
        question: '先别急，大橘猫先排查检查和药物：最近几天做过钡餐检查，或吃过含铝/铋的抗酸胃药吗？',
        options: [
          { label: '做过钡餐 / 吃过抗酸胃药', value: 'yes' },
          { label: '都没有', value: 'no' },
          { label: '不太确定', value: 'unsure' }
        ]
      },
      {
        key: 'pattern',
        question: '除了大便偏白/灰白，最近还有这些变化吗？',
        options: [
          { label: '仅这一次，小便颜色正常', value: 'mild' },
          { label: '小便明显变深黄 / 像浓茶色', value: 'high' },
          { label: '已经连续出现 2 天以上', value: 'high' }
        ]
      },
      {
        key: 'systemic',
        question: '最后问一下，最近身体整体感觉怎么样？',
        options: [
          { label: '没有任何不舒服，精神很好', value: 'none' },
          { label: '右上腹轻微发闷、厌油腻或没胃口', value: 'mild' },
          { label: '皮肤或眼白发黄 / 发烧 / 剧烈腹痛', value: 'severe' }
        ]
      }
    ],
    alarm: [
      {
        key: 'dye',
        question: '大橘猫先了解一下诱因：近 24–48 小时吃过生冷外卖、隔夜食物，或者受凉了吗？',
        options: [
          { label: '吃过生冷 / 重口外卖或受凉', value: 'yes' },
          { label: '饮食规律，没有明显诱因', value: 'no' },
          { label: '不太确定', value: 'unsure' }
        ]
      },
      {
        key: 'pattern',
        question: '这几天排便频率和持续时间怎么样？',
        options: [
          { label: '刚开始，每天 1–2 次偏稀', value: 'mild' },
          { label: '一天跑 4 次以上，水样停不下来', value: 'high' },
          { label: '已经持续 3 天以上还没缓解', value: 'high' }
        ]
      },
      {
        key: 'systemic',
        question: '最后问一下，最近身体整体感觉怎么样？',
        options: [
          { label: '精神还不错，能正常喝水吃饭', value: 'none' },
          { label: '轻微腹痛、乏力或口干', value: 'mild' },
          { label: '高烧 / 明显脱水头晕 / 伴随剧烈腹痛', value: 'severe' }
        ]
      }
    ]
  };

  function evaluateCareTriage(reason, ans) {
    const guide = RED_FLAG_GUIDE[reason] || RED_FLAG_GUIDE.black;
    const isUrgent =
      ans.systemic === 'severe' ||
      (ans.dye !== 'yes' && ans.pattern === 'high') ||
      (reason === 'pale' && ans.pattern === 'high');

    const isLikelyDiet =
      ans.dye === 'yes' && ans.pattern === 'mild' && ans.systemic === 'none';

    if (isLikelyDiet) {
      const dyeMap = {
        blood: '红心火龙果、甜菜根或红色蔬果',
        black: '动物血制品、深色食物或铁剂/铋剂胃药',
        pale: '近期钡餐或抗酸胃药',
        alarm: '生冷外卖或受凉刺激'
      };
      return {
        level: 'safe',
        badge: '大概率饮食影响',
        dept: '建议居家观察 24–48h',
        title: '大概率是暂时性影响，先不用过度紧张',
        explanation: `结合你的回答，这次变化很可能与「${dyeMap[reason] || '近期饮食'}」有关，且目前无明显不适。建议接下来 1–2 天清淡饮食、多喝温水观察；如果停吃后颜色或性状仍未恢复正常，再考虑挂号排查。`,
        safeFirst: true
      };
    }

    if (isUrgent) {
      return {
        level: 'urgent',
        badge: '重点提醒 · 建议尽快面诊评估',
        dept: guide.dept.replace('建议挂号：', '可优先考虑：'),
        title: '综合你的情况，建议尽快去医院让医生看看',
        explanation: `你的回答中出现了持续异常或伴随明显身体不适（且并非单纯饮食染色）。大橘猫建议不要硬扛，尽早携带近 30 天记录前往医院做针对性检查，早确认早安心。`,
        safeFirst: false
      };
    }

    const obsMap = {
      blood: '排除饮食染色后，偶发擦拭见鲜红较常见于局部痔疮或肛裂；若混在便中或反复出现，建议预约肛肠科或消化内科做一次基础排查。',
      black: '未明确食用动物血或铁剂/铋剂的情况下出现黑便，建议留意接下来 1–2 次排便颜色；若仍偏黑或伴胃部不适，建议预约消化内科检查。',
      pale: '非药物引起的灰白便值得多留意 1–2 天，同时注意小便颜色与食欲；若持续发白，建议预约消化内科或肝胆科排查。',
      alarm: '肠道目前仍在敏感期，建议少量多次补充温水或口服补液盐、暂避生冷油腻；若超过 48–72 小时未缓解，建议前往消化内科看看。'
    };
    return {
      level: 'observe',
      badge: '建议观察并酌情预约门诊',
      dept: guide.dept.replace('建议挂号：', '可参考挂号：'),
      title: '结合你的情况，建议留意变化并考虑门诊排查',
      explanation: obsMap[reason] || guide.explanation,
      safeFirst: false
    };
  }

  function setDoctorPose(pose) {
    const layers = document.querySelectorAll('.stage-image-doctor[data-doctor-pose]');
    layers.forEach((img) => {
      img.classList.toggle('is-visible', Boolean(pose) && img.dataset.doctorPose === pose);
    });
  }

  function renderCareTriageView() {
    const triageView = document.getElementById('careTriageView');
    const resultView = document.getElementById('careResultView');
    const stepBadge = document.getElementById('careStepBadge');
    const qText = document.getElementById('careQuestionText');
    const optList = document.getElementById('careOptionsList');
    const resultBadge = document.getElementById('careResultBadge');
    const resultTitle = document.getElementById('careResultTitle');
    const actionsRow = document.getElementById('careActionsRow');
    if (!triageView || !resultView) return;

    const questions = CARE_TRIAGE_QUESTIONS[careTriageState.reason] || CARE_TRIAGE_QUESTIONS.blood;
    const dots = document.querySelectorAll('[data-care-dot]');

    if (careTriageState.step < questions.length) {
      triageView.hidden = false;
      resultView.hidden = true;
      const stepPoseMap = ['diet', 'default', 'checkup'];
      setDoctorPose(stepPoseMap[careTriageState.step] || 'default');
      const cur = questions[careTriageState.step];
      if (stepBadge) stepBadge.textContent = `大橘猫小问诊 · ${careTriageState.step + 1}/${questions.length}`;
      if (qText) qText.textContent = cur.question;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === careTriageState.step);
        dot.classList.toggle('is-done', idx < careTriageState.step);
      });

      if (optList) {
        optList.innerHTML = '';
        cur.options.forEach((opt) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'care-option-btn';
          btn.innerHTML = `<span>${opt.label}</span><span class="care-option-arrow" aria-hidden="true">›</span>`;
          btn.addEventListener('click', () => {
            FeltAudio.softTap();
            careTriageState.answers[cur.key] = opt.value;
            careTriageState.step += 1;
            renderCareTriageView();
          });
          optList.appendChild(btn);
        });
      }
      return;
    }

    // Completed all 3 steps -> render personalized conclusion + matching doctor pose
    triageView.hidden = true;
    resultView.hidden = false;
    const verdict = evaluateCareTriage(careTriageState.reason, careTriageState.answers);
    setDoctorPose(verdict.level === 'safe' ? 'relieved' : 'earnest');
    if (resultBadge) {
      resultBadge.textContent = verdict.badge;
      resultBadge.dataset.level = verdict.level;
    }
    if (el.careDepartmentBadge) el.careDepartmentBadge.textContent = verdict.dept;
    if (resultTitle) resultTitle.textContent = verdict.title;
    if (el.careExplanation) el.careExplanation.textContent = verdict.explanation;
    if (actionsRow) actionsRow.classList.toggle('is-safe-first', Boolean(verdict.safeFirst));
    if (el.careExitBtn && el.careOpenReportBtn) {
      if (verdict.safeFirst) {
        el.careExitBtn.textContent = '放心了，回剧场';
        el.careOpenReportBtn.textContent = '导出 30 天记录';
      } else {
        el.careOpenReportBtn.textContent = '生成 30 天病历单';
        el.careExitBtn.textContent = '回到剧场';
      }
    }
  }

  function startCareTriage(reason) {
    careTriageState.reason = CARE_TRIAGE_QUESTIONS[reason] ? reason : 'blood';
    careTriageState.step = 0;
    careTriageState.answers = {};
  }

  function enterRedFlagMode(reason = 'blood', silent = false) {
    activeRedFlagReason = RED_FLAG_GUIDE[reason] ? reason : 'blood';
    startCareTriage(activeRedFlagReason);
    currentMode = 'redflag';
    closeAllSheets();
    hideEightMinToast();
    renderHomeStage(false);
    if (!silent) FeltAudio.redFlagChime();
  }

  function exitRedFlagMode() {
    currentMode = 'theater';
    renderHomeStage(true);
    FeltAudio.softTap();
  }

  // =========================================================================
  // Live Squat Timer & 8-Minute Hemorrhoid-Guard Toast
  // =========================================================================
  function updateTimerUI() {
    const formatted = formatMMSS(timer.seconds);
    el.timerDisplay.textContent = formatted;
    el.timerPillBtn.classList.toggle('is-running', timer.running);
    el.timerPillBtn.classList.toggle('is-overtime', timer.seconds >= 480);

    const bigEl = document.getElementById('sessionTimerBig');
    const hintEl = document.getElementById('sessionTimerHint');
    if (bigEl) {
      bigEl.textContent = formatted;
      bigEl.classList.toggle('is-overtime', timer.seconds >= 480);
    }
    if (hintEl) {
      if (timer.seconds >= 480) {
        hintEl.textContent = '已满 8 分钟护痔防线，建议准备收工啦';
      } else if (timer.seconds >= 180) {
        hintEl.textContent = '节奏正好，别刷手机太久哦';
      } else {
        hintEl.textContent = '8 分钟内最护痔 · 放轻松慢慢来';
      }
    }
  }

  function showEightMinToast(playAudio = true) {
    if (currentMode === 'redflag') return;
    el.eightMinToast.hidden = false;
    if (playAudio) FeltAudio.alertToast();
    syncDirectorRailActive();
  }

  function hideEightMinToast() {
    el.eightMinToast.hidden = true;
    syncDirectorRailActive();
  }

  function toggleSquatTimer() {
    FeltAudio.softTap();
    if (timer.running) {
      timer.running = false;
      clearInterval(timer.intervalId);
      timer.intervalId = null;
      if (timer.seconds >= 15) {
        draft.durationSec = timer.seconds;
      }
      updateTimerUI();
      showStampFeedback(`已暂停计时 · ${formatMMSS(timer.seconds)}`);
      return;
    }

    timer.running = true;
    updateTimerUI();
    timer.intervalId = setInterval(() => {
      timer.seconds += 1;
      updateTimerUI();
      if (timer.seconds >= 480 && !timer.eightMinTriggered) {
        timer.eightMinTriggered = true;
        showEightMinToast(true);
      }
    }, 1000);
  }

  function resetSquatTimer() {
    timer.running = false;
    timer.seconds = 0;
    timer.eightMinTriggered = false;
    clearInterval(timer.intervalId);
    timer.intervalId = null;
    updateTimerUI();
    hideEightMinToast();
  }

  function triggerEightMinAlert() {
    closeAllSheets();
    if (currentMode === 'redflag') {
      currentMode = 'theater';
      renderHomeStage(false);
    }
    timer.seconds = 482; // 08:02
    timer.eightMinTriggered = true;
    draft.durationSec = 482;
    updateTimerUI();
    showEightMinToast(true);
  }

  // =========================================================================
  // Sheet Management
  // =========================================================================
  function closeAllSheets() {
    activeSheet = null;
    el.sheetScrim.hidden = true;
    el.logDrawer.hidden = true;
    el.insightsSheet.hidden = true;
    el.doctorSheet.hidden = true;
    el.privacySheet.hidden = true;
    if (el.pkSheet) el.pkSheet.hidden = true;
    if (el.postcardSheet) el.postcardSheet.hidden = true;
    const toiletSheet = document.getElementById('toiletSheet');
    if (toiletSheet) toiletSheet.hidden = true;
    syncDirectorRailActive();
  }

  function openSheet(name) {
    closeAllSheets();
    hideEightMinToast();
    activeSheet = name;
    el.sheetScrim.hidden = false;
    if (name === 'log') el.logDrawer.hidden = false;
    if (name === 'insights') el.insightsSheet.hidden = false;
    if (name === 'doctor') el.doctorSheet.hidden = false;
    if (name === 'privacy') el.privacySheet.hidden = false;
    if (name === 'pk' && el.pkSheet) el.pkSheet.hidden = false;
    if (name === 'postcard' && el.postcardSheet) el.postcardSheet.hidden = false;
    const toiletSheet = document.getElementById('toiletSheet');
    if (name === 'toilet' && toiletSheet) toiletSheet.hidden = false;
    syncDirectorRailActive();
  }

  // =========================================================================
  // Sheet 1: 5-Second Single-Hand Logging Drawer
  // =========================================================================
  function renderDraftDetective() {
    if (!el.draftDetectiveBox) return;
    const pred = inferLikelyDiet(
      {
        bristol: draft.bristol,
        color: draft.color,
        durationSec: draft.durationSec,
        ease: draft.ease,
        triggers: draft.triggers,
        timestamp: new Date().toISOString()
      },
      state.logs
    );

    if (pred.redFlagBlocked) {
      el.draftDetectiveBox.hidden = true;
      return;
    }

    el.draftDetectiveBox.hidden = false;
    el.draftDetectiveConf.textContent = `策略预判 ${pred.confidence}%`;
    el.draftDetectiveText.textContent = pred.fullReason;
    el.adoptDetectiveTagsBtn.hidden = pred.suggestedTags.length === 0;
  }

  function selectBristolType(nextType, shouldScroll = true) {
    const clamped = Math.max(1, Math.min(7, nextType));
    draft.bristol = clamped;
    FeltAudio.toyBounce();
    renderBristolRail(shouldScroll, true);
    renderBristolDotNav();
    renderSelectedBristolCaption();
    renderDraftDetective();
    renderPublishButtonLabel();
  }

  function renderBristolDotNav() {
    if (!el.bristolDotNav) return;
    el.bristolDotNav.innerHTML = '';
    BRISTOL_TOYS.forEach((toy) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'bristol-dot-btn';
      if (draft.bristol === toy.type) dot.classList.add('is-active');
      dot.textContent = draft.bristol === toy.type ? `${toy.type}型` : String(toy.type);
      dot.title = `${toy.type}型 · ${toy.name}`;
      dot.addEventListener('click', () => {
        selectBristolType(toy.type, true);
      });
      el.bristolDotNav.appendChild(dot);
    });
  }

  function renderBristolRail(scrollToSelected = false, bounceSelected = false) {
    el.bristolRail.innerHTML = '';

    BRISTOL_TOYS.forEach((toy) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bristol-card';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(draft.bristol === toy.type));
      btn.dataset.bristol = String(toy.type);

      if (draft.bristol === toy.type) {
        btn.classList.add('is-selected');
        if (bounceSelected) btn.classList.add('is-bouncing');
      }

      btn.innerHTML = `
        <div class="bristol-card-img-wrap">
          <img class="bristol-card-img" src="${toy.img}" alt="${toy.type}型 ${toy.name}" />
        </div>
        <span class="bristol-card-num">${toy.type}型</span>
        <span class="bristol-card-name">${toy.shortName}</span>
      `;

      btn.addEventListener('click', () => {
        selectBristolType(toy.type, true);
      });

      el.bristolRail.appendChild(btn);
    });

    renderBristolDotNav();

    if (scrollToSelected) {
      const activeBtn = el.bristolRail.querySelector('.bristol-card.is-selected');
      if (activeBtn) {
        requestAnimationFrame(() => {
          activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
      }
    }
  }

  function renderSelectedBristolCaption() {
    const toy = getToy(draft.bristol);
    el.selectedBristolName.textContent = `${toy.type}型 · ${toy.name}`;
    el.selectedBristolStatus.textContent = toy.statusText;
    el.selectedBristolStatus.className = `status-tag ${toy.statusClass}`;
    el.selectedBristolAdvice.textContent = toy.advice;
  }

  function renderColorRadar() {
    el.colorGrid.innerHTML = '';
    COLOR_OPTIONS.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'color-swatch-btn';
      if (opt.redFlag) btn.classList.add('is-redflag');
      if (draft.color === opt.id) btn.classList.add('is-selected');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(draft.color === opt.id));

      btn.innerHTML = `
        <span class="color-swatch-dot" style="background:${opt.swatch};"></span>
        <span class="color-swatch-copy">
          <strong>${opt.name}</strong>
          <small>${opt.redFlag ? '红灯警报' : opt.sub}</small>
        </span>
      `;

      btn.addEventListener('click', () => {
        draft.color = opt.id;
        FeltAudio.softTap();
        renderColorRadar();
        renderDraftDetective();
        renderPublishButtonLabel();
      });

      el.colorGrid.appendChild(btn);
    });

    const selectedColor = getColorObj(draft.color);
    const willBeConsecutive7 =
      draft.bristol === 7 && state.logs[0] && state.logs[0].bristol === 7;
    el.colorRedFlagHint.hidden = !(selectedColor.redFlag || willBeConsecutive7);
  }

  function renderTriggerChips() {
    el.triggerChips.innerHTML = '';
    TRIGGER_TAGS.forEach((tag) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'trigger-chip';
      const active = draft.triggers.includes(tag);
      if (active) btn.classList.add('is-active');
      btn.textContent = tag;
      btn.setAttribute('aria-pressed', String(active));

      btn.addEventListener('click', () => {
        FeltAudio.softTap();
        if (draft.triggers.includes(tag)) {
          draft.triggers = draft.triggers.filter((t) => t !== tag);
        } else {
          draft.triggers = [...draft.triggers, tag];
        }
        renderTriggerChips();
      });

      el.triggerChips.appendChild(btn);
    });
  }

  function renderEaseGroup() {
    el.easeGroup.innerHTML = '';
    EASE_OPTIONS.forEach((easeName) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ease-pill';
      if (draft.ease === easeName) btn.classList.add('is-active');
      btn.textContent = easeName;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(draft.ease === easeName));

      btn.addEventListener('click', () => {
        draft.ease = easeName;
        FeltAudio.softTap();
        renderEaseGroup();
        renderDraftDetective();
      });

      el.easeGroup.appendChild(btn);
    });
  }

  function renderPublishButtonLabel() {
    const selectedColor = getColorObj(draft.color);
    const willBeConsecutive7 =
      draft.bristol === 7 && state.logs[0] && state.logs[0].bristol === 7;
    el.colorRedFlagHint.hidden = !(selectedColor.redFlag || willBeConsecutive7);
    el.publishLogBtn.textContent =
      selectedColor.redFlag || willBeConsecutive7 ? '完成录入 · 进入大橘猫问诊' : '完成录入';
  }

  function openLogDrawer(preselectBristol, explicitDurationSec) {
    if (typeof preselectBristol === 'number' && preselectBristol >= 1 && preselectBristol <= 7) {
      draft.bristol = preselectBristol;
    } else {
      draft.bristol = 4;
    }
    draft.color = 'golden';
    draft.triggers = [];
    draft.ease = '顺畅';
    if (typeof explicitDurationSec === 'number' && explicitDurationSec > 0) {
      draft.durationSec = explicitDurationSec;
    } else if (timer.seconds >= 1) {
      draft.durationSec = timer.seconds;
    } else {
      draft.durationSec = DURATION_PRESETS[draft.durationPresetIdx];
    }

    el.logDurationLabel.textContent = formatDurationCN(draft.durationSec);
    renderBristolRail(true, false);
    renderSelectedBristolCaption();
    renderColorRadar();
    renderTriggerChips();
    renderEaseGroup();
    renderLogToiletChips();
    renderDraftDetective();
    renderPublishButtonLabel();
    openSheet('log');
  }

  function publishCurrentDraft() {
    const prevLog = state.logs[0];
    const selectedColor = getColorObj(draft.color);
    const isConsecutive7 = draft.bristol === 7 && prevLog && prevLog.bristol === 7;

    const comedy = generateComedyBulletin({
      bristol: draft.bristol,
      triggers: draft.triggers,
      durationSec: draft.durationSec,
      ease: draft.ease,
      color: draft.color
    });

    const activeSpot = getSelectedToiletSpot();
    const newEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      bristol: draft.bristol,
      color: draft.color,
      triggers: [...draft.triggers],
      durationSec: draft.durationSec,
      ease: draft.ease,
      toiletId: activeSpot ? activeSpot.id : null,
      toiletName: activeSpot ? activeSpot.name : '',
      headline: comedy.headline,
      stamp: comedy.stamp,
      stampTone: comedy.stampTone
    };

    if (activeSpot) {
      activeSpot.visits = (activeSpot.visits || 0) + 1;
    }

    state.logs.unshift(newEntry);
    state.episode += 1;
    saveState();
    resetPoopSessionUI();

    if (selectedColor.redFlag) {
      enterRedFlagMode(selectedColor.id, false);
      return;
    }
    if (isConsecutive7) {
      enterRedFlagMode('alarm', false);
      return;
    }

    currentMode = 'theater';
    settlementPreviewEntry = null;
    directorActiveHint = '';
    closeAllSheets();
    renderHomeStage(true);

    // Play persona-matched Stop-Motion Felt Cutscene with sound -> freeze into Today's Archive!
    playFeltArchiveCutscene(newEntry, () => {
      openSettlement('single', { autoLaunch: false });
    });
  }

  // =========================================================================
  // Sheet 2: 14-Day 肠道背刺榜 Insights + Clickable History Archive
  // =========================================================================
  function selectInsightEntry(entryId) {
    const entry = state.logs.find((l) => l.id === entryId) || state.logs[0];
    if (!entry) return;

    el.trendChart.querySelectorAll('.trend-dot-btn').forEach((d) => {
      d.classList.toggle('is-active', d.dataset.entryId === entry.id);
    });
    if (el.historyList) {
      el.historyList.querySelectorAll('.history-row').forEach((r) => {
        const isSel = r.dataset.entryId === entry.id;
        r.classList.toggle('is-selected', isSel);
        r.setAttribute('aria-selected', String(isSel));
      });
    }
    updateTrendDetail(entry);
  }

  function renderInsightsSheet() {
    const recent14 = state.logs.slice(0, 14);
    const count = recent14.length;
    const idealCount = recent14.filter((l) => l.bristol === 3 || l.bristol === 4).length;
    const idealRate = count ? Math.round((idealCount / count) * 100) : 0;
    const avgSec = count
      ? Math.round(recent14.reduce((sum, l) => sum + l.durationSec, 0) / count)
      : 240;

    el.insightsKpiStrip.innerHTML = `
      <div class="kpi-tile">
        <strong>${count} 次</strong>
        <span>近 14 场记录</span>
      </div>
      <div class="kpi-tile">
        <strong>${idealRate}%</strong>
        <span>3–4型黄金达标</span>
      </div>
      <div class="kpi-tile">
        <strong>${formatDurationCN(avgSec)}</strong>
        <span>平均蹲坑耗时</span>
      </div>
    `;

    // Render 14-day Wool Dot Trend Chart (oldest -> newest left-to-right)
    const chronological = [...recent14].reverse();
    el.trendChart.innerHTML = `
      <div class="trend-y-axis" aria-hidden="true">
        <span>7型</span>
        <span>4型</span>
        <span>1型</span>
      </div>
    `;

    chronological.forEach((entry, idx) => {
      const col = document.createElement('div');
      col.className = 'trend-col';

      const toy = getToy(entry.bristol);
      const colorObj = getColorObj(entry.color);
      // Map Bristol 1..7 to bottom % (8%..92%)
      const bottomPct = 8 + ((entry.bristol - 1) / 6) * 84;
      let dotClass = 'trend-dot-good';
      if (colorObj.redFlag) dotClass = 'trend-dot-redflag';
      else if (entry.bristol <= 2) dotClass = 'trend-dot-dry';
      else if (entry.bristol >= 5) dotClass = 'trend-dot-soft';

      const dotBtn = document.createElement('button');
      dotBtn.type = 'button';
      dotBtn.className = `trend-dot-btn ${dotClass}`;
      dotBtn.dataset.entryId = entry.id;
      dotBtn.style.bottom = `${bottomPct}%`;
      dotBtn.title = `${formatShortDate(entry.timestamp)} · ${toy.type}型 ${toy.name}`;

      dotBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        selectInsightEntry(entry.id);
      });

      const stem = document.createElement('span');
      stem.className = 'trend-stem';

      const dayLabel = document.createElement('span');
      dayLabel.className = 'trend-day-label';
      dayLabel.textContent =
        idx === chronological.length - 1 ? '最新' : idx % 3 === 0 ? formatShortDate(entry.timestamp) : '';

      col.appendChild(stem);
      col.appendChild(dotBtn);
      col.appendChild(dayLabel);
      el.trendChart.appendChild(col);
    });

    // Render Clickable 14-Day History List (newest -> oldest)
    if (el.historyList) {
      el.historyList.innerHTML = '';
      recent14.forEach((entry) => {
        const toy = getToy(entry.bristol);
        const triggers = entry.triggers.length ? entry.triggers.join(' · ') : '日常稳态';
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'history-row';
        row.setAttribute('role', 'option');
        row.dataset.entryId = entry.id;
        row.innerHTML = `
          <img class="history-row-thumb" src="${toy.img}" alt="${toy.name}" />
          <div class="history-row-main">
            <div class="history-row-top">
              <strong>${toy.type}型 · ${toy.name}</strong>
              <span class="history-row-time">${formatClinicalDateTime(entry.timestamp)}</span>
            </div>
            <div class="history-row-sub">${formatDurationCN(entry.durationSec)} · ${entry.ease} · ${triggers}</div>
          </div>
        `;
        row.addEventListener('click', () => {
          FeltAudio.toyBounce();
          selectInsightEntry(entry.id);
        });
        el.historyList.appendChild(row);
      });
    }

    if (recent14.length > 0) {
      selectInsightEntry(recent14[0].id);
    }

    // Dynamic Trigger Backstab Correlation Leaderboard (Zero Food Metaphors for Stool!)
    const coffeeLoose = recent14.filter((l) => l.triggers.includes('冰美式') && l.bristol >= 5).length;
    const spicyLoose = recent14.filter((l) => l.triggers.includes('重辣火锅') && l.bristol >= 5).length;
    const dryHard = recent14.filter((l) => l.triggers.includes('喝水少') && l.bristol <= 3).length;

    const correlations = [
      {
        title: '冰美式 + 熬夜',
        pct: Math.min(96, 82 + coffeeLoose * 3),
        desc: '82% 概率触发 6 型炸毛摊软团（建议午后改喝温水）',
        positive: false
      },
      {
        title: '重辣火锅',
        pct: Math.min(94, 74 + spicyLoose * 4),
        desc: '次日高频召唤 6–7 型摊软团 / 小水洼',
        positive: false
      },
      {
        title: '喝水少 + 久坐',
        pct: Math.min(92, 68 + dryHard * 4),
        desc: '71% 概率召唤 1–2 型硬球团 / 疙瘩憋劲团',
        positive: false
      },
      {
        title: '每日温水达标 + 规律作息',
        pct: 91,
        desc: '91% 稳定召唤 4 型丝滑金冠团',
        positive: true
      }
    ];

    el.correlationList.innerHTML = correlations
      .map(
        (item) => `
        <div class="corr-item ${item.positive ? 'is-positive' : ''}">
          <div class="corr-row-top">
            <strong>${item.title}</strong>
            <span>${item.pct}% 关联</span>
          </div>
          <div class="corr-track">
            <div class="corr-fill" style="width:${item.pct}%;"></div>
          </div>
          <p class="corr-desc">${item.desc}</p>
        </div>
      `
      )
      .join('');

    // Collapsible Paid-Poop Easter Egg
    const totalSec30 = state.logs.reduce((acc, l) => acc + l.durationSec, 0);
    const totalMins = Math.max(68, Math.round(totalSec30 / 60) + 46);
    const estYuan = Math.round(totalMins * 3.0);
    el.eggCurrencyValue.textContent = `¥ ${estYuan}`;
    el.eggSubNote.textContent = `按本地估算均薪与近 30 日累计 ${Math.floor(totalMins / 60)} 小时 ${totalMins % 60} 分有效时长折算。提醒：单次超过 8 分钟会亏掉肛周静脉健康哦！`;
  }

  function updateTrendDetail(entry) {
    const toy = getToy(entry.bristol);
    const triggerText = entry.triggers.length ? entry.triggers.join(' · ') : '无明显诱因';
    el.trendSelectedDetail.innerHTML = `
      <img class="trend-detail-thumb" src="${toy.img}" alt="${toy.name}" />
      <div class="trend-detail-body">
        <div class="trend-detail-meta">
          <strong>${toy.type}型 · ${toy.name}</strong>
          <span>${formatClinicalDateTime(entry.timestamp)}</span>
        </div>
        <div class="trend-detail-sub">耗时 ${formatDurationCN(entry.durationSec)} · ${entry.ease} · 诱因：${triggerText}</div>
        <p class="trend-detail-quote">${entry.headline}</p>
      </div>
    `;
  }

  // =========================================================================
  // Sheet 3: Clean Clinical 30-Day Doctor Report (Zero Jokes!)
  // =========================================================================
  function renderDoctorReport() {
    const logs = state.logs.slice(0, 30);
    const total = logs.length;
    const avgSec = total ? Math.round(logs.reduce((s, l) => s + l.durationSec, 0) / total) : 0;

    // Dominant Bristol type
    const counts = {};
    logs.forEach((l) => {
      counts[l.bristol] = (counts[l.bristol] || 0) + 1;
    });
    let topType = 4;
    let topCount = 0;
    Object.keys(counts).forEach((k) => {
      if (counts[k] > topCount) {
        topCount = counts[k];
        topType = Number(k);
      }
    });
    const topPct = total ? Math.round((topCount / total) * 100) : 0;

    const redFlagColorLogs = logs.filter((l) => getColorObj(l.color).redFlag);
    const wateryCount = logs.filter((l) => l.bristol === 7).length;
    const hardCount = logs.filter((l) => l.bristol <= 2).length;

    const oldestDate = logs.length ? formatShortDate(logs[logs.length - 1].timestamp) : '--';
    const newestDate = logs.length ? formatShortDate(logs[0].timestamp) : '--';
    el.doctorDateRange.textContent = `统计周期：${oldestDate} 至 ${newestDate} · 共 ${total} 条本地记录`;

    if (redFlagColorLogs.length > 0 || wateryCount >= 2) {
      const notes = [];
      if (redFlagColorLogs.length > 0) {
        const latestRF = redFlagColorLogs[0];
        notes.push(
          `发现 ${redFlagColorLogs.length} 次异常颜色记录（最近一次：${formatClinicalDateTime(latestRF.timestamp)}，${getColorObj(latestRF.color).name}）`
        );
      }
      if (wateryCount >= 2) {
        notes.push(`近30日出现 ${wateryCount} 次 Bristol 7型水样便`);
      }
      el.clinicalAlertBanner.hidden = false;
      el.clinicalAlertBanner.textContent = `重点关注项：${notes.join('；')}。建议就诊时优先向消化内科或肛肠科医生出示下表。`;
    } else {
      el.clinicalAlertBanner.hidden = true;
    }

    el.doctorMetricsGrid.innerHTML = `
      <div class="clinical-metric-box">
        <span>排便频率估计</span>
        <strong>${(total / 14).toFixed(1)} 次/日 · 较规律</strong>
      </div>
      <div class="clinical-metric-box">
        <span>主要 Bristol 分型</span>
        <strong>${topType}型为主（占 ${topPct}%）</strong>
      </div>
      <div class="clinical-metric-box">
        <span>异常颜色警示</span>
        <strong>${redFlagColorLogs.length > 0 ? `检出 ${redFlagColorLogs.length} 次需关注` : '无黑便 / 血便 / 陶土便'}</strong>
      </div>
      <div class="clinical-metric-box">
        <span>均值耗时 / 偏离次数</span>
        <strong>${(avgSec / 60).toFixed(1)} 分钟 · 干结 ${hardCount} / 水样 ${wateryCount}</strong>
      </div>
    `;

    el.doctorTableBody.innerHTML = logs
      .map((entry) => {
        const toy = getToy(entry.bristol);
        const col = getColorObj(entry.color);
        const isAlert = col.redFlag || entry.bristol === 7;
        const triggers = entry.triggers.length ? entry.triggers.join('、') : '—';
        return `
          <tr class="${isAlert ? 'is-redflag-row' : ''}">
            <td>${formatClinicalDateTime(entry.timestamp)}</td>
            <td>${toy.clinicalLabel}</td>
            <td>${col.name}${col.redFlag ? '（异常）' : ''}</td>
            <td>${formatDurationCN(entry.durationSec)} / ${entry.ease}</td>
            <td>${triggers}</td>
          </tr>
        `;
      })
      .join('');
  }

  // =========================================================================
  // Sheet 4: Privacy Vault & 1-Tap Home Screen Camouflage
  // =========================================================================
  function renderPrivacySheet() {
    el.faceIdToggleBtn.setAttribute('aria-checked', String(state.settings.faceIdEnabled));

    const activeSkin =
      CAMOUFLAGE_SKINS.find((s) => s.id === state.settings.camouflage) || CAMOUFLAGE_SKINS[0];

    el.camouflagePreviewIcon.style.background = activeSkin.bg;
    el.camouflagePreviewIcon.innerHTML = activeSkin.svg;
    el.camouflagePreviewName.textContent = activeSkin.name;
    el.camouflagePreviewDesc.textContent = activeSkin.desc;

    el.camouflageGrid.innerHTML = '';
    CAMOUFLAGE_SKINS.forEach((skin) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'camo-option-btn';
      if (skin.id === state.settings.camouflage) btn.classList.add('is-active');

      btn.innerHTML = `
        <span class="camo-mini-icon" style="background:${skin.bg};">${skin.svg}</span>
        <span>
          <strong>${skin.name}</strong>
          <small>${skin.subtitle}</small>
        </span>
      `;

      btn.addEventListener('click', () => {
        state.settings.camouflage = skin.id;
        saveState();
        FeltAudio.toyBounce();
        renderTopBarAndSkin();
        renderPrivacySheet();
        showStampFeedback(`已切换桌面伪装：${skin.name}`);
      });

      el.camouflageGrid.appendChild(btn);
    });
  }

  // =========================================================================
  // Gentle 2.5D Pointer Parallax on Handcrafted Wool Stage
  // =========================================================================
  function bindStageParallax() {
    el.appShell.addEventListener('pointermove', (evt) => {
      if (activeSheet) return;
      const rect = el.appShell.getBoundingClientRect();
      const nx = (evt.clientX - rect.left) / rect.width - 0.5;
      const ny = (evt.clientY - rect.top) / rect.height - 0.5;
      const px = (-nx * 10).toFixed(2);
      const py = (-ny * 8).toFixed(2);
      el.stageHeroImg.style.setProperty('--parallax-x', `${px}px`);
      el.stageHeroImg.style.setProperty('--parallax-y', `${py}px`);
      el.stageDoctorImg.style.setProperty('--parallax-x', `${px}px`);
      el.stageDoctorImg.style.setProperty('--parallax-y', `${py}px`);
    });

    el.appShell.addEventListener('pointerleave', () => {
      el.stageHeroImg.style.setProperty('--parallax-x', '0px');
      el.stageHeroImg.style.setProperty('--parallax-y', '0px');
      el.stageDoctorImg.style.setProperty('--parallax-x', '0px');
      el.stageDoctorImg.style.setProperty('--parallax-y', '0px');
    });
  }

  // =========================================================================
  // Sheet 5: Friend Wool-Felt Arena PK (`openPkSheet`)
  // =========================================================================
  function computeMyHealthScore() {
    const recent = state.logs.slice(0, 14);
    const total = recent.length || 1;
    const idealCount = recent.filter((l) => l.bristol === 3 || l.bristol === 4).length;
    const idealScore = Math.min(40, Math.round((idealCount / total) * 40));

    const avgSec = recent.reduce((s, l) => s + l.durationSec, 0) / total;
    const speedScore =
      avgSec <= 300
        ? 25
        : Math.max(8, Math.round(25 - ((avgSec - 300) / 300) * 17));

    const streak = computeCalmStreak();
    const streakScore = Math.min(20, streak * 3);

    const survivedAssaults = recent.filter(
      (l) =>
        (l.bristol === 3 || l.bristol === 4) &&
        (l.triggers.includes('重辣火锅') || l.triggers.includes('冰美式') || l.triggers.includes('熬夜'))
    ).length;
    const resilienceScore = Math.min(15, 10 + survivedAssaults * 2);

    const totalScore = Math.min(100, idealScore + speedScore + streakScore + resilienceScore);
    return {
      total: totalScore,
      breakdown: {
        ideal: idealScore,
        speed: speedScore,
        streak: streakScore,
        resilience: resilienceScore
      }
    };
  }

  function getActiveRival() {
    return PK_RIVALS.find((r) => r.id === activeRivalId) || PK_RIVALS[0];
  }

  function computePkMatchSummary() {
    const myLog = state.logs[0];
    const myToy = getToy(myLog ? myLog.bristol : 4);
    const myScoreObj = computeMyHealthScore();
    const rival = getActiveRival();
    const rivalToy = getToy(rival.bristol);

    let verdict = '';
    let outcomeStamp = '势均力敌';
    if (myScoreObj.total > rival.score + 12) {
      outcomeStamp = '本轮绝杀';
      verdict = `「本轮绝杀！你的${myToy.type}型${myToy.name}丝滑碾压${rival.shortName}${rival.triggerStory}召唤的${rivalToy.type}型${rivalToy.shortName}！」`;
    } else if (myScoreObj.total > rival.score) {
      outcomeStamp = '小幅胜出';
      verdict = `「惊险取胜！你的${myToy.name}以 ${myScoreObj.total - rival.score} 分优势力压${rival.shortName}的${rivalToy.shortName}！」`;
    } else if (myScoreObj.total === rival.score) {
      outcomeStamp = '握手言和';
      verdict = `「双双打平！你和${rival.shortName}的毛毡团子旗鼓相当，各喝一杯温水再战！」`;
    } else {
      outcomeStamp = '惜败一筹';
      verdict = `「${rival.shortName}靠${rival.triggerStory}暂居上风，快把温水续上，明天用四号金冠团翻盘！」`;
    }

    return { myToy, myScoreObj, rival, rivalToy, verdict, outcomeStamp };
  }

  function renderPkSheet() {
    if (!el.pkSheet) return;
    const pk = computePkMatchSummary();

    el.pkRivalTabs.innerHTML = '';
    PK_RIVALS.forEach((r) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pk-rival-tab';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(r.id === activeRivalId));
      if (r.id === activeRivalId) btn.classList.add('is-active');
      btn.innerHTML = `<strong>${r.shortName}</strong><small>${r.role} · ${r.score}分</small>`;
      btn.addEventListener('click', () => {
        activeRivalId = r.id;
        FeltAudio.toyBounce();
        renderPkSheet();
      });
      el.pkRivalTabs.appendChild(btn);
    });

    el.pkInviteCodePill.textContent = `口令：${pkInviteCode}`;
    el.pkMyImg.src = pk.myToy.img;
    el.pkMyToyName.textContent = `${pk.myToy.type}型 ${pk.myToy.name}`;
    el.pkMyScore.textContent = `${pk.myScoreObj.total} 分`;

    el.pkRivalImg.src = pk.rivalToy.img;
    el.pkRivalName.textContent = pk.rival.shortName;
    el.pkRivalToyName.textContent = `${pk.rivalToy.type}型 ${pk.rivalToy.name}`;
    el.pkRivalScore.textContent = `${pk.rival.score} 分`;
    el.pkVerdictBanner.textContent = pk.verdict;
    el.pkBanterCounter.textContent = `本局互动 ${pkBanterCount} 次`;

    const dims = [
      { label: '黄金出货率', max: 40, mine: pk.myScoreObj.breakdown.ideal, rival: pk.rival.breakdown.ideal },
      { label: '极速不伤痔', max: 25, mine: pk.myScoreObj.breakdown.speed, rival: pk.rival.breakdown.speed },
      { label: '规律连胜', max: 20, mine: pk.myScoreObj.breakdown.streak, rival: pk.rival.breakdown.streak },
      { label: '铁胃抗暴击', max: 15, mine: pk.myScoreObj.breakdown.resilience, rival: pk.rival.breakdown.resilience }
    ];

    el.pkBarsGrid.innerHTML = dims
      .map((d) => {
        const minePct = Math.round((d.mine / d.max) * 100);
        const rivalPct = Math.round((d.rival / d.max) * 100);
        return `
          <div class="pk-bar-row">
            <div class="pk-bar-labels">
              <span>${d.mine}/${d.max}</span>
              <span>${d.label}</span>
              <span>${d.rival}/${d.max}</span>
            </div>
            <div class="pk-dual-track">
              <div class="pk-track-half is-mine"><div class="pk-fill-mine" style="width:${minePct}%;"></div></div>
              <div class="pk-track-half"><div class="pk-fill-rival" style="width:${rivalPct}%;"></div></div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  function openPkSheet(rivalId) {
    if (rivalId && PK_RIVALS.some((r) => r.id === rivalId)) {
      activeRivalId = rivalId;
    }
    renderPkSheet();
    openSheet('pk');
  }

  // =========================================================================
  // Sheet 6: 3-in-1 Privacy-Safe Share Hub (`openShareHub` / `openPostcardSheet`)
  // =========================================================================
  function computePostcardSummary() {
    const logs = state.logs;
    const total = logs.length;
    const idealCount = logs.filter((l) => l.bristol === 3 || l.bristol === 4).length;
    const idealRate = total ? Math.round((idealCount / total) * 100) : 79;

    let bestStreak = 0;
    let cur = 0;
    for (const item of logs) {
      const col = getColorObj(item.color);
      if (!col.redFlag && item.bristol >= 3 && item.bristol <= 5) {
        cur += 1;
        if (cur > bestStreak) bestStreak = cur;
      } else {
        cur = 0;
      }
    }
    bestStreak = Math.max(bestStreak, 6);

    const spicyCount = Math.max(2, logs.filter((l) => l.triggers.includes('重辣火锅')).length + 1);
    const now = new Date();
    const monthLabel = `${now.getFullYear()} · ${now.getMonth() + 1} 月剧场月刊`;
    const checkins = Math.max(28, total + 14);
    const signatureToy = getToy(4);

    let award = `「本月肠道稳如毛毡大师，成功化解 ${spicyCount} 次火锅突袭」`;
    if (idealRate < 50) {
      award = '「本月毛毡剧场跌宕起伏，下月多喝温水冲刺五星金冠团」';
    } else if (idealRate >= 75) {
      award = `「本月肠道稳如毛毡大师，丝滑金冠团高频卫冕 · 化解 ${spicyCount} 次火锅突袭」`;
    }

    return {
      monthLabel,
      checkins,
      idealRate,
      bestStreak,
      signatureToy,
      award
    };
  }

  // =========================================================================
  // Sheet 6: Game-Level Settlement & PK Share Hub (4 Tabs: single/weekly/monthly/pk)
  // =========================================================================
  function isEntryRedFlag(entry) {
    if (!entry) return false;
    const col = getColorObj(entry.color);
    if (col.redFlag) return true;
    // Check if consecutive Bristol 7 at top of logs
    if (entry.bristol === 7 && state.logs[0] && state.logs[1] && entry.id === state.logs[0].id && state.logs[1].bristol === 7) {
      return true;
    }
    return false;
  }

  function makePreviewEntry(bristolType) {
    if (bristolType === 1) {
      return {
        id: 'preview-desert',
        timestamp: new Date().toISOString(),
        bristol: 1,
        color: 'brown',
        triggers: ['喝水少', '久坐'],
        durationSec: 495,
        ease: '费力',
        headline: '“硬球小团拒绝配合演出，肠道联名发函：饮水机就在三米外！”',
        stamp: '缺水警戒',
        stampTone: 'dry'
      };
    }
    if (bristolType === 6) {
      return {
        id: 'preview-storm',
        timestamp: new Date().toISOString(),
        bristol: 6,
        color: 'brown',
        triggers: ['重辣火锅', '冰美式'],
        durationSec: 215,
        ease: '急促',
        headline: '“昨夜重辣火锅的账单今早到账，炸毛摊软团当场接管戏台！”',
        stamp: '绒浪预警',
        stampTone: 'soft'
      };
    }
    return {
      id: 'preview-gold',
      timestamp: new Date().toISOString(),
      bristol: 4,
      color: 'golden',
      triggers: ['重辣火锅'],
      durationSec: 245,
      ease: '顺畅',
      headline: '“昨夜重辣火锅企图搞事，被四号金冠团优雅镇压！”',
      stamp: '五星金绒',
      stampTone: 'gold'
    };
  }

  function computeSingleSettlement(entry) {
    const target = entry || state.logs[0] || makePreviewEntry(4);
    const toy = getToy(target.bristol);
    const redFlag = isEntryRedFlag(target);
    const theme = getSettlementMoodTheme(target.bristol, redFlag);
    const deduction = inferLikelyDiet(target, state.logs.slice(1));
    const safeSpeed = target.durationSec <= 480;

    let grade = 'S';
    let title = '黄金通关';
    let score = 90;
    let nextSupply = '保持当前温水与蔬果节奏，明天继续冲刺四号金冠连胜！';

    if (target.bristol === 4 && target.durationSec <= 300 && target.ease === '顺畅') {
      grade = 'SSS';
      title = '完美通关';
      score = 96;
      nextSupply = '教科书级完美通关！今晚继续温热饮食，稳稳守住四号金冠王座。';
    } else if (target.bristol === 4 || target.bristol === 3) {
      grade = 'S';
      title = '黄金通关';
      score = target.bristol === 4 ? 91 : 86;
      nextSupply =
        target.bristol === 3
          ? '距离 SSS 完美通关只差下午多喝 400ml 温水，明天稳冲四号金冠团！'
          : '状态极佳！注意单次控制在 5 分钟内，给肛周静脉减负。';
    } else if (target.bristol === 2) {
      grade = 'B';
      title = '干涸攻坚战';
      score = 68;
      nextSupply = '本关缺水耗血！下一关补给：温水 +400ml + 深绿叶菜，起身走动 5 分钟。';
    } else if (target.bristol === 1) {
      grade = 'B-';
      title = '缺水持久战';
      score = 60;
      nextSupply = '本关缺水耗血！下一关补给：温水 +500ml + 燕麦/绿叶菜，切忌久蹲硬憋。';
    } else if (target.bristol === 5) {
      grade = 'C+';
      title = '轻浪急行';
      score = 66;
      nextSupply = '肠道节拍稍快半拍，下餐清淡温热、少冰饮即可迅速回稳。';
    } else if (target.bristol === 6) {
      grade = 'C';
      title = '暴风预警';
      score = 56;
      nextSupply = '暴风急行消耗不小！今天暂别冰美式与重辣，喝点温粥温水让肠胃喘口气。';
    } else {
      grade = 'C-';
      title = '水帘急报';
      score = 48;
      nextSupply = '优先少量多次补充电解质水并注意保暖休息；若连续出现请重视身体信号。';
    }

    const easePretty =
      target.ease === '顺畅' ? '顺畅无压' : target.ease === '费力' ? '有点费力' : '急促冲刺';

    return {
      entry: target,
      toy,
      redFlag,
      theme,
      deduction,
      safeSpeed,
      grade,
      title,
      score,
      nextSupply,
      easePretty
    };
  }

  function computeDominantMood(logs) {
    let gold = 0;
    let desert = 0;
    let storm = 0;
    logs.forEach((l) => {
      if (l.bristol === 3 || l.bristol === 4) gold += 1;
      else if (l.bristol <= 2) desert += 1;
      else storm += 1;
    });
    if (gold >= desert && gold >= storm) return getSettlementMoodTheme(4, false);
    if (desert >= storm) return getSettlementMoodTheme(2, false);
    return getSettlementMoodTheme(6, false);
  }

  function computeWeeklySettlement() {
    const recent7 = state.logs.slice(0, 7);
    const moodTheme = computeDominantMood(recent7);
    const scoreObj = computeMyHealthScore();
    const rival = getActiveRival();
    const delta = scoreObj.total - rival.score;

    // Build 7-day Mon-Sun attendance track from most recent 7 entries
    const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
    const ordered = [...recent7].reverse();
    const track = weekdays.map((label, idx) => {
      const log = ordered[idx] || null;
      if (!log) {
        return { label, text: '·', cls: 'day-token-empty' };
      }
      let cls = 'day-token-gold';
      if (log.bristol <= 2) cls = 'day-token-desert';
      else if (log.bristol >= 5) cls = 'day-token-storm';
      return { label, text: `${log.bristol}型`, cls };
    });

    // Top trigger culprit in past 7 days
    const trigCounts = {};
    recent7.forEach((l) => {
      (l.triggers || []).forEach((t) => {
        trigCounts[t] = (trigCounts[t] || 0) + 1;
      });
    });
    const topTrig = Object.keys(trigCounts).sort((a, b) => trigCounts[b] - trigCounts[a])[0];

    const idealCount = recent7.filter((l) => l.bristol === 3 || l.bristol === 4).length;
    const idealPct = recent7.length ? Math.round((idealCount / recent7.length) * 100) : 71;

    let rankGrade = 'S';
    let rankLabel = '黄金守门员';
    if (scoreObj.total >= 86) {
      rankGrade = 'SSS';
      rankLabel = '金绒大满贯';
    } else if (scoreObj.total < 68) {
      rankGrade = 'B';
      rankLabel = '韧性挑战者';
    }

    const heroToy =
      moodTheme.mood === 'desert' ? getToy(2) : moodTheme.mood === 'storm' ? getToy(6) : getToy(4);

    const culpritText = topTrig
      ? `${topTrig}（本周出现 ${trigCounts[topTrig]} 次）：注意搭配温水缓冲，防止偷袭肠道稳态。`
      : '本周无明显饮食背刺，作息与饮水纪律堪称毛毡模范生！';

    const verdictText =
      idealPct >= 70
        ? `本周 3–4 型黄金率高达 ${idealPct}%，稳居全勤舒适区，下周继续保持！`
        : `本周 3–4 型黄金率 ${idealPct}%，多补温水少熬夜，下周稳稳冲回金绒剧场！`;

    const leadText =
      delta >= 0 ? `领先${rival.shortName} +${delta} 分` : `暂落后${rival.shortName} ${Math.abs(delta)} 分`;

    return {
      theme: moodTheme,
      heroToy,
      scoreObj,
      rankGrade,
      rankLabel,
      track,
      attendanceCount: recent7.length,
      culpritText,
      verdictText,
      pkRibbon: `⚔️ 本周战力 ${scoreObj.total} 分（${leadText}）· 口令 ${pkInviteCode} 接战！`
    };
  }

  function computeMonthlySettlement() {
    const pc = computePostcardSummary();
    const logs = state.logs;
    const theme = computeDominantMood(logs);
    const counts = [0, 0, 0, 0, 0, 0, 0];
    logs.forEach((l) => {
      if (l.bristol >= 1 && l.bristol <= 7) counts[l.bristol - 1] += 1;
    });

    // Scale softly to look like a rich full month alongside real recent entries
    const displayCounts = counts.map((c, idx) => (idx === 3 ? c + 5 : idx === 2 ? c + 3 : c + (idx === 5 ? 1 : 0)));
    const safeRuns = logs.filter((l) => l.durationSec <= 480).length;
    const safeRate = logs.length ? Math.round((safeRuns / logs.length) * 100) : 92;

    const trigCounts = {};
    logs.forEach((l) => {
      (l.triggers || []).forEach((t) => {
        trigCounts[t] = (trigCounts[t] || 0) + 1;
      });
    });
    const topTrig = Object.keys(trigCounts).sort((a, b) => trigCounts[b] - trigCounts[a])[0] || '重辣火锅';
    const scoreObj = computeMyHealthScore();

    const titleBadge =
      theme.mood === 'gold'
        ? '金绒收藏家'
        : theme.mood === 'desert'
        ? '荒漠补水侠'
        : '暴风冲浪手';
    const rankGrade = pc.idealRate >= 70 ? 'S+' : pc.idealRate >= 50 ? 'A' : 'B';

    return {
      ...pc,
      theme,
      displayCounts,
      safeRate,
      topTrig,
      titleBadge,
      rankGrade,
      score: scoreObj.total,
      pkRibbon: `⚔️ 月度战力 ${scoreObj.total} 分 · 口令 ${pkInviteCode} · 晒出你的本月团子图鉴！`
    };
  }

  function syncMotionButtonUI() {
    if (!el.postcardSheet || !el.toggleStageMotionBtn) return;
    el.postcardSheet.classList.toggle('is-static-stage', stageStaticMode);
    el.toggleStageMotionBtn.setAttribute('aria-pressed', String(!stageStaticMode));
    el.toggleStageMotionBtn.textContent = stageStaticMode ? '🖼️ 静态海报' : '🎬 动态小剧场';
  }

  function renderShareHub(slamStamp = false) {
    // Normalize legacy 'daily' alias -> 'single'
    if (activeShareTab === 'daily') activeShareTab = 'single';

    document.querySelectorAll('[data-share-tab]').forEach((btn) => {
      const isAct = btn.dataset.shareTab === activeShareTab;
      btn.classList.toggle('is-active', isAct);
      btn.setAttribute('aria-selected', String(isAct));
    });

    if (el.shareCardSingle) el.shareCardSingle.hidden = activeShareTab !== 'single';
    if (el.shareCardWeekly) el.shareCardWeekly.hidden = activeShareTab !== 'weekly';
    if (el.shareCardMonthly) el.shareCardMonthly.hidden = activeShareTab !== 'monthly';
    if (el.shareCardPk) el.shareCardPk.hidden = activeShareTab !== 'pk';

    syncMotionButtonUI();

    // 1. TAB SINGLE: Stage Clear Single Run
    const single = computeSingleSettlement(settlementPreviewEntry || state.logs[0]);
    if (el.shareCardSingle) {
      el.shareCardSingle.dataset.mood = single.theme.mood;
    }
    if (el.singleStageKicker) {
      el.singleStageKicker.textContent = single.redFlag
        ? 'CLINICAL CARE · 静音诊室关护'
        : `STAGE CLEAR · 第 ${state.episode} 关通关结算`;
    }
    if (el.singleMoodLabel) el.singleMoodLabel.textContent = single.theme.stageName;

    if (single.redFlag) {
      if (el.singleNormalStage) el.singleNormalStage.hidden = true;
      if (el.singleNormalDetails) el.singleNormalDetails.hidden = true;
      if (el.singleCareStage) el.singleCareStage.hidden = false;
      const guide = RED_FLAG_GUIDE[single.entry.color] || RED_FLAG_GUIDE.bristol7_streak;
      if (el.singleCareNote) el.singleCareNote.textContent = guide.explanation;
    } else {
      if (el.singleNormalStage) el.singleNormalStage.hidden = false;
      if (el.singleNormalDetails) el.singleNormalDetails.hidden = false;
      if (el.singleCareStage) el.singleCareStage.hidden = true;

      if (el.shareDailyImg) el.shareDailyImg.src = single.toy.img;
      if (el.singleRankGrade) el.singleRankGrade.textContent = single.grade;
      if (el.singleRankTitle) el.singleRankTitle.textContent = single.title;
      if (el.singleRankScore) el.singleRankScore.textContent = `${single.score} 分`;
      if (el.shareDailyHeadline) el.shareDailyHeadline.textContent = single.entry.headline;
      if (el.hudToyLabel) el.hudToyLabel.textContent = `${single.toy.type}型 ${single.toy.shortName}`;
      if (el.hudTimeLabel) {
        const compactDur = formatDurationCN(single.entry.durationSec).replace(/\s+/g, '');
        el.hudTimeLabel.innerHTML = `${compactDur}<br><small style="font-size:10px;font-weight:700;opacity:0.84">${
          single.safeSpeed ? '不伤痔 ✓' : '超时 ⚠️'
        }</small>`;
      }
      if (el.hudEaseLabel) el.hudEaseLabel.textContent = single.easePretty;
      if (el.shareDailyConf) el.shareDailyConf.textContent = `🔍 侦探归因 ${single.deduction.confidence}%`;
      if (el.shareDailyDeduction) el.shareDailyDeduction.textContent = single.deduction.fullReason;
      if (el.singleNextSupply) el.singleNextSupply.textContent = single.nextSupply;
      if (el.singlePkRibbon) el.singlePkRibbon.hidden = !includePkRibbon;
      if (el.singlePkRibbonText) {
        el.singlePkRibbonText.textContent = `⚔️ 本关战力 ${single.score} 分 · 口令 ${pkInviteCode} · 不服来毛毡擂台晒你的团子！`;
      }

      if (slamStamp && el.singleRankStamp) {
        el.singleRankStamp.classList.remove('is-stamp-slam');
        void el.singleRankStamp.offsetWidth;
        el.singleRankStamp.classList.add('is-stamp-slam');
      }
    }

    // 2. TAB WEEKLY: 7-Day Season Settlement
    const weekly = computeWeeklySettlement();
    if (el.shareCardWeekly) el.shareCardWeekly.dataset.mood = weekly.theme.mood;
    if (el.weeklyMoodTitle) {
      el.weeklyMoodTitle.textContent = `${weekly.theme.stageName} · ${weekly.rankLabel}`;
    }
    if (el.weeklyPowerPill) el.weeklyPowerPill.textContent = `综合战力 ${weekly.scoreObj.total} 分`;
    if (el.weeklyHeroImg) el.weeklyHeroImg.src = weekly.heroToy.img;
    if (el.weeklyRankGrade) el.weeklyRankGrade.textContent = weekly.rankGrade;
    if (el.weeklyRankLabel) el.weeklyRankLabel.textContent = weekly.rankLabel;
    if (el.weeklyAttendanceSummary) {
      el.weeklyAttendanceSummary.textContent = `本周出勤 ${weekly.attendanceCount}/7 日`;
    }
    if (el.weeklySevenDayTrack) {
      el.weeklySevenDayTrack.innerHTML = weekly.track
        .map(
          (d) => `
          <div class="day-token-col">
            <span class="day-token-circle ${d.cls}">${d.text}</span>
            <span class="day-token-label">周${d.label}</span>
          </div>
        `
        )
        .join('');
    }
    if (el.weeklyScorePills) {
      const b = weekly.scoreObj.breakdown;
      el.weeklyScorePills.innerHTML = `
        <div class="weekly-score-pill"><strong>${b.ideal}/40</strong><span>黄金出货</span></div>
        <div class="weekly-score-pill"><strong>${b.speed}/25</strong><span>不伤痔</span></div>
        <div class="weekly-score-pill"><strong>${b.streak}/20</strong><span>规律连胜</span></div>
        <div class="weekly-score-pill"><strong>${b.resilience}/15</strong><span>抗暴击</span></div>
      `;
    }
    if (el.weeklyTopCulprit) el.weeklyTopCulprit.textContent = weekly.culpritText;
    if (el.weeklyTrendVerdict) el.weeklyTrendVerdict.textContent = weekly.verdictText;
    if (el.weeklyPkRibbon) el.weeklyPkRibbon.hidden = !includePkRibbon;
    if (el.weeklyPkRibbonText) el.weeklyPkRibbonText.textContent = weekly.pkRibbon;

    // 3. TAB MONTHLY: Monthly Grand Finale + Bristol 1-7 Wool Bar Chart
    const monthly = computeMonthlySettlement();
    if (el.shareCardMonthly) el.shareCardMonthly.dataset.mood = monthly.theme.mood;
    if (el.postcardMonthLabel) el.postcardMonthLabel.textContent = monthly.monthLabel;
    if (el.monthlyTitleBadge) el.monthlyTitleBadge.textContent = monthly.titleBadge;
    if (el.postcardSignatureImg) {
      el.postcardSignatureImg.src = monthly.signatureToy.img;
      el.postcardSignatureImg.alt = monthly.signatureToy.name;
    }
    if (el.monthlyRankGrade) el.monthlyRankGrade.textContent = monthly.rankGrade;
    if (el.postcardRankPill) el.postcardRankPill.textContent = `${monthly.signatureToy.type}型头牌`;
    if (el.postcardAwardQuote) el.postcardAwardQuote.textContent = monthly.award;
    if (el.monthlyTopTriggerText) el.monthlyTopTriggerText.textContent = `头号考验：${monthly.topTrig}`;
    if (el.pcTotalCheckins) el.pcTotalCheckins.textContent = `${monthly.checkins} 场`;
    if (el.pcIdealRate) el.pcIdealRate.textContent = `${monthly.idealRate}%`;
    if (el.pcBestStreak) el.pcBestStreak.textContent = `${monthly.safeRate}%`;
    if (el.monthlyPkRibbon) el.monthlyPkRibbon.hidden = !includePkRibbon;
    if (el.monthlyPkRibbonText) el.monthlyPkRibbonText.textContent = monthly.pkRibbon;

    if (el.monthlyBristolBars) {
      const maxVal = Math.max(1, ...monthly.displayCounts);
      el.monthlyBristolBars.innerHTML = monthly.displayCounts
        .map((cnt, idx) => {
          const type = idx + 1;
          const pct = Math.max(10, Math.round((cnt / maxVal) * 62));
          const barCls = type <= 2 ? 'bar-desert' : type <= 4 ? 'bar-gold' : 'bar-storm';
          return `
            <div class="wool-bar-col">
              <span class="wool-bar-count">${cnt}</span>
              <div class="wool-bar-fill ${barCls}" style="height:${pct}px;"></div>
              <span class="wool-bar-label">${type}型</span>
            </div>
          `;
        })
        .join('');
    }

    // 4. TAB PK: Head-to-Head Rival VS Card
    const pk = computePkMatchSummary();
    if (el.sharePkTitle) el.sharePkTitle.textContent = `好友毛毡擂台 · 你 VS ${pk.rival.shortName}`;
    if (el.sharePkOutcomeStamp) el.sharePkOutcomeStamp.textContent = pk.outcomeStamp;
    if (el.sharePkMyImg) el.sharePkMyImg.src = pk.myToy.img;
    if (el.sharePkMyScore) el.sharePkMyScore.textContent = String(pk.myScoreObj.total);
    if (el.sharePkMyToy) el.sharePkMyToy.textContent = `${pk.myToy.type}型 ${pk.myToy.name}`;
    if (el.sharePkRivalImg) el.sharePkRivalImg.src = pk.rivalToy.img;
    if (el.sharePkRivalName) el.sharePkRivalName.textContent = pk.rival.shortName;
    if (el.sharePkRivalScore) el.sharePkRivalScore.textContent = String(pk.rival.score);
    if (el.sharePkRivalToy) el.sharePkRivalToy.textContent = `${pk.rivalToy.type}型 ${pk.rivalToy.name}`;
    if (el.sharePkVerdict) el.sharePkVerdict.textContent = pk.verdict;
    if (el.sharePkCodeNote) el.sharePkCodeNote.textContent = `口令：${pkInviteCode} · 来战`;

    // Footer PK Ribbon Toggle visibility (hide in red-flag care mode or on PK tab)
    const hidePkToggle = (activeShareTab === 'single' && single.redFlag) || activeShareTab === 'pk';
    if (el.pkRibbonToggleRow) el.pkRibbonToggleRow.hidden = hidePkToggle;
    if (el.includePkRibbonToggle) {
      el.includePkRibbonToggle.setAttribute('aria-checked', String(includePkRibbon));
    }
    if (el.savePostcardImgBtn) {
      el.savePostcardImgBtn.hidden = activeShareTab === 'single' && single.redFlag;
    }
    if (el.copyPostcardTextBtn) {
      el.copyPostcardTextBtn.hidden = activeShareTab === 'single' && single.redFlag;
    }

    syncDirectorRailActive();
  }

  function openSettlement(tab = 'single', opts = {}) {
    const normalized = tab === 'daily' ? 'single' : tab;
    if (normalized === 'single' || normalized === 'weekly' || normalized === 'monthly' || normalized === 'pk') {
      activeShareTab = normalized;
    }
    if (typeof opts.previewBristol === 'number') {
      settlementPreviewEntry = makePreviewEntry(opts.previewBristol);
    } else if (!opts.keepPreview) {
      settlementPreviewEntry = null;
    }
    directorActiveHint = opts.directorHint || '';

    renderShareHub(true);
    openSheet('postcard');

    if (opts.autoLaunch || opts.playMoodSound) {
      const single = computeSingleSettlement(settlementPreviewEntry || state.logs[0]);
      if (!single.redFlag) {
        if (single.theme.mood === 'gold') FeltAudio.victoryFanfare();
        else if (single.theme.mood === 'desert') FeltAudio.desertDrum();
        else FeltAudio.stormPlop();
      }
    }
  }

  function openShareHub(tab = 'single') {
    openSettlement(tab, {});
  }

  function openPostcardSheet() {
    openSettlement('monthly', {});
  }

  function drawWrappedText(ctx, text, x, y, maxCharsPerLine, lineHeight) {
    let cursorY = y;
    for (let i = 0; i < text.length; i += maxCharsPerLine) {
      ctx.fillText(text.slice(i, i + maxCharsPerLine), x, cursorY);
      cursorY += lineHeight;
    }
    return cursorY;
  }

  function exportShareCardPng() {
    FeltAudio.stampPublish();
    const single = computeSingleSettlement(settlementPreviewEntry || state.logs[0]);
    const weekly = computeWeeklySettlement();
    const monthly = computeMonthlySettlement();
    const pk = computePkMatchSummary();

    const activeTheme =
      activeShareTab === 'single'
        ? single.theme
        : activeShareTab === 'weekly'
        ? weekly.theme
        : activeShareTab === 'monthly'
        ? monthly.theme
        : getSettlementMoodTheme(4, false);

    const feedbackToyImg =
      activeShareTab === 'single'
        ? single.toy.img
        : activeShareTab === 'weekly'
        ? weekly.heroToy.img
        : activeShareTab === 'pk'
        ? pk.myToy.img
        : monthly.signatureToy.img;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('no-canvas');

      // Dynamic Mood Wool Gradient Background
      const grad = ctx.createLinearGradient(0, 0, 0, 1200);
      grad.addColorStop(0, activeTheme.bgTop);
      grad.addColorStop(1, activeTheme.bgBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 900, 1200);

      // Stitched Mini-Curtain Side Accents at Top Proscenium
      ctx.fillStyle = activeTheme.curtainColor;
      ctx.fillRect(0, 0, 48, 420);
      ctx.fillRect(852, 0, 48, 420);

      // Outer Stitched Border
      ctx.strokeStyle = 'rgba(138, 102, 68, 0.42)';
      ctx.lineWidth = 4;
      ctx.setLineDash([14, 10]);
      ctx.strokeRect(36, 36, 828, 1128);
      ctx.setLineDash([]);

      if (activeShareTab === 'single') {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#725B47';
        ctx.font = '700 22px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText(`STAGE CLEAR · 第 ${state.episode} 关 · ${single.theme.stageName}`, 78, 104);

        ctx.fillStyle = '#3E2D20';
        ctx.font = '700 40px "Songti SC", "PingFang SC", serif';
        ctx.fillText(`${single.toy.type}型 ${single.toy.name} · ${single.title}`, 78, 162);

        // Stitched Rank Stamp
        ctx.fillStyle = activeTheme.stampBg;
        ctx.fillRect(670, 74, 150, 112);
        ctx.strokeStyle = activeTheme.accentColor;
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(670, 74, 150, 112);
        ctx.setLineDash([]);
        ctx.textAlign = 'center';
        ctx.fillStyle = activeTheme.stampInk;
        ctx.font = '900 44px "Songti SC", serif';
        ctx.fillText(single.grade, 745, 132);
        ctx.font = '700 22px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText(`${single.score} 分`, 745, 168);

        if (el.shareDailyImg && el.shareDailyImg.complete && el.shareDailyImg.naturalWidth > 0) {
          ctx.drawImage(el.shareDailyImg, 310, 215, 280, 280);
        }

        ctx.textAlign = 'center';
        ctx.fillStyle = '#3E2D20';
        ctx.font = '700 32px "Songti SC", "PingFang SC", serif';
        drawWrappedText(ctx, single.entry.headline, 450, 565, 19, 48);

        // 3 HUD Pills
        const hudItems = [
          ['本关团子', `${single.toy.type}型 ${single.toy.shortName}`],
          ['通关用时', `${formatDurationCN(single.entry.durationSec)}`],
          ['顺畅状态', single.easePretty]
        ];
        hudItems.forEach(([lbl, val], i) => {
          const cx = 185 + i * 265;
          ctx.fillStyle = 'rgba(255, 251, 242, 0.88)';
          ctx.fillRect(cx - 112, 665, 224, 108);
          ctx.fillStyle = '#725B47';
          ctx.font = '600 20px -apple-system, "PingFang SC", sans-serif';
          ctx.fillText(lbl, cx, 704);
          ctx.fillStyle = '#3E2D20';
          ctx.font = '800 26px -apple-system, "PingFang SC", sans-serif';
          ctx.fillText(val, cx, 748);
        });

        ctx.fillStyle = '#9D3B1B';
        ctx.font = '700 22px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText(`🔍 侦探归因 (${single.deduction.confidence}%)`, 450, 825);
        ctx.fillStyle = '#3E2D20';
        ctx.font = '600 22px -apple-system, "PingFang SC", sans-serif';
        drawWrappedText(ctx, single.deduction.shortGuess, 450, 862, 26, 34);

        ctx.fillStyle = '#3E6037';
        ctx.font = '700 22px -apple-system, "PingFang SC", sans-serif';
        drawWrappedText(ctx, `🧭 下关补给：${single.nextSupply}`, 450, 922, 26, 34);

        if (includePkRibbon && !single.redFlag) {
          ctx.fillStyle = 'rgba(255, 247, 224, 0.94)';
          ctx.fillRect(72, 1002, 756, 62);
          ctx.fillStyle = activeTheme.stampInk;
          ctx.font = '700 23px -apple-system, "PingFang SC", sans-serif';
          ctx.fillText(`⚔️ 本关战力 ${single.score} 分 · 口令 ${pkInviteCode} · 来毛毡擂台一战！`, 450, 1041);
        }
      } else if (activeShareTab === 'weekly') {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#725B47';
        ctx.font = '700 22px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText('WEEKLY SEASON · 每周毛毡赛季结算', 78, 104);

        ctx.fillStyle = '#3E2D20';
        ctx.font = '700 40px "Songti SC", "PingFang SC", serif';
        ctx.fillText(`${weekly.theme.stageName} · ${weekly.rankLabel}`, 78, 162);

        if (el.weeklyHeroImg && el.weeklyHeroImg.complete && el.weeklyHeroImg.naturalWidth > 0) {
          ctx.drawImage(el.weeklyHeroImg, 330, 200, 240, 240);
        }

        // 7-Day Attendance Circles
        ctx.textAlign = 'center';
        weekly.track.forEach((d, idx) => {
          const cx = 132 + idx * 106;
          ctx.beginPath();
          ctx.arc(cx, 530, 38, 0, Math.PI * 2);
          ctx.fillStyle =
            d.cls === 'day-token-gold'
              ? '#FCEEC3'
              : d.cls === 'day-token-desert'
              ? '#F6DAC0'
              : d.cls === 'day-token-storm'
              ? '#D4E6F0'
              : '#FAF3E4';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(138, 102, 68, 0.45)';
          ctx.stroke();

          ctx.fillStyle = '#3E2D20';
          ctx.font = '800 22px -apple-system, "PingFang SC", sans-serif';
          ctx.fillText(d.text, cx, 538);
          ctx.fillStyle = '#725B47';
          ctx.font = '600 20px -apple-system, "PingFang SC", sans-serif';
          ctx.fillText(`周${d.label}`, cx, 600);
        });

        ctx.fillStyle = '#3E2D20';
        ctx.font = '800 34px "Songti SC", serif';
        ctx.fillText(`本周综合战力 ${weekly.scoreObj.total} 分 · 评级 ${weekly.rankGrade}`, 450, 682);

        ctx.font = '600 23px -apple-system, "PingFang SC", sans-serif';
        drawWrappedText(ctx, `⚠️ ${weekly.culpritText}`, 450, 754, 26, 38);
        drawWrappedText(ctx, `📈 ${weekly.verdictText}`, 450, 846, 26, 38);

        if (includePkRibbon) {
          ctx.fillStyle = 'rgba(255, 247, 224, 0.94)';
          ctx.fillRect(72, 988, 756, 66);
          ctx.fillStyle = activeTheme.stampInk;
          ctx.font = '700 23px -apple-system, "PingFang SC", sans-serif';
          ctx.fillText(weekly.pkRibbon, 450, 1030);
        }
      } else if (activeShareTab === 'monthly') {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#725B47';
        ctx.font = '700 22px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText(`MONTHLY FINALE · ${monthly.titleBadge}`, 78, 104);

        ctx.fillStyle = '#3E2D20';
        ctx.font = '700 40px "Songti SC", "PingFang SC", serif';
        ctx.fillText(monthly.monthLabel, 78, 162);

        if (el.postcardSignatureImg && el.postcardSignatureImg.complete && el.postcardSignatureImg.naturalWidth > 0) {
          ctx.drawImage(el.postcardSignatureImg, 330, 195, 240, 240);
        }

        ctx.textAlign = 'center';
        ctx.fillStyle = '#3E2D20';
        ctx.font = '700 30px "Songti SC", "PingFang SC", serif';
        drawWrappedText(ctx, monthly.award, 450, 495, 20, 44);

        // Bristol 1-7 Wool Distribution Bars
        const maxV = Math.max(1, ...monthly.displayCounts);
        monthly.displayCounts.forEach((cnt, idx) => {
          const type = idx + 1;
          const bx = 130 + idx * 102;
          const bh = Math.max(18, Math.round((cnt / maxV) * 160));
          ctx.fillStyle = type <= 2 ? '#C46C3B' : type <= 4 ? '#DC9F30' : '#5886A6';
          ctx.fillRect(bx - 24, 790 - bh, 48, bh);
          ctx.fillStyle = '#3E2D20';
          ctx.font = '800 22px -apple-system, "PingFang SC", sans-serif';
          ctx.fillText(String(cnt), bx, 778 - bh);
          ctx.fillStyle = '#725B47';
          ctx.font = '700 20px -apple-system, "PingFang SC", sans-serif';
          ctx.fillText(`${type}型`, bx, 825);
        });

        ctx.fillStyle = '#3E2D20';
        ctx.font = '700 26px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText(
          `本月通关 ${monthly.checkins} 场 · 3–4型达标 ${monthly.idealRate}% · 不伤痔率 ${monthly.safeRate}%`,
          450,
          908
        );

        if (includePkRibbon) {
          ctx.fillStyle = 'rgba(255, 247, 224, 0.94)';
          ctx.fillRect(72, 988, 756, 66);
          ctx.fillStyle = activeTheme.stampInk;
          ctx.font = '700 23px -apple-system, "PingFang SC", sans-serif';
          ctx.fillText(monthly.pkRibbon, 450, 1030);
        }
      } else {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#725B47';
        ctx.font = '700 22px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText('WOOL ARENA BATTLE CARD · 好友毛毡擂台 PK', 78, 104);

        ctx.fillStyle = '#3E2D20';
        ctx.font = '700 40px "Songti SC", "PingFang SC", serif';
        ctx.fillText(`你 (${pk.myScoreObj.total}分)  VS  ${pk.rival.shortName} (${pk.rival.score}分)`, 78, 166);

        if (el.sharePkMyImg && el.sharePkMyImg.complete && el.sharePkMyImg.naturalWidth > 0) {
          ctx.drawImage(el.sharePkMyImg, 120, 250, 260, 260);
        }
        if (el.sharePkRivalImg && el.sharePkRivalImg.complete && el.sharePkRivalImg.naturalWidth > 0) {
          ctx.drawImage(el.sharePkRivalImg, 520, 250, 260, 260);
        }

        ctx.textAlign = 'center';
        ctx.fillStyle = '#D96E47';
        ctx.font = '900 44px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText('VS', 450, 400);

        ctx.fillStyle = '#3E2D20';
        ctx.font = '700 34px "Songti SC", "PingFang SC", serif';
        drawWrappedText(ctx, pk.verdict, 450, 640, 18, 54);

        ctx.fillStyle = '#4A6A46';
        ctx.font = '700 26px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText(`PK 邀请口令：${pkInviteCode} · 只比健康分不泄露隐私`, 450, 920);
      }

      ctx.textAlign = 'center';
      ctx.fillStyle = '#4A6A46';
      ctx.font = '600 21px -apple-system, "PingFang SC", sans-serif';
      ctx.fillText('已自动隐去具体排便时间与敏感细节 · 噗通剧场手工毛毡结算小剧场', 450, 1126);

      const link = document.createElement('a');
      link.download = `putong-settlement-${activeShareTab}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showStampFeedback('高清毛毡结算分享图已保存！', feedbackToyImg);
    } catch (_err) {
      showStampFeedback('结算分享卡已就绪（截图或复制文案即可发好友/小红书）', feedbackToyImg);
    }
  }

  function copyShareCaption() {
    FeltAudio.softTap();
    const single = computeSingleSettlement(settlementPreviewEntry || state.logs[0]);
    const weekly = computeWeeklySettlement();
    const monthly = computeMonthlySettlement();
    const pk = computePkMatchSummary();

    let text = '';
    let img = monthly.signatureToy.img;
    if (activeShareTab === 'single') {
      img = single.toy.img;
      text = `【噗通剧场 · 第 ${state.episode} 关 ${single.theme.stageName}】通关评级 ${single.grade}（${single.score}分）！出场团子：${single.toy.type}型 ${single.toy.name}。${single.entry.headline} ${includePkRibbon ? `⚔️ 好友 PK 口令【${pkInviteCode}】，来晒你的毛毡团子！` : ''} #噗通剧场 #手工毛毡`;
    } else if (activeShareTab === 'weekly') {
      img = weekly.heroToy.img;
      text = `【噗通剧场 · 每周赛季结算】本周达成「${weekly.rankLabel}」，综合战力 ${weekly.scoreObj.total} 分！${weekly.verdictText} ${includePkRibbon ? `⚔️ 接战口令【${pkInviteCode}】` : ''} #噗通剧场 #每周肠道结算`;
    } else if (activeShareTab === 'pk') {
      img = pk.myToy.img;
      text = `【噗通剧场 · 好友毛毡擂台 PK】我 (${pk.myScoreObj.total}分·${pk.myToy.name}) VS ${pk.rival.shortName} (${pk.rival.score}分·${pk.rivalToy.name})！${pk.verdict} 邀请口令【${pkInviteCode}】敢来接招吗？ #噗通剧场 #好友PK`;
    } else {
      text = `【噗通剧场 · ${monthly.monthLabel}】${monthly.award} 本月通关 ${monthly.checkins} 场，3–4型达标率 ${monthly.idealRate}%，不伤痔率 ${monthly.safeRate}%！${includePkRibbon ? `⚔️ 月度战帖口令【${pkInviteCode}】` : ''} #噗通剧场 #月度结算`;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => showStampFeedback('小红书 / 微信脱敏文案已复制！', img))
        .catch(() => showStampFeedback('文案已就绪，可直接粘贴分享！', img));
    } else {
      showStampFeedback('文案已就绪，可直接粘贴分享！', img);
    }
  }

  function resetDemoData() {
    state = createSeedState();
    saveState();
    currentMode = 'theater';
    pkBanterCount = 0;
    activeRivalId = 'azhe';
    settlementPreviewEntry = null;
    directorActiveHint = '';
    resetSquatTimer();
    closeAllSheets();
    renderHomeStage(true);
    FeltAudio.stampPublish();
    showStampFeedback('已恢复 14 日初始演示档案', getToy(4).img);
  }

  // =========================================================================
  // V7: Toilet Check-In & Must-Go Ranking (`必拉榜`)
  // =========================================================================
  const SEED_TOILETS = [
    {
      id: 'spot-office-18f',
      name: '公司 18F 西侧礼宾间',
      area: '写字楼西翼走廊尽头',
      air: 5,
      clean: 5,
      tags: ['智能马桶', '信号满格', '纸巾充足'],
      note: '清风香氛 + 独立隔间，摸鱼护痔圣地',
      visits: 16
    },
    {
      id: 'spot-home-main',
      name: '家里主卫 · 专属宝座',
      area: '居家私密主场',
      air: 5,
      clean: 5,
      tags: ['隔音极佳', '恒温座圈', '无异味'],
      note: '熟悉的光线与温度，4 型金冠团高发地',
      visits: 24
    },
    {
      id: 'spot-mall-b1',
      name: '国贸商城 B1 东南角',
      area: '高端商场礼宾区',
      air: 4,
      clean: 5,
      tags: ['无异味', '纸巾充足', '有挂钩'],
      note: '保洁阿姨每小时巡检，逛街救急首选',
      visits: 7
    },
    {
      id: 'spot-cafe-downstairs',
      name: '楼下精品咖啡馆单间',
      area: '一层后院拐角',
      air: 4,
      clean: 4,
      tags: ['隔音极佳', '有挂钩'],
      note: '自带爵士背景音，冰美式发作 30 秒直达',
      visits: 5
    },
    {
      id: 'spot-subway-exit2',
      name: '地铁换乘站 2 号口',
      area: '站厅 B1 层',
      air: 2,
      clean: 2,
      tags: ['仅限应急'],
      note: '空气略闷且排队偏长，非紧急情况建议绕道',
      visits: 2
    }
  ];

  const TOILET_TAG_POOL = ['智能马桶', '信号满格', '纸巾充足', '隔音极佳', '无异味', '有挂钩'];
  const AIR_LABELS = ['', '毒气预警', '略闷有味', '中规中矩', '清新舒适', '清风如林'];
  const CLEAN_LABELS = ['', '劝退避雷', '勉强救急', '基本干净', '清爽整洁', '一尘不染'];

  const toiletDraft = {
    air: 5,
    clean: 5,
    tags: ['无异味', '纸巾充足']
  };

  function ensureToilets() {
    if (!Array.isArray(state.toilets) || state.toilets.length === 0) {
      state.toilets = SEED_TOILETS.map((t) => ({ ...t, tags: [...t.tags] }));
    }
    if (!state.selectedToiletId || !state.toilets.some((t) => t.id === state.selectedToiletId)) {
      state.selectedToiletId = state.toilets[0].id;
    }
  }

  function getSelectedToiletSpot() {
    ensureToilets();
    return state.toilets.find((t) => t.id === state.selectedToiletId) || state.toilets[0];
  }

  function computeToiletScore(spot) {
    const airScore = (Number(spot.air) || 3) * 0.9;
    const cleanScore = (Number(spot.clean) || 3) * 0.9;
    const bonus = Math.min(1.0, (spot.tags ? spot.tags.length : 0) * 0.34);
    return Math.min(10, Number((airScore + cleanScore + bonus).toFixed(1)));
  }

  function getToiletVerdict(score) {
    if (score >= 9.2) return '必拉殿堂';
    if (score >= 8.2) return '强烈推荐';
    if (score >= 6.8) return '稳妥可用';
    return '慎入避雷';
  }

  function syncSessionToiletBadge() {
    const spot = getSelectedToiletSpot();
    const elName = document.getElementById('sessionToiletName');
    if (elName && spot) elName.textContent = spot.name.split('·')[0].trim();
  }

  function renderLogToiletChips() {
    const wrap = document.getElementById('logToiletChips');
    if (!wrap) return;
    ensureToilets();
    wrap.innerHTML = '';
    const ranked = [...state.toilets]
      .sort((a, b) => computeToiletScore(b) - computeToiletScore(a))
      .slice(0, 4);
    ranked.forEach((spot) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'trigger-chip';
      if (spot.id === state.selectedToiletId) btn.classList.add('is-active');
      btn.textContent = `📍 ${spot.name.split('·')[0].trim()}`;
      btn.addEventListener('click', () => {
        FeltAudio.softTap();
        state.selectedToiletId = spot.id;
        saveState();
        syncSessionToiletBadge();
        renderLogToiletChips();
      });
      wrap.appendChild(btn);
    });
  }

  function renderToiletMustGoList() {
    const listEl = document.getElementById('toiletMustGoList');
    if (!listEl) return;
    ensureToilets();
    const ranked = [...state.toilets].sort((a, b) => computeToiletScore(b) - computeToiletScore(a));
    listEl.innerHTML = '';
    ranked.forEach((spot, idx) => {
      const score = computeToiletScore(spot);
      const isSelected = spot.id === state.selectedToiletId;
      const card = document.createElement('article');
      card.className = `toilet-card${isSelected ? ' is-selected' : ''}`;
      const rankClass = idx === 0 ? 'is-top1' : idx === 1 ? 'is-top2' : idx === 2 ? 'is-top3' : '';
      const rankText = idx === 0 ? '🏆' : `#${idx + 1}`;
      card.innerHTML = `
        <div class="toilet-card-top v8-toilet-summary" role="button" tabindex="0" aria-expanded="false">
          <div class="toilet-rank-wrap">
            <span class="toilet-rank-badge ${rankClass}">${rankText}</span>
            <div class="toilet-title-col">
              <strong class="toilet-name">${spot.name}</strong>
              <span class="toilet-area">空气 ${spot.air}★ · 清洁 ${spot.clean}★${isSelected ? ' · 当前坑位' : ''}</span>
            </div>
          </div>
          <div class="toilet-score-box">
            <span class="toilet-score-num">${score.toFixed(1)}</span>
            <span class="toilet-score-verdict">${getToiletVerdict(score)} ▾</span>
          </div>
        </div>
        <div class="v8-toilet-details">
          <div class="toilet-area" style="margin-bottom:6px;">${spot.area || '日常常去点位'} · 已打卡 ${spot.visits || 1} 次</div>
          <div class="toilet-tags-row" style="margin-bottom:8px;">
            ${(spot.tags || []).map((t) => `<span class="toilet-tag">${t}</span>`).join('')}
          </div>
          <div class="toilet-card-foot">
            <span class="toilet-note">${spot.note || '用户实地打卡验证'}</span>
            <button class="toilet-use-btn" type="button">${isSelected ? '当前坑位 ✓' : '设为当前坑位'}</button>
          </div>
        </div>
      `;
      const summaryEl = card.querySelector('.v8-toilet-summary');
      summaryEl.addEventListener('click', () => {
        FeltAudio.softTap();
        const willOpen = !card.classList.contains('is-expanded');
        card.classList.toggle('is-expanded', willOpen);
        summaryEl.setAttribute('aria-expanded', String(willOpen));
      });
      const useBtn = card.querySelector('.toilet-use-btn');
      useBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        FeltAudio.toyBounce();
        state.selectedToiletId = spot.id;
        saveState();
        syncSessionToiletBadge();
        renderToiletMustGoList();
        renderLogToiletChips();
        showStampFeedback(`已定位当前厕所：${spot.name.split('·')[0].trim()}`);
      });
      listEl.appendChild(card);
    });
  }

  function renderToiletFormControls() {
    const airEl = document.getElementById('toiletAirStars');
    const cleanEl = document.getElementById('toiletCleanStars');
    const airLabel = document.getElementById('toiletAirLabel');
    const cleanLabel = document.getElementById('toiletCleanLabel');
    const tagWrap = document.getElementById('toiletTagPicker');

    if (airEl) {
      airEl.innerHTML = '';
      for (let i = 1; i <= 5; i += 1) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `star-btn${i <= toiletDraft.air ? ' is-on' : ''}`;
        b.textContent = '★';
        b.addEventListener('click', () => {
          toiletDraft.air = i;
          FeltAudio.softTap();
          renderToiletFormControls();
        });
        airEl.appendChild(b);
      }
      if (airLabel) airLabel.textContent = AIR_LABELS[toiletDraft.air] || '';
    }

    if (cleanEl) {
      cleanEl.innerHTML = '';
      for (let i = 1; i <= 5; i += 1) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `star-btn${i <= toiletDraft.clean ? ' is-on' : ''}`;
        b.textContent = '★';
        b.addEventListener('click', () => {
          toiletDraft.clean = i;
          FeltAudio.softTap();
          renderToiletFormControls();
        });
        cleanEl.appendChild(b);
      }
      if (cleanLabel) cleanLabel.textContent = CLEAN_LABELS[toiletDraft.clean] || '';
    }

    if (tagWrap) {
      tagWrap.innerHTML = '';
      TOILET_TAG_POOL.forEach((tag) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `trigger-chip${toiletDraft.tags.includes(tag) ? ' is-active' : ''}`;
        b.textContent = tag;
        b.addEventListener('click', () => {
          FeltAudio.softTap();
          if (toiletDraft.tags.includes(tag)) {
            toiletDraft.tags = toiletDraft.tags.filter((x) => x !== tag);
          } else if (toiletDraft.tags.length < 4) {
            toiletDraft.tags.push(tag);
          }
          renderToiletFormControls();
        });
        tagWrap.appendChild(b);
      });
    }
  }

  function switchToiletTab(tab = 'rank') {
    const rankBtn = document.getElementById('toiletTabRankBtn');
    const addBtn = document.getElementById('toiletTabAddBtn');
    const rankPane = document.getElementById('toiletRankPane');
    const form = document.getElementById('toiletCheckinForm');
    const footBtn = document.getElementById('toiletQuickAddFooterBtn');
    const isRank = tab !== 'add';

    if (rankBtn) {
      rankBtn.classList.toggle('is-active', isRank);
      rankBtn.setAttribute('aria-selected', String(isRank));
    }
    if (addBtn) {
      addBtn.classList.toggle('is-active', !isRank);
      addBtn.setAttribute('aria-selected', String(!isRank));
    }
    if (rankPane) rankPane.hidden = !isRank;
    if (form) form.hidden = isRank;
    if (footBtn) footBtn.hidden = !isRank;

    if (isRank) renderToiletMustGoList();
    else renderToiletFormControls();
  }

  function openToiletSheet(tab = 'rank') {
    ensureToilets();
    switchToiletTab(tab);
    openSheet('toilet');
  }

  // =========================================================================
  // V7: Live Poop Session State Machine (`开始大便` -> Timing -> `结束大便`)
  // =========================================================================
  let sessionActive = false;

  function syncHomeSessionView() {
    const idleView = document.getElementById('homeIdleView');
    const sessView = document.getElementById('homeSessionView');
    if (idleView) idleView.hidden = sessionActive;
    if (sessView) sessView.hidden = !sessionActive;
    syncSessionToiletBadge();
  }

  function startPoopSession() {
    ensureToilets();
    if (currentMode === 'redflag') {
      currentMode = 'theater';
      renderHomeStage(false);
    }
    sessionActive = true;
    resetSquatTimer();
    timer.running = true;
    timer.intervalId = setInterval(() => {
      timer.seconds += 1;
      updateTimerUI();
      if (timer.seconds === 480 && !timer.alertShown) {
        timer.alertShown = true;
        showEightMinToast(true);
      }
    }, 1000);
    FeltAudio.toyBounce();
    updateTimerUI();
    syncHomeSessionView();
  }

  function finishPoopSession() {
    const elapsed = timer.seconds;
    if (timer.intervalId) {
      clearInterval(timer.intervalId);
      timer.intervalId = null;
    }
    timer.running = false;
    sessionActive = false;
    syncHomeSessionView();
    updateTimerUI();
    FeltAudio.softTap();
    // Pass exact elapsed seconds if >= 5s; otherwise give a clean 2m15s default for rapid demo clicking
    openLogDrawer(4, elapsed >= 5 ? elapsed : 135);
  }

  function resetPoopSessionUI() {
    sessionActive = false;
    resetSquatTimer();
    syncHomeSessionView();
  }

  // =========================================================================
  // V7: Stop-Motion Felt Archive Cutscene (`完成录入` -> 过场动画+音效 -> 定格档案)
  // =========================================================================
  let cutsceneTimers = [];
  let cutsceneFinishCb = null;

  function getCutscenePersona(entry) {
    const toy = getToy(entry ? entry.bristol : 4);
    const single = computeSingleSettlement(entry || state.logs[0]);
    if (toy.type === 4) {
      return {
        persona: 'champion',
        title: '丝滑金冠团 · 优雅滑行登场！',
        sub: entry?.headline || '“丝滑收工，今日肠道状态满分。”',
        grade: single.grade,
        img: toy.img,
        sound: 'gold'
      };
    }
    if (toy.type === 3) {
      return {
        persona: 'steady',
        title: '缝线稳重团 · 准时稳健打卡！',
        sub: entry?.headline || '“踏实靠谱，今天肠道运转顺滑。”',
        grade: single.grade,
        img: toy.img,
        sound: 'gold'
      };
    }
    if (toy.type <= 2) {
      return {
        persona: 'desert',
        title: '硬核憋劲团 · 顶风突围成功！',
        sub: entry?.headline || '“顶着荒漠逆风完成任务，快补杯温水！”',
        grade: single.grade,
        img: toy.img,
        sound: 'desert'
      };
    }
    return {
      persona: 'storm',
      title: `${toy.name} · 踏浪急行抢滩！`,
      sub: entry?.headline || '“暴风急行完赛，今天让肠胃好好歇歇！”',
      grade: single.grade,
      img: toy.img,
      sound: 'storm'
    };
  }

  function stopFeltCutscene(runCallback = true) {
    cutsceneTimers.forEach((t) => clearTimeout(t));
    cutsceneTimers = [];
    const overlay = document.getElementById('feltCutsceneOverlay');
    if (overlay) {
      overlay.hidden = true;
      overlay.classList.remove('is-playing', 'is-sealed');
    }
    const cb = cutsceneFinishCb;
    cutsceneFinishCb = null;
    if (runCallback && typeof cb === 'function') cb();
  }

  function playFeltArchiveCutscene(entry, onDone) {
    const overlay = document.getElementById('feltCutsceneOverlay');
    if (!overlay) {
      if (typeof onDone === 'function') onDone();
      return;
    }

    stopFeltCutscene(false);
    cutsceneFinishCb = onDone || null;

    const info = getCutscenePersona(entry);
    overlay.dataset.persona = info.persona;
    const epEl = document.getElementById('cutsceneEpisodeTag');
    const imgEl = document.getElementById('cutsceneMascotImg');
    const titleEl = document.getElementById('cutscenePersonaTitle');
    const subEl = document.getElementById('cutscenePersonaSub');
    const gradeEl = document.getElementById('cutsceneSealGrade');

    if (epEl) epEl.textContent = `第 ${state.episode} 场 · 毛毡定格过场小剧场`;
    if (imgEl) imgEl.src = info.img;
    if (titleEl) titleEl.textContent = info.title;
    if (subEl) subEl.textContent = info.sub;
    if (gradeEl) gradeEl.textContent = info.grade;

    overlay.hidden = false;
    overlay.classList.remove('is-playing', 'is-sealed');
    void overlay.offsetWidth;
    overlay.classList.add('is-playing');

    // Synced Persona Soundscape
    if (info.sound === 'gold') FeltAudio.victoryFanfare();
    else if (info.sound === 'desert') FeltAudio.desertDrum();
    else FeltAudio.stormPlop();

    // Freeze-frame wax-stamp slam at 1.35s
    cutsceneTimers.push(
      setTimeout(() => {
        overlay.classList.add('is-sealed');
        FeltAudio.stampPublish();
      }, 1350)
    );

    // Transition seamlessly into Today's Frozen Poop Archive at 2.65s
    cutsceneTimers.push(
      setTimeout(() => {
        stopFeltCutscene(true);
      }, 2650)
    );
  }

  // =========================================================================
  // Event Bindings
  // =========================================================================
  function bindEvents() {
    // V6 Minimalist Top More Menu & Collapsible Desktop Demo Drawer
    const moreMenuBtn = document.getElementById('moreMenuBtn');
    const moreMenuPopover = document.getElementById('moreMenuPopover');
    const closeMoreMenu = () => {
      if (!moreMenuPopover || moreMenuPopover.hidden) return;
      moreMenuPopover.hidden = true;
      if (moreMenuBtn) moreMenuBtn.setAttribute('aria-expanded', 'false');
    };
    if (moreMenuBtn && moreMenuPopover) {
      moreMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        FeltAudio.softTap();
        const willOpen = moreMenuPopover.hidden;
        moreMenuPopover.hidden = !willOpen;
        moreMenuBtn.setAttribute('aria-expanded', String(willOpen));
      });
      moreMenuPopover.addEventListener('click', (e) => {
        if (e.target.closest('button')) closeMoreMenu();
      });
      document.addEventListener('click', (e) => {
        if (!moreMenuPopover.hidden && !e.target.closest('.more-menu-wrap')) {
          closeMoreMenu();
        }
      });
    }

    const directorToggleBtn = document.getElementById('directorToggleBtn');
    const directorCloseBtn = document.getElementById('directorCloseBtn');
    const directorRail = document.getElementById('directorRail');
    const setDirectorDrawer = (open) => {
      if (!directorRail) return;
      directorRail.classList.toggle('is-collapsed', !open);
      if (directorToggleBtn) {
        directorToggleBtn.setAttribute('aria-expanded', String(open));
        directorToggleBtn.hidden = open;
      }
    };
    if (directorToggleBtn && directorRail) {
      directorToggleBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        setDirectorDrawer(true);
      });
    }
    if (directorCloseBtn && directorRail) {
      directorCloseBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        setDirectorDrawer(false);
      });
    }

    const careSkipExitBtn = document.getElementById('careSkipExitBtn');
    if (careSkipExitBtn) {
      careSkipExitBtn.addEventListener('click', exitRedFlagMode);
    }
    const careRetakeBtn = document.getElementById('careRetakeBtn');
    if (careRetakeBtn) {
      careRetakeBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        startCareTriage(activeRedFlagReason);
        renderCareTriageView();
      });
    }

    el.soundToggleBtn.addEventListener('click', () => {
      state.settings.soundEnabled = !state.settings.soundEnabled;
      saveState();
      renderTopBarAndSkin();
      if (state.settings.soundEnabled) FeltAudio.toyBounce();
    });

    el.brandButton.addEventListener('click', () => {
      FeltAudio.softTap();
      if (currentMode === 'redflag') {
        exitRedFlagMode();
      } else {
        showStampFeedback('手工毛毡戏台 · 100% 本地运行');
      }
    });

    el.privacyBtn.addEventListener('click', () => {
      FeltAudio.softTap();
      renderPrivacySheet();
      openSheet('privacy');
    });

    el.timerPillBtn.addEventListener('click', toggleSquatTimer);
    el.demoEightMinBtn.addEventListener('click', triggerEightMinAlert);

    el.closeToastBtn.addEventListener('click', () => {
      FeltAudio.softTap();
      hideEightMinToast();
    });

    el.toastLogNowBtn.addEventListener('click', () => {
      FeltAudio.softTap();
      hideEightMinToast();
      openLogDrawer(4);
    });

    el.toastResetTimerBtn.addEventListener('click', () => {
      FeltAudio.softTap();
      resetSquatTimer();
      showStampFeedback('计时器已归零');
    });

    // Feature 1: Home Detective Feedback Chips
    if (el.detectiveHitBtn) {
      el.detectiveHitBtn.addEventListener('click', () => {
        const latest = state.logs[0];
        if (!latest) return;
        const ded = inferLikelyDiet(latest, state.logs.slice(1));
        const merged = Array.from(new Set([...(latest.triggers || []), ...ded.suggestedTags]));
        latest.triggers = merged;
        latest.detectiveConfirmed = true;
        saveState();
        renderHomeDetectiveStrip();
        FeltAudio.stampPublish();
        showStampFeedback('破案成功！已将饮食线索钉上 14 日背刺榜！', getToy(latest.bristol).img);
      });
    }

    if (el.detectiveMissBtn) {
      el.detectiveMissBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        const willOpen = el.detectiveOverrideRow.hidden;
        el.detectiveOverrideRow.hidden = !willOpen;
        if (willOpen && el.detectiveOverrideChips) {
          el.detectiveOverrideChips.innerHTML = '';
          ['冰美式', '重辣火锅', '奶茶乳糖', '喝水少', '熬夜', '久坐'].forEach((tag) => {
            const c = document.createElement('button');
            c.type = 'button';
            c.className = 'detective-chip';
            c.textContent = tag;
            c.addEventListener('click', () => {
              const latest = state.logs[0];
              if (!latest) return;
              latest.triggers = Array.from(new Set([...(latest.triggers || []), tag]));
              latest.detectiveConfirmed = true;
              saveState();
              renderHomeDetectiveStrip();
              FeltAudio.toyBounce();
              showStampFeedback(`侦探笔记已修正：记录「${tag}」`, getToy(latest.bristol).img);
            });
            el.detectiveOverrideChips.appendChild(c);
          });
        }
      });
    }

    if (el.adoptDetectiveTagsBtn) {
      el.adoptDetectiveTagsBtn.addEventListener('click', () => {
        const pred = inferLikelyDiet(
          {
            bristol: draft.bristol,
            color: draft.color,
            durationSec: draft.durationSec,
            ease: draft.ease,
            triggers: draft.triggers,
            timestamp: new Date().toISOString()
          },
          state.logs
        );
        if (pred.suggestedTags.length > 0) {
          draft.triggers = Array.from(new Set([...draft.triggers, ...pred.suggestedTags]));
          FeltAudio.toyBounce();
          renderTriggerChips();
          showStampFeedback(`已采纳侦探线索：${pred.suggestedTags.join(' + ')}`);
        }
      });
    }

    el.openLogBtn.addEventListener('click', () => {
      startPoopSession();
    });

    const finishPoopBtn = document.getElementById('finishPoopBtn');
    if (finishPoopBtn) finishPoopBtn.addEventListener('click', finishPoopSession);

    const cancelPoopBtn = document.getElementById('cancelPoopBtn');
    if (cancelPoopBtn) {
      cancelPoopBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        resetPoopSessionUI();
      });
    }

    const sessionDirectLogBtn = document.getElementById('sessionDirectLogBtn');
    if (sessionDirectLogBtn) {
      sessionDirectLogBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        resetPoopSessionUI();
        openLogDrawer(4);
      });
    }

    const openToiletBtn = document.getElementById('openToiletBtn');
    if (openToiletBtn) {
      openToiletBtn.addEventListener('click', () => {
        FeltAudio.toyBounce();
        openToiletSheet('rank');
      });
    }

    const sessionToiletChip = document.getElementById('sessionToiletChip');
    if (sessionToiletChip) {
      sessionToiletChip.addEventListener('click', () => {
        FeltAudio.softTap();
        openToiletSheet('rank');
      });
    }

    const logOpenToiletBtn = document.getElementById('logOpenToiletBtn');
    if (logOpenToiletBtn) {
      logOpenToiletBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        openToiletSheet('add');
      });
    }

    const toiletTabRankBtn = document.getElementById('toiletTabRankBtn');
    if (toiletTabRankBtn) {
      toiletTabRankBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        switchToiletTab('rank');
      });
    }

    const toiletTabAddBtn = document.getElementById('toiletTabAddBtn');
    if (toiletTabAddBtn) {
      toiletTabAddBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        switchToiletTab('add');
      });
    }

    const toiletQuickAddFooterBtn = document.getElementById('toiletQuickAddFooterBtn');
    if (toiletQuickAddFooterBtn) {
      toiletQuickAddFooterBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        switchToiletTab('add');
      });
    }

    const toiletForm = document.getElementById('toiletCheckinForm');
    if (toiletForm) {
      toiletForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('toiletNameInput');
        const areaInput = document.getElementById('toiletAreaInput');
        const noteInput = document.getElementById('toiletNoteInput');
        const name = nameInput ? nameInput.value.trim() : '';
        if (!name) return;
        ensureToilets();
        const newSpot = {
          id: `spot-${Date.now()}`,
          name,
          area: areaInput ? areaInput.value.trim() || '自定义打卡点' : '自定义打卡点',
          air: toiletDraft.air,
          clean: toiletDraft.clean,
          tags: [...toiletDraft.tags],
          note: noteInput ? noteInput.value.trim() || '实地打卡收录' : '实地打卡收录',
          visits: 1
        };
        state.toilets.unshift(newSpot);
        state.selectedToiletId = newSpot.id;
        saveState();
        if (nameInput) nameInput.value = '';
        if (areaInput) areaInput.value = '';
        if (noteInput) noteInput.value = '';
        FeltAudio.stampPublish();
        syncSessionToiletBadge();
        switchToiletTab('rank');
        showStampFeedback(`已收录「${name}」进入必拉榜！`);
      });
    }

    const cutsceneSkipBtn = document.getElementById('cutsceneSkipBtn');
    if (cutsceneSkipBtn) {
      cutsceneSkipBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        stopFeltCutscene(true);
      });
    }

    const replayCutsceneBtn = document.getElementById('replayCutsceneBtn');
    if (replayCutsceneBtn) {
      replayCutsceneBtn.addEventListener('click', () => {
        const entry = settlementPreviewEntry || state.logs[0];
        closeAllSheets();
        playFeltArchiveCutscene(entry, () => {
          openSettlement('single', { keepPreview: Boolean(settlementPreviewEntry) });
        });
      });
    }

    if (el.openPkBtn) {
      el.openPkBtn.addEventListener('click', () => {
        FeltAudio.toyBounce();
        openPkSheet();
      });
    }

    el.openInsightsBtn.addEventListener('click', () => {
      FeltAudio.softTap();
      renderInsightsSheet();
      openSheet('insights');
    });

    if (el.openShareDailyBtn) {
      el.openShareDailyBtn.addEventListener('click', () => {
        FeltAudio.toyBounce();
        openSettlement('single', { playMoodSound: false });
      });
    }

    el.openRedFlagDemoBtn.addEventListener('click', () => {
      enterRedFlagMode('blood', false);
    });

    el.careOpenReportBtn.addEventListener('click', () => {
      FeltAudio.softTap();
      renderDoctorReport();
      openSheet('doctor');
    });

    el.careExitBtn.addEventListener('click', exitRedFlagMode);

    el.sheetScrim.addEventListener('click', () => {
      FeltAudio.softTap();
      closeAllSheets();
    });

    document.querySelectorAll('[data-close-sheet]').forEach((btn) => {
      btn.addEventListener('click', () => {
        FeltAudio.softTap();
        closeAllSheets();
      });
    });

    if (el.bristolPrevBtn) {
      el.bristolPrevBtn.addEventListener('click', () => {
        const prev = draft.bristol <= 1 ? 7 : draft.bristol - 1;
        selectBristolType(prev, true);
      });
    }

    if (el.bristolNextBtn) {
      el.bristolNextBtn.addEventListener('click', () => {
        const next = draft.bristol >= 7 ? 1 : draft.bristol + 1;
        selectBristolType(next, true);
      });
    }

    if (el.bristolRail) {
      el.bristolRail.addEventListener(
        'wheel',
        (evt) => {
          if (Math.abs(evt.deltaY) > Math.abs(evt.deltaX)) {
            el.bristolRail.scrollLeft += evt.deltaY;
            evt.preventDefault();
          }
        },
        { passive: false }
      );
    }

    el.cycleDurationBtn.addEventListener('click', () => {
      FeltAudio.softTap();
      draft.durationPresetIdx = (draft.durationPresetIdx + 1) % DURATION_PRESETS.length;
      draft.durationSec = DURATION_PRESETS[draft.durationPresetIdx];
      el.logDurationLabel.textContent = formatDurationCN(draft.durationSec);
      renderDraftDetective();
    });

    el.publishLogBtn.addEventListener('click', publishCurrentDraft);

    el.easterEggToggleBtn.addEventListener('click', () => {
      FeltAudio.softTap();
      const willOpen = el.easterEggBody.hidden;
      el.easterEggBody.hidden = !willOpen;
      el.easterEggToggleBtn.setAttribute('aria-expanded', String(willOpen));
      el.easterEggChevron.textContent = willOpen ? '收起' : '展开';
    });

    if (el.insightsToPkBtn) {
      el.insightsToPkBtn.addEventListener('click', () => {
        FeltAudio.toyBounce();
        openPkSheet();
      });
    }

    if (el.insightsToPostcardBtn) {
      el.insightsToPostcardBtn.addEventListener('click', () => {
        FeltAudio.toyBounce();
        openShareHub('monthly');
      });
    }

    el.insightsToDoctorBtn.addEventListener('click', () => {
      FeltAudio.softTap();
      renderDoctorReport();
      openSheet('doctor');
    });

    el.insightsToLogBtn.addEventListener('click', () => {
      FeltAudio.softTap();
      openLogDrawer(4);
    });

    el.printReportBtn.addEventListener('click', () => {
      FeltAudio.softTap();
      window.print();
    });

    el.doctorBackBtn.addEventListener('click', () => {
      FeltAudio.softTap();
      closeAllSheets();
    });

    el.faceIdToggleBtn.addEventListener('click', () => {
      state.settings.faceIdEnabled = !state.settings.faceIdEnabled;
      saveState();
      FeltAudio.softTap();
      renderPrivacySheet();
    });

    el.resetDemoDataBtn.addEventListener('click', resetDemoData);

    // Feature 2: PK Banter & Share Actions
    if (el.pkSendTissueBtn) {
      el.pkSendTissueBtn.addEventListener('click', () => {
        const r = getActiveRival();
        pkBanterCount += 1;
        renderPkSheet();
        FeltAudio.toyBounce();
        showStampFeedback(`已隔空递给${r.shortName}一张加厚毛毡纸巾！`, getToy(r.bristol).img);
      });
    }

    if (el.pkSendWaterBtn) {
      el.pkSendWaterBtn.addEventListener('click', () => {
        const r = getActiveRival();
        pkBanterCount += 1;
        renderPkSheet();
        FeltAudio.stampPublish();
        showStampFeedback(`已向${r.shortName}投喂 45°C 温水一杯，友谊 +10！`, getToy(4).img);
      });
    }

    if (el.pkCopyInviteBtn) {
      el.pkCopyInviteBtn.addEventListener('click', () => {
        const rand = 100 + Math.floor(Math.random() * 899);
        pkInviteCode = `PUTONG-PK-${rand}`;
        renderPkSheet();
        FeltAudio.softTap();
        const inviteMsg = `来「噗通剧场」毛毡擂台 PK 肠道健康分！不晒隐私只比团子，邀请口令：${pkInviteCode}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(inviteMsg)
            .then(() => showStampFeedback(`邀请口令 ${pkInviteCode} 已复制！`))
            .catch(() => showStampFeedback(`已生成邀请口令：${pkInviteCode}`));
        } else {
          showStampFeedback(`已生成邀请口令：${pkInviteCode}`);
        }
      });
    }

    if (el.pkToShareBtn) {
      el.pkToShareBtn.addEventListener('click', () => {
        FeltAudio.toyBounce();
        openShareHub('pk');
      });
    }

    // Feature 3: 4-Tab Settlement & PK Share Hub Controls
    document.querySelectorAll('[data-share-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeShareTab = btn.dataset.shareTab;
        directorActiveHint = '';
        FeltAudio.softTap();
        renderShareHub(true);
      });
    });

    if (el.toggleStageMotionBtn) {
      el.toggleStageMotionBtn.addEventListener('click', () => {
        stageStaticMode = !stageStaticMode;
        FeltAudio.softTap();
        syncMotionButtonUI();
      });
    }

    if (el.includePkRibbonToggle) {
      el.includePkRibbonToggle.addEventListener('click', () => {
        includePkRibbon = !includePkRibbon;
        FeltAudio.softTap();
        renderShareHub(false);
      });
    }

    if (el.singleCareOpenDoctorBtn) {
      el.singleCareOpenDoctorBtn.addEventListener('click', () => {
        FeltAudio.softTap();
        renderDoctorReport();
        openSheet('doctor');
      });
    }

    if (el.savePostcardImgBtn) {
      el.savePostcardImgBtn.addEventListener('click', exportShareCardPng);
    }
    if (el.copyPostcardTextBtn) {
      el.copyPostcardTextBtn.addEventListener('click', copyShareCaption);
    }

    // Desktop-Only Director Quick Demo Rail bindings (11 Instant Preview Buttons)
    if (el.directorRail) {
      el.directorRail.querySelectorAll('[data-demo-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.demoAction;
          if (action === 'home') {
            FeltAudio.softTap();
            window.__poopApp.showHome();
          } else if (action === 'log') {
            FeltAudio.softTap();
            window.__poopApp.openLogDrawer(4);
          } else if (action === 'settle_gold') {
            openSettlement('single', { previewBristol: 4, playMoodSound: true, directorHint: 'settle_gold' });
          } else if (action === 'settle_desert') {
            openSettlement('single', { previewBristol: 1, playMoodSound: true, directorHint: 'settle_desert' });
          } else if (action === 'settle_storm') {
            openSettlement('single', { previewBristol: 6, playMoodSound: true, directorHint: 'settle_storm' });
          } else if (action === 'settle_weekly') {
            FeltAudio.toyBounce();
            openSettlement('weekly', { directorHint: 'settle_weekly' });
          } else if (action === 'settle_monthly') {
            FeltAudio.toyBounce();
            openSettlement('monthly', { directorHint: 'settle_monthly' });
          } else if (action === 'pk') {
            FeltAudio.toyBounce();
            window.__poopApp.openPkSheet();
          } else if (action === 'eightmin') {
            window.__poopApp.triggerEightMinAlert();
          } else if (action === 'redflag') {
            enterRedFlagMode('black', false);
          } else if (action === 'reset') {
            resetDemoData();
          }
        });
      });
    }

    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' && activeSheet) {
        closeAllSheets();
      }
    });
  }

  // =========================================================================
  // Automation & QA Hooks (`window.__poopApp`)
  // =========================================================================
  window.__poopApp = {
    showHome() {
      closeAllSheets();
      hideEightMinToast();
      settlementPreviewEntry = null;
      directorActiveHint = '';
      currentMode = 'theater';
      renderHomeStage(false);
      return { mode: currentMode, episode: state.episode };
    },
    openLogDrawer(preselectBristol = 4) {
      currentMode = 'theater';
      renderHomeStage(false);
      openLogDrawer(preselectBristol);
      return { sheet: activeSheet, bristol: draft.bristol };
    },
    triggerRedFlagDemo(reason = 'black') {
      enterRedFlagMode(reason, true);
      return { mode: currentMode, reason: activeRedFlagReason };
    },
    openInsights() {
      renderInsightsSheet();
      openSheet('insights');
      return { sheet: activeSheet, logsCount: state.logs.length };
    },
    openDoctorReport() {
      renderDoctorReport();
      openSheet('doctor');
      return { sheet: activeSheet, logsCount: state.logs.length };
    },
    openPrivacySheet() {
      renderPrivacySheet();
      openSheet('privacy');
      return { sheet: activeSheet, camouflage: state.settings.camouflage };
    },
    openPkSheet(rivalId) {
      openPkSheet(rivalId);
      const pk = computePkMatchSummary();
      return { sheet: activeSheet, myScore: pk.myScoreObj.total, rivalScore: pk.rival.score };
    },
    openSettlement(tab = 'single', opts = {}) {
      openSettlement(tab, opts);
      return { sheet: activeSheet, tab: activeShareTab, includePkRibbon, stageStaticMode };
    },
    openShareHub(tab = 'single') {
      openShareHub(tab);
      return { sheet: activeSheet, tab: activeShareTab };
    },
    openPostcardSheet() {
      openPostcardSheet();
      return { sheet: activeSheet, tab: activeShareTab, summary: computePostcardSummary().award };
    },
    exportShareCardPng() {
      exportShareCardPng();
      return { tab: activeShareTab };
    },
    getSettlementMoodTheme(type, isRedFlag = false) {
      return getSettlementMoodTheme(type, isRedFlag);
    },
    triggerEightMinAlert() {
      triggerEightMinAlert();
      return { toastVisible: !el.eightMinToast.hidden, timer: formatMMSS(timer.seconds) };
    },
    resetDemoData() {
      resetDemoData();
      return { mode: currentMode, episode: state.episode, logsCount: state.logs.length };
    },
    inferLikelyDiet(entry) {
      return inferLikelyDiet(entry || state.logs[0], state.logs);
    },
    startPoopSession() {
      startPoopSession();
      return { sessionActive, timerRunning: timer.running };
    },
    finishPoopSession() {
      finishPoopSession();
      return { sheet: activeSheet };
    },
    openToiletSheet(tab = 'rank') {
      openToiletSheet(tab);
      return { sheet: activeSheet, count: state.toilets.length };
    },
    playCutscenePreview(bristol = 4) {
      const sample = makePreviewEntry(bristol);
      closeAllSheets();
      playFeltArchiveCutscene(sample, null);
      return { persona: getCutscenePersona(sample).persona };
    }
  };

  // =========================================================================
  // V8: Access Gate (`Tiger`) & Hover/Tap Progressive Disclosure
  // =========================================================================
  const GATE_SESSION_KEY = 'bb_diary_gate_unlocked_v8';
  const GATE_EXPECTED_HASH = 0x95d40b46;

  function fnv1aHash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function initAccessGate() {
    const overlay = document.getElementById('accessGateOverlay');
    const form = document.getElementById('accessGateForm');
    const input = document.getElementById('gatePasswordInput');
    const errEl = document.getElementById('gateErrorText');
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
    }, 120);

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
        }, 280);
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

  function initZenDisclosures() {
    // 1. Home Whisper Quote Disclosure (tap on mobile + hover on desktop)
    const wrap = document.getElementById('homeQuoteDisclosure');
    const toggle = document.getElementById('homeQuoteToggleBtn');
    if (wrap && toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        FeltAudio.softTap();
        const willOpen = !wrap.classList.contains('is-open');
        wrap.classList.toggle('is-open', willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));
      });
      document.addEventListener('click', (e) => {
        if (wrap.classList.contains('is-open') && !e.target.closest('#homeQuoteDisclosure')) {
          wrap.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // 2. Smooth hover-to-open on desktop pointers for .v8-hover-fold <details>
    if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('details.v8-hover-fold').forEach((det) => {
        let closeTimer = null;
        det.addEventListener('mouseenter', () => {
          if (closeTimer) clearTimeout(closeTimer);
          det.open = true;
        });
        det.addEventListener('mouseleave', () => {
          closeTimer = setTimeout(() => {
            det.open = false;
          }, 180);
        });
      });
    }
  }

  // =========================================================================
  // Bootstrap
  // =========================================================================
  ensureToilets();
  bindStageParallax();
  bindEvents();
  initZenDisclosures();
  syncHomeSessionView();
  updateTimerUI();
  renderHomeStage(false);
  initAccessGate();
})();

// _lib.js — 风格库：三种中式传统风格（水墨、皮影、剪纸）的渲染参数。
//
// 用法：
//   在 scene 文件顶部选择风格：
//     const STYLE = STYLES['ink-wash'];    // 或 'shadow-puppet' 或 'papercut'
//   然后使用 STYLE.pal、STYLE.motion、STYLE.camera 等。
//
// 每种风格定义：
//   pal        — 调色板（十六进制颜色）
//   motion     — 运动参数（步进帧率、沸腾强度、缓动类型）
//   camera     — 运镜语法（允许的运镜列表）
//   rendering  — 渲染参数（笔触模型、纹理、光照）
//   sound      — 声音调色板关键词（供 agent 参考）
//   transitions — 允许的转场类型
//
// 参考：lemo-opuscar/lemo-opuscar 的 STYLE.md 格式

const STYLES = {};

// ─────────────────────────────────────────────────────────────────────────────
// 水墨 · Ink Wash
// ─────────────────────────────────────────────────────────────────────────────
STYLES['ink-wash'] = {
  name: '水墨 · Ink Wash',
  essence: '写意水墨在宣纸上展开动画：留白即空间，一笔即山、即浪、即手势。',

  pal: {
    // 宣纸底色
    paper: '#F2ECDE',
    // 墨分五色
    ink_jiao:  '#1A1418',   // 焦 — 最深，书法、苔点
    ink_nong:  '#2D242A',   // 浓 — 轮廓、浓边
    ink_zhong: '#4A3F44',   // 重 — 副线、褶皱
    ink_dan:   '#7A6E72',   // 淡 — 山体、衣袍
    ink_qing:  '#B0A6A9',   // 清 — 远山、雾
    // 唯一红
    vermilion: '#B02E22',   // 朱砂印 + 最多一个小物件
    // 辅助（极少量）
    cream: '#FFF5E2',
  },

  motion: {
    fps: 12,              // 人物以 12 fps 步进 (on twos)
    boil_strength: 0.6,   // 沸腾强度（比默认稍低，墨线更稳）
    easing: 'ease',       // 默认缓动
    principle: 'painted_in',   // 画出来，不是补间
    still_before_action: true, // 动前静
  },

  rendering: {
    brush_model: 'loaded_stroke',  // 浓淡笔：一侧更深
    bristle_count: [4, 60],        // 笔毫数量范围
    wet_layer: {                   // 湿层
      bleed: 0.3,                  // paint() bleed 参数
      blur: 'noisy',               // 噪声模糊
      edge_pigment: true,          // 边缘色素堆积
      granulation: true,
    },
    dry_layer: {                   // 干层
      fibre_jitter: true,
      paper_tooth: true,
    },
    paper_texture: {
      mottle: true,
      fibres: true,
      pulp_flecks: true,
      grain_fade_on_zoom: true,
      vignette: 0.08,
    },
    paper: '#F2ECDE',
    ink: '#2D242A',      // 默认墨色（浓）
    mass_model: 'soft_polygon',  // 团块：柔边多边形 + 渐变
    figure_model: 'xieyi',       // 人物：写意（一体块 + 两笔 + 焦墨线）
    max_figure_strokes: 5,       // 五官最多 5 笔
  },

  camera: {
    // 运镜词汇表
    vocabulary: [
      { move: 'locked_frame',        expr: '纸即舞台',         serves: '成形、读字、决定' },
      { move: 'pan_right_to_left',   expr: '手卷：时间即一幅画', serves: '旅程、历史、过程' },
      { move: 'vertical_tilt',       expr: '挂轴：高度层叠',    serves: '四季、攀登、世代' },
      { move: 'lateral_track',       expr: '在世界中运动',      serves: '旅行、追逐' },
      { move: 'high_wide',           expr: '渺小孤独',          serves: '寂寞、自然尺度' },
      { move: 'low_push_in',         expr: '重量威胁',          serves: '障碍、风暴' },
      { move: 'hard_cut_extreme_cu', expr: '流动中断裂',        serves: '决定、冲击（唯一硬切）' },
      { move: 'push_into_bloom',     expr: '穿过状态',          serves: '记忆、梦、季节转换' },
      { move: 'pull_back_to_whole',  expr: '局部在整体中',      serves: '总结、尺度反讽' },
    ],
    empty_paper_ratio: [0.6, 0.8],  // 60-80% 留白
    allowed_transitions: ['ink_bloom', 'scroll_pan', 'mist', 'push_into_bloom'],
    forbidden_transitions: ['dissolve', 'wipe', 'crossfade'],
  },

  transitions: {
    ink_bloom: {
      desc: '墨晕转场：下一场景在一个扩散的墨滴中生长',
      how: '径向遮罩从中心扩散，边缘有暗色潮线（噪声扰动）',
      duration_beats: 2,
    },
    scroll_pan: {
      desc: '手卷平移：画面从右向左平移过渡',
      how: 'camera.x 线性偏移，新场景从右侧画入',
      duration_beats: 3,
    },
    mist: {
      desc: '雾转场：一切溶入留白再从留白中浮现',
      how: '全局 opacity 降到纸色再升起',
      duration_beats: 2,
    },
  },

  sound: {
    primary: 'guqin',
    instruments: ['guqin', 'xiao', 'big_drum', 'frame_drum', 'small_gong'],
    scale: 'pentatonic_chinese',
    silence: 'literal',  // 整条总线归零
    foley_material: 'ink_and_brush',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 皮影 · Shadow Puppetry
// ─────────────────────────────────────────────────────────────────────────────
STYLES['shadow-puppet'] = {
  name: '皮影 · Shadow Puppetry',
  essence: '半透明染色皮偶，雕如蕾丝，压在棉布幕上，油灯从背后照亮。',

  pal: {
    // 布幕
    cloth: '#F0E8D8',
    // 原皮色（中性）
    raw_hide: '#D4B896',
    // 墨（轮廓、发、靴）
    ink: '#2B1F1A',
    // 染料组（示例：宫廷）
    vermilion: '#C83232',
    ochre: '#D4A030',
    malachite: '#3A8C5C',
    indigo: '#2C3E6E',
    jade: '#4A9C7E',
    // 灯光
    lamp_warm: '#FFD090',
    lamp_hot: '#FFF0D0',
    // 框架
    lacquer: '#3A1810',
  },

  motion: {
    fps: 24,              // 偶和镜头 24 fps 连续
    effect_fps: 12,       // 特效件（火、水）12 fps
    hand_tremor: {        // 手颤
      amplitude_px: 3,
      angular: 0.02,
      frequency_hz: 1.5,
    },
    easing: 'hard_pose',  // 硬姿态 + 微小缓动
    principle: 'jointed_puppet',
    sympathetic_parts: 'pendulum_sim',  // 腿、翎子、流苏是阻尼摆
    opera_phrase: 'shuffle_run → hop → crouch → freeze_pose(~1s) → head_turn',
  },

  rendering: {
    model: 'transmission',  // 透射渲染
    // image = tonemap(lampLight × hideTransmission × clothTexture)
    hide_texture: {
      mottle: true,
      fibres: true,
      specks: true,
    },
    carving_density: {
      // 留细条、挖掉大部分面积
      crescent_rows: true,    // 月牙行
      diamond_lattice: true,  // 菱形格
      coin_holes: true,       // 铜钱孔
      cloud_collars: true,    // 云领
      tapered_slits: true,    // 锥形缝
      strata: true,           // 分层
      leaf_holes: true,       // 叶孔
    },
    carved_outline_px: [1.5, 2.4],
    figure: {
      pieces: [8, 12],
      head_scale: 1.2,
      joint_rivet: 'dark_ring_pale_knot',
      arm_model: '2_bone_ik',
      face_model: 'open_cut',   // 正面人物镂空面部
      antagonist_face: 'solid', // 反面人物实心
    },
    cloth_texture: {
      weave: 'sin_x_sin_noise_warped',
      fibre_speckle: true,
      density_blotches: true,
      dark_edges: true,
    },
    lamp: {
      lobe_ratio: 6,       // 宽瓣 : 紧热点
      flicker_hz: 7,
      flicker_pct: 0.03,
      color: '#FFD090',
    },
    tonemap: '1_minus_exp_neg_hdr',
    post: {
      warm_bloom: true,
      warm_vignette: true,   // 偏棕不偏灰
      saturation: 1.05,
      s_curve: 'soft',
      grain: 0.02,
    },
  },

  camera: {
    vocabulary: [
      { move: 'audience_seat',     expr: '"这是表演"',      serves: '传说、教训' },
      { move: 'push_through_frame', expr: '进入故事',        serves: '故事中的故事' },
      { move: 'lateral_pan_wide',   expr: '广度展开',        serves: '旅程、行列' },
      { move: 'follow_puppet_zoom', expr: '与角色同在',      serves: '追逐' },
      { move: 'crash_zoom',         expr: '鼓变成镜头',      serves: '入场、定格' },
      { move: 'whip_pan',           expr: '因到果',          serves: '消息、一击' },
      { move: 'locked_wide',        expr: '每步都被看见',    serves: '计数、重复' },
      { move: 'medium_close_empty', expr: '距离犹豫',        serves: '选择、离别' },
      { move: 'close_carved',       expr: '工艺即意义',      serves: '誓言、工具' },
      { move: 'tilt_ground_to_top', expr: '高度等级',        serves: '塔、天地' },
      { move: 'truck_to_back',      expr: '戏法被揭穿',      serves: '幕后' },
      { move: 'pull_back_to_room',  expr: '故事变成物件',    serves: '余波' },
    ],
    allowed_transitions: ['lamp_dim', 'pillar_wipe', 'lift_off_light', 'flash_warm_white'],
    forbidden_transitions: ['crossfade', 'digital_wipe', 'dissolve'],
  },

  transitions: {
    lamp_dim: {
      desc: '灯熄灭：画面从一侧变暗',
      how: '全局曝光从一侧渐变到 0',
      duration_beats: 2,
    },
    pillar_wipe: {
      desc: '模糊前景柱擦：一根框架柱横过画面',
      how: '模糊的暗色竖条从一侧扫到另一侧',
      duration_beats: 1,
    },
    lift_off_light: {
      desc: '一件在光中提起',
      how: '部件变大、模糊、淡出',
      duration_beats: 2,
    },
    flash_warm_white: {
      desc: '闪到暖白',
      how: '全局 flash 到 lamp_warm 色',
      duration_beats: 0.5,
    },
  },

  sound: {
    primary: 'percussion_first',  // 锣鼓优先
    instruments: [
      'barrel_drum', 'clapper_drum', 'cymbals', 'small_gong_rising',
      'big_gong_falling', 'bamboo_clapper', 'pellet_drum', 'sanxian', 'bamboo_flute'
    ],
    bowed: ['erhu_like_huan_yin', 'erhu_like_ku_yin', 'suona_like_reed'],
    scale: 'pentatonic_chinese',
    silence: 'hard_cut',
    foley_material: 'leather_cloth_wood',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 剪纸 · Red Paper-cut
// ─────────────────────────────────────────────────────────────────────────────
STYLES['papercut'] = {
  name: '剪纸 · Red Paper-cut',
  essence: '中国窗花剪纸动起来：铰接红色裁切件在纸底上，剪刀痕即绘画、镂空即透光之处。',

  pal: {
    // 中国红（主角材质）
    china_red: '#d2201f',
    china_red_range: ['#c8102e', '#d7261e'],
    // 红纸色阶（差一步）
    red_near: '#e03030',    // 近件一步亮
    red_far: '#b01818',     // 远件一步暗
    red_heavy: '#8a0e0e',   // 对手/重物一步深
    // 底族（白昼）
    paper_day: '#F5E6D0',
    paper_day_hills: '#F0D8C0',
    // 底族（夜间）
    paper_night_far: '#1A2440',
    paper_night_near: '#0F1830',
    // 其他底族
    paper_jade: '#2A5C4A',
    paper_black: '#1A1A1A',
    // 点缀
    gold_foil: '#C8A830',
    // 通用
    ink: '#2B1F1A',
    cream: '#FFF5E2',
  },

  motion: {
    fps: 12,              // 人物以 12 fps 步进
    camera_fps: 24,       // 镜头、光、天气 24 fps
    easing: 'hard_pose_tiny_ease',
    overshoot: '1_frame_pop_1.15x',
    weight_from: 'size_and_camera_shake',
    principle: 'jointed_cutout',
  },

  rendering: {
    paper_grain: {
      model: 'soft_light_neutral_grey',
      texture: 'dye_mottle_fibres_specks',
      alpha_restore: 'destination_in',  // 镂空保持镂空
    },
    cut_edge: {
      model: 'polyline_low_freq_wobble',
      light_rim: { side: 'upper_left', width: 1 },
      dark_rim: { side: 'lower_right', width: 1 },
      architecture: 'straight_segments_wobble_never_smooth',
    },
    paper_thickness: {
      shadow_per_piece: true,
      folded_layers_offset: [2, 6],
    },
    figure: {
      model: 'red_block_yin_lines',
      inset_contour: true,    // 内嵌轮廓（双轮廓）
      face_pieces: 'swappable',  // 可换脸片
      face_types: ['smile', 'surprise', 'fear', 'determined', 'asleep'],
    },
    folk_vocabulary: {
      sawtooth_rows: true,    // 锯齿行（毛、草、瓦、流苏）
      serrated_edges: true,
      crescents: true,        // 月牙（鳞片、绗缝）
      swirls: true,           // 旋涡（关节）
      clouds: true,
      rosettes: true,         // 团花
      plum: true,
      coin: true,
      tapered_slits: true,
    },
    no_floating_islands: true,  // 闭合环裁切会让中心掉落
    tuanhua: {
      // 团花：45° 楔形 × D4 镜像 8 次
      wedge_angle: 45,
      symmetry: 'D4',
      alternating_yang_yin: true,
      fold_crease_lines: true,
    },
    light: {
      day: 'paper_as_is',
      night: {
        lightmap: true,
        warm_pools: true,
        backlit_emissive: true,
        bloom_levels: 2,
        optional_rays: true,
      },
      projected_pattern: 'hole_mask_squashed_lighter',
    },
  },

  camera: {
    vocabulary: [
      { move: 'extreme_cu_scissor',   expr: '制作、关注手艺',    serves: '工作开始、精确行为' },
      { move: 'flat_front_locked',    expr: '剪影即徽章',        serves: '标题、宣言、全家福' },
      { move: 'slow_pan_parallax',    expr: '展开的世界',        serves: '村庄、路线、时间线' },
      { move: 'low_wide_stand_up',    expr: '尺度、威胁',        serves: '风暴、截止日' },
      { move: 'top_down_tabletop',    expr: '工艺即情节',        serves: '折叠、裁切、组装' },
      { move: 'push_lit_pull_many',   expr: '一个行为扩散',      serves: '影响力、网络亮起' },
      { move: 'page_turn_peel',       expr: '时间地方改变',      serves: '昼到夜、前后' },
      { move: 'pull_back_to_object',  expr: '影片是人做的东西',  serves: '记忆、礼物、传统' },
      { move: 'rotate_rosette',       expr: '秩序重复',          serves: '循环、团队' },
    ],
    depth_from: 'parallax_and_paper_tones',
    depth_not_from: 'perspective',
    allowed_transitions: ['fold', 'page_turn', 'peel', 'sheet_fly_off', 'cut_through_frame'],
    forbidden_transitions: ['dissolve', 'crossfade'],
  },

  transitions: {
    fold: {
      desc: '折叠：一张纸折起露出下一场景',
      how: '~16 条 cos 压缩 + 假透视，~0.5s 每折',
      duration_beats: 2,
    },
    page_turn: {
      desc: '翻页：一层纸被翻起',
      how: '旋转 + 阴影 + 背面色',
      duration_beats: 2,
    },
    peel: {
      desc: '剥纸：一层被揭起',
      how: '从一角卷起，露出下层',
      duration_beats: 1.5,
    },
    sheet_fly_off: {
      desc: '飞纸：一张纸飞出画面',
      how: '加速平移 + 旋转 + 缩小',
      duration_beats: 1,
    },
    cut_through_frame: {
      desc: '裁穿画面：剪刀裁穿整个画面',
      how: '沿剪刀路径揭示新场景',
      duration_beats: 2,
    },
  },

  sound: {
    primary: 'chinese_chamber',
    instruments: [
      'pipa', 'guzheng', 'erhu', 'dizi', 'sheng', 'yangqin',
      'woodblock', 'small_gong', 'big_gong', 'frame_drum'
    ],
    scale: 'pentatonic_chinese',
    foley_material: 'scissors_paper_cardboard',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 辅助函数：根据风格获取配置
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 获取当前风格的调色板（合并到全局 PAL）
 * @param {string} styleKey - 风格键名
 * @returns {object} 合并后的调色板
 */
function getStylePalette(styleKey) {
  const style = STYLES[styleKey];
  if (!style) return PAL;
  // 将风格的 pal 映射到 PAL 的键名
  const sp = style.pal;
  const mapped = {};
  // 通用映射
  mapped.paper = sp.paper || sp.cloth || sp.paper_day || PAL.paper;
  mapped.ink = sp.ink || PAL.ink;
  mapped.cream = sp.cream || PAL.cream;
  // 风格特有
  return { ...PAL, ...mapped, _style: sp };
}

/**
 * 获取风格的运动参数
 * @param {string} styleKey
 * @returns {object}
 */
function getStyleMotion(styleKey) {
  const style = STYLES[styleKey];
  if (!style) return { fps: 12, boil_strength: 1, easing: 'ease' };
  return style.motion;
}

/**
 * 获取风格的运镜词汇
 * @param {string} styleKey
 * @returns {Array}
 */
function getStyleCameraVocab(styleKey) {
  const style = STYLES[styleKey];
  if (!style) return [];
  return style.camera.vocabulary;
}

/**
 * 检查运镜是否在风格允许范围内
 * @param {string} styleKey
 * @param {string} moveName
 * @returns {boolean}
 */
function isAllowedCameraMove(styleKey, moveName) {
  const style = STYLES[styleKey];
  if (!style) return true;  // 未知风格不限制
  return style.camera.vocabulary.some(v => v.move === moveName);
}

/**
 * 检查转场是否在风格允许范围内
 * @param {string} styleKey
 * @param {string} transName
 * @returns {boolean}
 */
function isAllowedTransition(styleKey, transName) {
  const style = STYLES[styleKey];
  if (!style) return true;
  if (style.camera.forbidden_transitions.includes(transName)) return false;
  if (style.camera.allowed_transitions.includes(transName)) return true;
  return true;  // 未在列表中的不禁止
}

// 导出给全局使用（在 studio.html 中先于 scene 加载）
if (typeof window !== 'undefined') {
  window.STYLES = STYLES;
  window.getStylePalette = getStylePalette;
  window.getStyleMotion = getStyleMotion;
  window.getStyleCameraVocab = getStyleCameraVocab;
  window.isAllowedCameraMove = isAllowedCameraMove;
  window.isAllowedTransition = isAllowedTransition;
}

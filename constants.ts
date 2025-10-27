import { PromptData, ImageModel } from './types';
import { Type } from '@google/genai';

export interface Preset {
  name: string;
  data: Partial<PromptData>;
}

export const PRESETS: Preset[] = [
  {
    name: '魏斯安德森的對稱美學',
    data: {
      aspectRatio: '16:9',
      charPersonality: '古怪而迷人',
      charOutfit: '復古、精心搭配的服裝',
      charAction: '直挺挺地站著，表情嚴肅地看向鏡頭',
      sceneAtmosphere: '一絲不苟的、懷舊的',
      composition: '中央構圖 (Center Composition)',
      framing: '對稱平衡 (Symmetrical Balance)',
      lightQuality: '柔和 (Soft Light)',
      filmSimulation: '柯達經典負片 (Kodak Portra/Gold)',
      mainColor1: '粉蠟色',
      mainColor2: '復古黃',
      overallStyle: '魏斯安德森電影風格，充滿對稱美學與精心設計的場景',
      finalVibe: '一種古靈精怪、帶有黑色幽默的童話感',
    },
  },
  {
    name: '王家衛的霓虹光影',
    data: {
      aspectRatio: '16:9',
      activityTheme: '午夜的城市探索',
      charPersonality: '憂鬱、疏離、內心充滿渴望',
      charExpression: '迷離、若有所思',
      charAction: '倚靠在欄杆上，點燃一根香菸',
      sceneType: '擁擠的香港街頭或昏暗的酒吧',
      sceneObject1: '閃爍的霓虹燈招牌',
      sceneAtmosphere: '潮濕、煙霧繚繞',
      emotionalAtmosphere: '曖昧、孤獨、充滿宿命感',
      composition: '框架構圖 (Framing)',
      lightSource: '霓虹燈或昏暗的燈光',
      lightQuality: '高對比 / 硬光',
      lightAtmosphere: '充滿戲劇性的光影對比，帶有大面積的陰影',
      filmEffect: '電影感光暈 (Cinematic Halation)',
      filmSimulation: '富士電影感 (Fujifilm Eterna/Cinema)',
      mainColor1: '深綠色',
      mainColor2: '紅色或藍色',
      overallStyle: '王家衛電影風格，潮濕的霓虹光影與強烈的情感張力',
      finalVibe: '一種浪漫、詩意且令人心碎的氛圍',
    },
  },
  {
    name: '日系純愛電影',
    data: {
      aspectRatio: '16:9',
      activityTheme: '夏日午後的散步',
      charPersonality: '內向、溫柔、乾淨',
      charStyle: '清新、自然的風格',
      charExpression: '淺淺的微笑、害羞',
      charAction: '害羞地整理著自己的頭髮',
      sceneType: '陽光灑落的教室、海邊或安靜的住宅區街道',
      sceneAtmosphere: '空氣感、通透',
      emotionalAtmosphere: '平靜、溫暖、帶有淡淡的憂傷',
      composition: '負空間 (Negative Space) / 留白',
      lightQuality: '柔和 (Soft Light)',
      lightAtmosphere: '明亮、輕柔、略微過曝',
      filmEffect: '輕微膠片顆粒 (Subtle Film Grain)',
      filmSimulation: '日系清新電影感 (Japanese Cinema Style)',
      mainColor1: '白色',
      mainColor2: '淡藍色',
      accentColor: '柔和的綠色或米色',
      overallStyle: '日系純愛電影風格，充滿空氣感與乾淨的色調',
      finalVibe: '一種青春、純粹且美好的感覺',
    }
  },
  {
    name: '安妮萊柏維茲的戲劇人像',
    data: {
      aspectRatio: '3:4',
      charPersonality: '充滿自信、氣場強大',
      charStyle: '華麗、概念性的',
      charExpression: '堅定、富有表現力',
      charAction: '雙手叉腰，眼神直視鏡頭',
      composition: '填滿畫面 (Fill the Frame)',
      lightQuality: '倫勃朗光 (Rembrandt Lighting)',
      lightAtmosphere: '極富戲劇性、層次豐富',
      filmSimulation: '現代數位清晰感 (Modern Digital Clean)',
      overallStyle: '安妮·萊柏維茲風格的環境人像攝影',
      finalVibe: '史詩般、充滿故事性與力量感',
    },
  },
  {
    name: '賽博龐克街頭',
    data: {
      aspectRatio: '9:16',
      activityTheme: '雨夜的未來城市',
      charOutfit: '機能風、未來感的服裝與發光的配件',
      charAction: '在濕漉漉的街道上快步行走，一手拿著透明的發光雨傘',
      sceneType: '充滿全息廣告與霓虹燈的未來城市街道',
      sceneAtmosphere: '雨水、霧氣、科技感',
      groundElement: '濕潤且反光的柏油路，倒映著霓虹燈光',
      lightSource: '霓虹燈和全息廣告',
      lightQuality: '高對比 / 硬光',
      filmEffect: '變形鏡頭光暈 (Anamorphic Lens Flare)',
      filmSimulation: '柯達電影感 (Kodak Vision3/Cinema)',
      mainColor1: '賽博藍',
      mainColor2: '霓虹粉',
      overallStyle: '賽博龐克風格的街頭攝影',
      finalVibe: '一種反烏托邦、高科技、低生活質感的未來氛圍',
    }
  },
  {
    name: '森山大道：失焦的慾望街頭',
    data: {
      activityTheme: '漫無目的的城市遊蕩',
      charPersonality: '焦慮、疏離、充滿原始的生命力',
      charAction: '正在穿越繁忙的十字路口，身影模糊',
      composition: '主觀視角 (Point-of-View)',
      lightQuality: '高對比 / 硬光',
      filmEffect: '明顯膠片顆粒 (Noticeable Film Grain)',
      filmSimulation: '經典高對比黑白 (Classic B&W - Tri-X/HP5)',
      mainColor1: '黑色',
      mainColor2: '白色',
      texture: '粗糙、模糊、失焦',
      overallStyle: '森山大道風格的高對比、粗顆粒黑白街頭攝影',
      finalVibe: '一種粗獷、晃動、模糊但充滿力量的都市孤寂感',
    },
  },
  {
    name: '川島小鳥：純粹的未來ちゃん',
    data: {
      activityTheme: '與朋友的午後嬉戲',
      charPersonality: '天真、好奇、充滿活力',
      charExpression: '自然的、未經修飾的大笑或專注表情',
      charAction: '拿著冰棒，開心地向前奔跑',
      sceneType: '充滿生活感的日本鄉間或日常居家場景',
      lightQuality: '柔和 (Soft Light)',
      filmSimulation: '柯達經典負片 (Kodak Portra/Gold)',
      overallStyle: '川島小鳥風格的日常人像，捕捉純粹的情感與生活氣息',
      finalVibe: '溫暖、親密、充滿童趣與生命力',
    },
  },
  {
    name: '濱田英明：溫柔的詩意日常',
    data: {
      activityTheme: '平凡生活中的奇蹟瞬間',
      charPersonality: '純真、好奇、帶有透明感',
      charStyle: '簡約、舒適的日常服裝',
      charAction: '在窗邊吹著泡泡',
      sceneAtmosphere: '充滿空氣感、安靜、通透',
      emotionalAtmosphere: '溫暖、詩意、平靜',
      lightSource: '窗邊的自然光',
      lightQuality: '柔和 (Soft Light)',
      lightAtmosphere: '明亮、通透、帶有輕微過曝感',
      filmSimulation: '柯達經典負片 (Kodak Portra/Gold)',
      mainColor1: '淡藍色',
      mainColor2: '米白色',
      overallStyle: '濱田英明風格，充滿詩意與透明感的日系家庭攝影',
      finalVibe: '捕捉日常生活中溫柔而奇妙的瞬間，充滿愛與平靜',
    },
  },
  {
    name: '橫浪修：少女群像的冥想',
    data: {
      aspectRatio: '4:3',
      activityTheme: '少女們的集體儀式',
      charIdentity: '一群穿著同樣服裝的少女',
      charPersonality: '平靜、內斂、一致',
      charExpression: '表情一致、平靜、看向遠方',
      charAction: '手牽著手，排成一列，面向大海',
      sceneType: '開闊的自然場景，如海邊、草原或森林',
      composition: '中央構圖 (Center Composition)',
      framing: '對稱平衡 (Symmetrical Balance)',
      lightQuality: '柔和 (Soft Light)',
      filmSimulation: '日系清新電影感 (Japanese Cinema Style)',
      mainColor1: '天空藍',
      mainColor2: '白色',
      overallStyle: '橫浪修風格的群像攝影，強調對稱構圖與一致性',
      finalVibe: '一種寧靜、超現實且帶有冥想氛圍的集體肖像',
    },
  },
  {
    name: '理查德·艾維登：極簡靈魂肖像',
    data: {
      aspectRatio: '3:4',
      charExpression: '直視鏡頭，表情平靜但充滿張力',
      charAction: '身體微微前傾，雙手自然垂下',
      subjectPosition: '在畫面正中央',
      sceneType: '攝影棚',
      background: '純白或淺灰色無縫背景',
      composition: '填滿畫面 (Fill the Frame)',
      lightQuality: '高對比 / 硬光',
      filmSimulation: '經典高對比黑白 (Classic B&W - Tri-X/HP5)',
      overallStyle: '理查德·艾維登風格的極簡高對比黑白肖像攝影',
      finalVibe: '直視人物靈魂，充滿力量感與對人性的深刻洞察',
    },
  },
  {
    name: '哈里·格魯耶特：飽和的色彩街拍',
    data: {
      sceneType: '陽光強烈的海濱城市或街角',
      charAction: '一個路人正匆忙走過色彩鮮豔的牆壁',
      lightQuality: '高對比 / 硬光',
      lightAtmosphere: '強烈的陰影與飽和的光線交錯',
      filmSimulation: '富士經典正片 (Fujifilm Provia/Velvia)',
      mainColor1: '飽和的紅色或藍色',
      mainColor2: '強烈的黃色光線',
      overallStyle: '哈里·格魯耶特風格，利用複雜的光影與飽和色彩構建畫面',
      finalVibe: '在平凡的都市景觀中發現超現實的色彩與光影之美',
    },
  },
  {
    name: '薩爾加多：史詩勞動者肖像',
    data: {
      charIdentity: '勞動者、礦工或農夫',
      charPersonality: '堅毅、莊嚴、飽經風霜',
      charAction: '扛著工具，滿身塵土地望向鏡頭',
      lightQuality: '側光 / 明暗對照法 (Sidelight / Chiaroscuro)',
      filmSimulation: '經典高對比黑白 (Classic B&W - Tri-X/HP5)',
      texture: '皮膚與衣物的紋理細節極度清晰、厚重',
      overallStyle: '薩爾加多風格的史詩感黑白紀實肖像',
      finalVibe: '充滿對生命、勞動與人性尊嚴的敬意，畫面厚重且莊嚴',
    },
  },
  {
    name: '安塞爾·亞當斯：區域曝光下的壯麗',
    data: {
      aspectRatio: '4:3',
      activityTheme: '壯麗的自然風光',
      charAction: '無人物，純風景',
      sceneType: '美國優勝美地國家公園的山脈與河流',
      composition: '遠景 / 建立鏡頭 (Long / Establishing Shot)',
      framing: '黃金比例 (Golden Ratio)',
      lightQuality: '高對比 / 硬光',
      filmSimulation: '細膩顆粒黑白 (Fine-Grain B&W - Ilford/Delta)',
      overallStyle: '安塞爾·亞當斯風格的黑白風景攝影，注重光影層次與畫面細節',
      finalVibe: '展現大自然的莊嚴、宏偉與神聖感',
    },
  }
];

export const IMAGE_MODEL_OPTIONS: { value: ImageModel; label: string }[] = [
  { value: 'gemini-2.5-flash-image', label: 'Gemini Flash (快速生成)' },
  { value: 'imagen-4.0-generate-001', label: 'Imagen 4.0 (高品質)' },
];

export const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 (方形)' },
  { value: '3:4', label: '3:4 (人像)' },
  { value: '4:3', label: '4:3 (風景)' },
  { value: '16:9', label: '16:9 (寬螢幕)' },
  { value: '9:16', label: '9:16 (垂直)' },
];

export const COMPOSITION_OPTIONS = [
  { value: '特寫 (Close-up)', label: '特寫' },
  { value: '大特寫 (Extreme Close-up)', label: '大特寫' },
  { value: '中景 (Medium Shot)', label: '中景' },
  { value: '牛仔鏡頭 (Cowboy Shot)', label: '牛仔鏡頭 (中遠景)' },
  { value: '及膝鏡頭 (Knee Shot)', label: '及膝鏡頭' },
  { value: '全身照 (Full Body Shot)', label: '全身照' },
  { value: '遠景 / 建立鏡頭 (Long / Establishing Shot)', label: '遠景 / 建立鏡頭' },
  { value: '過肩鏡頭 (Over-the-Shoulder Shot)', label: '過肩鏡頭' },
  { value: '雙人鏡頭 (Two Shot)', label: '雙人鏡頭' },
];

export const ANGLE_OPTIONS = [
  { value: '眼平視角 (Eye-level)', label: '眼平視角' },
  { value: '俯視角 (High Angle)', label: '俯視角' },
  { value: '低角度 (Low Angle)', label: '低角度' },
  { value: '鳥瞰視角 (Bird\'s-Eye View)', label: '鳥瞰視角 (正上方)' },
  { value: '蟲視角 (Worm\'s-Eye View)', label: '蟲視角 (極低角度)' },
  { value: '主觀視角 (Point-of-View)', label: '主觀視角 (POV)' },
  { value: '荷蘭角 (Dutch Angle)', label: '荷蘭角' },
];

export const FRAMING_PRINCIPLES = [
  { value: '三分法 (Rule of Thirds)', label: '三分法' },
  { value: '中央構圖 (Center Composition)', label: '中央構圖' },
  { value: '對稱平衡 (Symmetrical Balance)', label: '對稱平衡' },
  { value: '黃金比例 (Golden Ratio)', label: '黃金比例' },
  { value: '引導線 (Leading Lines)', label: '引導線' },
  { value: '對角線構圖 (Diagonal Lines)', label: '對角線構圖' },
  { value: '框架構圖 (Framing)', label: '框架構圖' },
  { value: '填滿畫面 (Fill the Frame)', label: '填滿畫面' },
  { value: '負空間 (Negative Space)', label: '負空間 / 留白' },
  { value: '前景趣味 (Foreground Interest)', label: '前景趣味' },
];

export const LIGHT_QUALITIES = [
    { value: '柔和 (Soft Light)', label: '柔和光' },
    { value: '高對比 / 硬光', label: '高對比 / 硬光' },
    { value: '散射 (Diffused Light)', label: '散射光' },
    { value: '逆光 (Backlight)', label: '逆光' },
    { value: '剪影效果 (Silhouette)', label: '剪影效果' },
    { value: '倫勃朗光 (Rembrandt Lighting)', label: '林布蘭光' },
    { value: '側光 / 明暗對照法 (Sidelight / Chiaroscuro)', label: '側光 / 明暗對照法' },
    { value: '黃金時刻 (Golden Hour Light)', label: '黃金時刻 (魔幻光線)' },
    { value: '藍色時刻 (Blue Hour Light)', label: '藍色時刻 (暮光)' },
    { value: '體積光 / 電影光 (Volumetric / Cinematic Light)', label: '體積光 / 電影光' },
    { value: '斑駁光 (Dappled Light)', label: '斑駁光 (樹蔭光)' },
];

export const FILM_EFFECT_OPTIONS = [
    { value: '無特殊效果 (Clean)', label: '無特殊效果' },
    { value: '輕微膠片顆粒 (Subtle Film Grain)', label: '輕微膠片顆粒' },
    { value: '明顯膠片顆粒 (Noticeable Film Grain)', label: '明顯膠片顆粒' },
    { value: '鏡頭光暈 (Lens Flare)', label: '鏡頭光暈' },
    { value: '變形鏡頭光暈 (Anamorphic Lens Flare)', label: '變形鏡頭光暈' },
    { value: '電影感光暈 (Cinematic Halation)', label: '電影感光暈 (高光)' },
    { value: '輕微漏光 (Light Leaks)', label: '輕微漏光' },
    { value: '重度漏光與燒片 (Heavy Light Leaks & Film Burn)', label: '重度漏光與燒片' },
    { value: '柔焦效果 (Soft Focus/Bloom)', label: '柔焦/光暈效果' },
    { value: '暗角 (Vignetting)', label: '暗角' },
    { value: '色差 (Chromatic Aberration)', label: '色差 (紫邊/綠邊)' },
    { value: '跳漂白效果 (Bleach Bypass Effect)', label: '跳漂白效果 (高反差低飽和)' },
    { value: '正片負沖效果 (Cross-Processing Effect)', label: '正片負沖效果 (顏色偏移)' },
    { value: '灰塵與刮痕 (Dust & Scratches)', label: '灰塵與刮痕' },
];

export const FILM_SIMULATION_OPTIONS = [
    { value: '現代數位清晰感 (Modern Digital Clean)', label: '現代數位清晰感' },
    { value: '富士電影感 (Fujifilm Eterna/Cinema)', label: '富士電影感' },
    { value: '柯達電影感 (Kodak Vision3/Cinema)', label: '柯達電影感' },
    { value: '褪色電影感 (Bleached/Faded Cinema)', label: '褪色電影感' },
    { value: '好萊塢三色法電影 (Technicolor Style)', label: '好萊塢彩色電影' },
    { value: '富士經典正片 (Fujifilm Provia/Velvia)', label: '富士經典正片 (鮮豔)' },
    { value: '柯達經典負片 (Kodak Portra/Gold)', label: '柯達經典負片 (溫暖人像)' },
    { value: '愛克發正片 (Agfa Color Style)', label: '愛克發正片 (復古)' },
    { value: '日系清新電影感 (Japanese Cinema Style)', label: '日系清新電影感' },
    { value: '魏斯安德森風格 (Wes Anderson Aesthetic)', label: '魏斯安德森風格' },
    { value: 'Lomo 風格 (Lomography Style)', label: 'Lomo 隨拍風格' },
    { value: '寶麗來即時顯影 (Polaroid/Instant Film)', label: '寶麗來即時顯影' },
    { value: '經典高對比黑白 (Classic B&W - Tri-X/HP5)', label: '經典高對比黑白' },
    { value: '細膩顆粒黑白 (Fine-Grain B&W - Ilford/Delta)', label: '細膩顆粒黑白' },
];


export const INITIAL_PROMPT_DATA: PromptData = {
  aspectRatio: '3:4',
  activityNature: '慈善攝影專案',
  charityPurpose: '用於支持偏鄉兒童的藝術教育基金',
  activityTheme: '城市中的光影故事',
  charAge: '',
  charNationality: '',
  charIdentity: '',
  charPersonality: '',
  charFeature1: '',
  charFeature2: '',
  charFeature3: '',
  charOutfit: '',
  charStyle: '',
  charExpression: '',
  charAction: '',
  subjectPosition: '',
  sceneType: '',
  sceneObject1: '',
  sceneObject2: '',
  sceneAtmosphere: '',
  groundElement: '',
  backgroundDetail: '',
  emotionalAtmosphere: '',
  composition: '中景 (Medium Shot)',
  angle: '眼平視角 (Eye-level)',
  framing: '三分法 (Rule of Thirds)',
  lightSource: '',
  lightQuality: '柔和 (Soft Light)',
  lightAtmosphere: '',
  filmEffect: '無特殊效果 (Clean)',
  filmSimulation: '現代數位清晰感 (Modern Digital Clean)',
  overallStyle: '',
  mainColor1: '',
  mainColor2: '',
  accentColor: '',
  foreground: '',
  midground: '',
  background: '',
  texture: '',
  finalVibe: '',
  seriesName: '',
  modelTone: '',
  imageModel: 'gemini-2.5-flash-image',
};

export const PROMPT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    activityTheme: { type: Type.STRING },
    charAge: { type: Type.STRING },
    charNationality: { type: Type.STRING },
    charIdentity: { type: Type.STRING },
    charPersonality: { type: Type.STRING },
    charFeature1: { type: Type.STRING },
    charFeature2: { type: Type.STRING },
    charFeature3: { type: Type.STRING },
    charOutfit: { type: Type.STRING },
    charStyle: { type: Type.STRING },
    charExpression: { type: Type.STRING },
    charAction: { type: Type.STRING },
    subjectPosition: { type: Type.STRING },
    sceneType: { type: Type.STRING },
    sceneObject1: { type: Type.STRING },
    sceneObject2: { type: Type.STRING },
    sceneAtmosphere: { type: Type.STRING },
    groundElement: { type: Type.STRING },
    backgroundDetail: { type: Type.STRING },
    emotionalAtmosphere: { type: Type.STRING },
    composition: { type: Type.STRING },
    angle: { type: Type.STRING },
    framing: { type: Type.STRING },
    lightSource: { type: Type.STRING },
    lightQuality: { type: Type.STRING },
    lightAtmosphere: { type: Type.STRING },
    filmEffect: { type: Type.STRING },
    filmSimulation: { type: Type.STRING },
    overallStyle: { type: Type.STRING },
    mainColor1: { type: Type.STRING },
    mainColor2: { type: Type.STRING },
    accentColor: { type: Type.STRING },
    foreground: { type: Type.STRING },
    midground: { type: Type.STRING },
    background: { type: Type.STRING },
    texture: { type: Type.STRING },
    finalVibe: { type: Type.STRING },
  }
};

// --- Inspiration Constants for Randomizer ---
export const INSPIRATION_THEMES = ['城市中的孤寂', '夏日懷舊', '神秘的邂逅', '秋日漫步', '未來主義時尚'];
export const INSPIRATION_PERSONALITIES = ['內省而安靜', '大膽且自信', '夢幻而異想天開', '叛逆且前衛', '優雅而高貴'];
export const INSPIRATION_OUTFITS = ['復古風衣', '飄逸的夏日連衣裙', '帶有LED細節的賽博龐克夾克', '極簡主義亞麻西裝', '波西米亞風格的多層次穿搭'];
export const INSPIRATION_ACTIONS = ['凝視遠方', '輕輕撥弄頭髮', '依靠在牆上', '在街上行走', '喝著咖啡', '閱讀一本書', '雙手插在口袋裡', '回頭看'];
export const INSPIRATION_SCENES = ['雨後濕滑的城市街道', '陽光普照的草地', '古老而塵封的圖書館', '霓虹燈閃爍的小巷', '極簡主義的混凝土建築'];
export const INSPIRATION_ATMOSPHERES = ['懷舊且憂鬱', '平靜而安詳', '緊張且富戲劇性', '快樂而無憂無慮', '神秘且耐人尋味'];
export const INSPIRATION_STYLES = ['電影感的黑色電影風格', '柔焦的夢幻流行美學', '粗獷的街頭攝影', '高級時尚雜誌大片', '日式極簡主義'];
export const INSPIRATION_COLORS_PRIMARY = ['深藍色', '翡翠綠', '焦橙色', '粉彩色', '黑白色'];
export const INSPIRATION_COLORS_SECONDARY = ['金色', '銀色', '霓虹洋紅色', '奶油白', '炭灰色'];

export const FULL_FIELD_TO_GROUP_MAP: Record<keyof PromptData, string> = {
  // Project
  aspectRatio: '專案資訊', activityNature: '專案資訊', charityPurpose: '專案資訊', activityTheme: '專案資訊',
  // Character
  charAge: '模特兒與角色', charNationality: '模特兒與角色', charIdentity: '模特兒與角色', charPersonality: '模特兒與角色', charFeature1: '模特兒與角色', charFeature2: '模特兒與角色', charFeature3: '模特兒與角色', charOutfit: '模特兒與角色', charStyle: '模特兒與角色', charExpression: '模特兒與角色', charAction: '模特兒與角色',
  // Scene
  subjectPosition: '場景與環境', sceneType: '場景與環境', sceneObject1: '場景與環境', sceneObject2: '場景與環境', sceneAtmosphere: '場景與環境', groundElement: '場景與環境', backgroundDetail: '場景與環境', emotionalAtmosphere: '場景與環境',
  // Technique
  composition: '攝影與構圖', angle: '攝影與構圖', framing: '攝影與構圖',
  // Lighting
  lightSource: '光線與膠片風格', lightQuality: '光線與膠片風格', lightAtmosphere: '光線與膠片風格', filmEffect: '光線與膠片風格', filmSimulation: '光線與膠片風格',
  // Style
  overallStyle: '色彩與風格', mainColor1: '色彩與風格', mainColor2: '色彩與風格', accentColor: '色彩與風格',
  // Layers
  foreground: '場景層次與材質', midground: '場景層次與材質', background: '場景層次與材質',
  // Details
  texture: '場景層次與材質',
  finalVibe: '最終調整',
  // Hints
  seriesName: '最終調整', modelTone: '最終調整',
  // Generation
  imageModel: '最終調整',
};
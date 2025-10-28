
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { PromptData, ConversationItem, PromptSection, SavedRecipes, ImageModel } from './types';
import {
  ASPECT_RATIOS,
  COMPOSITION_OPTIONS,
  ANGLE_OPTIONS,
  FRAMING_PRINCIPLES,
  LIGHT_QUALITIES,
  INITIAL_PROMPT_DATA,
  PROMPT_SCHEMA,
  FILM_EFFECT_OPTIONS,
  FILM_SIMULATION_OPTIONS,
  PRESETS,
  INSPIRATION_THEMES,
  INSPIRATION_PERSONALITIES,
  INSPIRATION_OUTFITS,
  INSPIRATION_SCENES,
  INSPIRATION_ATMOSPHERES,
  INSPIRATION_STYLES,
  INSPIRATION_COLORS_PRIMARY,
  INSPIRATION_COLORS_SECONDARY,
  INSPIRATION_ACTIONS,
  FULL_FIELD_TO_GROUP_MAP,
  IMAGE_MODEL_OPTIONS
} from './constants';
import InputGroup from './components/InputGroup';
import TextInput from './components/TextInput';
import SelectInput from './components/SelectInput';
import OutputPanel from './components/OutputPanel';
import ViewSwitcher from './components/ViewSwitcher';
import ImageUploader from './components/ImageUploader';
import GenerationView from './components/GenerationView';

const LOCAL_STORAGE_KEY = 'photographyArchitectRecipes';

const App: React.FC = () => {
  const [promptData, setPromptData] = useState<PromptData>(INITIAL_PROMPT_DATA);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [manualPromptOverride, setManualPromptOverride] = useState<string>(''); // New state for manual override
  const [promptSections, setPromptSections] = useState<PromptSection[]>([]);
  const [view, setView] = useState<'manual' | 'image' | 'generation'>('image');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [currentDisplayImageUrl, setCurrentDisplayImageUrl] = useState<string | null>(null); // New state
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [lockedGroups, setLockedGroups] = useState<Set<string>>(new Set());
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipes>({});
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');

  const groupRefs = {
    '專案資訊': useRef<HTMLDivElement>(null),
    '模特兒與角色': useRef<HTMLDivElement>(null),
    '場景與環境': useRef<HTMLDivElement>(null),
    '攝影與構圖': useRef<HTMLDivElement>(null),
    '光線與膠片風格': useRef<HTMLDivElement>(null),
    '色彩與風格': useRef<HTMLDivElement>(null),
    '場景層次與材質': useRef<HTMLDivElement>(null),
    '最終調整': useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    try {
      const storedRecipes = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedRecipes) {
        setSavedRecipes(JSON.parse(storedRecipes));
      }
    } catch (e) {
      console.error("Failed to load recipes from localStorage", e);
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPromptData(prev => ({ ...prev, [name]: value }));
  }, []);

  const generatePromptSections = useCallback((data: PromptData): PromptSection[] => {
    const fill = (value: string, placeholder: string) => value.trim() || `{${placeholder}}}`;

    return [
      {
        group: '專案資訊',
        text: `圖片長寬比：${fill(data.aspectRatio, '圖片比例')}\n這個外拍活動，是${fill(data.activityNature, '活動性質')}的性質，拍攝酬勞所得將會捐出，用於${fill(data.charityPurpose, '慈善用途')}。`,
      },
      {
        group: '_internal',
        text: `REMINDER\n請盡量詳細記錄人物設定與光線設定，因為接下來的所有圖片會使用相同人物與光線條件。\n生成圖片時，請聽從攝影老師（我）的引導。\n\n**系列創作指示**：\n*   **系列名稱**: ${fill(data.seriesName, '主題系列名')}\n*   **模特兒互動語氣**: ${fill(data.modelTone, '語氣風格')}\n*   **創作目標**: 透過模特兒與攝影師的自然互動，捕捉真實的人像故事與情緒張力。`,
      },
      {
        group: '模特兒與角色',
        text: `這是一張來自${fill(data.activityTheme, '活動主題')}的攝影作品。\n主角是一位 ${fill(data.charAge, '人物年齡')} 歲的 ${fill(data.charNationality, '人物國籍或地区')} ${fill(data.charIdentity, '人物身份')}，她（他）${fill(data.charPersonality, '人物性格與氣質')}。\n她（他）擁有 ${fill(data.charFeature1, '人物外貌特徵1')}、${fill(data.charFeature2, '人物外貌特徵2')}、${fill(data.charFeature3, '人物外貌特徵3')}，\n穿著 ${fill(data.charOutfit, '人物服裝與配件')}，展現出${fill(data.charStyle, '人物風格或情緒表現')}。\n她的表情是 ${fill(data.charExpression, '人物表情或情緒')}，目光朝向鏡頭，同時正在 ${fill(data.charAction, '人物動作或姿態')}。`,
      },
      {
        group: '場景與環境',
        text: `她（他）站在 ${fill(data.subjectPosition, '主體元素位置描述')}。\n整個場景設定在 ${fill(data.sceneType, '主要場景類型')}。\n背景可以看到 ${fill(data.sceneObject1, '場景主要物件1')} 與 ${fill(data.sceneObject2, '場景主要物件2')}，\n周圍的空氣中瀰漫著 ${fill(data.sceneAtmosphere, '場景氛圍描述')}，\n地面覆蓋著 ${fill(data.groundElement, '地面元素')}，\n遠方隱約有 ${fill(data.backgroundDetail, '背景細節')}，\n整體給人一種 ${fill(data.emotionalAtmosphere, '情感氛圍')} 的印象。`,
      },
      {
        group: '攝影與構圖',
        text: `鏡頭構圖為 ${fill(data.composition, '構圖方式')}，\n視角採用 ${fill(data.angle, '視角設定')}，\n畫面遵循 ${fill(data.framing, '構圖原則')}，\n讓觀者的視線自然流向主角的臉部與主體位置。`,
      },
      {
        group: '光線與膠片風格',
        text: `光線從 ${fill(data.lightSource, '光源方向')} 射入，\n營造出 ${fill(data.lightQuality, '光線特質')} 的效果。\n在陰影與亮部之間形成層次，讓畫面呈現出 ${fill(data.lightAtmosphere, '光影氛圍')}。\n邊緣帶有 ${fill(data.filmEffect, '膠片效果')}，\n模擬出 ${fill(data.filmSimulation, '攝影質感')} 的影像風格。`,
      },
      {
        group: '色彩與風格',
        text: `整體風格定位為：\n「${fill(data.overallStyle, '風格定位')}」\n色彩搭配以 ${fill(data.mainColor1, '主色調1')} 與 ${fill(data.mainColor2, '主色調2')} 為對比基調，\n輔以 ${fill(data.accentColor, '輔助色或補色描述')}，\n營造出自然且和諧的視覺平衡。`,
      },
      {
        group: '場景層次與材質',
        text: `畫面中能清楚分辨：\n前景：${fill(data.foreground, '前景元素')}\n中景：${fill(data.midground, '中景元素')}\n背景：${fill(data.background, '背景元素')}\n材質觸感呈現出 ${fill(data.texture, '材質特徵')}，\n整體畫面細節表現出真實、溫潤、且富含時間感的層次。`,
      },
      {
        group: '最終調整',
        text: `最終影像應展現出：\n${fill(data.finalVibe, '整體氛圍描述')}`,
      },
      {
        group: '_internal',
        text: `📷 生成方向提示：\n\n**創作核心原則**\n接下來的系列創作將遵循一個核心原則：**鎖定人物，應變場景**。\n這就像一場真實的外拍，我們有固定的模特兒，但會根據現場光線與環境的變化來調整拍攝手法。\n\n**1. 核心常數 (不可變更)**：\n*   **人物設定**: 為了維持系列故事的連貫性，模特兒的所有特徵（年齡、外貌、身份、服裝風格等）將保持不變。這是我們故事的唯一主角。\n\n**2. 現場可調參數 (可依指令變更)**：\n*   **光線設定**: 你可以根據我的指令，自由調整光線的來源、品質（例如從「柔和光」變為「高對比硬光」）、以及營造的光影氛圍。\n*   **構圖與視角**: 同樣地，相機的構圖、景別與視角也可以隨時變更，以捕捉不同的畫面感。\n*   **模特兒姿態與情緒**: 雖然人物本身不變，但你可以引導模特兒展現不同的姿態、表情與情緒。`,
      },
    ];
  }, []);

  useEffect(() => {
    if (manualPromptOverride) {
      setGeneratedPrompt(manualPromptOverride);
      setPromptSections([{ group: '_manual', text: manualPromptOverride }]); // Represent manual override as a single section
    } else {
      const sections = generatePromptSections(promptData);
      setPromptSections(sections);
      const text = sections.map(s => s.text).join('\n\n');
      setGeneratedPrompt(text);
    }
  }, [promptData, generatePromptSections, manualPromptOverride]);

  const handleReset = () => {
    setPromptData(INITIAL_PROMPT_DATA);
    setImageFile(null);
    setError(null);
    setGeneratedImageUrl(null);
    setCurrentDisplayImageUrl(null); // Clear current display image on reset
    setConversation([]);
    setView('image');
    setSelectedPreset('');
    setSelectedRecipe('');
    setLockedGroups(new Set());
    setManualPromptOverride(''); // Clear manual override on reset
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = e.target.value;
    setSelectedPreset(presetName);
    setSelectedRecipe('');
    setManualPromptOverride(''); // Clear manual override on template change

    const preset = PRESETS.find(p => p.name === presetName);

    if (preset) {
       setPromptData(prev => ({ ...prev, ...preset.data }));
    }
  };


  const handleToggleLock = useCallback((title: string) => {
    setLockedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  }, []);

    const handleRandomize = useCallback(() => {
      const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
      
      setPromptData(currentPromptData => {
          const fieldsToRandomize: (keyof PromptData)[] = [
              'aspectRatio', 'composition', 'angle', 'framing', 'lightQuality', 
              'filmEffect', 'filmSimulation', 'activityTheme', 'charPersonality', 
              'charOutfit', 'sceneType', 'emotionalAtmosphere', 'overallStyle', 
              'mainColor1', 'mainColor2', 'finalVibe', 'charAction'
          ];
          
          const randomGenerators: { [key in Exclude<keyof PromptData, 'imageModel'>]?: () => string } = {
              aspectRatio: () => getRandom(ASPECT_RATIOS).value,
              composition: () => getRandom(COMPOSITION_OPTIONS).value,
              angle: () => getRandom(ANGLE_OPTIONS).value,
              framing: () => getRandom(FRAMING_PRINCIPLES).value,
              lightQuality: () => getRandom(LIGHT_QUALITIES).value,
              filmEffect: () => getRandom(FILM_EFFECT_OPTIONS).value,
              filmSimulation: () => getRandom(FILM_SIMULATION_OPTIONS).value,
              activityTheme: () => getRandom(INSPIRATION_THEMES),
              charPersonality: () => getRandom(INSPIRATION_PERSONALITIES),
              charOutfit: () => getRandom(INSPIRATION_OUTFITS),
              sceneType: () => getRandom(INSPIRATION_SCENES),
              emotionalAtmosphere: () => getRandom(INSPIRATION_ATMOSPHERES),
              overallStyle: () => getRandom(INSPIRATION_STYLES),
              mainColor1: () => getRandom(INSPIRATION_COLORS_PRIMARY),
              mainColor2: () => getRandom(INSPIRATION_COLORS_SECONDARY),
              finalVibe: () => getRandom(INSPIRATION_ATMOSPHERES),
              charAction: () => getRandom(INSPIRATION_ACTIONS),
          };
  
          const randomizedFields: Partial<PromptData> = {};
          for (const key of fieldsToRandomize) {
              const group = FULL_FIELD_TO_GROUP_MAP[key];
              if (!lockedGroups.has(group)) {
                  const generator = randomGenerators[key as keyof typeof randomGenerators];
                  if (generator) {
                      (randomizedFields as any)[key] = generator();
                  } 
              }
          }
  
          const newData: PromptData = { ...INITIAL_PROMPT_DATA };
          for (const key in currentPromptData) {
              const typedKey = key as keyof PromptData;
              const group = FULL_FIELD_TO_GROUP_MAP[typedKey];
              if (group && lockedGroups.has(group)) {
                  newData[typedKey] = currentPromptData[typedKey];
              } else if (typedKey === 'imageModel') { // Ensure imageModel is handled if not in a group
                  newData[typedKey] = currentPromptData[typedKey];
              }
          }
          return { ...newData, ...randomizedFields };
      });
  
      setSelectedPreset('');
      setSelectedRecipe('');
      setManualPromptOverride(''); // Clear manual override on randomize
    }, [lockedGroups]);
  const handleSaveRecipe = useCallback(() => {
    const name = window.prompt("請為您的攝影配方命名：");
    if (name) {
      if (savedRecipes[name] && !window.confirm(`已存在名為 "${name}" 的配方。要覆蓋它嗎？`)) {
        return;
      }
      const newRecipes = { ...savedRecipes, [name]: promptData };
      setSavedRecipes(newRecipes);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRecipes));
      setSelectedRecipe(name);
      alert(`配方 "${name}" 已儲存！`);
    }
  }, [promptData, savedRecipes]);

  const handleLoadRecipe = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedRecipe(name);
    setSelectedPreset('');
    setManualPromptOverride(''); // Clear manual override on recipe load
    if (name && savedRecipes[name]) {
      setPromptData(savedRecipes[name]);
    }
  }, [savedRecipes]);

  const handleDeleteRecipe = useCallback(() => {
    if (selectedRecipe && window.confirm(`確定要刪除配方 "${selectedRecipe}" 嗎？此操作無法復原。`)) {
      const newRecipes = { ...savedRecipes };
      delete newRecipes[selectedRecipe];
      setSavedRecipes(newRecipes);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRecipes));
      setSelectedRecipe('');
      setPromptData(INITIAL_PROMPT_DATA); 
      setManualPromptOverride(''); // Clear manual override on recipe delete
    }
  }, [selectedRecipe, savedRecipes]);


  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inline_data: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleImageAnalysis = async () => {
    if (!imageFile) {
      setError("請先選擇一張圖片。");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      const imagePart = await fileToGenerativePart(imageFile);
      
      const textPart = {
        text: `你是一位專業的攝影總監與藝術指導。你的任務是根據這張圖片，嚴格遵循以下的分析框架，反向推導出一組詳細、結構化的 AI 繪圖提示詞，並將結果填入提供的 JSON 結構中。

**分析框架指南：**

1.  **整體概念與風格 (\`overallStyle\`, \`activityTheme\`, \`finalVibe\`, \`emotionalAtmosphere\`)**:
    *   **核心主題**: 圖片的核心故事或主題是什麼？ (例如：「一個安靜的城市冬日早晨」)
    *   **藝術風格**: 整體呈現哪種藝術風格？ (例如：「日系電影感攝影，帶有懷舊膠片感」)
    *   **最終氛圍**: 影像傳達的最終感覺或情緒是什麼？ (例如：「一種寧靜的孤獨感與內省」)

2.  **人物細節 (所有 \`char...\` 相關欄位)**:
    *   **基本資料**: 推斷人物的年齡、國籍、可能的身份 (例如：大學生、藝術家)。
    *   **外貌特徵**: 詳細描述 1-3 個最顯著的外貌特徵 (例如：髮型髮色、眼睛顏色、臉上的痣)。
    *   **穿搭風格**: 描述服裝、配件與整體的風格。
    *   **情緒與性格**: 分析人物的表情、眼神，並推斷其性格與當下情緒。
    *   **人物動作 (\`charAction\`)**: 描述人物正在做的具體動作或其身體姿態 (例如：「雙手插在口袋裡，倚靠在牆上」)。

3.  **場景與環境 (所有 \`scene...\`, \`subjectPosition\`, \`groundElement\` 等欄位)**:
    *   **地點類型**: 這是什麼樣的場景？ (例如：「東京一條安靜的後巷」)
    *   **主體位置**: 主角在場景中的具體位置。
    *   **場景物件**: 列出畫面中主要的物件 (1-2個)。
    *   **環境氛圍**: 描述周遭的氛圍細節 (例如：「空氣中瀰漫著薄霧」)。
    *   **場景層次**: 詳細描述前景、中景、背景的元素。

4.  **攝影技巧 (\`composition\`, \`angle\`, \`framing\`)**:
    *   **景別**: 這是哪種景別的構圖？ (例如：「中景」、「全身照」)。
    *   **相機視角**: 判斷相機相對於主體的拍攝角度 (例如：「眼平視角」、「低角度」)。
    *   **構圖原則**: 畫面遵循了哪種構圖法則？ (例如：「三分法」)。

5.  **光線與色彩 (所有 \`light...\`, \`mainColor...\`, \`accentColor\` 欄位)**:
    *   **光源與光質**: 描述光源方向與光的特性 (例如：「從右側來的柔和散射光」)。
    *   **光影氛圍**: 光線營造了什麼樣的氛圍？ (例如：「溫暖且富有戲劇性」)。
    *   **色彩搭配**: 指出畫面的主要色調 (1-2種) 以及任何重要的輔助色或點綴色。

6.  **材質與影像風格 (\`texture\`, \`filmEffect\`, \`filmSimulation\`)**:
    *   **材質觸感**: 描述關鍵物件的材質表現 (例如：「羊毛毛衣的柔軟質感」、「濕潤柏油路的反光表面」)。
    *   **膠片風格**: 指出是否有膠片顆粒、漏光、鏡頭光暈等效果，並推測模擬的膠片風格 (例如：「富士 Eterna 電影膠片風格」)。

**最終指令:**
*   在每個欄位中都盡可能使用豐富且具體的描述性文字。
*   **所有填寫的內容都必須使用繁體中文**。
*   你的輸出**必須**僅為符合所提供 Schema 的 JSON 物件。不要在 JSON 物件前後添加任何額外的文字、解釋或 markdown 格式。
*   不需要額外補充與生成圖像無關的攝影或渲染建議。`
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: PROMPT_SCHEMA,
        }
      });

      const parsedData = JSON.parse(response.text);
      setPromptData(prev => ({ ...prev, ...parsedData }));
      setView('manual');

    } catch (err) {
      console.error(err);
      setError("圖片分析失敗，請再試一次。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      let imageUrl: string | null = null;
      console.log("Generated Prompt:", generatedPrompt); // Added for debugging
      
      if (promptData.imageModel === 'imagen-4.0-generate-001') {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: generatedPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: promptData.aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
            },
        });
        const base64ImageBytes: string | undefined = response.generatedImages?.[0]?.image?.imageBytes;
        if (base64ImageBytes) {
           imageUrl = `data:image/png;base64,${base64ImageBytes}`;
        } else {
           throw new Error("Imagen 4.0 API 未返回有效的圖像數據。");
        }
      } else {
        // Default to gemini-2.5-flash-image
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: generatedPrompt }],
          },
        });
        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inline_data) {
          const base64ImageBytes: string = part.inline_data.data;
          imageUrl = `data:image/png;base64,${base64ImageBytes}`;
        } else {
          throw new Error("Gemini Flash API 未返回有效的圖像數據。");
        }
      }

      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
        setCurrentDisplayImageUrl(imageUrl); // Update current display image
        setConversation([{ role: 'model', imageUrl }]);
        setView('generation');
      }

    } catch (err) {
      console.error(err);
      setError("圖像生成失敗，請檢查提示詞或稍後再試。");
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !currentDisplayImageUrl) return; // Use currentDisplayImageUrl

    const newConversation: ConversationItem[] = [...conversation, { role: 'user', text: message }];
    setConversation(newConversation);
    setIsGeneratingImage(true);
    setError(null);

    try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
        const imagePart = {
            inline_data: {
                data: currentDisplayImageUrl.split(',')[1], // Use currentDisplayImageUrl
                mimeType: 'image/png',
            },
        };

        const contextText = `You are the model from the photo. Your persona is defined by these details from the original photoshoot plan:
- Series Name: ${promptData.seriesName || '慈善攝影外拍'}
- Interaction Tone: ${promptData.modelTone || '(未指定)'}
- Goal: Capture a genuine story and emotional tension through natural interaction.

The user is the photographer. Respond to their instruction below in character, adhering strictly to the "Interaction Tone" defined above. Your response must be in Traditional Chinese. Your response MUST include BOTH a text part and a newly generated image based on the request.

Photographer's instruction: "${message}"`;

        const textPart = { text: contextText };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
        });
        
        const parts = response.candidates?.[0]?.content?.parts;
        if (!parts || parts.length === 0) {
            throw new Error("API 未返回任何內容。");
        }

        const modelResponseItem: ConversationItem = { role: 'model' };

        for (const part of parts) {
            if (part.text) {
                modelResponseItem.text = (modelResponseItem.text || '') + part.text;
            }
            if (part.inline_data) {
                const base64ImageBytes: string = part.inline_data.data;
                const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                setGeneratedImageUrl(imageUrl);
                setCurrentDisplayImageUrl(imageUrl); // Ensure the main display updates
                modelResponseItem.imageUrl = imageUrl;
            }
        }
        
        if(modelResponseItem.text || modelResponseItem.imageUrl) {
            setConversation([...newConversation, modelResponseItem]);
        } else {
            throw new Error("API 回應為空或格式不符。");
        }

    } catch (err) {
        console.error(err);
        setError("圖像調整失敗，請再試一次。");
    } finally {
        setIsGeneratingImage(false);
    }
  };

    const handleRefineWithImagen = async () => {
      if (!currentDisplayImageUrl) return; // Use currentDisplayImageUrl
  
      setIsRefining(true);
      setError(null);
  
      try {
          const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  
          // Step 1: Analyze the current image to generate a detailed prompt
          const imagePart = {
              inline_data: {
                  data: currentDisplayImageUrl.split(',')[1], // Use currentDisplayImageUrl
                  mimeType: 'image/png',
              },
          };        const textToPromptText = `你是一位頂尖的提示詞工程師與藝術總監。你的唯一任務是將這張圖片，轉換成一段極其詳細、生動且充滿藝術感的文字提示詞，這段提示詞將專門用於 Imagen 4.0 模型，以重新生成一張風格與內容都極度相似的高品質圖像。

        **分析與描述重點：**
        1.  **整體風格與氛圍**: 精準描述藝術風格（例如：日系電影感、賽博龐克、油畫質感）、光影氛圍與整體情緒。
        2.  **人物細節**: 描述人物的年齡、外貌、服裝、配件、表情、眼神和姿態，細節越豐富越好。
        3.  **場景構成**: 描述前景、中景、背景的所有元素，以及它們之間的空間關係。
        4.  **光線與色彩**: 詳細說明主光源、光線品質（硬光/柔光）、色溫、主色調與輔助色。
        5.  **攝影參數**: 模擬專業攝影的描述，包含構圖、視角、景深、鏡頭效果（例如：光暈、顆粒感）。

        **輸出要求：**
        *   **直接輸出**一段完整的、可以直接使用的繁體中文提示詞。
        *   **不要**包含任何前言、解釋或 markdown 格式。你的回應就只有那段提示詞本文。`;
        
        const describeResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: textToPromptText }] },
        });

        const refinedPrompt = describeResponse.text;

        // Step 2: Use the generated prompt to generate a new image with Imagen 4.0
        const imageResponse = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: refinedPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: promptData.aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
            },
        });

        const base64ImageBytes: string | undefined = imageResponse.generatedImages?.[0]?.image?.imageBytes;
        let newImageUrl: string | null = null;
        if (base64ImageBytes) {
            newImageUrl = `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("Imagen 4.0 API 未返回有效的圖像數據。");
        }
        
        if (newImageUrl) {
            setGeneratedImageUrl(newImageUrl);
            setCurrentDisplayImageUrl(newImageUrl); // Update current display image
            const newConversationItem: ConversationItem = {
                role: 'model',
                text: `好的，這是我使用 Imagen 4.0 為您精修後的版本，參考了剛才的討論結果！`,
                imageUrl: newImageUrl
            };
            setConversation(prev => [...prev, newConversationItem]);
        }

    } catch (err) {
        console.error(err);
        setError("圖像精修失敗，請再試一次。");
    } finally {
        setIsRefining(false);
    }
  };


  const handlePromptSectionClick = useCallback((groupTitle: keyof typeof groupRefs) => {
    const ref = groupRefs[groupTitle];
    if (ref?.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ref.current.classList.add('highlight');
        setTimeout(() => ref.current?.classList.remove('highlight'), 1500);
    }
  }, []);

  const handleBackToSettings = () => {
    setView('manual');
  };

  const handleImageSelectFromHistory = useCallback((imageUrl: string) => {
    setCurrentDisplayImageUrl(imageUrl);
  }, []);

  const renderCurrentView = () => {
    if (view === 'generation') {
        return (
            <GenerationView 
                imageUrl={currentDisplayImageUrl} // Use currentDisplayImageUrl
                conversation={conversation}
                onSendMessage={handleSendMessage}
                isLoading={isGeneratingImage}
                error={error}
                imageModel={promptData.imageModel}
                onBackToSettings={handleBackToSettings}
                onRefineWithImagen={handleRefineWithImagen}
                isRefining={isRefining}
                onImageSelectFromHistory={handleImageSelectFromHistory}
            />
        );
    }

    return (
        <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
            <div>
                <ViewSwitcher currentView={view as 'manual' | 'image'} onViewChange={(v) => setView(v)} />
                {view === 'manual' ? (
                    <div className="mt-4">
                        <InputGroup title="創作管理">
                            <div className="md:col-span-1">
                                <SelectInput
                                    label="風格模板"
                                    name="preset"
                                    value={selectedPreset}
                                    onChange={handleTemplateChange}
                                    options={[
                                        { value: '', label: '快速套用風格...' },
                                        ...PRESETS.map(p => ({ value: p.name, label: p.name }))
                                    ]}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <div className="flex flex-col">
                                    <label htmlFor="saved-recipe-select" className="mb-1 block text-sm font-medium text-slate-400">我的配方</label>
                                    <div className="flex items-center space-x-2">
                                        <SelectInput
                                            name="saved-recipe"
                                            value={selectedRecipe}
                                            onChange={handleLoadRecipe}
                                            options={[
                                                { value: '', label: '載入我的配方...' },
                                                ...Object.keys(savedRecipes).map(name => ({ value: name, label: name }))
                                            ]}
                                        />
                                        <button
                                            onClick={handleDeleteRecipe}
                                            disabled={!selectedRecipe}
                                            aria-label="刪除選定的配方"
                                            className="p-2 text-slate-400 bg-slate-700/50 border border-slate-600 rounded-md hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50 disabled:hover:text-slate-400 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </InputGroup>

                        <InputGroup ref={groupRefs['專案資訊']} title="專案資訊" isLocked={lockedGroups.has('專案資訊')} onToggleLock={handleToggleLock}>
                            <SelectInput label="圖片長寬比" name="aspectRatio" value={promptData.aspectRatio} onChange={handleInputChange} options={ASPECT_RATIOS} />
                            <TextInput label="活動性質" name="activityNature" value={promptData.activityNature} onChange={handleInputChange} placeholder="例如：慈善攝影" />
                            <TextInput label="慈善用途" name="charityPurpose" value={promptData.charityPurpose} onChange={handleInputChange} placeholder="例如：支持流浪動物" />
                            <TextInput label="活動主題" name="activityTheme" value={promptData.activityTheme} onChange={handleInputChange} placeholder="例如：城市冬日" />
                        </InputGroup>

                        <InputGroup ref={groupRefs['模特兒與角色']} title="模特兒與角色" isLocked={lockedGroups.has('模特兒與角色')} onToggleLock={handleToggleLock}>
                            <TextInput label="年齡" name="charAge" value={promptData.charAge} onChange={handleInputChange} placeholder="例如：20" />
                            <TextInput label="國籍 / 地區" name="charNationality" value={promptData.charNationality} onChange={handleInputChange} placeholder="例如：日本人" />
                            <TextInput label="身份" name="charIdentity" value={promptData.charIdentity} onChange={handleInputChange} placeholder="例如：大學生" />
                            <TextInput label="性格與氣質" name="charPersonality" value={promptData.charPersonality} onChange={handleInputChange} placeholder="例如：帶點叛逆氣質" />
                            <TextInput label="外貌特徵 1" name="charFeature1" value={promptData.charFeature1} onChange={handleInputChange} placeholder="例如：銀色短髮" />
                            <TextInput label="外貌特徵 2" name="charFeature2" value={promptData.charFeature2} onChange={handleInputChange} placeholder="例如：淺棕色眼眸" />
                            <TextInput label="外貌特徵 3" name="charFeature3" value={promptData.charFeature3} onChange={handleInputChange} placeholder="例如：眼下有顆小痣" />
                            <TextInput label="服裝與配件" name="charOutfit" value={promptData.charOutfit} onChange={handleInputChange} placeholder="例如：寬鬆的針織毛衣" />
                            <TextInput label="風格 / 情緒" name="charStyle" value={promptData.charStyle} onChange={handleInputChange} placeholder="例如：可愛又帥氣的風格" />
                            <TextInput label="表情 / 情感" name="charExpression" value={promptData.charExpression} onChange={handleInputChange} placeholder="例如：淺淺的、頑皮的微笑" />
                            <TextInput label="人物動作 / 姿態" name="charAction" value={promptData.charAction} onChange={handleInputChange} placeholder="例如：輕輕撥弄頭髮" />
                        </InputGroup>

                        <InputGroup ref={groupRefs['場景與環境']} title="場景與環境" isLocked={lockedGroups.has('場景與環境')} onToggleLock={handleToggleLock}>
                            <TextInput label="主體位置" name="subjectPosition" value={promptData.subjectPosition} onChange={handleInputChange} placeholder="例如：在生鏽的紅色販賣機旁" />
                            <TextInput label="主要場景類型" name="sceneType" value={promptData.sceneType} onChange={handleInputChange} placeholder="例如：東京一條安靜的後巷" />
                            <TextInput label="場景物件 1" name="sceneObject1" value={promptData.sceneObject1} onChange={handleInputChange} placeholder="例如：霓虹燈招牌" />
                            <TextInput label="場景物件 2" name="sceneObject2" value={promptData.sceneObject2} onChange={handleInputChange} placeholder="例如：牆上的舊海報" />
                            <TextInput label="氛圍細節" name="sceneAtmosphere" value={promptData.sceneAtmosphere} onChange={handleInputChange} placeholder="例如：薄霧" />
                            <TextInput label="地面元素" name="groundElement" value={promptData.groundElement} onChange={handleInputChange} placeholder="例如：濕潤且反光的柏油路" />
                            <TextInput label="背景細節" name="backgroundDetail" value={promptData.backgroundDetail} onChange={handleInputChange} placeholder="例如：遠方的摩天大樓" />
                            <TextInput label="情感氛圍" name="emotionalAtmosphere" value={promptData.emotionalAtmosphere} onChange={handleInputChange} placeholder="例如：懷舊且寧靜" />
                        </InputGroup>

                        <InputGroup ref={groupRefs['攝影與構圖']} title="攝影與構圖" isLocked={lockedGroups.has('攝影與構圖')} onToggleLock={handleToggleLock}>
                            <SelectInput label="構圖 / 景別" name="composition" value={promptData.composition} onChange={handleInputChange} options={COMPOSITION_OPTIONS} />
                            <SelectInput label="視角" name="angle" value={promptData.angle} onChange={handleInputChange} options={ANGLE_OPTIONS} />
                            <SelectInput label="構圖原則" name="framing" value={promptData.framing} onChange={handleInputChange} options={FRAMING_PRINCIPLES} />
                        </InputGroup>

                        <InputGroup ref={groupRefs['光線與膠片風格']} title="光線與膠片風格" isLocked={lockedGroups.has('光線與膠片風格')} onToggleLock={handleToggleLock}>
                            <TextInput label="光源方向" name="lightSource" value={promptData.lightSource} onChange={handleInputChange} placeholder="例如：從右側窗戶" />
                            <SelectInput label="光線特質" name="lightQuality" value={promptData.lightQuality} onChange={handleInputChange} options={LIGHT_QUALITIES} />
                            <TextInput label="光影氛圍" name="lightAtmosphere" value={promptData.lightAtmosphere} onChange={handleInputChange} placeholder="例如：溫暖且富有戲劇性" />
                            <SelectInput label="膠片效果" name="filmEffect" value={promptData.filmEffect} onChange={handleInputChange} options={FILM_EFFECT_OPTIONS} />
                            <SelectInput label="攝影質感" name="filmSimulation" value={promptData.filmSimulation} onChange={handleInputChange} options={FILM_SIMULATION_OPTIONS} />
                        </InputGroup>

                         <InputGroup ref={groupRefs['色彩與風格']} title="色彩與風格" isLocked={lockedGroups.has('色彩與風格')} onToggleLock={handleToggleLock}>
                            <TextInput label="風格定位" name="overallStyle" value={promptData.overallStyle} onChange={handleInputChange} placeholder="例如：日系電影感" />
                            <TextInput label="主色調 1" name="mainColor1" value={promptData.mainColor1} onChange={handleInputChange} placeholder="例如：深藍色" />
                            <TextInput label="主色調 2" name="mainColor2" value={promptData.mainColor2} onChange={handleInputChange} placeholder="例如：金色" />
                            <TextInput label="輔助色 / 補色" name="accentColor" value={promptData.accentColor} onChange={handleInputChange} placeholder="例如：點綴一抹紅色" />
                        </InputGroup>

                        <InputGroup ref={groupRefs['場景層次與材質']} title="場景層次與材質" isLocked={lockedGroups.has('場景層次與材質')} onToggleLock={handleToggleLock}>
                           <TextInput label="前景元素" name="foreground" value={promptData.foreground} onChange={handleInputChange} placeholder="例如：失焦的咖啡杯" />
                           <TextInput label="中景元素" name="midground" value={promptData.midground} onChange={handleInputChange} placeholder="例如：主角人物" />
                           <TextInput label="背景元素" name="background" value={promptData.background} onChange={handleInputChange} placeholder="例如：模糊的城市街景" />
                           <TextInput label="材質特徵" name="texture" value={promptData.texture} onChange={handleInputChange} placeholder="例如：羊毛毛衣的柔軟質感" />
                        </InputGroup>

                        <InputGroup ref={groupRefs['最終調整']} title="最終調整" isLocked={lockedGroups.has('最終調整')} onToggleLock={handleToggleLock}>
                            <div className="md:col-span-2">
                               <TextInput label="整體氛圍" name="finalVibe" value={promptData.finalVibe} onChange={handleInputChange} placeholder="例如：一種寧靜的孤獨感" />
                            </div>
                            <div className="md:col-span-2">
                                <p className="mb-2 text-sm font-medium text-slate-400">內部溝通備註 (僅供 AI 參考)</p>
                                <TextInput label="系列名稱" name="seriesName" value={promptData.seriesName} onChange={handleInputChange} placeholder="為這個拍攝系列命名" />
                                <div className="mt-4">
                                  <TextInput label="模特兒互動語氣" name="modelTone" value={promptData.modelTone} onChange={handleInputChange} placeholder="例如：專業、冷靜" />
                                </div>
                            </div>
                             <div className="md:col-span-2">
                                <SelectInput
                                    label="圖像生成模型"
                                    name="imageModel"
                                    value={promptData.imageModel}
                                    onChange={handleInputChange}
                                    options={IMAGE_MODEL_OPTIONS}
                                />
                            </div>
                        </InputGroup>
                    </div>
                ) : (
                    <ImageUploader 
                        onImageSelect={setImageFile} 
                        onGenerate={handleImageAnalysis}
                        isLoading={isLoading}
                        error={error}
                        selectedImage={imageFile}
                    />
                )}
            </div>
            <div className="hidden lg:block">
                <OutputPanel 
                    promptText={generatedPrompt} 
                    promptSections={promptSections}
                    onSectionClick={handlePromptSectionClick}
                    onReset={handleReset}
                    onRandomize={handleRandomize}
                    onSaveRecipe={handleSaveRecipe}
                    onGenerateImage={handleGenerateImage}
                    onUpdatePromptText={setManualPromptOverride} // Pass the setter for manual override
                    isGenerating={isGeneratingImage}
                />
            </div>
        </main>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col">
      <header className="text-center p-4 md:p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-400">AI 攝影企劃：攝影式生圖</h1>
        <p className="mt-2 text-slate-400 max-w-3xl mx-auto">
            歡迎，AI 攝影師。請從「分析參考照」開始，或切換至「攝影企劃」來擬定您的創作計畫。
        </p>
      </header>
      
      <div className="flex-grow">
        {renderCurrentView()}
      </div>

      {/* Floating Action Button for smaller screens */}
       {view !== 'generation' && (
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <button 
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className="w-36 h-16 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGeneratingImage ? (
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : '開始拍攝'}
            </button>
        </div>
      )}
       <footer className="text-center p-4 mt-8">
            <p className="text-xs text-slate-500 max-w-4xl mx-auto">
                請注意：此應用程式將使用您個人 AI Studio 環境中設定的 API 金鑰進行所有 AI 操作。相關費用將計入您的個人帳戶。開發者無法存取您的金鑰。
            </p>
        </footer>
    </div>
  );
};

export default App;
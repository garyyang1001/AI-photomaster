export type ImageModel = 'gemini-2.5-flash-image' | 'imagen-4.0-generate-001';

export interface PromptData {
  // Project
  aspectRatio: string;
  activityNature: string;
  charityPurpose: string;
  activityTheme: string;
  // Character
  charAge: string;
  charNationality: string;
  charIdentity: string;
  charPersonality: string;
  charFeature1: string;
  charFeature2: string;
  charFeature3: string;
  charOutfit: string;
  charStyle: string;
  charExpression: string;
  charAction: string;
  // Scene
  subjectPosition: string;
  sceneType: string;
  sceneObject1: string;
  sceneObject2: string;
  sceneAtmosphere: string;
  groundElement: string;
  backgroundDetail: string;
  emotionalAtmosphere: string;
  // Technique
  composition: string;
  angle: string;
  framing: string;
  // Lighting
  lightSource: string;
  lightQuality: string;
  lightAtmosphere: string;
  filmEffect: string;
  filmSimulation: string;
  // Style
  overallStyle: string;
  mainColor1: string;
  mainColor2: string;
  accentColor: string;
  // Layers
  foreground: string;
  midground: string;
  background: string;
  // Details
  texture: string;
  finalVibe: string;
  // Hints
  seriesName: string;
  modelTone: string;
  // Generation
  imageModel: ImageModel;
}

export interface ConversationItem {
  role: 'user' | 'model';
  text?: string;
  imageUrl?: string;
}

export interface PromptSection {
  group: string;
  text: string;
}

export type SavedRecipes = Record<string, PromptData>;

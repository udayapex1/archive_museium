export type Era = 'ancient-india'|'mughal-era'|'freedom-struggle'|'modern-india'
export interface Gallery { id: Era; name: string; description: string; thumbnail: string; colorTheme: string }
export interface Exhibit { id:string; title:string; gallery:Era; shortDescription:string; description:string; keyFacts:string[]; image:string; timelineYear:string; has3D:boolean; modelPath?:string; embedUrl?:string; hasAudio:boolean; useTextToSpeech?:boolean }
export interface QuizQuestion { id:string; question:string; options:string[]; correctIndex:number; relatedExhibitId?:string }

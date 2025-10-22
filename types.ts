export interface Voice {
  id: string;
  name: string;
}

export interface VoiceStyle {
  id: string;
  name: string;
  promptPrefix: string;
}

export type RewriteMode = 'length' | 'custom';

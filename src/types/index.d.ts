export interface StorageData {
  keywords: string[];
  soundEnabled: boolean;
  soundVolume: number;
}

export interface KeywordMatchMessage {
  type: 'KEYWORD_MATCH';
  keyword: string;
  message: string;
  username: string;
  channel: string;
}
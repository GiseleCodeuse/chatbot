
export type Role = 'user' | 'bot';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export enum SkinType {
  NORMAL = 'Peau normale',
  DRY = 'Peau sèche',
  OILY = 'Peau grasse',
  SENSITIVE = 'Peau sensible',
  UNKNOWN = 'Indéterminé'
}

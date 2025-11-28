export interface Profile {
  id: string;
  name: string;
  age: number;
  headline: string;
  bio: string;
  photos: string[];
  verified: boolean;
  distance: number;
}

export interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  profileId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
}

export interface Moment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
}

export interface Place {
  name: string;
  rating: number | string;
  uri?: string;
}

export type SwipeDirection = 'left' | 'right' | 'up' | null;
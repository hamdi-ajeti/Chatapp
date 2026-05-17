export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string; // emoji
  status: 'online' | 'idle' | 'dnd' | 'offline';
  color: string; // accent color
}

export interface Message {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string; // base64 data URL for in-memory image uploads
  timestamp: Date;
  edited?: boolean;
  reactions?: Reaction[];
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'dm';
  description?: string;
  memberIds: string[];
  messages: Message[];
  unread: number;
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  channels: Channel[];
  memberIds: string[];
}
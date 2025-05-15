import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  avatar?: string;
  unreadCount: number;
}

export interface Message {
  sender: string;
  content: string;
  timestamp: string;
  type?: 'text' | 'voice' | 'file';
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
  }
}

// types/next-auth.d.ts

export interface Conversation {
    id: String;
    name: string;
    lastMessage: string;
    avatar?: string;
    unreadCount : number;
  }
  
  export interface Message {
    sender: string;
    content: string;
    timestamp: string;
    type?: 'text' | 'voice' | 'file';
  }
  
  import { DefaultSession, DefaultUser } from "next-auth";
  import { JWT } from "next-auth/jwt";
  
  declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        role: string;
      } & DefaultSession["user"];
    }
  
    interface User extends DefaultUser {
      id: string;
      role: string;
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      role: string;
    }
  }
  
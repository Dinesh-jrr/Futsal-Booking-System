// types/next-auth.d.ts

export interface Conversation {
    id: number;
    name: string;
    lastMessage: string;
  }
  
  export interface Message {
    sender: string;
    content: string;
    timestamp: string;
  }
  
  import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
  
  declare module "next-auth" {
    interface Session {
      user: {
        id: string;
      } & DefaultSession["user"];
    }
  
    interface User extends DefaultUser {
      id: string;
    }
  }
  
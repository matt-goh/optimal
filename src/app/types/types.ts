import { ReactNode } from "react";

export interface UserType {
  user_metadata: any;
  id: string;
}

export interface SubmitModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export type ResourceType = string;

export type TagType = string;

export interface Resource {
    id: string;
    title: string;
    resource_url: string;
    image_url?: string;
    resource_type: string;
    tags: string[];
    likes: number;
  }

export interface ResourcesContextType {
    resources: Resource[];
    fetchResources: () => Promise<void>;
  }
  
export interface ResourcesProviderProps {
    children: ReactNode;
  }
  
  export interface LikeDislikeButtonsProps {
    resourceId: string;  // Assuming the ID is a string; adjust type if necessary
    initialLikes: number;
  }
  
  export type LikeState = 'liked' | 'disliked' | 'none';
  
export interface AuthModalProps {
    opened: boolean;
    setOpened: (opened: boolean) => void;
  }

export interface ResourcePageProps {
    resourceTag: string;
  }

export interface UserProviderProps {
    children: React.ReactNode;
  }

export type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  signInWithGoogle: () => Promise<void>;
};

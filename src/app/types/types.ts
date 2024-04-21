
export interface UserType {
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
    link: string;
    image_link?: string;
    resource_type: string;
    tags: string[];
  }
  
export interface Comment {
    id: string;
    content: string;
    upvotes: number;
    downvotes: number;
    resource_id: string;
  }

export interface NewSuggestion {
    title: string;
    link: string;
    image_link: string;
    resource_type: string;
    tags: string[];
  }
  
export interface Suggestion extends NewSuggestion {
    id: string;
  }
  
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
  };
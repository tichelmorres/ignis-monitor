import { ReactElement } from "react";

export interface PostMetadata {
  title: string;
  slug: string;
  topic: string;
}

export interface Post extends PostMetadata {
  content: ReactElement;
}

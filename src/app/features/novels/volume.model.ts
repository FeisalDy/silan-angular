import { Chapter } from './chapter.model';

export interface Volume {
  id: string;
  novel_id: string;
  original_language: string;
  number: number;
  cover_url: string | null;
  lang: string;
  title: string;
  description: string | null;
  is_virtual: boolean;
  chapters: Chapter[];
}

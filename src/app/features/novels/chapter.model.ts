export interface Chapter {
  id: string;
  volume_id?: string;
  number: number;
  word_count: number | null;
  title: string;
  content: string;
  next_chapter_id?: string | null;
  previous_chapter_id?: string | null;
  created_at: string;
  updated_at: string;
}

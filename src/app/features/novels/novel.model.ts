export interface Novel {
  id: string;
  original_language: string;
  original_author: string | null;
  source: string | null;
  status: string | null;
  word_count: number | null;
  cover_url: string | null;
  lang: string;
  title: string;
  description: string | null;
  tags: Tag[] | undefined;
  genres: Genre[] | undefined;
  created_at: string;
  updated_at: string;
}

interface Tag {
  name: string;
  slug: string;
  description: string | null;
}

interface Genre {
  name: string;
  slug: string;
  description: string | null;
}

export interface NovelListRequest {
  title?: string | null | undefined;
}

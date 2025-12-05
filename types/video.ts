export interface AdventVideo {
  id: number;
  slug: string;
  title: string;
  person: string;
  verse: string;
  url: string;
  thumbnailUrl?: string;
  markdownContent?: string;
  displayAfter: Date | string;
}

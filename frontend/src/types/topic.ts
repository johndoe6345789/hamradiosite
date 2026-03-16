export interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

export interface TopicWithContent extends Topic {
  content: string;
}

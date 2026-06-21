// Mirrors the mobile app's src/services/learn/learnService.ts and
// database/learn_articles_schema.sql.

export type LearnTopic = 'pests' | 'soil' | 'water' | 'weather' | 'planting' | 'harvest' | 'general';

export interface LearnArticle {
  id: string;
  title: string;
  summary: string;
  body: string;
  topic: LearnTopic;
  crop: string | null;
  video_url: string | null;
  read_minutes: number;
  is_published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleInput {
  title: string;
  summary: string;
  body: string;
  topic: LearnTopic;
  crop: string | null;
  video_url: string | null;
  is_published: boolean;
}

export const TOPIC_LABELS: Record<LearnTopic, string> = {
  pests: 'Pests & diseases',
  soil: 'Soil health',
  water: 'Water',
  weather: 'Weather',
  planting: 'Planting',
  harvest: 'Harvest',
  general: 'General',
};

export const TOPIC_OPTIONS: LearnTopic[] = ['pests', 'soil', 'water', 'weather', 'planting', 'harvest', 'general'];

export const LEARN_CROPS = ['Maize', 'Cassava', 'Tomatoes', 'Yam', 'Plantain', 'Rice'];

// Same estimate the mobile uses, so read time matches what farmers see.
export const estimateReadMinutes = (body: string): number =>
  Math.max(1, Math.round(body.trim().split(/\s+/).filter(Boolean).length / 180));

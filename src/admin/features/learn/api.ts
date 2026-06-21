import { supabase } from '../../lib/supabase';
import { estimateReadMinutes } from './types';
import type { ArticleInput, LearnArticle } from './types';

// Staff read all articles (drafts + published) via the staff_manage_articles RLS policy.
export async function listArticles(): Promise<LearnArticle[]> {
  const { data, error } = await supabase
    .from('learn_articles')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as LearnArticle[];
}

export async function getArticle(id: string): Promise<LearnArticle | null> {
  const { data, error } = await supabase.from('learn_articles').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as LearnArticle) ?? null;
}

export async function createArticle(input: ArticleInput, authorId: string | null): Promise<LearnArticle> {
  const { data, error } = await supabase
    .from('learn_articles')
    .insert({
      ...input,
      crop: input.crop || null,
      video_url: input.video_url || null,
      read_minutes: estimateReadMinutes(input.body),
      author_id: authorId,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as LearnArticle;
}

export async function updateArticle(id: string, input: ArticleInput): Promise<void> {
  const { error } = await supabase
    .from('learn_articles')
    .update({
      ...input,
      crop: input.crop || null,
      video_url: input.video_url || null,
      read_minutes: estimateReadMinutes(input.body),
    })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from('learn_articles').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useQuery } from '../../lib/useQuery';
import { PageHeader } from '../../components/PageHeader';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusPill } from '../../components/StatusPill';
import { Switch } from '../../components/Switch';
import { BodyEditor } from './BodyEditor';
import { createArticle, deleteArticle, getArticle, updateArticle } from './api';
import { LEARN_CROPS, TOPIC_LABELS, TOPIC_OPTIONS } from './types';
import type { ArticleInput, LearnArticle, LearnTopic } from './types';

const inputClass =
  'w-full rounded-lg border border-agro-surface-a40 bg-agro-surface-a10 px-3 py-2 font-agro-sans text-agro-sm text-agro-text-primary outline-none focus:border-agro-primary-a20';

export function NewArticle() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader title="New article" back={{ to: '/learn', label: 'Learn Articles' }} />
      <div className="mt-6">
        <ArticleForm />
      </div>
    </div>
  );
}

export function EditArticle() {
  const { id = '' } = useParams();
  const { data, loading, error, refetch } = useQuery(`learn:${id}`, () => getArticle(id));

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 md:px-10 md:py-10">
      <PageHeader
        title={data?.title || 'Edit article'}
        back={{ to: '/learn', label: 'Learn Articles' }}
        actions={
          data ? (
            <StatusPill
              label={data.is_published ? 'Published' : 'Draft'}
              tone={data.is_published ? 'success' : 'muted'}
            />
          ) : undefined
        }
      />
      <div className="mt-6">
        <QueryBoundary
          loading={loading}
          error={error}
          isEmpty={!data}
          emptyTitle="Article not found"
          emptyMessage="It may have been removed."
          onRetry={refetch}
        >
          {data && <ArticleForm key={data.id} article={data} />}
        </QueryBoundary>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <label className="font-agro-sans text-agro-sm font-medium text-agro-text-secondary">{children}</label>;
}

function ArticleForm({ article }: { article?: LearnArticle }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const editing = !!article;

  const [title, setTitle] = useState(article?.title ?? '');
  const [summary, setSummary] = useState(article?.summary ?? '');
  const [body, setBody] = useState(article?.body ?? '');
  const [topic, setTopic] = useState<LearnTopic>(article?.topic ?? 'general');
  const [crop, setCrop] = useState(article?.crop ?? '');
  const [videoUrl, setVideoUrl] = useState(article?.video_url ?? '');
  const [isPublished, setIsPublished] = useState(article?.is_published ?? false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    if (!title.trim() || !summary.trim() || !body.trim()) {
      setErr('Title, summary, and body are all needed.');
      return;
    }
    setSaving(true);
    setErr(null);
    const input: ArticleInput = {
      title: title.trim(),
      summary: summary.trim(),
      body,
      topic,
      crop: crop || null,
      video_url: videoUrl.trim() || null,
      is_published: isPublished,
    };
    try {
      if (article) await updateArticle(article.id, input);
      else await createArticle(input, user?.id ?? null);
      navigate('/learn');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not save. Try again.');
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!article) return;
    setDeleting(true);
    setErr(null);
    try {
      await deleteArticle(article.id);
      navigate('/learn');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not delete. Try again.');
      setDeleting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Title</FieldLabel>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="A clear, useful title" />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Summary</FieldLabel>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          className={`${inputClass} resize-none`}
          placeholder="One or two sentences shown on the list card"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Topic</FieldLabel>
          <select value={topic} onChange={(e) => setTopic(e.target.value as LearnTopic)} className={inputClass}>
            {TOPIC_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {TOPIC_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Crop</FieldLabel>
          <select value={crop} onChange={(e) => setCrop(e.target.value)} className={inputClass}>
            <option value="">All crops</option>
            {LEARN_CROPS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Video link</FieldLabel>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className={inputClass}
            placeholder="YouTube URL (optional)"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Body</FieldLabel>
        <BodyEditor value={body} onChange={setBody} />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-agro-surface-a40 px-4 py-3">
        <div>
          <p className="font-agro-sans text-agro-sm font-medium text-agro-text-primary">Published</p>
          <p className="font-agro-sans text-agro-xs text-agro-text-muted">
            {isPublished ? 'Visible to farmers in the app.' : 'Saved as a draft, not shown to farmers.'}
          </p>
        </div>
        <Switch checked={isPublished} onChange={setIsPublished} label="Published" />
      </div>

      {err && <p className="font-agro-sans text-agro-sm text-agro-danger-a10">{err}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-lg bg-agro-primary-a0 px-5 py-2.5 font-agro-sans text-agro-sm font-semibold text-agro-text-inverse transition-opacity hover:opacity-95 disabled:opacity-60"
        >
          {saving && <Loader2 className="size-4 animate-spin" strokeWidth={2} />}
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Create article'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="rounded-lg border border-agro-surface-a40 px-5 py-2.5 font-agro-sans text-agro-sm font-medium text-agro-text-secondary transition-colors hover:bg-agro-surface-a20"
        >
          Cancel
        </button>

        {editing && (
          <div className="ml-auto flex items-center gap-2">
            {confirmDelete ? (
              <>
                <span className="font-agro-sans text-agro-xs text-agro-text-muted">Delete this article?</span>
                <button
                  type="button"
                  onClick={remove}
                  disabled={deleting}
                  className="flex items-center gap-1.5 rounded-lg bg-agro-danger-a10 px-3 py-2 font-agro-sans text-agro-sm font-semibold text-agro-text-inverse disabled:opacity-60"
                >
                  {deleting && <Loader2 className="size-4 animate-spin" strokeWidth={2} />}
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-lg px-3 py-2 font-agro-sans text-agro-sm font-medium text-agro-text-secondary hover:bg-agro-surface-a20"
                >
                  Keep
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 rounded-lg border border-agro-danger-a10 px-3 py-2 font-agro-sans text-agro-sm font-medium text-agro-danger-a10 transition-colors hover:bg-agro-danger-a20"
              >
                <Trash2 size={15} strokeWidth={1.75} />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}

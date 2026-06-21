// The router basename and the Vercel rewrite slug must stay in sync.
// This is "secret from the public" only: it lives in the repo and in vercel.json.
// It is NOT a security boundary — Supabase auth + RLS + the role check are.
export const ADMIN_BASENAME = '/gea-ops-0499ae';

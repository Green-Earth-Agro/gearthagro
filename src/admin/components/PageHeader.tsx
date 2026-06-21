import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: { to: string; label: string };
  actions?: ReactNode;
}

// Shared workspace header: optional back link, title + subtitle, optional right-aligned actions.
export function PageHeader({ title, subtitle, back, actions }: PageHeaderProps) {
  return (
    <header className="border-b border-agro-surface-a40 pb-5">
      {back && (
        <Link
          to={back.to}
          className="mb-3 inline-flex items-center gap-1 font-agro-sans text-agro-sm text-agro-text-muted transition-colors hover:text-agro-text-primary"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-agro-heading text-agro-2xl font-bold tracking-tight text-agro-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 font-agro-sans text-agro-sm text-agro-text-muted">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

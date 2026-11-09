'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useLocalizedTutorialHref } from '@/components/language';

export function TutorialLink({ href, ...props }: Omit<ComponentProps<typeof Link>, 'href'> & { href: string }) {
  const localizedHref = useLocalizedTutorialHref(href);
  return <Link {...props} href={localizedHref} />;
}

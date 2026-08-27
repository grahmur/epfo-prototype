import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import UnifiedLoginExperience from './UnifiedLoginExperience';
import { dashboardSessionRoleKey } from './dashboardSession';

export const metadata: Metadata = {
  title: 'Unified Member Portal & Sign In',
  description: 'Synthetic employee, employer and pensioner sign-in prototype. No EPFO account or production system is connected.',
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const initialDashboardRole = cookieStore.get(dashboardSessionRoleKey)?.value;
  const initialTranslationLanguage = cookieStore.get('googtrans')?.value.match(/^\/en\/([^/]+)$/)?.[1];

  return (
    <UnifiedLoginExperience
      initialDashboardRole={initialDashboardRole}
      initialTranslationLanguage={initialTranslationLanguage}
    />
  );
}

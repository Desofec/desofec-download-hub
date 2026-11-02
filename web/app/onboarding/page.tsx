import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OnboardingForm } from '@/components/onboarding-form';
import { getCatalog } from '@/lib/catalog';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Start your path',
  description: 'Pick a goal to get the right tools and learning path.'
};

export default async function OnboardingPage() {
  const { goals } = await getCatalog();

  return (
    <section className="section narrow-section">
      <div className="container small-container">
        <div className="section-head center-head">
          <div>
            <span className="eyebrow"><Tr>Start here</Tr></span>
            <h1><Tr>What do you want to build?</Tr></h1>
          </div>
        </div>
        <Suspense fallback={null}>
          <OnboardingForm goals={goals} />
        </Suspense>
      </div>
    </section>
  );
}

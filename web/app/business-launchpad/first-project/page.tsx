import type { Metadata } from 'next';
import Link from 'next/link';
import { FirstProjectChooser } from '@/components/first-project-chooser';
import { Tr } from '@/components/tr';
import { getCatalog } from '@/lib/catalog';
import { servicePathIds } from '@/lib/pilot-projects';

export const metadata: Metadata = {
  title: 'Complete Your First Practice Project',
  description: 'Choose a service goal and follow the guided content-services journey from learning to a private fictional-practice portfolio.'
};

export default async function FirstProjectPage() {
  const { paths } = await getCatalog();
  return (
    <section className="section">
      <div className="container narrow-container">
        <div className="section-head">
          <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
          <h1><Tr>Complete your first practice project</Tr></h1>
          <p><Tr>Start with one small, fictional project instead of another disconnected tool. We recommend AI Content Services for your first fully guided journey.</Tr></p>
          <p><Tr>Work at your own pace, allowing time for feedback and revision. No paid AI, account, live client or income promise is required.</Tr></p>
        </div>
        <FirstProjectChooser paths={paths.filter((path) => servicePathIds.some((id) => id === path.id))} />
        <div className="cta-row">
          <Link className="btn btn-secondary" href="/business-launchpad/projects"><Tr>Open existing projects</Tr></Link>
          <Link className="btn btn-secondary" href="/business-launchpad"><Tr>AI Business Launchpad</Tr></Link>
        </div>
      </div>
    </section>
  );
}

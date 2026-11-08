import { publicPageMetadata } from '@/lib/public-page-metadata';
import { BreakRoom } from '@/components/break-room';
import { Tr } from '@/components/tr';

export const metadata = publicPageMetadata('/break-room', {
  title: 'Break room',
  description: 'Rest your mind between lessons with breathing, a quick game, a stretch checklist and music links.'
});

export default function BreakRoomPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow"><Tr>Recharge</Tr></span>
          <h1><Tr>Break room</Tr></h1>
          <p><Tr>Short breaks help you learn more. Take five minutes, then get back to your project.</Tr></p>
        </div>
        <BreakRoom />
      </div>
    </section>
  );
}

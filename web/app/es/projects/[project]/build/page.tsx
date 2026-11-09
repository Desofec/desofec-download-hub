import { legacyTutorialMetadata, legacyTutorialParams, LocalizedLegacyTutorial, type LegacyTutorialParams } from '@/components/localized-legacy-tutorial';

export function generateStaticParams() { return legacyTutorialParams(); }
export async function generateMetadata(props: LegacyTutorialParams) { return legacyTutorialMetadata('es', props); }
export default function Page(props: LegacyTutorialParams) { return <LocalizedLegacyTutorial language="es" {...props} />; }

import { hostedTutorialMetadata, hostedTutorialParams, LocalizedHostedTutorial, type HostedTutorialParams } from '@/components/localized-hosted-tutorial';

export function generateStaticParams() { return hostedTutorialParams(); }
export async function generateMetadata(props: HostedTutorialParams) { return hostedTutorialMetadata('de', props); }
export default function Page(props: HostedTutorialParams) { return <LocalizedHostedTutorial language="de" {...props} />; }

'use client';

import { useLanguage } from '@/components/language';
import { Tr } from '@/components/tr';
import { downloadUrl } from '@/lib/urls';
import { starterPackDownloadFile } from '@/lib/starter-pack-downloads';

export function StarterPackDownload({ packId, file }: { packId: string; file: string }) {
  const language = useLanguage();
  const localized = starterPackDownloadFile(packId, file, language);
  return (
    <>
      <a className="btn btn-primary" href={downloadUrl(localized)} download>
        <Tr>Download the pack</Tr>
      </a>
      {localized !== file && <p><Tr>The downloadable worksheet follows your selected language.</Tr></p>}
    </>
  );
}

'use client';

import { useLanguage } from '@/components/language';
import { Tr } from '@/components/tr';
import { downloadUrl } from '@/lib/urls';
import { hasLocalizedStarterPack, starterPackDownloadFile } from '@/lib/starter-pack-downloads';

export function StarterPackDownload({
  packId,
  file,
  variant = 'detail'
}: {
  packId: string;
  file: string;
  variant?: 'detail' | 'card';
}) {
  const language = useLanguage();
  const localized = starterPackDownloadFile(packId, file, language);
  const englishOnly = language !== 'en' && !hasLocalizedStarterPack(packId);

  if (variant === 'card') {
    return (
      <a
        className="btn btn-secondary"
        href={downloadUrl(localized)}
        download
        hrefLang={localized === file ? 'en' : language}
      >
        <Tr>Download pack</Tr>
        {englishOnly && <span className="download-language-note"><Tr>(English)</Tr></span>}
      </a>
    );
  }

  return (
    <>
      <a className="btn btn-primary" href={downloadUrl(localized)} download hrefLang={localized === file ? 'en' : language}>
        <Tr>Download the pack</Tr>
      </a>
      {localized !== file && <p><Tr>The downloadable worksheet follows your selected language.</Tr></p>}
      {englishOnly && <p><Tr>This download is currently available in English only.</Tr></p>}
    </>
  );
}

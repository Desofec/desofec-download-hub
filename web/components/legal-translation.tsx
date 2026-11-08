'use client';

import type { ReactNode } from 'react';
import { useLanguage } from '@/components/language';
import de from '@/content/translations/legal-de.json';
import es from '@/content/translations/legal-es.json';
import fr from '@/content/translations/legal-fr.json';
import type { LanguageCode } from '@/lib/i18n';

type LabeledText = { label: string; text: string };
type DocumentIntro = {
  sourceDigest: string;
  title: string;
  updated: string;
  intro: string;
  contactHeading: string;
  contactLead: string;
  contactLink: string;
  contactTail: string;
};
type PrivacyDocument = DocumentIntro & {
  collectedHeading: string;
  collected: LabeledText[];
  extras: LabeledText[];
  noSale: string;
  providersHeading: string;
  providers: LabeledText[];
  newsletterHeading: string;
  newsletter: string;
  choicesHeading: string;
  choices: string;
  childrenHeading: string;
  children: string;
};
type TermsDocument = DocumentIntro & { sections: { heading: string; text: string }[] };
type LegalTranslations = {
  notice: string;
  englishOriginal: string;
  privacy: PrivacyDocument;
  terms: TermsDocument;
};

const translations: Record<Exclude<LanguageCode, 'en'>, LegalTranslations> = { fr, de, es };

function Contact({ content }: { content: DocumentIntro }) {
  return (
    <>
      <h2>{content.contactHeading}</h2>
      <p>{content.contactLead}{' '}<a href="/contact">{content.contactLink}</a>{content.contactTail}</p>
    </>
  );
}

function PrivacyContent({ content }: { content: PrivacyDocument }) {
  return (
    <>
      <h1>{content.title}</h1>
      <p className="legal-date">{content.updated}</p>
      <p>{content.intro}</p>
      <h2>{content.collectedHeading}</h2>
      <ul>
        {content.collected.map((item) => <li key={item.label}><strong>{item.label}</strong>{' '}{item.text}</li>)}
      </ul>
      {content.extras.map((item) => <p key={item.label}><strong>{item.label}</strong>{' '}{item.text}</p>)}
      <p>{content.noSale}</p>
      <h2>{content.providersHeading}</h2>
      <ul>
        {content.providers.map((item) => <li key={item.label}><strong>{item.label}</strong>{' '}{item.text}</li>)}
      </ul>
      <h2>{content.newsletterHeading}</h2>
      <p>{content.newsletter}</p>
      <h2>{content.choicesHeading}</h2>
      <p>{content.choices}</p>
      <h2>{content.childrenHeading}</h2>
      <p>{content.children}</p>
      <Contact content={content} />
    </>
  );
}

function TermsContent({ content }: { content: TermsDocument }) {
  return (
    <>
      <h1>{content.title}</h1>
      <p className="legal-date">{content.updated}</p>
      <p>{content.intro}</p>
      {content.sections.map((section) => (
        <div key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.text}</p>
        </div>
      ))}
      <Contact content={content} />
    </>
  );
}

export function LegalTranslation({ kind, children }: { kind: 'privacy' | 'terms'; children: ReactNode }) {
  const language = useLanguage();
  if (language === 'en') return <>{children}</>;

  const copy = translations[language];
  return (
    <div lang={language}>
      <p className="legal-translation-notice">{copy.notice}</p>
      {kind === 'privacy' ? <PrivacyContent content={copy.privacy} /> : <TermsContent content={copy.terms} />}
      <details className="legal-original">
        <summary>{copy.englishOriginal}</summary>
        {children}
      </details>
    </div>
  );
}

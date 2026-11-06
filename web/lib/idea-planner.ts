export type GoalMatch = { goalId: string; score: number };

// Keywords per goal in English, French, German and Spanish. Matching is local and needs no AI service.
const keywords: Record<string, string[]> = {
  'create-business-videos': ['business video', 'ai video', 'short-form video', 'short form video', 'video script', 'video editing', 'video captions', 'vidéo entreprise', 'vidéo ia', 'montage vidéo', 'unternehmensvideo', 'ki-video', 'videobearbeitung', 'video empresarial', 'vídeo ia', 'edición de vídeo'],
  'offer-content-services': ['content service', 'content agency', 'sell content', 'agence de contenu', 'service de contenu', 'content-agentur', 'content-dienstleistung', 'agencia de contenido', 'servicio de contenido'],
  'offer-cad-services': ['cad service', 'cad concept', 'service cao', 'concept cao', 'cad-dienstleistung', 'cad-konzept', 'servicio cad', 'concepto cad'],
  'validate-micro-saas': ['micro-saas', 'micro saas', 'validate saas', 'valider saas', 'saas validieren', 'validar saas'],
  'offer-education-services': ['education service', 'sell workshop', 'adult workshop', 'service de formation', 'atelier pour adultes', 'ki-schulung', 'erwachsenenworkshop', 'servicio de formación', 'taller para adultos'],
  'start-ai-business': ['small business automation', 'business automation', 'workflow automation for small business', 'automation for small business', 'appointment reminder', 'weekly business report', 'customer enquiry tracking', 'automatisation petite entreprise', 'rappel de rendez-vous', 'rapport hebdomadaire', 'terminerinnerung', 'wochenbericht', 'automatisierung für kleine unternehmen', 'recordatorio de citas', 'informe semanal', 'automatización para pequeñas empresas', 'automation agency', 'ai agency', 'automation service', 'ai business', 'sell automation', 'agence ia', 'agence automatisation', 'service automatisation', 'ki-agentur', 'automatisierungsagentur', 'ki-dienstleistung', 'agencia ia', 'agencia de automatización', 'servicio de automatización'],
  'learn-ai': ['ai', 'artificial intelligence', 'chatgpt', 'prompt', 'assistant', 'ia', 'intelligence artificielle', 'ki', 'künstliche', 'inteligencia artificial'],
  'build-website': ['website', 'web site', 'web page', 'webpage', 'landing', 'portfolio', 'blog', 'site web', 'site internet', 'webseite', 'homepage', 'sitio web', 'página web'],
  'automate-work': ['automate', 'automation', 'workflow', 'repetitive', 'zapier', 'save time', 'automatiser', 'automatisation', 'automatisieren', 'automatización', 'automatizar'],
  'learn-coding': ['code', 'coding', 'program', 'python', 'developer', 'learn to code', 'programmer', 'coder', 'programmieren', 'programar', 'programación'],
  'learn-ml': ['machine learning', 'ml', 'data science', 'model', 'dataset', 'neural', 'apprentissage automatique', 'maschinelles lernen', 'aprendizaje automático'],
  'design-cad': ['cad', 'design', '3d', 'prototype', 'print', 'product', 'simulation', 'logo', 'poster', 'prototype 3d', 'diseño', 'conception', 'konstruktion'],
  'build-app': ['app', 'application', 'mobile', 'software', 'tool', 'startup', 'saas', 'game', 'aplicación', 'anwendung', 'jeu', 'spiel', 'juego'],
  'no-code': ['no code', 'no-code', 'nocode', 'without coding', 'without code', 'database', 'airtable', 'form', 'sans code', 'ohne code', 'sin código', 'sin programar'],
  'create-content': ['content', 'video', 'youtube', 'podcast', 'social media', 'newsletter', 'voice-over', 'voiceover', 'contenu', 'vidéo', 'inhalt', 'contenido', 'vídeo'],
  'analyze-data': ['analysis', 'analyze', 'analyse', 'origin', 'originpro', 'graph', 'plot', 'measurement', 'sensor', 'statistics', 'curve fit', 'laboratory', 'analyser', 'analysieren', 'daten', 'datos', 'análisis', 'mesure'],
  'visualize-data': ['data visualization', 'visualize', 'visualise', 'chart', 'charts', 'graph', 'graphs', 'dashboard', 'visualization', 'visualisation', 'gráficos', 'visualización', 'dataviz', 'diagram'],
  'research-ai': ['research', 'literature review', 'sources', 'citations', 'academic', 'scholar', 'evidence', 'investigate', 'recherche', 'forschung', 'investigación'],
  'ai-education': ['teacher', 'teaching', 'student', 'school', 'classroom', 'lesson plan', 'tutor', 'homework', 'education', 'enseignant', 'étudiant', 'lehrer', 'schüler', 'docente', 'estudiante', 'educación'],
  'ai-small-business': ['small business', 'customer', 'marketing', 'business', 'shop', 'petite entreprise', 'client', 'kleinunternehmen', 'kunde', 'negocio', 'cliente'],
  'ai-career': ['career', 'resume', 'cv', 'job search', 'interview', 'cover letter', 'carrière', 'emploi', 'entretien', 'karriere', 'lebenslauf', 'bewerbung', 'carrera', 'currículum', 'entrevista'],
  'ai-productivity': ['productivity', 'productive', 'email', 'summarize', 'plan my', 'research', 'notes', 'productivité', 'produktivität', 'productividad', 'organize']
};

function normalize(text: string) {
  return ` ${text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ')} `;
}

export function matchGoals(idea: string, limit = 3): GoalMatch[] {
  const text = normalize(idea);
  if (text.trim().length < 3) return [];

  return Object.entries(keywords)
    .map(([goalId, words]) => ({
      goalId,
      score: words.reduce((total, word) => (text.includes(` ${word} `) || (word.length > 4 && text.includes(word)) ? total + 1 : total), 0)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

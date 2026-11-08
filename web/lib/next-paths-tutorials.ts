import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const dataVisualizationSteps: TutorialStep[] = [
  {
    id: 'start-with-a-question',
    title: 'Start with a question and choose a chart',
    explanation: [
      'A useful chart answers one clear question. A line chart shows change over time, a bar chart compares groups, a scatter plot shows the relationship between two measurements, and a histogram shows the spread of one measurement.',
      'Write down what each row represents and which columns you need. For example, a coating scan might have one row per position, with X, Y and thickness columns. Do not start by choosing colours or effects.'
    ],
    file: 'Chat prompt',
    code: `My data columns are [list columns] and each row represents [one event / one time / one location].
I want to answer: [question].
Recommend a chart type, explain why it fits, and name one misleading chart choice to avoid.`,
    check: 'You have one analysis question, know what each row means and chose a chart that can answer it.',
    aiPrompt: 'Explain when to use a line chart, bar chart, scatter plot, histogram and heat map, with one practical example for each.'
  },
  {
    id: 'prepare-data',
    title: 'Prepare a clean table',
    explanation: [
      'Keep one observation per row, one variable per column and a single header row. Use consistent units and date formats. Avoid merged cells, blank rows inside the data and totals mixed into the observations.',
      'Keep a copy of the original file. Note missing values and unusual measurements rather than silently deleting them. Use practice or anonymised data when asking an online AI assistant for help.'
    ],
    file: 'Chat prompt',
    code: `Review this sample of my table: [paste a few anonymised rows].
Check whether each row is one observation, whether column names and units are clear, and whether values are missing or inconsistent. Do not invent replacements; list questions I should answer.`,
    check: 'Your table has a clear header, consistent units and no accidental totals or blank rows mixed into the observations.',
    aiPrompt: 'What is tidy data? Show how to reshape a small table with one column per variable and one row per observation.'
  },
  {
    id: 'make-chart-colab',
    title: 'Make a chart in a free Colab notebook',
    explanation: [
      'Google Colab runs Python in your browser. Upload a CSV with the Files panel, then change the file name and column names in the short script below. It draws a labelled scatter plot and saves a high-resolution PNG.',
      'This example suits two numeric measurements, such as scan position and coating thickness. For a time series, change the x column to time and use a line plot instead.'
    ],
    file: 'Colab cell',
    code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("measurements.csv")

x_column = "Position (mm)"
y_column = "Thickness (um)"

fig, ax = plt.subplots(figsize=(8, 5))
ax.scatter(df[x_column], df[y_column], alpha=0.75)
ax.set_xlabel(x_column)
ax.set_ylabel(y_column)
ax.set_title("Thickness by scan position")
ax.grid(True, alpha=0.25)
fig.tight_layout()
fig.savefig("thickness_by_position.png", dpi=200)
plt.show()`,
    check: 'The notebook displays a chart with the correct columns and units, and saves thickness_by_position.png.',
    aiPrompt: 'Adapt this chart script to my column names [names]. Explain each change and do not add smoothing or remove points.'
  },
  {
    id: 'compare-and-map',
    title: 'Compare groups and map scan data',
    explanation: [
      'For measurements in named groups, a box plot or a bar chart with individual points can show differences. Show the sample size and units. Do not hide the individual data if the group is small.',
      'For measurements at X and Y positions, a heat map can reveal spatial patterns. Use a colour scale with a labelled legend and check the numeric range; a dramatic colour range can make a tiny difference look important.'
    ],
    file: 'Chat prompt',
    code: `I have measurements by group: [group column] and [measurement column].
Suggest a chart that shows the individual observations as well as a summary. Explain how to label sample size, units and uncertainty.`,
    check: 'You chose a chart that preserves the individual measurements and labels units and sample size.',
    aiPrompt: 'What can a heat map hide or exaggerate? Give me a checklist for choosing a fair colour scale.'
  },
  {
    id: 'tell-the-story',
    title: 'Explain the result without overstating it',
    explanation: [
      'A chart is evidence, not the whole conclusion. Write a short caption that says what is measured, the main pattern, how many observations there are and one limitation.',
      'Check the chart against the source data. Ask whether missing values, outliers, a truncated axis or a small sample changes the message. Keep the data and the steps so another person can reproduce it.'
    ],
    file: 'Chat prompt',
    code: `My chart shows [describe pattern], with [sample size] observations and units [units].
Draft a cautious two-sentence caption. Separate what the chart shows from what it cannot prove. Do not claim causation from a correlation.`,
    check: 'You have a two-sentence caption and one limitation, and verified the chart against the source table.',
    aiPrompt: 'Review my chart description for unsupported claims, especially causal language, missing context and exaggerated scale.'
  }
];

export const researchPromptingSteps: TutorialStep[] = [
  {
    id: 'define-research-question',
    title: 'Turn a topic into a research question',
    explanation: [
      'A broad topic is hard to research. Make it specific by naming the subject, context, time period and the kind of answer you need. Keep separate questions separate.',
      'An AI assistant can help narrow a question, but it does not decide which question matters. You choose the scope and define what a useful answer would look like.'
    ],
    file: 'Chat prompt',
    code: `I am researching [topic] for [purpose and audience].
Suggest 3 focused, answerable research questions. For each, list the scope, what evidence would answer it, and one important limitation. Do not answer the questions yet.`,
    check: 'You selected one focused question and can describe what evidence would answer it.',
    aiPrompt: 'Help me narrow this broad topic into one neutral, answerable question without assuming the conclusion: [topic].'
  },
  {
    id: 'find-sources',
    title: 'Find sources and check where they came from',
    explanation: [
      'Use search tools or a research assistant to discover sources, then open the original source yourself. Prefer primary documents and reputable organisations for factual claims; use recent sources when the subject changes quickly.',
      'AI-generated citations can be incomplete or made up. Confirm that each source exists, that its author and date are correct, and that it actually supports the claim.'
    ],
    file: 'Chat prompt',
    code: `For this research question: [question]
Suggest search phrases and types of reliable sources I should look for. Do not invent citations. Mark any suggested source details that need independent verification.`,
    check: 'You opened at least two real sources and confirmed their authors, dates and relevance.',
    aiPrompt: 'How can I tell whether a source is primary, secondary, reputable and current for this research question?'
  },
  {
    id: 'build-evidence-table',
    title: 'Build an evidence table',
    explanation: [
      'Make a small table with one row per source: claim, evidence, source and date, limitations, and how confident you are. This makes disagreements visible instead of blending them into one confident-sounding summary.',
      'You can use Gemini Notebook (formerly NotebookLM) or another assistant with sources you provide. Ask it to cite the exact source passage, then check the passage yourself.'
    ],
    file: 'Chat prompt',
    code: `Using only these sources I provide: [source text or verified links]
Create an evidence table with columns: claim, supporting passage, source and date, limitation, and confidence (low/medium/high). If a source does not support a claim, say so. Do not fill gaps by guessing.`,
    check: 'Your evidence table has source details and limitations, and you verified the quoted passages.',
    aiPrompt: 'Compare these two sources. Identify points they agree on, disagree on and do not address, with exact source references.'
  },
  {
    id: 'synthesise',
    title: 'Synthesize evidence, including disagreement',
    explanation: [
      'A good synthesis groups evidence by theme and explains where sources agree or differ. Keep facts, interpretations and your own conclusions distinct.',
      'Ask the AI to point out missing evidence and alternative explanations. Do not treat the number of sources as proof if they repeat the same original claim.'
    ],
    file: 'Chat prompt',
    code: `Using my verified evidence table: [paste table]
Write a short synthesis organised by theme. Separate established facts, disagreements and open questions. Cite only sources in my table and flag any claim the table does not support.`,
    check: 'Your synthesis mentions at least one limitation or disagreement and every citation points to a source you checked.',
    aiPrompt: 'Look for assumptions, missing perspectives and alternative explanations in this synthesis: [draft].'
  },
  {
    id: 'final-research-brief',
    title: 'Write a brief you can defend',
    explanation: [
      'Finish with the question, a short answer, the strongest evidence, uncertainty and links to the sources. A reader should be able to trace important statements back to the original material.',
      'If the work is for school, university or employment, follow its rules for AI assistance and citations. Disclose AI help when required, and never submit generated work as your own.'
    ],
    file: 'Chat prompt',
    code: `Turn these notes into a brief for [audience], no more than [length].
Include: question, answer, strongest verified evidence, uncertainty, and source list. Preserve the citations exactly. Do not add new claims.`,
    check: 'A reader can verify every important claim, and the brief clearly says what remains uncertain.',
    aiPrompt: 'Check my brief claim by claim against these sources and identify anything unsupported or incorrectly attributed.'
  }
];

export const aiEducationSteps: TutorialStep[] = [
  {
    id: 'set-purpose-and-rules',
    title: 'Set a safe purpose and clear rules',
    explanation: [
      'AI can support lesson planning, explanations, practice questions and study coaching. It should not replace a teacher’s professional judgement or a student’s own learning.',
      'Before using a tool, check school or course rules, account age requirements and privacy terms. Never upload student names, grades, disability details, private work or other identifying information to a public AI service.'
    ],
    file: 'Chat prompt',
    code: `I am a [teacher / student] working on [subject and age or level].
Help me create a safe AI-use plan for [task]. Include what information I must not share, what a person must review, and how to follow school rules. Do not ask for personal student data.`,
    check: 'You know which tool is allowed and can name information that must not be shared.',
    aiPrompt: 'Make a simple classroom checklist for using AI responsibly, including privacy, fact-checking and disclosure.'
  },
  {
    id: 'teacher-plan',
    title: 'Teacher route: prepare a lesson',
    explanation: [
      'A teacher can use AI to draft lesson outlines, examples and question sets. Give it the learning objective, age or level, lesson length and constraints, but no names or identifiable student records.',
      'Review every answer for accuracy, bias, reading level, accessibility and alignment with the curriculum. You make the final decision about what students receive.'
    ],
    file: 'Chat prompt',
    code: `I teach [subject] to learners at [age or level]. Create a [duration]-minute lesson outline for this learning objective: [objective].
Include a short explanation, one worked example, three practice questions at increasing difficulty, and an exit question. Use inclusive language. Flag anything I must verify; do not invent curriculum standards.`,
    check: 'You reviewed the outline, checked the facts and adjusted it for your learners.',
    aiPrompt: 'Review this lesson for accessibility, unintended bias, factual claims and whether each activity supports the stated objective.'
  },
  {
    id: 'student-tutor',
    title: 'Student route: use AI as a tutor',
    explanation: [
      'Ask the AI to coach you instead of doing the assignment. Tell it the concept you are learning and ask for one question at a time, hints before answers and feedback on your reasoning.',
      'Try to answer in your own words. Verify important facts with class materials or trusted sources, and follow your teacher’s rules about AI.'
    ],
    file: 'Chat prompt',
    code: `Act as a patient tutor helping me learn [concept] at [level].
Ask one question at a time. Give me a hint before the answer, and ask me to explain my thinking. Do not write my assignment or pretend my work is mine. Correct misunderstandings kindly.`,
    check: 'You solved a practice question yourself and can explain the idea without copying the AI response.',
    aiPrompt: 'Quiz me on [concept] with five questions, one at a time. Wait for my answer before giving a hint.'
  },
  {
    id: 'feedback-and-practice',
    title: 'Create practice and useful feedback',
    explanation: [
      'AI can generate extra practice at different difficulty levels and explain a worked example in another way. Ask it to show the answer key separately so learners can attempt the questions first.',
      'Feedback should point to a specific next step, not label a learner. A teacher should check the questions and answers before using them.'
    ],
    file: 'Chat prompt',
    code: `Create 5 practice questions about [topic] at [level], from easier to harder. Put the answer key in a separate section with a short explanation for each. Include one common misconception and how to address it. I will review before sharing.`,
    check: 'You checked every practice question and answer, and the difficulty matches the learner.',
    aiPrompt: 'Turn this feedback into one encouraging comment that names one strength and one concrete next step: [feedback].'
  },
  {
    id: 'reflect-and-disclose',
    title: 'Reflect, verify and disclose AI help',
    explanation: [
      'Keep a short note of how AI helped: brainstorm, explanation, practice, editing or feedback. Check the rules for the class or institution, then disclose the assistance if required.',
      'For students, the learning goal is understanding, not just a polished answer. For teachers, the goal is useful support while keeping student privacy and professional judgement central.'
    ],
    file: 'Chat prompt',
    code: `Help me write a short, honest note about my AI use.
I used AI for: [brainstorming / explanation / practice / editing].
I checked the result by: [my steps].
Follow my course's disclosure rules: [rules]. Do not claim I did work that I did not do.`,
    check: 'You can explain what AI contributed, what you checked and whether disclosure is required.',
    aiPrompt: 'Help me check my work for understanding: ask me to explain the main idea without looking at the AI answer.'
  }
];

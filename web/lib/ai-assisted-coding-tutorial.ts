import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const aiAssistedCodingSteps: TutorialStep[] = [
  {
    id: 'pick-assistant',
    title: 'Pick an assistant and set it up',
    explanation: [
      'An AI coding assistant is a helper that suggests and explains code. Two good choices are GitHub Copilot (works inside VS Code) and OpenAI Codex. Pick one. You do not need both.',
      'In VS Code, open the Extensions panel, search for GitHub Copilot, install it and sign in with your GitHub account. Then create a folder called ai-practice and add a file called palindrome.py. Your project is ready.'
    ],
    check: 'You can open the assistant chat in VS Code and send it a message such as "hello", and it replies.',
    aiPrompt: 'I am a beginner using VS Code. What can you help me with, and what should I always double-check myself?'
  },
  {
    id: 'clear-prompt',
    title: 'Describe one small task with a clear prompt',
    explanation: [
      'The better your prompt, the better the help. A clear prompt says what you want, which language to use, and any rules. Ask for one small thing at a time.',
      'Compare a vague prompt, "make a word checker", with a clear one. The clear one names the function, the input and the expected output. Send the prompt below to your assistant.'
    ],
    file: 'Chat prompt',
    code: `Write a Python function is_palindrome(text) that returns True if the text reads the same forwards and backwards, ignoring spaces and capital letters. Add 3 example calls with print(). Keep it simple for a beginner.`,
    check: 'The assistant gives you a short function and three example calls. Paste the code into palindrome.py.',
    aiPrompt: 'Help me improve this prompt so it is clearer. Ask me questions if anything is missing.'
  },
  {
    id: 'understand-code',
    title: 'Read and understand the generated code',
    explanation: [
      'Never run code you do not understand. AI can be confidently wrong, and you are the one responsible for what ships.',
      'Read the code from top to bottom. For every line you cannot explain, ask the assistant. Your goal is to be able to describe the whole function in your own words.'
    ],
    file: 'Chat prompt',
    code: `Explain this function line by line for a beginner. Then ask me 2 questions to check my understanding. Do not change the code.`,
    check: 'You can explain, without looking, what each line does and why spaces and capitals are removed first.',
    aiPrompt: 'Quiz me on this code with 3 short questions and tell me if my answers are right.'
  },
  {
    id: 'run-test',
    title: 'Run it and write a simple test',
    explanation: [
      'A test checks that your code does what you expect. An assert statement does nothing when it is true, and stops the program with an error when it is false.',
      'Add these lines at the bottom of palindrome.py, below the function, and run the file. If everything is right, you see only your own printed message.'
    ],
    file: 'palindrome.py',
    code: `assert is_palindrome("level") is True
assert is_palindrome("Never odd or even") is True
assert is_palindrome("hello") is False
assert is_palindrome("") is True
print("All tests passed!")`,
    check: 'The terminal prints: All tests passed! If you see an AssertionError, a test found a real problem, which is the point of testing.',
    aiPrompt: 'Suggest 4 more edge cases to test for is_palindrome, such as punctuation, and explain why each matters.'
  },
  {
    id: 'find-bugs',
    title: 'Ask the assistant to find bugs',
    explanation: [
      'Punctuation is a good bug to look for. Try the assert below. If it fails, your function does not ignore commas and full stops yet.',
      'Instead of asking the assistant to just fix it, ask it to explain the bug first. Then apply the fix yourself and run your tests again.'
    ],
    file: 'palindrome.py',
    code: `assert is_palindrome("A man, a plan, a canal: Panama") is True`,
    check: 'You understand why the test failed (or passed), and after the fix every test passes again.',
    aiPrompt:
      'This assert fails for my is_palindrome function. First explain why in simple words, then show the smallest change that fixes it.'
  },
  {
    id: 'refactor',
    title: 'Refactor for clear names and small functions',
    explanation: [
      'Refactoring means improving how code reads without changing what it does. Clear names and small functions make code easier to trust and change.',
      'Ask the assistant for a cleaner version, then compare it with yours. Run your tests again. If they still pass, the behavior is unchanged.'
    ],
    file: 'Chat prompt',
    code: `Refactor my is_palindrome function for clearer names and a small helper function. Do not change behavior. Explain each change in one sentence.`,
    check: 'Your tests still print All tests passed! after the refactor, and you can explain what was renamed or moved.',
    aiPrompt: 'What makes a variable name clear? Give me 3 good and bad examples from my code.'
  },
  {
    id: 'commit-reflect',
    title: 'Commit with Git and note what you learned',
    explanation: [
      'Save your work with a clear commit message, then write down what you learned. Notes turn a practice session into lasting skill.',
      'Run these commands in the VS Code terminal. Then write three lines: what the AI got right, what it got wrong, and what you would ask differently next time.'
    ],
    file: 'Terminal',
    code: `git init
git add palindrome.py
git commit -m "Add palindrome checker with tests"`,
    check: 'git log shows your commit, and you wrote three lines of notes about working with the assistant.',
    aiPrompt: 'Help me write a good commit message for these changes, and explain why a clear message matters.'
  }
];

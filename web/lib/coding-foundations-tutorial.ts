import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const codingFoundationsSteps: TutorialStep[] = [
  {
    id: 'setup',
    title: 'Set up and run your first program',
    explanation: [
      'Install Visual Studio Code (a free editor) from code.visualstudio.com and Python from python.org. On Windows, tick "Add Python to PATH" in the installer.',
      'In VS Code, create a folder called my-first-python, open it, and add a new file called main.py. Paste the code below, then press the Run (play) button at the top right.'
    ],
    file: 'main.py',
    code: `print("Hello, world!")`,
    check: 'A terminal opens at the bottom of VS Code and shows: Hello, world!',
    aiPrompt: 'I just installed Python and VS Code. What does print() do? Explain it like I am new to coding.'
  },
  {
    id: 'variables',
    title: 'Variables, types and output',
    explanation: [
      'A variable is a labeled box that holds a value. Python has a few basic types: text (str), whole numbers (int), decimals (float) and True/False (bool).',
      'An f-string, written f"...", lets you drop variables into text by putting them inside curly braces.'
    ],
    file: 'main.py',
    replaceAll: true,
    code: `name = "Ada"
age = 12
height = 1.45
likes_coding = True

print(f"{name} is {age} years old.")
print(f"Height: {height} metres")
print(f"Likes coding: {likes_coding}")
print(type(age))`,
    check: 'Four lines appear. The last one says <class \'int\'>. Now change name and age to your own and run it again.',
    aiPrompt: 'Explain str, int, float and bool in Python with one everyday example of each.'
  },
  {
    id: 'conditions-loops',
    title: 'Conditions and loops',
    explanation: [
      'An if statement lets your program choose. A for loop repeats work. Python uses indentation (4 spaces) to know which lines belong inside.',
      'Here, the loop counts from 1 to 5 and the if/else decides whether each number is even or odd. The % symbol gives the remainder after division.'
    ],
    file: 'main.py',
    replaceAll: true,
    code: `for number in range(1, 6):
    if number % 2 == 0:
        print(number, "is even")
    else:
        print(number, "is odd")`,
    check: 'You see five lines, alternating odd and even, starting with "1 is odd". Change 6 to 11 and confirm it counts to 10.',
    aiPrompt: 'Explain what range(1, 6) produces and why the loop stops at 5.'
  },
  {
    id: 'functions-lists',
    title: 'Functions and lists',
    explanation: [
      'A function is a reusable recipe. You define it once with def and use it as often as you like. A list holds many values in order.',
      'This program keeps a shopping list and uses a function to describe it. Notice how append adds an item and len counts them.'
    ],
    file: 'main.py',
    replaceAll: true,
    code: `def describe(items):
    return f"You have {len(items)} items: " + ", ".join(items)

shopping = ["bread", "milk"]
shopping.append("apples")

print(describe(shopping))
print("First item:", shopping[0])`,
    check: 'It prints: You have 3 items: bread, milk, apples. Add one more item of your own and see the count change.',
    aiPrompt: 'Explain how the describe function takes input and returns output, using a vending machine analogy.'
  },
  {
    id: 'git-github',
    title: 'Track your code with Git and GitHub',
    explanation: [
      'Git saves snapshots of your project so you can go back if something breaks. GitHub keeps a copy online so you can share it.',
      'Install Git from git-scm.com, create a free GitHub account, and make an empty repository named my-first-python (replace YOUR-NAME in the commands below with your GitHub username). Then run these commands in the VS Code terminal, one at a time.'
    ],
    file: 'Terminal',
    code: `git init
git add main.py
git commit -m "My first Python project"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/my-first-python.git
git push -u origin main`,
    check: 'Refresh your repository page on GitHub. You can see main.py and your commit message.',
    aiPrompt: 'Explain what git init, git add, git commit and git push each do, in plain words.'
  },
  {
    id: 'ai-explain',
    title: 'Ask an AI assistant to explain code',
    explanation: [
      'AI assistants such as GitHub Copilot or OpenAI Codex are great tutors when you ask them to explain, not just to write. Understanding the code is how you grow.',
      'Paste your functions-and-lists program into the assistant with the prompt below, and read the answer before you move on. If something is unclear, ask a follow-up question.'
    ],
    check: 'You can explain in your own words what each line of your program does.',
    aiPrompt:
      'Explain this Python program line by line for a beginner. Then ask me 3 short questions to check that I understood it. Do not change the code.'
  },
  {
    id: 'mini-project',
    title: 'Build and share a mini project',
    explanation: [
      'Put it all together with a number guessing game. It uses a variable, a loop, conditions and a function from the earlier steps.',
      'Run it, play it, then change it: make the range bigger or add a limit of 5 guesses. Commit your changes with Git and share the GitHub link with a friend.'
    ],
    file: 'main.py',
    replaceAll: true,
    code: `import random

secret = random.randint(1, 20)

def check(guess):
    if guess < secret:
        return "Too low"
    if guess > secret:
        return "Too high"
    return "Correct!"

while True:
    answer = input("Guess a number from 1 to 20: ")
    if not answer.isdigit():
        print("Please type a number.")
        continue
    result = check(int(answer))
    print(result)
    if result == "Correct!":
        break`,
    check: 'You can play the game to the end, and typing letters does not crash it. You pushed the new version to GitHub.',
    aiPrompt: 'Here is my guessing game. Help me add a limit of 5 guesses, one small change at a time, and explain each change.'
  }
];

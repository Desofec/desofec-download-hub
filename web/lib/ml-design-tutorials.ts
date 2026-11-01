import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const mlFoundationsSteps: TutorialStep[] = [
  {
    id: 'ml-basics',
    title: 'Learn the basics of machine learning',
    explanation: [
      'Machine learning (ML) is a way to teach a computer to find patterns in examples, instead of writing every rule by hand. Show it many photos labeled "cat" or "dog" and it learns to tell them apart.',
      'Three words to know: data (the examples), a model (what learns the pattern) and a prediction (the model\u2019s answer for something new).'
    ],
    file: 'Chat prompt',
    code: `Explain machine learning to a complete beginner using the example of recognizing spam email. Define data, model, training and prediction in one sentence each.`,
    check: 'You can explain data, model and prediction in your own words.',
    aiPrompt: 'What is the difference between normal programming and machine learning? Use a simple example.'
  },
  {
    id: 'data-patterns',
    title: 'Understand data and patterns',
    explanation: [
      'A model is only as good as its data. Each row is an example, and each column is a feature, which is a fact about it. The label is the answer you want to predict.',
      'The famous iris dataset has measurements of flowers (the features) and the flower type (the label). You will use it in the next step.'
    ],
    check: 'You can name the features and the label for this example: predicting house prices from size and location.',
    aiPrompt: 'Give me 3 small datasets I could imagine for ML, and name the features and label for each.'
  },
  {
    id: 'try-notebook',
    title: 'Try a notebook',
    explanation: [
      'Open colab.research.google.com and create a new notebook. Colab runs Python in your browser for free, so you install nothing. A notebook is made of cells that you run one at a time with the play button.',
      'Paste this into a cell and run it. It trains a small model on the iris data, then tests it on flowers it has never seen.'
    ],
    file: 'Colab cell',
    code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

data = load_iris()
x_train, x_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.3, random_state=42
)

model = KNeighborsClassifier(n_neighbors=3)
model.fit(x_train, y_train)

print("Accuracy:", model.score(x_test, y_test))
print("Flower types:", list(data.target_names))`,
    check: 'It prints an accuracy close to 1.0 (100%) and the three flower types. Accuracy is the share of correct predictions on new data.',
    aiPrompt: 'Explain each line of this Colab cell for a beginner, especially train_test_split and why we keep test data separate.'
  },
  {
    id: 'practice',
    title: 'Practice with examples',
    explanation: [
      'Change one thing at a time and see what happens. Try n_neighbors=1 and n_neighbors=15, or change test_size. Notice how the accuracy moves.',
      'When you are ready for more, kaggle.com has free datasets and beginner courses. Remember that a high score on a small dataset does not prove a model works in the real world.'
    ],
    check: 'You tried at least two different settings and wrote down what changed.',
    aiPrompt: 'Suggest 3 small ML experiments I can try on the iris dataset, and what I should learn from each.'
  }
];

export const designBasicsSteps: TutorialStep[] = [
  {
    id: 'design-principles',
    title: 'Learn basic design principles',
    explanation: [
      'Good design is clear before it is pretty. Five ideas cover most beginner needs: contrast (things that matter stand out), alignment (things line up), repetition (similar things look alike), spacing (room to breathe) and hierarchy (the most important thing is the biggest).',
      'Look at a poster or app you like and point to each of the five ideas.'
    ],
    check: 'You found an example of contrast and an example of hierarchy in something you use.',
    aiPrompt: 'Explain contrast, alignment, repetition, spacing and hierarchy with one real-world example each.'
  },
  {
    id: 'sketch-choose-tool',
    title: 'Sketch an idea and choose a tool',
    explanation: [
      'Start with a simple object you can describe in one sentence, such as a phone stand, a pen holder or a small box with a lid. Sketch it from the front and the side and write the key sizes in millimetres.',
      'Pick a tool for the job. For flat visuals, use Canva or Figma. For 3D objects, beginners can start with a simple browser tool such as Tinkercad, then move to Fusion 360 when they need precise parts. Check each tool\u2019s current free or personal-use terms.'
    ],
    check: 'You have a two-view sketch with sizes, and you chose one tool.',
    aiPrompt: 'Help me turn this idea into a list of measurements and a simple shape plan: [describe your object].'
  },
  {
    id: 'build-prototype',
    title: 'Build a simple prototype',
    explanation: [
      'Build the shape in your tool, starting with the biggest, simplest form and adding detail later. Save often, and use clear names for parts.',
      'AI can help in two ways: it can explain the steps for your tool, and some newer tools can generate a 3D model from a plain-language description. Treat generated models as a first draft, because you must check the sizes and whether the part can actually be made.'
    ],
    file: 'Chat prompt',
    code: `I am a beginner using [your tool]. Give me step-by-step instructions to model a phone stand 80 mm wide, 100 mm tall and 60 mm deep, with a 12 mm slot for the phone. Use the tool's real menu names, and tell me if you are unsure about any step.`,
    check: 'You have a 3D or visual prototype whose measured sizes match your sketch.',
    aiPrompt: 'My model looks different from the instructions. Here is what I see: [describe it]. What did I probably do differently?'
  },
  {
    id: 'cad-ai-simulation',
    title: 'Go further: text-to-CAD and simulation',
    explanation: [
      'Some newer tools can create a 3D part from a text prompt, for example a "text-to-CAD" service such as Zoo. Describe the part clearly: shape, sizes in millimetres, holes and units. Always check the dimensions in the result before using it.',
      'Professional CAD tools such as Fusion 360 and Onshape can also run simulations, for example to see where a part bends or breaks under a load. Beginners should start with a simple static stress test on one part. Features and free limits change, so read each tool\u2019s current documentation first.',
      'Important: a simulation is only an estimate. For anything safety-related, such as something that carries weight or people, ask a qualified engineer to check it.'
    ],
    file: 'Text-to-CAD prompt',
    code: `Create a rectangular bracket 60 mm long, 30 mm wide and 5 mm thick, made of one piece, with two 6 mm holes centered 10 mm from each end. Units are millimetres.`,
    check: 'You generated or modelled the bracket, measured it against the prompt and tried one simple simulation, such as a downward force on one end.',
    aiPrompt: 'Explain in simple terms what a static stress simulation shows, what "factor of safety" means and what its limits are.'
  },
  {
    id: 'feedback-refine',
    title: 'Gather feedback and refine',
    explanation: [
      'Show your prototype to two people and ask: what is it, what would you change and what confuses you? Do not defend your design. Just write their answers down.',
      'Choose one change, make a new version and name it v2. If you plan to 3D print it, test a small version first.'
    ],
    check: 'You collected feedback from two people and made a v2 with one clear change.',
    aiPrompt: 'Give me 5 good questions to ask people when I show them a design prototype.'
  }
];

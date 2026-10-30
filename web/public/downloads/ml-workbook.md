# ML Foundations Workbook

By Desofec AI Studio. Understand machine learning concepts and run small experiments.

## Part 1: Key ideas
- **Model**: a function that maps inputs to predictions.
- **Features and labels**: inputs you give vs. the answer you want predicted.
- **Training vs. testing**: learn on one set of data, evaluate on unseen data.
- **Overfitting**: memorizing the training data instead of learning patterns.
- **Metrics**: accuracy, precision, recall, error (e.g. MAE).

Exercise: for "predict house price", list three features and the label.

## Part 2: Data thinking
1. What question are you answering?
2. Where does the data come from, and is it biased?
3. What is missing, duplicated or wrong?
4. Could the model cause harm if it is wrong?

## Part 3: Experiments
1. **Baseline**: predict the average (or most common class). Any real model must beat it.
2. **Train/test split**: hold out 20% of data and report the score on it only.
3. **Compare**: try a simple model, then a slightly more complex one. Record both scores.
4. **Inspect errors**: look at 10 wrong predictions and describe what they have in common.

## Part 4: Experiment log template
| Date | Data | Model | Score | What I learned |
|------|------|-------|-------|----------------|

## Suggested next steps
Try a free beginner dataset (for example, Iris or Titanic) in a notebook environment, and explain your results in plain language.

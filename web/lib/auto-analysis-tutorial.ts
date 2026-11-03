import type { TutorialStep } from '@/lib/task-tracker-tutorial';

// Runs in a free Google Colab notebook, where pandas and matplotlib are already installed.
export const autoAnalysisSteps: TutorialStep[] = [
  {
    id: 'choose-route',
    title: 'Choose your automation route',
    explanation: [
      'Clicking through menus and settings is slow when you repeat the same analysis every day. There are three easy ways to automate it. A short Python script in Google Colab is free and repeatable. An AI data assistant can analyse a file you upload by chatting. Origin can repeat a saved analysis with templates and batch processing.',
      'This tutorial uses the first route, because a script does exactly the same steps every time, and you can read and check it. You only run it. You do not need to write it yourself, since an AI assistant can write and explain it for you.',
      'Open colab.research.google.com and create a new notebook. Then ask an AI assistant to explain what you are about to do.'
    ],
    file: 'Chat prompt',
    code: `I measure [pump flow and pressure / coating thickness scans] and want to automate the analysis instead of using software menus.
Explain in simple words how a Python script in Google Colab could import my CSV file, calculate statistics, draw a graph and save a report. Do not write code yet.`,
    check: 'You have a blank Colab notebook open and can say in one sentence why a script is easier to repeat than menu clicks.',
    aiPrompt: 'What are the pros and cons of Python scripts, Excel formulas and analysis software for repeated measurement analysis?'
  },
  {
    id: 'colab-data',
    title: 'Create safe practice data in Colab',
    explanation: [
      'Paste the script below into a Colab cell and press the play button. It creates pump_log.csv and scan_map.csv in the Files panel (the folder icon on the left). They are made-up numbers, so nothing confidential is involved.',
      'To use your own files later, drag them into the Files panel. Before sharing real data with any online AI tool, remove or rename anything confidential.'
    ],
    file: 'Colab cell 1',
    code: `import csv, math, random
random.seed(1)
with open("pump_log.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["Time (s)", "Flow rate (mL/min)", "Pressure (kPa)"])
    for t in range(0, 1201, 2):
        flow = 20 + 0.4 * math.sin(t / 40) + random.gauss(0, 0.15)
        if 600 <= t <= 640:
            flow -= 1.5
        pressure = 150 + 0.8 * (flow - 20) * 10 + random.gauss(0, 1.2)
        w.writerow([t, round(flow, 3), round(pressure, 2)])
with open("scan_map.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["X (mm)", "Y (mm)", "Thickness (um)"])
    for x in range(0, 101, 5):
        for y in range(0, 51, 5):
            z = 80 + 0.03 * x + 2 * math.exp(-((x - 20) ** 2 + (y - 25) ** 2) / 150) + random.gauss(0, 0.4)
            w.writerow([x, y, round(z, 2)])`,
    check: 'You can see pump_log.csv and scan_map.csv in the Colab Files panel.',
    aiPrompt: 'Explain this script line by line for a beginner who has never programmed.'
  },
  {
    id: 'pump-script',
    title: 'Analyse a pump log with one script',
    explanation: [
      'This script reads the pump log, finds the mean flow, the standard deviation and the coefficient of variation (CV %), counts how many points leave a tolerance band around the target, adds up the delivered volume and saves a graph called flow_report.png.',
      'Change only the three settings at the top: the file name, the target flow and the tolerance in percent. Everything else adapts to your data. Paste it into a new cell and run it.'
    ],
    file: 'Colab cell 2',
    code: `import pandas as pd
import matplotlib.pyplot as plt

FILE = "pump_log.csv"
TARGET = 20.0
TOLERANCE_PERCENT = 3.0

df = pd.read_csv(FILE)
time_col, flow_col, pressure_col = df.columns[:3]

mean = df[flow_col].mean()
std = df[flow_col].std()
cv = std / mean * 100
low = TARGET * (1 - TOLERANCE_PERCENT / 100)
high = TARGET * (1 + TOLERANCE_PERCENT / 100)
outside = df[(df[flow_col] < low) | (df[flow_col] > high)]

minutes = df[time_col] / 60
volume_ml = (df[flow_col] * minutes.diff().fillna(0)).sum()

print(f"Mean flow: {mean:.2f}  SD: {std:.3f}  CV: {cv:.2f} %")
print(f"Points outside +/-{TOLERANCE_PERCENT}% of target: {len(outside)} of {len(df)}")
print(f"Total volume delivered: {volume_ml:.1f} mL")

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(df[time_col], df[flow_col], label="Flow")
ax.axhline(TARGET, linestyle="--", label="Target")
ax.axhspan(low, high, alpha=0.15, label="Tolerance")
ax.set_xlabel(time_col)
ax.set_ylabel(flow_col)
ax.legend()
fig.tight_layout()
fig.savefig("flow_report.png", dpi=150)`,
    check: 'It prints the mean, SD, CV %, the number of points outside the tolerance and the total volume, and you can open flow_report.png.',
    aiPrompt: 'Why does this script use the first three columns by position? What could go wrong if my file has the columns in a different order?'
  },
  {
    id: 'scan-script',
    title: 'Analyse a scanner map with one script',
    explanation: [
      'Scanner data is a list of X, Y and value rows. This script turns it into a grid, prints the mean, spread and range, lists the three points furthest from the mean (often the weak spots) and saves a colour map called scan_map.png.',
      'Even colour means an even coating. A single bright or dark patch is worth a look at the real product. A script gives the same numbers every time, which makes runs easy to compare.'
    ],
    file: 'Colab cell 3',
    code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("scan_map.csv")
x, y, z = df.columns[:3]
grid = df.pivot_table(index=y, columns=x, values=z)

mean = df[z].mean()
std = df[z].std()
print(f"Mean: {mean:.2f}  SD: {std:.2f}  CV: {std / mean * 100:.2f} %")
print(f"Min: {df[z].min():.2f}  Max: {df[z].max():.2f}  Range: {df[z].max() - df[z].min():.2f}")
worst = df.loc[(df[z] - mean).abs().nlargest(3).index, [x, y, z]]
print("Furthest from the mean:")
print(worst.to_string(index=False))

fig, ax = plt.subplots(figsize=(8, 4))
image = ax.imshow(grid, origin="lower", aspect="auto",
                  extent=[grid.columns.min(), grid.columns.max(), grid.index.min(), grid.index.max()])
fig.colorbar(image, label=z)
ax.set_xlabel(x)
ax.set_ylabel(y)
fig.tight_layout()
fig.savefig("scan_map.png", dpi=150)`,
    check: 'You see the statistics, the three furthest points and a colour map of the scan.',
    aiPrompt: 'Suggest three other ways to judge coating uniformity from a thickness map, and how I would add each to this script.'
  },
  {
    id: 'ai-analyst',
    title: 'Or let an AI data assistant do it',
    explanation: [
      'If you do not want to run code at all, some AI assistants can analyse an uploaded file and draw charts, for example ChatGPT with data analysis or a data-focused assistant such as Julius AI. Check each tool for current features, limits and privacy terms.',
      'Upload only practice or anonymised data. Ask for the exact steps it used, and compare its numbers with your script. If the two disagree, find out why before trusting either one.'
    ],
    file: 'Chat prompt',
    code: `I uploaded pump_log.csv (time in seconds, flow in mL/min, pressure in kPa). The target flow is 20 mL/min.
Calculate the mean, standard deviation and CV %, find any dips below 3% of target, and plot flow with the target line. Then show me the exact steps or code you used so I can check them.`,
    check: 'The AI assistant gave you numbers and a chart, and they match your script.',
    aiPrompt: 'What are the risks of trusting an AI data assistant with my results, and how can I verify them quickly?'
  },
  {
    id: 'batch-runs',
    title: 'Analyse many files at once',
    explanation: [
      'Here automation pays off. This script analyses every file whose name starts with pump_ and ends with .csv and saves one summary table, summary.csv, with one row per run.',
      'To test it, duplicate pump_log.csv in the Files panel and name the copy pump_run2.csv. Run the script and you get two rows. With real work, drop a new log into the folder each day and run the cell again.'
    ],
    file: 'Colab cell 4',
    code: `import glob
import pandas as pd

rows = []
for path in sorted(glob.glob("pump_*.csv")):
    df = pd.read_csv(path)
    flow = df.iloc[:, 1]
    rows.append({"file": path, "mean": flow.mean(), "sd": flow.std(),
                 "cv_percent": flow.std() / flow.mean() * 100,
                 "min": flow.min(), "max": flow.max()})

summary = pd.DataFrame(rows).round(3)
summary.to_csv("summary.csv", index=False)
print(summary.to_string(index=False))`,
    check: 'summary.csv has one row for each pump file, and the numbers are the same as your single-file results.',
    aiPrompt: 'Extend this script so that it also adds the total delivered volume and flags any run with a CV % above 3.'
  },
  {
    id: 'adapt-validate',
    title: 'Adapt it with AI, then validate',
    explanation: [
      'To adapt a script to your own file, paste its first rows and the script into an AI assistant and ask for the change. Run the new version on practice data first.',
      'Always validate. Calculate one number by hand or in a spreadsheet, or in Origin, and compare. If you want Origin graphs, export summary.csv and import it into Origin. A script and Origin make a strong pair: the script does the daily numbers, and Origin makes publication graphs.'
    ],
    file: 'Chat prompt',
    code: `Here are the first 5 rows of my file: [paste rows, with any confidential values changed].
Here is my script: [paste script].
Change the script so it reads my column names, which are: [names]. Keep everything else the same and explain what you changed.`,
    check: 'You adapted the script to a second file layout and confirmed one result with a second method.',
    aiPrompt: 'Give me a short checklist to validate an automated analysis before I use it for real decisions.'
  }
];

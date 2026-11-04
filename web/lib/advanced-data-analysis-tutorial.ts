import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const advancedDataAnalysisSteps: TutorialStep[] = [
  {
    id: 'define-analysis-plan',
    title: 'Define a defensible analysis plan',
    explanation: [
      'Before opening Origin or Colab, write down the question, the measurement unit, the valid operating window and the rule for flagging unusual data. Keep those rules separate from the results so you do not change them just to get a preferred answer.',
      'For a coating line, you might examine pump stability during a defined run window and compare scanner-reported areal mass loading across the web width. Confirm whether the scanner reports mass loading directly. Thickness is not mass loading unless a validated calibration or material model supports that conversion.'
    ],
    file: 'Analysis plan',
    code: `Question: [what decision should this analysis support?]
Input files and columns: [names and units]
Valid time window / scan area: [define before looking at results]
Target and limits: [approved specification; leave blank if unknown]
Rules for missing, duplicated or flagged readings: [document; do not silently delete]
Independent repeat runs: [how many and how identified]
Checks before reporting: [second method, calibration, instrument status]`,
    check: 'Your plan defines the question, units, window, any approved limits and how flagged readings will be handled.',
    aiPrompt: 'Review this measurement-analysis plan for missing assumptions and ambiguous units. Do not invent specification limits: [paste plan].'
  },
  {
    id: 'audit-raw-data',
    title: 'Audit raw data before calculating',
    explanation: [
      'Start with an untouched copy of the instrument export. Check column names, numeric parsing, missing values, duplicated timestamps and sampling intervals before filtering or smoothing anything. A warning is a reason to investigate, not permission to delete a row.',
      'This Colab cell expects a pump_log.csv with the exact column names shown. Adapt the names to your file and keep the original file unchanged. The same checks can be done in Origin by reviewing the imported worksheet and sorting or filtering only a copied worksheet.'
    ],
    file: 'Colab cell',
    code: `import pandas as pd

df = pd.read_csv("pump_log.csv")
required = ["Time (s)", "Flow rate (mL/min)", "Pressure (kPa)"]
missing_columns = [name for name in required if name not in df.columns]
if missing_columns:
    raise ValueError(f"Missing columns: {missing_columns}")

for name in required:
    df[name] = pd.to_numeric(df[name], errors="coerce")

time = df["Time (s)"]
print("Rows:", len(df))
print("Missing or non-numeric values:")
print(df[required].isna().sum())
print("Duplicate timestamps:", int(time.duplicated().sum()))
print("Time goes backwards:", bool((time.diff().dropna() < 0).any()))
print("Observed time-step counts:")
print(time.diff().dropna().value_counts().sort_index().head(10))

# Keep flagged rows in the source; investigate before deciding what to exclude.
print("Flagged rows to review:")
print(df[df[required].isna().any(axis=1)].head(10))`,
    check: 'The audit prints row count, missing values, duplicate timestamps, ordering and time-step counts without silently dropping data.',
    aiPrompt: 'Explain these data-quality checks and suggest what I should investigate. Do not recommend deleting a measurement without explaining the risk: [paste anonymised output].'
  },
  {
    id: 'segment-pump-runs',
    title: 'Measure pump stability by time window',
    explanation: [
      'One average for an entire run can hide a short disturbance or a gradual drift. Summarise flow and pressure in fixed time windows, then inspect the table and graph alongside the raw signal. The example uses two-minute windows; choose a window based on the process question and sampling rate, not because it gives a preferred result.',
      'CV is standard deviation divided by the mean and is only useful when the mean is meaningfully above zero. It is a descriptive measure, not an acceptance limit. Use limits approved for your process, and do not treat densely sampled points as independent repeat runs.'
    ],
    file: 'Colab cell',
    code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("pump_log.csv")
time_col = "Time (s)"
flow_col = "Flow rate (mL/min)"
pressure_col = "Pressure (kPa)"
window_seconds = 120

for name in [time_col, flow_col, pressure_col]:
    df[name] = pd.to_numeric(df[name], errors="coerce")
invalid = df[[time_col, flow_col, pressure_col]].isna().any(axis=1)
if invalid.any():
    raise ValueError(f"Review {int(invalid.sum())} flagged rows before analysis; no rows were removed")
df = df.copy()
df["Window (min)"] = (df[time_col] // window_seconds).astype(int)

summary = df.groupby("Window (min)").agg(
    flow_mean=(flow_col, "mean"),
    flow_sd=(flow_col, "std"),
    pressure_mean=(pressure_col, "mean"),
    pressure_sd=(pressure_col, "std"),
    readings=(flow_col, "size")
)
summary["flow_cv_percent"] = 100 * summary["flow_sd"] / summary["flow_mean"].abs()
print(summary.round(3).to_string())

fig, ax = plt.subplots(figsize=(9, 4))
ax.plot(df[time_col] / 60, df[flow_col], alpha=0.45, label="Raw flow")
ax.plot(summary.index * window_seconds / 60, summary["flow_mean"], marker="o", label="Window mean")
ax.set(xlabel="Time (min)", ylabel=flow_col, title="Pump flow by time window")
ax.legend()
ax.grid(True, alpha=0.25)
fig.tight_layout()
plt.show()`,
    check: 'You compared time-window summaries with the raw trace and recorded any drift or disturbance without calling it a failure unless an approved limit says so.',
    aiPrompt: 'Help me interpret these windowed flow and pressure summaries. Separate observed patterns from possible causes, and do not infer a process limit: [paste anonymised table].'
  },
  {
    id: 'map-loading-uniformity',
    title: 'Map coating uniformity and mass loading',
    explanation: [
      'For scanner data, keep the X and Y coordinates, units and measured quantity together. If the instrument outputs areal mass loading, calculate its distribution and map it directly. If it outputs thickness, do not label it mass loading without a validated calibration that accounts for the material and measurement method.',
      'A mean alone can hide a narrow low-loading region. Review the map, percentiles, range and the locations of values that need investigation. A colour scale helps locate patterns but does not replace checking the underlying numbers.'
    ],
    file: 'Colab cell',
    code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("scan_map.csv")
x_col, y_col, value_col = "X (mm)", "Y (mm)", "Mass loading (mg/cm2)"
for name in [x_col, y_col, value_col]:
    df[name] = pd.to_numeric(df[name], errors="coerce")
invalid = df[[x_col, y_col, value_col]].isna().any(axis=1)
if invalid.any():
    raise ValueError(f"Review {int(invalid.sum())} flagged rows before mapping; no rows were removed")
df = df.copy()

values = df[value_col]
mean = values.mean()
print(f"Points: {len(df)}")
print(f"Mean: {mean:.3f} mg/cm2")
print(f"SD: {values.std():.3f} mg/cm2")
print(f"CV: {100 * values.std() / abs(mean):.2f} %")
print(f"5th / 50th / 95th percentiles: {values.quantile([.05, .5, .95]).round(3).to_dict()}")

grid = df.pivot_table(index=y_col, columns=x_col, values=value_col, aggfunc="mean")
fig, ax = plt.subplots(figsize=(9, 4))
image = ax.imshow(grid, origin="lower", aspect="auto",
                  extent=[grid.columns.min(), grid.columns.max(), grid.index.min(), grid.index.max()])
fig.colorbar(image, ax=ax, label=value_col)
ax.set(xlabel=x_col, ylabel=y_col, title="Scanner mass-loading map")
fig.tight_layout()
plt.show()`,
    check: 'The map uses the correct measured quantity and units, and you reviewed both distribution statistics and where unusual values occur.',
    aiPrompt: 'Review this anonymised scan summary. Explain what the percentiles and map can show, what they cannot prove, and what instrument or calibration checks may be needed: [paste summary].'
  },
  {
    id: 'compare-independent-runs',
    title: 'Compare independent runs, not just readings',
    explanation: [
      'To assess repeatability, compare several independently identified runs made under comparable conditions. Thousands of readings from one run are not thousands of independent experiments. Summarise each run first, then compare the run-level results and document differences in setup or material.',
      'This example expects run_01.csv, run_02.csv and similar files with the same pump columns. It reports a run-level mean and spread. Add a run only when its identity and conditions are known; do not combine unlike runs just to increase the sample count.'
    ],
    file: 'Colab cell',
    code: `from pathlib import Path
import pandas as pd

flow_col = "Flow rate (mL/min)"
run_summaries = []
for file in sorted(Path(".").glob("run_*.csv")):
    run = pd.read_csv(file)
    if flow_col not in run.columns:
        raise ValueError(f"{file.name} is missing {flow_col!r}")
    flow = pd.to_numeric(run[flow_col], errors="coerce").dropna()
    if flow.empty:
        raise ValueError(f"{file.name} has no numeric flow readings")
    run_summaries.append({
        "run": file.stem,
        "readings": len(flow),
        "mean_flow": flow.mean(),
        "within_run_sd": flow.std()
    })

if len(run_summaries) < 2:
    raise ValueError("Add at least two independently identified run_*.csv files")

runs = pd.DataFrame(run_summaries).sort_values("run")
print(runs.round(3).to_string(index=False))
print(f"Across-run SD of run means: {runs['mean_flow'].std():.3f} mL/min")
print("Interpret this as a descriptive comparison; investigate run conditions before attributing a cause.")`,
    check: 'At least two independent runs are identified and compared at the run level, with conditions and limitations recorded.',
    aiPrompt: 'Compare these run-level summaries cautiously. Separate within-run variation from between-run variation, and list other conditions I should check before explaining a difference: [paste anonymised table].'
  },
  {
    id: 'make-analysis-reproducible',
    title: 'Make the analysis reproducible and report it',
    explanation: [
      'Save the untouched exports, a copy of the analysis code or Origin project, the software version, the units and every filtering or exclusion decision. Use a consistent file name and rerun the analysis on a second practice file to check that the workflow is repeatable.',
      'Write a short report with the question, number of independent runs, measurement window, instrument/calibration context, results, flags and limitations. Have a second person or an independent calculation check key results before using them to make a process decision.'
    ],
    file: 'Report template',
    code: `Question and decision:
Files, instrument and calibration:
Analysis window and units:
Independent runs (n):
Data-quality flags and handling:
Key results and approved limits:
Graphs reviewed:
Independent verification:
Limitations and next action:`,
    check: 'A second person can follow your saved steps, reproduce a key result and see the assumptions and limitations.',
    aiPrompt: 'Turn these verified results into a concise technical report. Preserve the units and limitations, distinguish observation from interpretation, and do not invent causes or acceptance limits: [paste anonymised results].'
  }
];

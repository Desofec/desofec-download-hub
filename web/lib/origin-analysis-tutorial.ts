import type { TutorialStep } from '@/lib/task-tracker-tutorial';

// Menu names are written for recent Origin/OriginPro versions and can differ slightly in older ones.
export const originAnalysisSteps: TutorialStep[] = [
  {
    id: 'meet-origin',
    title: 'Meet Origin and plan your analysis',
    explanation: [
      'Origin (and OriginPro) is graphing and data-analysis software used in labs and industry. A project holds workbooks (tables of data), graphs, and analysis results that update when your data changes.',
      'Origin is commercial software. OriginLab offers trials and student or academic licences, so check their website for what fits you. Everything you learn here about the workflow also applies to free tools, but the menus are different.',
      'Before you click anything, write down your question. For example: "Was the pump flow rate steady during the whole coating run?" or "How uniform is the coating thickness across the scanned area?"'
    ],
    file: 'Chat prompt',
    code: `I use Origin for data analysis. My data is: [describe, e.g. pump flow rate and pressure logged every 2 seconds for 20 minutes]. My question is: [e.g. how steady was the flow?].
List the analysis steps I should do in Origin, in order, and name the menu path for each one. Tell me where you are not sure of an exact menu name.`,
    check: 'You wrote your question in one sentence and have an ordered list of analysis steps.',
    aiPrompt: 'What is the difference between a workbook, a worksheet and a graph window in Origin?'
  },
  {
    id: 'practice-data',
    title: 'Create safe practice data',
    explanation: [
      'Practise with made-up data first, so you never risk confidential production numbers. The short Python script below creates two files: a pump log (time, flow rate, pressure) and a thickness scan map (X, Y, thickness).',
      'Run it in a free Google Colab notebook (colab.research.google.com) or any Python install. Download pump_log.csv and scan_map.csv. In real work, remove or rename anything confidential before sharing data with an AI assistant.'
    ],
    file: 'make_data.py',
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
    check: 'You have pump_log.csv (601 rows) and scan_map.csv (231 rows) on your computer.',
    aiPrompt: 'Explain this Python script line by line, and show me how to change the average flow rate and the size of the dip.'
  },
  {
    id: 'import-data',
    title: 'Import and label your data',
    explanation: [
      'In Origin choose File > Import > Single ASCII (or drag the CSV file into Origin). Check that the column names and numbers look right in the preview, then import.',
      'Set each column designation: Time as X and the others as Y. Fill in the Long Name, Units and Comments rows in the column header. Good labels make every graph and report automatically clear.',
      'Save the project (File > Save Project As) early and often. Keep the original CSV untouched, so you can always start again.'
    ],
    check: 'Your worksheet shows Time as X, flow and pressure as Y, with names and units filled in.',
    aiPrompt: 'My CSV imported with all the data in one column in Origin. What import settings should I check (delimiter, header rows, decimal separator)?'
  },
  {
    id: 'first-graphs',
    title: 'Make your first graphs',
    explanation: [
      'Select the Time and flow columns, then use Plot > Line (or Plot > Basic 2D > Line). A graph window opens. Double-click the axes or the curve to change titles, ranges, line colour and thickness.',
      'To compare flow and pressure on one graph, select Time, flow and pressure and use Plot > Multi-Curve > Double-Y. Each curve then has its own axis, so a small change in flow stays visible next to a large pressure value.',
      'Add the target value as a reference line: double-click the axis, open the Reference Lines tab and add a line at your target flow rate. Now a drift away from target is easy to see.'
    ],
    check: 'You have a line graph of flow over time, a double-Y graph with pressure, and a reference line at the target flow.',
    aiPrompt: 'Give me a checklist for a clear scientific graph: labels, units, line widths, fonts and colours that are readable when printed in black and white.'
  },
  {
    id: 'clean-signal',
    title: 'Smooth noise and find events',
    explanation: [
      'Real sensor data is noisy. Use Analysis > Signal Processing > Smoothing to apply a Savitzky-Golay or moving-average filter and compare the smoothed curve with the raw one. Smooth only to see trends. Keep your raw data for the numbers you report.',
      'Use Analysis > Peaks and Baseline > Peak Analyzer to find peaks, or dips if you invert the data. Here, a short flow dip around 600 seconds is an "event" you want to detect, count and time.',
      'Always ask whether a spike is real (the pump) or an artefact (a sensor glitch). Origin finds the shape; you decide what it means.'
    ],
    check: 'You plotted raw and smoothed flow together and located the dip near 600 seconds.',
    aiPrompt: 'When is smoothing harmful for analysis? Give examples where it hides a real problem such as a short pressure spike.'
  },
  {
    id: 'stability-stats',
    title: 'Measure how constant the flow is',
    explanation: [
      'To answer "how steady?", use numbers. Select the flow column and use Statistics > Descriptive Statistics > Statistics on Columns to get the mean, standard deviation, minimum and maximum.',
      'A useful steadiness number is the coefficient of variation: CV % = standard deviation / mean x 100. Add a column with Set Column Values or a Cell formula to compute it. Lower is steadier.',
      'To see if steadiness changes over the run, split the data into sections (for example the first, middle and last third) and compare the CV % of each. A Box Plot (Plot > Statistics > Box Chart) makes sections easy to compare. Do the same for pressure.'
    ],
    file: 'Chat prompt',
    code: `Here are my statistics from Origin: mean flow [x] mL/min, standard deviation [y], minimum [z], maximum [w], over [N] points.
Explain what these numbers say about pump stability in plain language. Suggest an acceptable CV % target to discuss with my team, and tell me what I should check on the real equipment.`,
    check: 'You have mean, standard deviation and CV % for flow and pressure, and can say in one sentence whether the run was steady.',
    aiPrompt: 'What is a typical reason a pump flow rate drifts or pulses, and what pressure pattern would match each one?'
  },
  {
    id: 'integrate-weight',
    title: 'Integrate and use weight functions',
    explanation: [
      'Integration adds up area under a curve. For flow over time it gives the total volume delivered. Select the flow column and use Analysis > Mathematics > Integrate. Remember units: mL/min times seconds needs converting, so convert time to minutes first.',
      'A weight function gives some data more importance than other data. For a weighted integral of y times w(x), first make a new column with Set Column Values, for example y * w, where w is your weight (such as 1 in the zone you care about and 0 elsewhere). Then integrate the new column.',
      'Weights also matter in curve fitting. Noisy points should count less than clean ones. In Analysis > Fitting > Nonlinear Curve Fit, the Fit Control tab lets you choose a weighting method such as no weighting, instrumental (using error values), statistical or an arbitrary column. Compare the results with and without weights.'
    ],
    file: 'Chat prompt',
    code: `I have flow rate in mL/min against time in seconds. Explain how to compute the total delivered volume with Integrate in Origin and how to handle the units.
Then show me, step by step, how to make a weighted integral of flow x weight, where weight is 1 between [t1] and [t2] seconds and 0 elsewhere. Give the Set Column Values formula.`,
    check: 'You calculated the total volume, compared it with flow x time as a sanity check, and made one weighted integral.',
    aiPrompt: 'Explain instrumental versus statistical weighting in curve fitting with one simple example, and say when I should not use weights.'
  },
  {
    id: 'scan-maps',
    title: 'Analyse a scanner map',
    explanation: [
      'An ultrasonic scanner measures a value (such as thickness) at many X and Y positions. Import scan_map.csv, set X and Y as X and Y columns and thickness as Z.',
      'Turn the table into a grid: select the worksheet and choose Worksheet > Convert to Matrix (XYZ gridding). Then select the matrix and use Plot > Contour > Color Fill or Plot > 3D Surface to see the map. Uniform coating shows as an even colour.',
      'Add numbers to the picture: use Statistics on Columns on the thickness column for mean and standard deviation, and plot a histogram (Plot > Statistics > Histogram) to see the spread. A tail of thin points shows weak spots. Note the position of the worst ones.'
    ],
    check: 'You have a colour map of the scan, a histogram of thickness and the mean and standard deviation of thickness.',
    aiPrompt: 'What are good ways to describe coating uniformity from a thickness map, other than the standard deviation?'
  },
  {
    id: 'repeat-report',
    title: 'Repeat it fast and write your report',
    explanation: [
      'Once an analysis works, do not redo it by hand. In Origin you can save a graph as a template (File > Save Template As), save an analysis as an Analysis Template, and use Batch Processing to apply it to many files.',
      'AI assistants can help write Origin scripts (LabTalk or Origin C) or Python code that uses the originpro package. Treat any script as a draft: test it on practice data, read it and verify the result against your manual analysis before you trust it.',
      'Finish with a short report: your question, the graphs, the key numbers and one decision. Export graphs with File > Export Graphs at a clear size and resolution.'
    ],
    file: 'Chat prompt',
    code: `I want to repeat this Origin analysis on many files: import a CSV, plot flow versus time, compute the mean, standard deviation and CV %, and export the graph.
Write a LabTalk script (or Python with the originpro package) as a first draft, explain each line, and list what I must check before using it on real data.`,
    check: 'You saved a template, ran it on a second practice file and wrote a five-line summary report.',
    aiPrompt: 'Help me write a one-page summary of this analysis for my manager: the question, the result, one graph and a recommended action.'
  }
];

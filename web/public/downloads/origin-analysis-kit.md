# Origin Data Analysis Kit

By Desofec AI Studio. A practical helper for analysing measurement data in Origin (OriginPro) with AI support. Menu names can differ slightly between Origin versions.

## The analysis loop
1. **Question**: write one sentence, such as "Was the pump flow steady during the whole run?"
2. **Import and label**: set X/Y columns, long names and units.
3. **Plot**: line graph, double-Y graph, reference line at the target.
4. **Measure**: mean, standard deviation, CV %, minimum and maximum.
5. **Decide**: one clear statement and one action.

## Where things are in Origin
- Import data: File > Import > Single ASCII
- Line graph: Plot > Line. Two axes: Plot > Multi-Curve > Double-Y
- Smoothing: Analysis > Signal Processing > Smoothing
- Peaks and dips: Analysis > Peaks and Baseline > Peak Analyzer
- Statistics: Statistics > Descriptive Statistics > Statistics on Columns
- Integrate: Analysis > Mathematics > Integrate
- Curve fit with weights: Analysis > Fitting > Nonlinear Curve Fit (Fit Control tab)
- Map from X, Y, Z data: Worksheet > Convert to Matrix, then Plot > Contour > Color Fill
- Histogram: Plot > Statistics > Histogram
- Reuse: File > Save Template As, and Batch Processing

## Key formulas
- Coefficient of variation: CV % = standard deviation / mean x 100
- Total volume from flow: integral of flow over time (convert units first)
- Weighted integral: integrate (y x w), where w is your weight column

## Prompt templates
- **Plan**: "My data is [DATA]. My question is [QUESTION]. List the Origin steps in order with menu paths, and say where you are unsure."
- **Explain numbers**: "Mean [X], standard deviation [Y], N [N]. Explain what this says about stability in plain language."
- **Weights**: "Explain instrumental versus statistical weighting for my fit of [MODEL] to [DATA], and when not to use weights."
- **Script draft**: "Write a LabTalk script or Python (originpro) to import [FILE], plot [COLUMNS], compute mean, SD and CV %, and export the graph. Explain every line."
- **Report**: "Turn these results into a one-page summary: question, result, one graph, recommended action: [RESULTS]"

## Responsible use
- Practise with made-up or anonymised data. Never paste confidential production data into a public AI tool.
- AI can invent menu names and formulas. Check every answer in your own software and against a hand calculation.
- Keep the raw data untouched. Smooth only for display, not for reported numbers.
- You are responsible for the conclusion.

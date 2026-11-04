# Advanced Measurement Data Analysis Kit

By Desofec AI Studio. A practical checklist for analysing pump logs and coating scanner data with Origin, Python or another measurement tool.

## Plan before analysis
- Write the question and decision the analysis should support.
- Record column names, units, instrument, calibration and the valid run/scan window.
- Use only approved targets and limits; do not ask AI to invent specifications.
- Decide how missing, duplicated, invalid or flagged readings will be reviewed.

## Pump-log review
- Keep the original export unchanged and work on a copy.
- Check timestamps, sampling intervals, missing values and duplicate readings.
- Compare raw traces with summaries over pre-defined time windows.
- Report mean, standard deviation and CV only with their units and context.
- Compare independent runs at the run level; readings within one run are not independent runs.

## Scanner and mass-loading review
- Keep X/Y coordinates and measurement units attached to every value.
- Confirm whether the instrument reports thickness or areal mass loading.
- Convert thickness to mass loading only with a validated calibration/model for the material and method.
- Review the map, percentiles and locations of unusual values; do not rely on the mean alone.
- Confirm instrument calibration and scan settings before interpreting a pattern.

## Reproducibility and safe AI use
- Save code or the Origin project, software version, source files and every analysis decision.
- Verify key results with a second method or independent reviewer.
- Use anonymised or synthetic data with online AI tools; never upload confidential process data without approval.
- Ask AI to explain or review your method, not to choose process limits or make safety-critical decisions.

## Report template
1. Question and decision:
2. Files, instrument and calibration:
3. Analysis window, units and independent runs:
4. Data-quality flags and handling:
5. Key results and approved limits:
6. Verification, limitations and next action:

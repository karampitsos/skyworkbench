---
title: "From TESS light curve to a transit signal in 30 lines"
description: "Download a TESS light curve, flatten it, and find the periodic dip of a known planet with a box least squares search."
section: pipelines
date: 2026-10-17
tags: ["TESS", "Python", "Lightkurve", "Exoplanets", "MAST"]
goal: "Recover a known planet's orbital period from public TESS data."
difficulty: easy
time: "30 minutes"
cost: "Free"
materials:
  - "Python 3.10+ with lightkurve, numpy and matplotlib"
  - "Internet access to the MAST archive"
files:
  - label: "MAST archive (TESS data)"
    href: "https://mast.stsci.edu/"
  - label: "Lightkurve documentation"
    href: "https://lightkurve.github.io/lightkurve/"
---

> **Sample post shipped with the starter.** The code is a starting point: run it in your own environment and adjust to the data you get back.

The idea: a planet crossing its star blocks a tiny fraction of the light, again and again at the same interval. TESS measures that light. We remove slow trends, then search for a repeating box-shaped dip.

```bash
pip install lightkurve numpy matplotlib
```

```python
import numpy as np
import matplotlib.pyplot as plt
import lightkurve as lk

# 1. Get the data. Pi Mensae hosts a planet (pi Men c) that transits roughly every 6.27 days.
results = lk.search_lightcurve("Pi Mensae", mission="TESS", author="SPOC")
print(results)                      # check which sectors are available
lc = results[0].download()          # first available sector

# 2. Clean it: normalise, remove slow trends and outliers.
lc = lc.remove_nans().normalize()
flat = lc.flatten(window_length=901).remove_outliers(sigma=5)

# 3. Search for repeating box-shaped dips.
periods = np.linspace(1, 20, 20000)
bls = flat.to_periodogram(method="bls", period=periods, frequency_factor=500)

best_period = bls.period_at_max_power
t0 = bls.transit_time_at_max_power
print("Best period:", best_period, " Epoch:", t0)

# 4. Fold on that period and look.
flat.fold(period=best_period, epoch_time=t0).scatter()
plt.show()
```

## What to check

- **Period close to the published one?** For pi Men c, around 6.27 days. If you get half or double, you found a harmonic. Try restricting the period range.
- **Dip depth.** Fold the data and measure the depth. A drop of a few hundred parts per million is expected for small planets, so your cleaning matters.
- **Try other targets.** Replace the name with any TOI or TIC ID and compare your period with the catalogue value.

## Extensions

Run it over several sectors and stitch them (`lk.LightCurveCollection(...).stitch()`) for a sharper period, or turn the script into a notebook that loops over a list of targets and saves a plot per star.

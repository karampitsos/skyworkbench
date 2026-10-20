---
title: "Dataset: stars within 100 parsecs from Gaia DR3"
description: "A query that pulls a clean sample of nearby stars and turns it into a Hertzsprung–Russell diagram."
section: datasets
date: 2026-10-16
tags: ["Gaia", "Datasets", "Python", "ADQL", "HR diagram"]
goal: "Get a clean, reusable table of nearby stars and plot their colour against absolute brightness."
difficulty: easy
time: "20 minutes"
cost: "Free"
materials:
  - "Python with astroquery, pandas and matplotlib"
files:
  - label: "Gaia archive (ESA)"
    href: "https://gea.esac.esa.int/archive/"
  - label: "astroquery Gaia docs"
    href: "https://astroquery.readthedocs.io/en/latest/gaia/gaia.html"
---

> **Sample post shipped with the starter.** Swap in a dataset you actually use, host the file on Zenodo or similar, and link it in the `files` list.

Gaia measures positions, parallaxes and colours for over a billion stars. Asking for stars with a parallax above 10 milliarcseconds gives everything inside about 100 parsecs. Requiring a small parallax error keeps the distances trustworthy.

## The query

```python
from astroquery.gaia import Gaia
import pandas as pd

query = """
SELECT TOP 200000
       source_id, ra, dec, parallax, parallax_error,
       phot_g_mean_mag, bp_rp
FROM gaiadr3.gaia_source
WHERE parallax > 10
  AND parallax_over_error > 10
  AND bp_rp IS NOT NULL
"""

job = Gaia.launch_job_async(query)
df = job.get_results().to_pandas()
df.to_csv("gaia_dr3_within_100pc.csv", index=False)
print(len(df), "stars")
```

## From table to HR diagram

Absolute magnitude from apparent magnitude and parallax in milliarcseconds:

`M_G = G + 5·log10(parallax) − 10`

```python
import numpy as np
import matplotlib.pyplot as plt

df["M_G"] = df.phot_g_mean_mag + 5 * np.log10(df.parallax) - 10

plt.figure(figsize=(6, 7))
plt.scatter(df.bp_rp, df.M_G, s=0.5, alpha=0.4, color="#ffb454")
plt.gca().invert_yaxis()
plt.xlabel("BP − RP colour")
plt.ylabel("Absolute G magnitude")
plt.title("Stars within 100 pc (Gaia DR3)")
plt.show()
```

You should see the main sequence as a diagonal band, with white dwarfs in the lower left and red giants top right.

## Notes on use

- `TOP 200000` keeps the download manageable. Remove it, or tighten the cuts, for a different sample.
- The `parallax_over_error > 10` cut biases the sample slightly against faint, distant stars. That is fine for a quick look but matters for statistics.
- Gaia positions are given at epoch 2016.0.

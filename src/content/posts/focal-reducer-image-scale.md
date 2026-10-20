---
title: "Experiment: predict and measure your image scale"
description: "Predict what a focal reducer does to image scale and field of view, then check the prediction against a plate-solved image."
section: experiments
date: 2026-10-15
tags: ["Focal reducer", "Plate solving", "Experiments", "Imaging"]
goal: "Verify that the image scale you computed matches what your telescope really delivers."
difficulty: easy
time: "One clear night, or one daytime session for the maths"
cost: "Free (plate-solving software is free)"
materials:
  - "Your telescope, camera and optional focal reducer"
  - "A plate-solving tool such as ASTAP or astrometry.net"
---

> **Sample post shipped with the starter.** The "predicted" column below is computed. The "measured" column is yours to fill in.

Nominal focal lengths are approximate, and a reducer's real effect depends on the spacing to the sensor. So compute first, then measure.

## 1. Predict

Image scale (″/px) = 206.265 × pixel size (µm) ÷ focal length (mm)
Field of view (′) = 3437.75 × sensor size (mm) ÷ focal length (mm)

Example setup: a 420 mm refractor with a camera that has 3.76 µm pixels on an 11.31 mm square sensor.

| Setup | Focal length | Predicted scale | Predicted FOV | Measured scale |
|---|---|---|---|---|
| Native | 420 mm | 1.85″/px | 92.6′ (1.54°) | *your number* |
| 0.8× reducer | 336 mm | 2.31″/px | 115.7′ (1.93°) | *your number* |

Use the [field-of-view calculator](../../tools/field-of-view/) to try your own gear.

## 2. Measure

1. Take a short exposure of a rich star field with each configuration. Keep the camera orientation and focus the same.
2. Plate-solve each frame. The solver reports the image scale in arcseconds per pixel.
3. Write the solver's value in the table.

## 3. Compare

Work out the percentage difference between predicted and measured scale for each setup.

- A native-setup mismatch of a few percent usually means the real focal length differs from the number on the box.
- If the reducer result differs more than the native one, the spacing between reducer and sensor is probably not at the manufacturer's recommended distance.

Publish both numbers and the spacing you used. Those are the figures other people want when planning their own setups.

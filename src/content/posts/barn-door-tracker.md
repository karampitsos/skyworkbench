---
title: "Barn-door star tracker: the maths first, then the build"
description: "Work out the motor speed for a DIY tracker before you cut any wood, so the build does what the sky needs."
section: builds
date: 2026-10-18
tags: ["Star tracker", "Arduino", "Astrophotography", "DIY"]
goal: "Track the sky well enough for sharp 2–5 minute exposures with a camera and short lens."
difficulty: medium
time: "A weekend"
cost: "Roughly €40–80, depending on what you already own (estimate)"
materials:
  - "2 flat boards, about 30 cm long, plus a hinge"
  - "M6 threaded rod (1 mm pitch), nuts and washers"
  - "28BYJ-48 stepper motor with ULN2003 driver board"
  - "Arduino Nano or similar microcontroller"
  - "5 V USB power bank"
  - "Ball head and camera mounting screw"
---

> **Sample post shipped with the starter.** Keep it, rewrite it with your own build, or delete the file.

A barn-door tracker is two boards on a hinge. The hinge axis points at the celestial pole, and a screw slowly opens the gap so the camera on the top board follows the stars. The mechanics are simple. The part people get wrong is the **speed**, so start there.

## 1. Work out how fast the screw must turn

The sky rotates once per sidereal day, 86 164.09 s, so the angular rate is

`ω = 2π / 86164.09 s ≈ 7.292 × 10⁻⁵ rad/s`

If the threaded rod sits a distance `R` from the hinge, it must advance at `v = R · ω`. With `R = 200 mm`:

`v = 200 × 7.292 × 10⁻⁵ ≈ 0.01458 mm/s`

An M6 rod has a 1 mm pitch, so that is 0.01458 revolutions per second, or about **0.875 rpm**. The 28BYJ-48 gear ratio is 63.684:1 (not exactly 64:1), which gives roughly 4 076 half-steps per output revolution:

`0.01458 × 4075.8 ≈ 59.4 half-steps per second`

```python
import math

SIDEREAL_DAY_S = 86164.0905

def half_steps_per_second(R_mm=200.0, pitch_mm=1.0, half_steps_per_rev=4075.8):
    omega = 2 * math.pi / SIDEREAL_DAY_S      # rad/s
    return R_mm * omega / pitch_mm * half_steps_per_rev

print(round(half_steps_per_second(), 1))      # ≈ 59.4
```

## 2. Know the error you are building in

A straight screw moving a hinged board is a *tangent* mechanism: the gap grows as `R · tan(θ)`, not `R · θ`. A constant motor speed therefore drifts as the door opens. The relative error is about `θ² / 3`:

| Run time | Hinge angle | Tracking error (approx.) | Rod travel at R = 200 mm |
|---|---|---|---|
| 5 min | 1.25° | 0.02 % | 4.4 mm |
| 15 min | 3.75° | 0.14 % | 13.1 mm |
| 60 min | 15° | 2.3 % | 53.7 mm |

Keep each run under about 15 minutes, then reset and start again, or speed the motor up slightly in firmware as the angle grows.

## 3. Build order

1. Hinge the boards and fix the hinge axis so you can aim it at the pole (a small polar scope or a phone compass plus latitude angle gets you close).
2. Drill the rod hole at exactly `R` from the hinge line. A wrong `R` means a wrong speed, so measure and put the real value into the script.
3. Couple the motor shaft to the rod. Backlash here shows up directly as stuttering in your stars.
4. Drive the motor at the computed step rate. Always reset the door to its start position before each run.

## 4. Test before trusting it

Shoot a 2-minute exposure at 50 mm on a bright star field, then zoom to 100 %. Round stars mean it works. Trails along one direction mean your polar alignment or `R` is off. Log each test in a table (focal length, exposure, result) so you can see what improved.

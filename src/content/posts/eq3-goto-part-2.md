---
title: "Bresser EQ-3 to GoTo, part 2: my own firmware, sidereal time and first light"
description: "Two spinning motors don't make a GoTo mount. Here is the Arduino firmware I wrote so KStars/Ekos can point, track and guide my motorised EQ-3, and the first images it took."
section: builds
date: 2026-10-20
draft: false
cover: "../../assets/posts/eq3-goto/bubble-nebula.jpg"
coverAlt: "The Bubble Nebula, a faint reddish arc around a bright star"
tags: ["Bresser EQ-3", "GoTo", "Arduino", "LX200", "KStars", "Ekos", "Firmware", "Astrophotography"]
goal: "Turn two motorised axes into a mount that knows where it points, tracks the sky and takes GoTo and guiding commands from planetarium software."
difficulty: medium
time: "Coding with Claude Code, then calibrating and testing in the field"
cost: "€0 extra: same hardware as part 1, plus free software"
materials:
  - "The motorised EQ-3 from part 1 (2 × NEMA 17, TMC2209 drivers, CNC Shield V3)"
  - "Arduino UNO R4 WiFi and a USB cable to the laptop"
  - "Arduino IDE with the AccelStepper library"
  - "A laptop running KStars/Ekos (INDI, LX200 GPS driver)"
  - "ZWO ASI662MC camera (a small-sensor planetary camera) on my Bresser Newtonian"
  - "Siril for stacking the images"
files:
  - label: "Firmware source code on GitHub (MIT license)"
    href: "https://github.com/karampitsos/eq3-goto-firmware"
  - label: "AccelStepper library"
    href: "https://www.airspayce.com/mikem/arduino/AccelStepper/"
---

At the end of [part 1](../eq3-goto-part-1/) I had a Bresser EQ-3 with a stepper motor and a belt on each axis, and two motors that turned when I told them to. That's not a GoTo mount yet. A GoTo mount has to do three more things:

1. **Know where it's pointing**, in the sky's coordinates (right ascension and declination), not in motor steps.
2. **Track**: turn the RA axis at exactly the rate the sky turns, so a star stays still in the camera.
3. **Talk to software**, so I can click a target in a planetarium program and the mount goes there.

For that I wrote my own firmware: a single Arduino sketch of about 380 lines. I wrote it together with Claude Code, an AI coding assistant, and then tested and tuned it in the field, under the real sky. This post walks through how it works. The full code is on GitHub: [eq3-goto-firmware](https://github.com/karampitsos/eq3-goto-firmware) (MIT license).

## 1. The whole chain

```
KStars/Ekos (laptop)
   │  INDI driver "LX200 GPS"
   │  USB serial, 9600 baud, LX200 commands
   ▼
Arduino UNO R4 WiFi  ── my firmware (AccelStepper)
   │  STEP / DIR / ENABLE
   ▼
CNC Shield V3 ── TMC2209 (Y slot: Dec) ── NEMA 17 ── belt 3:1 ── Dec worm
              └─ TMC2209 (Z slot: RA)  ── NEMA 17 ── belt 3:1 ── RA worm
```

The laptop does the hard astronomy (catalogues, plate solving, guiding). The Arduino only has to answer simple questions ("where are you pointing?") and carry out simple orders ("go to this RA/Dec", "move north slowly").

## 2. Speaking LX200

Rather than inventing a protocol and writing a driver for it, I made the Arduino pretend to be a **Meade LX200**. It's a decades-old telescope protocol, and practically every astronomy program still speaks it. Commands are short text strings between `:` and `#`:

| Command | Meaning | My firmware |
|---|---|---|
| `:GR#` / `:GD#` | Get current RA / Dec | Computes them from motor positions (see below) |
| `:Sr HH:MM:SS#` / `:Sd sDD*MM:SS#` | Set target RA / Dec | Stores the target |
| `:MS#` | Slew to target | Starts the GoTo |
| `:D#` | Still slewing? | Answers until both motors arrive |
| `:CM#` | Sync | "You are pointing at the target": resets the position without moving |
| `:Mn#` `:Ms#` `:Me#` `:Mw#` | Move north/south/east/west | Used for manual moves and guiding |
| `:Q#` | Stop | Back to tracking |
| `:RG#` `:RC#` `:RM#` `:RS#` | Choose move speed | Guide, centre, find, max |
| `:SC#` `:SL#` `:SG#` `:Sg#` `:St#` | Set date, local time, UTC offset, longitude, latitude | Used to compute sidereal time |

In Ekos I select the **LX200 GPS** driver, point it at the Arduino's USB port at 9600 baud, and it connects as if a real Meade were on the other end.

The firmware reads characters until it sees a `:`, collects everything up to the `#`, and passes the command to one big `if / else if` parser. It's not elegant, but it's easy to follow and easy to extend when Ekos sends a command I haven't seen before.

## 3. Where am I pointing? Hour angle, not RA

This was the key design decision. A star's right ascension is fixed, but the sky turns, so the mount has to keep moving to stay on it. If I stored RA directly in the motor position, every position would go stale one second later.

Instead, the RA motor position stores the **hour angle (HA)**: how far the mount is turned from the meridian. The mount reports

**RA = LST − HA**

where LST is the *local sidereal time*, the RA that is crossing your meridian right now.

The nice consequence: when the mount tracks at the sidereal rate, HA grows at exactly the same rate as LST, so the reported RA stays constant. A tracked star stays put in the software without any correction code. The comment I left in the main loop says it well:

```cpp
// No reference hack needed: LST advances at the same rate the RA motor
// tracks, so RA = LST - HA is naturally constant on a tracked star.
```

For a GoTo, the firmware turns the target's RA into an hour angle *at that moment*, wraps it into −12…+12 hours, converts it to steps, and lets the AccelStepper library drive both motors there with smooth acceleration:

```cpp
float ha = currentLST() - targetRaHours;    // hour angle of target now
while (ha < -12.0) ha += 24.0;
while (ha >= 12.0) ha -= 24.0;
stepperZ.moveTo((long)(RA_DIR * ha * STEPS_PER_HOUR_RA));
stepperY.moveTo(targetDecSteps);
```

When both motors arrive, it switches straight back to tracking.

## 4. Sidereal time without a clock chip

To know LST, the board needs the date, the time and my longitude. The UNO R4 has no battery-backed clock, but it doesn't need one: when Ekos connects, it sends all of that with `:SC#`, `:SL#`, `:SG#` and `:Sg#`. The firmware saves them, notes the Arduino's `millis()` at that moment, and from then on knows the current UTC.

From UTC it computes the Julian date, then Greenwich mean sidereal time with the standard formula, then adds my longitude:

```
D    = JD − 2451545.0                         (days since J2000.0)
GMST = 18.697374558 + 24.06570982441908 × D   (hours, wrapped to 0–24)
LST  = GMST + east longitude / 15
```

One trap to watch for: **the LX200 protocol gives longitude as west-positive**, the opposite of the usual convention. Get the sign wrong and sidereal time is off by twice your longitude, so every GoTo misses.

## 5. Tracking at the sidereal rate

The sky doesn't turn once every 24 hours; it turns once every sidereal day, about 23 h 56 min. So RA has to advance **1.0027379 hours of hour angle for every hour on the clock**. The firmware derives the tracking speed from the calibration:

```cpp
const float SIDEREAL_SPEED =
    RA_DIR * (STEPS_PER_HOUR_RA * SIDEREAL_RATIO / 3600.0);
```

With my numbers that's **31.2 steps per second**, about one step every 32 ms. Each RA step moves the mount by 0.48 arcseconds, much finer than my images can show.

## 6. Steps per degree: calibrating the axes

Everything above depends on one number per axis: how many motor steps turn the mount by one degree. In my firmware:

```cpp
const float STEPS_PER_DEG_DEC = 3733.0 * 2 / 1.5;
const float STEPS_PER_DEG_RA  = 3733.0 * 2;
```

I didn't get these from a datasheet. I calibrated them **in the field, with real GoTos**:

1. Start from an initial estimate of steps per degree.
2. Sync on a known star, then GoTo another target.
3. See how far off the mount lands, and in which direction.
4. Correct the number and repeat until the GoTos land where they should.

The `× 2` and `÷ 1.5` in the code are the corrections that tuning produced. As a sanity check, the final RA value matches the gearing almost exactly: 400 steps per revolution × 16 microsteps × 3 (belt) × 140 (worm) ÷ 360° = 7466.7 steps per degree.

## 7. Manual moves and guiding

The four move commands change the motor speeds on top of tracking. East and west speed RA up or slow it down around the sidereal rate; north and south turn the Dec motor. The firmware has four speeds:

| Rate | Steps/s | Compared with sidereal |
|---|---|---|
| Guide | 10 | 0.32× |
| Centre | 50 | 1.6× |
| Find | 200 | 6.4× |
| Max | 3000 | 96× |

Autoguiding uses the slowest one, and it works from Ekos too. The guider watches a star, and when it drifts it sends short move commands at the guide rate to nudge it back. Because those are ordinary LX200 move commands, the firmware didn't need anything special for guiding.

## 8. A night with it

After power-on the firmware assumes both motors are at zero, so it doesn't know where it's pointing yet. My routine:

1. Power on and connect from Ekos. It sends the date, time and location, and sidereal time starts running.
2. Take an image and **plate-solve** it with the Ekos **Align** module. Ekos works out exactly where the telescope is pointing and syncs the mount (`:CM#`).
3. GoTo the target. Align can solve again and correct the pointing until the target is centred.
4. Start capturing.

![The motorised Bresser EQ-3 with a Newtonian telescope on a terrace at night, cables running to a laptop on a table](../../assets/posts/eq3-goto/setup-terrace.jpg)

*Ready for a night of imaging.*

## 9. First light

These were taken with my Bresser Newtonian and a ZWO ASI662MC, a small planetary camera, with the mount **tracking only, no guiding**. That's why each frame is short: 15 seconds or less, before tracking errors start to stretch the stars. Many short frames were then stacked in Siril.

![The Dumbbell Nebula, M27: a green, apple-core-shaped cloud with reddish edges in a dense star field](../../assets/posts/eq3-goto/m27-dumbbell.jpg)

*M27, the Dumbbell Nebula.*

![The Bubble Nebula, NGC 7635: a faint reddish arc around a bright star, in a dense star field](../../assets/posts/eq3-goto/bubble-nebula.jpg)

*NGC 7635, the Bubble Nebula: the faint shell blown around the bright star near the centre.*

![Saturn with its rings, small against a black background](../../assets/posts/eq3-goto/saturn.jpg)

*Saturn, rings and all.*

## 10. What it doesn't do (yet)

This is a working first version, not a finished product. Things I know are missing:

- **No meridian flip.** The firmware doesn't track which side of the pier the telescope is on, so GoTos across the meridian aren't handled.
- **No memory of position.** Every session starts with a sync.
- **Slow GoTos.** The top slew speed is about half a degree per second, so a 90° slew takes nearly three minutes. Fine for imaging, a little boring to watch.
- **The TMC2209s run in basic mode.** They're the UART version, which can be configured over a serial link (current, microstepping, quiet modes), but I only drive their STEP/DIR pins so far.
- **No Wi-Fi yet**, even though the UNO R4 WiFi has it. A cable-free connection to the laptop would be a nice next step.

Total extra cost for this part: nothing. It's the same hardware as part 1, and all the software is free. My first telescope mount now does what I used to think needed a new one.

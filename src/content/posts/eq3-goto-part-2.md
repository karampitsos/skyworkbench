---
title: "Bresser EQ-3 to GoTo, part 2: my own firmware, sidereal time and first light"
description: "Two spinning motors don't make a GoTo mount. The firmware I wrote so KStars/Ekos can point, track and guide my motorised EQ-3, and the first images it took."
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

At the end of [part 1](../eq3-goto-part-1/) I had a Bresser EQ-3 with a motor and a belt on each axis, and two motors that turned when I told them to. That's not a GoTo mount yet. The mount still had no idea where it was pointing, and nothing told it where to go.

This part is the brain: a small program (firmware) running on the Arduino. With it, I click a target in a planetarium program and the telescope points there, follows the sky, and can be guided. Here is what it took, without the code details. If you want those, the full source is on GitHub: [eq3-goto-firmware](https://github.com/karampitsos/eq3-goto-firmware) (MIT license).

I wrote the firmware together with Claude Code, an AI coding assistant, and then tested and tuned it in the field, under the real sky.

![The motorised Bresser EQ-3 with a Newtonian telescope on a terrace at night, cables running to a laptop on a table](../../assets/posts/eq3-goto/setup-terrace.jpg)

*Ready for a night of imaging.*

## What a GoTo mount has to do

1. **Know where it's pointing**, in the sky's coordinates, not in motor steps.
2. **Track**: turn at exactly the rate the sky turns, so a star stays still in the camera.
3. **Talk to software**, so I can pick a target on a screen and have the mount go there.

## How the pieces fit together

```
KStars/Ekos (laptop)  →  USB cable  →  Arduino (my firmware)  →  two stepper drivers  →  two motors
```

The laptop does the hard astronomy: star catalogues, working out where the camera is looking from a photo (plate solving), and guiding. The Arduino only answers simple questions ("where are you pointing?") and carries out simple orders ("go there", "move north slowly").

## Pretending to be a Meade telescope

Instead of inventing my own protocol and writing a driver for it, I made the Arduino behave like a **Meade LX200**, a decades-old telescope that practically every astronomy program still knows how to talk to. In Ekos I pick the "LX200 GPS" driver, choose the Arduino's USB port, and it connects as if a real Meade were on the other end.

That one decision gave me GoTo, syncing, manual moves and guiding without writing anything specific for any of them.

## The idea that makes it work

A star's position in the sky (its right ascension) doesn't change, but the sky keeps turning, so the mount has to keep moving to stay on it. If the firmware stored the position as a fixed sky coordinate, it would be out of date one second later.

So the firmware stores something else: **how far the mount has turned from the meridian**, the north–south line overhead. The sky coordinate the mount reports is just the current sidereal time (the sky's clock) minus that angle.

The nice consequence: when the mount tracks at the right speed, both numbers grow at the same rate, so the reported position of a tracked star stays constant. Nothing extra is needed to hold a star still in the software.

The sidereal clock itself needs no extra hardware. When Ekos connects, it tells the Arduino the date, time and my location, and the Arduino keeps time from there.

One trap worth knowing: **the LX200 protocol counts longitude westwards**, the opposite of the usual convention. Get the sign wrong and every GoTo lands far from its target.

## Tracking

The sky turns once every sidereal day, about 23 hours 56 minutes, not 24. So the RA motor runs very slightly faster than a 24-hour clock would suggest. The motors are driven in small steps, each moving the mount by a fraction of an arcsecond, which is plenty smooth for my images.

## Calibrating by going outside

Everything depends on one number per axis: how many motor steps turn the mount by one degree. I didn't take these from a datasheet. I calibrated them in the field:

1. Start from an estimate.
2. Sync on a known star, then GoTo another target.
3. See how far off the mount lands, and in which direction.
4. Correct the number and repeat until the GoTos land where they should.

It's slow but very reliable, and the RA number I ended up with matches the gearing I worked out on paper.

## Moving by hand and guiding

The same LX200 commands also cover moving the mount by hand (north, south, east, west) at four speeds, from a slow crawl to a fast slew. Autoguiding is the slowest speed in use: the guiding software watches a star, and when it drifts it sends short nudges to bring it back. Since these are ordinary LX200 commands, the firmware needed nothing special for it.

## A night with it

After power-on the mount doesn't know where it's pointing, so my routine is:

1. Power on and connect from Ekos, which also sends the time and location.
2. Take an image and let Ekos **plate-solve** it. It works out where the telescope is really pointing and syncs the mount.
3. GoTo the target. Plate solving can run again to centre it.
4. Start capturing.

## First light

These were taken with my Bresser Newtonian and a ZWO ASI662MC, a small planetary camera. The mount was **tracking only, with no guiding** for these shots, which is why each frame is short: 15 seconds or less, before small tracking errors start to stretch the stars. Many short frames were then stacked in Siril.

![The Dumbbell Nebula, M27: a green, apple-core-shaped cloud with reddish edges in a dense star field](../../assets/posts/eq3-goto/m27-dumbbell.jpg)

*M27, the Dumbbell Nebula.*

![The Bubble Nebula, NGC 7635: a faint reddish arc around a bright star, in a dense star field](../../assets/posts/eq3-goto/bubble-nebula.jpg)

*NGC 7635, the Bubble Nebula: the faint shell blown around the bright star near the centre.*

![Saturn with its rings, small against a black background](../../assets/posts/eq3-goto/saturn.jpg)

*Saturn, rings and all.*

## What it doesn't do (yet)

This is a working first version, not a finished product:

- **No safety limits.** There are no end stops or park position, so a wrong GoTo can wind the cables or hit the tripod. Keep an eye on it, and keep a hand near the power switch.
- **No meridian flip.** GoTos across the meridian aren't handled.
- **No memory of position.** Every session starts with a sync.
- **Slow GoTos.** A long slew takes a few minutes. Fine for imaging, a little boring to watch.
- **The motor drivers run in basic mode.** They can be configured over a serial link, but I only use their step and direction pins so far.
- **No Wi-Fi yet**, even though the Arduino has it. A cable-free connection would be a nice next step.

Total extra cost for this part: nothing. It's the same hardware as part 1, and all the software is free. My first telescope mount now does what I used to think needed a new one.

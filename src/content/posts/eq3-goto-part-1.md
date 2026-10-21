---
title: "Bresser EQ-3 to GoTo, part 1: motors, belts and the first spin"
description: "No upgrade kit exists for the Bresser EQ-3, so I motorised both axes myself with NEMA 17 steppers and GT2 belts: parts, costs and the mistakes I made."
section: builds
date: 2026-10-20
draft: false
cover: "../../assets/posts/eq3-goto/both-axes.jpg"
coverAlt: "The EQ-3 mount head with stepper motors and belts fitted to both axes"
tags: ["Bresser EQ-3", "GoTo", "Stepper motors", "Arduino", "Mount upgrade", "DIY"]
goal: "Put a stepper motor on each axis of a Bresser EQ-3 mount so it can be computer-controlled, without buying a new mount."
difficulty: medium
time: "Spread over a few months of spare time"
cost: "About €55 for the mechanics of both axes; about €150 spent in total including detours and tools"
materials:
  - "2 × NEMA 17 stepper motors, 0.9°/step (400 steps/rev), model 42BYGHM809"
  - "2 × NEMA 17 stepper motor mounts"
  - "2 × GT2 timing pulleys, 20 teeth, 5 mm bore (motor side)"
  - "2 × GT2 timing pulleys, 60 teeth, 6 mm bore (mount-axis side)"
  - "GT2 timing belts: 188 mm (declination) and 180 mm (right ascension)"
  - "V-slot gantry plate 20 mm (extension for the RA motor mount)"
  - "M3/M4 bolts and nuts"
  - "2 × TMC2209 stepper drivers (I tested first with an A4988 and a DRV8825)"
  - "Arduino CNC Shield V3, Arduino UNO R4 WiFi and a 12 V 5 A power supply (see the electronics sections)"
files:
  - label: "Bresser EQ-3 mount"
    href: "https://www.bresser.com/p/bresser-eq-3-telescope-mount-incl.-tripod-black-4964450"
  - label: "OnStep kit (the design I borrowed from)"
    href: "https://www.terransindustry.com/collections/onstep-v4-kit"
---

My first telescope, like that of many amateur astronomers, was a Newtonian on an inexpensive equatorial mount: the **Bresser EQ-3**. It served me well for visual observing. Then I wanted to try astrophotography, and that needs a mount that tracks the sky and can point itself at a target: a **GoTo** mount.

A new GoTo mount was more than I could afford. Upgrade kits exist for Sky-Watcher mounts (the [OnStep kits](https://www.terransindustry.com/collections/onstep-v4-kit), for example), but I couldn't find one for the EQ-3. Bresser sells a [single-axis RA motor](https://www.bresser.com/p/bresser-ra-tracking-motor-controller-4951400), but it only tracks, and it's expensive for what it does.

So for years I waited and grumbled. Then it struck me: instead of waiting, why not upgrade the mount myself? This series is how that went. In this first part I motorise both axes and spin the motors from a computer. [Part 2](../eq3-goto-part-2/) covers the firmware that turns it into a working GoTo mount.

## 1. The mechanics of the first axis (declination)

I copied the idea from the OnStep kit: on each axis, a **stepper motor** drives the mount's slow-motion shaft through a **timing belt**.

- **Motor:** a NEMA 17, like the one OnStep uses. I chose a **0.9°/step** model (400 steps per revolution) rather than the usual 1.8°, because it doubles the resolution. It cost €16.90.
- **Motor mount:** a standard NEMA 17 bracket to hold the motor against the mount.
- **Pulleys:** GT2, **20 teeth** on the motor shaft (5 mm) and **60 teeth** on the mount's axis shaft (6 mm). That gives a **3:1 reduction**, so more torque and three times the resolution again.
- **Belt:** I had no idea what length the setup needed, so I picked one more or less at random: **188 mm**.

Everything arrived and, almost by magic, it fitted. The only thing missing was screws to fix the motor to its bracket and the bracket to the mount. An M3/M4 assortment kit solved that, and I had a stepper motor on the declination axis.

![A hand holding the EQ-3 mount head with a NEMA 17 stepper motor and a timing belt fitted to the declination axis](../../assets/posts/eq3-goto/dec-first-fit.jpg)

*First fit, December 2025: the 20-tooth pulley on the motor, the 60-tooth pulley on the axis, and the 188 mm belt between them.*

| Part (declination) | Price |
|---|---|
| NEMA 17 stepper, 0.9° (42BYGHM809) | €16.90 |
| NEMA 17 motor mount | €1.90 |
| GT2 pulley, 20T, 5 mm bore | €1.60 |
| GT2 pulley, 60T, 6 mm bore | €3.60 |
| GT2 belt, 188 mm | €1.40 |
| **Total** (plus a few screws) | **€25.40** |

## 2. First electronics: making the motor move

A stepper motor needs a **driver** between it and whatever sends the commands. My research pointed to the **TMC2209** as the best choice (quiet and smooth), but I couldn't find one in stock in Greece. So I bought what was available: an **A4988** and a **DRV8825**. Along with them I ordered a breadboard, a multimeter, a capacitor, and a 24 V power supply with a barrel jack.

I followed this video step by step: [Control a NEMA 17 stepper motor with an A4988 driver and Arduino](https://www.youtube.com/watch?v=wcLeXXATCR4). The only difference was that I used a spare **Raspberry Pi** instead of an Arduino. At this stage I only wanted to check that all the parts worked. A Raspberry Pi is overkill for driving two motors, and I replaced it with a microcontroller later.

It worked: the declination axis moved on command.

<figure class="compact">
  <video controls muted playsinline preload="none" width="480" height="480" poster="/media/eq3-goto/first-axis-test-poster.jpg" src="/media/eq3-goto/first-axis-test.mp4"></video>
  <figcaption>First spin: the NEMA 17 turning the declination axis, then the test rig behind it: one stepper driver on a breadboard, controlled by a Raspberry Pi.</figcaption>
</figure>

## 3. The mechanics of the second axis (right ascension)

The right ascension (RA) axis was a mirror of the first, with two differences:

- The motor bracket couldn't sit directly against the mount on this side, so I added a **V-slot gantry plate** as an extension and fixed the bracket to it.
- This time I ordered **several belt lengths** (160, 188 and 202 mm) to improve my odds.

Everything fitted except, of course, the belt. None of the three was right. In the next order I got a **180 mm** belt. It still wasn't a perfect fit, so I added padding between the motor bracket and the plate to tension it. It worked.

![The right ascension motor mounted on the EQ-3, with a GT2 belt marked 180-6 running between a small and a large pulley](../../assets/posts/eq3-goto/ra-motor-belt.jpg)

*The RA drive with its 180 mm belt.*

![The black NEMA 17 bracket screwed onto a slotted gantry plate attached to the mount](../../assets/posts/eq3-goto/ra-bracket-plate.jpg)

*The motor bracket on the V-slot gantry plate. The slotted holes leave room to adjust the motor's position.*

![The EQ-3 mount head on a table with stepper motors and belts fitted to both axes, wires hanging loose](../../assets/posts/eq3-goto/both-axes.jpg)

*Both axes motorised.*

| Part (right ascension) | Price |
|---|---|
| NEMA 17 stepper, 0.9° (42BYGHM809) | €16.90 |
| NEMA 17 motor mount | €1.90 |
| GT2 pulleys, 20T + 60T | €5.20 |
| V-slot gantry plate 20 mm | €3.60 |
| GT2 belt, 180 mm | €1.40 |
| Screws and nuts | €0.48 |
| **Total** | **€29.48** |

## 4. The electronics, take two (and what went wrong)

With both axes motorised, I needed a proper controller. I first chose an **ESP32-S3 DevKitC-1**: it has Wi-Fi and is easy to program over USB. I wired it to the drivers on the breadboard.

That's where I learned three lessons the hard way:

1. **A breadboard can't carry stepper-motor current.** Its contacts are meant for signals, not for amps flowing to two motors.
2. **My capacitor wasn't right for the job.** A driver needs a suitable capacitor right at its power input to absorb voltage spikes from the motor.
3. **My power supply was too weak.** 24 V at 2 A isn't enough for two motors moving at the same time.

The fix turned out to be a single, cheap board: the **Arduino CNC Shield V3**. It's built for driving steppers (it's used in 3D printers and CNC machines). It has sockets for up to four driver modules, proper power wiring, and it plugs straight onto an Arduino. So I switched from the ESP32 to an **Arduino UNO R4 WiFi**, and to a **12 V 5 A** power supply.

And for the drivers, I went back to my first choice: two **TMC2209**s, one per axis. This time I found them: €6.90 each. They're much quieter than the A4988 and DRV8825, and they move the motors more smoothly, which matters when the mount has to track the sky slowly and steadily. Mine are the UART version, which can be configured over a serial link, but for now I run them in plain step/direction mode, like the other drivers.

![A red Arduino CNC Shield V3 with two stepper driver modules under blue heat sinks, plugged onto an Arduino, with motor wires attached](../../assets/posts/eq3-goto/cnc-shield.jpg)

*The final electronics: the CNC Shield V3 on the Arduino, with two TMC2209 drivers under blue heat sinks.*

## 5. What it cost

| | Cost |
|---|---|
| Mechanics, declination axis | €25.40 |
| Mechanics, right ascension axis | €29.48 |
| **Mechanics, both axes** | **≈ €55** |
| TMC2209 drivers, 2 × €6.90 | €13.80 |
| Everything I actually spent up to here | ≈ €150 |

The gap between the two numbers is the price of learning: spare belts, the A4988 and DRV8825 I tested with before the TMC2209s, the breadboard and ESP32 detour, and tools like the multimeter. If you follow this build, you can skip most of that.

## Where it ended up

This is the mount today, on my terrace: the Newtonian on the motorised EQ-3, a camera at the focuser, the electronics strapped to a tripod leg, and the laptop running the control software. How it got from two spinning motors to this is [part 2](../eq3-goto-part-2/).

![The motorised Bresser EQ-3 with a Newtonian telescope on a terrace at night, cables running to a laptop on a table](../../assets/posts/eq3-goto/setup-terrace.jpg)

*The upgraded EQ-3, ready for a night of imaging.*

And a first taste of what it can do. Both images are stacks of short exposures (15 seconds or less each), stacked in Siril:

![The Dumbbell Nebula, M27: a green, apple-core-shaped cloud with reddish edges in a dense star field](../../assets/posts/eq3-goto/m27-dumbbell.jpg)

*M27, the Dumbbell Nebula.*

![Saturn with its rings, small against a black background](../../assets/posts/eq3-goto/saturn.jpg)

*Saturn, rings and all.*

## Next: making it a GoTo mount

At this point I had two motors that turned on command. A GoTo mount also needs to know where it's pointing, track the sky at the right speed, and talk to planetarium software. In [part 2](../eq3-goto-part-2/) I write my own firmware for the Arduino. It speaks the Meade LX200 protocol, so KStars/Ekos can drive the mount for GoTo and autoguiding.

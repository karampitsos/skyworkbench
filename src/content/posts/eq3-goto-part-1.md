---
title: "Bresser EQ-3 to GoTo, part 1: motors, belts and the first spin"
description: "No upgrade kit exists for the Bresser EQ-3, so I motorised both axes myself with NEMA 17 steppers and GT2 belts. Parts, costs, belt-size guesswork and the electronics mistakes I made on the way."
section: builds
date: 2026-10-20
draft: true
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
  - "Stepper drivers (A4988, DRV8825), a microcontroller and a power supply (see the electronics sections)"
files:
  - label: "Bresser EQ-3 mount"
    href: "https://www.bresser.com/p/bresser-eq-3-telescope-mount-incl.-tripod-black-4964450"
  - label: "OnStep kit (the design I borrowed from)"
    href: "https://www.terransindustry.com/collections/onstep-v4-kit"
---

My first telescope, like that of many amateur astronomers, was a Newtonian on an inexpensive equatorial mount: the **Bresser EQ-3**. It served me well for visual observing. Then I wanted to try astrophotography, and that needs a mount that tracks the sky and can point itself at a target: a **GoTo** mount.

A new GoTo mount was more than I could afford. Upgrade kits exist for Sky-Watcher mounts (the [OnStep kits](https://www.terransindustry.com/collections/onstep-v4-kit), for example), but I couldn't find one for the EQ-3. Bresser sells a [single-axis RA motor](https://www.bresser.com/p/bresser-ra-tracking-motor-controller-4951400), but it only tracks, and it's expensive for what it does.

So for years I waited and grumbled. Then it struck me: instead of waiting, why not upgrade the mount myself? This series is how that went. In this first part I motorise both axes and spin the motors from a computer. [Part 2](#) covers the firmware that turns it into a working GoTo mount.

## 1. The mechanics of the first axis (declination)

I copied the idea from the OnStep kit: on each axis, a **stepper motor** drives the mount's slow-motion shaft through a **timing belt**.

- **Motor:** a NEMA 17, like the one OnStep uses. I chose a **0.9°/step** model (400 steps per revolution) rather than the usual 1.8°, because it doubles the resolution. It cost €16.90.
- **Motor mount:** a standard NEMA 17 bracket to hold the motor against the mount.
- **Pulleys:** GT2, **20 teeth** on the motor shaft (5 mm) and **60 teeth** on the mount's axis shaft (6 mm). That gives a **3:1 reduction**, so more torque and three times the resolution again.
- **Belt:** I had no idea what length the setup needed, so I picked one more or less at random: **188 mm**.

Everything arrived and, almost by magic, it fitted. The only thing missing was screws to fix the motor to its bracket and the bracket to the mount. An M3/M4 assortment kit solved that, and I had a stepper motor on the declination axis.

<!-- PHOTO: first_axis_second.jpg (motor and belt on the declination axis) -->

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

<!-- VIDEO: first_axis_electronics.mp4 (a still or a GIF, or a link to the video) -->

## 3. The mechanics of the second axis (right ascension)

The right ascension (RA) axis was a mirror of the first, with two differences:

- The motor bracket couldn't sit directly against the mount on this side, so I added a **V-slot gantry plate** as an extension and fixed the bracket to it.
- This time I ordered **several belt lengths** (160, 188 and 202 mm) to improve my odds.

Everything fitted except, of course, the belt. None of the three was right. In the next order I got a **180 mm** belt. It still wasn't a perfect fit, so I added padding between the motor bracket and the plate to tension it. It worked.

<!-- PHOTO: second_axis.jpg (RA motor on the gantry plate) -->

| Part (right ascension) | Price |
|---|---|
| NEMA 17 stepper, 0.9° (42BYGHM809) | €16.90 |
| NEMA 17 motor mount | €1.90 |
| GT2 pulleys, 20T + 60T | €5.20 |
| V-slot gantry plate 20 mm | €3.60 |
| GT2 belt, 180 mm | €1.40 |
| Screws and nuts | €0.48 |
| **Total** | **€29.48** |

**Lesson:** measure the distance between the two pulley centres *before* ordering belts. A GT2 belt calculator then tells you the length you need, which saves an order or two.

## 4. The electronics, take two (and what went wrong)

With both axes motorised, I needed a proper controller. I first chose an **ESP32-S3 DevKitC-1**: it has Wi-Fi and is easy to program over USB. I wired it to the drivers on the breadboard.

That's where I learned three lessons the hard way:

1. **A breadboard can't carry stepper-motor current.** Its contacts are meant for signals, not for amps flowing to two motors.
2. **My capacitor wasn't right for the job.** A driver needs a suitable capacitor right at its power input to absorb voltage spikes from the motor.
3. **My power supply was too weak.** 24 V at 2 A isn't enough for two motors moving at the same time.

The fix turned out to be a single, cheap board: the **Arduino CNC Shield V3**. It's built for driving steppers (it's used in 3D printers and CNC machines). It has sockets for up to four driver modules, proper power wiring, and it plugs straight onto an Arduino. So I switched from the ESP32 to an **Arduino UNO R4 WiFi**, and to a **12 V 5 A** power supply.

<!-- PHOTO: the final electronics (UNO R4 WiFi + CNC shield + drivers) -->

## 5. What it cost

| | Cost |
|---|---|
| Mechanics, declination axis | €25.40 |
| Mechanics, right ascension axis | €29.48 |
| **Mechanics, both axes** | **≈ €55** |
| Everything I actually spent up to here | ≈ €150 |

The gap between the two numbers is the price of learning: spare belts, a driver I didn't end up needing, the breadboard and ESP32 detour, and tools like the multimeter. If you follow this build, you can skip most of that.

## Next: making it a GoTo mount

At this point I had two motors that turned on command. A GoTo mount also needs to know where it's pointing, track the sky at the right speed, and talk to planetarium software. In [part 2](#) I write my own firmware for the Arduino. It speaks the Meade LX200 protocol, so KStars/Ekos can drive the mount for GoTo and autoguiding.

---
title: "Bresser EQ-3 to GoTo, part 1: motors, belts and the first spin"
description: "No upgrade kit exists for the Bresser EQ-3, so I motorised both axes myself with NEMA 17 steppers and GT2 belts: parts, costs and the mistakes I made."
section: builds
date: 2026-10-20
draft: false
cover: "../../assets/posts/eq3-goto/mount-setup.jpg"
coverAlt: "The motorised Bresser EQ-3 with the Newtonian telescope: stepper motors and belts on both axes, and the CNC Shield strapped to a tripod leg"
tags: ["Bresser EQ-3", "GoTo", "Stepper motors", "Arduino", "Mount upgrade", "DIY"]
files:
  - label: "Bresser EQ-3 mount"
    href: "https://www.bresser.com/p/bresser-eq-3-telescope-mount-incl.-tripod-black-4964450"
  - label: "OnStep kit (the design I borrowed from)"
    href: "https://www.terransindustry.com/collections/onstep-v4-kit"
---

My first telescope, like that of many amateur astronomers, was a Newtonian on an inexpensive equatorial mount: the **[Bresser EQ-3](https://www.bresser.com/p/bresser-eq-3-telescope-mount-incl.-tripod-black-4964450)**. It served me well for visual observing. Then I wanted to try astrophotography, and that needs a mount that tracks the sky and can point itself at a target: a **GoTo** mount.

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
| [NEMA 17 stepper, 0.9° (42BYGHM809)](https://grobotronics.com/42byghm809-4.8kg.cm-400-steps-rev.html) | €16.90 |
| [NEMA 17 motor mount](https://grobotronics.com/stepper-motor-mount-nema-17.html) | €1.90 |
| [GT2 pulley, 20T, 5 mm bore](https://grobotronics.com/aluminum-gt2-timing-pulley-20-tooth.html) | €1.60 |
| [GT2 pulley, 60T, 6 mm bore](https://grobotronics.com/aluminum-gt2-timing-pulley-60t.html) | €3.60 |
| [GT2 belt, 188 mm](https://grobotronics.com/timing-belt-gt2-188mm.html) | €1.40 |
| **Total** (plus a few screws) | **€25.40** |

I bought almost all the parts from [Grobotronics](https://grobotronics.com/), an electronics shop in Greece. The links in the tables go to their product pages (the TMC2209 drivers link to a price comparison page on Skroutz). None of them are affiliate links.

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
| [NEMA 17 stepper, 0.9° (42BYGHM809)](https://grobotronics.com/42byghm809-4.8kg.cm-400-steps-rev.html) | €16.90 |
| [NEMA 17 motor mount](https://grobotronics.com/stepper-motor-mount-nema-17.html) | €1.90 |
| GT2 pulleys, [20T](https://grobotronics.com/aluminum-gt2-timing-pulley-20-tooth.html) + [60T](https://grobotronics.com/aluminum-gt2-timing-pulley-60t.html) | €5.20 |
| [V-slot gantry plate 20 mm](https://grobotronics.com/v-slot-gantry-plate-20mmoem.html) | €3.60 |
| [GT2 belt, 180 mm](https://grobotronics.com/timing-belt-gt2-180mm.html) | €1.40 |
| Screws and nuts | €0.48 |
| **Total** | **€29.48** |

## 4. The electronics, take two (and what went wrong)

With both axes motorised, I needed a proper controller. I first chose an **ESP32-S3 DevKitC-1**: it has Wi-Fi and is easy to program over USB. I wired it to the drivers on the breadboard.

That's where I learned three lessons the hard way:

1. **A breadboard can't carry stepper-motor current.** Its contacts are meant for signals, not for amps flowing to two motors.
2. **My capacitor wasn't right for the job.** A driver needs a suitable capacitor right at its power input to absorb voltage spikes from the motor.
3. **My power supply was too weak.** 24 V at 2 A isn't enough for two motors moving at the same time.

The fix turned out to be a single, cheap board: the **Arduino CNC Shield V3**, for €3.60. It's built for driving steppers (it's used in 3D printers and CNC machines). It has sockets for up to four driver modules, proper power wiring, and it plugs straight onto an Arduino. So I switched from the ESP32 to an **Arduino UNO R4 WiFi** (€32.80), and to a **12 V 5 A** power supply (€9.90).

And for the drivers, I went back to my first choice: two **TMC2209**s, one per axis. This time I found them: €6.90 each. They're much quieter than the A4988 and DRV8825, and they move the motors more smoothly, which matters when the mount has to track the sky slowly and steadily. Mine are the UART version, which can be configured over a serial link, but for now I run them in plain step/direction mode, like the other drivers.

![A red Arduino CNC Shield V3 with two stepper driver modules under blue heat sinks, plugged onto an Arduino, with motor wires attached](../../assets/posts/eq3-goto/cnc-shield.jpg)

*The final electronics: the CNC Shield V3 on the Arduino, with two TMC2209 drivers under blue heat sinks.*

### Wiring it up

The CNC Shield makes the wiring almost plug-and-play:

1. **Shield on the Arduino.** It plugs straight onto the UNO's headers.
2. **Microstep jumpers first.** Under each driver slot are three pin pairs. Each [jumper](https://grobotronics.com/jumper-2-54mm-2-pin-blue.html) (a small 2.54 mm cap) connects a setting pin of the driver (MS1, MS2) to 5 V, and the combination picks the microstep mode. I run mine at 16; the [TMC2209 datasheet](https://www.analog.com/en/products/tmc2209.html) has the table.
3. **Drivers in their slots**, one per axis. With OnStep, RA goes in X and Dec in Y (my own firmware used Z for RA). Line up the driver's EN pin with the EN mark on the shield: a driver plugged in the wrong way round burns out.
4. **Motors on the 4-pin headers** next to each slot. If an axis turns the wrong way, flip the connector or reverse it in software.
5. **Power into the blue screw terminal:** 12 V from the 5 A supply, minding + and −. This powers the motors only; the Arduino itself runs from USB.
6. **Set the motor current** with the small potentiometer on each driver before the first run, so the motors stay cool without skipping steps.

One rule above all: never plug or unplug a motor while the power is on. It can destroy the driver.

## 5. From motor to sky: how precisely the axes turn

The motor spins a small 20-tooth pulley, and the belt carries that to a 60-tooth pulley on the mount's slow-motion shaft: a 3:1 reduction. That shaft is a [worm](https://en.wikipedia.org/wiki/Worm_drive), a screw that meshes with a large gear wheel on the axis. Each full turn of the worm moves the wheel by just one tooth, so the axis turns slowly and precisely.

<figure class="compact">
  <img src="/media/eq3-goto/worm-gear.webp" width="480" height="342" loading="lazy" alt="Animation of a worm gear: a threaded shaft turning and slowly rotating a large toothed wheel beneath it">
  <figcaption>A worm turning a gear wheel. Animation: <a href="https://commons.wikimedia.org/wiki/File:Worm_Gear.gif">Wikimedia Commons</a>, public domain.</figcaption>
</figure>

Every reduction in that chain makes the axis move in smaller steps. The motor has 400 full steps per turn, and the driver splits each into 16 *microsteps*, set by the jumpers from the wiring steps above. On the RA axis, one full turn then takes 400 × 16 × 3 (belt) × 140 (worm wheel): about 2.7 million microsteps, or 7,470 per degree. So each microstep turns the axis by roughly **half an arcsecond**.

<figure class="note-figure" role="img" aria-label="A handwritten note working out how far one microstep turns the RA axis: 400 steps times 16 microsteps times 3 for the belt times 140 for the worm wheel is 2,688,000 microsteps per turn, so about 0.48 arcseconds each.">
<div class="note">
<span class="tape" aria-hidden="true"></span>
<span class="title">How fine is one step?</span>
<svg viewBox="0 0 340 168" aria-hidden="true">
<rect class="pen" x="8" y="44" width="40" height="40" rx="3" />
<path class="pen" d="M48 64 H55" />
<circle class="pen" cx="64" cy="64" r="9" />
<circle class="pen" cx="140" cy="64" r="26" />
<path class="pen" d="M64 55 L140 38 M64 73 L140 90" />
<path class="pen" d="M166 64 H196" />
<rect class="pen" x="196" y="52" width="64" height="24" rx="4" />
<path class="pen" d="M208 52 L200 76 M220 52 L212 76 M232 52 L224 76 M244 52 L236 76 M256 52 L248 76" />
<circle class="pen" cx="228" cy="118" r="40" />
<circle class="pen-red" cx="228" cy="118" r="43" stroke-dasharray="3 4" />
<text class="pen-text" x="6" y="104" style="font-size:16px">motor</text>
<text class="pen-text" x="50" y="40" style="font-size:16px">20T</text>
<text class="pen-text" x="124" y="28" style="font-size:16px">60T</text>
<text class="pen-text" x="84" y="110" style="font-size:16px">3 : 1</text>
<text class="pen-text" x="212" y="44" style="font-size:16px">worm</text>
<text class="pen-text" x="208" y="124" style="font-size:16px">140T</text>
</svg>
<span class="eq">400 steps</span>
<span class="eq">× 16 microsteps</span>
<span class="eq">× 3 (belt)</span>
<span class="eq">× 140 (worm)</span>
<span class="eq big">= 2,688,000 per turn</span>
<span class="eq">360° = 1,296,000″</span>
<span class="eq">1,296,000″ / 2,688,000</span>
<span class="eq big">≈ <span class="circled">0.48″</span></span>
<span class="aside">≈ half an arcsecond per step!</span>
</div>
</figure>

Why 16 microsteps? A TMC2209 offers 8, 16, 32 or 64. More gives smoother motion, which slow sidereal tracking likes, but the Arduino then has to send more pulses for the same move, and that limits how fast the mount can slew. 16 is a good balance, and the TMC2209 smooths each microstep internally into 256 finer ones anyway.

For comparison, Sky-Watcher's own [SynScan GoTo kit for the EQ3](https://eu.levenhuk.com/catalogue/accessories/telescope-accessories/telescope-mounts/sky-watcher-eq3-mount-synscan-upgrade-kit/) is quoted at about 0.3″, and the much bigger [EQ6-R Pro](https://www.robtics.nl/en/equatorial-eq/sky-watcher-eq6-r-pro-synscan-heavy-duty-computerised-go-to-mount) at about 0.14″. All of these are finer than the blur from the atmosphere on a typical night, about 2–4″. The real limit is elsewhere: small errors in the mount's own gears.

One caveat: the 140 teeth on the worm wheel was my assumption at this point, not a measured number. In [part 2](../eq3-goto-part-2/#the-gears-grease-mesh-and-periodic-error) I regrease the gears and adjust how the worms mesh to reduce their periodic error. Measuring that error also confirms the 140 teeth: it repeats once per turn of the worm, about every 10 minutes.

## 6. What it cost

| | Cost |
|---|---|
| Mechanics, declination axis | €25.40 |
| Mechanics, right ascension axis | €29.48 |
| **Mechanics, both axes** | **≈ €55** |
| [Arduino UNO R4 WiFi](https://grobotronics.com/arduino-uno-r4-wifi.html) | €32.80 |
| [Arduino CNC Shield V3](https://grobotronics.com/arduino-cnc-shield-v3.html) | €3.60 |
| [TMC2209 drivers](https://www.skroutz.gr/s/61336081/47217-tmc2209-v1-2-uart-stepper-motor-driver.html), 2 × €6.90 | €13.80 |
| [Power supply, 12 V 5 A](https://grobotronics.com/power-supply-12v-5a-output-5.5x2.1-sn-12d500.html) | €9.90 |
| **Electronics** | **≈ €60** |
| **The final build** | **≈ €115** |
| Everything I actually spent up to here | ≈ €215 |

The gap between the last two numbers is the price of learning: spare belts, the A4988 and DRV8825 I tested with before the TMC2209s, the breadboard and ESP32 detour, and tools like the multimeter. If you follow this build, you can skip most of that.

## Next: making it a GoTo mount

![The motorised Bresser EQ-3 indoors with the Newtonian telescope mounted: stepper motors and belts on both axes, and a red CNC Shield with its drivers strapped to a tripod leg](../../assets/posts/eq3-goto/mount-setup.jpg)

*The whole setup: both motors and belts on the mount head, and the CNC Shield with its drivers strapped to a tripod leg.*

At this point I had two motors that turned on command. A GoTo mount also needs to know where it's pointing, track the sky at the right speed, and talk to planetarium software. That's the subject of [part 2](../eq3-goto-part-2/): the software that turns these motors into a GoTo mount, and the first nights under the sky. A sneak peek:

![The Dumbbell Nebula, M27: a green, apple-core-shaped cloud with reddish edges in a dense star field](../../assets/posts/eq3-goto/m27-dumbbell.jpg)

*M27, the Dumbbell Nebula. More first-light images, and how they were taken, are in [part 2](../eq3-goto-part-2/#first-light).*

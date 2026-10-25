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

On the stock mount, each axis has a short **slow-motion shaft** where a hand cable plugs in: you turn the knob at the other end and the axis creeps along. Those two shafts are what the motors drive:

![Bresser's product photo of the EQ-3 mount head, cropped, with two circles: one around the declination slow-motion shaft just under the telescope saddle, where the flexible hand cable plugs in, and one around the RA slow-motion shaft with its small hand wheel, near the base of the mount, plus two small circles on the socket screws of the declination housing where the motor bracket is fixed, and a dash-dot line along the declination axis, through the counterweight bar and the declination housing](../../assets/posts/eq3-goto/eq3-stock-shafts.jpg)

*The stock EQ-3: (1) the Dec slow-motion shaft, with the hand cable plugged in; (2) the RA slow-motion shaft; (3) the two screws on the Dec housing that I used to fix the motor bracket; (4) the Dec axis, which runs along the counterweight bar. Photo: [Bresser](https://www.bresser.com/p/bresser-eq-3-telescope-mount-incl.-tripod-black-4964450).*

Each shaft gets a 60-tooth pulley, and a belt connects it to the motor. For the declination axis I bought:

- **Motor:** a [NEMA 17](https://grobotronics.com/42byghm809-4.8kg.cm-400-steps-rev.html), like the one OnStep uses. I chose a **0.9°/step** model (400 steps per revolution) rather than the usual 1.8°, because it doubles the resolution.
- **Motor mount:** a standard [NEMA 17 bracket](https://grobotronics.com/stepper-motor-mount-nema-17.html) to hold the motor against the mount.
- **Pulleys:** GT2, [**20 teeth**](https://grobotronics.com/aluminum-gt2-timing-pulley-20-tooth.html) on the motor shaft (5 mm) and [**60 teeth**](https://grobotronics.com/aluminum-gt2-timing-pulley-60t.html) on the mount's axis shaft (6 mm). That gives a **3:1 reduction**, so more torque and three times the resolution again.
- **Belt:** I had no idea what length the setup needed, so I picked one more or less at random: [**188 mm**](https://grobotronics.com/timing-belt-gt2-188mm.html).

Everything arrived and, almost by magic, it fitted. The only thing missing was screws to fix the motor to its bracket and the bracket to the mount. An M3/M4 assortment kit solved that, and I had a stepper motor on the declination axis.

Here's how it goes together. The bracket's base screws flat against the side of the declination worm housing, using the housing's own two screws (3 in the photo above). The motor sits beside the housing, bolted to the bracket's upright face with four M3 screws, its shaft through the big hole and pointing the same way as the slow-motion shaft. The belt runs in front, from the motor's pulley up to the one on the slow-motion shaft:

<figure class="drive-3d bracket-3d" role="img" aria-label="An exploded isometric sketch of the declination drive as built. The L-shaped NEMA 17 bracket's base screws flat against the side of the declination worm housing, using the housing's two screws. The stepper motor sits beside the housing, bolted to the bracket's upright face with four M3 screws, its shaft pointing the same way as the mount's slow-motion shaft. A GT2 belt runs in front, from the motor's 20-tooth pulley up to the 60-tooth pulley on the slow-motion shaft.">
<svg viewBox="0 0 660 400" aria-hidden="true">
<path class="d-body d-top" d="M349.1 67.0 L480.5 142.8 L406.8 185.4 L275.4 109.6 Z" />
<path class="d-body" d="M480.5 231.7 L406.8 274.2 L406.8 185.4 L480.5 142.8 Z" />
<path class="d-body d-side" d="M275.4 198.4 L406.8 274.2 L406.8 185.4 L275.4 109.6 Z" />
<path class="d-hole" d="M329.3 177.6 L329.2 176.8 L329.0 175.8 L328.7 174.9 L328.3 174.0 L327.8 173.1 L327.2 172.3 L326.5 171.5 L325.8 170.9 L325.1 170.4 L324.4 170.1 L323.7 169.9 L323.0 169.9 L322.4 170.0 L321.9 170.3 L321.5 170.7 L321.2 171.3 L321.0 172.0 L320.9 172.8 L321.0 173.7 L321.2 174.6 L321.5 175.5 L321.9 176.5 L322.4 177.4 L323.0 178.2 L323.7 178.9 L324.4 179.5 L325.1 180.0 L325.8 180.4 L326.5 180.6 L327.2 180.6 L327.8 180.5 L328.3 180.2 L328.7 179.7 L329.0 179.1 L329.2 178.4 Z" />
<path class="d-hole" d="M356.5 193.4 L356.4 192.5 L356.3 191.6 L356.0 190.6 L355.5 189.7 L355.0 188.8 L354.4 188.0 L353.8 187.3 L353.1 186.6 L352.3 186.1 L351.6 185.8 L350.9 185.6 L350.3 185.6 L349.7 185.7 L349.2 186.0 L348.7 186.5 L348.4 187.0 L348.2 187.7 L348.2 188.5 L348.2 189.4 L348.4 190.3 L348.7 191.3 L349.2 192.2 L349.7 193.1 L350.3 193.9 L350.9 194.6 L351.6 195.3 L352.3 195.8 L353.1 196.1 L353.8 196.3 L354.4 196.3 L355.0 196.2 L355.5 195.9 L356.0 195.4 L356.3 194.9 L356.4 194.2 Z" />
<path class="d-body d-top" d="M430.8 193.7 L430.9 192.0 L431.2 190.2 L431.7 188.3 L432.4 186.4 L433.2 184.5 L434.1 182.7 L435.2 180.9 L436.5 179.3 L437.8 177.8 L439.2 176.4 L440.6 175.3 L442.1 174.3 L443.5 173.6 L445.0 173.1 L446.4 172.8 L447.7 172.8 L448.9 173.0 L450.0 173.5 L451.0 174.2 L451.8 175.2 L452.4 176.3 L452.9 177.6 L453.2 179.1 L453.3 180.8 L453.2 182.5 L452.9 184.3 L452.4 186.2 L451.8 188.1 L451.0 190.0 L450.0 191.8 L448.9 193.6 L447.7 195.2 L446.4 196.7 L445.0 198.1 L443.5 199.2 L442.1 200.2 L440.6 200.9 L439.2 201.4 L437.8 201.7 L436.5 201.7 L435.2 201.5 L434.1 201.0 L433.2 200.3 L432.4 199.3 L431.7 198.2 L431.2 196.9 L430.9 195.4 Z" />
<path class="d-shaft" d="M442.1 187.2 L477.3 207.6" />
<path class="d-plate d-top" d="M262.6 165.0 L342.7 211.3 L337.9 214.1 L257.8 167.8 Z" />
<path class="d-plate" d="M342.7 292.7 L337.9 295.5 L337.9 214.1 L342.7 211.3 Z" />
<path class="d-plate d-side" d="M257.8 249.2 L337.9 295.5 L337.9 214.1 L257.8 167.8 Z" />
<path class="d-hole" d="M261.0 207.0 L277.0 216.3 L277.0 208.2 L261.0 198.9 Z" />
<path class="d-guide" d="M325.1 175.2 L233.8 227.9" />
<path class="d-hole" d="M288.3 222.8 L304.3 232.0 L304.3 223.9 L288.3 214.6 Z" />
<path class="d-guide" d="M352.3 190.9 L261.0 243.7" />
<path class="d-guide" d="M258.6 247.8 L359.6 306.1" />
<path class="d-guide" d="M258.6 190.5 L359.6 248.8" />
<path class="d-guide" d="M209.0 276.5 L309.9 334.8" />
<path class="d-guide" d="M209.0 219.2 L309.9 277.4" />
<path class="d-body d-top" d="M203.3 138.2 L267.4 175.2 L200.1 214.1 L136.1 177.1 Z" />
<path class="d-body" d="M267.4 252.9 L200.1 291.8 L200.1 214.1 L267.4 175.2 Z" />
<path class="d-body d-side" d="M136.1 254.8 L200.1 291.8 L200.1 214.1 L136.1 177.1 Z" />
<path class="d-body d-top" d="M216.2 243.7 L216.3 240.9 L216.8 238.1 L217.5 235.1 L218.5 232.1 L219.8 229.2 L221.3 226.3 L223.1 223.5 L225.0 221.0 L227.0 218.6 L229.2 216.5 L231.5 214.7 L233.8 213.2 L236.1 212.0 L238.3 211.2 L240.5 210.8 L242.6 210.8 L244.5 211.2 L246.2 211.9 L247.8 213.0 L249.0 214.5 L250.1 216.3 L250.8 218.4 L251.3 220.8 L251.4 223.3 L251.3 226.1 L250.8 228.9 L250.1 231.9 L249.0 234.9 L247.8 237.8 L246.2 240.7 L244.5 243.5 L242.6 246.0 L240.5 248.4 L238.3 250.5 L236.1 252.3 L233.8 253.8 L231.5 255.0 L229.2 255.8 L227.0 256.2 L225.0 256.2 L223.1 255.8 L221.3 255.1 L219.8 254.0 L218.5 252.5 L217.5 250.7 L216.8 248.6 L216.3 246.2 Z" />
<path class="d-shaft d-thin" d="M233.8 233.5 L265.8 252.0" />
<path class="d-guide" d="M265.8 252.0 L309.1 277.0" />
<path class="d-screwshaft" d="M259.4 213.2 L240.2 224.2" />
<path class="d-screwhead" d="M242.4 229.2 L242.4 228.1 L242.1 226.9 L241.7 225.7 L241.2 224.5 L240.5 223.3 L239.7 222.2 L238.9 221.3 L237.9 220.5 L237.0 219.8 L236.0 219.4 L235.1 219.1 L234.3 219.1 L233.5 219.3 L232.8 219.6 L232.3 220.2 L231.9 221.0 L231.6 221.9 L231.5 223.0 L231.6 224.1 L231.9 225.3 L232.3 226.5 L232.8 227.7 L233.5 228.9 L234.3 230.0 L235.1 230.9 L236.0 231.7 L237.0 232.4 L237.9 232.8 L238.9 233.1 L239.7 233.1 L240.5 232.9 L241.2 232.6 L241.7 232.0 L242.1 231.2 L242.4 230.3 Z" />
<path class="d-screwshaft" d="M286.7 228.9 L267.4 240.0" />
<path class="d-screwhead" d="M269.7 245.0 L269.6 243.8 L269.3 242.6 L268.9 241.4 L268.4 240.2 L267.7 239.0 L266.9 238.0 L266.1 237.0 L265.2 236.2 L264.2 235.5 L263.3 235.1 L262.4 234.8 L261.5 234.8 L260.7 235.0 L260.1 235.4 L259.5 236.0 L259.1 236.7 L258.9 237.6 L258.8 238.7 L258.9 239.8 L259.1 241.0 L259.5 242.2 L260.1 243.5 L260.7 244.6 L261.5 245.7 L262.4 246.7 L263.3 247.5 L264.2 248.1 L265.2 248.6 L266.1 248.8 L266.9 248.8 L267.7 248.7 L268.4 248.3 L268.9 247.7 L269.3 246.9 L269.6 246.0 Z" />
<path class="d-plate d-top" d="M342.7 211.3 L347.5 214.1 L275.4 255.7 L270.6 252.9 Z" />
<path class="d-plate" d="M347.5 295.5 L275.4 337.1 L275.4 255.7 L347.5 214.1 Z" />
<path class="d-plate d-side" d="M270.6 334.3 L275.4 337.1 L275.4 255.7 L270.6 252.9 Z" />
<path class="d-hole" d="M291.5 287.1 L291.6 284.4 L292.1 281.5 L292.8 278.6 L293.8 275.6 L295.1 272.7 L296.6 269.8 L298.4 267.0 L300.3 264.4 L302.3 262.1 L304.5 260.0 L306.8 258.1 L309.1 256.6 L311.4 255.5 L313.6 254.7 L315.8 254.3 L317.9 254.3 L319.8 254.6 L321.5 255.4 L323.1 256.5 L324.3 258.0 L325.4 259.8 L326.1 261.9 L326.6 264.2 L326.7 266.8 L326.6 269.5 L326.1 272.4 L325.4 275.4 L324.3 278.3 L323.1 281.3 L321.5 284.2 L319.8 286.9 L317.9 289.5 L315.8 291.9 L313.6 294.0 L311.4 295.8 L309.1 297.3 L306.8 298.5 L304.5 299.3 L302.3 299.7 L300.3 299.7 L298.4 299.3 L296.6 298.6 L295.1 297.4 L293.8 296.0 L292.8 294.2 L292.1 292.1 L291.6 289.7 Z" />
<path class="d-hole" d="M331.0 293.0 L331.1 292.5 L331.1 292.1 L331.3 291.6 L331.4 291.1 L331.6 290.6 L331.9 290.1 L332.2 289.7 L332.5 289.3 L332.8 288.9 L333.2 288.5 L333.5 288.2 L333.9 288.0 L334.3 287.8 L334.7 287.7 L335.0 287.6 L335.4 287.6 L335.7 287.7 L336.0 287.8 L336.2 288.0 L336.4 288.2 L336.6 288.5 L336.7 288.8 L336.8 289.2 L336.8 289.6 L336.8 290.1 L336.7 290.6 L336.6 291.0 L336.4 291.5 L336.2 292.0 L336.0 292.5 L335.7 292.9 L335.4 293.4 L335.0 293.8 L334.7 294.1 L334.3 294.4 L333.9 294.6 L333.5 294.8 L333.2 295.0 L332.8 295.0 L332.5 295.0 L332.2 295.0 L331.9 294.8 L331.6 294.7 L331.4 294.4 L331.3 294.1 L331.1 293.8 L331.1 293.4 Z" />
<path class="d-hole" d="M331.0 235.6 L331.1 235.2 L331.1 234.7 L331.3 234.2 L331.4 233.7 L331.6 233.3 L331.9 232.8 L332.2 232.3 L332.5 231.9 L332.8 231.5 L333.2 231.2 L333.5 230.9 L333.9 230.6 L334.3 230.4 L334.7 230.3 L335.0 230.2 L335.4 230.2 L335.7 230.3 L336.0 230.4 L336.2 230.6 L336.4 230.9 L336.6 231.1 L336.7 231.5 L336.8 231.9 L336.8 232.3 L336.8 232.7 L336.7 233.2 L336.6 233.7 L336.4 234.2 L336.2 234.7 L336.0 235.1 L335.7 235.6 L335.4 236.0 L335.0 236.4 L334.7 236.7 L334.3 237.0 L333.9 237.3 L333.5 237.5 L333.2 237.6 L332.8 237.7 L332.5 237.7 L332.2 237.6 L331.9 237.5 L331.6 237.3 L331.4 237.1 L331.3 236.8 L331.1 236.4 L331.1 236.0 Z" />
<path class="d-hole" d="M281.4 321.7 L281.4 321.2 L281.5 320.7 L281.6 320.3 L281.8 319.8 L282.0 319.3 L282.2 318.8 L282.5 318.4 L282.8 317.9 L283.1 317.5 L283.5 317.2 L283.9 316.9 L284.3 316.7 L284.6 316.5 L285.0 316.3 L285.4 316.3 L285.7 316.3 L286.0 316.3 L286.3 316.5 L286.5 316.6 L286.8 316.9 L286.9 317.2 L287.0 317.5 L287.1 317.9 L287.1 318.3 L287.1 318.8 L287.0 319.2 L286.9 319.7 L286.8 320.2 L286.5 320.7 L286.3 321.2 L286.0 321.6 L285.7 322.0 L285.4 322.4 L285.0 322.8 L284.6 323.1 L284.3 323.3 L283.9 323.5 L283.5 323.6 L283.1 323.7 L282.8 323.7 L282.5 323.6 L282.2 323.5 L282.0 323.3 L281.8 323.1 L281.6 322.8 L281.5 322.5 L281.4 322.1 Z" />
<path class="d-hole" d="M281.4 264.3 L281.4 263.9 L281.5 263.4 L281.6 262.9 L281.8 262.4 L282.0 261.9 L282.2 261.5 L282.5 261.0 L282.8 260.6 L283.1 260.2 L283.5 259.9 L283.9 259.6 L284.3 259.3 L284.6 259.1 L285.0 259.0 L285.4 258.9 L285.7 258.9 L286.0 259.0 L286.3 259.1 L286.5 259.3 L286.8 259.5 L286.9 259.8 L287.0 260.2 L287.1 260.6 L287.1 261.0 L287.1 261.4 L287.0 261.9 L286.9 262.4 L286.8 262.9 L286.5 263.3 L286.3 263.8 L286.0 264.3 L285.7 264.7 L285.4 265.1 L285.0 265.4 L284.6 265.7 L284.3 266.0 L283.9 266.2 L283.5 266.3 L283.1 266.4 L282.8 266.4 L282.5 266.3 L282.2 266.2 L282.0 266.0 L281.8 265.7 L281.6 265.5 L281.5 265.1 L281.4 264.7 Z" />
<path class="d-screwshaft" d="M340.3 295.0 L354.7 303.3" />
<path class="d-screwhead" d="M351.9 306.9 L351.9 306.2 L352.0 305.4 L352.2 304.7 L352.5 303.9 L352.8 303.2 L353.2 302.4 L353.6 301.7 L354.1 301.1 L354.6 300.5 L355.2 299.9 L355.8 299.5 L356.3 299.1 L356.9 298.8 L357.5 298.6 L358.1 298.5 L358.6 298.5 L359.1 298.6 L359.5 298.8 L359.9 299.1 L360.2 299.4 L360.5 299.9 L360.7 300.4 L360.8 301.0 L360.8 301.7 L360.8 302.4 L360.7 303.1 L360.5 303.9 L360.2 304.6 L359.9 305.4 L359.5 306.1 L359.1 306.8 L358.6 307.5 L358.1 308.1 L357.5 308.6 L356.9 309.1 L356.3 309.4 L355.8 309.7 L355.2 309.9 L354.6 310.0 L354.1 310.0 L353.6 309.9 L353.2 309.8 L352.8 309.5 L352.5 309.1 L352.2 308.6 L352.0 308.1 L351.9 307.5 Z" />
<path class="d-screwshaft" d="M340.3 237.7 L354.7 246.0" />
<path class="d-screwhead" d="M351.9 249.5 L351.9 248.8 L352.0 248.1 L352.2 247.3 L352.5 246.6 L352.8 245.8 L353.2 245.1 L353.6 244.4 L354.1 243.7 L354.6 243.1 L355.2 242.6 L355.8 242.1 L356.3 241.7 L356.9 241.4 L357.5 241.2 L358.1 241.1 L358.6 241.1 L359.1 241.2 L359.5 241.4 L359.9 241.7 L360.2 242.1 L360.5 242.5 L360.7 243.1 L360.8 243.7 L360.8 244.3 L360.8 245.0 L360.7 245.8 L360.5 246.5 L360.2 247.3 L359.9 248.0 L359.5 248.7 L359.1 249.4 L358.6 250.1 L358.1 250.7 L357.5 251.2 L356.9 251.7 L356.3 252.1 L355.8 252.4 L355.2 252.6 L354.6 252.7 L354.1 252.7 L353.6 252.6 L353.2 252.4 L352.8 252.1 L352.5 251.7 L352.2 251.3 L352.0 250.8 L351.9 250.2 Z" />
<path class="d-screwshaft" d="M290.7 323.7 L305.1 332.0" />
<path class="d-screwhead" d="M302.2 335.5 L302.2 334.8 L302.3 334.1 L302.5 333.3 L302.8 332.6 L303.1 331.8 L303.5 331.1 L304.0 330.4 L304.4 329.7 L305.0 329.1 L305.5 328.6 L306.1 328.1 L306.7 327.8 L307.3 327.5 L307.8 327.3 L308.4 327.2 L308.9 327.2 L309.4 327.3 L309.9 327.4 L310.2 327.7 L310.6 328.1 L310.8 328.6 L311.0 329.1 L311.1 329.7 L311.2 330.3 L311.1 331.0 L311.0 331.8 L310.8 332.5 L310.6 333.3 L310.2 334.0 L309.9 334.8 L309.4 335.5 L308.9 336.1 L308.4 336.7 L307.8 337.3 L307.3 337.7 L306.7 338.1 L306.1 338.4 L305.5 338.6 L305.0 338.7 L304.4 338.7 L304.0 338.6 L303.5 338.4 L303.1 338.1 L302.8 337.8 L302.5 337.3 L302.3 336.8 L302.2 336.2 Z" />
<path class="d-screwshaft" d="M290.7 266.3 L305.1 274.7" />
<path class="d-screwhead" d="M302.2 278.2 L302.2 277.5 L302.3 276.7 L302.5 276.0 L302.8 275.2 L303.1 274.5 L303.5 273.8 L304.0 273.1 L304.4 272.4 L305.0 271.8 L305.5 271.3 L306.1 270.8 L306.7 270.4 L307.3 270.1 L307.8 269.9 L308.4 269.8 L308.9 269.8 L309.4 269.9 L309.9 270.1 L310.2 270.4 L310.6 270.8 L310.8 271.2 L311.0 271.7 L311.1 272.3 L311.2 273.0 L311.1 273.7 L311.0 274.4 L310.8 275.2 L310.6 275.9 L310.2 276.7 L309.9 277.4 L309.4 278.1 L308.9 278.8 L308.4 279.4 L307.8 279.9 L307.3 280.4 L306.7 280.8 L306.1 281.1 L305.5 281.3 L305.0 281.4 L304.4 281.4 L304.0 281.3 L303.5 281.1 L303.1 280.8 L302.8 280.4 L302.5 280.0 L302.3 279.4 L302.2 278.8 Z" />
<path class="d-shaft d-thin" d="M309.1 277.0 L336.3 292.7" />
<path class="d-pulley d-back" d="M424.3 212.3 L424.5 207.6 L425.3 202.6 L426.6 197.5 L428.4 192.3 L430.6 187.2 L433.2 182.2 L436.3 177.4 L439.6 172.9 L443.2 168.8 L447.0 165.1 L450.9 161.9 L454.9 159.3 L458.9 157.3 L462.8 155.9 L466.6 155.2 L470.2 155.2 L473.5 155.9 L476.5 157.2 L479.2 159.1 L481.4 161.7 L483.2 164.8 L484.4 168.4 L485.2 172.5 L485.5 177.0 L485.2 181.7 L484.4 186.7 L483.2 191.8 L481.4 197.0 L479.2 202.1 L476.5 207.1 L473.5 211.9 L470.2 216.4 L466.6 220.5 L462.8 224.2 L458.9 227.4 L454.9 230.0 L450.9 232.0 L447.0 233.4 L443.2 234.1 L439.6 234.1 L436.3 233.4 L433.2 232.1 L430.6 230.2 L428.4 227.6 L426.6 224.5 L425.3 220.9 L424.5 216.8 Z" />
<path class="d-pulley" d="M430.7 216.0 L431.0 211.3 L431.7 206.3 L433.0 201.2 L434.8 196.0 L437.0 190.9 L439.7 185.9 L442.7 181.1 L446.0 176.6 L449.6 172.5 L453.4 168.8 L457.3 165.6 L461.3 163.0 L465.3 161.0 L469.2 159.6 L473.0 158.9 L476.6 158.9 L479.9 159.6 L482.9 160.9 L485.6 162.8 L487.8 165.4 L489.6 168.5 L490.8 172.1 L491.6 176.2 L491.9 180.7 L491.6 185.4 L490.8 190.4 L489.6 195.5 L487.8 200.7 L485.6 205.8 L482.9 210.8 L479.9 215.6 L476.6 220.1 L473.0 224.2 L469.2 227.9 L465.3 231.1 L461.3 233.7 L457.3 235.7 L453.4 237.1 L449.6 237.8 L446.0 237.8 L442.7 237.1 L439.7 235.8 L437.0 233.9 L434.8 231.3 L433.0 228.2 L431.7 224.6 L431.0 220.5 Z" />
<path class="d-hub" d="M455.2 201.9 L455.2 200.9 L455.4 199.9 L455.6 198.9 L456.0 197.9 L456.4 196.9 L457.0 195.9 L457.6 194.9 L458.2 194.0 L458.9 193.2 L459.7 192.4 L460.5 191.8 L461.3 191.3 L462.1 190.9 L462.9 190.6 L463.6 190.5 L464.4 190.5 L465.0 190.6 L465.6 190.9 L466.1 191.2 L466.6 191.8 L466.9 192.4 L467.2 193.1 L467.4 193.9 L467.4 194.8 L467.4 195.8 L467.2 196.8 L466.9 197.8 L466.6 198.8 L466.1 199.8 L465.6 200.8 L465.0 201.8 L464.4 202.7 L463.6 203.5 L462.9 204.3 L462.1 204.9 L461.3 205.4 L460.5 205.8 L459.7 206.1 L458.9 206.2 L458.2 206.2 L457.6 206.1 L457.0 205.8 L456.4 205.5 L456.0 204.9 L455.6 204.3 L455.4 203.6 L455.2 202.8 Z" />
<path class="d-pulley d-back" d="M319.7 294.9 L319.7 293.3 L320.0 291.7 L320.4 289.9 L321.0 288.2 L321.8 286.5 L322.7 284.8 L323.7 283.2 L324.8 281.7 L326.0 280.3 L327.3 279.1 L328.6 278.0 L329.9 277.2 L331.3 276.5 L332.6 276.0 L333.8 275.8 L335.0 275.8 L336.2 276.0 L337.2 276.4 L338.0 277.1 L338.8 278.0 L339.4 279.0 L339.8 280.2 L340.1 281.6 L340.2 283.1 L340.1 284.7 L339.8 286.3 L339.4 288.1 L338.8 289.8 L338.0 291.5 L337.2 293.2 L336.2 294.8 L335.0 296.3 L333.8 297.7 L332.6 298.9 L331.3 300.0 L329.9 300.8 L328.6 301.5 L327.3 302.0 L326.0 302.2 L324.8 302.2 L323.7 302.0 L322.7 301.6 L321.8 300.9 L321.0 300.0 L320.4 299.0 L320.0 297.8 L319.7 296.4 Z" />
<path class="d-pulley" d="M326.1 298.6 L326.2 297.0 L326.4 295.4 L326.8 293.6 L327.4 291.9 L328.2 290.2 L329.1 288.5 L330.1 286.9 L331.2 285.4 L332.4 284.0 L333.7 282.8 L335.0 281.7 L336.3 280.9 L337.7 280.2 L339.0 279.7 L340.2 279.5 L341.4 279.5 L342.6 279.7 L343.6 280.1 L344.5 280.8 L345.2 281.7 L345.8 282.7 L346.2 283.9 L346.5 285.3 L346.6 286.8 L346.5 288.4 L346.2 290.0 L345.8 291.8 L345.2 293.5 L344.5 295.2 L343.6 296.9 L342.6 298.5 L341.4 300.0 L340.2 301.4 L339.0 302.6 L337.7 303.7 L336.3 304.5 L335.0 305.2 L333.7 305.7 L332.4 305.9 L331.2 305.9 L330.1 305.7 L329.1 305.3 L328.2 304.6 L327.4 303.7 L326.8 302.7 L326.4 301.5 L326.2 300.1 Z" />
<path class="d-hub" d="M332.3 295.0 L332.4 294.4 L332.5 293.7 L332.6 293.1 L332.9 292.4 L333.1 291.7 L333.5 291.1 L333.9 290.4 L334.3 289.9 L334.8 289.3 L335.3 288.8 L335.8 288.4 L336.3 288.1 L336.8 287.8 L337.4 287.6 L337.9 287.5 L338.3 287.5 L338.8 287.6 L339.2 287.8 L339.5 288.0 L339.8 288.4 L340.0 288.8 L340.2 289.3 L340.3 289.8 L340.3 290.4 L340.3 291.0 L340.2 291.7 L340.0 292.3 L339.8 293.0 L339.5 293.7 L339.2 294.3 L338.8 295.0 L338.3 295.5 L337.9 296.1 L337.4 296.6 L336.8 297.0 L336.3 297.3 L335.8 297.6 L335.3 297.8 L334.8 297.9 L334.3 297.9 L333.9 297.8 L333.5 297.6 L333.1 297.4 L332.9 297.0 L332.6 296.6 L332.5 296.1 L332.4 295.6 Z" />
<path class="d-belt" d="M337.0 307.3 L335.6 308.0 L334.2 308.5 L332.8 308.8 L331.5 308.9 L330.3 308.7 L329.2 308.4 L328.1 307.8 L327.2 307.1 L326.5 306.1 L325.9 305.0 L325.4 303.7 L325.1 302.2 L325.0 300.7 L325.0 299.0 L325.2 297.3 L325.6 295.5 L326.1 293.6 L326.8 291.8 L327.6 290.0 L328.5 288.2 L329.6 286.5 L330.8 284.8 L332.0 283.3 L333.4 282.0 L452.0 168.9 L456.6 165.0 L461.3 161.7 L465.9 159.3 L470.6 157.7 L475.0 156.9 L479.1 157.0 L483.0 158.0 L486.3 159.8 L489.2 162.4 L491.5 165.8 L493.2 169.9 L494.2 174.5 L494.6 179.7 L494.3 185.3 L493.3 191.2 L491.7 197.2 L489.5 203.2 L486.7 209.2 L483.4 214.9 L479.6 220.4 L475.5 225.3 L471.1 229.7 L466.5 233.5 L461.8 236.5 Z" />
<path class="d-leader" d="M382.8 129.0 L380 26" />
<text class="d-text" x="374" y="32" text-anchor="end">Dec worm housing</text>
<g class="d-num"><circle cx="380.0" cy="26.0" r="17" /><text x="380.0" y="33.0" text-anchor="middle">1</text></g>
<path class="d-leader" d="M264.2 241.8 L226 380" />
<text class="d-text" x="220" y="386" text-anchor="end">2 housing screws</text>
<g class="d-num"><circle cx="226.0" cy="380.0" r="17" /><text x="226.0" y="387.0" text-anchor="middle">2</text></g>
<path class="d-leader" d="M267.4 249.2 L300 384" />
<text class="d-text" x="306" y="390" text-anchor="start">L bracket</text>
<g class="d-num"><circle cx="300.0" cy="384.0" r="17" /><text x="300.0" y="391.0" text-anchor="middle">3</text></g>
<path class="d-leader" d="M356.3 304.3 L510 300" />
<text class="d-text" x="516" y="306" text-anchor="start">4 × M3 screws</text>
<g class="d-num"><circle cx="510.0" cy="300.0" r="17" /><text x="510.0" y="307.0" text-anchor="middle">4</text></g>
<path class="d-leader" d="M201.7 176.2 L135 70" />
<text class="d-text" x="129" y="76" text-anchor="end">NEMA 17</text>
<g class="d-num"><circle cx="135.0" cy="70.0" r="17" /><text x="135.0" y="77.0" text-anchor="middle">5</text></g>
<path class="d-leader" d="M336.3 304.5 L510 360" />
<text class="d-text" x="516" y="366" text-anchor="start">20T pulley</text>
<g class="d-num"><circle cx="510.0" cy="360.0" r="17" /><text x="510.0" y="367.0" text-anchor="middle">6</text></g>
<path class="d-leader" d="M482.7 161.2 L510 110" />
<text class="d-text" x="516" y="116" text-anchor="start">60T pulley</text>
<g class="d-num"><circle cx="510.0" cy="110.0" r="17" /><text x="510.0" y="117.0" text-anchor="middle">7</text></g>
<path class="d-leader" d="M395.6 269.6 L510 230" />
<text class="d-text" x="516" y="236" text-anchor="start">GT2 belt</text>
<g class="d-num"><circle cx="510.0" cy="230.0" r="17" /><text x="510.0" y="237.0" text-anchor="middle">8</text></g>
</svg>
<ol class="drive-legend" aria-hidden="true"><li>Dec worm housing</li><li>2 housing screws</li><li>L bracket</li><li>4 × M3 screws</li><li>NEMA 17</li><li>20T pulley</li><li>60T pulley</li><li>GT2 belt</li></ol>
</figure>

![A hand holding the EQ-3 mount head with a NEMA 17 stepper motor and a timing belt fitted to the declination axis](../../assets/posts/eq3-goto/dec-first-fit.jpg)

*First fit, December 2025: the 20-tooth pulley on the motor, the 60-tooth pulley on the axis, and the 188 mm belt between them.*

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

- The motor bracket couldn't sit directly against the mount on this side, so I added a [**V-slot gantry plate**](https://grobotronics.com/v-slot-gantry-plate-20mmoem.html) as an extension and fixed the bracket to it.
- This time I ordered **several belt lengths** (160, 188 and 202 mm) to improve my odds.

Everything fitted except, of course, the belt. None of the three was right. In the next order I got a [**180 mm**](https://grobotronics.com/timing-belt-gt2-180mm.html) belt. It still wasn't a perfect fit, so I added padding between the motor bracket and the plate to tension it. It worked.

![The right ascension motor mounted on the EQ-3, with a GT2 belt marked 180-6 running between a small and a large pulley](../../assets/posts/eq3-goto/ra-motor-belt.jpg)

*The RA drive with its 180 mm belt.*

![The black NEMA 17 bracket screwed onto a slotted gantry plate attached to the mount](../../assets/posts/eq3-goto/ra-bracket-plate.jpg)

*The motor bracket on the V-slot gantry plate. The slotted holes leave room to adjust the motor's position.*

![The EQ-3 mount head on a table with stepper motors and belts fitted to both axes, wires hanging loose](../../assets/posts/eq3-goto/both-axes.jpg)

*Both axes motorised.*

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

I bought almost all the parts from [Grobotronics](https://grobotronics.com/), an electronics shop in Greece. The part links in this post go to their product pages (the TMC2209 drivers link to a price comparison page on Skroutz). None of them are affiliate links.

| | Cost |
|---|---|
| [NEMA 17 stepper, 0.9° (42BYGHM809)](https://grobotronics.com/42byghm809-4.8kg.cm-400-steps-rev.html), 2 × €16.90 | €33.80 |
| [NEMA 17 motor mount](https://grobotronics.com/stepper-motor-mount-nema-17.html), 2 × €1.90 | €3.80 |
| GT2 pulleys, [20T](https://grobotronics.com/aluminum-gt2-timing-pulley-20-tooth.html) + [60T](https://grobotronics.com/aluminum-gt2-timing-pulley-60t.html), 2 × €5.20 | €10.40 |
| GT2 belts, [188 mm](https://grobotronics.com/timing-belt-gt2-188mm.html) (declination) + [180 mm](https://grobotronics.com/timing-belt-gt2-180mm.html) (RA), 2 × €1.40 | €2.80 |
| [V-slot gantry plate 20 mm](https://grobotronics.com/v-slot-gantry-plate-20mmoem.html) (RA) | €3.60 |
| Screws and nuts | €0.48 |
| **Mechanics, both axes** (declination €25.40, RA €29.48) | **≈ €55** |
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

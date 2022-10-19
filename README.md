# ZynTracker

ZynTracker is a simple web-based music sketchbook, **sequence editor and player** compatible with the MIDI sequencer "ZynSeq" written in C++ by _Brian Walton_ for the [**Zynthian Open Synth Platform**](https://zynthian.org) (created by _Jośe Fernando Moyano_), which targets the Raspberry Pi single board computer.

## About

The application is written using VueJS and can natively read
<code>ZSS snapshot files</code> (along with the encoded binary <code>RIFF</code> sequence data) and convert the extracted patterns into ToneJS sequences that can be played back (and edited) using the <code>Web Audio / ToneJS API</code>. This is
the only third-party library used.

## Project State

This webapp is in the *early stages of development* (version 0.0.1), but basic features are working.

Currently implemented:

- Loading snapshot files containing sequence data
- Playing back patterns using a simple synth engine or a basic sampler (SFZ)
- Pattern editor interface

## Project Setup

```sh
git clone http://github.com/danielwine/zyntracker
```

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## Copyright and license

Copyright 2022 Daniel Vinkovics.

Licensed under the **[GPL-3 License](https://github.com/danielwine/zyntracker/LICENSE)**.

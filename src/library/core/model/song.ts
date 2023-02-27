import type { SampledInstrument } from "./library";

export enum EngineType {
  "UNKNOWN" = "Sine",
  "SAMPLER" = "Sampler",
  "PERCSYNTH" = "Membrane",
}

export enum ToneClass {
  "UNKNOWN" = "",
  "DRUM" = "drums",
  "FMSYNTH" = "fmsynths",
}

export interface IZyntrackerTones {
  [key: number]: IZyntrackerTone;
}

export interface IZyntrackerTone {
  engine: EngineType;
  toneclass?: ToneClass;
  instrument: SampledInstrument;
  URI?: string;
  meta: {
    originalEngine: string;
    originalPreset: string;
  };
}

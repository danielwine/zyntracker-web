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

export class SampledInstruments {
  [key: string]: SampledInstrument;
}
export class SampledInstrument {
  class = "";
  sub = "";
}

export interface IZyntrackerTones {
  [key: number]: IZyntrackerTone;
}

export interface IZyntrackerTone {
  engine: EngineType;
  class: string | ToneClass;
  subclass: string;
  URI?: string;
  meta: {
    originalEngine: string;
    originalPreset: string;
  };
}

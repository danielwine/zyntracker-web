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
  toneClass: ToneClass;
  toneURI?: string;
  meta: {
    originalEngine: string;
    originalPreset: string;
  };
}

import type { Time } from "tone";

type Time = string | number | TimeObject;

export interface TimeObject {
  [key: string]: number;
}

export type ToneSequenceEvents = Array<ToneSequenceEvent | null>;
export class ToneSequenceEvent {
  constructor(
    public notes: string[] = [],
    public velocities: number[] = [],
    public durations: Array<Time> = []
  ) {}
}

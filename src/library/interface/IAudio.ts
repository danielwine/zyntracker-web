import type { Sampler, PolySynth, Sequence } from "tone";
import type { ToneSequenceEvent } from "./IPattern";
import { ZynseqSequenceInfo } from "./IZSS";

export type Engine = PolySynth | Sampler;

export class ToneSequence {
  engine!: Engine;
  sequence!: Sequence<ToneSequenceEvent | null>;
  meta = new ZynseqSequenceInfo();
}

import type { Sampler, PolySynth, Sequence } from "tone";
import type { ToneSequenceEvent } from "./pattern";
import { ZynseqSequenceInfo } from "../../zss/model/format";

export type Engine = PolySynth | Sampler;

export class ToneSequence {
  engine!: Engine;
  sequence!: Sequence<ToneSequenceEvent | null>;
  meta = new ZynseqSequenceInfo();
}

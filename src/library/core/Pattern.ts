import * as keymap from "../res/Keymap";
import type {
  IZynseqPattern,
  IZynseqPatternEvent,
} from "../zss/interface/IFormat";
import { ToneSequenceEvent } from "./interface/IPattern";
import type { ToneSequenceEvents } from "./interface/IPattern";

let beatsPerBar = 4;
export const setTimeSignature = (beatsPerBar: number) => {
  beatsPerBar = beatsPerBar;
};

/**
 * Basic pattern structure with importer methods
 */
export class Pattern {
  events: ToneSequenceEvents = [];
  stepsPerBar = 0;
  public row = new ToneSequenceEvent();

  constructor(public id = 0, public length = 0, public polyphonyLevel = 1) {
    this.length = length;
    this.initialize();
  }

  public initialize() {
    for (let i = 0; i < this.length; i++) {
      this.events.push(null);
    }
  }

  public getPolyphonyLevels(patternEvents: IZynseqPatternEvent[]) {
    return patternEvents.reduce((accumulator: any, value: any) => {
      return {
        ...accumulator,
        [value.startStep]: (accumulator[value.startStep] || 0) + 1,
      };
    }, {});
  }

  public getTotalPolyphony(patternEvents: IZynseqPatternEvent[]) {
    return Math.max(
      ...Object.values<number>(this.getPolyphonyLevels(patternEvents))
    );
  }

  public import(pattern: IZynseqPattern) {
    const events = pattern.events;
    this.id = pattern.id;
    this.length = pattern.stepsPerBeat * pattern.beats;
    this.polyphonyLevel = this.getTotalPolyphony(events);
    this.stepsPerBar = pattern.stepsPerBeat * beatsPerBar;
    this.initialize();
    this.addEvents(events);
  }

  public addEvents(events: IZynseqPatternEvent[]) {
    let prevStep = 0;
    let stepCnt = -1;
    events.forEach((item, idx) => {
      // console.log(idx, item.startStep, prevStep);
      if (item.startStep != prevStep || idx == events.length - 1) {
        stepCnt = 0;
        this.events[prevStep] = this.row;
        this.row = new ToneSequenceEvent();
      } else stepCnt += 1;
      this.row.notes.push(keymap.getNoteFromMidiCode(item.value1_Start));
      this.row.durations.push(
        (this.stepsPerBar / item.duration).toString() + "n"
      );
      this.row.velocities.push(item.value2_Start / 100);
      prevStep = item.startStep;
    });
  }
}

export class Track {
  patterns: Pattern[] = [];
  channel: number = 0;

  addPattern(pattern: Pattern) {
    this.patterns.push(pattern);
  }
}

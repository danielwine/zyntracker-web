export interface IZSS {
  layers: IZSSLayer;
  zynseq_riff_b64?: string;
}

export interface IZSSLayer {
  midi_chan: number;
  engine_name: string;
  preset_name: string;
  preset_info: {};
}

export interface IZynseq {
  header: IZynseqHeader;
  banks: IZynseqBank[];
  patterns: IZynseqPattern[];
}

export interface IZynseqHeader {
  version: number;
  tempo: number;
  beatsPerBar: number;
  triggerChannel: number;
  triggerJackInput: number;
  triggerJackOutput: number;
  padding: number;
  verticalZoom: number;
  horizontalZoom: number;
}

export interface IZynseqBank {
  id: number;
  padding: number;
  "#sequences": number;
  sequences: ZynseqSequence[];
}

export class ZynseqSequenceInfo {
  playMode: number = 0;
  group: number = 0;
  name: string = "";
  constructor(public id?: number) {}
}

export class ZynseqSequence extends ZynseqSequenceInfo {
  triggerNote: number = -1;
  padding?: number;
  tracks: ZynseqTrack[] = [new ZynseqTrack()];

  "#tracks"?: number;
  "#timeEvents"?: number;
  timeEvents?: [];

  public getFirstPatternID(): number {
    return this.tracks[0].patterns[0].patternID;
  }
}

export class ZynseqTrack {
  midiChannel: number = 0;
  patterns: { patternID: number; startTime: number }[] = [
    { patternID: 0, startTime: 0 },
  ];

  "#patterns"?: number;
  jackOutput?: number;
  keymap?: number;
  padding?: number;
}

export interface IZynseqPattern {
  id: number;
  beats: number;
  stepsPerBeat: number;
  scale: number;
  scaleTonic: number;
  referenceNote: number;
  padding: number;
  events: IZynseqPatternEvent[];
}

export interface IZynseqPatternEvent {
  startStep: number;
  duration: number;
  command: number;
  value1_Start: number;
  value2_Start: number;
  value1_End: number;
  value2_End: number;
  _unused: number;
}

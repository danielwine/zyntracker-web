import {
  Synth,
  Sampler,
  Sequence,
  Time,
  Transport,
  start,
  context,
  PolySynth,
  MembraneSynth,
  Volume,
} from "tone";
import type { Pattern } from "./pattern";
import type { ToneSequenceEvent } from "./model/pattern";
import { ToneSequence, type Engine } from "./model/audio";
import type { Song } from "./song";
import { EngineType, type IZyntrackerTone } from "./model/song";
import { noteMaps, paths } from "./res/resource";
import { LibraryService } from "./library";

/**
 * Service for managing webaudio
 */
export class AudioService {
  private static instance: AudioService;
  private library = LibraryService.getInstance();

  song!: Song;
  engines: Engine[] = [];
  sequences: ToneSequence[] = new Array(16);
  isPlaying: boolean = false;
  activeSequences: number[] = [];

  masterVolume!: Volume;
  synth!: PolySynth;
  percussiveSynth!: PolySynth;
  sampler!: Sampler;

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  use(song: Song) {
    if (this.song) {
      this.release();
    }
    this.song = song;
  }

  async initEngines() {
    this.masterVolume = new Volume(-5).toDestination();
    for (let entry of Object.entries(this.song.tones)) {
      const idx = parseFloat(entry[0]);
      if (entry[1].engine == EngineType.SAMPLER) {
        this.engines[idx] = await this.getSamplerInstance(entry[1]);
        console.debug("SAMPLERInstance: ", this.engines[idx]);
      } else this.engines[idx] = this.getSynthInstance(entry[1]);
    }
  }

  getSynthInstance(tone: IZyntrackerTone) {
    let synth: typeof Synth | typeof MembraneSynth = Synth;
    if (tone.engine == EngineType.PERCSYNTH) synth = MembraneSynth;
    // let options = {
    //   oscillator: {
    //     type: "amsine",
    //     // harmonicity: 1,
    //     modulationType: "sine",
    //   },
    //   envelope: {
    //     attackCurve: "exponential",
    //     attack: 0.2,
    //     decay: 0.2,
    //     sustain: 0.2,
    //     release: 1,
    //   },
    //   portamento: 0.05,
    // };
    let options = {
      oscillator: {
        partials: [0, 2, 3, 4],
      },
    };
    return new PolySynth(synth, options as any).connect(this.masterVolume);
  }

  async getSamplerInstance(tone: IZyntrackerTone) {
    let noteMap;
    if (tone.URI?.endsWith(".sfz")) {
      noteMap = await this.library.loadSFZ(tone.URI);
      console.debug("NOTEMAP: ", noteMap);
    }
    let samplerParams = {
      urls: noteMap ? noteMap : noteMaps.minimal,
      baseUrl: noteMap
        ? this.library.getBaseURL(tone.URI ? tone.URI : "")
        : tone.URI,
    };
    console.debug("SAMPLERParams:", { samplerParams });
    return new Sampler(samplerParams).connect(this.masterVolume);
  }

  startNote(note: string, seqId: number) {
    this.sequences[seqId].engine.triggerAttack(note, context.currentTime);
  }

  stopNote(note: string, seqId: number) {
    this.sequences[seqId].engine.triggerRelease(note);
  }

  createSequenceFromPattern(
    pattern: Pattern,
    engine: PolySynth | Sampler
  ): ToneSequence {
    // console.debug(pattern.id);
    let sequence = new ToneSequence();
    sequence.engine = engine;
    sequence.sequence = new Sequence((time, value) => {
      console.debug(time);
      value?.notes.forEach((note, idx) => {
        let duration = value.durations ? value.durations[idx] : "8n";
        engine.triggerAttackRelease(
          note,
          duration,
          time,
          value.velocities[idx]
        );
      });
    }, pattern.events);
    return sequence;
  }

  async addBasicPatterns() {
    console.debug("ENGINES: ", this.engines);
    this.song.sequences.forEach((sequence, index) => {
      let firstPatternID = sequence.getFirstPatternID();
      // console.log(sequence, index, firstPatternID);
      let firstTrackChannel = sequence.tracks[0].midiChannel;
      let engine = this.engines[firstTrackChannel];
      // console.debug(
      //   "ENGINE (idx, channel, engine): ",
      //   index,
      //   firstTrackChannel,
      //   engine
      // );

      this.sequences[index] = this.createSequenceFromPattern(
        this.song.patterns.filter((pattern) => pattern.id == firstPatternID)[0],
        engine
      );

      this.sequences[index].meta = {
        playMode: this.song.sequences[index].playMode,
        group: this.song.sequences[index].group,
        name: this.song.sequences[index].name,
        id: index + 1,
      };
    });
  }

  release() {
    this.sequences.forEach((sequence) => {
      sequence.sequence.stop();
      sequence.sequence.dispose();
    });
    this.engines.forEach((engine) => {
      engine.releaseAll();
    });
  }

  startSequence(id: number, timing: number = 0) {
    this.sequences[id].sequence.start(timing);
    this.activeSequences.push(id);
  }

  stopSequence(id: number, timing: number = 0) {
    this.sequences[id].sequence.stop(timing);
    this.activeSequences.splice(this.activeSequences.indexOf(id), 1);
  }

  getSequenceState(id: number) {
    return this.sequences[id].sequence.state;
  }

  getActiveSequenceByGroup(groupId: number) {
    return this.sequences
      .filter((sequence) => sequence.meta.group == groupId)
      .filter(
        (groupSequence) =>
          groupSequence.meta.id &&
          this.activeSequences.includes(groupSequence.meta.id - 1)
      )[0];
  }

  getSequenceLength(id: number) {
    return this.sequences[id].sequence.events.length;
  }

  getEventAt(id: number, step: number): ToneSequenceEvent {
    return this.sequences[id].sequence.events[step];
  }

  getPolyphony(id: number) {
    return Math.max(
      ...Object.values<number>(
        this.sequences[id].sequence.events
          .filter((event) => event)
          .map((event) => event.notes.length)
      )
    );
  }

  startTransport() {
    start();
    Transport.start();
    this.isPlaying = true;
  }

  stopTransport() {
    Transport.stop();
    this.isPlaying = false;
  }
}

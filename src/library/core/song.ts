import {
  EngineType,
  ToneClass,
  ZyntrackerInstrument,
  type IZyntrackerTones,
} from "./model/song";
import {
  ZynseqSequence,
  type IZSSLayer,
  type IZynseq,
  type IZynseqBank,
  type ZynseqTrack,
} from "../zss/model/format";
import type { SampledInstrument } from "./model/library";
import { Pattern, setTimeSignature } from "./pattern";
import { LibraryService } from "./library";
import type { ZSSService as ZSS } from "../zss/zss";
import { settings } from "@/composables/config";

/**
 * Basic song class with metadata and sequence data importer methods
 */
export class Song {
  name: string = "";
  tempo = 120;
  beatsPerBar = 4;
  tones: IZyntrackerTones = {};
  sequences: ZynseqSequence[] = [];
  patterns: Pattern[] = [];
  bankLength!: number;
  library = LibraryService.getInstance();

  public getPatternIDs = () => this.patterns.map((pattern) => pattern.id);

  public getBankContent(bankID: number): ZynseqSequence[] {
    let bank: ZynseqSequence[] = [];
    [...new Array(this.bankLength).keys()].forEach((item) => {
      const currentID = bankID * this.bankLength + item;
      bank[item] = this.sequences[currentID]
        ? this.sequences[currentID]
        : new ZynseqSequence(currentID + 1);
    });
    return bank;
  }

  public async import(zss: ZSS): Promise<boolean> {
    let success = true;
    let data = zss.seq as IZynseq;
    setTimeSignature(data.header.beatsPerBar);
    success = await this.importZSSTones(zss);
    this.importZSSPatterns(zss);
    this.importZSSSequences(zss);
    return success;
  }

  private guessEngineType(layer: IZSSLayer): EngineType {
    let presetName = layer.preset_name;
    if (layer.engine_name == "LinuxSampler") return EngineType.SAMPLER;
    if (presetName.startsWith("DR ")) {
      return EngineType.PERCSYNTH;
    }
    return EngineType.UNKNOWN;
  }

  private async getInstrument(engineType: EngineType, presetName: string) {
    if (settings.preferSampleLibrary) {
      return await this.library.getInstrument(presetName);
    }
    // if (localSamples.drums.includes(layer.preset_name)) return ToneClass.DRUM;
    return new ZyntrackerInstrument();
  }

  private async getToneURI(
    engineType: EngineType,
    presetName: string,
    instrument: SampledInstrument
  ) {
    if (engineType == EngineType.SAMPLER) {
      // if (toneClass == ToneClass.UNKNOWN)
      // return Object.values(remoteSamples.default)[0];
      return await this.library.getURL(presetName, instrument);
      // return `${toneClass}/${layer.preset_name.replace(" ", "_")}.sfz`;
    }
    return settings.preferSampleLibrary
      ? await this.library.getURL(presetName, instrument)
      : "";
  }

  public async importZSSTones(zss: ZSS): Promise<boolean> {
    let toneURI = "";
    if (!zss.preset || !zss.preset.layers) return false;
    for (let layer of Object.values(zss.preset.layers)) {
      const preset = layer.preset_name;
      if (!this.tones[layer.midi_chan] && preset) {
        const type = this.guessEngineType(layer);
        const instrument = await this.getInstrument(type, preset);
        const URI = instrument
          ? await this.getToneURI(type, instrument.presetName, instrument.meta)
          : "";
        this.tones[layer.midi_chan] = {
          engine: type,
          instrument: instrument.meta,
          URI,
          meta: {
            originalPreset: preset,
            originalEngine: layer.engine_name,
          },
        };
      }
    }
    return true;
  }

  public importZSSSequences(zss: ZSS) {
    let data = zss.seq as IZynseq;
    let patternIDs = this.getPatternIDs();
    let sequenceID = 0;

    data.banks.forEach((bank: IZynseqBank) => {
      bank.sequences.forEach((sequence: ZynseqSequence) => {
        if (!this.bankLength) this.bankLength = bank["#sequences"];
        sequence.tracks.forEach((track: ZynseqTrack) => {
          track.patterns.forEach((pattern) => {
            if (patternIDs.includes(pattern.patternID)) {
              sequenceID += 1;
              let seqClass = new ZynseqSequence();
              seqClass.id = sequenceID;
              Object.assign(seqClass, sequence);
              this.sequences.push(seqClass);
            }
          });
        });
      });
    });
  }

  public importZSSPatterns(zss: ZSS) {
    let data = zss.seq as IZynseq;
    data.patterns.forEach((pattern, idx) => {
      this.patterns[idx] = new Pattern();
      this.patterns[idx].import(pattern);
    });
  }
}

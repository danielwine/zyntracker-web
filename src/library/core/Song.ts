import {
  EngineType,
  ToneClass,
  type IZyntrackerTones,
} from "./interface/ISong";
import {
  ZynseqSequence,
  type IZSSLayer,
  type IZynseq,
  type IZynseqBank,
  type ZynseqTrack,
} from "../zss/interface/IFormat";
import { Pattern, setTimeSignature } from "./Pattern";
import { localSamples, remoteSamples } from "../res/Resources";
import type ZSS from "../zss/ZSSService";

/**
 * Basic song structure with metadata and sequence data importer methods
 */
export class Song {
  name: string = "";
  tempo = 120;
  beatsPerBar = 4;
  tones: IZyntrackerTones = {};
  sequences: ZynseqSequence[] = [];
  patterns: Pattern[] = [];
  bankLength!: number;

  private anyIncludes(array: string[], sequenceName: string): boolean {
    return array.some((item) => {
      return sequenceName.includes(item) ? true : false;
    });
  }

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

  private getToneClass(engineType: EngineType, layer: IZSSLayer): ToneClass {
    if (localSamples.drums.includes(layer.preset_name)) return ToneClass.DRUM;
    return ToneClass.UNKNOWN;
  }

  private getToneURI(
    engineType: EngineType,
    toneClass: ToneClass,
    layer: IZSSLayer
  ): string {
    if (engineType == EngineType.SAMPLER) {
      if (toneClass == ToneClass.UNKNOWN)
        return Object.values(remoteSamples.default)[0];
      else return `${toneClass}/${layer.preset_name.replace(" ", "_")}.sfz`;
    }
    return "";
  }

  public async importZSSTones(zss: ZSS): Promise<boolean> {
    let toneURI = "";
    if (!zss.preset || !zss.preset.layers) return false;
    for (let layer of Object.values(zss.preset.layers)) {
      if (!this.tones[layer.midi_chan] && layer.preset_name) {
        const type = this.guessEngineType(layer);
        const tclass = this.getToneClass(type, layer);
        this.tones[layer.midi_chan] = {
          engine: type,
          toneClass: tclass,
          toneURI: this.getToneURI(type, tclass, layer),
          meta: {
            originalPreset: layer.preset_name,
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

import type { SampledInstrument, SampledInstruments } from "./model/library";
import { noteMaps, paths } from "./res/resource";
import { downloadFile } from "./file";
import { SFZ } from "./sfz";
import type { LibraryItem } from "./model/library";
import { ZyntrackerInstrument } from "./model/song";

/**
 * Service for managing a local library of sampled instruments
 */
export class LibraryService {
  private static instance: LibraryService;
  private _instruments!: SampledInstrument;
  private _defaults: any;

  public static getInstance(): LibraryService {
    if (!LibraryService.instance) {
      LibraryService.instance = new LibraryService();
    }
    return LibraryService.instance;
  }

  get instruments() {
    return (async () => {
      return await this.fetch(this._instruments, paths.instruments);
    })();
  }

  get defaults() {
    return (async () => {
      return await this.fetch(this._defaults, paths.defaults);
    })();
  }

  async fetch(container: any, fileName: string) {
    try {
      if (!container)
        container = await downloadFile(fileName, paths.soundsFolder, true);
      return container;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  private splitPresetName(presetName: string) {
    const p = presetName.slice(0, 3);
    const prefix = p.toUpperCase() == p && p.slice(2) == " " ? p.trim() : "";
    const name = prefix ? presetName.slice(3) : presetName;
    return { prefix, name };
  }

  async getInstrument(presetName: string): Promise<ZyntrackerInstrument> {
    const instruments = (await this.instruments) as SampledInstruments;
    const { prefix, name } = this.splitPresetName(presetName);

    if (name in instruments) return { presetName, meta: instruments[name] };
    const underscored = name.split("_").join(" ");
    if (underscored in instruments)
      return { presetName, meta: instruments[underscored] };

    let guess = this.findSimilarEntry(prefix, name);
    if (!guess) return new ZyntrackerInstrument();
    else return guess;
  }

  async getURL(presetName: string, instrument: SampledInstrument) {
    const { prefix, name } = this.splitPresetName(presetName);
    const ext = instrument.resolution ? "/" : ".sfz";
    return `${instrument?.class}/${instrument?.sub}/${name
      .split(" ")
      .join("_")}${ext}`;
  }

  public getBaseURL(URI: string, trim = true) {
    return (
      paths.soundsFolder +
      "/" +
      (trim ? URI.substring(0, URI.lastIndexOf("/") + 1) : URI)
    );
  }

  public getNoteMap(resolution: string) {
    const noteMap: { [key: string]: string } = {};
    noteMaps[resolution].forEach((item) => (noteMap[item] = item + ".mp3"));
    return noteMap;
  }

  async loadSFZ(URL: string) {
    let sfz = new SFZ();
    await sfz.load(URL);
    return sfz.createNoteMap();
  }

  private anyIncludes(array: string[], text: string): boolean {
    return array.some((item) => {
      return text == item.toLowerCase() ? true : false;
    });
  }

  private async findSimilarEntry(
    prefix: string,
    name: string
  ): Promise<ZyntrackerInstrument> {
    for (let entry of Object.entries(await this.instruments)) {
      const words = entry[0].split(" ");

      if (name.split(" ").some((word) => this.anyIncludes(words, word))) {
        return { presetName: entry[0], meta: entry[1] as SampledInstrument };
      }
    }
    return new ZyntrackerInstrument();
  }
}

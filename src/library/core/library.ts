import { SampledInstrument, SampledInstruments } from "./model/library";
import { paths } from "./res/resource";
import { downloadFile } from "./file";
import { SFZ } from "./sfz";
import type { LibraryItem } from "./model/library";

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

  private anyIncludes(array: string[], sequenceName: string): boolean {
    return array.some((item) => {
      return sequenceName.includes(item) ? true : false;
    });
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

  async getClass(presetName: string) {
    const instruments = (await this.instruments) as SampledInstruments;
    const { prefix, name } = this.splitPresetName(presetName);
    console.log(prefix, name);

    if (name in instruments) return instruments[name];
    const underscored = name.split("_").join(" ");
    if (underscored in instruments) return instruments[underscored];

    let guess = this.guessPresetClass(prefix, name);
    if (!guess) return new SampledInstrument();
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

  async loadSFZ(URL: string) {
    let sfz = new SFZ();
    await sfz.load(URL);
    return sfz.createNoteMap();
  }

  private async guessPresetClass(prefix: string, name: string) {
    let instrument = new SampledInstrument();
    for (let entry of Object.entries(await this.defaults)) {
      if (
        name.includes(entry[0]) ||
        prefix.includes((entry[1] as LibraryItem)["_alias"])
      )
        instrument.class = entry[0];
    }
    console.log(instrument);
    return instrument;
  }
}

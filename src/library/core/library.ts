import { SampledInstrument, type SampledInstruments } from "./model/song";
import { paths } from "./res/resource";
import { downloadFile } from "./file";
import { SFZ } from "./sfz";

/**
 * Service for managing a local library of sampled instruments
 */
export class LibraryService {
  private static instance: LibraryService;
  private _instruments!: SampledInstruments;
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

  async getClass(presetName: string) {
    const instruments = (await this.instruments) as SampledInstruments;
    if (presetName in instruments) return instruments[presetName];
    else return new SampledInstrument();
  }

  async getURL(presetName: string) {
    const instrument = await this.getClass(presetName);
    return `${instrument?.class}/${instrument?.sub}/${presetName.replace(
      " ",
      "_"
    )}.sfz`;
  }

  public getBaseURL(URI: string) {
    return paths.soundsFolder + "/" + URI.substring(0, URI.lastIndexOf("/") + 1);
  }

  async loadSFZ(URL: string) {
    let sfz = new SFZ();
    await sfz.load(URL);
    return sfz.createNoteMap();
  }
}

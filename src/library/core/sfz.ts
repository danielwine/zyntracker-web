import { downloadFile } from "../core/file";
import { paths } from "./res/resource";
import { SFZRegion } from "./model/sfz";
import { getNoteFromMidiCode } from "./res/keymap";

/**
 * Dummy SFZ file parser
 */
export class SFZ {
  raw: string | boolean = "";
  regions: SFZRegion[] = [];
  async load(fileName: string) {
    this.raw = await downloadFile(fileName, paths.soundsFolder);
    this.regions = this.getRegions();
  }
  private getRegions() {
    let regions: SFZRegion[] = [];
    if (typeof this.raw != "string") return [];
    let regionsRaw = this.raw.split("<region>").slice(1);
    regionsRaw.forEach((reg) => {
      let region = new SFZRegion();
      let attributes = reg
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item);
      attributes.forEach((attribute) => {
        let entries = attribute.split("=");
        if (entries[0] in region) {
          region[entries[0]] = entries[1];
        }
      });
      regions.push(region);
    });
    return regions;
  }
  public createNoteMap() {
    let noteMap: { [key: string]: any } = {};
    this.regions.forEach((region) => {
      const note = getNoteFromMidiCode(region.lokey);
      const path = region.sample
        .replace(".wav", ".mp3")
        .replace(/\\/g, "/")
        .replace(/ /g, "_");
      noteMap[note] = path;
    });
    return noteMap;
  }
}

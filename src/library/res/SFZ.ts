import { downloadFile } from "../core/filemanager";
import { pathSounds } from "./resources";

export class SFZRegion {
  [key: string]: any;
  sample = "";
  lokey = 36;
  hikey = 36;
  pitch_keycenter = 60;
  loop_mode = "no_loop";
  ampeg_decay = 14.304;
  ampeg_sustain = 0.001;
  ampeg_release = 0.1;
  pan = 0;
}

/**
 * Dummy SFZ file parser
 */
export class SFZ {
  raw: string | boolean = "";
  regions: SFZRegion[] = [];
  async load(fileName: string) {
    this.raw = await downloadFile(fileName, pathSounds);
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
}

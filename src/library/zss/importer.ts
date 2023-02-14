import jszip from "jszip";
import { xml2js } from "xml-js";
import { RenoiseSong } from "./model/importer";
import type { XMLElement } from "./model/importer";

export class XRNSImporter {
  private zip = new jszip();
  public song = new RenoiseSong();

  constructor(private content: ArrayBuffer) {}

  async import() {
    let data = await this.zip.loadAsync(this.content);
    if ("Song.xml" in data.files) {
      let songData;
      data.files["Song.xml"].async("string").then((content) => {
        songData = xml2js(content).elements[0];
        console.log(songData);
      });
    }
  }

  private getItem(element: XMLElement, itemName: string) {
    return Object.values(element.elements).filter(
      (subel) => subel.type == "element" && subel.name == itemName
    )[0];
  }
}

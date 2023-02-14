import type { IZSS } from "./model/format";
import { ZynseqContainer } from "./container";
import { XRNSImporter } from "./importer";
import { Base64 } from "./buffer";

/**
 * Service for parsing ZSS metadata and encoding / decoding
 *         base64-encoded binary content
 */
export class ZSSService {
  private static instance: ZSSService;
  private zssData!: IZSS;
  private zynseq!: ZynseqContainer;

  /**
   * Use this method to instantiate this singleton service
   */

  public static getInstance(): ZSSService {
    if (!ZSSService.instance) {
      ZSSService.instance = new ZSSService();
    }
    return ZSSService.instance;
  }

  private getObjectFromContent(ZSSJson: string) {
    let data = {};
    try {
      data = JSON.parse(ZSSJson);
    } catch (err) {
      return null;
    }
    return data;
  }

  private getZynseqBuffer(ZSSObject: IZSS): ArrayBuffer {
    let arrayBuffer = new ArrayBuffer(0);
    if (ZSSObject["zynseq_riff_b64"])
      arrayBuffer = Base64.toArrayBuffer(ZSSObject.zynseq_riff_b64);
    return arrayBuffer;
  }

  public get preset() {
    return this.zssData;
  }

  public get seq() {
    return this.zynseq.object;
  }

  /**
   * Parses the raw JSON string, creates a structured container object
   * filled with data decoded from the base64 encoded 'zynseq' buffer
   */

  public async load(ZSSJson: string): Promise<boolean> {
    this.zssData = this.getObjectFromContent(ZSSJson) as IZSS;
    console.log(this.zssData);

    if (this.zssData) {
      let arrayBuffer = this.getZynseqBuffer(this.zssData);
      console.debug("ARRAYBUFFER TOTAL LENGTH: ", arrayBuffer.byteLength);
      this.zynseq = new ZynseqContainer();
      this.zynseq.readFromBuffer(arrayBuffer);
      this.zssData.zynseq_riff_b64 = undefined;
      return true;
    } else return false;
  }

  /**
   * Encodes the content of the container object into the buffer,
   * converts it into base64 then returns with a stringified JSON
   */

  public async save(): Promise<string> {
    this.zynseq.writeBuffer();
    this.zssData.zynseq_riff_b64 = Base64.fromArrayBuffer(this.zynseq.buffer);
    console.log(this.zssData.zynseq_riff_b64);
    return JSON.stringify(this.zssData);
  }

  /**
   * Imports 'phrases' from the content of an XRNS (Renoise) song file
   * translates them into sequences grouped by engine names
   * and creates a container object from it
   * NOT IMPLEMENTED
   */

  public async import(xrnsContent: ArrayBuffer) {
    console.debug("Importing.");
    const importer = new XRNSImporter(xrnsContent);
    await importer.import();
    return false;
  }
}

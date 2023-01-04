import type { IZSS } from "./interface/IFormat";
import { ZynseqContainer } from "./Container";
import { Base64 } from "./Buffer";

/**
 * Service for parsing ZSS metadata and encoding / decoding
 *         base64-encoded binary content
 */
export default class ZSSService {
  private static instance: ZSSService;
  private zssData!: IZSS;
  private zynseq!: ZynseqContainer;

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
      // console.error(err);
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

  public load(ZSSJson: string): boolean {
    this.zssData = this.getObjectFromContent(ZSSJson) as IZSS;
    if (this.zssData) {
      let arrayBuffer = this.getZynseqBuffer(this.zssData);
      console.log("ARRAYBUFFER TOTAL LENGTH: ", arrayBuffer.byteLength);
      this.zynseq = new ZynseqContainer();
      this.zynseq.readFromBuffer(arrayBuffer);
      this.zssData.zynseq_riff_b64 = undefined;
      return true;
    } else return false;
  }

  public save(): string {
    this.zynseq.writeBuffer();
    this.zssData.zynseq_riff_b64 = Base64.fromArrayBuffer(this.zynseq.buffer);
    console.log(this.zssData.zynseq_riff_b64);
    return JSON.stringify(this.zssData);
  }
}

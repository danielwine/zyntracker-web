import { zynSeqFormat } from "./Format";

/**
 * Service for writing ZSS metadata and encoding sequences to base64-based binary data
 * NOT IMPLEMENTED
 */
export default class ZSSWriter {
  private static instance: ZSSWriter;

  public static getInstance(): ZSSWriter {
    if (!ZSSWriter.instance) {
      ZSSWriter.instance = new ZSSWriter();
    }
    return ZSSWriter.instance;
  }
}

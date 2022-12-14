export class ZynseqChunkHeader {
  id: string = "";
  blockSize: number = 0;
}

export interface IZynseqChunk {
  header: ZynseqChunkHeader;
  block: ArrayBuffer;
  start: number;
  end: number;
}

export interface IZynseqObject {
  header: {};
  patterns: any[];
  banks: any[];
}

export type IZynseqVariable = [string, number];

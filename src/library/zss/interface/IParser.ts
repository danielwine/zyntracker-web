export class ZynseqBlockHeader {
  id: string = "";
  blockSize: number = 0;
}

export interface IZynseqBlock {
  header: ZynseqBlockHeader;
  content: ArrayBuffer;
  start: number;
  end: number;
}

export interface IZynseqObject {
  header: {};
  patterns: any[];
  banks: any[];
}

export type IZynseqVariable = [string, number];

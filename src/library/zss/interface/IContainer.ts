import type { IZynseqBank, IZynseqHeader, IZynseqPattern } from "./IFormat";

export class ZynseqBlockHeader {
  id: string = "";
  blockSize: number = 0;
}

export interface IZynseqObject {
  header: {};
  patterns: any[];
  banks: any[];
}

export type IZynseqBlockItem = IZynseqHeader | IZynseqPattern | IZynseqBank;

export type IZynseqVariable = [string, number];

import {
  ZynseqBlockHeader,
  type IZynseqBlock,
  type IZynseqObject,
  type IZynseqVariable,
} from "./interface/IParser";
import type { IndexableByString } from "./interface/ITypes";
import { BlockType } from "./Format";

export class ZynseqBuffer {
  dv!: DataView;
  cnt = 0;
  struct: { [key: string]: string | [] } = {};
  constructor(blockBuffer: ArrayBuffer) {
    this.buffer = blockBuffer;
  }
  get buffer() {
    return this.dv.buffer;
  }
  set buffer(blockBuffer: ArrayBuffer) {
    this.dv = new DataView(blockBuffer);
  }

  readVariable(
    variableName: string,
    byteLength: number
  ): [string, string | number] {
    let data: number | string = "";
    switch (byteLength) {
      case 1:
        data = this.dv.getInt8(this.cnt);
        break;
      case 2:
        data = this.dv.getInt16(this.cnt);
        break;
      case 4:
        data = this.dv.getInt32(this.cnt);
        break;
      case 16:
        data = this.readCharSequence(15);
        break;
    }
    this.cnt += byteLength;
    return [variableName, data];
  }

  writeVariable(value: number | string, byteLength: number) {
    if (byteLength < 16 && typeof value == "string") return;
    const n = parseFloat(value as string);
    switch (byteLength) {
      case 1:
        this.dv.setInt8(this.cnt, n);
        console.log("setInt8 ", this.cnt, value);
        break;
      case 2:
        this.dv.setInt16(this.cnt, n);
        console.log("setInt16 ", this.cnt, value);
        break;
      case 4:
        this.dv.setInt32(this.cnt, n);
        console.log("setInt32 ", this.cnt, value);
        break;
      case 16:
        this.writeCharSequence(value.toString(), 15);
        break;
    }
    this.cnt += byteLength;
  }

  readVariables(variables: IZynseqVariable[], target: any = null) {
    let result;
    if (!target) {
      target = this.struct;
    }
    variables.forEach((variable) => {
      result = this.readVariable(variable[0], variable[1]);
      target[result[0]] = result[1];
    });
  }

  writeVariables(variables: IZynseqVariable[], object: IndexableByString) {
    variables.forEach((variable: IZynseqVariable) => {
      if (variable[0] in object)
        this.writeVariable(object[variable[0]], variable[1]);
    });
    console.log(this.dv.buffer);
  }

  readArrayOfVariables(
    variables: IZynseqVariable[],
    quantity: number,
    target: any[]
  ) {
    let data;
    if (!target) {
      return;
    }
    for (let i = 0; i < quantity; i++) {
      data = {};
      this.readVariables(variables, data);
      target.push(data);
    }
  }
  public readCharSequence = (
    stringLength: number,
    startIndex: number = this.cnt
  ) => {
    let charSequence = "";
    for (let i = startIndex; i < startIndex + stringLength; i++) {
      try {
        const charCode = this.dv.getInt8(i);
        if (charCode != 0) charSequence += String.fromCharCode(charCode);
      } catch (error) {
        return "";
      }
    }
    return charSequence;
  };

  public writeCharSequence = (value: string, startIndex: number) => {};
}

export class ZynseqBlock extends ZynseqBuffer {
  protected readBlockHeader(headerData: ArrayBuffer) {
    let dv = new DataView(headerData);
    let header = new ZynseqBlockHeader();
    header.id = this.readCharSequence(4);
    console.log(header.id, this.cnt);
    
    try {
      header.blockSize = dv.getInt32(4);
    } catch (error) {
      return null;
    }
    return header;
  }

  protected writeBlockHeader(blockType: BlockType, blockSize: number) {
    this.writeCharSequence(blockType.toString(), 4);
    this.writeVariable(blockSize, 4);
  }

  protected readBlock(
    buffer: ArrayBuffer,
    startIndex = 0
  ): IZynseqBlock | null {
    console.log(startIndex);
    
    let header_data = buffer.slice(startIndex, startIndex + 8);
    let header = this.readBlockHeader(header_data);
    if (!header) {
      return null;
    }
    if (!(Object.values(BlockType) as string[]).includes(header.id)) {
      console.error("Invalid header.");
      return null;
    }
    let endIndex = startIndex + 8 + header.blockSize;
    let content = buffer.slice(startIndex + 8, endIndex);
    return {
      header,
      content,
      start: startIndex,
      end: endIndex,
    };
  }
}

export abstract class ZynseqBufferSize {
  public static getFromVariableSection(variables: IZynseqVariable[]) {
    return Object.values(variables).reduce(
      (accumulator: number, value: IZynseqVariable) =>
        (accumulator += value[1] as unknown as number),
      0
    );
  }

  public static getForBlock(blockID: string) {}

  public static getTotal(object: IZynseqObject) {
    return 16000;
  }
}

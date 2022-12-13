import { zynSeqFormat } from "./Format";
import type { IZSS } from "./interface/IFormat";

interface IZynseqChunk {
  header: ZynseqChunkHeader;
  block: ArrayBuffer;
  start: number;
  end: number;
}

interface IZynseqObject {
  header: {};
  patterns: any[];
  banks: any[];
}

type IZynseqVariable = [string, number];

/**
 * Service for parsing ZSS metadata and decoding raw binary content
 */
export default class ZSSReader {
  private static instance: ZSSReader;
  private zssData!: IZSS;
  private zynseqData!: {};
  private zynseq = new ZynSeq();

  public static getInstance(): ZSSReader {
    if (!ZSSReader.instance) {
      ZSSReader.instance = new ZSSReader();
    }
    return ZSSReader.instance;
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

  private getBufferContent(ZSSObject: IZSS): ArrayBuffer {
    let arrayBuffer = new ArrayBuffer(0);
    if (ZSSObject["zynseq_riff_b64"])
      arrayBuffer = this.base64ToArrayBuffer(ZSSObject.zynseq_riff_b64);
    return arrayBuffer;
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  public get preset() {
    return this.zssData;
  }

  public get seq() {
    return this.zynseqData;
  }

  public load(ZSSJson: string): boolean {
    this.zssData = this.getObjectFromContent(ZSSJson) as IZSS;
    if (this.zssData) {
      let arrayBuffer = this.getBufferContent(this.zssData);
      this.zynseqData = this.zynseq.readSeqData(arrayBuffer).data;
      this.zssData.zynseq_riff_b64 = undefined;
      return true;
    } else return false;
  }

  public save(ZSSJson: string) {}
}

class ZynSeq {
  data = {};

  private getChunkHeader(headerData: ArrayBuffer) {
    let dv = new DataView(headerData);
    let header = new ZynseqChunkHeader();
    header.id = createCharSequence(dv, 0, 4);
    try {
      header.blockSize = dv.getInt32(4);
    } catch (error) {
      return null;
    }
    return header;
  }

  private getChunk(buffer: ArrayBuffer, startIndex = 0): IZynseqChunk | null {
    let header_data = buffer.slice(startIndex, startIndex + 8);
    let header = this.getChunkHeader(header_data);
    if (!header) {
      return null;
    }
    if (!["vers", "patn", "bank"].includes(header.id)) {
      console.error("Invalid header.");
      return null;
    }
    let endIndex = startIndex + 8 + header.blockSize;
    let block = buffer.slice(startIndex + 8, endIndex);
    return {
      header,
      block,
      start: startIndex,
      end: endIndex,
    };
  }

  public readSeqData(buffer: ArrayBuffer) {
    let chunk: IZynseqChunk | null;
    let startIndex = 0;
    let sequence = new ZynseqObject();

    while (true) {
      chunk = this.getChunk(buffer, startIndex);
      if (!chunk) {
        break;
      }
      startIndex = chunk.end;
      sequence.addBlock(chunk.header, chunk.block);
    }
    return sequence;
  }
}

class ZynseqChunkHeader {
  id: string = "";
  blockSize: number = 0;
}

class ZynseqObject {
  data: IZynseqObject = {
    header: {},
    patterns: [],
    banks: [],
  };
  constructor() {}

  addBlock(header: ZynseqChunkHeader, blockBuffer: ArrayBuffer) {
    let block;
    switch (header.id) {
      case "vers":
        block = this.loadVersionBlock(blockBuffer);
        this.data.header = block;
        break;
      case "patn":
        block = this.loadPatternBlock(blockBuffer);
        this.data.patterns.push(block);
        break;
      case "bank":
        block = this.loadBankBlock(blockBuffer);
        this.data.banks.push(block);
        break;
    }
  }

  loadVersionBlock = (blockBuffer: ArrayBuffer) => {
    let version = new ZynseqBlockStructure(blockBuffer);
    version.getVariables(zynSeqFormat.version as IZynseqVariable[]);
    return version.struct;
  };

  loadPatternBlock = (blockBuffer: ArrayBuffer) => {
    let pattern = new ZynseqBlockStructure(blockBuffer);
    pattern.getVariables(zynSeqFormat.pattern as IZynseqVariable[]);
    let dv = new DataView(blockBuffer);
    let eventQuantity = (dv.byteLength - 14) / 14;
    pattern.struct["events"] = [];
    pattern.getArrayOfVariables(
      zynSeqFormat.patternEvents as IZynseqVariable[],
      eventQuantity,
      pattern.struct["events"]
    );
    return pattern.struct;
  };

  loadBankBlock = (blockBuffer: ArrayBuffer) => {
    let bank = new ZynseqBlockStructure(blockBuffer);
    let dv = new DataView(blockBuffer);
    let parser = new ZynseqBlockParser(bank);
    return parser.walk(zynSeqFormat.bank);
  };
}

class ZynseqBlockStructure {
  dv: DataView;
  cnt = 0;
  struct: { [key: string]: string | [] } = {};
  constructor(blockBuffer: ArrayBuffer) {
    this.dv = new DataView(blockBuffer);
  }

  getVariable(
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
        data = createCharSequence(this.dv, this.cnt, 15);
        break;
    }
    this.cnt += byteLength;
    return [variableName, data];
  }

  getVariables(variables: IZynseqVariable[], target: any = null) {
    let result;
    if (!target) {
      target = this.struct;
    }
    variables.forEach((variable) => {
      result = this.getVariable(variable[0], variable[1]);
      target[result[0]] = result[1];
    });
  }

  getArrayOfVariables(
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
      this.getVariables(variables, data);
      target.push(data);
    }
  }
}

class ZynseqBlockParser {
  blockStructure;
  constructor(blockStructure: ZynseqBlockStructure) {
    this.blockStructure = blockStructure;
  }

  walk(format: any, level = 0) {
    let current: { [key: string]: any } = {};
    let cnt: string | number = 0;
    let res;
    let walkReturned;

    for (let entry of format) {
      if (typeof entry[1] == "number") {
        res = this.blockStructure.getVariable(entry[0], entry[1]);
        res[0][0] == "#" ? (cnt = res[1]) : (cnt = 1);
        current[res[0]] = res[1];
      } else if (Array.isArray(entry[1])) {
        let new_level = level + 1;
        current[entry[0]] = [];
        for (let i = 0; i < cnt; i++) {
          walkReturned = this.walk(entry[1], new_level);
          current[entry[0]].push(walkReturned);
        }
      }
    }
    return current;
  }
}

const createCharSequence = (
  dataView: DataView,
  startIndex: number,
  stringLength: number
) => {
  let charSequence = "";
  for (let i = startIndex; i < startIndex + stringLength; i++) {
    try {
      const charCode = dataView.getInt8(i);
      if (charCode != 0) charSequence += String.fromCharCode(charCode);
    } catch (error) {
      return "";
    }
  }
  return charSequence;
};

import { ZynseqBlock, ZynseqBufferSize, ZynseqBuffer } from "./Buffer";
import { BlockType, ZynSeqFormat } from "./Format";
import type {
  IZynseqBlock,
  IZynseqObject,
  IZynseqVariable,
  ZynseqBlockHeader,
} from "./interface/IParser";

export class ZynseqContainer extends ZynseqBlock {
  object: IZynseqObject = {
    header: {},
    patterns: [],
    banks: [],
  };
  constructor() {
    super(new ArrayBuffer(0));
  }

  /**
   * Reads the buffer passed as a parameter and translates it
   * into an object containing sequence data.
   */
  public readFromBuffer(buffer: ArrayBuffer) {
    this.buffer = buffer;
    let Block: IZynseqBlock | null;
    let startIndex = 0;

    while (true) {
      Block = this.readBlock(this.buffer, startIndex);
      console.log(Block);
      
      
      if (!Block) {
        break;
      }
      startIndex = Block.end;
      this.addBlock(Block.header, Block.content);
    }
  }
  /**
   * Clears container buffer and translates the current content of
   * the container object into binary content
   */
  public writeBuffer() {
    const obj = this.object;
    this.buffer = new ArrayBuffer(ZynseqBufferSize.getTotal(obj));
    this.createVersionBlock();
  }

  private addBlock(header: ZynseqBlockHeader, blockBuffer: ArrayBuffer) {
    console.log('Adding block - ', header.id);
    
    let block;
    switch (header.id) {
      case BlockType.Header:
        block = this.loadVersionBlock(blockBuffer);
        this.object.header = block;
        break;
      case BlockType.Pattern:
        block = this.loadPatternBlock(blockBuffer);
        this.object.patterns.push(block);
        break;
      case BlockType.Bank:
        block = this.loadBankBlock(blockBuffer);
        this.object.banks.push(block);
        break;
    }
  }

  private loadVersionBlock = (blockBuffer: ArrayBuffer) => {
    let versionBlock = new ZynseqBuffer(blockBuffer);
    versionBlock.readVariables(ZynSeqFormat.version as IZynseqVariable[]);
    return versionBlock.struct;
  };

  private loadPatternBlock = (blockBuffer: ArrayBuffer) => {
    let patternBlock = new ZynseqBuffer(blockBuffer);
    patternBlock.readVariables(ZynSeqFormat.pattern as IZynseqVariable[]);
    let dv = new DataView(blockBuffer);
    let eventQuantity = (dv.byteLength - 14) / 14;
    patternBlock.struct["events"] = [];
    patternBlock.readArrayOfVariables(
      ZynSeqFormat.patternEvents as IZynseqVariable[],
      eventQuantity,
      patternBlock.struct["events"]
    );
    return patternBlock.struct;
  };

  private loadBankBlock = (blockBuffer: ArrayBuffer) => {
    let bankBlock = new ZynseqBuffer(blockBuffer);
    let parser = new ZynseqBlockParser(bankBlock);
    return parser.walk(ZynSeqFormat.bank);
  };

  private createVersionBlock() {
    console.log("creating header");
    this.writeVariables(
      ZynSeqFormat.version as IZynseqVariable[],
      this.object.header
    );
  }
}

class ZynseqBlockParser {
  blockStructure;
  constructor(blockStructure: ZynseqBuffer) {
    this.blockStructure = blockStructure;
  }

  walk(format: any, level = 0) {
    let current: { [key: string]: any } = {};
    let cnt: string | number = 0;
    let res;
    let walkReturned;

    for (let entry of format) {
      if (typeof entry[1] == "number") {
        res = this.blockStructure.readVariable(entry[0], entry[1]);
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

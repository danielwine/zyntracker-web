import { ZynseqBuffer } from "./buffer";
import { BlockType, headerLength, ZynSeqFormat } from "./format";
import type {
  IZynseqHeader,
  IZynseqPattern,
  IZynseqPatternEvent,
} from "./model/format";
import {
  ZynseqBlockHeader,
  type IZynseqBlockItem,
  type IZynseqObject,
  type IZynseqVariable,
} from "./model/container";
import { bufferLimit } from "./config";

export class ZynseqContainer extends ZynseqBuffer {
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
    let EOB = false;
    while (!EOB) EOB = this.readChunk();
  }

  /**
   * Clears container buffer and translates the current content of
   * the container object into binary content
   */

  public writeBuffer() {
    this.pos = 0;
    const obj = this.object;
    this.buffer = new ArrayBuffer(bufferLimit);
    this.writeChunk(BlockType.Header, this.object.header as IZynseqHeader);
    Object.values(this.object.patterns).forEach((pattern) =>
      this.writeChunk(BlockType.Pattern, pattern)
    );
    Object.values(this.object.banks).forEach((bank) =>
      this.writeChunk(BlockType.Bank, bank)
    );
    const bufferEnd = this.pos;
    this.buffer = this.buffer.slice(0, bufferEnd);
  }

  private readChunkHeader() {
    let header = new ZynseqBlockHeader();
    header.id = this.readCharSequence(4);

    try {
      header.blockSize = parseFloat(this.readVariable("", 4)[1] as string);
    } catch (error) {
      return null;
    }
    return header;
  }

  private writeChunkHeader(blockType: BlockType, blockSize: number = 0) {
    this.writeCharSequence(blockType.toString());
    this.writeVariable(blockSize, 4);
  }

  private readChunk(): boolean {
    const chunkStart = this.pos;
    let header = this.readChunkHeader();
    if (!header) {
      return true;
    }
    if (!(Object.values(BlockType) as string[]).includes(header.id)) {
      console.error("Invalid header.");
      return true;
    }
    let blockStart = chunkStart + headerLength;
    let blockEnd = chunkStart + headerLength + header.blockSize;

    this.readBlock(header.id, blockStart, blockEnd);
    this.pos = blockEnd;
    return false;
  }

  private writeChunk(blockType: BlockType, data: IZynseqBlockItem) {
    const chunkStart = this.pos;
    this.writeChunkHeader(blockType);
    this.writeBlock(blockType, data);
    const blockEnd = this.pos;
    const blockSize = blockEnd - headerLength - chunkStart;
    this.pos = chunkStart;
    this.writeChunkHeader(blockType, blockSize);
    this.pos = blockEnd;
  }

  private getPatternEventLength() {
    this.eventLength = "version" in this.object.header &&
      this.object.header["version"] == "8"
      ? 16
      : 14;
  }

  private readBlock(blockType: string, startIndex: number, endIndex: number) {
    switch (blockType) {
      case BlockType.Header:
        this.object.header = this.readVariables(
          ZynSeqFormat.version as IZynseqVariable[]
        );
        this.getPatternEventLength()
        break;
      case BlockType.Pattern:
        let pattern = this.readVariables(
          ZynSeqFormat.pattern as IZynseqVariable[]
        ) as IZynseqPattern;
        console.debug(this.eventLength);
        const eventQuantity =
          (endIndex - startIndex - this.eventLength) / this.eventLength;
        pattern["events"] = this.readArrayOfVariables(
          ZynSeqFormat.patternEvents as IZynseqVariable[],
          eventQuantity
        ) as IZynseqPatternEvent[];
        this.object.patterns.push(pattern);
        break;
      case BlockType.Bank:
        this.object.banks.push(this.readTree(ZynSeqFormat.bank));
        break;
    }
  }

  private writeBlock(blockType: BlockType, data: IZynseqBlockItem) {
    switch (blockType) {
      case BlockType.Header:
        this.writeVariables(
          ZynSeqFormat.version as IZynseqVariable[],
          this.object.header
        );
        break;
      case BlockType.Pattern:
        this.writeVariables(ZynSeqFormat.pattern as IZynseqVariable[], data);
        for (let event of Object.values((data as IZynseqPattern).events)) {
          if (event)
            this.writeVariables(
              ZynSeqFormat.patternEvents as IZynseqVariable[],
              event
            );
        }
        break;
      case BlockType.Bank:
        this.writeTree({ format: ZynSeqFormat.bank, data });
        break;
    }
  }
}

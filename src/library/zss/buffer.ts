import type { IZynseqVariable } from "./interface/IContainer";
import type { IndexableByString } from "./interface/ITypes";

export class ZynseqBuffer {
  dv!: DataView;
  currentObject: any;
  pos = 0;

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

  protected readVariable(
    variableName: string,
    byteLength: number
  ): [string, string | number] {
    const prevPos = this.pos;
    let data: number | string = "";
    switch (byteLength) {
      case 1:
        data = this.dv.getInt8(this.pos);
        break;
      case 2:
        data = this.dv.getInt16(this.pos);
        break;
      case 4:
        data = this.dv.getInt32(this.pos);
        break;
      case 16:
        data = this.readCharSequence(15, false);
        break;
    }
    this.pos += byteLength;
    return [variableName, data];
  }

  protected writeVariable(value: number | string, byteLength: number) {
    if (byteLength < 16 && typeof value == "string") return;
    const n = parseFloat(value as string);
    switch (byteLength) {
      case 1:
        this.dv.setInt8(this.pos, n);
        break;
      case 2:
        this.dv.setInt16(this.pos, n);
        break;
      case 4:
        this.dv.setInt32(this.pos, n);
        break;
      case 16:
        this.writeCharSequence(value.toString(), false);
        break;
    }
    this.pos += byteLength;
  }

  protected readVariables(
    variables: IZynseqVariable[],
    target: any = null
  ): {} {
    let result;
    if (!target) {
      target = {};
    }
    variables.forEach((variable) => {
      result = this.readVariable(variable[0], variable[1]);
      target[result[0]] = result[1];
    });
    return target;
  }

  protected writeVariables(
    variables: IZynseqVariable[],
    object: IndexableByString
  ) {
    for (let variable of Object.values(variables)) {
      if (variable[0] in object) {
        // console.log(variable[0], object[variable[0]], ": ");
        this.writeVariable(
          object[variable[0]],
          variable[1] as unknown as number
        );
      }
    }
  }

  protected readArrayOfVariables(
    variables: IZynseqVariable[],
    quantity: number
  ) {
    let result = [];
    let data;
    for (let i = 0; i < quantity; i++) {
      data = {};
      this.readVariables(variables, data);
      result.push(data);
    }
    return result;
  }

  protected readTree(format: any, level = 0) {
    let data: { [key: string]: any } = {};
    let cnt: string | number = 0;
    let res;
    let returned;

    for (let entry of format) {
      if (typeof entry[1] == "number") {
        res = this.readVariable(entry[0], entry[1]);
        res[0][0] == "#" ? (cnt = res[1]) : (cnt = 1);
        data[res[0]] = res[1];
      } else if (Array.isArray(entry[1])) {
        let new_level = level + 1;
        data[entry[0]] = [];
        for (let i = 0; i < cnt; i++) {
          returned = this.readTree(entry[1], new_level);
          data[entry[0]].push(returned);
        }
      }
    }
    return data;
  }

  protected writeTree(treePair: { format: any; data: any }, level = 0) {
    let cnt: string | number = 0;
    for (let entry of treePair.format) {
      let iterableItem = "";
      if (typeof entry[1] == "number") {
        if (entry[0] in treePair.data) {
          const value = treePair.data[entry[0]];
          this.writeVariable(value, entry[1]);
          if (entry[0][0] == "#") {
            iterableItem = entry[0].slice(1);
            cnt = Object.values(treePair.data[iterableItem]).length;
            let new_level = level + 1;
            let relatedFormatItem = treePair.format.filter(
              (item: IZynseqVariable) => iterableItem == item[0]
            )[0][1];
            for (let i = 0; i < cnt; i++) {
              this.writeTree(
                {
                  format: relatedFormatItem,
                  data: treePair.data[iterableItem][i],
                },
                new_level
              );
            }
          }
        }
      }
    }
  }

  protected readCharSequence = (stringLength: number, repos = true) => {
    let charSequence = "";
    for (let i = this.pos; i < this.pos + stringLength; i++) {
      try {
        const charCode = this.dv.getInt8(i);
        if (charCode != 0) charSequence += String.fromCharCode(charCode);
      } catch (error) {
        return "";
      }
    }
    if (repos) this.pos += stringLength;
    return charSequence;
  };

  protected writeCharSequence = (value: string, repos = true) => {
    for (let i = this.pos; i < this.pos + value.length; i++) {
      try {
        this.dv.setInt8(i, value.charCodeAt(i - this.pos));
      } catch (error) {
        return "";
      }
    }
    if (repos) this.pos += value.length;
  };
}

export abstract class Base64 {
  public static toArrayBuffer = (base64: string): ArrayBuffer => {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  };

  public static fromArrayBuffer(buffer: ArrayBuffer): string {
    var binary_string = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary_string += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary_string);
  }
}

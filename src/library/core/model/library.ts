export class SampledInstruments {
  [key: string]: SampledInstrument;
}
export class SampledInstrument {
  class = "";
  sub = "";
  resolution? = "";
}

interface IndexableByString {
  [key: string]: any;
}

export interface LibraryItem extends IndexableByString {
  _base: string;
  _alias: string;
}

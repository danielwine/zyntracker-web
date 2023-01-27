export class RenoiseSong {
  GlobalSongData = {
    BeatsPerMin: 0,
    LinesPerBeat: 0,
    TicksPerLine: 0,
    SongName: "",
  };
  Instruments: RenoiseInstrument[] = [];
}

export class RenoiseInstrument {
  // Preset name can only be inferred from the instrument name
  Name = "";
  Phrases: RenoisePhrase[] = [];
}

export class RenoisePhrase {
  Name = "";
  LPB = 0;
  #Lines = 0;
  Lines: RenoisePhraseLine[] = [];
}

export class RenoisePhraseLine {}

export class RenoisePlugin {
  PluginType = "VST";
  PluginIdentifier = "";
  PluginDisplayName = "";
}

export interface XMLElement {
  attributes: {};
  elements: XMLElement[];
  name: string;
  type: string;
  text?: string;
}

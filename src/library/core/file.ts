import { ZSSService as ZSS } from "../zss/zss";
import { AudioService } from "./audio";
import { paths} from "./res/resource";
import { Song } from "./song";

export class ImportFile {
  _name: string = "";
  content: any = undefined;
  isZSS = true;
  binary: boolean = false;
  valid: boolean = false;

  constructor(name?: string) {
    if (name) this.name = name;
  }

  set name(name: string) {
    this._name = name;
    this.binary = name.endsWith("zss") ? false : true;
    const extension = name.split(".")[1];
    this.isZSS = extension == "zss";
    this.valid = ["zss", "xrns"].includes(extension);
  }

  get name() {
    return this._name;
  }
}

export const downloadFile = async (
  fileName: string,
  folderName: string,
  toJson = false
) => {
  let raw;
  const path = `/${folderName}/${fileName}`;
  try {
    let response = await fetch(path);
    raw = await response.text();
  } catch (err) {
    console.log("error", err);
    return false;
  }
  return toJson ? await JSON.parse(raw) : raw;
};

export const createSongFrom = async (zss: ZSS, songName: string) => {
  let song = new Song();
  // song.
  const imported = await song.import(zss);
  if (!imported) return false;
  song.name = songName;
  return song;
};

export const showDebugMessages = (zss: ZSS, song: boolean | Song) => {
  console.debug("ZSS META data: ", zss.preset);
  console.debug("ZSS SEQ data: ", zss.seq);
  console.debug("SONG Object:", song);
  if (song instanceof Song)
    console.debug("  getBankContent(0): ", song.getBankContent(0));
  // ZSS write test
  // const rawJson = zss.save();
  // console.log("saved raw data: ", rawJson);
};

export const load = async (file: ImportFile, release = true) => {
  const as = AudioService.getInstance();
  if (release) as.release();
  let song;
  file.content = file.content
    ? file.content
    : await downloadFile(file.name, paths.songsFolder);
  console.log(file);
  const zss = ZSS.getInstance();
  if (file.isZSS) {
    await zss.load(file.content);
  } else {
    await zss.import(file.content);
  }
  song = await createSongFrom(zss, file.name);
  showDebugMessages(zss, song);

  if (!file.content || !zss.preset || !zss.seq) return false;
  if (!song) return false;
  else if (song != true) {
    as.use(song);
    await as.initEngines();
    await as.addBasicPatterns();
    console.debug("AUDIO SEQUENCES: ", as.sequences);
    return song;
  }
};

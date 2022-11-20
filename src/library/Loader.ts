import ZssService from "./ZSSService";
import { AudioService } from "./AudioService";
import { pathSounds, pathSongs } from "./Samples";
import { Song } from "./Song";

export const downloadSong = async (songName: string) => {
  const path = `/${pathSongs}/${songName}`;
  let json;
  try {
    let response = await fetch(path);
    json = await response.json();
  } catch (err) {
    console.log("error", err);
    return false;
  }
  if (json) console.debug(json);
  return json;
};

export const downloadSFZ = async (SFZName: string) => {
  const path = `/${pathSounds}/${SFZName}`;
  let result;
  try {
    let response = await fetch(path);
    result = await response.text();
  } catch (err) {
    console.error("error", err);
    return false;
  }
  return result;
};

export const loadSong = async (songName: string, data = {}) => {
  const json = "zynseq_riff_b64" in data ? data : await downloadSong(songName);
  const ZSS = ZssService.getInstance();
  ZSS.load(JSON.stringify(json));
  if (!json || !ZSS.preset || !ZSS.seq) return false;

  console.debug(ZSS.preset.layers);
  console.debug(ZSS.seq);

  let song = new Song();
  const imported = await song.importFromZSS(ZSS);
  if (!imported) return false;
  song.name = songName;

  console.debug("Song TONES: ", song.tones);
  console.debug("Song PATTERNS: ", song.patterns);
  console.debug("Song SEQUENCES: ", song.sequences);
  console.debug("getBankContent(0): ", song.getBankContent(0));
  return song;
};

export const load = async (fileName: string, release = true, data = {}) => {
  const as = AudioService.getInstance();
  if (release) as.release();
  const song = await loadSong(fileName, data);
  if (!song) return false;
  else {
    as.use(song);
    await as.initEngines();
    await as.addBasicPatterns();
    console.debug("AudioSequences: ", as.sequences);
    return song;
  }
};

import { load as loadAndInit, ImportFile } from "@/library/core/filemanager";
import { useMainStore } from "@/stores/zss";
import err from "@/library/res/error";
import { ref } from "vue";
import { useUIStore } from "@/stores/ui";
import type { Song } from "@/library/core/song";

const main = useMainStore();
const ui = useUIStore();

const applySong = (song: Song) => {
  ui.clear();
  main.song = song;
  main.loaded = true;
  main.loading = false;
  ui.currentPattern = -1;
  ui.currentPattern = 0;
};

const loadSong = async (file: ImportFile, release: boolean) => {
  try {
    let song = await loadAndInit(file, release);
    if (song) applySong(song);
    else main.error.message = err.import;
  } catch {
    main.error.message = err.json;
  }
};

/**
 * Composable for handling uploaded files
 */
export function useUpload() {
  const FileInput = ref<File | null>();
  let loaded = ref("");

  async function load(fileName: string, release = true) {
    main.loading = true;
    const iFile = new ImportFile(fileName);
    const song = await loadAndInit(iFile, release);
    if (!song) main.error.message = err.import;
    else applySong(song);
  }

  function openFile(file: File, release: boolean = true) {
    let iFile = new ImportFile();
    FileInput.value = file;
    if (FileInput.value) iFile.name = FileInput.value.name;
    let fileReader = new FileReader();
    fileReader.onload = async (event) => {
      iFile.content =
        event.target && event.target.result ? event.target.result : undefined;
      if (iFile.content) {
        await loadSong(iFile, release);
        loaded = ref("fileloaded");
      } else main.error.message = err.import;
    };
    if (iFile.binary) fileReader.readAsArrayBuffer(FileInput.value);
    else fileReader.readAsText(FileInput.value);
    if (!iFile.valid) main.error.message = err.ext;
  }

  return { FileInput, openFile, load, loaded };
}

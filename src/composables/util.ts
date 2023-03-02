import { Song } from "@/library/core/song";
import { AudioService } from "@/library/core/audio";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { appUrl } from "./config";

export default function useUtils() {
  const main = useMainStore();
  const ui = useUIStore();
  const audio = AudioService.getInstance();
  function reset() {
    audio.release();
    ui.clear();
    main.loaded = false;
    main.song = new Song();
  }

  return {
    reset,
  };
}

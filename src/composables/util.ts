import { Song } from "@/library/core/song";
import { AudioService } from "@/library/core/audio";
import { useMainStore } from "@/stores/zss";
import { appUrl } from "./config";

export default function useUtils() {
  const main = useMainStore();
  const audio = AudioService.getInstance();
  function init() {
    audio.setUrl(appUrl);
  }
  function reset() {
    audio.release();
    main.loaded = false;
    main.song = new Song();
  }

  return {
    init,
    reset,
  };
}

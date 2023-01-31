import { Song } from "@/library/core/song";
import { defineStore } from "pinia";

export class Error {
  constructor(public type: string = "", public message: string = "") {}
}

export const useMainStore = defineStore("main", {
  state: () => ({
    loaded: false,
    loading: false,
    song: new Song(),
    error: new Error(),
  }),
  actions: {
    catchError(): Error {
      setTimeout(() => {
        this.error.message = "";
      }, 3000);
      return this.error;
    },
  },
});

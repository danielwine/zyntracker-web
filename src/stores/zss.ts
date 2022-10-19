import { Song } from "@/library/Song";
import { defineStore } from "pinia";

export class Error {
  constructor(public type: string = "", public message: string = "") {}
}

export const useMainStore = defineStore("main", {
  state: () => ({
    loading: false,
    rendered: false,
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

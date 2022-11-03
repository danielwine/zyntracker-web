import { useUIStore } from "@/stores/ui";
import type { RouteRecordName } from "vue-router";
// const ui = useUIStore();

export const toggleKey = (key: string) => {
  // ui.switches[key.toString()].active = !ui.switches[key].active;
};

export const checkFunctionKeys = (
  key: string,
  routeName: RouteRecordName | null = null
) => {
  // if (key in ui.switches) {
    const route = routeName?.toString();
    console.log(route);
    toggleKey(key);
    if (key == "F1") return "toggleHelp";
  // }
};

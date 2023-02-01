import { Action, AlertType } from "@/stores/model";

/**
 * Alert messages
 */
export default {
  notsaved: {
    type: AlertType.confirmation,
    message: "Your project is not saved. Load a new one?",
    buttons: {
      ok: Action.restart,
    },
  },
};

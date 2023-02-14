import { Action, AlertType } from "@/stores/model";

/**
 * Alert messages
 */
export default {
  notsaved: {
    type: AlertType.confirmation,
    message: "Your project is not saved. Leave?",
    buttons: {
      ok: Action.restart,
    },
  },
};

/**
 * Models for UI elements
 */

export enum PlayStates {
  "stopped",
  "playing",
}

export enum Panels {
  "pad",
  "pattern",
  "song",
  "info",
  "options",
  "help",
  "instruments",
  "snapshots",
}

export enum Action {
  dismiss,
  restart,
}

export enum AlertType {
  info,
  confirmation,
}

export class Error {
  constructor(public type = "", public message = "") {}
}

export class Alert {
  constructor(
    public type = AlertType.info,
    public message = "",
    public buttons: { [key: string]: Action } = {}
  ) {}
}

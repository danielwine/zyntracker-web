/**
 * Application info
 */

export const version = "0.0.2";
export const appName = "ZynTracker alpha";
export const appNameShort = "ZynTracker";
export const author = "danielwine";

/**
 * General settings
 */

export const production = false;
export const autostartTransport = true;

/**
 * Urls of the API server & the application
 */

export const apiBaseUrl = production
  ? "http://zyntracker.sly.io/api/v1/"
  : "http://localhost:8000/api/v1/";

export const appUrl = production
  ? "https://zyntracker.web.app"
  : "http://localhost:3000";

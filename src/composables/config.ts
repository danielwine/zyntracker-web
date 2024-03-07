/**
 * Application info
 */

export const appInfo = {
  version: "0.0.4",
  name: "ZynTracker alpha",
  nameShort: "ZynTracker",
  author: "danielwine",
};

/**
 * General settings
 */

export const production = true;
export const debug = false;
export const settings = {
  autostartTransport: true,
  preferSampleLibrary: true,
};

/**
 * Urls of the API server & the appication
 */

export const apiBaseUrl = production
  ? "https://zss.csproject.org/api"
  : "http://localhost:8000/api";

export const appUrl = production
  ? "https://zyntracker.web.app"
  : "http://localhost:3000";

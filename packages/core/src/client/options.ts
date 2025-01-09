import type { AxiosRequestConfig } from "axios";

/**
 * Headers requesting API response serialization
 */
export const apiOptions: AxiosRequestConfig = {
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  headers: {
    // until we start using v4 of react-invenio-forms. They switched to vnd zenodo accept header
    Accept: "application/json",
    "Content-Type": "application/json",
  },
} satisfies AxiosRequestConfig;

/**
 * Headers requesting UI response serialization
 */
export const uiOptions: AxiosRequestConfig = {
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  headers: {
    Accept: "application/vnd.inveniordm.v1+json",
    "Content-Type": "application/json",
  },
} satisfies AxiosRequestConfig;

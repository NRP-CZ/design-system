import { apiClient, uiClient } from "./index";
import { apiOptions, uiOptions } from "./options";

describe("Axios Clients", () => {
  it("apiClient should be an instance of axios", () => {
    expect(apiClient).toBeDefined();
    expect(apiClient).toHaveProperty("defaults");
    expect(apiClient.defaults.headers).toEqual(expect.any(Object));
  });

  it("uiClient should be an instance of axios", () => {
    expect(uiClient).toBeDefined();
    expect(uiClient).toHaveProperty("defaults");
    expect(uiClient.defaults.headers).toEqual(expect.any(Object));
  });

  it("apiClient should be created with apiOptions", () => {
    expect(apiClient.defaults.withCredentials).toBe(apiOptions.withCredentials);
    expect(apiClient.defaults.xsrfCookieName).toBe(apiOptions.xsrfCookieName);
    expect(apiClient.defaults.xsrfHeaderName).toBe(apiOptions.xsrfHeaderName);
    expect(apiClient.defaults.headers).toMatchObject(apiOptions.headers);
  });

  it("uiClient should be created with uiOptions", () => {
    expect(uiClient.defaults.withCredentials).toBe(uiOptions.withCredentials);
    expect(uiClient.defaults.xsrfCookieName).toBe(uiOptions.xsrfCookieName);
    expect(uiClient.defaults.xsrfHeaderName).toBe(uiOptions.xsrfHeaderName);
    expect(uiClient.defaults.headers).toMatchObject(uiOptions.headers);
  });
});

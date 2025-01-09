/**
 * Returns a capture handler which captures and
 * prevents any errors from being output to console.error.
 */
export const withSupressedConsoleErrors = (suppressedBlock: () => void) => {
  const suppressErrors = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  suppressedBlock();

  suppressErrors.mockRestore();
};

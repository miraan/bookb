// @flow

function nullthrows<T>(value: ?T, message: ?string = null): T {
  if (value === null || value === undefined) {
    throw new Error(`nullthrows error: ${message || ''}`);
  }
  return value;
}

export default nullthrows;

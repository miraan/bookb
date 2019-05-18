// @flow

const truncate = (s: string, n: number) => {
  if (s.length <= n) {
    return s;
  }
  return `${s.substr(0, n - 3)}...`;
};

export default truncate;

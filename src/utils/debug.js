const DEBUG = import.meta.env.DEV;

export const debug = {
  log: (...args) => DEBUG && console.log(...args),
  warn: (...args) => DEBUG && console.warn(...args),
  error: (...args) => console.error(...args) // 항상 출력
};

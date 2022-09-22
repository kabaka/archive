/* eslint-disable no-console */
export namespace Log {
  enum LogSeverity {
    Debug,
    Info,
    Warning,
    Error,
  }

  const log = (severity: LogSeverity, str: string, ...args: any[]) => {
    const logStr = `[${Date.now()}] ${severity} - ${str}`;

    switch (severity) {
      case LogSeverity.Debug:
        console.debug(logStr, ...args);
        break;
      case LogSeverity.Info:
        console.info(logStr, ...args);
        break;
      case LogSeverity.Warning:
        console.warn(logStr, ...args);
        break;
      case LogSeverity.Error:
        console.error(logStr, ...args);
        break;
      default:
        throw new Error('invalid logging severity');
    }
  };

  export const debug = (str: string, ...args: any[]) => {
    log(LogSeverity.Debug, str, ...args);
  };

  export const info = (str: string, ...args: any[]) => {
    log(LogSeverity.Info, str, ...args);
  };

  export const warn = (str: string, ...args: any[]) => {
    log(LogSeverity.Warning, str, ...args);
  };

  export const error = (str: string, ...args: any[]) => {
    log(LogSeverity.Error, str, ...args);
  };
}

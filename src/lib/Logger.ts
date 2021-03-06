import winston from 'winston';
import DatadogWinston from 'datadog-winston';

class Logger {
  protected logger = winston.createLogger({
    exitOnError: false,
    format: winston.format.json(),
  });

  constructor() {
    this.logger.add(
      new DatadogWinston({
        apiKey: process.env.API_DATADOG as string,
        hostname: 'ys',
        service: 'ys',
        ddsource: 'node.js',
      })
    );
  }

  info(type: string, data: object) {
    this.logger.info(type, data);
  }

  error(type: string, data: object) {
    this.logger.error('error', { data, level: 'error' });
  }
}

export default new Logger();

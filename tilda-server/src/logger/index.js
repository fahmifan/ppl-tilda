const { createLogger, format, transports } = require('winston');
const morgan = require('morgan');

const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: format.combine(
        format.colorize(),
        format.simple(),
      ),
    }),
  ],
  exitOnError: false,
});
exports.logger = logger;

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

exports.loggerMiddleware = () => morgan('combined', {
  stream: logger.stream,
});

module.exports = exports;
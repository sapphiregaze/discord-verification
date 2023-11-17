const { createLogger, format, transports } = require('winston');

// define log levels
const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

// export logger for use
module.exports.logger = createLogger({
    levels: logLevels,
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.File({ filename: '../../application.log' })],
});
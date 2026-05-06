"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const common_1 = require("@nestjs/common");
class Logger extends common_1.ConsoleLogger {
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    log(message, context) {
        super.log(this.formatMessage(message), context);
    }
    error(message, trace, context) {
        super.error(this.formatMessage(message), trace, context);
    }
    warn(message, context) {
        super.warn(this.formatMessage(message), context);
    }
    debug(message, context) {
        super.debug(this.formatMessage(message), context);
    }
    verbose(message, context) {
        super.verbose(this.formatMessage(message), context);
    }
    formatMessage(message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] ${message}`;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map
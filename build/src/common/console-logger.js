"use strict";
/**
 * Copyright 2018, OpenCensus Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.ConsoleLogger = void 0;
const util = require("util");
const logDriver = require('log-driver');
/**
 * This class implements a console logger.
 */
class ConsoleLogger {
    /**
     * Constructs a new ConsoleLogger instance
     * @param options A logger configuration object.
     */
    constructor(options) {
        let opt = {};
        if (typeof options === 'number') {
            if (options < 0) {
                options = 0;
            }
            else if (options > ConsoleLogger.LEVELS.length) {
                options = ConsoleLogger.LEVELS.length - 1;
            }
            opt = { level: ConsoleLogger.LEVELS[options] };
        }
        else if (typeof options === 'string') {
            opt = { level: options };
        }
        else {
            opt = options || {};
        }
        if (opt.level)
            this.level = opt.level;
        this.logger = logDriver({
            levels: ConsoleLogger.LEVELS,
            level: opt.level || 'silent',
        });
    }
    /**
     * Logger error function.
     * @param message message error to log in console
     * @param args arguments to log in console
     */
    // tslint:disable-next-line:no-any
    error(message, ...args) {
        this.logger.error(util.format(message, ...args));
    }
    /**
     * Logger warning function.
     * @param message message warning to log in console
     * @param args arguments to log in console
     */
    // tslint:disable-next-line:no-any
    warn(message, ...args) {
        this.logger.warn(util.format(message, ...args));
    }
    /**
     * Logger info function.
     * @param message message info to log in console
     * @param args arguments to log in console
     */
    // tslint:disable-next-line:no-any
    info(message, ...args) {
        this.logger.info(util.format(message, ...args));
    }
    /**
     * Logger debug function.
     * @param message message debug to log in console
     * @param args arguments to log in console
     */
    // tslint:disable-next-line:no-any
    debug(message, ...args) {
        this.logger.debug(util.format(message, ...args));
    }
}
exports.ConsoleLogger = ConsoleLogger;
ConsoleLogger.LEVELS = ['silent', 'error', 'warn', 'info', 'debug'];
/**
 * Function logger exported to others classes. Inspired by:
 * https://github.com/cainus/logdriver/blob/bba1761737ca72f04d6b445629848538d038484a/index.js#L50
 * @param options A logger options or strig to logger in console
 */
const logger = (options) => {
    return new ConsoleLogger(options);
};
exports.logger = logger;
//# sourceMappingURL=console-logger.js.map
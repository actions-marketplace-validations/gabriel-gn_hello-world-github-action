/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 165:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(798);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 864:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(165);
const file_command_1 = __nccwpck_require__(526);
const utils_1 = __nccwpck_require__(798);
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 526:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(747));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(798);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 798:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 641:
/***/ ((module) => {

"use strict";

/**
 * A response from a web request
 */
var Response = /** @class */ (function () {
    function Response(statusCode, headers, body, url) {
        if (typeof statusCode !== 'number') {
            throw new TypeError('statusCode must be a number but was ' + typeof statusCode);
        }
        if (headers === null) {
            throw new TypeError('headers cannot be null');
        }
        if (typeof headers !== 'object') {
            throw new TypeError('headers must be an object but was ' + typeof headers);
        }
        this.statusCode = statusCode;
        var headersToLowerCase = {};
        for (var key in headers) {
            headersToLowerCase[key.toLowerCase()] = headers[key];
        }
        this.headers = headersToLowerCase;
        this.body = body;
        this.url = url;
    }
    Response.prototype.isError = function () {
        return this.statusCode === 0 || this.statusCode >= 400;
    };
    Response.prototype.getBody = function (encoding) {
        if (this.statusCode === 0) {
            var err = new Error('This request to ' +
                this.url +
                ' resulted in a status code of 0. This usually indicates some kind of network error in a browser (e.g. CORS not being set up or the DNS failing to resolve):\n' +
                this.body.toString());
            err.statusCode = this.statusCode;
            err.headers = this.headers;
            err.body = this.body;
            err.url = this.url;
            throw err;
        }
        if (this.statusCode >= 300) {
            var err = new Error('Server responded to ' +
                this.url +
                ' with status code ' +
                this.statusCode +
                ':\n' +
                this.body.toString());
            err.statusCode = this.statusCode;
            err.headers = this.headers;
            err.body = this.body;
            err.url = this.url;
            throw err;
        }
        if (!encoding || typeof this.body === 'string') {
            return this.body;
        }
        return this.body.toString(encoding);
    };
    return Response;
}());
module.exports = Response;


/***/ }),

/***/ 717:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.__esModule = true;
var FormData = /** @class */ (function () {
    function FormData() {
        this._entries = [];
    }
    FormData.prototype.append = function (key, value, fileName) {
        this._entries.push({ key: key, value: value, fileName: fileName });
    };
    return FormData;
}());
exports.FormData = FormData;
function getFormDataEntries(fd) {
    return fd._entries;
}
exports.getFormDataEntries = getFormDataEntries;


/***/ }),

/***/ 467:
/***/ (function(module, exports, __nccwpck_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
exports.__esModule = true;
var GenericResponse = __nccwpck_require__(641);
var FormData_1 = __nccwpck_require__(717);
exports.FormData = FormData_1.FormData;
var init = __nccwpck_require__(239);
var remote = init(__nccwpck_require__.ab + "worker.js");
function request(method, url, options) {
    var _a = options || { form: undefined }, form = _a.form, o = __rest(_a, ["form"]);
    var opts = o;
    if (form) {
        opts.form = FormData_1.getFormDataEntries(form);
    }
    var req = {
        m: method,
        u: url && typeof url === 'object' ? url.href : url,
        o: opts
    };
    var res = remote(req);
    return new GenericResponse(res.s, res.h, res.b, res.u);
}
exports.default = request;
module.exports = request;
module.exports.default = request;
module.exports.FormData = FormData_1.FormData;


/***/ }),

/***/ 239:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(622);
const spawn = __nccwpck_require__(129).spawn;
const spawnSync = __nccwpck_require__(129).spawnSync;
const JSON = __nccwpck_require__(636);

const host = '127.0.0.1';
function nodeNetCatSrc(port, input) {
  return (
    "var c=require('net').connect(" +
    port +
    ",'127.0.0.1',()=>{c.pipe(process.stdout);c.end(" +
    JSON.stringify(input)
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029') +
    ')})'
  );
}

const FUNCTION_PRIORITY = [nativeNC, nodeNC];

let started = false;
const configuration = {port: null, fastestFunction: null};
function start() {
  if (!spawnSync) {
    throw new Error(
      'Sync-request requires node version 0.12 or later.  If you need to use it with an older version of node\n' +
        'you can `npm install sync-request@2.2.0`, which was the last version to support older versions of node.'
    );
  }
  const port = findPort();
  const p = spawn(process.execPath, [__nccwpck_require__.ab + "worker1.js", port], {
    stdio: 'inherit',
    windowsHide: true,
  });
  p.unref();
  process.on('exit', () => {
    p.kill();
  });
  waitForAlive(port);
  const fastestFunction = getFastestFunction(port);
  configuration.port = port;
  configuration.fastestFunction = fastestFunction;
  started = true;
}

function findPort() {
  const findPortResult = spawnSync(
    process.execPath,
    [__nccwpck_require__.ab + "find-port.js"],
    {
      windowsHide: true,
    }
  );
  if (findPortResult.error) {
    if (typeof findPortResult.error === 'string') {
      throw new Error(findPortResult.error);
    }
    throw findPortResult.error;
  }
  if (findPortResult.status !== 0) {
    throw new Error(
      findPortResult.stderr.toString() ||
        'find port exited with code ' + findPortResult.status
    );
  }
  const portString = findPortResult.stdout.toString('utf8').trim();
  if (!/^[0-9]+$/.test(portString)) {
    throw new Error('Invalid port number string returned: ' + portString);
  }
  return +portString;
}

function waitForAlive(port) {
  let response = null;
  let err = null;
  let timeout = Date.now() + 10000;
  while (response !== 'pong' && Date.now() < timeout) {
    const result = nodeNC(port, 'ping\r\n');
    response = result.stdout && result.stdout.toString();
    err = result.stderr && result.stderr.toString();
  }
  if (response !== 'pong') {
    throw new Error(
      'Timed out waiting for sync-rpc server to start (it should respond with "pong" when sent "ping"):\n\n' +
        err +
        '\n' +
        response
    );
  }
}

function nativeNC(port, input) {
  return spawnSync('nc', [host, port], {
    input: input,
    windowsHide: true,
    maxBuffer: Infinity,
  });
}

function nodeNC(port, input) {
  const src = nodeNetCatSrc(port, input);
  if (src.length < 1000) {
    return spawnSync(process.execPath, ['-e', src], {
      windowsHide: true,
      maxBuffer: Infinity,
    });
  } else {
    return spawnSync(process.execPath, [], {
      input: src,
      windowsHide: true,
      maxBuffer: Infinity,
    });
  }
}

function test(fn, port) {
  const result = fn(port, 'ping\r\n');
  const response = result.stdout && result.stdout.toString();
  return response === 'pong';
}

function getFastestFunction(port) {
  for (let i = 0; i < FUNCTION_PRIORITY.length; i++) {
    if (test(FUNCTION_PRIORITY[i], port)) {
      return FUNCTION_PRIORITY[i];
    }
  }
}

function sendMessage(input) {
  if (!started) start();
  const res = configuration.fastestFunction(
    configuration.port,
    JSON.stringify(input) + '\r\n'
  );
  try {
    return JSON.parse(res.stdout.toString('utf8'));
  } catch (ex) {
    if (res.error) {
      if (typeof res.error === 'string') res.error = new Error(res.error);
      throw res.error;
    }
    if (res.status !== 0) {
      throw new Error(
        configuration.fastestFunction.name +
          ' failed:\n' +
          (res.stdout && res.stdout.toString()) +
          '\n' +
          (res.stderr && res.stderr.toString())
      );
    }
    throw new Error(
      configuration.fastestFunction.name +
        ' failed:\n' +
        (res.stdout && res.stdout).toString() +
        '\n' +
        (res.stderr && res.stderr).toString()
    );
  }
}
function extractValue(msg) {
  if (!msg.s) {
    const error = new Error(msg.v.message);
    error.code = msg.v.code;
    throw error;
  }
  return msg.v;
}

function createClient(filename, args) {
  const id = extractValue(sendMessage({t: 1, f: filename, a: args}));
  return function(args) {
    return extractValue(sendMessage({t: 0, i: id, a: args}));
  };
}
createClient.FUNCTION_PRIORITY = FUNCTION_PRIORITY;
createClient.configuration = configuration;

module.exports = createClient;


/***/ }),

/***/ 636:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


//TODO: handle reviver/dehydrate function like normal
//and handle indentation, like normal.
//if anyone needs this... please send pull request.

exports.stringify = function stringify(o) {
  if (o && Buffer.isBuffer(o))
    return JSON.stringify(':base64:' + o.toString('base64'));

  if (o && o.toJSON) o = o.toJSON();

  if (o && 'object' === typeof o) {
    var s = '';
    var array = Array.isArray(o);
    s = array ? '[' : '{';
    var first = true;

    for (var k in o) {
      var ignore =
        'function' == typeof o[k] || (!array && 'undefined' === typeof o[k]);
      if (Object.hasOwnProperty.call(o, k) && !ignore) {
        if (!first) s += ',';
        first = false;
        if (array) {
          s += stringify(o[k]);
        } else if (o[k] !== void 0) {
          s += stringify(k) + ':' + stringify(o[k]);
        }
      }
    }

    s += array ? ']' : '}';

    return s;
  } else if ('string' === typeof o) {
    return JSON.stringify(/^:/.test(o) ? ':' + o : o);
  } else if ('undefined' === typeof o) {
    return 'null';
  } else return JSON.stringify(o);
};

exports.parse = function(s) {
  return JSON.parse(s, function(key, value) {
    if ('string' === typeof value) {
      if (/^:base64:/.test(value))
        return new Buffer(value.substring(8), 'base64');
      else return /^:/.test(value) ? value.substring(1) : value;
    }
    return value;
  });
};


/***/ }),

/***/ 129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(864);
const {promises: fs} = __nccwpck_require__(747);
const request = __nccwpck_require__(467);

// most @actions toolkit packages have async methods
async function run() {
    try {
        const filepath = core.getInput('filepath')
        core.info(`Reading file ${filepath}`);
        let content = await fs.readFile(filepath, 'utf8')
        content = JSON.parse(content);
        let packageFileVersion = content.version;
        const packageName = core.getInput('packageName') || content.name;
        const npmPackageMetadata = JSON.parse(request('GET', `https://registry.npmjs.org/${packageName}`).body);
        const npmVersions = Object.keys(npmPackageMetadata['versions']);
        const changed = npmVersions.includes(content.version) === false;
        core.setOutput('content', content);
        core.setOutput('packageName', packageName);
        core.setOutput('version', packageFileVersion);
        core.setOutput('npmVersions', npmVersions);
        core.setOutput('changed', changed);
        core.info(`file version: ${content.version}`);
        core.info(`npm ${content.name} package versions: ${npmVersions}`);
        core.info(`has package version changed from npm versions?: ${changed}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

})();

module.exports = __webpack_exports__;
/******/ })()
;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 636:
/***/ ((__unused_webpack_module, exports) => {



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

/***/ 631:
/***/ ((module) => {

module.exports = require("net");;

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
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
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


const net = __nccwpck_require__(631);
const JSON = __nccwpck_require__(636);

const INIT = 1;
const CALL = 0;
const modules = [];

const NULL_PROMISE = Promise.resolve(null);
const server = net.createServer({allowHalfOpen: true}, c => {
  let responded = false;
  function respond(data) {
    if (responded) return;
    responded = true;
    c.end(JSON.stringify(data));
  }

  let buffer = '';
  c.on('error', function(err) {
    respond({s: false, v: {code: err.code, message: err.message}});
  });
  c.on('data', function(data) {
    buffer += data.toString('utf8');
    if (/\r\n/.test(buffer)) {
      onMessage(buffer.trim());
    }
  });
  function onMessage(str) {
    if (str === 'ping') {
      c.end('pong');
      return;
    }
    NULL_PROMISE.then(function() {
      const req = JSON.parse(str);
      if (req.t === INIT) {
        return init(req.f, req.a);
      }
      return modules[req.i](req.a);
    }).then(
      function(response) {
        respond({s: true, v: response});
      },
      function(err) {
        respond({s: false, v: {code: err.code, message: err.message}});
      }
    );
  }
});

function init(filename, arg) {
  let m = require(filename);
  if (m && typeof m === 'object' && typeof m.default === 'function') {
    m = m.default;
  }
  if (typeof m !== 'function') {
    throw new Error(filename + ' did not export a function.');
  }
  return NULL_PROMISE.then(function() {
    return m(arg);
  }).then(function(fn) {
    const i = modules.length;
    modules[i] = fn;
    return i;
  });
}

server.listen(+process.argv[2]);

})();

module.exports = __webpack_exports__;
/******/ })()
;
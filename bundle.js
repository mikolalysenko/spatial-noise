;(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){
"use strict"

var hashInt       = require("hash-int")
  , float2Int     = require("float-bits").toInt
  , UINT_MAX      = 4294967295.0
  , HASH_CONSTANT = 0x7997F879
  , DOUBLE_VIEW   = new Float64Array(1)
  , INT_VIEW      = new Uint32Array(DOUBLE_VIEW.buffer)

function hashDouble(x, y) {
  DOUBLE_VIEW[0] = +x
  return hashInt(INT_VIEW[0] + hashInt(INT_VIEW[1]+y))
}

function noise1f(x) {
  return (+(hashInt(float2Int(x)+HASH_CONSTANT)>>>0)) / UINT_MAX
}

function noise2f(x, y) {
  return (+(hashInt(float2Int(y)+hashInt(float2Int(x)+HASH_CONSTANT))>>>0)) / UINT_MAX
}

function noise3f(x,y,z) {
  return (+(hashInt(float2Int(z)+hashInt(float2Int(y)+hashInt(float2Int(x)+HASH_CONSTANT)))>>>0)) / UINT_MAX
}

function noise4f(x,y,z,t) {
  return (+(hashInt(float2Int(t)+hashInt(float2Int(z)+hashInt(float2Int(y)+hashInt(float2Int(x)+HASH_CONSTANT)))>>>0))) / UINT_MAX
}

function noiseNf() {
  var n = arguments.length
    , r = HASH_CONSTANT
  for(var i=0; i<n; ++i) {
    r = hashInt(r + float2Int(arguments[i]))
  }
  return (+r) / UINT_MAX
}

function noise1d(x) {
  return +(hashDouble(x, HASH_CONSTANT)>>>0) / UINT_MAX
}

function noise2d(x, y) {
  return +(hashDouble(y, hashDouble(x, HASH_CONSTANT))>>>0) / UINT_MAX
}

function noise3d(x, y, z) {
  return +(hashDouble(z, hashDouble(y, hashDouble(x, HASH_CONSTANT)))>>>0) / UINT_MAX
}

function noise4d(x, y, z, t) {
  return +(hashDouble(t, hashDouble(z, hashDouble(y, hashDouble(x, HASH_CONSTANT))))>>>0) / UINT_MAX
}

function noiseNd() {
  var n = arguments.length
    , r = HASH_CONSTANT
  for(var i=0; i<n; ++i) {
    r = hashDouble(arguments[i], r)
  }
  return +(r>>>0) / UINT_MAX
}

module.exports         = noiseNd
module.exports.noise1d = noise1d
module.exports.noise2d = noise2d
module.exports.noise3d = noise3d
module.exports.noise4d = noise4d
module.exports.noiseNd = noiseNd
module.exports.noise1f = noise1f
module.exports.noise2f = noise2f
module.exports.noise3f = noise3f
module.exports.noise4f = noise4f
module.exports.noiseNf = noiseNf

},{"float-bits":2,"hash-int":3}],4:[function(require,module,exports){
var prng = require("../prng.js")

var canvas = document.createElement("canvas")
canvas.width = 512
canvas.height = 512
document.body.appendChild(canvas)

var context = canvas.getContext("2d")
var pixels = context.getImageData(0, 0, canvas.width, canvas.height)

require("raf")(canvas).on("data", function(dt) {
  var ptr = 0
    , t = Date.now()
  for(var i=0; i<canvas.width; ++i) {
    for(var j=0; j<canvas.height; ++j) {
      var v = Math.floor(prng(t, i - 256, j - 256) * 255)
      pixels.data[ptr++] = v
      pixels.data[ptr++] = v
      pixels.data[ptr++] = v
      pixels.data[ptr++] = 255
    }
  }
  context.putImageData(pixels, 0, 0)
})

},{"../prng.js":1,"raf":5}],2:[function(require,module,exports){
"use strict"

var FLOAT_VIEW  = new Float32Array(1)
  , INT_VIEW    = new Int32Array(FLOAT_VIEW.buffer)
  , UINT_VIEW   = new Uint32Array(FLOAT_VIEW.buffer)

function floatToInt(x) {
  FLOAT_VIEW[0] = x
  return INT_VIEW[0]
}

function intToFloat(x) {
  INT_VIEW[0] = x
  return FLOAT_VIEW[0]
}

function floatToUint(x) {
  FLOAT_VIEW[0] = x
  return UINT_VIEW[0]
}

function uintToFloat(x) {
  UINT_VIEW[0] = x
  return FLOAT_VIEW[0]
}

module.exports = floatToInt
module.exports.toInt = floatToInt
module.exports.fromInt = intToFloat
module.exports.toUint = floatToUint
module.exports.fromUint = uintToFloat
},{}],3:[function(require,module,exports){
"use strict"

var A
if(typeof Uint32Array === undefined) {
  A = [ 0 ]
} else {
  A = new Uint32Array(1)
}

function hashInt(x) {
  A[0]  = x|0
  A[0] -= (A[0]<<6)
  A[0] ^= (A[0]>>>17)
  A[0] -= (A[0]<<9)
  A[0] ^= (A[0]<<4)
  A[0] -= (A[0]<<3)
  A[0] ^= (A[0]<<10)
  A[0] ^= (A[0]>>>15)
  return A[0]
}

module.exports = hashInt

},{}],5:[function(require,module,exports){
(function(){module.exports = raf

var EE = require('events').EventEmitter
  , global = typeof window === 'undefined' ? this : window

var _raf =
  global.requestAnimationFrame ||
  global.webkitRequestAnimationFrame ||
  global.mozRequestAnimationFrame ||
  global.msRequestAnimationFrame ||
  global.oRequestAnimationFrame ||
  (global.setImmediate ? function(fn, el) {
    setImmediate(fn)
  } :
  function(fn, el) {
    setTimeout(fn, 0)
  })

function raf(el) {
  var now = raf.now()
    , ee = new EE

  ee.pause = function() { ee.paused = true }
  ee.resume = function() { ee.paused = false }

  _raf(iter, el)

  return ee

  function iter(timestamp) {
    var _now = raf.now()
      , dt = _now - now
    
    now = _now

    ee.emit('data', dt)

    if(!ee.paused) {
      _raf(iter, el)
    }
  }
}

raf.polyfill = _raf
raf.now = function() { return Date.now() }

})()
},{"events":6}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],6:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":7}]},{},[4])
;
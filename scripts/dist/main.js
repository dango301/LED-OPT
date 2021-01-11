// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/most-visible/dist/most-visible.js":[function(require,module,exports) {
var define;
/**
 * Most Visible v1.5.0
 *
 * @author Andy Palmer <andy@andypalmer.me>
 * @license MIT
 */
(function (root, factory) {
  // Universal Module Definition

  /* jshint strict:false */

  /* global define: false, module: false */
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(root);
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.mostVisible = factory(root);
  }
})(typeof self !== 'undefined' ? self : this, function (window) {
  /* jshint unused: vars */
  'use strict';
  /**
   * MostVisible constructor
   *
   * @param {NodeList|string} elements
   * @param {{}} options
   * @constructor
   */

  function MostVisible(elements, options) {
    if (!(this instanceof MostVisible)) {
      return new MostVisible(elements, options).getMostVisible();
    }

    if (typeof elements === 'string') {
      elements = document.querySelectorAll(elements);
    }

    this.elements = elements;
    this.options = extend({}, MostVisible.defaults, options);
  }
  /**
   * MostVisible default options
   *
   * @namespace
   * @property {{}}      defaults             Default options hash.
   * @property {boolean} defaults.percentage  Whether to calculate visibility as a percentage of height.
   * @property {number}  defaults.offset      An offset to take into account when calculating visibility.
   */


  MostVisible.defaults = {
    percentage: false,
    offset: 0
  };
  MostVisible.prototype = {
    /**
     * Returns the most visible element from the instance's NodeList.
     *
     * @returns {HTMLElement} Most visible element.
     */
    getMostVisible: function () {
      var _this = this;

      var viewportHeight = document.documentElement.clientHeight;
      return Array.prototype.reduce.call(this.elements, function (carry, element) {
        var value = _this.getVisibleHeight(element, viewportHeight);

        return value > carry[0] ? [value, element] : carry;
      }, [0, null])[1];
    },

    /**
     * Returns the visible height of an element.
     *
     * @param {HTMLElement} element Element to check the visibility of.
     * @param {number}      viewportHeight
     * @returns {number}    Visible height of the element in pixels or a percentage of the element's total height.
     */
    getVisibleHeight: function (element, viewportHeight) {
      var rect = element.getBoundingClientRect(),
          rectTopOffset = rect.top - this.options.offset,
          rectBottomOffset = rect.bottom - this.options.offset,
          height = rect.bottom - rect.top,
          visible = {
        top: rectTopOffset >= 0 && rectTopOffset < viewportHeight,
        bottom: rectBottomOffset > 0 && rectBottomOffset < viewportHeight
      };
      var visiblePx = 0;

      if (visible.top && visible.bottom) {
        // Whole element is visible
        visiblePx = height;
      } else if (visible.top) {
        visiblePx = viewportHeight - rect.top;
      } else if (visible.bottom) {
        visiblePx = rectBottomOffset;
      } else if (height > viewportHeight && rectTopOffset < 0) {
        var absTop = Math.abs(rectTopOffset);

        if (absTop < height) {
          // Part of the element is visible
          visiblePx = height - absTop;
        }
      }

      if (this.options.percentage) {
        return visiblePx / height * 100;
      }

      return visiblePx;
    }
  };

  MostVisible.makeJQueryPlugin = function ($) {
    if (!$) {
      return;
    }

    $.fn.mostVisible = function (options) {
      var instance = new MostVisible(this.get(), options);
      return this.filter(instance.getMostVisible());
    };
  }; // Try adding the jQuery plugin to window.jQuery


  MostVisible.makeJQueryPlugin(window.jQuery);
  /**
   * Extends obj by adding the properties of all other objects passed to the function.
   *
   * @param {...{}} obj
   * @returns {{}} The extended object.
   */

  function extend(obj) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        obj[key] = arguments[i][key];
      }
    }

    return obj;
  }

  return MostVisible;
});

},{}],"../node_modules/jump.js/dist/jump.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Robert Penner's easeInOutQuad
// find the rest of his easing functions here: http://robertpenner.com/easing/
// find them exported for ES6 consumption here: https://github.com/jaxgeller/ez.js
var easeInOutQuad = function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var jumper = function jumper() {
  // private variable cache
  // no variables are created during a jump, preventing memory leaks
  var element = void 0; // element to scroll to                   (node)

  var start = void 0; // where scroll starts                    (px)

  var stop = void 0; // where scroll stops                     (px)

  var offset = void 0; // adjustment from the stop position      (px)

  var easing = void 0; // easing function                        (function)

  var a11y = void 0; // accessibility support flag             (boolean)

  var distance = void 0; // distance of scroll                     (px)

  var duration = void 0; // scroll duration                        (ms)

  var timeStart = void 0; // time scroll started                    (ms)

  var timeElapsed = void 0; // time spent scrolling thus far          (ms)

  var next = void 0; // next scroll position                   (px)

  var callback = void 0; // to call when done scrolling            (function)
  // scroll position helper

  function location() {
    return window.scrollY || window.pageYOffset;
  } // element offset helper


  function top(element) {
    return element.getBoundingClientRect().top + start;
  } // rAF loop helper


  function loop(timeCurrent) {
    // store time scroll started, if not started already
    if (!timeStart) {
      timeStart = timeCurrent;
    } // determine time spent scrolling so far


    timeElapsed = timeCurrent - timeStart; // calculate next scroll position

    next = easing(timeElapsed, start, distance, duration); // scroll to it

    window.scrollTo(0, next); // check progress

    timeElapsed < duration ? window.requestAnimationFrame(loop) // continue scroll loop
    : done(); // scrolling is done
  } // scroll finished helper


  function done() {
    // account for rAF time rounding inaccuracies
    window.scrollTo(0, start + distance); // if scrolling to an element, and accessibility is enabled

    if (element && a11y) {
      // add tabindex indicating programmatic focus
      element.setAttribute('tabindex', '-1'); // focus the element

      element.focus();
    } // if it exists, fire the callback


    if (typeof callback === 'function') {
      callback();
    } // reset time for next jump


    timeStart = false;
  } // API


  function jump(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}; // resolve options, or use defaults

    duration = options.duration || 1000;
    offset = options.offset || 0;
    callback = options.callback; // "undefined" is a suitable default, and won't be called

    easing = options.easing || easeInOutQuad;
    a11y = options.a11y || false; // cache starting position

    start = location(); // resolve target

    switch (typeof target === 'undefined' ? 'undefined' : _typeof(target)) {
      // scroll from current position
      case 'number':
        element = undefined; // no element to scroll to

        a11y = false; // make sure accessibility is off

        stop = start + target;
        break;
      // scroll to element (node)
      // bounding rect is relative to the viewport

      case 'object':
        element = target;
        stop = top(element);
        break;
      // scroll to element (selector)
      // bounding rect is relative to the viewport

      case 'string':
        element = document.querySelector(target);
        stop = top(element);
        break;
    } // resolve scroll distance, accounting for offset


    distance = stop - start + offset; // resolve duration

    switch (_typeof(options.duration)) {
      // number in ms
      case 'number':
        duration = options.duration;
        break;
      // function passed the distance of the scroll

      case 'function':
        duration = options.duration(distance);
        break;
    } // start the loop


    window.requestAnimationFrame(loop);
  } // expose only the jump method


  return jump;
}; // export singleton


var singleton = jumper();
var _default = singleton;
exports.default = _default;
},{}],"main.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var most_visible_1 = __importDefault(require("most-visible"));

var jump_js_1 = __importDefault(require("jump.js")); // import preload from 'preload-js'


var _sections,
    sections,
    contentLI,
    contentLinks,
    asideContent,
    tableToggle,
    table,
    container,
    figures,
    floatingFigs,
    modal,
    modalImg,
    title,
    link,
    figIndex = 0,
    figInfo = [];

var pages = ['home', 'leuchtdioden', 'datensätze', 'optimierung', 'impressum']; // if (window.location.hash == '')
//     Array.from(document.getElementsByClassName('page-transition')).forEach(el => el.classList.add('hide'))

window.onload = pageLoad;

function pageLoad() {
  console.log('%c' + 'Welcome!', 'font-weight: 900; color: lightblue');
  Array.from(document.getElementsByClassName('page-transition')).forEach(function (el) {
    return el.classList.add('loaded');
  }); // let queue = new preload.LoadQueue(false)
  // let images = Array.from(document.querySelectorAll('main article img'))
  // let imgInfos = []
  // images.forEach(img => {
  //     let src = img.getAttribute('data-src')
  //     let alt = (<HTMLImageElement>img).alt
  //     let imgSrc = img.getAttribute('data-imgSrc')
  //     let parent = img.parentNode
  //     imgInfos.push({ src, alt, imgSrc, parent })
  // })
  // imgInfos.forEach(img => queue.loadFile(img.src))
  // queue.on('fileload', (event) => {
  //     let src = event.item.src
  //     let img = <HTMLImageElement>images.find(i => i.getAttribute('data-src') == src)
  //     console.log(img.alt)
  //     img.src = src
  //     // resize()
  //     // window.onresize = resize
  // })
  // queue.on('complete', () => {

  figures = Array.from(document.getElementsByTagName('figure'));
  floatingFigs = figures.filter(function (fig) {
    return fig.hasAttribute('data-isFloating');
  });
  modal = document.querySelector('.modal');
  modalImg = document.querySelector('.modal img');
  title = document.querySelector('.modal h4');
  link = document.querySelector('.modal a');
  document.querySelectorAll('.modal img.slider').forEach(function (slider, i) {
    return slider.addEventListener('click', function () {
      return enlargeImg(figIndex + (i == 0 ? -1 : 1));
    });
  });
  figures.forEach(function (fig, i) {
    var img = fig.firstElementChild.firstElementChild;
    var imgSrc = img.getAttribute('data-imgSrc');
    figInfo.push({
      src: img.src,
      alt: img.alt,
      imgSrc: imgSrc,
      href: imgSrc.substring(0, imgSrc.indexOf(' '))
    });
    fig.addEventListener('click', function () {
      return enlargeImg(i);
    });
  }); // })

  var n = pages.indexOf(Array.from(document.getElementsByTagName('main'))[0].getAttribute('data-namespace'));
  Array.from(document.querySelectorAll('header nav a')).forEach(function (navLink, i) {
    return navLink.classList.toggle('active', i == n);
  });
  _sections = document.querySelectorAll('section');
  sections = Array.from(_sections);
  asideContent = document.querySelector('aside.content');
  contentLI = asideContent.querySelectorAll('li');
  contentLinks = asideContent.querySelectorAll('li a');
  table = asideContent.querySelector('.table-of-contents');
  container = document.querySelector('main .container');
  scrollVisibility();
  window.onscroll = scrollVisibility;
  tableToggle = document.querySelector('aside.content a.toggle');
  tableToggle.addEventListener('click', function () {
    return toggleAside();
  });
  if (modal) modal.addEventListener('click', function (e) {
    return hideImg(e.target);
  });
  Array.from(document.querySelectorAll('.info-box .content h4')).forEach(function (h4) {
    function toggleInfoBox(h4) {
      var infoBox = h4.parentElement.parentElement;
      var isExpanded = infoBox.getAttribute('data-isExpanded') == 'true';
      infoBox.style.maxHeight = isExpanded ? h4.offsetHeight + "px" : window.innerWidth < 992 ? '1000vh' : '100vh';
      infoBox.setAttribute('data-isExpanded', isExpanded ? 'false' : 'true');
    }

    toggleInfoBox(h4);
    h4.addEventListener('click', function () {
      return toggleInfoBox(h4);
    });
  });
  resize();
  window.onresize = resize;
  var target = document.getElementById(window.location.hash.substring(1));
  jump_js_1.default(target, {
    offset: -45
  });
}

function toggleAside(forcedState) {
  if (forcedState === void 0) {
    forcedState = undefined;
  }

  var originalState = tableToggle.getAttribute('data-collapsed') == 'true';
  if (forcedState && forcedState == originalState) return;
  var isCollapsed = forcedState != undefined ? forcedState : !originalState;
  tableToggle.setAttribute('data-collapsed', isCollapsed ? 'true' : 'false');
  tableToggle.innerHTML = isCollapsed ? '🢚 OUT' : '🢘 IN';
  asideContent.classList.toggle('collapsed', isCollapsed);
  setTimeout(function () {
    table.classList.add('smooth-top');
    scrollVisibility();
    setTimeout(function () {
      table.classList.remove('smooth-top');
    }, 150); // resize()
  }, 333);
}

function enlargeImg(n) {
  if (n >= figInfo.length) figIndex = 0;else if (n < 0) figIndex = figInfo.length - 1;else figIndex = n;
  var info = figInfo[figIndex];
  modal.classList.add('show');
  modalImg.src = info.src;
  modalImg.alt = info.alt;
  title.innerHTML = info.alt;

  if (info.href) {
    link.style.display = 'initial';
    link.innerHTML = info.imgSrc;
    link.href = info.href;
  } else link.style.display = 'none';
}

function hideImg(el) {
  if (el.tagName != 'a' && !el.classList.contains('slider')) modal.classList.remove('show');
}

function scrollVisibility() {
  var visEl = most_visible_1.default(_sections);
  var n = sections.indexOf(visEl);
  contentLI.forEach(function (link, i) {
    return link.classList.toggle('active', i == n);
  });
  contentLinks.forEach(function (link, i) {
    return link.classList.toggle('active', i == n);
  });

  var _a = container.getBoundingClientRect(),
      top = _a.top,
      bottom = _a.bottom;

  var containerHeight = bottom - top;
  var tableHeight = table.offsetHeight;
  var pos = -top + 45 - tableHeight / 2 + window.innerHeight / 2; //pos = yPos on screen + 45px navHeight and center table on screen

  var y;
  if (pos < 0) y = 0;else {
    if (bottom < window.innerHeight / 2 + tableHeight / 2) y = containerHeight - tableHeight;else y = pos;
  }
  table.style.top = y + "px";
}

var minP = 600,
    maxP = 800,
    minImg = 250,
    maxImg = 450,
    changeOrder = function changeOrder(fig, pushDown) {
  var section = fig.parentNode;
  var isFloating = fig.getAttribute('data-isFloating') == 'true';

  if (pushDown && fig.nextElementSibling && isFloating) {
    fig.style.float = 'none';
    fig.style.width = .5 * (minImg + maxImg) + 'px';
    section.insertBefore(fig, fig.nextElementSibling.nextElementSibling);
    fig.setAttribute('data-isFloating', 'false');
  } else if (!pushDown && fig.previousElementSibling && !isFloating) {
    fig.style.float = 'right';
    section.insertBefore(fig, fig.previousElementSibling);
    fig.setAttribute('data-isFloating', 'true');
  }
};

function resize() {
  toggleAside(window.innerWidth < 992);
  var totalW = document.querySelector('article').getBoundingClientRect().width;
  var availableW = totalW - 2 * 45 - 20; // total minus section padding and figure margin

  if (availableW - minImg < minP) {
    // both text and img would become too small
    floatingFigs.forEach(function (fig) {
      return changeOrder(fig, true);
    });
  } else {
    var finalW_1 = minImg + .5 * (availableW - minP - minImg); //distribute space evenly

    while (finalW_1 > maxImg) {
      finalW_1--;
    } //FIXME: while (availableW - finalW > maxP) finalW++ // if text is has enough space too reach maximum (800px) then give the remaining space to img


    floatingFigs.forEach(function (fig) {
      fig.style.width = finalW_1 + 'px';
      changeOrder(fig, false);
    });
  }

  scrollVisibility();
}
},{"most-visible":"../node_modules/most-visible/dist/most-visible.js","jump.js":"../node_modules/jump.js/dist/jump.module.js"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59689" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=/main.js.map
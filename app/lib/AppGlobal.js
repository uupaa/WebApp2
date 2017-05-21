// --- technical terms / data structures -------------------
// AppGlobal.js           - https://github.com/uupaa/WebApp2/wiki/AppGlobal.js
// GlobalObject Idiom     - https://github.com/uupaa/WebApp2/wiki/GlobalObject-Idiom
// Environment Detection  - https://github.com/uupaa/WebApp2/wiki/Environment-Detection

// --- dependency modules ----------------------------------

// --- define / local variables ----------------------------
const GlobalObject = (this || 0).self || (typeof self !== "undefined") ? self : global;
const hasGlobal    = !!GlobalObject.global;              // Node.js, NW.js, Electron
const processType  = !!(GlobalObject.process || 0).type; // Electron(render or main)
const nativeTimer  = !!/native/.test(setTimeout);        // Node.js, Electron(main)

// --- implements ------------------------------------------
let env = { // Environment Detection
  isBrowser:  !hasGlobal && "document"       in GlobalObject, // Browser, Worker
  isWorker:   !hasGlobal && "WorkerLocation" in GlobalObject, // Worker
  isNode:      hasGlobal && !processType && !nativeTimer,     // Node.js
  isNW:        hasGlobal && !processType &&  nativeTimer,     // NW.js
  isElectron:  hasGlobal &&  processType,                     // Electron(render or main)
};

let vars = Object.create(null); // has not prototype

let flags = {
  debug:   0, // debug mode (0: no debug, 1: publish vars, 2: type assert)
  verbose: 0, // verbose mode (0: no verbose, 1: verbose, 2: verbose verbose)
  set: function(options = { debug: 0, verbose: 0 }) {
    this.debug   = options.debug   || 0;
    this.verbose = options.verbose || 0;
    if (this.debug) {
      GlobalObject.vars = vars; // publish to window.vars
      GlobalObject.modules = modules;
    }
    Object.freeze(this);
  }
};

let modules = {
  add: function(name, entity) {
    this[name] = entity;
  }
};

export let AppGlobal = {
  env:      env,          // AppGlobal.env
  vars:     vars,         // AppGlobal.vars
  flags:    flags,        // AppGlobal.flags
  global:   GlobalObject, // AppGlobal.global
  modules:  modules,      // AppGlobal.modules
};


// --- technical terms / data structures -------------------
// App.js             - https://github.com/uupaa/WebApp2/wiki/App.js
// GlobalObject Idiom - https://github.com/uupaa/WebApp2/wiki/GlobalObject-Idiom

// --- dependency modules ----------------------------------
import { UserAgent } from "./UserAgent.js";

// --- define / local variables ----------------------------
const GlobalObject = (this || 0).self || (typeof self !== "undefined") ? self : global;

// --- class / interfaces ----------------------------------
class Globals extends Map {
  get object() {
    return GlobalObject;
  }
}

class App {
  constructor() {
    this.module    = new Map();     // app.module:Map
    this.global    = new Globals(); // app.global:Map
    this.debug     = 0;             // app.debug:Uint8 - debug mode (0: no debug, 1: publish vars, 2: type assert)
    this.verbose   = 0;             // app.verbose:Uint8 - verbose mode (0: no verbose, 1: verbose, 2: verbose verbose)
    this.userAgent = UserAgent();   // app.userAgent:Object|null
  }
  init(fn) {
    if (this.debug) {
      GlobalObject.app = this;      // publish. window.app = app;
    }
    if (this.userAgent.browser) {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }
}

export let app = new App();


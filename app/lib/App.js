// --- technical terms / data structures -------------------
// App.js             - https://github.com/uupaa/WebApp2/wiki/App.js
// GlobalObject Idiom - https://github.com/uupaa/WebApp2/wiki/GlobalObject-Idiom

// --- dependency modules ----------------------------------
import { UserAgent } from "../assets/modules/UserAgent.js";

// --- define / local variables ----------------------------
const GlobalObject = (typeof self !== "undefined") ? self : global;

// --- class / interfaces ----------------------------------
class App {
  constructor() {
    GlobalObject.WebApp2 = { app: null };
    this.module = new Map();                // app.module:Map
    this.global = { object: GlobalObject }; // app.global:Map
    this.debug  = 0;                        // app.debug:Uint8 - debug mode (0: no debug, 1: publish app, 2: type assert)
    this.verbose = 0;                       // app.verbose:Uint8 - verbose mode (0: no verbose, 1: verbose, 2: verbose verbose)
    this.userAgent = UserAgent.detect();    // app.userAgent:Object
  }
  init(fn) {
    if (this.debug) {
      GlobalObject.WebApp2.app = this;      // publish app namespace to window.WebApp2.app
    }
    if (this.userAgent.browser) {
      document.onreadystatechange = () => {
        if (/interactive|complete/.test(document.readyState)) { // DOMContentLoaded or window.onload timming
          document.onreadystatechange = null;
          fn();
        }
      };
    } else {
      fn();
    }
  }
}

export let app = new App();


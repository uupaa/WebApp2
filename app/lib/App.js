// --- technical terms / data structures -------------------
// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
import { AppGlobal } from "./AppGlobal.js";
import { UserAgent } from "./modules/UserAgent.js";

AppGlobal.flags.set({ debug: 2, verbose: 2 });
AppGlobal.env.ua = new UserAgent();

// --- class / interfaces ----------------------------------
// --- implements ------------------------------------------
// --- exports ---------------------------------------------
console.log("Hello WebApp/2");
console.log(AppGlobal.env.ua.USER_AGENT);


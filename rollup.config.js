import resolve from "rollup-plugin-node-resolve"; // resolve node_modules/index.js to ES6
import commonjs from "rollup-plugin-commonjs";    // convert CommonJS -> ES6
import buble from "rollup-plugin-buble";          // convert ES6 -> ES5
import license from "rollup-plugin-license";      // add License header
import path from "path";

// ES6+ESModules -> ES6 bundle
export default {
  format: "es",
  entry: "app/lib/AppMain.js",
  dest: "app/bundle.js",
  plugins: [
  //resolve({ jsnext: true }),
  //commonjs(),
  //buble(), // ES6 -> ES5
    license({
      banner: "Copyright 2017 @uupaa",
      //thirdParty: {
      //  output: path.join(__dirname, "dependencies.txt"),
      //  includePrivate: true, // Default is false.
      //},
    }),
  ],
  intro: "",
  outro: "",
  banner: "if (typeof WebApp2 === \"undefined\") { // avoid duplicate running",
  footer: "}",
}

// ES6+ESModules + node_modules(CommonJS) -> ES6+ESModules -> ES5 bundle
/*
export default {
  format: "iife", // wrap (function(){ code })();
  entry: "app/lib/AppMain.js",
  dest: "app/bundle.js",
  plugins: [
    resolve({ jsnext: true }),
    commonjs(),
    buble(),
    license({
      banner: "Copyright 2017 @uupaa",
      //thirdParty: {
      //  output: path.join(__dirname, "dependencies.txt"),
      //  includePrivate: true, // Default is false.
      //},
    }),
  ],
  intro: "",
  outro: "",
  banner: "if (typeof WebApp2 === \"undefined\") { // avoid duplicate running",
  footer: "}",
}
 */


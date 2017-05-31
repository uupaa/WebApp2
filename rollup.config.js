import resolve from 'rollup-plugin-node-resolve';
import commonjs from "rollup-plugin-commonjs";
import buble from "rollup-plugin-buble";
import license from "rollup-plugin-license";
//import path from "path";

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


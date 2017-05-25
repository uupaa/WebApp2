// The MIT License (MIT) Copyright (c) 2017 uupaa
//
// --- technical terms / data structures -------------------
// app.userAgent         - https://github.com/uupaa/WebApp2/wiki/app.userAgent
// Microsoft Edge        - https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
// Firefox               - https://developer.mozilla.org/ja/docs/Gecko_user_agent_string_reference
// WebView               - https://developer.chrome.com/multidevice/user-agent#webview_user_agent
//                       - https://developer.chrome.com/multidevice/webview/overview#does_the_new_webview_have_feature_parity_with_chrome_for_android_
// Kindle Silk           - http://docs.aws.amazon.com/silk/latest/developerguide/user-agent.html

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
const GlobalObject = (this || 0).self || (typeof self !== "undefined") ? self : global;

// --- class / interfaces ----------------------------------
export function UserAgent(userAgent,      // @arg String = navigator.userAgent
                          options = {}) { // @arg Object = {} - { webView, displayDPR, displayLong, displayShort }
                                          // @options.webView Boolean = false
                                          // @options.displayDPR Number = window.devicePixelRatio || 1.0
                                          // @options.displayLong Number = Math.max(screenWidth, screenHeight)
                                          // @options.displayShort Number = Math.min(screenWidth, screenHeight)
                                          // @ret Object
  // --- Runtime Detection ---
  const hasGlobal       = !!(GlobalObject.global);              // Node.js, NW.js, Electron
  const processType     = !!((GlobalObject.process || 0).type); // Electron(render or main)
  const nativeTimer     = !!(/native/.test(setTimeout));        // Node.js, Electron(main)
  const worker          = !hasGlobal && ("WorkerLocation" in GlobalObject);      // Worker
  const browser         = !hasGlobal && !worker && ("document" in GlobalObject); // Browser
  const node            =  hasGlobal && !processType && !nativeTimer;            // Node.js
  const nw              =  hasGlobal && !processType &&  nativeTimer;            // NW.js
  const electron        =  hasGlobal &&  processType;                            // Electron(render or main)

  // --- UserAgent Detection ---
  const nav             = GlobalObject["navigator"] || {};
  const ua              = userAgent || nav["userAgent"] || "";
  const osName          = _detectOSName(ua);
  const osVersion       = _detectOSVersion(ua, osName);
  const browserName     = _detectBrowserName(ua);
  const browserVersion  = _detectBrowserVersion(ua, browserName);
  const baseBrowser     = _detectBaseBrowser(browserName, parseFloat(osVersion));
  const gl              = _detectWebGL(browser || nw || electron);
  const deviceName      = _detectDevice(ua, osName, osVersion, gl, options);
  const lang            = _detectLanguage(nav);
  const mobile          = (/Android|iOS/.test(osName) || /Windows Phone/.test(ua));
  const iOS             = osName === "iOS";
  const android         = osName === "Android";
  const webView         = _isWebView(ua, osName, browserName, browserVersion, options);
  const touch3D         = /^(iPhone 6s|iPhone 7)/.test(deviceName) ||
                          parseFloat(osVersion) >= 10 && /^iPad Pro/.test(deviceName);
  const esVersion       = /native/.test(String["raw"]  + "") ? 6 :
                          /native/.test(Object["keys"] + "") ? 5 : 3;
  const result = {
    // --- OS ---
    ios:                iOS,                        // is iOS.      (iPhone, iPad, iPod)
    mac:                osName === "Mac",           // is macOS.
    android:            android,                    // is Android.
    windows:            osName === "Windows",       // is Windows.  (Windows, WindowsPhone)
    osName:             osName,                     // OS Name.        "iOS", "Mac", "Android", "Windows", "Firefox", "Chrome OS", ""
    osVersion:          osVersion,                  // Semver String.  "{{Major}},{{Minor}},{{Patch}}"
    // --- Browser ---
    ie:                 browserName === "IE",       // is IE
    edge:               browserName === "Edge",     // is Edge
    firefox:            browserName === "Firefox",  // is Firefox
    chrome:             browserName === "Chrome",   // is Chrome
    safari:             browserName === "Safari",   // is Safari
    silk:               browserName === "Silk",     // is Kindle Silk Browser. (WebKit or Chromium based browser)
    aosp:               browserName === "AOSP",     // is AOSP Stock Browser. (WebKit based browser)
    webkit:             baseBrowser === "WebKit",   // is WebKit based browser
    chromium:           baseBrowser === "Chromium", // is Chromium based browser
    baseBrowser:        baseBrowser,                // Base Name.      "Chromium", "Firefox", "IE", "Edge", "WebKit"
    browserName:        browserName,                // Browser Name.   "Chrome", "Firefox", "IE", "Edge", "AOSP", "Safari", "WebKit", "Chrome for iOS", "Silk", ""
    browserVersion:     browserVersion,             // Semver String.  "{{Major}},{{Minor}},{{Patch}}"
    // --- Runtime ---
    pc:                !mobile,                     // is PC.          Windows, Mac, Chrome OS
    mobile:             mobile,                     // is Mobile.      Android, iOS, WindowsPhone
    browser:            browser,                    // Browser
    worker:             worker,                     // Worker
    node:               node,                       // Node.js
    nw:                 nw,                         // NW.js
    electron:           electron,                   // Electron(render or main)
    // --- Device ---
    ipod:               iOS && /iPod/.test(ua),     // is iPod
    ipad:               iOS && /iPad/.test(ua),     // is iPad
    iphone:             iOS && /iPhone/.test(ua),   // is iPhone
    kindle:             browserName === "Silk",     // is Kindle
    deviceName:         deviceName,                 // Device name String.
    touch3D:            touch3D,                    // Device has 3D touch function.
    // --- WebView ---
    webView:            webView,                    // is WebView.
    // --- WebGL ---
    gl:                 gl,                         // WebGL info. { type:String, version:String, vendor:String, renderer:String, maxTextureSize:UINT32 }
    // --- Other ---
    userAgent:          ua,                         // UserAgent String.
    language:           lang,                       // Language String. "en", "ja", ...
    esVersion:          esVersion,                  // ECMAScript Version. 3 or 5 or 6
    has:                function(k) { return typeof this[k] !== "undefined"; }, // has(key:String):Boolean
    get:                function(k) { return this[k]; }, // get(key:String):Any
  };
  return result;
}

// --- implements ------------------------------------------
function _detectLanguage(nav) {
  let lang = nav["language"] || "en";

  if (nav["languages"] && Array.isArray(nav["languages"])) {
    lang = nav["languages"][0] || lang;
  }
  return lang.split("-")[0]; // "en-us" -> "en"
}

function _detectOSName(ua) {
  switch (true) {
  case /Android/.test(ua):            return "Android";
  case /iPhone|iPad|iPod/.test(ua):   return "iOS";
  case /Windows/.test(ua):            return "Windows";
  case /Mac OS X/.test(ua):           return "Mac";
  case /CrOS/.test(ua):               return "Chrome OS";
  case /Firefox/.test(ua):            return "Firefox OS";
  }
  return "";
}

function _detectOSVersion(ua, osName) {
  switch (osName) {
  case "Android":                     return _getVersion(ua, "Android");
  case "iOS":                         return _getVersion(ua, /OS /);
  case "Windows":                     return _getVersion(ua, /Phone/.test(ua) ? /Windows Phone (?:OS )?/
                                                                              : /Windows NT/);
  case "Mac":                         return _getVersion(ua, /Mac OS X /);
  }
  return "0.0.0";
}

function _detectBrowserName(ua) {
  const android = /Android/.test(ua);

  switch (true) {
  case /CriOS/.test(ua):              return "Chrome for iOS"; // https://developer.chrome.com/multidevice/user-agent
  case /Edge/.test(ua):               return "Edge";
  case android && /Silk\//.test(ua):  return "Silk"; // Kidle Silk browser
  case /Chrome/.test(ua):             return "Chrome";
  case /Firefox/.test(ua):            return "Firefox";
  case android:                       return "AOSP"; // AOSP stock browser
  case /MSIE|Trident/.test(ua):       return "IE";
  case /Safari\//.test(ua):           return "Safari";
  case /AppleWebKit/.test(ua):        return "WebKit";
  }
  return "";
}

function _detectBrowserVersion(ua, browserName) {
  switch (browserName) {
  case "Chrome for iOS":              return _getVersion(ua, "CriOS/");
  case "Edge":                        return _getVersion(ua, "Edge/");
  case "Chrome":                      return _getVersion(ua, "Chrome/");
  case "Firefox":                     return _getVersion(ua, "Firefox/");
  case "Silk":                        return _getVersion(ua, "Silk/");
  case "AOSP":                        return _getVersion(ua, "Version/");
  case "IE":                          return /IEMobile/.test(ua) ? _getVersion(ua, "IEMobile/")
                                           : /MSIE/.test(ua)     ? _getVersion(ua, "MSIE ") // IE 10
                                                                 : _getVersion(ua, "rv:");  // IE 11
  case "Safari":                      return _getVersion(ua, "Version/");
  case "WebKit":                      return _getVersion(ua, "WebKit/");
  }
  return "0.0.0";
}

const BASE_BROWSERS = {
    "Chrome":           "Chromium",
    "Firefox":          "Firefox",
    "IE":               "IE",
    "Edge":             "Edge",
    "AOSP":             "WebKit",
    "Safari":           "WebKit",
    "WebKit":           "WebKit",
    "Chrome for iOS":   "WebKit",
    "Silk":             "WebKit", // or "Chromium" if version >= 4.4
};

function _detectBaseBrowser(browserName, osVer) {
  if (browserName === "Silk" && osVer >= 4.4) {
    return "Chromium";
  }
  return BASE_BROWSERS[browserName] || "";
}

function _detectDevice(ua, osName, osVersion, gl, options) {
  const screen        = GlobalObject["screen"] || {};
  const screenWidth   = screen["width"]  || 0;
  const screenHeight  = screen["height"] || 0;
  const dpr           = options["displayDPR"]   || GlobalObject["devicePixelRatio"] || 1.0;
  const long_         = options["displayLong"]  || Math.max(screenWidth, screenHeight);
  const short_        = options["displayShort"] || Math.min(screenWidth, screenHeight);
  const retina        = dpr >= 2;
  const longEdge      = Math.max(long_, short_); // iPhone 4s: 480, iPhone 5: 568

  switch (osName) {
  case "Android": return _getAndroidDevice(ua, retina);
  case "iOS":     return _getiOSDevice(ua, retina, longEdge, osVersion, gl);
  }
  return "";
}

function _getAndroidDevice(ua, retina) {
  if (/Firefox/.test(ua)) { return ""; } // exit Firefox for Android
  try {
    const result = ua.split("Build/")[0].split(";").slice(-1).join().trim().
                   replace(/^SonyEricsson/, "").
                   replace(/^Sony/, "").replace(/ 4G$/, "");
    if (result === "Nexus 7") {
        return retina ? "Nexus 7 (2013)" // Nexus 7 (2013)
                      : "Nexus 7";       // Nexus 7 (2012)
    }
    return result;
  } catch ( o__o ) {
    // ignore
  }
  return "";
}

function _getiOSDevice(ua, retina, longEdge, osVersion, gl) {
  // https://github.com/uupaa/WebGLDetector.js/wiki/Examples
  // https://developer.apple.com/library/content/documentation/DeviceInformation/Reference/iOSDeviceCompatibility/HardwareGPUInformation/HardwareGPUInformation.html
  const glRenderer = gl.renderer + " " + gl.version;
//const SGX535     = /535/.test(glRenderer);         // iPhone 3GS, iPhone 4
  const SGX543     = /543/.test(glRenderer);         // iPhone 4s/5/5c, iPad 2/3, iPad mini
  const SGX554     = /554/.test(glRenderer);         // iPad 4
  const A7         = /A7 /.test(glRenderer);         // iPhone 5s, iPad mini 2/3, iPad Air
  const A8X        = /A8X/.test(glRenderer);         // A8X: iPad Air 2
  const A8         = /A8 /.test(glRenderer);         // A8:  iPhone 6/6+, iPad mini 4, iPod touch 6
  const A9X        = /A9X/.test(glRenderer);         // A9X: iPad Pro, iPad Pro 9.7
  const A9         = /A9 /.test(glRenderer);         // A9:  iPhone 6s/6s+/SE, iPad 5
  const A10        = /A10/.test(glRenderer);         // A10: iPhone 7/7+
//const Metal      = /Metal/.test(glRenderer);       // A10: iPhone 7/7+
  const simulator  = /Software/.test(glRenderer);    // Simulator: "Apple Software Renderer"

  //
  // | UserAgent#device             | zoomed | longEdge | width x height |
  // |------------------------------|--------|----------|----------------|
  // | iPhone 3/3GS                 |        | 480      |   320 x 480    |
  // | iPhone 4/4s/5/5c/5s/SE       |        | 568      |   320 x 568    |
  // | iPhone 6/6s/7                | YES    | 568      |   320 x 568    |
  // | iPhone 6/6s/7                |        | 667      |   375 x 667    |
  // | iPhone 6+/6s+/7+             | YES    | 667      |   375 x 667    |
  // | iPhone 6+/6s+/7+             |        | 736      |   414 x 736    |
  // | iPad 1/2/mini                |        | 1024     |   768 x 1024   |
  // | iPad 3/4/5/Air/mini2/Pro 9.7 |        | 1024     |   768 x 1024   |
  // | iPad Pro                     |        | 1366     |  1024 x 1366   |

  if (/iPhone/.test(ua)) {

    // | UserAgent#device | zoomed | detected device width x height |
    // |------------------|--------|--------------------------------|
    // | "iPhone 6"       | YES    | iPhone 6  (320 x 568)          |
    // | "iPhone 6s"      | YES    | iPhone 6s (320 x 568)          |
    // | "iPhone 7"       | YES    | iPhone 7  (320 x 568)          |
    // | "iPhone 6 Plus"  | YES    | iPhone 6  (375 x 667) [!]      |
    // | "iPhone 6s Plus" | YES    | iPhone 6s (375 x 667)          |
    // | "iPhone 7 Plus"  | YES    | iPhone 7  (375 x 667) [!]      |
    if (simulator) {
      return "iPhone Simulator";
    }
    return !retina         ? "iPhone 3GS"
         : longEdge <= 480 ? (SGX543 || osVersion >= 8 ? "iPhone 4s" : "iPhone 4") // iPhone 4 stopped in iOS 7.
         : longEdge <= 568 ? (A10    ? "iPhone 7"   :            // iPhone 7  (zoomed)
                              A9     ? "iPhone SE"  :            // iPhone 6s (zoomed) or iPhone SE [!!]
                              A8     ? "iPhone 6"   :            // iPhone 6  (zoomed)
                              A7     ? "iPhone 5s"  :            // iPhone 5s
                              SGX543 ? "iPhone 5"                // iPhone 5   or iPhone 5c
                                     : "iPhone x")               // Unknown device
         : longEdge <= 667 ? (A10    ? "iPhone 7"   :            // iPhone 7   or iPhone 7+  (zoomed)
                              A9     ? "iPhone 6s"  :            // iPhone 6s  or iPhone 6s+ (zoomed)
                              A8     ? "iPhone 6"                // iPhone 6   or iPhone 6+  (zoomed)
                                     : "iPhone x")               // Unknown device
         : longEdge <= 736 ? (A10    ? "iPhone 7 Plus"  :        // iPhone 7+
                              A9     ? "iPhone 6s Plus" :        // iPhone 6s+
                              A8     ? "iPhone 6 Plus"           // iPhone 6+
                                     : "iPhone x")               // Unknown device (maybe new iPhone)
         : "iPhone x";
  } else if (/iPad/.test(ua)) {
    if (simulator) {
        return "iPad Simulator";
    }
    return !retina         ? "iPad 2" // iPad 1/2, iPad mini
         : SGX543          ? "iPad 3"
         : SGX554          ? "iPad 4"
         : A7              ? "iPad mini 2" // iPad mini 3, iPad Air
         : A8X             ? "iPad Air 2"
         : A8              ? "iPad mini 4"
         : A9X             ? (longEdge <= 1024 ? "iPad Pro 9.7" : "iPad Pro")
         : A9              ? "iPad 5"
                           : "iPad x"; // Unknown device (maybe new iPad)
  } else if (/iPod/.test(ua)) {
    if (simulator) {
      return "iPod Simulator";
    }
    return longEdge <= 480 ? (retina ? "iPod touch 4" : "iPod touch 3")
                           : (A8     ? "iPod touch 6" : "iPod touch 5");
  }
  return "iPhone x";
}

function _getVersion(ua, token) { // @ret SemverString - "0.0.0"
  try {
    return _normalizeSemverString( ua.split(token)[1].trim().split(/[^\w\.]/)[0] );
  } catch ( o_O ) {
    // ignore
  }
  return "0.0.0";
}

function _normalizeSemverString(version) { // @arg String - "Major.Minor.Patch"
                                           // @ret SemverString - "Major.Minor.Patch"
  let ary = version.split(/[\._]/); // "1_2_3" -> ["1", "2", "3"]
                                    // "1.2.3" -> ["1", "2", "3"]
  return ( parseInt(ary[0], 10) || 0 ) + "." +
         ( parseInt(ary[1], 10) || 0 ) + "." +
         ( parseInt(ary[2], 10) || 0 );
}

function _isWebView(ua, osName, browserName, version, options) { // @ret Boolean - is WebView
  switch (osName + browserName) {
  case "iOSSafari":       return false;
  case "iOSWebKit":       return _isWebView_iOS(options);
  case "AndroidAOSP":     return false; // can not accurately detect
  case "AndroidChrome":   return parseFloat(version) >= 42 ? /; wv/.test(ua)
                               : /\d{2}\.0\.0/.test(version) ? true // 40.0.0, 37.0.0, 36.0.0, 33.0.0, 30.0.0
                               : _isWebView_Android(options);
  }
  return false;
}

function _isWebView_iOS(options) { // @arg Object - { webView }
                                   // @ret Boolean
  // Chrome 15++, Safari 5.1++, IE11, Edge, Firefox10++
  // Android 5.0 ChromeWebView 30: webkitFullscreenEnabled === false
  // Android 5.0 ChromeWebView 33: webkitFullscreenEnabled === false
  // Android 5.0 ChromeWebView 36: webkitFullscreenEnabled === false
  // Android 5.0 ChromeWebView 37: webkitFullscreenEnabled === false
  // Android 5.0 ChromeWebView 40: webkitFullscreenEnabled === false
  // Android 5.0 ChromeWebView 42: webkitFullscreenEnabled === ?
  // Android 5.0 ChromeWebView 44: webkitFullscreenEnabled === true
  let document = (GlobalObject["document"] || {});

  if ("webView" in options) {
    return options["webView"];
  }
  return !("fullscreenEnabled"       in document ||
           "webkitFullscreenEnabled" in document || false);
}

function _isWebView_Android(options) { // @arg Object - { webView }
  // Chrome 8++
  // Android 5.0 ChromeWebView 30: webkitRequestFileSystem === false
  // Android 5.0 ChromeWebView 33: webkitRequestFileSystem === false
  // Android 5.0 ChromeWebView 36: webkitRequestFileSystem === false
  // Android 5.0 ChromeWebView 37: webkitRequestFileSystem === false
  // Android 5.0 ChromeWebView 40: webkitRequestFileSystem === false
  // Android 5.0 ChromeWebView 42: webkitRequestFileSystem === false
  // Android 5.0 ChromeWebView 44: webkitRequestFileSystem === false
  if ("webView" in options) {
    return options["webView"];
  }
  return !("requestFileSystem"       in GlobalObject ||
           "webkitRequestFileSystem" in GlobalObject || false);
}

function _detectWebGL(hasCanvas) { // @arg Boolean - browser or nw or electron
                                   // @ret Object - { type, version, vendor, renderer, maxTextureSize }
  let result = {
    type:           "", // WebGL context type.    "webgl" or "webgl2" or "experimental-webgl", ...
    version:        "", // WebGL version string.  "WebGL 1.0 (OpenGL ES 2.0 Chromium)"
    vendor:         "", // WebGL vendor string.   "WebKit"
    renderer:       "", // WebGL renderer string. "WebKit WebGL"
    maxTextureSize: 0,  // MAX_TEXTURE_SIZE (0 or 1024 - 16384)
  };

  if (hasCanvas) {
    let canvas = document.createElement("canvas");

    if (canvas && canvas.getContext) {
      var types = ["webgl2", "experimental-webgl2", "webgl", "experimental-webgl"];

      for (let i = 0, iz = types.length; i < iz; ++i) {
        let type = types[i];
        let gl = canvas.getContext(type);

        if (gl) {
          result.type           = type;
          result.version        = gl.getParameter(gl.VERSION);
          result.vendor         = gl.getParameter(gl.VENDOR);
          result.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

          var info = gl.getExtension("WEBGL_debug_renderer_info");
          if (info) {
            result.vendor   = gl.getParameter(info.UNMASKED_VENDOR_WEBGL);
            result.renderer = gl.getParameter(info.UNMASKED_RENDERER_WEBGL);
          }
          break;
        }
      }
    }
  }
  return result;
}


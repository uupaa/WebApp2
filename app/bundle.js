/**
 * Copyright 2017 @uupaa
 */

if (typeof WebApp2 === "undefined") { // avoid duplicate running
(function () {
'use strict';

var GlobalObject$1 = (typeof self !== "undefined") ? self : global;
var UserAgent = function UserAgent () {};
UserAgent.detect = function detect (userAgent, options) {
    if ( options === void 0 ) options = {};
  return _detectUserAgent(userAgent, options);
};
function _detectUserAgent(userAgent,
                          options) {
  var hasGlobal       = !!(GlobalObject$1.global);
  var processType     = !!((GlobalObject$1.process || 0).type);
  var nativeTimer     = !!(/native/.test(setTimeout));
  var worker          = !hasGlobal && ("WorkerLocation" in GlobalObject$1);
  var browser         = !hasGlobal && !worker && ("document" in GlobalObject$1);
  var node            =  hasGlobal && !processType && !nativeTimer;
  var nw              =  hasGlobal && !processType &&  nativeTimer;
  var electron        =  hasGlobal &&  processType;
  var nav             = GlobalObject$1["navigator"] || {};
  var ua              = userAgent || nav["userAgent"] || "";
  var osName          = _detectOSName(ua);
  var osVersion       = _detectOSVersion(ua, osName);
  var browserName     = _detectBrowserName(ua);
  var browserVersion  = _detectBrowserVersion(ua, browserName);
  var baseBrowser     = _detectBaseBrowser(browserName, parseFloat(osVersion));
  var gl              = _detectWebGL(browser || nw || electron);
  var deviceName      = _detectDevice(ua, osName, osVersion, gl, options);
  var lang            = _detectLanguage(nav);
  var mobile          = (/Android|iOS/.test(osName) || /Windows Phone/.test(ua));
  var iOS             = osName === "iOS";
  var android         = osName === "Android";
  var webView         = _isWebView(ua, osName, browserName, browserVersion, options);
  var touch3D         = /^(iPhone 6s|iPhone 7)/.test(deviceName) ||
                          parseFloat(osVersion) >= 10 && /^iPad Pro/.test(deviceName);
  var esVersion       = /native/.test(String["raw"]  + "") ? 6 :
                          /native/.test(Object["keys"] + "") ? 5 : 3;
  var result = {
    ios:                iOS,
    mac:                osName === "Mac",
    android:            android,
    windows:            osName === "Windows",
    osName:             osName,
    osVersion:          osVersion,
    ie:                 browserName === "IE",
    edge:               browserName === "Edge",
    firefox:            browserName === "Firefox",
    chrome:             browserName === "Chrome",
    safari:             browserName === "Safari",
    silk:               browserName === "Silk",
    aosp:               browserName === "AOSP",
    webkit:             baseBrowser === "WebKit",
    chromium:           baseBrowser === "Chromium",
    baseBrowser:        baseBrowser,
    browserName:        browserName,
    browserVersion:     browserVersion,
    pc:                !mobile,
    mobile:             mobile,
    browser:            browser,
    worker:             worker,
    node:               node,
    nw:                 nw,
    electron:           electron,
    ipod:               iOS && /iPod/.test(ua),
    ipad:               iOS && /iPad/.test(ua),
    iphone:             iOS && /iPhone/.test(ua),
    kindle:             browserName === "Silk",
    deviceName:         deviceName,
    touch3D:            touch3D,
    webView:            webView,
    gl:                 gl,
    userAgent:          ua,
    language:           lang,
    esVersion:          esVersion,
    has:                function(key) { return typeof this[key] !== "undefined"; },
    get:                function(key) { return this[key]; },
  };
  return result;
}
function _detectLanguage(nav) {
  var lang = nav["language"] || "en";
  if (nav["languages"] && Array.isArray(nav["languages"])) {
    lang = nav["languages"][0] || lang;
  }
  return lang.split("-")[0];
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
  var android = /Android/.test(ua);
  switch (true) {
  case /CriOS/.test(ua):              return "Chrome for iOS";
  case /Edge/.test(ua):               return "Edge";
  case android && /Silk\//.test(ua):  return "Silk";
  case /Chrome/.test(ua):             return "Chrome";
  case /Firefox/.test(ua):            return "Firefox";
  case android:                       return "AOSP";
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
                                           : /MSIE/.test(ua)     ? _getVersion(ua, "MSIE ")
                                                                 : _getVersion(ua, "rv:");
  case "Safari":                      return _getVersion(ua, "Version/");
  case "WebKit":                      return _getVersion(ua, "WebKit/");
  }
  return "0.0.0";
}
var BASE_BROWSERS = {
  "Chrome":           "Chromium",
  "Firefox":          "Firefox",
  "IE":               "IE",
  "Edge":             "Edge",
  "AOSP":             "WebKit",
  "Safari":           "WebKit",
  "WebKit":           "WebKit",
  "Chrome for iOS":   "WebKit",
  "Silk":             "WebKit",
};
function _detectBaseBrowser(browserName, osVer) {
  if (browserName === "Silk" && osVer >= 4.4) {
    return "Chromium";
  }
  return BASE_BROWSERS[browserName] || "";
}
function _detectDevice(ua, osName, osVersion, gl, options) {
  var screen        = GlobalObject$1["screen"] || {};
  var screenWidth   = screen["width"]  || 0;
  var screenHeight  = screen["height"] || 0;
  var dpr           = options["displayDPR"]   || GlobalObject$1["devicePixelRatio"] || 1.0;
  var long_         = options["displayLong"]  || Math.max(screenWidth, screenHeight);
  var short_        = options["displayShort"] || Math.min(screenWidth, screenHeight);
  var retina        = dpr >= 2;
  var longEdge      = Math.max(long_, short_);
  switch (osName) {
  case "Android": return _getAndroidDevice(ua, retina);
  case "iOS":     return _getiOSDevice(ua, retina, longEdge, osVersion, gl);
  }
  return "";
}
function _getAndroidDevice(ua, retina) {
  if (/Firefox/.test(ua)) { return ""; }
  try {
    var result = ua.split("Build/")[0].split(";").slice(-1).join().trim().
                   replace(/^SonyEricsson/, "").
                   replace(/^Sony/, "").replace(/ 4G$/, "");
    if (result === "Nexus 7") {
        return retina ? "Nexus 7 (2013)"
                      : "Nexus 7";
    }
    return result;
  } catch ( o__o ) {
  }
  return "";
}
function _getiOSDevice(ua, retina, longEdge, osVersion, gl) {
  var glRenderer = gl.renderer + " " + gl.version;
  var simulator  = /Software/.test(glRenderer);
  var A10X       = /A10X GPU/.test(glRenderer);
  var A10        = /A10 GPU/.test(glRenderer);
  var A9X        = /A9X GPU/.test(glRenderer);
  var A9         = /A9 GPU/.test(glRenderer);
  var A8X        = /A8X GPU/.test(glRenderer);
  var A8         = /A8 GPU/.test(glRenderer);
  var A7         = /A7 GPU/.test(glRenderer);
  var SGX554     = /554/.test(glRenderer);
  var SGX543     = /543/.test(glRenderer);
  if (/iPhone/.test(ua)) {
    if (simulator) {
      return "iPhone Simulator";
    }
    return !retina         ? "iPhone 3GS"
         : longEdge <= 480 ? (SGX543 || osVersion >= 8 ? "iPhone 4s" : "iPhone 4")
         : longEdge <= 568 ? (A10    ? "iPhone 7"   :
                              A9     ? "iPhone SE"  :
                              A8     ? "iPhone 6"   :
                              A7     ? "iPhone 5s"  :
                              SGX543 ? "iPhone 5"
                                     : "iPhone x")
         : longEdge <= 667 ? (A10    ? "iPhone 7"   :
                              A9     ? "iPhone 6s"  :
                              A8     ? "iPhone 6"
                                     : "iPhone x")
         : longEdge <= 736 ? (A10    ? "iPhone 7 Plus"  :
                              A9     ? "iPhone 6s Plus" :
                              A8     ? "iPhone 6 Plus"
                                     : "iPhone x")
         : "iPhone x";
  } else if (/iPad/.test(ua)) {
    if (simulator) {
        return "iPad Simulator";
    }
    return !retina         ? "iPad 2"
         : SGX543          ? "iPad 3"
         : SGX554          ? "iPad 4"
         : A7              ? "iPad mini 2"
         : A8X             ? "iPad Air 2"
         : A8              ? "iPad mini 4"
         : A9X             ? (longEdge <= 1024 ? "iPad Pro 9.7" : "iPad Pro 12.9")
         : A9              ? "iPad 5"
         : A10X            ? (longEdge <= 1112 ? "iPad Pro 10.5" : "iPad Pro 12.9")
                           : "iPad x";
  } else if (/iPod/.test(ua)) {
    if (simulator) {
      return "iPod Simulator";
    }
    return longEdge <= 480 ? (retina ? "iPod touch 4" : "iPod touch 3")
                           : (A8     ? "iPod touch 6" : "iPod touch 5");
  }
  return "iPhone x";
}
function _getVersion(ua, token) {
  try {
    return _normalizeSemverString( ua.split(token)[1].trim().split(/[^\w\.]/)[0] );
  } catch ( o_O ) {
  }
  return "0.0.0";
}
function _normalizeSemverString(version) {
  var ary = version.split(/[\._]/);
  return ( parseInt(ary[0], 10) || 0 ) + "." +
         ( parseInt(ary[1], 10) || 0 ) + "." +
         ( parseInt(ary[2], 10) || 0 );
}
function _isWebView(ua, osName, browserName, browserVersion, options) {
  switch (osName + browserName) {
  case "iOSSafari":       return false;
  case "iOSWebKit":       return _isWebView_iOS(options);
  case "AndroidAOSP":     return false;
  case "AndroidChrome":   return parseFloat(browserVersion) >= 42 ? /; wv/.test(ua)
                               : /\d{2}\.0\.0/.test(browserVersion) ? true
                               : _isWebView_Android(options);
  }
  return false;
}
function _isWebView_iOS(options) {
  var document = (GlobalObject$1["document"] || {});
  if ("webView" in options) {
    return options["webView"];
  }
  return !("fullscreenEnabled"       in document ||
           "webkitFullscreenEnabled" in document || false);
}
function _isWebView_Android(options) {
  if ("webView" in options) {
    return options["webView"];
  }
  return !("requestFileSystem"       in GlobalObject$1 ||
           "webkitRequestFileSystem" in GlobalObject$1 || false);
}
function _detectWebGL(hasCanvas) {
  var result = {
    type:           "",
    version:        "",
    vendor:         "",
    renderer:       "",
    maxTextureSize: 0,
  };
  if (hasCanvas) {
    var canvas = document.createElement("canvas");
    if (canvas && canvas.getContext) {
      var types = ["webgl2", "experimental-webgl2", "webgl", "experimental-webgl"];
      for (var i = 0, iz = types.length; i < iz; ++i) {
        var type = types[i];
        var gl = canvas.getContext(type);
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

var GlobalObject = (typeof self !== "undefined") ? self : global;
var App = function App() {
  GlobalObject.WebApp2 = { app: null };
  this.module = new Map();
  this.global = { object: GlobalObject };
  this.debug= 0;
  this.verbose = 0;
  this.userAgent = UserAgent.detect();
};
App.prototype.init = function init (fn) {
  if (this.debug) {
    GlobalObject.WebApp2.app = this;
  }
  if (this.userAgent.browser) {
    document.onreadystatechange = function () {
      if (/interactive|complete/.test(document.readyState)) {
        document.onreadystatechange = null;
        fn();
      }
    };
  } else {
    fn();
  }
};
var app = new App();

app.verbose = 2;
app.debug = 2;
app.init(function () {
  console.log("Hello WebApp/2");
});

}());
}

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("BASEAuthSDK", [], factory);
	else if(typeof exports === 'object')
		exports["BASEAuthSDK"] = factory();
	else
		root["BASEAuthSDK"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/sdk.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/core/IFrameRPC.js":
/*!*******************************!*\
  !*** ./src/core/IFrameRPC.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return IFrameRPC; });\nfunction RPCCall(id, methodName, args, resolve) {\n    this.id = id;\n    this.methodName = methodName;\n    this.args = args;\n    this.resolve = resolve;\n}\n\nRPCCall.prototype.send = function (targetWindow, targetOrigin) {\n    targetWindow.postMessage(\n        {\n            rpcCall: {\n                id: this.id,\n                methodName: this.methodName,\n                args: this.args,\n            },\n        },\n        targetOrigin\n    );\n};\n\nRPCCall.prototype.respond = function (targetWindow, targetOrigin, value) {\n    targetWindow.postMessage(\n        {\n            rpcCall: {\n                id: this.id,\n                methodName: this.methodName,\n                args: this.args,\n                value: value,\n            },\n        },\n        targetOrigin\n    );\n};\n\nclass RPCResponse {\n    constructor(event) {\n        this.event = event;\n    }\n\n    get value() {\n        return this.event.data.rpcCall.value;\n    }\n}\n\nfunction IFrameRPC(targetWindow, targetOrigin) {\n    this._targetWindow = targetWindow;\n    this._targetOrigin = targetOrigin;\n    this._calls = {};\n    this._listeners = {};\n    this._currentCallId = 1;\n\n    if (this._targetOrigin !== '*' && this._targetOrigin[this._targetOrigin.length - 1] !== '/') {\n        this._targetOrigin += '/';\n    }\n\n    window.addEventListener('message', this._onMessage.bind(this));\n}\n\nIFrameRPC.prototype.call = function (methodName, args) {\n    return new Promise(function (resolve, reject) {\n        const callId = this._currentCallId++;\n        this._calls[callId] = new RPCCall(callId, methodName, args, resolve);\n        this._calls[callId].send(this._targetWindow, this._targetOrigin);\n    }.bind(this));\n};\n\nIFrameRPC.prototype.listen = function (methodName, handler) {\n    if (!this._listeners[methodName]) {\n        this._listeners[methodName] = [];\n    }\n    this._listeners[methodName].push(handler);\n};\n\nIFrameRPC.prototype.once = function (methodName) {\n    return new Promise(function (resolve, reject) {\n        if (!this._listeners[methodName]) {\n            this._listeners[methodName] = [];\n        }\n\n        const listeners = this._listeners[methodName];\n\n        listeners.push(function (rpcCall) {\n            listeners.splice(listeners.indexOf(this), 1);\n            resolve(rpcCall);\n        });\n    }.bind(this));\n};\n\nIFrameRPC.prototype._onMessage = function (event) {\n    let eventOrigin = event.origin;\n    if (eventOrigin[eventOrigin.length - 1] !== '/') {\n        eventOrigin = event.origin + '/';\n    }\n\n    if (this._targetOrigin !== '*' && eventOrigin !== this._targetOrigin) {\n        return;\n    }\n\n    if (event.source !== this._targetWindow) {\n        return;\n    }\n\n    if (!event.data.rpcCall) {\n        return;\n    }\n\n    const rpcCall = new RPCCall(\n        event.data.rpcCall.id, event.data.rpcCall.methodName, event.data.rpcCall.args\n    );\n    const listeners = this._listeners[event.data.rpcCall.methodName];\n\n    if (listeners) {\n        for (let i = 0, len = listeners.length; i < len; i++) {\n            listeners[i](rpcCall);\n        }\n    }\n\n    if (this._calls[event.data.rpcCall.id]) {\n        this._calls[event.data.rpcCall.id].resolve(new RPCResponse(event));\n        delete this._calls[event.data.rpcCall.id];\n    }\n};\n\n\n//# sourceURL=webpack://BASEAuthSDK/./src/core/IFrameRPC.js?");

/***/ }),

/***/ "./src/sdk.js":
/*!********************!*\
  !*** ./src/sdk.js ***!
  \********************/
/*! exports provided: Widget */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Widget\", function() { return Widget; });\n/* harmony import */ var _core_IFrameRPC_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/IFrameRPC.js */ \"./src/core/IFrameRPC.js\");\n/* harmony import */ var settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! settings */ \"./src/settings/development.js\");\n\n\n\nclass Widget {\n    constructor(options) {\n        this._widgetIframe = null;\n        this._widgetRpc = null;\n        this._baseNodeApi = null;\n        this._verificationMessage = options.verificationMessage;\n\n        if (!this._verificationMessage || this._verificationMessage.length < 10) {\n            throw new Error('Verification message length is 10 characters minimum');\n        }\n    }\n\n    get baseNodeAPI() {\n        return this._baseNodeApi;\n    }\n\n    insertLoginButton(cssSelector) {\n        const iframe = document.createElement('iframe');\n        iframe.src = settings__WEBPACK_IMPORTED_MODULE_1__[\"default\"].widgetUrl() + settings__WEBPACK_IMPORTED_MODULE_1__[\"default\"].widgetLocation();\n        iframe.sandbox = 'allow-scripts allow-popups allow-same-origin allow-forms allow-modals';\n\n        const el = document.querySelector(cssSelector);\n        el.appendChild(iframe);\n        this._widgetIframe = iframe;\n\n        this._widgetRpc = new _core_IFrameRPC_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this._widgetIframe.contentWindow, settings__WEBPACK_IMPORTED_MODULE_1__[\"default\"].widgetUrl());\n        this._widgetRpc.once('handshake').then(rpcCall => {\n            rpcCall.respond(\n                this._widgetIframe.contentWindow,\n                settings__WEBPACK_IMPORTED_MODULE_1__[\"default\"].widgetUrl(),\n                {verificationMessage: this._verificationMessage}\n            );\n            this._baseNodeApi = new BASENodeAPI(this._widgetRpc);\n        });\n    }\n\n    waitForLogin() {\n        return this._widgetRpc.once('onLogin').then(function (rpcCall) {\n            const account = rpcCall.args[0];\n            return account;\n        });\n    }\n}\n\nclass BASENodeAPI {\n    constructor(widgetRpc) {\n        this._widgetRpc = widgetRpc;\n    }\n\n    getAllOffers () {\n        return this._widgetRpc.call('offerManager.getAllOffers', []).then(response => response.value);\n    }\n\n    getData() {\n        return this._widgetRpc.call('profileManager.getData', []).then(response => response.value);\n    }\n\n    updateData(data) {\n        return this._widgetRpc.call('profileManager.updateData', [data]).then(response => response.value);\n    }\n}\n\n\n//# sourceURL=webpack://BASEAuthSDK/./src/sdk.js?");

/***/ }),

/***/ "./src/settings/development.js":
/*!*************************************!*\
  !*** ./src/settings/development.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Settings; });\nclass Settings {\n    static widgetUrl() {\n        return 'http://localhost:8000/';\n    }\n\n    static widgetLocation() {\n        return 'widget/button/';\n    }\n}\n\n\n//# sourceURL=webpack://BASEAuthSDK/./src/settings/development.js?");

/***/ })

/******/ });
});
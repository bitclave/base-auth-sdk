!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("BASEAuthSDK",[],e):"object"==typeof exports?exports.BASEAuthSDK=e():t.BASEAuthSDK=e()}(window,function(){return function(t){var e={};function i(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,i),s.l=!0,s.exports}return i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},i.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";function n(t,e,i,n){this.id=t,this.methodName=e,this.args=i,this.resolve=n}i.r(e),n.prototype.send=function(t,e){t.postMessage({rpcCall:{id:this.id,methodName:this.methodName,args:this.args}},e)},n.prototype.respond=function(t,e,i){t.postMessage({rpcCall:{id:this.id,methodName:this.methodName,args:this.args,value:i}},e)};function s(t,e){this._targetWindow=t,this._targetOrigin=e,this._calls={},this._listeners={},this._currentCallId=1,"*"!==this._targetOrigin&&"/"!==this._targetOrigin[this._targetOrigin.length-1]&&(this._targetOrigin+="/"),window.addEventListener("message",this._onMessage.bind(this))}s.prototype.call=function(t,e){return new Promise(function(i,s){const r=this._currentCallId++;this._calls[r]=new n(r,t,e,i),this._calls[r].send(this._targetWindow,this._targetOrigin)}.bind(this))},s.prototype.listen=function(t,e){this._listeners[t]||(this._listeners[t]=[]),this._listeners[t].push(e)},s.prototype.once=function(t){return new Promise(function(e,i){this._listeners[t]||(this._listeners[t]=[]);const n=this._listeners[t];n.push(function(t){n.splice(n.indexOf(this),1),e(t)})}.bind(this))},s.prototype._onMessage=function(t){let e=t.origin;if("/"!==e[e.length-1]&&(e=t.origin+"/"),"*"!==this._targetOrigin&&e!==this._targetOrigin)return;if(t.source!==this._targetWindow)return;if(!t.data.rpcCall)return;const i=new n(t.data.rpcCall.id,t.data.rpcCall.methodName,t.data.rpcCall.args),s=this._listeners[t.data.rpcCall.methodName];if(s)for(let t=0,e=s.length;t<e;t++)s[t](i);this._calls[t.data.rpcCall.id]&&(this._calls[t.data.rpcCall.id].resolve(new class{constructor(t){this.event=t}get value(){return this.event.data.rpcCall.value}}(t)),delete this._calls[t.data.rpcCall.id])};class r{static widgetUrl(){return"https://base-auth-staging.herokuapp.com/"}static widgetLocation(){return"widget/button/"}}i.d(e,"Widget",function(){return a});class a{constructor(t){if(this._widgetIframe=null,this._widgetRpc=null,this._baseNodeApi=null,this._verificationMessage=t.verificationMessage,!this._verificationMessage||this._verificationMessage.length<10)throw new Error("Verification message length is 10 characters minimum")}get baseNodeAPI(){return this._baseNodeApi}insertLoginButton(t){const e=document.createElement("iframe");e.src=r.widgetUrl()+r.widgetLocation(),e.sandbox="allow-scripts allow-popups allow-same-origin allow-forms allow-modals",document.querySelector(t).appendChild(e),this._widgetIframe=e,this._widgetRpc=new s(this._widgetIframe.contentWindow,r.widgetUrl()),this._widgetRpc.once("handshake").then(t=>{t.respond(this._widgetIframe.contentWindow,r.widgetUrl(),{verificationMessage:this._verificationMessage}),this._baseNodeApi=new o(this._widgetRpc)})}waitForLogin(){return this._widgetRpc.once("onLogin").then(function(t){return t.args[0]})}}class o{constructor(t){this._widgetRpc=t}getAllOffers(){return this._widgetRpc.call("offerManager.getAllOffers",[]).then(t=>t.value)}getData(){return this._widgetRpc.call("profileManager.getData",[]).then(t=>t.value)}updateData(t){return this._widgetRpc.call("profileManager.updateData",[t]).then(t=>t.value)}}}])});
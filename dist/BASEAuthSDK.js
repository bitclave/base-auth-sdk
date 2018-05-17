!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("BASEAuthSDK",[],e):"object"==typeof exports?exports.BASEAuthSDK=e():t.BASEAuthSDK=e()}(window,function(){return function(t){var e={};function i(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:s})},i.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";function s(t,e,i,s){this.id=t,this.methodName=e,this.args=i,this.resolve=s}i.r(e),s.prototype.send=function(t,e){t.postMessage({rpcCall:{id:this.id,methodName:this.methodName,args:this.args}},e)},s.prototype.respond=function(t,e,i){t.postMessage({rpcCall:{id:this.id,methodName:this.methodName,args:this.args,value:i}},e)};function n(t,e){this._targetWindow=t,this._targetOrigin=e,this._calls={},this._listeners={},this._currentCallId=1,"*"!==this._targetOrigin&&"/"!==this._targetOrigin[this._targetOrigin.length-1]&&(this._targetOrigin+="/"),window.addEventListener("message",this._onMessage.bind(this))}n.prototype.call=function(t,e){return new Promise(function(i,n){const r=this._currentCallId++;this._calls[r]=new s(r,t,e,i),this._calls[r].send(this._targetWindow,this._targetOrigin)}.bind(this))},n.prototype.listen=function(t,e){this._listeners[t]||(this._listeners[t]=[]),this._listeners[t].push(e)},n.prototype.once=function(t){return new Promise(function(e,i){this._listeners[t]||(this._listeners[t]=[]);const s=this._listeners[t];s.push(function(t){s.splice(s.indexOf(this),1),e(t)})}.bind(this))},n.prototype._onMessage=function(t){let e=t.origin;if("/"!==e[e.length-1]&&(e=t.origin+"/"),"*"!==this._targetOrigin&&e!==this._targetOrigin)return;if(t.source!==this._targetWindow)return;if(!t.data.rpcCall)return;const i=new s(t.data.rpcCall.id,t.data.rpcCall.methodName,t.data.rpcCall.args),n=this._listeners[t.data.rpcCall.methodName];if(n)for(let t=0,e=n.length;t<e;t++)n[t](i);this._calls[t.data.rpcCall.id]&&(this._calls[t.data.rpcCall.id].resolve(new class{constructor(t){this.event=t}get value(){return this.event.data.rpcCall.value}}(t)),delete this._calls[t.data.rpcCall.id])};class r{constructor(t){t=t||{},this._widgetUrl=t.widgetUrl||"https://base-auth-frontend-staging.herokuapp.com/",this._widgetLocation=t.widgetLocation||"auth/widget","/"!==this._widgetUrl[this._widgetUrl.length-1]&&(this._widgetUrl+="/")}get widgetUrl(){return this._widgetUrl}get widgetLocation(){return this._widgetLocation}}i.d(e,"UserPermissions",function(){return a}),i.d(e,"Widget",function(){return o});const a={EMAIL:"email"};class o{constructor(t){if(this._settings=new r(t),this._widgetIframe=null,this._widgetRpc=null,this._baseNodeApi=null,this._verificationMessage=t.verificationMessage,!this._verificationMessage||this._verificationMessage.length<10)throw new Error("Verification message length is 10 characters minimum")}insertLoginButton(t){const e=document.createElement("iframe");e.frameBorder="0",e.width="300",e.height="48",e.src=this._settings.widgetUrl+this._settings.widgetLocation,e.sandbox="allow-scripts allow-popups allow-same-origin allow-forms allow-modals",document.querySelector(t).appendChild(e),this._widgetIframe=e,this._widgetRpc=new n(this._widgetIframe.contentWindow,this._settings.widgetUrl),this._widgetRpc.once("RPC.handshake").then(t=>{t.respond(this._widgetIframe.contentWindow,this._settings.widgetUrl,{verificationMessage:this._verificationMessage}),this._baseNodeApi=new l(this._widgetRpc)})}waitForLogin(){return this._widgetRpc.once("SDK.onLogin").then(function(t){return t.args[0]}.bind(this))}requestPermissions(t){return this._widgetRpc.call("SDK.requestPermissions",[t]).then(function(t){return t.value})}getAllOffers(){return this._baseNodeApi.getAllOffers()}getData(){return this._baseNodeApi.getData()}updateData(t){return this._baseNodeApi.updateData(t)}}class l{constructor(t){this._widgetRpc=t}getAllOffers(){return this._widgetRpc.call("offerManager.getAllOffers",[]).then(t=>t.value)}getData(){return this._widgetRpc.call("profileManager.getData",[]).then(t=>t.value)}updateData(t){return this._widgetRpc.call("profileManager.updateData",[t]).then(t=>t.value)}}}])});
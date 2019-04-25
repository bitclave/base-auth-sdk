const UNIQUE_SERVICE_NAME = 'base-auth-sdk';

function RPCCall(id, methodName, args, resolve) {
    this.id = id;
    this.methodName = methodName;
    this.args = args;
    this.resolve = resolve;
}

RPCCall.prototype.send = function (targetWindow, targetOrigin) {
    targetWindow.postMessage(
        {
            rpcCall: {
                id: this.id,
                methodName: this.methodName,
                args: this.args,
            },
        },
        targetOrigin
    );
};

RPCCall.prototype.respond = function (targetWindow, targetOrigin, value) {
    targetWindow.postMessage(
        {
            rpcCall: {
                id: this.id,
                methodName: this.methodName,
                args: this.args,
                value: value,
            },
        },
        targetOrigin
    );
};

class RPCResponse {
    constructor(event) {
        this.event = event;
    }

    get value() {
        return this.event.data.rpcCall.value;
    }
}

export default function IFrameRPC(targetWindow, targetOrigin) {
    this._targetWindow = targetWindow;
    this._targetOrigin = targetOrigin;
    this._calls = {};
    this._listeners = {};
    this._currentCallId = 1;

    if (this._targetOrigin !== '*' && this._targetOrigin[this._targetOrigin.length - 1] !== '/') {
        this._targetOrigin += '/';
    }

    window.addEventListener('message', this._onMessage.bind(this));
}

IFrameRPC.prototype.call = function (methodName, args) {
    return new Promise(function (resolve, reject) {
        const callId = UNIQUE_SERVICE_NAME + this._currentCallId++;
        this._calls[callId] = new RPCCall(callId, methodName, args, resolve);
        this._calls[callId].send(this._targetWindow, this._targetOrigin);
    }.bind(this));
};

IFrameRPC.prototype.listen = function (methodName, handler) {
    if (!this._listeners[methodName]) {
        this._listeners[methodName] = [];
    }
    this._listeners[methodName].push(handler);
};

IFrameRPC.prototype.once = function (methodName) {
    return new Promise(function (resolve, reject) {
        if (!this._listeners[methodName]) {
            this._listeners[methodName] = [];
        }

        const listeners = this._listeners[methodName];

        listeners.push(function (rpcCall) {
            listeners.splice(listeners.indexOf(this), 1);
            resolve(rpcCall);
        });
    }.bind(this));
};

IFrameRPC.prototype._onMessage = function (event) {
    let eventOrigin = event.origin;
    if (eventOrigin[eventOrigin.length - 1] !== '/') {
        eventOrigin = event.origin + '/';
    }

    if (this._targetOrigin !== '*' && eventOrigin !== this._targetOrigin) {
        return;
    }

    if (event.source !== this._targetWindow) {
        return;
    }

    if (!event.data.rpcCall) {
        return;
    }

    const rpcCall = new RPCCall(
        event.data.rpcCall.id, event.data.rpcCall.methodName, event.data.rpcCall.args
    );
    const listeners = this._listeners[event.data.rpcCall.methodName];

    if (listeners) {
        for (let i = 0, len = listeners.length; i < len; i++) {
            listeners[i](rpcCall);
        }
    }

    if (this._calls[event.data.rpcCall.id]) {
        this._calls[event.data.rpcCall.id].resolve(new RPCResponse(event));
        delete this._calls[event.data.rpcCall.id];
    }
};

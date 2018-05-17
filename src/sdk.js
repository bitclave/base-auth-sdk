import IFrameRPC from './core/IFrameRPC.js';
import Settings from 'settings';

export const UserPermissions = {
    EMAIL: 'email',
};

export class Widget {
    constructor(options) {
        this._settings = new Settings(options);
        this._widgetIframe = null;
        this._widgetRpc = null;
        this._baseNodeApi = null;
        this._verificationMessage = options.verificationMessage;
        this._isLoggedIn = false;

        if (!this._verificationMessage || this._verificationMessage.length < 10) {
            throw new Error('Verification message length is 10 characters minimum');
        }
    }

    insertLoginButton(cssSelector) {
        const iframe = document.createElement('iframe');
        iframe.frameBorder = '0';
        iframe.width = '300';
        iframe.height = '48';
        iframe.src = this._settings.widgetUrl + this._settings.widgetLocation;
        iframe.sandbox = 'allow-scripts allow-popups allow-same-origin allow-forms allow-modals';

        const el = document.querySelector(cssSelector);
        el.appendChild(iframe);
        this._widgetIframe = iframe;

        this._widgetRpc = new IFrameRPC(this._widgetIframe.contentWindow, this._settings.widgetUrl);
        this._widgetRpc.once('RPC.handshake').then(rpcCall => {
            rpcCall.respond(
                this._widgetIframe.contentWindow,
                this._settings.widgetUrl,
                {verificationMessage: this._verificationMessage}
            );
            this._baseNodeApi = new BASENodeAPI(this._widgetRpc);
        });
    }

    waitForLogin() {
        return this._widgetRpc.once('SDK.onLogin').then(function (rpcCall) {
            this._isLoggedIn = true;
            const account = rpcCall.args[0];
            return account;
        }.bind(this));
    }

    requestPermissions(permissions) {
        if (!this._isLoggedIn) {
            throw new Error('Not authorized');
        }

        return this._widgetRpc.call('SDK.requestPermissions', [permissions]).then(function (response) {
            return response.value;
        });
    }

    getAllOffers() {
        return this._baseNodeApi.getAllOffers();
    }

    getData() {
        return this._baseNodeApi.getData();
    }

    updateData(data) {
        return this._baseNodeApi.updateData(data);
    }
}

class BASENodeAPI {
    constructor(widgetRpc) {
        this._widgetRpc = widgetRpc;
    }

    getAllOffers () {
        if (!this._isLoggedIn) {
            throw new Error('Not authorized');
        }

        return this._widgetRpc.call('offerManager.getAllOffers', []).then(response => response.value);
    }

    getData() {
        if (!this._isLoggedIn) {
            throw new Error('Not authorized');
        }

        return this._widgetRpc.call('profileManager.getData', []).then(response => response.value);
    }

    updateData(data) {
        if (!this._isLoggedIn) {
            throw new Error('Not authorized');
        }

        return this._widgetRpc.call('profileManager.updateData', [data]).then(response => response.value);
    }
}

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
        this._buttonStyle = options.buttonStyle;
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
                {verificationMessage: this._verificationMessage, buttonStyle : this._buttonStyle}
            );
            this._baseNodeApi = new BASENodeAPI(this._widgetRpc);
        });
    }

    waitForLogin() {
        console.warning('"waitForLogin" is deprecated, use "listenForLogin"');
        return this._widgetRpc.once('SDK.onLogin').then(function (rpcCall) {
            const account = rpcCall.args[0];
            return account;
        }.bind(this));
    }

    waitForLogout() {
        console.warning('"waitForLogout" is deprecated, use "listenForLogout"');
        return this._widgetRpc.once('SDK.onLogout').then(function (rpcCall) {
            return null;
        }.bind(this));
    }

    listenForLogin(handler) {
        this._widgetRpc.listen('SDK.onLogin', function (rpcCall) {
            const account = rpcCall.args[0];
            handler(account);
            rpcCall.respond(
                this._widgetIframe.contentWindow,
                this._settings.widgetUrl,
                null
            );
        }.bind(this));
    }

    listenForLogout(handler) {
        this._widgetRpc.listen('SDK.onLogout', function (rpcCall) {
            handler();
            rpcCall.respond(
                this._widgetIframe.contentWindow,
                this._settings.widgetUrl,
                null
            );
        }.bind(this));
    }

    requestPermissions(permissions) {
        return this._widgetRpc.call('SDK.requestPermissions', [permissions]).then(function (response) {
            return response.value;
        });
    }
    openDashboard() {
        return this._widgetRpc.call('SDK.openDashboard', []);
    }

    getAllOffers() {
        return this._baseNodeApi.getAllOffers();
    }

    deleteAccount() {
        return this._baseNodeApi.deleteAccount();
    }
    logout() {
      return this._baseNodeApi.logout();
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
        return this._widgetRpc.call('offerManager.getAllOffers', []).then(response => response.value);
    }

    deleteAccount () {
        return this._widgetRpc.call('accountManager.unsubscribe', []).then(response => response.value);
    }
    logout () {
        return this._widgetRpc.call('logout', []);
    }

    getData() {
        return this._widgetRpc.call('profileManager.getData', []).then(response => response.value);
    }

    updateData(data) {
        return this._widgetRpc.call('profileManager.updateData', [data]).then(response => response.value);
    }
}

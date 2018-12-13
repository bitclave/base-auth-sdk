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
        this._isMnemonicScreen = (options.isMnemonicScreen === undefined || !! options.isMnemonicScreen);
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
                { verificationMessage: this._verificationMessage,
                  buttonStyle : this._buttonStyle,
                  isMnemonicScreen: this._isMnemonicScreen
                }
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

    addWealthValidator(data) {
        return this._baseNodeApi.addWealthValidator(data);
    }
    createWalletsRecords(data, baseID) {
        return this._baseNodeApi.createWalletsRecords(data, baseID);
    }
    refreshWealthPtr() {
        return this._baseNodeApi.refreshWealthPtr();
    }
    getRequests(fromPk, toPk) {
        return this._baseNodeApi.getRequests(fromPk, toPk);
    }
    getAuthorizedData(recipientPk, encryptedData) {
        return this._baseNodeApi.getAuthorizedData(recipientPk, encryptedData);
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

    addWealthValidator(data) {
        return this._widgetRpc.call('walletManager.addWealthValidator', [data]).then(response => response.value);
    }
    createWalletsRecords(data, BaseId) {
      return this._widgetRpc.call('walletManager.createWalletsRecords', [data, BaseId]).then(response => response.value);
    }
    refreshWealthPtr() {
      return this._widgetRpc.call('walletManager.refreshWealthPtr', []).then(response => {
        const pointer = response.value;
        if ( typeof pointer === 'string' && pointer === 'validator did not verify anything yet'){
          throw new Error('validator did not verify anything yet');
        }
        return pointer
      });
    }
    getRequests(fromPk, toPk) {
      return this._widgetRpc.call('dataRequestManager.getRequests',[fromPk, toPk]).then(response => response.value);
    }
    getAuthorizedData(recipientPk, encryptedData) {
      return this._widgetRpc.call('profileManager.getAuthorizedData',[recipientPk, encryptedData]).then(response => response.value);
    }
}

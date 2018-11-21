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


    // offers CRUD
    getAllOffers() {
        return this._baseNodeApi.getAllOffers();
    }
    getMyOffers(id) {
        return this._baseNodeApi.getMyOffers(id);
    }
    saveOffer(offer) {
        return this._baseNodeApi.saveOffer(offer);
    }
    deleteOffer(id) {
      return this._baseNodeApi.deleteOffer(id);
    }

    deleteAccount() {
        return this._baseNodeApi.deleteAccount();
    }
    logout() {
      return this._baseNodeApi.logout();
    }


    // Search request
    createRequest (searchRequest) {
        return this._baseNodeApi.createRequest(searchRequest);
    }
    getMyRequests (id) {
        return this._baseNodeApi.getMyRequests(id);
    }
    getAllRequests () {
        return this._baseNodeApi.getAllRequests();
    }
    deleteRequest (id) {
        return this._baseNodeApi.deleteRequest(id);
    }

    // get matched results
    getSearchResultByRequestId(id) {
        return this._baseNodeApi
          .getSearchResultByRequestId(id);
    }
    grantAccessForOffer(searchResultId, pk, fields, priceId) {
      return this._baseNodeApi.grantAccessForOffer(searchResultId, pk, fields, priceId);
    }

    // cusomer private data

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

    // share data
    grantAccessForClient(clientPk, acceptedFields) {
      return this._baseNodeApi.grantAccessForClient(clientPk, acceptedFields);
    }

    
    /**
     * Returns list of fields requested for access by <me> from the client
     */
    getRequestedPermissionsByMeFromClient(requestedFromPk) {
        return this._baseNodeApi.getRequestedPermissionsByMeFromClient(requestedFromPk);
    }

    /**
     * Returns list of fields requested for access by the client from <me>
     */
    getRequestedPermissionsFromClientToMe(whoRequestedPk) {
        return this._baseNodeApi.getRequestedPermissionsFromClientToMe(whoRequestedPk);
    }

    /**
     * Returns list of fields that <client> authorized <me> to access
     */
    getGrantedPermissionsToMeFromClient(clientPk) {
        return this._baseNodeApi.getGrantedPermissionsToMeFromClient(clientPk);
    }

    /**
     * Returns list of fields that <me> authorized <client> to access
     */
    getGrantedPermissionsByMeToClient(clientPk) {
        return this._baseNodeApi.getGrantedPermissionsByMeToClient(clientPk);
    }
}

class BASENodeAPI {

  constructor(widgetRpc) {
        this._widgetRpc = widgetRpc;
    }

    // offers CRUD

    getAllOffers () {
        return this._widgetRpc.call('offerManager.getAllOffers', []).then(response => response.value);
    }
    getMyOffers (id) {
      return this._widgetRpc.call('offerManager.getOfferById', [id]).then(response => response.value);
    }
    saveOffer (offer) {
      return this._widgetRpc.call('offerManager.saveOffer', [offer]).then(response => response.value);
    }
    deleteOffer (id) {
      return this._widgetRpc.call('offerManager.deleteOffer', [id]).then(response => response.value);
    }


    // Search request

    createRequest (searchRequest) {
        return this._widgetRpc.call('searchManager.createRequest', [searchRequest]).then(response => response.value);
    }
    getMyRequests (id) {
        return this._widgetRpc.call('searchManager.getMyRequests', [id]).then(response => response.value);
    }
    getAllRequests () {
        return this._widgetRpc.call('searchManager.getAllRequests', []).then(response => response.value);
    }
    deleteRequest (id) {
        return this._widgetRpc.call('searchManager.deleteRequest', [id]).then(response => response.value);
    }

    // matched offers and requests

    getSearchResultByRequestId (id) {
        return this._widgetRpc.call('searchManager.getSearchResult', [id]).then(response => response.value);
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
    grantAccessForOffer(searchResultId, pk, fields, priceId) {
      return this._widgetRpc.call('dataRequestManager.grantAccessForOffer', [searchResultId, pk, fields, priceId]).then(response => response.value);
    }
    // share data by PK and keys
    grantAccessForClient (clientPk, acceptedFields) {
      return this._widgetRpc
        .call('dataRequestManager.grantAccessForClient', [clientPk, acceptedFields])
        .then(response => response.value);
    }
    getAuthorizedData(recipientPk, encryptedData) {
      return this._widgetRpc.call('profileManager.getAuthorizedData',[recipientPk, encryptedData]).then(response => response.value);
    }

    /**
     * Returns list of fields requested for access by <me> from the client
     */
    getRequestedPermissionsByMeFromClient(requestedFromPk) {
        return this._widgetRpc.call('dataRequestManager.getRequestedPermissions',[requestedFromPk]).then(response=>response.value);
    }

    /**
     * Returns list of fields requested for access by the client from <me>
     */
    getRequestedPermissionsFromClientToMe(whoRequestedPk) {
        return this._widgetRpc.call('dataRequestManager.getRequestedPermissionsToMe',[whoRequestedPk]).then(response=>response.value);
    }

    /**
     * Returns list of fields that <client> authorized <me> to access
     */
    getGrantedPermissionsToMeFromClient(clientPk) {
        return this._widgetRpc.call('dataRequestManager.getGrantedPermissions',[clientPk]).then(response=>response.value);
    }

    /**
     * Returns list of fields that <me> authorized <client> to access
     */
    getGrantedPermissionsByMeToClient(clientPk) {
        return this._widgetRpc.call('dataRequestManager.getGrantedPermissionsToMe',[clientPk]).then(response=>response.value);
    }
}

import IFrameRPC from './core/IFrameRPC.js';
import Settings from 'settings';
import DummyBASENodeAPI from './dummyBASENodeAPI';
import {onLoginMockData} from "./mock-data/userData";

export const UserPermissions = {
    EMAIL: 'email',
};

export class Widget {
    constructor(options) {
        this._settings = new Settings();
        this._widgetIframe = null;
        this._widgetRpc = null;
        this._baseNodeApi = null;
        this._testMode = options.testMode || false;
        this._testListening = {};
        this._verificationMessage = options.verificationMessage;
        this._buttonStyle = options.buttonStyle;
        this._isMnemonicScreen = (options.isMnemonicScreen === undefined || !! options.isMnemonicScreen);
        this._isCheckAuth = options.isCheckAuth || false;
        this._token = options.token || '';
        if (!this._verificationMessage || this._verificationMessage.length < 10) {
            throw new Error('Verification message length is 10 characters minimum');
        }
    }
    openSignInProgrammatically(){
        if (this._testMode) {
            return new Promise(function (resolve, reject) {
                this._testListening['SDK.onLogin'] && this._testListening['SDK.onLogin'](onLoginMockData);
                resolve(null);
                sessionStorage.setItem('IS_TEST_MODE_LOGIN', true);
            }.bind(this));
        } else {
            return this._widgetRpc.call('openSignIn').then(function (rpcCall) {
                return null;
            });
        }

    }
    openSignUpProgrammatically(){
        if (this._testMode) {
            return new Promise(function (resolve, reject) {
                this._testListening['SDK.onLogin'] && this._testListening['SDK.onLogin'](onLoginMockData);
                resolve(null);
                sessionStorage.setItem('IS_TEST_MODE_LOGIN', true);
            }.bind(this));
        } else {
            return this._widgetRpc.call('openSignUp').then(function (rpcCall) {
                return null;
            });
        }

    }

    insertLoginButton(cssSelector) {
        if (this._testMode) {
            this._baseNodeApi = new DummyBASENodeAPI(this._widgetRpc);
        } else {
            let iframeSrc = this._settings.widgetUrl + this._settings.widgetLocation;
            let additionalQueries = '';
            if (this._isCheckAuth) {
                additionalQueries += `?sso=`;
            }
            if (this._token) {
                additionalQueries = (additionalQueries.length) ? additionalQueries + `&token=` : `?token=`;
            }
            const iframe = document.createElement('iframe');
            iframe.frameBorder = '0';
            iframe.width = '300';
            iframe.height = '48';
            iframe.src = iframeSrc + additionalQueries;
            iframe.sandbox = 'allow-scripts allow-popups allow-same-origin allow-forms allow-modals';

            const el = document.querySelector(cssSelector);
            el.appendChild(iframe);
            this._widgetIframe = iframe;

            this._widgetRpc = new IFrameRPC(this._widgetIframe.contentWindow, this._settings.widgetUrl);
            this._widgetRpc.once('RPC.handshake').then(rpcCall => {
                rpcCall.respond(
                    this._widgetIframe.contentWindow,
                    this._settings.widgetUrl,
                    {   
                        verificationMessage: this._verificationMessage,
                        buttonStyle : this._buttonStyle,
                        testMode: this._testMode,
                        isMnemonicScreen: this._isMnemonicScreen,
                        isCheckAuth: this._isCheckAuth
                    }
                );
                this._baseNodeApi = new BASENodeAPI(this._widgetRpc);
            });
        }
    }

    waitForLogin() {
        console.warning('"waitForLogin" is deprecated, use "listenForLogin"');
        return this._widgetRpc.once('SDK.onLogin').then(function (rpcCall) {
            const account = rpcCall.args[0];
            return account;
        }.bind(this));
    }

    listenForInit(handler) {
        if (this._testMode) {
            handler('SDK.onInit');
            const IS_TEST_MODE_LOGIN = sessionStorage.getItem('IS_TEST_MODE_LOGIN');
            if (IS_TEST_MODE_LOGIN) {
                setTimeout(() => this.openSignInProgrammatically(), 300);
            }
        } else {
            this._widgetRpc.listen('SDK.onInit', function (rpcCall) {
                handler(rpcCall.methodName);
                rpcCall.respond(
                    this._widgetIframe.contentWindow,
                    this._settings.widgetUrl,
                    null
                );
            }.bind(this));
        }
    }

    waitForLogout() {
        console.warning('"waitForLogout" is deprecated, use "listenForLogout"');
        return this._widgetRpc.once('SDK.onLogout').then(function (rpcCall) {
            return null;
        }.bind(this));
    }

    listenForLogin(handler) {
        if (this._testMode) {
            this._testListening['SDK.onLogin'] = handler;
        } else {
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
    }

    listenForEvent(handler) {
        if (this._testMode) {
            this._testListening['SDK.onEvent'] = handler;
        } else {
            this._widgetRpc.listen('SDK.onEvent', function (rpcCall) {
                const event = rpcCall.args[0];
                handler(event);
                rpcCall.respond(
                    this._widgetIframe.contentWindow,
                    this._settings.widgetUrl,
                    null
                );
            }.bind(this));
        }
    }

    listenForRedirect(handler) {
        if (this._testMode) {
            return 'SDK.onRedirect';
        } else {
            this._widgetRpc.listen('SDK.onRedirect', function (rpcCall) {
                const url = rpcCall.args[0];
                handler(url);
                rpcCall.respond(
                    this._widgetIframe.contentWindow,
                    this._settings.widgetUrl,
                    null
                );
            }.bind(this));
        }
    }

    refreshToken(){
        if (this._testMode) {
            return 'SDK.refreshToken';
        } else {
            return this._widgetRpc.call('refreshToken').then(function (rpcCall) {
                return null;
            });
        }
    }

    listenForRefreshToken(handler) {
        if (this._testMode) {
            return 'SDK.onRefreshToken';
        } else {
            return this._widgetRpc.listen('SDK.onRefreshToken', function (rpcCall) {
                const token = rpcCall.args[0];
                handler(token);
            }.bind(this));
        }
    }

    listenForLogout(handler) {
        if (this._testMode) {
            return 'SDK.onLogout';
        } else {
            this._widgetRpc.listen('SDK.onLogout', function (rpcCall) {
                handler();
                rpcCall.respond(
                    this._widgetIframe.contentWindow,
                    this._settings.widgetUrl,
                    null
                );
            }.bind(this));
        }
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

    createAutoSignupUser(data) {
        return this._baseNodeApi.createAutoSignupUser(data);
    }


    // Search request
    createRequest (searchRequest) {
        return this._baseNodeApi.createRequest(searchRequest);
    }
    getSuggestionByQuery (query, size) {
        return this._baseNodeApi.getSuggestionByQuery(query, size);
    }
    createSearchResultByQuery (query, searchRequestId, page, size, interests, mode, filters) {
        return this._baseNodeApi.createSearchResultByQuery(query, searchRequestId, page, size, interests, mode, filters);
    }
    getCountBySearchRequestIds (searchRequestIds) {
        return this._baseNodeApi.getCountBySearchRequestIds(searchRequestIds);
    }
    cloneRequest (searchRequestIds) {
        return this._baseNodeApi.cloneRequest(searchRequestIds);
    }
    updateRequest (searchRequest) {
        return this._baseNodeApi.updateRequest(searchRequest);
    }
    copyOffersSearchToRequest(originToCopySearchRequestIds) {
        return this._baseNodeApi.copyOffersSearchToRequest(originToCopySearchRequestIds);
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
        return this._baseNodeApi.getSearchResultByRequestId(id);
    }
    getSearchResultByRequestIdForNotAuthorized(id) {
        return this._baseNodeApi.getSearchResultByRequestIdForNotAuthorized(id);
    }

    addEventToOfferSearch(id) {
        return this._baseNodeApi.addEventToOfferSearch(id);
    }

    grantAccessForOffer(searchResultId, pk, fields, priceId) {
        return this._baseNodeApi.grantAccessForOffer(searchResultId, pk, fields, priceId);
    }

    // reporitng feedback/action on SearchItem
    complainOnSearchItem (id) {
        return this._baseNodeApi.complainOnSearchItem(id)
    }

    rejectSearchItem (id) {
        return this._baseNodeApi.rejectSearchItem(id)
    }

    evaluateSearchItem (id) {
        return this._baseNodeApi.evaluateSearchItem(id)
    }

    claimPurchaseForSearchItem (id) {
        return this._baseNodeApi.claimPurchaseForSearchItem(id)
    }

    // cusomer private data

    deleteAccount() {
        return this._baseNodeApi.deleteAccount();
    }
    logout() {
      if (this._testMode) {
            sessionStorage.removeItem('IS_TEST_MODE_LOGIN');
            setTimeout(() => this._testListening['SDK.onEvent']({name: "logoutFinish"}), 1000);
      }
      return this._baseNodeApi.logout();
    }


    getData(keys) {
        return this._baseNodeApi.getData(keys);
    }
    updateData(data) {
        return this._baseNodeApi.updateData(data);
    }

    uploadFile(file, key) {
        return this._baseNodeApi.uploadFile(file, key);
    }

    /**
     * Download and decrypt saved file.
     *
     * @param {number} id file id for DB
     * @param {string} key same key filed where was saved FileMeta
     * @param {string} publicKey (optional) client public id. by default will used current user
     * @param {string} password (optional)  if already have password for decrypt file.
     *
     * @return {Promise<string>} decrypted file Base64
     */
    downloadFile(id, key, publicKey, password) {
        return this._baseNodeApi.downloadFile(id, key, publicKey, password);
    }

    getFileMetaWithGivenKey(key) {
        return this._baseNodeApi.getFileMetaWithGivenKey(key);
    }

    addWealthValidator(data) {
        return this._baseNodeApi.addWealthValidator(data);
    }
    createCryptoWalletsData(cryptoWallets) {
        return this._baseNodeApi.createCryptoWalletsData(cryptoWallets);
    }
    refreshWealthPtr() {
        return this._baseNodeApi.refreshWealthPtr();
    }

    getRequestsGraph(inputData) {
        return this._baseNodeApi.getRequestsGraph(inputData);
    }

    getRequests(fromPk, toPk) {
        return this._baseNodeApi.getRequests(fromPk, toPk);
    }
    getAuthorizedData(acceptedRequests) {
        return this._baseNodeApi.getAuthorizedData(acceptedRequests);
    }
    getAuthorizedEncryptionKeys(encryptedData) {
        return this._baseNodeApi.getAuthorizedEncryptionKeys(encryptedData);
    }

    // share data
    grantAccessForClient(clientPk, acceptedFields) {
      return this._baseNodeApi.grantAccessForClient(clientPk, acceptedFields);
    }


    getNodeVersion() {
        return this._baseNodeApi.getNodeVersion();
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

    /**
     * Returns the OfferSearches with related Offers list of provided user.
     * all args is optional
     */
    getUserOfferSearches(page, size, unique, searchIds, state, sort, interaction) {
        return this._baseNodeApi.getUserOfferSearches(page, size, unique, searchIds, state, sort, interaction);
    }

    /**
     *  all args is optional.
     * @param {Array<number>} offerIds
     * @param {Array<OfferResultAction>} states
     * @param {string} owner (by default current user)
     * @returns {Promise<Array<OfferInteraction>>}
     */
    getInteractions (offerIds, states, owner) {
        return this._baseNodeApi.getInteractions(offerIds, states, owner);
    }
    // external service manager

    callExternalService(serviceCall) {
        return this._baseNodeApi.callExternalService(serviceCall);
    }

    getExternalServices() {
        return this._baseNodeApi.getExternalServices();
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

    createAutoSignupUser (data) {
        return this._widgetRpc.call('searchManager.createAutoSignupUser', [data]).then(response => response.value);
    }

    // Search request
    createRequest (searchRequest) {
        return this._widgetRpc.call('searchManager.createRequest', [searchRequest]).then(response => response.value);
    }
    getSuggestionByQuery (query, size) {
        return this._widgetRpc.call('searchManager.getSuggestionByQuery', [query, size])
            .then(response => response.value);
    }
    /**
     *
     * @param {string} query
     * @param {number} searchRequestId
     * @param {number} page
     * @param {number} size
     * @param {string[]} interests
     * @param {string} mode 'must' or 'prefer'
     * @param {object} filters e.g. "{ megaType: ['product','store'], color: ['red', 'yellow'], price: ['100-200', '500-1000']}""
     */
    createSearchResultByQuery (query, searchRequestId, page, size, interests, mode, filters) {
        console.log('base-auth-sdk send filter', filters);
        return this._widgetRpc.call('searchManager.createSearchResultByQuery', [query, searchRequestId, page, size, interests, mode, filters])
            .then(response => response.value);
    }
    getCountBySearchRequestIds (searchRequestIds) {
        return this._widgetRpc.call('searchManager.getCountBySearchRequestIds', [searchRequestIds])
            .then(response => response.value);
    }
    cloneRequest (searchRequestIds) {
        return this._widgetRpc.call('searchManager.cloneRequest', [searchRequestIds]).then(response => response.value);
    }
    updateRequest (searchRequest) {
        return this._widgetRpc.call('searchManager.updateRequest', [searchRequest]).then(response => response.value);
    }
    copyOffersSearchToRequest (originToCopySearchRequestIds) {
        return this._widgetRpc.call('searchManager.copyOffersSearchToRequest', [originToCopySearchRequestIds]).then(response => response.value);
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

    addEventToOfferSearch (id) {
        return this._widgetRpc.call('searchManager.addEventToOfferSearch', [id]).then(response => response.value);
    }

    complainOnSearchItem (id) {
        return this._widgetRpc.call('searchManager.complainToSearchItem', [id]).then(response => response.value);
    }

    rejectSearchItem (id) {
        return this._widgetRpc.call('searchManager.rejectSearchItem', [id]).then(response => response.value);
    }

    evaluateSearchItem (id) {
        return this._widgetRpc.call('searchManager.evaluateSearchItem', [id]).then(response => response.value);
    }

    claimPurchaseForSearchItem (id) {
        return this._widgetRpc.call('searchManager.claimPurchaseForSearchItem', [id]).then(response => response.value);
    }


    deleteAccount () {
        return this._widgetRpc.call('accountManager.unsubscribe', []).then(response => response.value);
    }
    logout () {
        return this._widgetRpc.call('logout', []);
    }

    getData(keys) {
        return this._widgetRpc.call('profileManager.getData', [keys]).then(response => response.value);
    }
    updateData(data) {
        return this._widgetRpc.call('profileManager.updateData', [data]).then(response => response.value);
    }

    uploadFile(file, key) {
        return this._widgetRpc.call('profileManager.uploadFile', [file, key]).then(response => response.value);
    }

    downloadFile(id, key, publicKey, password) {
        return this._widgetRpc.call('profileManager.downloadFile', [id, key, publicKey, password])
            .then(response => response.value);
    }

    getFileMetaWithGivenKey(key) {
        return this._widgetRpc.call('profileManager.getFileMetaWithGivenKey', [key]).then(response => response.value);
    }

    addWealthValidator(data) {
        return this._widgetRpc.call('walletManager.addWealthValidator', [data]).then(response => response.value);
    }

    createCryptoWalletsData(cryptoWallets) {
      return this._widgetRpc.call('walletManager.createCryptoWalletsData', [cryptoWallets]).then(response => response.value);
    }

    getRequestsGraph(inputData) {
        return this._widgetRpc.call('dataRequestManager.getRequestsGraph',[inputData]).then(response => response.value);
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
    getAuthorizedData(acceptedRequests) {
      return this._widgetRpc.call('profileManager.getAuthorizedData',[acceptedRequests]).then(response => response.value);
    }

    getAuthorizedEncryptionKeys(encryptedData) {
        return this._widgetRpc.call('profileManager.getAuthorizedEncryptionKeys',[encryptedData]).then(response => response.value);
      }

    getNodeVersion() {
        return this._widgetRpc.call('nodeVersion',[]).then(response=>response.value);
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

    getSearchResultByRequestIdForNotAuthorized (id) {
      return this._widgetRpc.call('searchManager.getSearchResultForNotAuthorized', [id]).then(response => response.value);
    }

    /**
     *
     * @param {number} page
     * @param {number} size
     * @param {boolean} unique
     * @param {Array<number>} searchIds
     * @param {Array<OfferResultAction>} state
     * @param {SortOfferSearch} sort - type of sorting for OfferSearch it's a string 'rank' or ''updatedAt or undefined
     * @param {boolean} interaction add sub information with interaction by owner and offerId
     */
    getUserOfferSearches (page, size, unique, searchIds, state, sort, interaction) {
      return this._widgetRpc
          .call('searchManager.getUserOfferSearches', [page, size, unique, searchIds, state, sort, interaction])
          .then(response => response.value);
    }

    /**
     *  all args is optional.
     * @param {Array<number>} offerIds
     * @param {Array<OfferResultAction>} states
     * @param {string} owner (by default current user)
     * @returns {Promise<Array<OfferInteraction>>}
     */
    getInteractions (offerIds, states, owner) {
        return this._widgetRpc
            .call('searchManager.getInteractions', [offerIds, states, owner])
            .then(response => response.value);
    }

    /**
     * Returns list of fields that <me> authorized <client> to access
     */
    getGrantedPermissionsByMeToClient(clientPk) {
        return this._widgetRpc.call('dataRequestManager.getGrantedPermissionsToMe',[clientPk]).then(response=>response.value);
    }

    // external service manager

    callExternalService(serviceCall) {
        return this._widgetRpc.call('externalServicesManager.callExternalService',[serviceCall])
            .then(response=>response.value);
    }

    getExternalServices() {
        return this._widgetRpc.call('externalServicesManager.getExternalServices',[])
            .then(response=>response.value);
    }
}

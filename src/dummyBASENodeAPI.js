import {MockUserOfferSearches} from "./mock-data/userOfferSearches";
import {onLoginMockData, requestIds, userData} from "./mock-data/userData";
import {searchResultByQuery} from "./mock-data/searchResultByQuery";

export default class DummyBASENodeAPI {
    constructor(widgetRpc) {
        this._widgetRpc = widgetRpc;
    }

    resolveTestData(data) {
        return new Promise((resolve, reject) => {
            resolve(data);
        })
    }

    // offers CRUD
    getAllOffers() {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('offerManager.getAllOffers', []).then(response => response.value);
    }

    getMyOffers(id) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('offerManager.getOfferById', [id]).then(response => response.value);
    }

    saveOffer(offer) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('offerManager.saveOffer', [offer]).then(response => response.value);
    }

    deleteOffer(id) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('offerManager.deleteOffer', [id]).then(response => response.value);
    }

    createAutoSignupUser(data) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.createAutoSignupUser', [data]).then(response => response.value);
    }

    // Search request
    createRequest(searchRequest) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.createRequest', [searchRequest]).then(response => response.value);
    }

    getSuggestionByQuery(query, size) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.getSuggestionByQuery', [query, size])
        //     .then(response => response.value);
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
    createSearchResultByQuery(query, searchRequestId, page, size, interests, mode, filters) {
        if (!filters) {
            const result = this.updateOfferTagToMap(searchResultByQuery.searchResult);
            return this.resolveTestData(result);
        } else if (filters.megaType && filters.megaType.length === 1) {
            let data;
            switch (filters.megaType[0]) {
                case 'store':
                    data = this.updateOfferTagToMap(searchResultByQuery.store);
                    break;
                case 'promocode':
                    data = this.updateOfferTagToMap(searchResultByQuery.promocode);
                    break;
                case 'product':
                    data = this.updateOfferTagToMap(searchResultByQuery.product);
                    break;
                case 'survey':
                    data = this.updateOfferTagToMap(searchResultByQuery.survey);
                    break;
                case 'game':
                    data = this.updateOfferTagToMap(searchResultByQuery.game);
                    break;
                case 'bonus':
                    data = this.updateOfferTagToMap(searchResultByQuery.bonus);
                    break;
            }

            return this.resolveTestData(data);
        }

        // return this._widgetRpc.call('searchManager.createSearchResultByQuery', [query, searchRequestId, page, size, interests, mode, filters])
        //     .then(response => response.value);
    }

    getCountBySearchRequestIds(searchRequestIds) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.getCountBySearchRequestIds', [searchRequestIds])
        //     .then(response => response.value);
    }

    cloneRequest(searchRequestIds) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.cloneRequest', [searchRequestIds]).then(response => response.value);
    }

    updateRequest(searchRequest) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.updateRequest', [searchRequest]).then(response => response.value);
    }

    copyOffersSearchToRequest(originToCopySearchRequestIds) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.copyOffersSearchToRequest', [originToCopySearchRequestIds]).then(response => response.value);
    }

    getMyRequests(id) {
        if (id === onLoginMockData.publicKey) {
            return this.resolveTestData(requestIds);
        }
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.getMyRequests', [id]).then(response => response.value);
    }

    getAllRequests() {
        return this._widgetRpc.call('searchManager.getAllRequests', []).then(response => response.value);
    }

    deleteRequest(id) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.deleteRequest', [id]).then(response => response.value);
    }

    // matched offers and requests

    getSearchResultByRequestId(id) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.getSearchResult', [id]).then(response => response.value);
    }

    addEventToOfferSearch(id) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.addEventToOfferSearch', [id]).then(response => response.value);
    }

    complainOnSearchItem(id) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.complainToSearchItem', [id]).then(response => response.value);
    }

    rejectSearchItem(id) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.rejectSearchItem', [id]).then(response => response.value);
    }

    evaluateSearchItem(id) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.evaluateSearchItem', [id]).then(response => response.value);
    }

    claimPurchaseForSearchItem(id) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.claimPurchaseForSearchItem', [id]).then(response => response.value);
    }


    deleteAccount() {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('accountManager.unsubscribe', []).then(response => response.value);
    }

    logout() {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('logout', []);
    }

    getData(keys) {
        return this.resolveTestData(userData);
        // return this._widgetRpc.call('profileManager.getData', [keys]).then(response => response.value);
    }

    updateData(data) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('profileManager.updateData', [data]).then(response => response.value);
    }

    uploadFile(file, key) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('profileManager.uploadFile', [file, key]).then(response => response.value);
    }

    downloadFile(id, key, publicKey, password) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('profileManager.downloadFile', [id, key, publicKey, password])
        //     .then(response => response.value);
    }

    getFileMetaWithGivenKey(key) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('profileManager.getFileMetaWithGivenKey', [key]).then(response => response.value);
    }

    addWealthValidator(data) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('walletManager.addWealthValidator', [data]).then(response => response.value);
    }

    createCryptoWalletsData(cryptoWallets) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('walletManager.createCryptoWalletsData', [cryptoWallets]).then(response => response.value);
    }

    getRequestsGraph(inputData) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('dataRequestManager.getRequestsGraph', [inputData]).then(response => response.value);
    }

    getRequests(fromPk, toPk) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('dataRequestManager.getRequests', [fromPk, toPk]).then(response => response.value);
    }

    grantAccessForOffer(searchResultId, pk, fields, priceId) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('dataRequestManager.grantAccessForOffer', [searchResultId, pk, fields, priceId]).then(response => response.value);
    }

    // share data by PK and keys
    grantAccessForClient(clientPk, acceptedFields) {
        return this.resolveTestData([]);
        // return this._widgetRpc
        //     .call('dataRequestManager.grantAccessForClient', [clientPk, acceptedFields])
        //     .then(response => response.value);
    }

    getAuthorizedData(acceptedRequests) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('profileManager.getAuthorizedData', [acceptedRequests]).then(response => response.value);
    }

    getAuthorizedEncryptionKeys(encryptedData) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('profileManager.getAuthorizedEncryptionKeys', [encryptedData]).then(response => response.value);
    }

    /**
     * Returns list of fields requested for access by <me> from the client
     */
    getRequestedPermissionsByMeFromClient(requestedFromPk) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('dataRequestManager.getRequestedPermissions', [requestedFromPk]).then(response => response.value);
    }

    /**
     * Returns list of fields requested for access by the client from <me>
     */
    getRequestedPermissionsFromClientToMe(whoRequestedPk) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('dataRequestManager.getRequestedPermissionsToMe', [whoRequestedPk]).then(response => response.value);
    }

    /**
     * Returns list of fields that <client> authorized <me> to access
     */
    getGrantedPermissionsToMeFromClient(clientPk) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('dataRequestManager.getGrantedPermissions', [clientPk]).then(response => response.value);
    }

    getSearchResultByRequestIdForNotAuthorized(id) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('searchManager.getSearchResultForNotAuthorized', [id]).then(response => response.value);
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
    getUserOfferSearches(page, size, unique, searchIds, state, sort, interaction) {
        const data = this.updateOfferTagToMap(MockUserOfferSearches);
        return this.resolveTestData(data);
        // return this._widgetRpc
        //     .call('searchManager.getUserOfferSearches', [page, size, unique, searchIds, state, sort, interaction])
        //     .then(response => response.value);
    }

    updateOfferTagToMap(data) {
        data.content = this.shuffle(data.content);
        data.content.forEach(mainOffer => {
            mainOffer.offer.tags = new Map(Object.entries(mainOffer.offer.tags))
        });

        return data;
    }

    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    /**
     *  all args is optional.
     * @param {Array<number>} offerIds
     * @param {Array<OfferResultAction>} states
     * @param {string} owner (by default current user)
     * @returns {Promise<Array<OfferInteraction>>}
     */
    getInteractions(offerIds, states, owner) {
        return this._widgetRpc
            .call('searchManager.getInteractions', [offerIds, states, owner])
            .then(response => response.value);
    }

    /**
     * Returns list of fields that <me> authorized <client> to access
     */
    getGrantedPermissionsByMeToClient(clientPk) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('dataRequestManager.getGrantedPermissionsToMe', [clientPk]).then(response => response.value);
    }

    // external service manager

    callExternalService(serviceCall) {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('externalServicesManager.callExternalService', [serviceCall])
        //     .then(response => response.value);
    }

    getExternalServices() {
        return this.resolveTestData([]);
        // return this._widgetRpc.call('externalServicesManager.getExternalServices', [])
        //     .then(response => response.value);
    }
}

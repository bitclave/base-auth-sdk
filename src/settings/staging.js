export default class Settings {
    constructor() {
        this._widgetUrl = 'https://base-auth-frontend-staging.herokuapp.com/';
        this._widgetLocation = 'auth/widget';

        if (this._widgetUrl[this._widgetUrl.length - 1] !== '/') {
            this._widgetUrl += '/';
        }
    }

    get widgetUrl() {
        return this._widgetUrl;
    }

    get widgetLocation() {
        return this._widgetLocation;
    }
}

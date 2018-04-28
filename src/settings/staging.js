export default class Settings {
    constructor(options) {
        options = options || {};
        this._widgetUrl = options.widgetUrl || 'https://base-auth-staging.herokuapp.com/';
        this._widgetLocation = 'auth-widget/';

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

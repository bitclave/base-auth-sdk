export default class Settings {
    constructor() {
        this._widgetUrl = 'http://localhost:4200/';
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

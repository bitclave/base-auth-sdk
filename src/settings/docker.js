export default class Settings {
    constructor() {
        this._widgetUrl = process.env.WIDGET_URL;
        this._widgetLocation = process.env.WIDGET_LOCATION;

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

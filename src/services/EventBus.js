export default class EventBus {

    static getInstance() {
        if (typeof EventBus.instance === 'object') {
            return EventBus.instance;
        }
        return new EventBus();
    }

    constructor() {
        if (typeof EventBus.instance === 'object') {
            return EventBus.instance;
        }
        EventBus.instance = this;
        this.eventListeners = {};
    }

    fireEvent(eventName, data) {
        let listeners = this.eventListeners[eventName];
        if (Array.isArray(listeners)) {
            listeners.forEach(listener => {
                if (typeof listener === 'function') {
                    listener(data);
                }
            })
        }
    }

    addListener(eventName, listener) {
        let listeners = this.eventListeners[eventName];
        if (Array.isArray(listeners)) {
            listeners.push(listener);
        } else {
            this.eventListeners[eventName] = [listener];
        }
    }

    removeListener(listener) {
        Object.keys(this.eventListeners).forEach(eventName => {
            let listeners = this.eventListeners[eventName];
            this._remove(listeners, listener);
            if (listeners.length === 0) {
                delete this.eventListeners[eventName];
            }
        })
    }

    _remove(array, item) {
        if (!array) return;
        for (let i = 0, l = array.length; i < l; i++) {
            if (item === array[i]) array.splice(i, 1);
        }
    }

}

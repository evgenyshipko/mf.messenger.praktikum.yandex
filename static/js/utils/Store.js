class Store {
    constructor(initialState = {}) {
        if (Store.__instance) {
            return Store.__instance;
        }
        this.subscribers = {};
        this.state = this.makeStateProxy(initialState);
        Store.__instance = this;
    }
    makeStateProxy(state) {
        const self = this;
        return new Proxy((state), {
            set: function (state, propertyName, value) {
                console.log('SET FUNC');
                if (typeof propertyName !== 'symbol') {
                    state[propertyName] = value;
                    console.log(`stateChange: ${String(propertyName)}: ${value}`);
                    self.dispatch(propertyName, state);
                }
                return true;
            }
        });
    }
    dispatch(propertyName, state) {
        if (this.subscribers[propertyName]) {
            this.subscribers[propertyName].forEach(subscriber => {
                subscriber(state);
            });
        }
    }
    get content() {
        return this.state;
    }
    subscribe(propertyName, func) {
        if (this.subscribers[propertyName]) {
            this.subscribers[propertyName].push(func);
        }
        else {
            this.subscribers[propertyName] = [func];
        }
    }
    setState(value) {
        Object.keys(value).forEach((key) => {
            // я с ним замучался, если подскажите - буду благодарен
            // @ts-ignore
            this.state[key] = value[key];
        });
    }
}
export default Store;
//# sourceMappingURL=Store.js.map
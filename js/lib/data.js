(function () {
    function Data() {
        Object.defineProperty(this.cache = {}, 0, {
            get: function () {
                return {};
            }
        });

        this.expando = Q.expando + Data.uuid++;
    }

    Data.prototype = {
        key: function (owner) {
            if (!Data.accepts(owner)) {
                return;
            }

            var descriptor = {},
                unlock = owner[this.expando];

            if (!unlock) {
                unlock = Data.uuid++;

                try {
                    descriptor[this.expando] = {value: unlock};
                    Object.defineProperty(owner, descriptor);

                } catch (err) {
                    descriptor[this.expando] = unlock;
                    Q.extend(owner, descriptor);
                }
            }

            if (!this.cache[unlock]) {
                this.cache[unlock] = {};
            }

            return unlock;
        },

        set: function (owner, data, value) {
            var prop,
                unlock = this.key(owner),
                cache = this.cache[unlock];

            if (typeof data === "string") {
                cache[data] = value;

            } else {
                if (Q.isEmptyObject(cache)) {
                    Q.extend(cache, data);
                } else {
                    for (prop in data) {
                        cache[prop] = data[prop];
                    }
                }
            }

            return cache;
        },

        get: function (owner, key) {
            var cache = this.cache[this.key(owner)];
            return key === "undefined" ? cache : cache[key];
        },

        remove: function (owner, key) {
            var cache = this.cache[this.key(owner)];

            if (typeof key === "string") {
                delete cache[key];
            } else if (Q.isArray(key)) {
                Q.each(key, function (_, v) {
                    if (v in cache) {
                        delete cache[v];
                    }
                })
            }

            return cache;
        }
    }

    Data.uuid = 1;

    Data.accepts = Q.accepts;
})();

var listeners = [];
var Observer = (function () {

    function add (obj) {
        var listenerIndexOf = listeners.findIndex(function (item) {
            return obj.event === item.event && obj.listener === item.listener
        });
        if (-1 === listenerIndexOf) {
            listeners.push(obj);
        }
    }

    function listenTo (event, callback, notifier, listener, once) {
        if ('string' !== typeof event) {
            throw new TypeError('Specified event type has to be string.');
        }
        if (undefined !== notifier && !(notifier instanceof Observer)) {
            throw new TypeError('Specified notifier type has to be instance of Observer.');
        }

        add({
            listener: listener,
            notifier: notifier,
            event: event,
            once: once,
            callback: callback
        });
    }

    function Observer () {}
    /**
     * Enables listening on specified event. When event is notified, callback function will be triggered.
     *
     * @param {string}      event       Name of event on which object will be listening
     * @param {function}    callback    Callback function triggered after event is notified
     * @param {Observer}    notifier    Optional parameter. Object (instance of Observer) on which object that called
     *                                  listen method will listen on events. Whenever specified event is notified
     *                                  callback function will be triggered only if event was notified by specified
     *                                  notifier.
     */
    Observer.prototype.listen = function (event, callback, notifier) {
        var listener = this;

        listenTo(event, callback, notifier, listener, false);
    };
    /**
     * Enables listening on specified event. When event is notified, callback function will be triggered. Object reacts
     * only once for notify of specified event, further notifications are ignored.
     *
     * @param {string}      event       Name of event on which object will be listening
     * @param {function}    callback    Callback function triggered after event is notified
     * @param {Observer}    notifier    Optional parameter. Object (instance of Observer) on which object that called
     *                                  listen method will listen on events. Whenever specified event is notified
     *                                  callback function will be triggered only if event was notified by specified
     *                                  notifier.
     */
    Observer.prototype.listenOnce = function (event, callback, notifier) {
        var listener = this;

        listenTo(event, callback, notifier, listener, true);
    };
    /**
     * Disables listening on specified event.
     *
     * @param {string|undefined}    event       Name of event on which object stops listening
     * @param {Observer}            notifier    Optional parameter. Object (instance of Observer) on which object that
     *                                          called stopListening method will stop listening on events. Object will
     *                                          stop listening on specified event from specified notifier, only if
     *                                          listen method was called with the same notifier.
     */
    Observer.prototype.stopListening = function (event, notifier) {
        if ('string' !== typeof event && undefined !== event) {
            throw new TypeError('Specified event type has to be string.');
        }
        if (undefined !== notifier && !(notifier instanceof Observer)) {
            throw new TypeError('Specified notifier type has to be instance of Observer.');
        }
        var listener = this;

        listeners = listeners.filter(function (entry) {
            var doesListenerMatch = listener === entry.listener,
                doesEventMatch = event === entry.event,
                doesNotifierMatch = notifier === entry.notifier;

            if (event && !notifier) {
                return !(doesListenerMatch && doesEventMatch);
            }
            if (!event && notifier) {
                return !(doesListenerMatch && doesNotifierMatch);
            }
            if (event && notifier) {
                return !(doesListenerMatch && doesNotifierMatch && doesEventMatch);
            }
            return !doesListenerMatch;
        });
    };
    /**
     * Notifies specific event with additional data.
     *
     * @param {string}  event   Name of event on which object stops listening
     * @param {*}       data    Data passed along with notification. Empty object by default.
     */
    Observer.prototype.notify = function (event, data) {
        if ('string' !== typeof event) {
            throw new TypeError('Specified event type has to be string.');
        }

        var notifier = this;

        data = data || {};

        listeners = listeners.filter(function (entry ) {
            if (entry.event === event) {
                if (entry.notifier && entry.notifier !== notifier) {
                    return true;
                }
                entry.callback.call(entry.listener, data);

                if (entry.once) {
                    return false;
                }
            }
            return true;
        });
    };

    return Observer;
})();

module.exports = Observer;
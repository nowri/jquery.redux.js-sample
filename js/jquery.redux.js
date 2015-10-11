/*! jquery.redux.js | Copyright (c) 2015 nowri | The MIT License (MIT) */
(function(factory) {
    if(typeof exports === 'object') {
        factory(require('jquery'));
    } else if(typeof define === 'function' && define.amd) {
        define(['jquery.redux'], factory);
    } else {
        factory(jQuery);
    }
}(function($) {
    var newActions,
        store,
        triggerKeys,
        isInit;
    $.reduxInit = function(_actions, _store) {
        if(isInit) {
            throw new Error("jquery.redux still initialized");
        }
        isInit = true;
        triggerKeys = [];
        newActions = {};
        store = _store;
        $.each(_actions, function(key, action) {
            triggerKeys.push(key);
            newActions[key] = function() {
                var act;
                act = action.apply(this, arguments);
                if(typeof act === "function") {
                    act(store.dispatch, store.getState);
                } else {
                    store.dispatch(act);
                }
            }
        });
        return $;
    };
    $.fn.redux = function(type) {
        var $elems = this;
        var unsubscribe = $elems.data("__reduxUnsubscribe__");
        if((type === "on" || type === "off") && typeof unsubscribe === "function") {
            unsubscribe();
            $.removeData($elems, "__reduxUnsubscribe__");
        }
        if(type === "on") {
            unsubscribe = store.subscribe(function() {
                $elems.trigger("reduxChange", [store.getState()]);
            });
            $elems.data("__reduxUnsubscribe__", unsubscribe);
            triggerKeys.forEach(function(key) {
                $elems.on("redux:" + key, function() {
                    newActions[key].apply(null, Array.prototype.slice.call(arguments, 1));
                });
            });
        } else if(type === "off") {
            triggerKeys.forEach(function(key) {
                $elems.off("redux:" + key, "**");
            });
        }
        return this;
    };
}));
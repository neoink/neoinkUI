import jQuery from "./js/vendor/jquery.min.js";
import Tab from "./js/tab";

//__Import jQuery in global scope
window.jQuery = jQuery;

"use strict";

/**
 * Boostrap UI
 * @param scope {String} => DOM selector
 * @returns {{tab: tab}}
 */
let nk = function(scope) {

    /**
     * Initialize Tab Module
     * @param parameter {Object} => parameters
     * @returns {Tab}
     */
    function tab(parameter = {}) {
        return new Tab({
            scope     : scope,
            parameter : parameter
        });
    }

    return {
        tab : tab
    }

};

//__Export UI in global scope
window.nk = nk;
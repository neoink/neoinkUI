import jQuery from "./js/vendor/jquery.min.js";
import Tab from "./js/tab";

//__Import jQuery in global scope
window.jQuery = jQuery;

"use strict";

/**
 * Boostrap UI
 * @param {String} scope DOM selector
 * @returns {{tab: tab}} functions of module
 */
window.nk = function(scope) {
    /**
     * Initialize Tab Module
     * @param {Object} parameter module parameters
     * @returns {Tab} instance of TabModule
     */
    function tab(parameter = {}) {
        return new Tab({
            scope     : scope,
            parameter : parameter
        });
    }

    return {
        tab : tab
    };

};
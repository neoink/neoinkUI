import jQuery from "./js/vendor/jquery.min.js";
import TabModule from "./js/tab.js";

window.jQuery = jQuery;

const nk = nk || {};
nk.version = "1.0.0";

nk.tab = function(elem) {
    return new TabModule(elem);
};
window.nk = nk;

console.time('test');
nk.tab({
    scope : '#tabs'
});

console.timeEnd('test');
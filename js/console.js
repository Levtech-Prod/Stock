// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/*// prevent chrome js console execution
//http://kspace.in/blog/2013/02/22/disable-javascript-execution-from-console/
(function(){
    var _z = console;
    Object.defineProperty( window, "console", {
    get : function(){
        if( _z._commandLineAPI ){
        throw "Sorry, Can't exceute scripts!";
            }
        return _z;
    },
    set : function(val){
        _z = val;
    }
    });

})();
*/


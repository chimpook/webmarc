"use strict";

var a = 'a';
var b = 'b';

(function (a, b) {

    var Greetr = function() {
        return new Greetr.init();
    };

    Greetr.prototype = {
        test: function() {
            console.log('test');
            console.log(window);
            console.log($);
            console.log(a,b);
        }
    };

    Greetr.init = function() {

        var self = this;

    };
   
    Greetr.init.prototype = Greetr.prototype;

    window.Greetr = window.G$ = Greetr;


})(a, b);
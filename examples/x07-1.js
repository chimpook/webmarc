/**
 * Example 7.
 * Window Border example
 */

;"use strict";

var app = {

    wc: new Webcurses('Example 7. Window Border example'),

    start: function () {
        var self = this;
        self.wc.initscr($("#container"));
        //self.wc.refresh();
    }
};

$(document).ready(function () {
    app.start();
});
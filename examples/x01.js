/**
 * Example 1.
 * The Hello World !!! Program
 */

;"use strict";

var app = {

    wc: new Webcurses('Example 1. The Hello World !!! Program.'),

    start: function () {
        var self = this;
        self.wc.initscr($("#container"));
        self.wc.printw("Hello World !!!");
        self.wc.refresh();
    }
};

$(document).ready(function () {
    app.start();
});
/**
 * Example 1.
 * The Hello World !!! Program
 */

;"use strict";

var app = {

    x: new Webcurses('Example 1. The Hello World !!! Program.'),

    start: function () {
        var self = this;
        self.x.initscr($("#container"));
        self.x.printw("Hello World !!!");
        self.x.refresh();
        self.x.makebacklink("../index.html");
    }
};

$(document).ready(function () {
    app.start();
});
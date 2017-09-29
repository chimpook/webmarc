/**
 * Example 6.
 * Chgat() Usage example
 */

;"use strict";

var app = {

    wc: new Webcurses('Example 6. Chgat() Usage example'),

    start: function () {
        var self = this;
        self.wc.initscr($("#container"));
        self.wc.init_pair(1, self.wc.COLOR_CYAN, self.wc.COLOR_BLACK);
        self.wc.printw("A Big string which i didn't care to type fully ");
        self.wc.mvchgat(0, 0, -1, self.wc.A_BLINK, 1);
        self.wc.refresh();
    }
};

$(document).ready(function () {
    app.start();
});
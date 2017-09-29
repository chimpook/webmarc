/**
 * Example 3.
 * A Simple printw example
 */

;"use strict";

var app = {

    wc: new Webcurses('Example 3. A Simple printw example'),

    start: function() {
        var self = this;
        self.wc.initscr($("#container"));
        self.process();
    },

    process: function(c) {
        var self = this;
        var mesg = "Just a string";
        var str;
        var maxyx = {row: 0, col: 0};
        maxyx = self.wc.getmaxyx();

        self.wc.mvprintw(maxyx.row/2, (maxyx.col - mesg.length)/2, mesg);
        self.wc.mvprintw(maxyx.row - 2, 0,
            "This screen has " + maxyx.row + " rows and "+maxyx.col+" columns\n");
        self.wc.printw("Try resizing your window (if possible, but not) and then run this program again");
        self.wc.refresh();
    }
};

$(document).ready(function () {
    app.start();
});
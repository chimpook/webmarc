/**
 * Example 4.
 * A Simple scanw example
 */

;"use strict";

var app = {

    buffer: '',

    wc: new Webcurses('Example 4. A Simple scanw example'),

    start: function() {
        var self = this;
        var prompt = "Enter a string: ";

        self.wc.initscr($("#container"));
        var maxyx = self.wc.getmaxyx();

        self.wc.mvprintw(maxyx.row/2, (maxyx.col - prompt.length)/2, prompt);
        self.wc.refresh();
        self.wc.getstr();
        self.process();
    },

    process: function() {
        var self = this;
        $(document).keypress(function(event) {
            switch (self.wc.status) {
                case 'getstr':
                    if (event.which === 13) {
                        self.wc.status = '';
                        self.wc.mvprintw(self.wc.LINES - 2, 0, "You Entered: " + self.buffer);
                    } else {
                        self.buffer += String.fromCharCode(event.which);
                        self.wc.printw(String.fromCharCode(event.which));
                    }
                    self.wc.refresh();
                    break;
                default:
                    break;
            }
            event.preventDefault();
        });
    }
};

$(document).ready(function () {
    app.start();
});

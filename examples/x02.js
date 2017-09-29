/**
 * Example 2.
 * Initialization Function Usage example
 */

;"use strict";

var app = {

    wc: new Webcurses('Example 2. Initialization Function Usage example'),

    start: function() {
        var self = this;
        self.wc.initscr($("#container"));
        self.wc.printw("Type any character to see it in");
        self.wc.attron(self.wc.A_BOLD);
        self.wc.printw(" bold ");
        self.wc.attroff(self.wc.A_BOLD);
        self.wc.printw("and thin one by one.\n\n=>");
        self.wc.refresh();
        self.process();
    },

    process: function() {
        var self = this;

        $(document).keypress(function(event) {
            self.wc.printw(String.fromCharCode(event.which));
            self.wc.refresh();
            self.toggle_width();
            event.preventDefault();
        });
    },

    /**
     * Переключение толщины шрифта
     */
    toggle_width: function() {

        var self = this;

        if (self.wc.A_BOLD) {
            self.wc.attroff(self.wc.A_BOLD);
        } else {
            self.wc.attron(self.wc.A_BOLD);
        }
    }
};

$(document).ready(function () {
    app.start();
});
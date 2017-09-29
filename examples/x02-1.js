"use strict";

/**
 * Example of attron and attroff and keyboard processing
 */

$(document).ready(function () {

    x.initscr($("#container"));

    x.process();

    x.printw("Type any character to see it in");

    x.attron(x.A_BOLD);
    x.printw(" bold ");
    x.attroff(x.A_BOLD);

    x.printw("and thin one by one.\n\n=>");

    x.refresh();

});

//var x2 = Object.create(webcurses);

var x = new Webcurses('Example 02');

x.process = function () {
    var self = this;
    $(document).keypress(function(event) {
        //console.log(event.which);
        if (self.A_BOLD) {
            self.attroff(self.A_BOLD);
        } else {
            self.attron(self.A_BOLD);
        }
        self.printw(String.fromCharCode(event.which));
        self.refresh();
        event.preventDefault();
    });

};

"use strict";

/**
 * Example of attron and attroff and keyboard processing
 */

$(document).ready(function () {

    x2.initscr($("#container"));

    x2.process();

    x2.printw("Type any character to see it in");

    x2.attron('A_BOLD');
    x2.printw(" bold ");
    x2.attroff('A_BOLD');

    x2.printw("and thin one by one.\n\n=>");

    x2.refresh();

});

//var x2 = Object.create(webcurses);

var x2 = new Webcurses('Example 2');

x2.process = function () {
    var self = this;
    $(document).keypress(function(event) {
        //console.log(event.which);
        if (self.A_BOLD) {
            self.attroff('A_BOLD');
        } else {
            self.attron('A_BOLD');
        }
        self.printw(String.fromCharCode(event.which));
        self.refresh();
        event.preventDefault();
    });

};

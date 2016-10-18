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

var x2 = {

    __proto__: webcurses,

    process: function () {
        $(document).keypress(function(event) {
            console.log(event.which);
            if (x2.A_BOLD) {
                x2.attroff('A_BOLD');
            } else {
                x2.attron('A_BOLD');
            }
            x2.printw(String.fromCharCode(event.which));
            x2.refresh();
            event.preventDefault();
        });
    }

};
